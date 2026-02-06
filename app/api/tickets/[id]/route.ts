import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const ticket = await (prisma as any).ticket.findUnique({
            where: { id: params.id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                },
                replies: {
                    include: {
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
        if (
            session.user.role !== 'SUPER_ADMIN' &&
            session.user.role !== 'SUPERADMIN' &&
            ticket.user_id !== session.user.id
        ) {
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
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { status, priority } = body;

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

        // Only Super Admin can update status/priority of others' tickets
        // User can update their own ticket's status to CLOSED maybe?
        const isSuperAdmin = session.user.role === 'SUPER_ADMIN' || session.user.role === 'SUPERADMIN';
        if (!isSuperAdmin && ticket.user_id !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Restrictions for non-admins
        if (!isSuperAdmin && priority) {
            return NextResponse.json({ error: 'Only admins can change priority' }, { status: 403 });
        }

        const updatedTicket = await (prisma as any).ticket.update({
            where: { id: params.id },
            data: {
                ...(status && { status }),
                ...(priority && { priority }),
            }
        });

        // Notify user if updated by Super Admin
        if (isSuperAdmin && ticket.user_id !== session.user.id) {
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
                            title: 'Ticket Updated',
                            message,
                            type: 'info',
                            priority: 'medium',
                            action_url: `${actionUrl}?ticketId=${ticket.id}`,
                            action_label: 'View Ticket',
                            metadata: { ticket_id: ticket.id, role: userRole }
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
