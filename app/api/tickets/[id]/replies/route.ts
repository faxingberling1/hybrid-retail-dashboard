import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { message } = await request.json();
        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const ticket = await prisma.ticket.findUnique({
            where: { id },
            select: {
                id: true,
                subject: true,
                user_id: true,
                user: {
                    select: {
                        role: true,
                        organization_id: true
                    }
                }
            }
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        // Role-based access control
        const userRole = (session.user.role as string)?.toUpperCase();
        const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'SUPERADMIN';
        const isAdmin = userRole === 'ADMIN' || userRole === 'MANAGER';
        const isOwner = ticket.user_id === session.user.id;
        const organizationId = session.user.organizationId;
        const isOrgAdmin = isAdmin && ticket.user?.organization_id === organizationId;

        if (!isSuperAdmin && !isOwner && !isOrgAdmin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const reply = await prisma.ticketReply.create({
            data: {
                message,
                ticket_id: id,
                user_id: session.user.id,
            },
            select: {
                id: true,
                message: true,
                user_id: true,
                created_at: true,
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
        await prisma.ticket.update({
            where: { id },
            data: { updated_at: new Date() }
        });

        // Automatically update ticket status if super admin or org admin replies
        if (isSuperAdmin || isOrgAdmin) {
            await prisma.ticket.update({
                where: { id },
                data: { status: 'IN_PROGRESS' }
            });

            // Notify user about the reply
            if (ticket.user_id !== session.user.id) {
                try {
                    const { NotificationService } = await import('@/lib/services/notification.service');

                    // Determine redirect URL based on user role
                    const targetUserRole = ticket.user?.role?.toUpperCase() || 'USER';
                    let actionUrl = '/user/support';

                    if (targetUserRole === 'ADMIN' || targetUserRole === 'MANAGER') {
                        actionUrl = '/admin/support';
                    }

                    await NotificationService.sendToUser({
                        userId: ticket.user_id,
                        title: 'New Reply Received',
                        message: `Support has replied to your ticket "${ticket.subject}".`,
                        type: 'info',
                        priority: 'medium',
                        metadata: {
                            ticket_id: ticket.id,
                            reply_id: reply.id,
                            role: targetUserRole as any,
                            action_url: `${actionUrl}?ticketId=${ticket.id}`
                        }
                    });
                } catch (notifyError) {
                    console.error('Failed to notify user about reply:', notifyError);
                }
            }

            // If it's an Org Admin replying, we might still want to notify Super Admins
            if (isOrgAdmin) {
                try {
                    const { NotificationService } = await import('@/lib/services/notification.service');
                    await NotificationService.sendSuperAdminNotification(
                        'New Org Admin Reply',
                        `Org Admin ${session.user.name || session.user.email} replied to ticket "${ticket.subject}".`,
                        'info',
                        {
                            ticket_id: ticket.id,
                            reply_id: reply.id,
                            action_url: `/super-admin/support?ticketId=${ticket.id}`
                        }
                    );
                } catch (err) {
                    console.error('Failed to notify super admins about org admin reply:', err);
                }
            }
        } else {
            // Regular User replied, notify Super Admins AND Org Admins
            try {
                const { NotificationService } = await import('@/lib/services/notification.service');

                // Notify Super Admins
                await NotificationService.sendSuperAdminNotification(
                    'New Ticket Reply',
                    `${session.user.name || session.user.email} replied to ticket "${ticket.subject}".`,
                    'info',
                    {
                        ticket_id: ticket.id,
                        reply_id: reply.id,
                        action_url: `/super-admin/support?ticketId=${ticket.id}`
                    }
                );

                // Notify Org Admins
                if (ticket.user?.organization_id) {
                    const orgAdmins = await prisma.user.findMany({
                        where: {
                            organization_id: ticket.user.organization_id,
                            role: { in: ['ADMIN', 'MANAGER'] },
                            id: { not: session.user.id }
                        },
                        select: { id: true }
                    });

                    for (const admin of orgAdmins) {
                        await NotificationService.sendToUser({
                            userId: admin.id,
                            title: 'New Ticket Reply (Org)',
                            message: `${session.user.name || session.user.email} replied to ticket "${ticket.subject}".`,
                            type: 'info',
                            priority: 'low',
                            metadata: {
                                ticket_id: ticket.id,
                                reply_id: reply.id,
                                role: 'ADMIN',
                                dashboard: 'admin',
                                action_url: `/admin/support?ticketId=${ticket.id}`
                            }
                        });
                    }
                }
            } catch (err) {
                console.error('Failed to notify admins about user reply:', err);
            }
        }

        return NextResponse.json(reply, { status: 201 });
    } catch (error) {
        console.error('Error creating reply:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
