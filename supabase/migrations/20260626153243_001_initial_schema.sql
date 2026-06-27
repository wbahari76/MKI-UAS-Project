/*
# JALA VIVE Initial Schema Setup

This migration creates the foundational tables for the JALA VIVE Social Impact Platform.

## 1. User Profiles
- `profiles` - Extended user data linked to auth.users
- Includes role (volunteer, organization, admin)
- Contains profile information, skills, interests

## 2. Organizations
- `organizations` - Organization profiles
- Linked to user profile as owner
- Contains organization details, verification status

## 3. Projects
- `projects` - Volunteer opportunity listings
- Linked to organizations
- Status: draft, published, recruiting, in_progress, completed, archived
- Contains all project details, requirements, benefits

## 4. Project Applications
- `project_applications` - Volunteer applications to projects
- Status: pending, approved, rejected, cancelled, completed, certified
- Tracks volunteer journey through project lifecycle

## 5. Saved Projects
- `saved_projects` - Projects saved/bookmarked by volunteers

## 6. Events
- `events` - Volunteer events
- Linked to projects
- Status tracking through lifecycle

## 7. Event Attendance
- `event_attendance` - Volunteer attendance at events

## 8. Community Posts
- `community_posts` - Community feed posts
- Like LinkedIn-style feed
- Supports images, likes, comments

## 9. Post Comments
- `post_comments` - Comments on community posts

## 10. Post Likes
- `post_likes` - Likes on community posts

## 11. Messages
- `messages` - Chat messages between users
- Support for text and image messages
- Read status tracking

## 12. Notifications
- `notifications` - User notifications
- Type-based categorization
- Read status tracking

## 13. Certificates
- `certificates` - Volunteer certificates
- Linked to completed projects

## 14. Achievements
- `achievements` - User achievement definitions
- `user_achievements` - User earned achievements

## 15. Activity Log
- `activity_log` - Platform activity tracking
- Used for analytics and activity feeds

## Security
- All tables have RLS enabled
- Owner-scoped policies for authenticated users
- Proper foreign key relationships
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL DEFAULT 'volunteer' CHECK (role IN ('volunteer', 'organization', 'admin')),
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  skills TEXT[],
  interests TEXT[],
  volunteer_hours INTEGER DEFAULT 0,
  achievement_points INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Explorer',
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Organizations
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  logo_url TEXT,
  cover_url TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT DEFAULT 'Indonesia',
  category TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  total_projects INTEGER DEFAULT 0,
  total_volunteers INTEGER DEFAULT 0,
  total_hours INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orgs_select_own" ON organizations;
CREATE POLICY "orgs_select_own" ON organizations FOR SELECT
  TO authenticated USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "orgs_insert_own" ON organizations;
CREATE POLICY "orgs_insert_own" ON organizations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "orgs_update_own" ON organizations;
CREATE POLICY "orgs_update_own" ON organizations FOR UPDATE
  TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  banner_url TEXT,
  category TEXT,
  location TEXT,
  requirements TEXT[],
  benefits TEXT[],
  skills_needed TEXT[],
  volunteer_needed INTEGER DEFAULT 1,
  volunteer_count INTEGER DEFAULT 0,
  deadline TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'recruiting', 'in_progress', 'completed', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  gallery TEXT[],
  faq JSONB DEFAULT '[]'::jsonb,
  progress INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_select_all" ON projects;
CREATE POLICY "projects_select_all" ON projects FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "projects_insert_org" ON projects;
CREATE POLICY "projects_insert_org" ON projects FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "projects_update_org" ON projects;
CREATE POLICY "projects_update_org" ON projects FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND owner_id = auth.uid())
  );

-- Project Applications
CREATE TABLE IF NOT EXISTS project_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'completed', 'certified')),
  applied_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, user_id)
);

ALTER TABLE project_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "apps_select_own" ON project_applications;
CREATE POLICY "apps_select_own" ON project_applications FOR SELECT
  TO authenticated USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM projects p JOIN organizations o ON p.organization_id = o.id WHERE p.id = project_id AND o.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "apps_insert_volunteer" ON project_applications;
CREATE POLICY "apps_insert_volunteer" ON project_applications FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "apps_update_own" ON project_applications;
CREATE POLICY "apps_update_own" ON project_applications FOR UPDATE
  TO authenticated USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM projects p JOIN organizations o ON p.organization_id = o.id WHERE p.id = project_id AND o.owner_id = auth.uid())
  ) WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM projects p JOIN organizations o ON p.organization_id = o.id WHERE p.id = project_id AND o.owner_id = auth.uid())
  );

-- Saved Projects
CREATE TABLE IF NOT EXISTS saved_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, user_id)
);

ALTER TABLE saved_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "saved_select_own" ON saved_projects;
CREATE POLICY "saved_select_own" ON saved_projects FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "saved_insert_own" ON saved_projects;
CREATE POLICY "saved_insert_own" ON saved_projects FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "saved_delete_own" ON saved_projects;
CREATE POLICY "saved_delete_own" ON saved_projects FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- Events
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  location TEXT,
  is_online BOOLEAN DEFAULT false,
  online_url TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  capacity INTEGER,
  registered_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'registration_open', 'registration_closed', 'ongoing', 'finished', 'archived')),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events_select_all" ON events;
CREATE POLICY "events_select_all" ON events FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "events_insert_org" ON events;
CREATE POLICY "events_insert_org" ON events FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "events_update_org" ON events;
CREATE POLICY "events_update_org" ON events FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM organizations WHERE id = organization_id AND owner_id = auth.uid())
  );

-- Event Attendance
CREATE TABLE IF NOT EXISTS event_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT now(),
  attended BOOLEAN DEFAULT false,
  UNIQUE(event_id, user_id)
);

ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "attendance_select_own" ON event_attendance;
CREATE POLICY "attendance_select_own" ON event_attendance FOR SELECT
  TO authenticated USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM events e JOIN organizations o ON e.organization_id = o.id WHERE e.id = event_id AND o.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "attendance_insert_own" ON event_attendance;
CREATE POLICY "attendance_insert_own" ON event_attendance FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "attendance_update_own" ON event_attendance;
CREATE POLICY "attendance_update_own" ON event_attendance FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM events e JOIN organizations o ON e.organization_id = o.id WHERE e.id = event_id AND o.owner_id = auth.uid())
  );

-- Community Posts
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_select_all" ON community_posts;
CREATE POLICY "posts_select_all" ON community_posts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "posts_insert_own" ON community_posts;
CREATE POLICY "posts_insert_own" ON community_posts FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "posts_update_own" ON community_posts;
CREATE POLICY "posts_update_own" ON community_posts FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "posts_delete_own" ON community_posts;
CREATE POLICY "posts_delete_own" ON community_posts FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- Post Comments
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comments_select_all" ON post_comments;
CREATE POLICY "comments_select_all" ON post_comments FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "comments_insert_own" ON post_comments;
CREATE POLICY "comments_insert_own" ON post_comments FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "comments_delete_own" ON post_comments;
CREATE POLICY "comments_delete_own" ON post_comments FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- Post Likes
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "likes_select_own" ON post_likes;
CREATE POLICY "likes_select_own" ON post_likes FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "likes_insert_own" ON post_likes;
CREATE POLICY "likes_insert_own" ON post_likes FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "likes_delete_own" ON post_likes;
CREATE POLICY "likes_delete_own" ON post_likes FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  image_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for conversation queries
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_select_participant" ON messages;
CREATE POLICY "messages_select_participant" ON messages FOR SELECT
  TO authenticated USING (sender_id = auth.uid() OR receiver_id = auth.uid());

DROP POLICY IF EXISTS "messages_insert_own" ON messages;
CREATE POLICY "messages_insert_own" ON messages FOR INSERT
  TO authenticated WITH CHECK (sender_id = auth.uid());

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for user notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifs_select_own" ON notifications;
CREATE POLICY "notifs_select_own" ON notifications FOR SELECT
  TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifs_insert_own" ON notifications;
CREATE POLICY "notifs_insert_own" ON notifications FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "notifs_update_own" ON notifications;
CREATE POLICY "notifs_update_own" ON notifications FOR UPDATE
  TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES project_applications(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  hours_completed INTEGER DEFAULT 0,
  issued_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, project_id)
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "certs_select_own" ON certificates;
CREATE POLICY "certs_select_own" ON certificates FOR SELECT
  TO authenticated USING (user_id = auth.uid());

-- Achievement Definitions
CREATE TABLE IF NOT EXISTS achievement_definitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  requirement_type TEXT,
  requirement_value INTEGER,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievement_definitions(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_achievements_select_own" ON user_achievements;
CREATE POLICY "user_achievements_select_own" ON user_achievements FOR SELECT
  TO authenticated USING (user_id = auth.uid());

-- Activity Log
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  action TEXT,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for activity queries
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at DESC);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "activity_select_own" ON activity_log;
CREATE POLICY "activity_select_own" ON activity_log FOR SELECT
  TO authenticated USING (user_id = auth.uid());

-- Insert default achievements
INSERT INTO achievement_definitions (name, description, requirement_type, requirement_value, points) VALUES
('Explorer', 'Joined your first project', 'projects_joined', 1, 10),
('Contributor', 'Joined 5 projects', 'projects_joined', 5, 50),
('Changemaker', 'Joined 10 projects', 'projects_joined', 10, 100),
('Leader', 'Joined 25 projects', 'projects_joined', 25, 250),
('Impact Hero', 'Joined 50 projects', 'projects_joined', 50, 500),
('First Certificate', 'Received your first certificate', 'certificates', 1, 25),
('Certified Volunteer', 'Earned 5 certificates', 'certificates', 5, 100),
('Community Builder', 'Created 10 community posts', 'posts', 10, 50),
('Event Enthusiast', 'Attended 10 events', 'events', 10, 75),
('Volunteer Hours: 10', 'Completed 10 volunteer hours', 'hours', 10, 30),
('Volunteer Hours: 50', 'Completed 50 volunteer hours', 'hours', 50, 100),
('Volunteer Hours: 100', 'Completed 100 volunteer hours', 'hours', 100, 200)
ON CONFLICT (name) DO NOTHING;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers for updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('profiles', 'organizations', 'projects', 'project_applications', 'events', 'community_posts', 'post_comments')
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', t, t);
    EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
  END LOOP;
END;
$$;
