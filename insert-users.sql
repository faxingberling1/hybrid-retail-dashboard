-- Insert Test Users into Neon Database
-- Simple version without ON CONFLICT

-- Delete existing users first (if any)
DELETE FROM users WHERE email IN ('superadmin@hybridpos.pk', 'admin@hybridpos.pk', 'user@hybridpos.pk');

-- Insert Super Admin
INSERT INTO users (id, email, password_hash, first_name, last_name, name, role, is_active, created_at, updated_at)
VALUES (
    'e1b7ad82-b1cb-474c-95f5-0a76613130c0',
    'superadmin@hybridpos.pk',
    '$2b$10$zs8Kfc/TdShixhPsmeWEnu2hm3Mdn0cyssoEpymlpE0h4Ea9ij6Eq',
    'Super',
    'Admin',
    'Super Admin',
    'SUPER_ADMIN',
    true,
    NOW(),
    NOW()
);

-- Insert Admin User
INSERT INTO users (id, email, password_hash, first_name, last_name, name, role, is_active, created_at, updated_at)
VALUES (
    'a2c8be93-c2dc-585d-a6g6-1b87724241d1',
    'admin@hybridpos.pk',
    '$2b$10$zs8Kfc/TdShixhPsmeWEnu2hm3Mdn0cyssoEpymlpE0h4Ea9ij6Eq',
    'Admin',
    'User',
    'Admin User',
    'ADMIN',
    true,
    NOW(),
    NOW()
);

-- Insert Regular User
INSERT INTO users (id, email, password_hash, first_name, last_name, name, role, is_active, created_at, updated_at)
VALUES (
    'b3d9cf04-d3ed-696e-b7h7-2c98835352e2',
    'user@hybridpos.pk',
    '$2b$10$zs8Kfc/TdShixhPsmeWEnu2hm3Mdn0cyssoEpymlpE0h4Ea9ij6Eq',
    'Regular',
    'User',
    'Regular User',
    'USER',
    true,
    NOW(),
    NOW()
);

-- Verify users were inserted
SELECT id, email, role, is_active FROM users ORDER BY role DESC;

-- Login Credentials:
-- superadmin@hybridpos.pk / Admin@123
-- admin@hybridpos.pk / Admin@123
-- user@hybridpos.pk / User@123
