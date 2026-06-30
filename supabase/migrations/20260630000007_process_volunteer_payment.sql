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
