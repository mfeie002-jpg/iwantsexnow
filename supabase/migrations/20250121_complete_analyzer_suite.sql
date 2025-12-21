-- =====================================================
-- WEB ANALYZER SUITE - COMPLETE DATABASE SCHEMA
-- Version: 3.0
-- Date: 2025-01-21
-- =====================================================

-- ENUMS
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- CORE TABLES
-- =====================================================

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- USER ROLES TABLE (Enhanced)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- =====================================================
-- SCREENSHOT MANAGEMENT
-- =====================================================

-- SCREENSHOT HISTORY TABLE (Enhanced)
CREATE TABLE IF NOT EXISTS screenshot_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  dimension TEXT NOT NULL,
  viewport_width INTEGER,
  viewport_height INTEGER,
  image_base64 TEXT,
  screenshot_url TEXT,
  is_full_page BOOLEAN DEFAULT false,
  wait_delay INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SCREENSHOT BASELINES TABLE (Enhanced for Regression Testing)
CREATE TABLE IF NOT EXISTS screenshot_baselines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  dimension TEXT DEFAULT '1920x1080',
  viewport_width INTEGER DEFAULT 1920,
  viewport_height INTEGER DEFAULT 1080,
  image_base64 TEXT NOT NULL,
  screenshot_url TEXT,
  threshold_percent NUMERIC DEFAULT 5.0,
  is_active BOOLEAN DEFAULT true,
  last_checked_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SCREENSHOT REGRESSION RESULTS TABLE (New)
CREATE TABLE IF NOT EXISTS screenshot_regression_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baseline_id UUID NOT NULL REFERENCES screenshot_baselines(id) ON DELETE CASCADE,
  new_image_base64 TEXT NOT NULL,
  new_screenshot_url TEXT,
  diff_image_base64 TEXT,
  diff_screenshot_url TEXT,
  diff_percent NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  passed BOOLEAN,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SCREENSHOT ALERT SETTINGS TABLE (New)
CREATE TABLE IF NOT EXISTS screenshot_alert_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  threshold_percent NUMERIC DEFAULT 10.0,
  is_active BOOLEAN DEFAULT true,
  alert_types JSONB DEFAULT '["regression", "scheduled"]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- ANALYSIS & REPORTS
-- =====================================================

-- ANALYSIS REPORTS TABLE (Enhanced)
CREATE TABLE IF NOT EXISTS analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  site_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'draft',
  
  -- Scoring
  overall_score INTEGER DEFAULT 0,
  
  -- Issue Tracking
  categories JSONB DEFAULT '[]',
  consequences JSONB DEFAULT '[]',
  total_issues INTEGER DEFAULT 0,
  critical_issues INTEGER DEFAULT 0,
  warning_issues INTEGER DEFAULT 0,
  info_issues INTEGER DEFAULT 0,
  
  -- Cost Analysis
  total_hours NUMERIC DEFAULT 0,
  hourly_rate NUMERIC DEFAULT 150,
  
  -- Revenue Impact
  current_revenue NUMERIC DEFAULT 0,
  projected_revenue NUMERIC DEFAULT 0,
  monthly_loss NUMERIC DEFAULT 0,
  
  -- Analysis Data
  analysis_data JSONB DEFAULT '{}',
  executive_summary TEXT,
  quick_wins JSONB DEFAULT '[]',
  prioritized_issues JSONB DEFAULT '[]',
  
  -- Page Count
  pages_analyzed INTEGER DEFAULT 1,
  page_urls JSONB DEFAULT '[]',
  
  -- Metadata
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- HTML CACHE TABLE (Existing, ensure it exists)
CREATE TABLE IF NOT EXISTS html_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL UNIQUE,
  raw_html TEXT,
  rendered_html TEXT,
  meta_tags JSONB DEFAULT '{}',
  headings JSONB DEFAULT '[]',
  links JSONB DEFAULT '{}',
  images JSONB DEFAULT '{}',
  structured_data JSONB DEFAULT '[]',
  lighthouse_data JSONB DEFAULT '{}',
  cached_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '24 hours')
);

-- URL DISCOVERY CACHE TABLE (Existing, ensure it exists)
CREATE TABLE IF NOT EXISTS url_discovery_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_url TEXT NOT NULL UNIQUE,
  discovered_urls JSONB DEFAULT '[]',
  total_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  discovered_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days')
);

-- =====================================================
-- SCHEDULED MONITORING
-- =====================================================

-- SCHEDULED SCREENSHOT URLS TABLE (New)
CREATE TABLE IF NOT EXISTS scheduled_screenshot_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  dimension TEXT DEFAULT '1920x1080',
  viewport_width INTEGER DEFAULT 1920,
  viewport_height INTEGER DEFAULT 1080,
  schedule_cron TEXT DEFAULT '0 0 * * *', -- Daily at midnight
  is_active BOOLEAN DEFAULT true,
  last_captured_at TIMESTAMPTZ,
  next_capture_at TIMESTAMPTZ,
  failure_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- SCHEDULED SCREENSHOT HISTORY TABLE (New)
