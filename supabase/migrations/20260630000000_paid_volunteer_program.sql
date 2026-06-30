-- Add fields to projects for paid volunteer programs
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS registration_fee NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS contact_person_name TEXT,
  ADD COLUMN IF NOT EXISTS contact_person_phone TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_group_link TEXT;

-- Wallets
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE UNIQUE,
  pending_balance NUMERIC DEFAULT 0,
  available_balance NUMERIC DEFAULT 0,
  total_withdrawn NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wallets_select_org" ON wallets FOR SELECT
  USING (EXISTS (SELECT 1 FROM organizations o WHERE o.id = wallets.organization_id AND o.owner_id = auth.uid()));

CREATE POLICY "wallets_update_org" ON wallets FOR UPDATE
  USING (EXISTS (SELECT 1 FROM organizations o WHERE o.id = wallets.organization_id AND o.owner_id = auth.uid()));

-- Wallet Transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'withdrawal')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  description TEXT,
  reference_id UUID, -- E.g., volunteer_id or project_id or payment_id
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wallet_transactions_select_org" ON wallet_transactions FOR SELECT
  USING (EXISTS (SELECT 1 FROM wallets w JOIN organizations o ON w.organization_id = o.id WHERE w.id = wallet_transactions.wallet_id AND o.owner_id = auth.uid()));

