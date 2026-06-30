-- Payment processing function for Secure Wallet Updates
CREATE OR REPLACE FUNCTION process_project_payment(p_project_id UUID, p_user_id UUID, p_amount NUMERIC)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_id UUID;
  v_wallet_id UUID;
  v_platform_fee NUMERIC;
  v_org_revenue NUMERIC;
BEGIN
  -- 1. Get organization_id from the project
  SELECT organization_id INTO v_org_id FROM projects WHERE id = p_project_id;
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Project not found';
  END IF;
  
  -- 2. Calculate split (10% platform fee, 90% org revenue)
  v_platform_fee := FLOOR(p_amount * 0.1);
  v_org_revenue := p_amount - v_platform_fee;

  -- 3. Get or Create Wallet
  SELECT id INTO v_wallet_id FROM wallets WHERE organization_id = v_org_id;
  IF v_wallet_id IS NULL THEN
    INSERT INTO wallets (organization_id, pending_balance, available_balance, total_withdrawn)
    VALUES (v_org_id, 0, 0, 0)
    RETURNING id INTO v_wallet_id;
  END IF;

  -- 4. Update Wallet Balance
  UPDATE wallets 
  SET pending_balance = pending_balance + v_org_revenue
  WHERE id = v_wallet_id;

  -- 5. Insert Transaction
  INSERT INTO wallet_transactions (wallet_id, amount, type, status, description, reference_id)
  VALUES (v_wallet_id, v_org_revenue, 'credit', 'pending', 'Registration fee from volunteer', p_user_id);
END;
$$;
