-- RPC to process external volunteer payment for a paid project (QRIS, VA, E-Wallet)
CREATE OR REPLACE FUNCTION process_volunteer_external_payment(p_project_id UUID, p_user_id UUID, p_amount NUMERIC, p_method TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_org_id UUID;
  v_org_wallet_id UUID;
  v_platform_fee NUMERIC;
  v_org_revenue NUMERIC;
BEGIN
  -- 1. Get Organization from Project
  SELECT organization_id INTO v_org_id 
  FROM projects 
  WHERE id = p_project_id;
  
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Project or Organization not found';
  END IF;
  
  -- 2. Get Organization Wallet (create if missing)
  SELECT id INTO v_org_wallet_id FROM wallets WHERE organization_id = v_org_id;
  IF v_org_wallet_id IS NULL THEN
    INSERT INTO wallets (organization_id) VALUES (v_org_id) RETURNING id INTO v_org_wallet_id;
  END IF;
  
  -- 3. Calculate Splits
  v_platform_fee := FLOOR(p_amount * 0.10);
  v_org_revenue := p_amount - v_platform_fee;
  
  -- 4. Add 10% to Admin Wallet
  INSERT INTO admin_wallet_transactions (amount, type, description)
  VALUES (v_platform_fee, 'credit', 'Platform Fee from ' || p_method || ' Registration ' || p_project_id);
  
  -- 5. Add 90% to Organization Wallet (Pending Balance)
  UPDATE wallets 
  SET pending_balance = pending_balance + v_org_revenue 
  WHERE id = v_org_wallet_id;
  
  INSERT INTO wallet_transactions (wallet_id, amount, type, status, description, reference_id)
  VALUES (v_org_wallet_id, v_org_revenue, 'credit', 'pending', 'Registration Revenue via ' || p_method, p_project_id);
  
  -- 6. Mark application as paid
  -- Upsert application (status = approved, payment_status = paid)
  INSERT INTO project_applications (project_id, user_id, status, payment_status)
  VALUES (p_project_id, p_user_id, 'approved', 'paid')
  ON CONFLICT (project_id, user_id) 
  DO UPDATE SET status = 'approved', payment_status = 'paid';
  
END;
$$;
