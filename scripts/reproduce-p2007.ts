import prisma from '../lib/prisma';

async function reproduce() {
    console.log('--- Reproducing P2007 ---');
    try {
        // Find a user first
        const user = await prisma.user.findFirst();
        if (!user) {
            console.error('No user found to create a ticket for.');
            return;
        }

        console.log(`Using user: ${user.email} (${user.id})`);

        const ticket = await prisma.ticket.create({
            data: {
                subject: 'Test Ticket ' + Date.now(),
                description: 'Test Description',
                priority: 'MEDIUM',
                category: 'Bug Report',
                user_id: user.id,
            },
            select: {
                id: true,
                subject: true,
                description: true,
                status: true,
                priority: true,
                category: true,
                user_id: true,
                created_at: true,
                updated_at: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        email: true,
                        organization_id: true
                    }
                }
            }
        });

        console.log('✅ Ticket created successfully:', ticket.id);
    } catch (error: any) {
        console.error('❌ Error caught:');
        console.error(error);
        if (error.code) console.error('Prisma Error Code:', error.code);
        if (error.meta) console.error('Prisma Error Meta:', JSON.stringify(error.meta, null, 2));
    }
}

reproduce().catch(console.error);
