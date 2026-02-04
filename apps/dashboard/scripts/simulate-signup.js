
const { db } = require('../lib/db.ts');
const { v4: uuidv4 } = require('uuid');

async function simulateSignup() {
    const organizationId = uuidv4();
    const userId = uuidv4();
    const data = {
        businessName: 'Test Business',
        industry: 'retail',
        adminEmail: 'test-' + Date.now() + '@example.com',
        adminPassword: 'Password123!',
        adminName: 'Test Admin',
        businessType: 'LLC',
        employees: '1-10',
        country: 'US',
        timezone: 'UTC'
    };
    const slug = 'test-business-' + Date.now();

    try {
        await db.query('BEGIN');

        console.log('Inserting organization...');
        await db.query(
            `INSERT INTO organizations (
            id, name, slug, business_type, industry, 
            employee_count, country, timezone, status, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
            [organizationId, data.businessName, slug, data.businessType, data.industry, data.employees, data.country, data.timezone, 'active']
        );

        console.log('Inserting user...');
        await db.query(
            `INSERT INTO users (
            id, organization_id, email, password_hash, name, 
            phone, role, is_active, is_verified, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())`,
            [userId, organizationId, data.adminEmail, 'hashed_pass', data.adminName, '', 'ADMIN', true, true]
        );

        console.log('Inserting onboarding progress...');
        await db.query(
            `INSERT INTO onboarding_progress (organization_id, step_id, completed, completed_at)
            VALUES ($1, 'account-created', true, NOW())`,
            [organizationId]
        );

        console.log('Commiting...');
        await db.query('COMMIT');
        console.log('SUCCESS');
    } catch (error) {
        await db.query('ROLLBACK').catch(() => { });
        console.error('ERROR_CODE:' + error.code);
        console.error('ERROR_MESSAGE:' + error.message);
        console.error('ERROR_DETAIL:' + error.detail);
        console.error('ERROR_TABLE:' + error.table);
        console.error('ERROR_CONSTRAINT:' + error.constraint);
    } finally {
        process.exit();
    }
}

simulateSignup();
