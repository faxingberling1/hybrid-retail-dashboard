-- supabase-clean-import.sql
-- Clean import for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 1. USERS TABLE (Most Important)
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    two_factor_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- Insert users (with proper password hashes)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active) VALUES
('0d84911d-2a64-4ae0-95be-00c19c2e4f63', 'superadmin@hybridpos.pk', '$2a$10$K9oI83nd6DHKaovZleBcS.3VnF7p7G.8nH5QN.5L2LwF8rQ2vY5zW', 'Super', 'Admin', 'super_admin', true),
('4afef20b-2007-4bb2-b2f6-682552ba627d', 'admin@hybridpos.pk', '$2a$10$K9oI83nd6DHKaovZleBcS.3VnF7p7G.8nH5QN.5L2LwF8rQ2vY5zW', 'Store', 'Admin', 'admin', true),
('a6807197-f624-4864-bd9f-c48c62badca9', 'user@hybridpos.pk', '$2a$10$K9oI83nd6DHKaovZleBcS.3VnF7p7G.8nH5QN.5L2LwF8rQ2vY5zW', 'Staff', 'User', 'user', true)
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- 2. ORGANIZATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'basic',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    billing_email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    country VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'Asia/Karachi',
    currency VARCHAR(10) DEFAULT 'PKR',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

INSERT INTO organizations (id, name, slug, plan, status) VALUES
('00000000-0000-0000-0000-000000000001', 'Platform Super Admin', 'super-admin-platform', 'enterprise', 'active')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 3. NOTIFICATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'info',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    read BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ,
    action_url VARCHAR(500),
    action_label VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

-- Insert notifications (fixed JSONB)
INSERT INTO notifications (id, user_id, title, message, type, priority, read, metadata, expires_at, action_url, action_label, created_at) VALUES
('7623b463-69a9-4c04-a1e7-918186929888', '0d84911d-2a64-4ae0-95be-00c19c2e4f63', 'System Health Report', 'All systems are operating normally. Last 24h uptime: 99.9%', 'info', 'medium', false, '{}', NULL, '/super-admin/system', 'View System Dashboard', '2026-01-23T18:33:18.956Z'),
('d076ad5e-1583-41f3-8225-2e7eb89ca722', '4afef20b-2007-4bb2-b2f6-682552ba627d', 'Daily Sales Summary', 'Your store processed 156 orders totaling $12,450 yesterday', 'success', 'low', false, '{}', NULL, '/admin/dashboard', 'Go to Dashboard', '2026-01-23T18:33:18.956Z'),
('1bea6720-f212-490a-9fc8-b4aa016edf2e', 'a6807197-f624-4864-bd9f-c48c62badca9', 'Task Assignment', 'You have been assigned 3 new tasks for today', 'info', 'medium', false, '{}', NULL, '/user/tasks', 'View Tasks', '2026-01-23T18:33:18.956Z')
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 4. OTHER TABLES (Optional - Can skip for now)
-- ========================================
CREATE TABLE IF NOT EXISTS notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN NOT NULL DEFAULT true,
    push_notifications BOOLEAN NOT NULL DEFAULT true,
    desktop_notifications BOOLEAN NOT NULL DEFAULT true,
    mute_until TIMESTAMPTZ,
    excluded_types VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    digest_frequency VARCHAR(20) NOT NULL DEFAULT 'realtime',
    role_specific_filters JSONB DEFAULT '{}'::JSONB
);

-- ========================================
-- 5. VERIFICATION QUERY
-- ========================================
SELECT '✅ Migration completed successfully!' as message;

SELECT 'Users:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Organizations:', COUNT(*) FROM organizations
UNION ALL
SELECT 'Notifications:', COUNT(*) FROM notifications;

SELECT 'Sample data:' as check_type, email, role FROM users LIMIT 3;