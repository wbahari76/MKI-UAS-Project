-- Allow all authenticated users to read profiles
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_public" ON profiles FOR SELECT
  TO authenticated USING (true);
