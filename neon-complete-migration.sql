-- ============================================
-- COMPLETE NEON DATABASE MIGRATION
-- Generated from Prisma Schema
-- Run this in Neon SQL Editor: https://console.neon.tech/
-- ============================================

-- Note: Using gen_random_uuid() which is built-in to PostgreSQL 13+
-- No extensions required for Neon compatibility

-- ============================================
-- ENUMS
-- ============================================
DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- CORE TABLES
-- ============================================

-- Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'basic',
    status VARCHAR(20) DEFAULT 'active',
    industry VARCHAR(100),
    business_type VARCHAR(100),
    employee_count VARCHAR(50),
    billing_email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    country VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'Asia/Karachi',
    currency VARCHAR(10) DEFAULT 'PKR',
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW(),
    deleted_at TIMESTAMPTZ(6)
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    name VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP(6) DEFAULT NOW(),
    updated_at TIMESTAMP(6) DEFAULT NOW(),
    deleted_at TIMESTAMP(6),
    organization_id UUID REFERENCES organizations(id),
    permissions JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_by UUID
);

-- ============================================
-- SUPPORT TABLES
-- ============================================

-- Tickets Table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ticket_status DEFAULT 'OPEN',
    priority ticket_priority DEFAULT 'MEDIUM',
    category VARCHAR(100) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);

-- Ticket Replies Table
CREATE TABLE IF NOT EXISTS ticket_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket_id ON ticket_replies(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_replies_user_id ON ticket_replies(user_id);

-- ============================================
-- PRODUCT & INVENTORY TABLES
-- ============================================

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    organization_id UUID,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6)
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2),
    stock INT DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'Unit',
    category_id UUID REFERENCES categories(id),
    organization_id UUID,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6)
);

-- ============================================
-- TRANSACTION TABLES
-- ============================================

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'PKR',
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_organization ON transactions(organization_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Transaction Items Table
CREATE TABLE IF NOT EXISTS transaction_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL
);

-- ============================================
-- SUBSCRIPTION & BILLING TABLES
-- ============================================

-- Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    current_period_start TIMESTAMPTZ(6) NOT NULL,
    current_period_end TIMESTAMPTZ(6) NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMPTZ(6),
    trial_start TIMESTAMPTZ(6),
    trial_end TIMESTAMPTZ(6),
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_organization ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES subscriptions(id),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'PKR',
    status VARCHAR(20) DEFAULT 'draft',
    due_date TIMESTAMPTZ(6),
    paid_at TIMESTAMPTZ(6),
    pdf_url TEXT,
    created_at TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_organization ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- ============================================
-- NOTIFICATION TABLES
-- ============================================

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info',
    priority VARCHAR(20) DEFAULT 'medium',
    read BOOLEAN DEFAULT false,
    metadata JSONB,
    expires_at TIMESTAMPTZ(6),
    action_url VARCHAR(500),
    action_label VARCHAR(100),
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6)
);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_metadata_gin ON notifications USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_priority_created ON notifications(user_id, priority, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_created ON notifications(user_id, read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_type_created ON notifications(user_id, type, created_at DESC);

-- Notification Preferences Table
CREATE TABLE IF NOT EXISTS notification_preferences (
    user_id UUID PRIMARY KEY,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    desktop_notifications BOOLEAN DEFAULT true,
    mute_until TIMESTAMPTZ(6),
    excluded_types VARCHAR(20)[] DEFAULT '{}',
    digest_frequency VARCHAR(20) DEFAULT 'realtime',
    role_specific_filters JSONB DEFAULT '{}'
);

-- ============================================
-- ANALYTICS & LOGGING TABLES
-- ============================================

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'success',
    created_at TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_organization ON activity_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);

-- Analytics Data Table
CREATE TABLE IF NOT EXISTS analytics_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15, 2) NOT NULL,
    dimensions JSONB,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    UNIQUE(organization_id, date, metric_name)
);

CREATE INDEX IF NOT EXISTS idx_analytics_data_org_date ON analytics_data(organization_id, date);

-- Audit Trails Table
CREATE TABLE IF NOT EXISTS audit_trails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_trails_entity ON audit_trails(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_trails_user ON audit_trails(user_id);

-- System Logs Table
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_system_logs_created ON system_logs(created_at);

-- ============================================
-- SECURITY & SESSION TABLES
-- ============================================

-- API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    permissions JSONB,
    last_used_at TIMESTAMPTZ(6),
    expires_at TIMESTAMPTZ(6),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW()
);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMPTZ(6) NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW()
);

-- ============================================
-- ONBOARDING & INVITATIONS
-- ============================================

-- Onboarding Progress Table
CREATE TABLE IF NOT EXISTS onboarding_progress (
    organization_id UUID NOT NULL,
    step_id VARCHAR(100) NOT NULL,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ(6),
    UNIQUE(organization_id, step_id)
);

CREATE INDEX IF NOT EXISTS idx_onboarding_progress_organization ON onboarding_progress(organization_id);

-- User Invitations Table
CREATE TABLE IF NOT EXISTS user_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    invited_by UUID NOT NULL,
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    expires_at TIMESTAMPTZ(6) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_invitations_organization ON user_invitations(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_invitations_email ON user_invitations(email);
CREATE INDEX IF NOT EXISTS idx_user_invitations_token ON user_invitations(token);

-- Role Permissions Table
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    role_name VARCHAR(50) NOT NULL,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ(6) DEFAULT NOW(),
    updated_at TIMESTAMPTZ(6) DEFAULT NOW(),
    UNIQUE(organization_id, role_name)
);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default system settings
INSERT INTO system_settings (key, value) VALUES 
    ('maintenance_mode', 'false'),
    ('app_version', '"1.0.0"'),
    ('registration_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- Insert test users
INSERT INTO users (id, email, password_hash, first_name, last_name, name, role, is_active, created_at, updated_at)
VALUES 
    ('user-superadmin-001', 'superadmin@hybridpos.pk', '$2b$10$zs8Kfc/TdShixhPsmeWEnu2hm3Mdn0cyssoEpymlpE0h4Ea9ij6Eq', 'Super', 'Admin', 'Super Admin', 'SUPER_ADMIN', true, NOW(), NOW()),
    ('user-admin-001', 'admin@hybridpos.pk', '$2b$10$zs8Kfc/TdShixhPsmeWEnu2hm3Mdn0cyssoEpymlpE0h4Ea9ij6Eq', 'Admin', 'User', 'Admin User', 'ADMIN', true, NOW(), NOW()),
    ('user-regular-001', 'user@hybridpos.pk', '$2b$10$zs8Kfc/TdShixhPsmeWEnu2hm3Mdn0cyssoEpymlpE0h4Ea9ij6Eq', 'Regular', 'User', 'Regular User', 'USER', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 'Migration completed successfully!' AS status;
SELECT COUNT(*) AS user_count FROM users;
SELECT id, email, role FROM users;
