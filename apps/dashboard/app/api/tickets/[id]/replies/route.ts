import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message } = await request.json();
        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const ticket = await (prisma as any).ticket.findUnique({
            where: { id: params.id },
            include: {
                user: {
                    select: {
                        role: true
                    }
                }
            }
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        // Role-based access control
        if (
            session.user.role !== 'SUPER_ADMIN' &&
            session.user.role !== 'SUPERADMIN' &&
            ticket.user_id !== session.user.id
        ) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const reply = await (prisma as any).ticketReply.create({
            data: {
                message,
                ticket_id: params.id,
                user_id: session.user.id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                        email: true,
                    }
                }
            }
        });

        // Always update parent ticket's updated_at for sorting
        await (prisma as any).ticket.update({
            where: { id: params.id },
            data: { updated_at: new Date() }
        });

        // Automatically update ticket status if super admin replies
        if (session.user.role === 'SUPER_ADMIN' || session.user.role === 'SUPERADMIN') {
            await (prisma as any).ticket.update({
                where: { id: params.id },
                data: { status: 'IN_PROGRESS' }
            });

            // Notify user about the reply
            if (ticket.user_id !== session.user.id) {
                try {
                    // Determine redirect URL based on user role
                    const userRole = ticket.user?.role?.toUpperCase() || 'USER';
                    let actionUrl = '/user/support';

                    if (userRole === 'ADMIN') {
                        actionUrl = '/admin/support';
                    } else if (userRole === 'MANAGER') {
                        actionUrl = '/user/support';
                    }

                    await (prisma as any).notifications.create({
                        data: {
                            user_id: ticket.user_id,
                            title: 'New Reply Received',
                            message: `Support has replied to your ticket "${ticket.subject}".`,
                            type: 'info',
                            priority: 'medium',
                            action_url: `${actionUrl}?ticketId=${ticket.id}`,
                            action_label: 'View Reply',
                            metadata: { ticket_id: ticket.id, reply_id: reply.id, role: userRole }
                        }
                    });
                } catch (notifyError) {
                    console.error('Failed to notify user about reply:', notifyError);
                }
            }
        } else {
            // User replied, notify Super Admins
            try {
                const superAdmins = await (prisma as any).user.findMany({
                    where: { role: 'SUPER_ADMIN' },
                    select: { id: true }
                });

                if (superAdmins.length > 0) {
                    const notifications = superAdmins.map((admin: any) => ({
                        user_id: admin.id,
                        title: 'New Reply in Ticket',
                        message: `${session.user.name || session.user.email} replied to "${ticket.subject}".`,
                        type: 'info',
                        priority: 'low',
                        action_url: `/super-admin/support?ticketId=${ticket.id}`,
                        action_label: 'View Reply',
                        metadata: { ticket_id: ticket.id, reply_id: reply.id }
                    }));

                    await (prisma as any).notifications.createMany({
                        data: notifications
                    });
                }
            } catch (notifyError) {
                console.error('Failed to notify super admins about reply:', notifyError);
            }
        }

        return NextResponse.json(reply, { status: 201 });
    } catch (error) {
        console.error('Error creating reply:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
