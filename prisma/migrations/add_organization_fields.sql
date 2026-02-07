-- Add new columns to organizations table for multi-tenant management
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS business_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Pakistan';

-- Update industry column to have proper type constraint
ALTER TABLE organizations 
ALTER COLUMN industry TYPE VARCHAR(100);

-- Add add_ons column to subscriptions table
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS add_ons JSONB;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_organizations_industry ON organizations(industry);
CREATE INDEX IF NOT EXISTS idx_organizations_city ON organizations(city);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);
