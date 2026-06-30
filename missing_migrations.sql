-- Volunteer Wallets and Admin Wallet Transactions
CREATE TABLE IF NOT EXISTS admin_wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'withdrawal')),
  destination TEXT, -- 'bank', 'gopay', 'shopeepay' (for withdrawals)
  account_number TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Update get_admin_wallet_data to include admin top-ups and withdrawals
CREATE OR REPLACE FUNCTION get_admin_wallet_data()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
  v_total_withdrawn NUMERIC;
  v_total_topup NUMERIC;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO v_total_withdrawn FROM admin_wallet_transactions WHERE type = 'withdrawal';
  SELECT COALESCE(SUM(amount), 0) INTO v_total_topup FROM admin_wallet_transactions WHERE type = 'credit';

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
    ),
    'total_withdrawn', v_total_withdrawn,
    'total_topup', v_total_topup
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;


-- RPC for Admin Withdrawal
CREATE OR REPLACE FUNCTION withdraw_admin_wallet(p_amount NUMERIC, p_destination TEXT, p_account TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_credit_sum NUMERIC;
  v_platform_fees NUMERIC;
  v_tips NUMERIC;
  v_withdrawn NUMERIC;
  v_topup NUMERIC;
  v_available NUMERIC;
BEGIN
  -- 1. Calculate Available Balance
  SELECT COALESCE(SUM(amount), 0) INTO v_credit_sum FROM wallet_transactions WHERE type = 'credit';
  v_platform_fees := FLOOR(v_credit_sum / 9);
  
  SELECT COALESCE(SUM(amount), 0) INTO v_tips FROM platform_tips WHERE status = 'paid';
  
  SELECT COALESCE(SUM(amount), 0) INTO v_withdrawn FROM admin_wallet_transactions WHERE type = 'withdrawal';
  SELECT COALESCE(SUM(amount), 0) INTO v_topup FROM admin_wallet_transactions WHERE type = 'credit';
  
  v_available := v_platform_fees + v_tips + v_topup - v_withdrawn;

  IF p_amount > v_available THEN
    RAISE EXCEPTION 'Insufficient admin balance';
  END IF;

  -- 2. Insert Withdrawal
  INSERT INTO admin_wallet_transactions (amount, type, destination, account_number, description)
  VALUES (p_amount, 'withdrawal', p_destination, p_account, 'Withdrawal to ' || p_destination || ' (' || p_account || ')');
END;
$$;


-- RPC for Admin Top Up
CREATE OR REPLACE FUNCTION top_up_admin_wallet(p_amount NUMERIC, p_method TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO admin_wallet_transactions (amount, type, description)
  VALUES (p_amount, 'credit', 'Top Up via ' || p_method);
END;
$$;


-- RPC for Organization Withdrawal
CREATE OR REPLACE FUNCTION withdraw_org_wallet(p_org_id UUID, p_amount NUMERIC, p_destination TEXT, p_account TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_available NUMERIC;
BEGIN
  SELECT id, available_balance INTO v_wallet_id, v_available FROM wallets WHERE organization_id = p_org_id;
  
  IF v_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;
  
  IF p_amount > v_available THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
  
  UPDATE wallets 
  SET available_balance = available_balance - p_amount,
      total_withdrawn = total_withdrawn + p_amount
  WHERE id = v_wallet_id;
  
  INSERT INTO wallet_transactions (wallet_id, amount, type, status, description, reference_id)
  VALUES (v_wallet_id, p_amount, 'withdrawal', 'completed', 'Withdrawal to ' || p_destination || ' (' || p_account || ')', p_org_id);
END;
$$;


-- RPC for Organization Top Up
CREATE OR REPLACE FUNCTION top_up_org_wallet(p_org_id UUID, p_amount NUMERIC, p_method TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
BEGIN
  SELECT id INTO v_wallet_id FROM wallets WHERE organization_id = p_org_id;
  
  IF v_wallet_id IS NULL THEN
    -- If no wallet exists, wait, actually we can just insert one if we want, but typically orgs have wallets created on project creation.
    -- For safety, we can insert if not found.
    INSERT INTO wallets (organization_id, available_balance) VALUES (p_org_id, p_amount) RETURNING id INTO v_wallet_id;
  ELSE
    UPDATE wallets 
    SET available_balance = available_balance + p_amount
    WHERE id = v_wallet_id;
  END IF;
  
  INSERT INTO wallet_transactions (wallet_id, amount, type, status, description, reference_id)
  VALUES (v_wallet_id, p_amount, 'credit', 'completed', 'Top Up via ' || p_method, p_org_id);
END;
$$;


-- RPC for Volunteer Withdrawal
CREATE OR REPLACE FUNCTION withdraw_user_wallet(p_user_id UUID, p_amount NUMERIC, p_destination TEXT, p_account TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_balance NUMERIC;
BEGIN
  SELECT id, balance INTO v_wallet_id, v_balance FROM user_wallets WHERE user_id = p_user_id;
  
  IF v_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;
  
  IF p_amount > v_balance THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
  
  UPDATE user_wallets 
  SET balance = balance - p_amount
  WHERE id = v_wallet_id;
  
  INSERT INTO user_wallet_transactions (wallet_id, amount, type, description)
  VALUES (v_wallet_id, p_amount, 'withdrawal', 'Withdrawal to ' || p_destination || ' (' || p_account || ')');
END;
$$;


-- RPC for Volunteer Top Up
CREATE OR REPLACE FUNCTION top_up_user_wallet(p_user_id UUID, p_amount NUMERIC, p_method TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
BEGIN
  -- Get or Create Wallet
  SELECT id INTO v_wallet_id FROM user_wallets WHERE user_id = p_user_id;
  IF v_wallet_id IS NULL THEN
    INSERT INTO user_wallets (user_id, balance) VALUES (p_user_id, 0) RETURNING id INTO v_wallet_id;
  END IF;
  
  UPDATE user_wallets 
  SET balance = balance + p_amount
  WHERE id = v_wallet_id;
  
  INSERT INTO user_wallet_transactions (wallet_id, amount, type, description)
  VALUES (v_wallet_id, p_amount, 'credit', 'Top Up via ' || p_method);
END;
$$;
-- Add additional fields to projects for the new project creation flow
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS accepted_payment_methods TEXT[] DEFAULT ARRAY['wallet']::TEXT[],
  ADD COLUMN IF NOT EXISTS contact_email TEXT;
-- Add payment status to project applications
ALTER TABLE project_applications 
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded'));

-- RPC to process volunteer payment for a paid project
CREATE OR REPLACE FUNCTION process_volunteer_payment(p_project_id UUID, p_user_id UUID, p_amount NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_wallet_id UUID;
  v_user_balance NUMERIC;
  v_org_id UUID;
  v_org_wallet_id UUID;
  v_platform_fee NUMERIC;
  v_org_revenue NUMERIC;
BEGIN
  -- 1. Get User Wallet
  SELECT id, balance INTO v_user_wallet_id, v_user_balance 
  FROM user_wallets 
  WHERE user_id = p_user_id;
  
  IF v_user_wallet_id IS NULL THEN
    RAISE EXCEPTION 'User wallet not found';
  END IF;
  
  IF v_user_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance in user wallet';
  END IF;
  
  -- 2. Get Organization from Project
  SELECT organization_id INTO v_org_id 
  FROM projects 
  WHERE id = p_project_id;
  
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Project or Organization not found';
  END IF;
  
  -- 3. Get Organization Wallet (create if missing)
  SELECT id INTO v_org_wallet_id FROM wallets WHERE organization_id = v_org_id;
  IF v_org_wallet_id IS NULL THEN
    INSERT INTO wallets (organization_id) VALUES (v_org_id) RETURNING id INTO v_org_wallet_id;
  END IF;
  
  -- 4. Calculate Splits
  v_platform_fee := FLOOR(p_amount * 0.10);
  v_org_revenue := p_amount - v_platform_fee;
  
  -- 5. Deduct from User Wallet
  UPDATE user_wallets 
  SET balance = balance - p_amount 
  WHERE id = v_user_wallet_id;
  
  INSERT INTO user_wallet_transactions (wallet_id, amount, type, description, reference_id)
  VALUES (v_user_wallet_id, p_amount, 'debit', 'Registration Fee for Project', p_project_id);
  
  -- 6. Add 10% to Admin Wallet
  INSERT INTO admin_wallet_transactions (amount, type, description)
  VALUES (v_platform_fee, 'credit', 'Platform Fee from Registration ' || p_project_id);
  
  -- 7. Add 90% to Organization Wallet (Pending Balance)
  UPDATE wallets 
  SET pending_balance = pending_balance + v_org_revenue 
  WHERE id = v_org_wallet_id;
  
  INSERT INTO wallet_transactions (wallet_id, amount, type, status, description, reference_id)
  VALUES (v_org_wallet_id, v_org_revenue, 'credit', 'pending', 'Registration Revenue (Pending)', p_project_id);
  
  -- 8. Mark application as paid
  -- It might not exist yet if they pay at the time of clicking apply.
  -- Upsert application.
  INSERT INTO project_applications (project_id, user_id, status, payment_status)
  VALUES (p_project_id, p_user_id, 'approved', 'paid')
  ON CONFLICT (project_id, user_id) 
  DO UPDATE SET status = 'approved', payment_status = 'paid';
  
END;
$$;
