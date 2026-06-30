-- Volunteer Wallets
CREATE TABLE IF NOT EXISTS user_wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_wallets_select_own" ON user_wallets FOR SELECT USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS user_wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES user_wallets(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'withdrawal')),
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_wallet_transactions_select_own" ON user_wallet_transactions FOR SELECT USING (EXISTS (SELECT 1 FROM user_wallets w WHERE w.id = user_wallet_transactions.wallet_id AND w.user_id = auth.uid()));


-- Admin RPC for fetching platform revenue (Bypasses RLS)
CREATE OR REPLACE FUNCTION get_admin_wallet_data()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  SELECT json_build_object(
    'transactions', (
      SELECT COALESCE(json_agg(t), '[]'::json)
      FROM (
        SELECT id, amount, type, status, description, created_at
        FROM wallet_transactions
        WHERE type = 'credit'
        ORDER BY created_at DESC
        LIMIT 50
      ) t
    ),
    'platform_tips', (
      SELECT COALESCE(SUM(amount), 0) FROM platform_tips WHERE status = 'paid'
    )
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;


-- Update Cancel Project to refund volunteers
CREATE OR REPLACE FUNCTION cancel_project_and_refund(p_project_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_id UUID;
  v_wallet_id UUID;
  v_is_paid BOOLEAN;
  v_reg_fee NUMERIC;
  v_paid_count INTEGER;
  v_org_revenue_per_user NUMERIC;
  v_total_refund NUMERIC;
  v_app RECORD;
  v_user_wallet_id UUID;
BEGIN
  -- 1. Get project details
  SELECT organization_id, is_paid, COALESCE(registration_fee, 0)
  INTO v_org_id, v_is_paid, v_reg_fee
  FROM projects 
  WHERE id = p_project_id;

  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Project not found';
  END IF;

  -- 2. Check if organization wallet exists
  SELECT id INTO v_wallet_id FROM wallets WHERE organization_id = v_org_id;

  -- 3. Calculate refund if paid project
  IF v_is_paid = TRUE AND v_reg_fee > 0 AND v_wallet_id IS NOT NULL THEN
    -- Count approved applications (volunteers who have paid)
    SELECT COUNT(*) INTO v_paid_count 
    FROM project_applications 
    WHERE project_id = p_project_id AND status = 'approved';

    IF v_paid_count > 0 THEN
      -- The organization received 90% per user
      v_org_revenue_per_user := v_reg_fee - FLOOR(v_reg_fee * 0.1);
      v_total_refund := v_org_revenue_per_user * v_paid_count;

      -- Deduct from Pending Balance
      UPDATE wallets 
      SET pending_balance = pending_balance - v_total_refund
      WHERE id = v_wallet_id;

      -- Insert Debit Transaction for Org
      INSERT INTO wallet_transactions (wallet_id, amount, type, status, description, reference_id)
      VALUES (v_wallet_id, v_total_refund, 'debit', 'completed', 'Refund for cancelled project', p_project_id);
      
      -- REFUND VOLUNTEERS
      FOR v_app IN 
        SELECT id, user_id FROM project_applications WHERE project_id = p_project_id AND status = 'approved'
      LOOP
        -- Get or Create User Wallet
        SELECT id INTO v_user_wallet_id FROM user_wallets WHERE user_id = v_app.user_id;
        IF v_user_wallet_id IS NULL THEN
          INSERT INTO user_wallets (user_id, balance) VALUES (v_app.user_id, 0) RETURNING id INTO v_user_wallet_id;
        END IF;

        -- Credit User Wallet with FULL REGISTRATION FEE
        UPDATE user_wallets SET balance = balance + v_reg_fee WHERE id = v_user_wallet_id;

        -- Insert User Wallet Transaction
        INSERT INTO user_wallet_transactions (wallet_id, amount, type, description, reference_id)
        VALUES (v_user_wallet_id, v_reg_fee, 'credit', 'Refund for cancelled project', p_project_id);

        -- Update Application Status
        UPDATE project_applications SET status = 'refunded' WHERE id = v_app.id;
      END LOOP;
    END IF;
  ELSE
    -- Unpaid project or no wallet yet
    UPDATE project_applications
    SET status = 'cancelled'
    WHERE project_id = p_project_id;
  END IF;

  -- 4. Mark Project as Cancelled
  UPDATE projects
  SET status = 'cancelled'
  WHERE id = p_project_id;

END;
$$;
