import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const category = searchParams.get('category');

        const where: any = {};

        // Role-based access control
        if (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'SUPERADMIN') {
            where.user_id = session.user.id;
        }

        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (category) where.category = category;

        const tickets = await (prisma as any).ticket.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                _count: {
                    select: { replies: true }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json(tickets);
    } catch (error: any) {
        console.error('Error fetching tickets:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { subject, description, priority, category } = body;

        if (!subject || !description || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const ticket = await (prisma as any).ticket.create({
            data: {
                subject,
                description,
                priority: priority || 'MEDIUM',
                category,
                user_id: session.user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        // Notify Super Admins
        try {
            const superAdmins = await (prisma as any).user.findMany({
                where: {
                    role: 'SUPER_ADMIN'
                },
                select: { id: true }
            });

            if (superAdmins.length > 0) {
                const notifications = superAdmins.map((admin: any) => ({
                    user_id: admin.id,
                    title: 'New Support Ticket',
                    message: `A new ticket "${subject}" has been created by ${session.user.name || session.user.email}.`,
                    type: 'info',
                    priority: 'medium',
                    action_url: `/super-admin/support?ticketId=${ticket.id}`,
                    action_label: 'View Ticket',
                    metadata: { ticket_id: ticket.id }
                }));

                await (prisma as any).notifications.createMany({
                    data: notifications
                });
            }
        } catch (notifyError) {
            console.error('Failed to notify super admins:', notifyError);
            // Don't fail the request if notifications fail
        }

        return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
        console.error('Error creating ticket:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
