const bcrypt = require('bcryptjs');

async function generateHashes() {
    const users = [
        { email: 'superadmin@hybridpos.pk', password: 'Admin@123', role: 'SUPER_ADMIN' },
        { email: 'admin@hybridpos.pk', password: 'Admin@123', role: 'ADMIN' },
        { email: 'user@hybridpos.pk', password: 'User@123', role: 'USER' }
    ];

    console.log('Generating password hashes...\n');

    for (const user of users) {
        const hash = await bcrypt.hash(user.password, 10);
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${user.password}`);
        console.log(`Role: ${user.role}`);
        console.log(`Hash: ${hash}`);
        console.log('---');
    }

    console.log('\n\nSQL INSERT Statements:\n');

    for (const user of users) {
        const hash = await bcrypt.hash(user.password, 10);
        const id = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        console.log(`INSERT INTO "user" (id, name, email, password, role, "createdAt", "updatedAt")`);
        console.log(`VALUES ('${id}', '${user.role}', '${user.email}', '${hash}', '${user.role}', NOW(), NOW());`);
        console.log('');
    }
}

generateHashes().catch(console.error);
