-- Top Up Wallet
CREATE OR REPLACE FUNCTION top_up_user_wallet(p_user_id UUID, p_amount NUMERIC, p_method TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
BEGIN
  -- Get or Create User Wallet
  SELECT id INTO v_wallet_id FROM user_wallets WHERE user_id = p_user_id;
  IF v_wallet_id IS NULL THEN
    INSERT INTO user_wallets (user_id, balance) VALUES (p_user_id, 0) RETURNING id INTO v_wallet_id;
  END IF;

  -- Credit User Wallet
  UPDATE user_wallets SET balance = balance + p_amount WHERE id = v_wallet_id;

  -- Insert User Wallet Transaction
  INSERT INTO user_wallet_transactions (wallet_id, amount, type, description)
  VALUES (v_wallet_id, p_amount, 'credit', 'Top Up via ' || p_method);
END;
$$;

-- Withdraw Wallet
CREATE OR REPLACE FUNCTION withdraw_user_wallet(p_user_id UUID, p_amount NUMERIC, p_destination TEXT, p_account TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_wallet_id UUID;
  v_balance NUMERIC;
BEGIN
  -- Get User Wallet
  SELECT id, balance INTO v_wallet_id, v_balance FROM user_wallets WHERE user_id = p_user_id;
  
  IF v_wallet_id IS NULL OR v_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Debit User Wallet
  UPDATE user_wallets SET balance = balance - p_amount WHERE id = v_wallet_id;

  -- Insert User Wallet Transaction
  INSERT INTO user_wallet_transactions (wallet_id, amount, type, description)
  VALUES (v_wallet_id, p_amount, 'withdrawal', 'Withdrawal to ' || p_destination || ' (' || p_account || ')');
END;
$$;
