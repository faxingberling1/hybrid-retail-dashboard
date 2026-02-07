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
        const userRole = (session.user.role as string)?.toUpperCase();
        const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'SUPERADMIN';
        const isAdmin = userRole === 'ADMIN' || userRole === 'MANAGER';
        const organizationId = session.user.organizationId;

        if (isSuperAdmin) {
            // Super admins see everything
        } else if (isAdmin && organizationId) {
            // Admins/Managers see all tickets in their organization
            where.user = {
                organization_id: organizationId
            };
        } else {
            // Regular users see only their own tickets
            where.user_id = session.user.id;
        }

        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (category) where.category = category;

        const tickets = await prisma.ticket.findMany({
            where,
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
            orderBy: { updated_at: 'desc' }
        });

        return NextResponse.json(tickets);
    } catch (error: any) {
        console.error('Error fetching tickets:', error);
        return NextResponse.json({
            error: 'Internal Server Error'
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

        const ticket = await prisma.ticket.create({
            data: {
                subject,
                description,
                priority: priority || 'MEDIUM',
                category,
                user_id: session.user.id,
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

        if (!ticket) {
            throw new Error('Failed to create ticket record');
        }

        // Notify Super Admins and Org Admins
        try {
            const superAdmins = await prisma.user.findMany({
                where: {
                    role: { in: ['SUPER_ADMIN', 'SUPERADMIN'] }
                },
                select: { id: true }
            });

            const userOrgId = session.user.organizationId;
            const orgAdmins = userOrgId ? await prisma.user.findMany({
                where: {
                    organization_id: userOrgId,
                    role: { in: ['ADMIN', 'MANAGER'] },
                    id: { not: session.user.id } // Don't notify self
                },
                select: { id: true }
            }) : [];

            const notifications: any[] = [];

            if (superAdmins.length > 0) {
                superAdmins.forEach((admin: any) => {
                    notifications.push({
                        user_id: admin.id,
                        title: 'New Support Ticket',
                        message: `A new ticket "${subject}" has been created by ${session.user.name || session.user.email}.`,
                        type: 'info',
                        priority: 'medium',
                        action_url: `/super-admin/support?ticketId=${ticket.id}`,
                        action_label: 'View Ticket',
                        metadata: { ticket_id: ticket.id }
                    });
                });
            }

            if (orgAdmins.length > 0) {
                orgAdmins.forEach((admin: any) => {
                    notifications.push({
                        user_id: admin.id,
                        title: 'New Organization Ticket',
                        message: `${session.user.name || session.user.email} created a new support ticket: "${subject}".`,
                        type: 'info',
                        priority: 'low',
                        action_url: `/admin/support?ticketId=${ticket.id}`,
                        action_label: 'View Ticket',
                        metadata: { ticket_id: ticket.id }
                    });
                });
            }

            if (notifications.length > 0) {
                await (prisma as any).notifications.createMany({
                    data: notifications
                });
            }
        } catch (notifyError) {
            console.error('Failed to notify admins:', notifyError);
        }

        return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
        console.error('Error creating ticket:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
