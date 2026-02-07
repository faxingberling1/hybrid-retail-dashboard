import prisma from '../lib/prisma';

async function testTickets() {
    try {
        console.log('Testing Ticket.findMany...');
        const tickets = await prisma.ticket.findMany({
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
                        email: true,
                        organization_id: true
                    }
                },
                _count: {
                    select: { replies: true }
                }
            },
            take: 5
        });
        console.log('Success! Found', tickets.length, 'tickets');
        if (tickets.length > 0) {
            console.log('First ticket sample:', JSON.stringify(tickets[0], null, 2));
        }
    } catch (error: any) {
        console.error('❌ Error in testTickets:', error);
        if (error.code) console.error('Prisma Error Code:', error.code);
        if (error.meta) console.error('Prisma Error Meta:', error.meta);
    } finally {
        // We don't need to disconnect prisma here as the process will end
    }
}

testTickets();
