-- Add categorization and compensation fields to projects table
ALTER TABLE projects 
  ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS compensation_type TEXT,
  ADD COLUMN IF NOT EXISTS compensation_amount TEXT,
  ADD COLUMN IF NOT EXISTS project_type TEXT;

-- Update existing projects with a default project_type if needed
UPDATE projects SET project_type = 'community' WHERE project_type IS NULL;
