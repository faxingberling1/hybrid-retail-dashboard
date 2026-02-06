-- Neon Database Setup Script (CORRECTED)
-- Run this in Neon SQL Editor: https://console.neon.tech/

-- ============================================
-- STEP 1: Create Users Table (matches auth.ts schema)
-- ============================================
CREATE TABLE IF NOT EXISTS "users" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    name TEXT,
    role TEXT DEFAULT 'USER',
    avatar_url TEXT,
    organization_id TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STEP 2: Create Organizations Table
-- ============================================
CREATE TABLE IF NOT EXISTS "organizations" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    industry TEXT,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- STEP 3: Create System Settings Table
-- ============================================
CREATE TABLE IF NOT EXISTS "system_settings" (
    key TEXT PRIMARY KEY,
    value TEXT,
    created_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Insert default maintenance mode setting
INSERT INTO "system_settings" (key, value)
VALUES ('maintenance_mode', 'false')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- STEP 4: Insert Test Users
-- ============================================

-- Super Admin User
-- Email: superadmin@hybridpos.pk
-- Password: Admin@123
INSERT INTO "users" (id, email, password_hash, first_name, last_name, name, role, is_active, created_at, updated_at)
VALUES (
    'user-superadmin-001',
    'superadmin@hybridpos.pk',
    '$2b$10$zs8Kfc/TdShixhPsmeWEnu2hm3Mdn0cyssoEpymlpE0h4Ea9ij6Eq',
    'Super',
    'Admin',
    'Super Admin',
    'SUPER_ADMIN',
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Admin User
-- Email: admin@hybridpos.pk
-- Password: Admin@123
INSERT INTO "users" (id, email, password_hash, first_name, last_name, name, role, is_active, created_at, updated_at)
VALUES (
    'user-admin-001',
    'admin@hybridpos.pk',
    '$2b$10$zs8Kfc/TdShixhPsmeWEnu2hm3Mdn0cyssoEpymlpE0h4Ea9ij6Eq',
    'Admin',
    'User',
    'Admin User',
    'ADMIN',
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Regular User
-- Email: user@hybridpos.pk
-- Password: User@123
INSERT INTO "users" (id, email, password_hash, first_name, last_name, name, role, is_active, created_at, updated_at)
VALUES (
    'user-regular-001',
    'user@hybridpos.pk',
    '$2b$10$zs8Kfc/TdShixhPsmeWEnu2hm3Mdn0cyssoEpymlpE0h4Ea9ij6Eq',
    'Regular',
    'User',
    'Regular User',
    'USER',
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- STEP 5: Verify Users Created
-- ============================================
SELECT id, email, first_name, last_name, role, is_active, created_at FROM "users";

-- ============================================
-- Login Credentials Summary
-- ============================================
-- Super Admin:
--   Email: superadmin@hybridpos.pk
--   Password: Admin@123
--
-- Admin:
--   Email: admin@hybridpos.pk
--   Password: Admin@123
--
-- User:
--   Email: user@hybridpos.pk
--   Password: User@123
