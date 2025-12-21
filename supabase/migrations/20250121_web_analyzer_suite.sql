-- Web Analyzer Suite Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Roles Table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Screenshot History Table
CREATE TABLE IF NOT EXISTS screenshot_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  viewport_width INTEGER NOT NULL,
  viewport_height INTEGER NOT NULL,
  screenshot_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Screenshot Baselines Table (for regression testing)
CREATE TABLE IF NOT EXISTS screenshot_baselines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  viewport_width INTEGER NOT NULL,
  viewport_height INTEGER NOT NULL,
  screenshot_url TEXT NOT NULL,
  is_baseline BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(url, viewport_width, viewport_height)
);

-- Analysis Reports Table
CREATE TABLE IF NOT EXISTS analysis_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name TEXT,
  website_url TEXT NOT NULL,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN (
    'quick_analysis',
    'deep_audit',
    'code_review',
    'screenshot_analysis',
    'regression_report',
    'seo_deep_dive',
    'accessibility_audit'
  )),
  report_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HTML Cache Table (for SEO analyzer)
CREATE TABLE IF NOT EXISTS html_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  raw_html TEXT,
  rendered_html TEXT,
  meta_tags JSONB,
  headings JSONB,
  links JSONB,
  images JSONB,
  structured_data JSONB,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(url)
);

-- URL Discovery Cache
CREATE TABLE IF NOT EXISTS url_discovery_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  base_url TEXT NOT NULL,
  discovered_urls JSONB NOT NULL,
  total_count INTEGER NOT NULL,
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(base_url)
);

-- Helper function to check if user has role
CREATE OR REPLACE FUNCTION has_role(user_id UUID, required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = $1 
    AND user_roles.role = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies

-- User Roles: Admin only
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Screenshot History: Users can view their own, admins can view all
ALTER TABLE screenshot_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own screenshots"
  ON screenshot_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own screenshots"
  ON screenshot_history FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Screenshot Baselines: Admin only
ALTER TABLE screenshot_baselines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage baselines"
  ON screenshot_baselines FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Analysis Reports: Users can view their own, admins can view all
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports"
  ON analysis_reports FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own reports"
  ON analysis_reports FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- HTML Cache: Public read, admin write
ALTER TABLE html_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cache"
  ON html_cache FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage cache"
  ON html_cache FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- URL Discovery Cache: Public read, admin write
ALTER TABLE url_discovery_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read discovery cache"
  ON url_discovery_cache FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage discovery cache"
  ON url_discovery_cache FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX idx_screenshot_history_user_id ON screenshot_history(user_id);
CREATE INDEX idx_screenshot_history_created_at ON screenshot_history(created_at DESC);
CREATE INDEX idx_analysis_reports_user_id ON analysis_reports(user_id);
CREATE INDEX idx_analysis_reports_created_at ON analysis_reports(created_at DESC);
CREATE INDEX idx_html_cache_url ON html_cache(url);
CREATE INDEX idx_url_discovery_base_url ON url_discovery_cache(base_url);