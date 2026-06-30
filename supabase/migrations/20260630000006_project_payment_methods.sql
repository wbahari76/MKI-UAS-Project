-- Add additional fields to projects for the new project creation flow
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS accepted_payment_methods TEXT[] DEFAULT ARRAY['wallet']::TEXT[],
  ADD COLUMN IF NOT EXISTS contact_email TEXT;
