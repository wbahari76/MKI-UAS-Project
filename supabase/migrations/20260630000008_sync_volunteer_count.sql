-- Sync volunteer_count in projects table based on approved project_applications

CREATE OR REPLACE FUNCTION sync_volunteer_count()
RETURNS TRIGGER AS $$
BEGIN
  -- If inserting a new approved application
  IF (TG_OP = 'INSERT' AND NEW.status = 'approved') THEN
    UPDATE projects SET volunteer_count = volunteer_count + 1 WHERE id = NEW.project_id;
  
  -- If updating an application's status
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.status != 'approved' AND NEW.status = 'approved') THEN
      UPDATE projects SET volunteer_count = volunteer_count + 1 WHERE id = NEW.project_id;
    ELSIF (OLD.status = 'approved' AND NEW.status != 'approved') THEN
      UPDATE projects SET volunteer_count = volunteer_count - 1 WHERE id = NEW.project_id;
    END IF;
    
  -- If deleting an approved application
  ELSIF (TG_OP = 'DELETE' AND OLD.status = 'approved') THEN
    UPDATE projects SET volunteer_count = volunteer_count - 1 WHERE id = OLD.project_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_volunteer_count ON project_applications;
CREATE TRIGGER trigger_sync_volunteer_count
  AFTER INSERT OR UPDATE OR DELETE
  ON project_applications
  FOR EACH ROW
  EXECUTE FUNCTION sync_volunteer_count();

-- Backfill existing data
UPDATE projects p
SET volunteer_count = (
  SELECT COUNT(*)
  FROM project_applications pa
  WHERE pa.project_id = p.id AND pa.status = 'approved'
);
