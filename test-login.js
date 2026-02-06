// Test database connection and user lookup
const { query } = require('./lib/db');
const bcrypt = require('bcryptjs');

async function testLogin() {
    const email = 'superadmin@hybridpos.pk';
    const password = 'Admin@123';

    console.log('Testing login for:', email);

    try {
        // Check if user exists
        const result = await query(
            'SELECT id, email, password, role FROM "user" WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            console.log('❌ User not found in database');
            return;
        }

        const user = result.rows[0];
        console.log('✅ User found:', { id: user.id, email: user.email, role: user.role });

        // Test password
        const isValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isValid);

        if (isValid) {
            console.log('✅ Login would succeed!');
        } else {
            console.log('❌ Password does not match');

            // Generate new hash for comparison
            const newHash = await bcrypt.hash(password, 10);
            console.log('\nNew hash for password "Admin@123":');
            console.log(newHash);
            console.log('\nStored hash:');
            console.log(user.password);
        }

    } catch (error) {
        console.error('❌ Database error:', error.message);
    }

    process.exit(0);
}

testLogin();
