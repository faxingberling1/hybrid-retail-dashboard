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
                    // Determine redirect URL based on user role
                    const targetUserRole = ticket.user?.role?.toUpperCase() || 'USER';
                    let actionUrl = '/user/support';

                    if (targetUserRole === 'ADMIN' || targetUserRole === 'MANAGER') {
                        actionUrl = '/admin/support';
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
                            metadata: { ticket_id: ticket.id, reply_id: reply.id, role: targetUserRole }
                        }
                    });
                } catch (notifyError) {
                    console.error('Failed to notify user about reply:', notifyError);
                }
            }

            // If it's an Org Admin replying, we might still want to notify Super Admins
            if (isOrgAdmin) {
                await notifySuperAdmins(id, ticket.subject, session.user.name || session.user.email, reply.id);
            }
        } else {
            // Regular User replied, notify Super Admins AND Org Admins
            await notifySuperAdmins(id, ticket.subject, session.user.name || session.user.email, reply.id);
            await notifyOrgAdmins(ticket.user?.organization_id || undefined, id, ticket.subject, session.user.name || session.user.email, reply.id);
        }

        return NextResponse.json(reply, { status: 201 });
    } catch (error) {
        console.error('Error creating reply:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function notifySuperAdmins(ticketId: string, subject: string, senderName: string, replyId: string) {
    try {
        const superAdmins = await prisma.user.findMany({
            where: { role: { in: ['SUPER_ADMIN', 'SUPERADMIN'] } },
            select: { id: true }
        });

        if (superAdmins.length > 0) {
            const notifications = superAdmins.map((admin: any) => ({
                user_id: admin.id,
                title: 'New Reply in Ticket',
                message: `${senderName} replied to "${subject}".`,
                type: 'info',
                priority: 'low',
                action_url: `/super-admin/support?ticketId=${ticketId}`,
                action_label: 'View Reply',
                metadata: { ticket_id: ticketId, reply_id: replyId }
            }));

            await (prisma as any).notifications.createMany({
                data: notifications
            });
        }
    } catch (error) {
        console.error('Failed to notify super admins:', error);
    }
}

async function notifyOrgAdmins(orgId: string | undefined, ticketId: string, subject: string, senderName: string, replyId: string) {
    if (!orgId) return;
    try {
        const orgAdmins = await prisma.user.findMany({
            where: {
                organization_id: orgId,
                role: { in: ['ADMIN', 'MANAGER'] }
            },
            select: { id: true }
        });

        if (orgAdmins.length > 0) {
            const notifications = orgAdmins.map((admin: any) => ({
                user_id: admin.id,
                title: 'New Reply in Organization Ticket',
                message: `${senderName} replied to "${subject}".`,
                type: 'info',
                priority: 'low',
                action_url: `/admin/support?ticketId=${ticketId}`,
                action_label: 'View Reply',
                metadata: { ticket_id: ticketId, reply_id: replyId }
            }));

            await (prisma as any).notifications.createMany({
                data: notifications
            });
        }
    } catch (error) {
        console.error('Failed to notify organization admins:', error);
    }
}
