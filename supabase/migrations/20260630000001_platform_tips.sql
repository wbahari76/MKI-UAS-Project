-- Platform Tips table for Free Volunteer Programs
CREATE TABLE IF NOT EXISTS platform_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'skipped')),
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE platform_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tips_select_org" ON platform_tips FOR SELECT
  USING (EXISTS (SELECT 1 FROM projects p JOIN organizations o ON p.organization_id = o.id WHERE p.id = platform_tips.project_id AND o.owner_id = auth.uid()));

CREATE POLICY "tips_insert_org" ON platform_tips FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM projects p JOIN organizations o ON p.organization_id = o.id WHERE p.id = platform_tips.project_id AND o.owner_id = auth.uid()));

CREATE POLICY "tips_update_org" ON platform_tips FOR UPDATE
  USING (EXISTS (SELECT 1 FROM projects p JOIN organizations o ON p.organization_id = o.id WHERE p.id = platform_tips.project_id AND o.owner_id = auth.uid()));
