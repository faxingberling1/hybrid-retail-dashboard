import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'SUPERADMIN')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = (page - 1) * limit;

        const action = searchParams.get('action');
        const entityType = searchParams.get('entityType');
        const userId = searchParams.get('userId');
        const organizationId = searchParams.get('organizationId');

        const where: any = {};
        if (action) where.action = action;
        if (entityType) where.entity_type = entityType;
        if (userId) where.user_id = userId;
        if (organizationId) where.organization_id = organizationId;

        const [logs, total] = await Promise.all([
            (prisma as any).activity_logs.findMany({
                where,
                include: {
                    organizations: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                },
                skip,
                take: limit
            }),
            (prisma as any).activity_logs.count({ where })
        ]);

        return NextResponse.json({
            logs,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error: any) {
        console.error('Error fetching audit logs:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: error.message }, { status: 500 });
    }
}
