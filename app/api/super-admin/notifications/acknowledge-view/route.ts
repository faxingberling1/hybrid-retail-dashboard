import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NotificationService } from "@/lib/services/notification.service";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { category } = await request.json();
        if (!category) {
            return NextResponse.json({ error: 'Category is required' }, { status: 400 });
        }

        await NotificationService.markCategoryAsRead(session.user.id, category);

        return NextResponse.json({ message: `Notifications for ${category} marked as read` });
    } catch (error: any) {
        console.error('❌ Error acknowledging notifications:', error);
        return NextResponse.json(
            { error: 'Failed to acknowledge notifications' },
            { status: 500 }
        );
    }
}
