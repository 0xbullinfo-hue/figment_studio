-- ============================================================================
-- FIGMENT STUDIO: POSTGRESQL SCHEMA v1
-- Baseline: Jul 1, 2026
-- Created for production-ready audit system, payments, gallery, subscriptions
-- ============================================================================

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  plan VARCHAR(50) NOT NULL DEFAULT 'trial' CHECK (plan IN ('trial', 'pro')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token VARCHAR(1024) NOT NULL UNIQUE,
  refresh_token VARCHAR(1024) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- SUBSCRIPTIONS & PAYMENTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL CHECK (plan IN ('trial', 'pro')),
  started_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  reference VARCHAR(255) NOT NULL UNIQUE,
  provider VARCHAR(50) NOT NULL CHECK (provider IN ('paystack', 'flutterwave')),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  provider_response JSONB,
  metadata JSONB,
  initiated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- ============================================================================
-- ARCVIZ USAGE & QUOTAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS arcviz_renders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  room_type VARCHAR(100),
  lighting_style VARCHAR(255),
  camera_angle VARCHAR(255),
  camera_movement VARCHAR(255),
  video_duration VARCHAR(10),
  context_style VARCHAR(100),
  output_url VARCHAR(1024),
  render_params JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP,
  error_message TEXT
);

-- ============================================================================
-- GALLERY & PORTFOLIO
-- ============================================================================
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('Exterior', 'Interior', 'Animation', 'Scale Models')),
  category VARCHAR(100),
  location VARCHAR(100),
  url VARCHAR(1024) NOT NULL,
  video_url VARCHAR(1024),
  has_play BOOLEAN DEFAULT false,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'pending_review', 'published', 'archived')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- ============================================================================
-- PROJECT PROCESS TIMELINE
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  client_name VARCHAR(255),
  location VARCHAR(100),
  image_url VARCHAR(1024),
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'pending_approval', 'completed')),
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS process_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL CHECK (stage IN ('ideation', 'modeling', 'rendering', 'postprod', 'delivery')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  media_urls JSONB,
  order_index INT NOT NULL DEFAULT 0,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- ============================================================================
-- AUDIT LOGGING
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  status VARCHAR(50) NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed')),
  error_message TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_deleted ON users(deleted_at);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires ON subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payment_transactions(reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payments_provider ON payment_transactions(provider);
CREATE INDEX IF NOT EXISTS idx_renders_user ON arcviz_renders(user_id);
CREATE INDEX IF NOT EXISTS idx_renders_created ON arcviz_renders(created_at);
CREATE INDEX IF NOT EXISTS idx_renders_status ON arcviz_renders(status);
CREATE INDEX IF NOT EXISTS idx_gallery_type ON gallery_items(type);
CREATE INDEX IF NOT EXISTS idx_gallery_status ON gallery_items(status);
CREATE INDEX IF NOT EXISTS idx_gallery_deleted ON gallery_items(deleted_at);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_process_project ON process_posts(project_id);
CREATE INDEX IF NOT EXISTS idx_process_stage ON process_posts(stage);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON subscriptions(expires_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_payments_pending ON payment_transactions(created_at) WHERE status IN ('pending', 'processing');
CREATE INDEX IF NOT EXISTS idx_gallery_publishable ON gallery_items(created_at) WHERE status = 'published' AND deleted_at IS NULL;

-- ============================================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- ============================================================================

-- Update user plan from subscription
CREATE OR REPLACE FUNCTION sync_user_plan_from_subscription()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET plan = NEW.plan, updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sync_user_plan ON subscriptions;
CREATE TRIGGER trigger_sync_user_plan
AFTER INSERT OR UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION sync_user_plan_from_subscription();

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
DROP TRIGGER IF EXISTS trigger_subscriptions_updated_at ON subscriptions;
DROP TRIGGER IF EXISTS trigger_gallery_updated_at ON gallery_items;
DROP TRIGGER IF EXISTS trigger_process_posts_updated_at ON process_posts;
DROP TRIGGER IF EXISTS trigger_projects_updated_at ON projects;
CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_gallery_updated_at BEFORE UPDATE ON gallery_items FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_process_posts_updated_at BEFORE UPDATE ON process_posts FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER trigger_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ============================================================================
-- SEED DATA (Optional for development)
-- ============================================================================
-- INSERT INTO users (email, name, password_hash, role, plan)
-- VALUES 
--   ('admin@figment.studio', 'Studio Admin', '$2b$10$...', 'admin', 'pro'),
--   ('client@figment.studio', 'Client User', '$2b$10$...', 'client', 'trial');
