
const { queryOne } = require('./lib/db');
require('dotenv').config({ path: '.env.local' });

async function verifyAuthQuery() {
    try {
        const email = 'superadmin@hybridpos.pk';
        console.log(`📡 Testing query for ${email}...`);
        const user = await queryOne(
            `SELECT 
        u.*, 
        o.id as organization_id,
        o.name as organization_name,
        o.status as organization_status,
        o.industry as organization_industry
      FROM users u
      LEFT JOIN organizations o ON u.organization_id = o.id
      WHERE u.email = $1 AND u.is_active = true`,
            [email]
        );

        if (user) {
            console.log('✅ Success! Found user and joined with organizations:');
            console.log(`   User ID: ${user.id}`);
            console.log(`   Org Name: ${user.organization_name || 'N/A'}`);
        } else {
            console.log('❌ User not found, but tables exist.');
        }
    } catch (error) {
        console.error('❌ Query failed:', error.message);
        process.exit(1);
    }
}

verifyAuthQuery();
