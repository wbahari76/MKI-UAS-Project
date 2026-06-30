-- Project Cancellation & Refund Function
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

      -- Insert Debit Transaction
      INSERT INTO wallet_transactions (wallet_id, amount, type, status, description, reference_id)
      VALUES (v_wallet_id, v_total_refund, 'debit', 'completed', 'Refund for cancelled project', p_project_id);
      
      -- Update Applications to Refunded
      UPDATE project_applications
      SET status = 'refunded'
      WHERE project_id = p_project_id AND status = 'approved';
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
