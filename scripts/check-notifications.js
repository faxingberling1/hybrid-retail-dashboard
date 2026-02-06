const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- USERS ---');
    const users = await prisma.user.findMany({
        select: { id: true, email: true, role: true }
    });
    console.table(users);

    console.log('\n--- NOTIFICATIONS ---');
    const notifications = await prisma.notifications.findMany({
        take: 10,
        orderBy: { created_at: 'desc' }
    });
    console.log(JSON.stringify(notifications, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
