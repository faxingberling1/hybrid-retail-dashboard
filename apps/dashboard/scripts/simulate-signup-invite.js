
const { db } = require('../lib/db.ts');
const { v4: uuidv4 } = require('uuid');

async function simulateSignup() {
    const organizationId = uuidv4();
    const userId = uuidv4();
    const data = {
        businessName: 'Test Business Invite',
        industry: 'retail',
        adminEmail: 'test-admin-' + Date.now() + '@example.com',
        adminPassword: 'Password123!',
        adminName: 'Test Admin',
        businessType: 'LLC',
        employees: '1-10',
        country: 'US',
        timezone: 'UTC',
        userEmails: ['invitee-' + Date.now() + '@example.com'],
        userRoles: ['USER']
    };
    const slug = 'test-business-invite-' + Date.now();

    try {
        await db.query('BEGIN');

        console.log('Inserting organization...');
        await db.query(`INSERT INTO organizations (id, name, slug, status) VALUES ($1, $2, $3, $4)`, [organizationId, data.businessName, slug, 'active']);

        console.log('Inserting user...');
        await db.query(`INSERT INTO users (id, organization_id, email, password_hash, name, role) VALUES ($1, $2, $3, $4, $5, $6)`, [userId, organizationId, data.adminEmail, 'hash', data.adminName, 'ADMIN']);

        console.log('Inserting invitation...');
        const invitedUserId = uuidv4();
        const inviteToken = uuidv4();
        await db.query(
            `INSERT INTO user_invitations (
              id, organization_id, email, role, token, 
              invited_by, created_at, expires_at
            ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW() + INTERVAL '7 days')`,
            [invitedUserId, organizationId, data.userEmails[0], data.userRoles[0], inviteToken, userId]
        );

        console.log('Commiting...');
        await db.query('COMMIT');
        console.log('SUCCESS');
    } catch (error) {
        await db.query('ROLLBACK').catch(() => { });
        console.error('ERROR_CODE:' + error.code);
        console.error('ERROR_MESSAGE:' + error.message);
        console.error('ERROR_DETAIL:' + error.detail);
        console.error('ERROR_CONSTRAINT:' + error.constraint);
    } finally {
        process.exit();
    }
}

simulateSignup();
