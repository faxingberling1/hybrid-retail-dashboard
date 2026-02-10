-- Clear existing if needed (Optional, but let's use ON CONFLICT instead)

-- Seed Plans
INSERT INTO plans (id, name, price, interval, features, is_active)
VALUES 
  (gen_random_uuid(), 'Essential Core', 4999, 'month', ARRAY['Basic POS Engine', 'Single Branch License', 'Mobile Dashboard', 'Daily Email Reports'], true),
  (gen_random_uuid(), 'Business Pro', 14999, 'month', ARRAY['Advanced Analytics', '5-Branch Network', 'Multi-User Hierarchy', 'Priority Support', 'API Access'], true),
  (gen_random_uuid(), 'Enterprise Quantum', 49999, 'month', ARRAY['Unlimited Branches', 'AI-Vision Inventory', 'Dedicated Success Manager', 'Full System Customization', 'Legacy Sync Hub'], true)
ON CONFLICT (name) DO UPDATE 
SET price = EXCLUDED.price, features = EXCLUDED.features, is_active = EXCLUDED.is_active;

-- Seed Addons
INSERT INTO addons (id, name, description, price, icon, is_active)
VALUES 
  (gen_random_uuid(), 'AI Inventory Predictor', 'Use machine learning to forecast stock requirements and prevent outages.', 2500, 'Zap', true),
  (gen_random_uuid(), 'WhatsApp Business Hub', 'Automated receipts and notifications via WhatsApp for your customers.', 1500, 'MessageSquare', true),
  (gen_random_uuid(), 'Cloud Backup Pro', 'Encrypted off-site storage for your critical transaction logs and data.', 3000, 'Shield', true)
ON CONFLICT (name) DO UPDATE 
SET price = EXCLUDED.price, description = EXCLUDED.description, icon = EXCLUDED.icon, is_active = EXCLUDED.is_active;
