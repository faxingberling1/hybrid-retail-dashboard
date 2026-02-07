import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const ticket = await prisma.ticket.findUnique({
            where: { id },
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
                        role: true,
                        organization_id: true
                    }
                },
                replies: {
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
                    },
                    orderBy: { created_at: 'asc' }
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
        const isSameOrg = isAdmin && ticket.user?.organization_id === organizationId;

        if (!isSuperAdmin && !isOwner && !isSameOrg) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json(ticket);
    } catch (error) {
        console.error('Error fetching ticket:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { status, priority } = body;

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

        // Restrictions for non-admins (only SuperAdmin or OrgAdmin can change priority)
        if (!isSuperAdmin && !isOrgAdmin && priority) {
            return NextResponse.json({ error: 'Only admins can change priority' }, { status: 403 });
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(priority && { priority }),
            },
            select: {
                id: true,
                status: true,
                priority: true,
                updated_at: true
            }
        });

        // Notify user if updated by Super Admin or Org Admin (and not self-update)
        if ((isSuperAdmin || isOrgAdmin) && ticket.user_id !== session.user.id) {
            try {
                let message = '';
                if (status && priority) {
                    message = `Your ticket "${ticket.subject}" has been updated: Status is now ${status} and Priority is ${priority}.`;
                } else if (status) {
                    message = `Your ticket "${ticket.subject}" status has been updated to ${status}.`;
                } else if (priority) {
                    message = `Your ticket "${ticket.subject}" priority has been updated to ${priority}.`;
                }

                if (message) {
                    // Determine redirect URL based on user role
                    const targetUserRole = ticket.user?.role?.toUpperCase() || 'USER';
                    let actionUrl = '/user/support';

                    if (targetUserRole === 'ADMIN' || targetUserRole === 'MANAGER') {
                        actionUrl = '/admin/support';
                    }

                    await (prisma as any).notifications.create({
                        data: {
                            user_id: ticket.user_id,
                            title: 'Ticket Updated',
                            message,
                            type: 'info',
                            priority: 'medium',
                            action_url: `${actionUrl}?ticketId=${ticket.id}`,
                            action_label: 'View Ticket',
                            metadata: { ticket_id: ticket.id, role: targetUserRole }
                        }
                    });
                }
            } catch (notifyError) {
                console.error('Failed to notify user:', notifyError);
            }
        }

        return NextResponse.json(updatedTicket);
    } catch (error) {
        console.error('Error updating ticket:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
