const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load env
const envPath = '.env.local';
dotenv.config({ path: path.resolve(process.cwd(), envPath) });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('neon.tech') ? { rejectUnauthorized: false } : undefined
});

async function seed() {
    const client = await pool.connect();
    try {
        console.log('🚀 Starting demo seeding...');

        // 1. Get an organization
        const orgRes = await client.query('SELECT id, name FROM organizations LIMIT 1');
        const org = orgRes.rows[0];
        if (!org) {
            console.error('❌ No organization found. Please create one first.');
            return;
        }
        console.log(`📡 Linked to organization: ${org.name}`);

        // 2. Create Demo Invoice
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const random = Math.floor(1000 + Math.random() * 9000);
        const invoice_number = `DEMO-${year}${month}-${random}`;

        await client.query(`
            INSERT INTO invoices (
                id,
                organization_id, 
                invoice_number, 
                amount, 
                currency,
                status, 
                due_date, 
                notes, 
                is_shared,
                shared_at,
                created_at
            )
            VALUES (gen_random_uuid(), $1, $2, $3, 'PKR', 'pending', NOW() + interval '14 days', 'Demo invoice for system walkthrough and reporting demonstration.', true, NOW(), NOW())
            ON CONFLICT (invoice_number) DO NOTHING
        `, [org.id, invoice_number, 25000]);

        console.log(`✅ Demo invoice ${invoice_number} created.`);

        // 3. Since we don't have a reports table, the frontend handles them as mocks.
        // But let's check if we can insert a notification as well for the shared invoice.
        const userRes = await client.query('SELECT id FROM users WHERE organization_id = $1 LIMIT 1', [org.id.toString()]);
        const user = userRes.rows[0];
        if (user) {
            await client.query(`
                INSERT INTO notifications (id, user_id, title, message, type, priority, created_at)
                VALUES (gen_random_uuid(), $1, 'New Invoice Shared', 'A new demo invoice ${invoice_number} has been shared with your organization dashboard.', 'billing', 'high', NOW())
            `, [user.id]);
            console.log(`🔔 Notification sent to user ${user.id}`);
        }

        console.log('✨ Seeding completed successfully!');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