CREATE TABLE IF NOT EXISTS scheduled_screenshot_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_url_id UUID NOT NULL REFERENCES scheduled_screenshot_urls(id) ON DELETE CASCADE,
  screenshot_url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  file_size INTEGER,
  status TEXT DEFAULT 'success',
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  captured_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Screenshot queries
CREATE INDEX IF NOT EXISTS idx_screenshot_history_user_id ON screenshot_history(user_id);
CREATE INDEX IF NOT EXISTS idx_screenshot_history_created_at ON screenshot_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_screenshot_baselines_is_active ON screenshot_baselines(is_active);
CREATE INDEX IF NOT EXISTS idx_screenshot_regression_results_baseline_id ON screenshot_regression_results(baseline_id);

-- Analysis queries
CREATE INDEX IF NOT EXISTS idx_analysis_reports_user_id ON analysis_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_token ON analysis_reports(token);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_created_at ON analysis_reports(created_at DESC);

-- Cache queries
CREATE INDEX IF NOT EXISTS idx_html_cache_url ON html_cache(url);
CREATE INDEX IF NOT EXISTS idx_html_cache_expires_at ON html_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_url_discovery_cache_base_url ON url_discovery_cache(base_url);

-- Scheduled monitoring
CREATE INDEX IF NOT EXISTS idx_scheduled_screenshot_urls_is_active ON scheduled_screenshot_urls(is_active);
CREATE INDEX IF NOT EXISTS idx_scheduled_screenshot_urls_next_capture ON scheduled_screenshot_urls(next_capture_at);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_regression_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE screenshot_alert_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE html_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE url_discovery_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_screenshot_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_screenshot_history ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Check if user has specific role
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT has_role(_user_id, 'admin'::app_role)
$$;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" 
  ON profiles FOR SELECT 
  USING (is_admin(auth.uid()));

-- USER ROLES POLICIES (Admin only)
DROP POLICY IF EXISTS "Admins can manage user roles" ON user_roles;
CREATE POLICY "Admins can manage user roles" 
  ON user_roles FOR ALL 
  USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
CREATE POLICY "Users can view own roles" 
  ON user_roles FOR SELECT 
  USING (auth.uid() = user_id);

-- SCREENSHOT HISTORY POLICIES
DROP POLICY IF EXISTS "Users can view own screenshots" ON screenshot_history;
CREATE POLICY "Users can view own screenshots" 
  ON screenshot_history FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all screenshots" ON screenshot_history;
CREATE POLICY "Admins can view all screenshots" 
  ON screenshot_history FOR SELECT 
  USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage screenshots" ON screenshot_history;
CREATE POLICY "Admins can manage screenshots" 
  ON screenshot_history FOR ALL 
  USING (is_admin(auth.uid()));

-- SCREENSHOT BASELINES POLICIES (Admin only)
DROP POLICY IF EXISTS "Admins can manage baselines" ON screenshot_baselines;
CREATE POLICY "Admins can manage baselines" 
  ON screenshot_baselines FOR ALL 
  USING (is_admin(auth.uid()));

-- SCREENSHOT REGRESSION RESULTS POLICIES (Admin only)
DROP POLICY IF EXISTS "Admins can manage regression results" ON screenshot_regression_results;
CREATE POLICY "Admins can manage regression results" 
  ON screenshot_regression_results FOR ALL 
  USING (is_admin(auth.uid()));

-- SCREENSHOT ALERT SETTINGS POLICIES
DROP POLICY IF EXISTS "Users can manage own alert settings" ON screenshot_alert_settings;
CREATE POLICY "Users can manage own alert settings" 
  ON screenshot_alert_settings FOR ALL 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all alert settings" ON screenshot_alert_settings;
CREATE POLICY "Admins can view all alert settings" 
  ON screenshot_alert_settings FOR SELECT 
  USING (is_admin(auth.uid()));

-- ANALYSIS REPORTS POLICIES
DROP POLICY IF EXISTS "Users can view own reports" ON analysis_reports;
CREATE POLICY "Users can view own reports" 
  ON analysis_reports FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all reports" ON analysis_reports;
CREATE POLICY "Admins can manage all reports" 
  ON analysis_reports FOR ALL 
  USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Public can view reports by token" ON analysis_reports;
CREATE POLICY "Public can view reports by token" 
  ON analysis_reports FOR SELECT 
  USING (true);

-- HTML CACHE POLICIES (Public read, admin write)
DROP POLICY IF EXISTS "Public can read html cache" ON html_cache;
CREATE POLICY "Public can read html cache" 
  ON html_cache FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Admins can manage html cache" ON html_cache;
