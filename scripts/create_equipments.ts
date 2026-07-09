import { db } from '../lib/db';

async function main() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS equipments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        type VARCHAR(50) DEFAULT 'Hardware',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ(6) DEFAULT now(),
        updated_at TIMESTAMPTZ(6) DEFAULT now()
      );
    `);
    console.log('Equipments table created successfully.');
  } catch (err) {
    console.error('Error creating table:', err);
  }
}

main();