CREATE POLICY "Admins can manage html cache" 
  ON html_cache FOR ALL 
  USING (is_admin(auth.uid()));

-- URL DISCOVERY CACHE POLICIES (Public read, admin write)
DROP POLICY IF EXISTS "Public can read url discovery cache" ON url_discovery_cache;
CREATE POLICY "Public can read url discovery cache" 
  ON url_discovery_cache FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Admins can manage url discovery cache" ON url_discovery_cache;
CREATE POLICY "Admins can manage url discovery cache" 
  ON url_discovery_cache FOR ALL 
  USING (is_admin(auth.uid()));

-- SCHEDULED SCREENSHOT URLS POLICIES (Admin only)
DROP POLICY IF EXISTS "Admins can manage scheduled urls" ON scheduled_screenshot_urls;
CREATE POLICY "Admins can manage scheduled urls" 
  ON scheduled_screenshot_urls FOR ALL 
  USING (is_admin(auth.uid()));

-- SCHEDULED SCREENSHOT HISTORY POLICIES (Admin only)
DROP POLICY IF EXISTS "Admins can view scheduled history" ON scheduled_screenshot_history;
CREATE POLICY "Admins can view scheduled history" 
  ON scheduled_screenshot_history FOR SELECT 
  USING (is_admin(auth.uid()));

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_screenshot_baselines_updated_at ON screenshot_baselines;
CREATE TRIGGER update_screenshot_baselines_updated_at
  BEFORE UPDATE ON screenshot_baselines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_screenshot_alert_settings_updated_at ON screenshot_alert_settings;
CREATE TRIGGER update_screenshot_alert_settings_updated_at
  BEFORE UPDATE ON screenshot_alert_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_analysis_reports_updated_at ON analysis_reports;
CREATE TRIGGER update_analysis_reports_updated_at
  BEFORE UPDATE ON analysis_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_scheduled_screenshot_urls_updated_at ON scheduled_screenshot_urls;
CREATE TRIGGER update_scheduled_screenshot_urls_updated_at
  BEFORE UPDATE ON scheduled_screenshot_urls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create screenshots archive bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'screenshots-archive',
  'screenshots-archive',
  true,
  52428800, -- 50MB
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp'];

-- Storage policies for screenshots-archive
DROP POLICY IF EXISTS "Public can view screenshots" ON storage.objects;
CREATE POLICY "Public can view screenshots"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'screenshots-archive');

DROP POLICY IF EXISTS "Admins can upload screenshots" ON storage.objects;
CREATE POLICY "Admins can upload screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'screenshots-archive' 
    AND is_admin(auth.uid())
  );

DROP POLICY IF EXISTS "Admins can delete screenshots" ON storage.objects;
CREATE POLICY "Admins can delete screenshots"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'screenshots-archive' 
    AND is_admin(auth.uid())
  );

-- =====================================================
-- SEED DATA (Optional)
-- =====================================================

-- Add some default scheduled URLs (can be customized)
INSERT INTO scheduled_screenshot_urls (url, name, dimension) 
VALUES 
  ('https://iwantsexnow.ch', 'Homepage', '1920x1080'),
  ('https://iwantsexnow.ch/escort-zurich', 'Zurich Escorts', '1920x1080'),
  ('https://iwantsexnow.ch/premium', 'Premium Page', '1920x1080')
ON CONFLICT (url) DO NOTHING;

-- =====================================================
-- CLEANUP OLD CACHE (Maintenance function)
-- =====================================================

CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete expired HTML cache
  DELETE FROM html_cache WHERE expires_at < now();
  
  -- Delete expired URL discovery cache
  DELETE FROM url_discovery_cache WHERE expires_at < now();
END;
$$;

-- =====================================================
-- COMPLETION
-- =====================================================

-- Verify all tables exist
DO $$
DECLARE
  missing_tables TEXT[];
BEGIN
  SELECT ARRAY_AGG(table_name)
  INTO missing_tables
  FROM (
    VALUES 
      ('profiles'),
      ('user_roles'),
      ('screenshot_history'),
      ('screenshot_baselines'),
      ('screenshot_regression_results'),
      ('screenshot_alert_settings'),
      ('analysis_reports'),
      ('html_cache'),
      ('url_discovery_cache'),
      ('scheduled_screenshot_urls'),
      ('scheduled_screenshot_history')
  ) AS expected(table_name)
  WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = expected.table_name
  );
  
  IF missing_tables IS NOT NULL THEN
    RAISE EXCEPTION 'Missing tables: %', array_to_string(missing_tables, ', ');
  ELSE
    RAISE NOTICE '✅ All 11 tables created successfully!';
  END IF;
END $$;