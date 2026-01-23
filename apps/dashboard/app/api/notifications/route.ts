import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NotificationService } from "@/lib/services/notification.service"
import { NotificationModel } from "@/lib/models/notification.model"
import { UserRole } from "@/lib/types/notification"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json({
        notifications: [],
        unreadCount: 0,
        roleBasedCounts: { all: 0 },
        pagination: { limit: 10, offset: 0, total: 0 }
      })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const type = searchParams.get("type")
    const role = searchParams.get("role") as UserRole | null

    // Get notifications based on user's role
    const result = await NotificationService.getNotificationsByUserRole(
      session.user.id,
      session.user.role as UserRole,
      {
        limit,
        offset,
        unreadOnly,
      }
    );

    // Apply additional filters
    let filteredNotifications = result.notifications;
    
    if (type && type !== 'all') {
      filteredNotifications = filteredNotifications.filter(n => n.type === type);
    }
    
    if (role && role !== 'all') {
      filteredNotifications = filteredNotifications.filter(n => 
        n.metadata?.role === role
      );
    }

    return NextResponse.json({
      notifications: filteredNotifications,
      unreadCount: result.unreadCount,
      roleBasedCounts: result.roleBasedCounts,
      userRole: session.user.role,
      pagination: {
        limit,
        offset,
        total: filteredNotifications.length,
      },
    })
  } catch (error) {
    console.error("Failed to fetch notifications:", error)
    return NextResponse.json(
      { 
        notifications: [],
        unreadCount: 0,
        roleBasedCounts: { all: 0 },
        error: "Failed to fetch notifications" 
      },
      { status: 500 }
    )
  }
}

// API endpoint to send test notifications
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, userId, role, title, message, type } = body

    // Only super admins can send notifications to others
    if (session.user.role !== 'SUPER_ADMIN' && (userId || role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    switch (action) {
      case 'send_test_superadmin':
        await NotificationService.sendSuperAdminNotification(
          title || "Super Admin Test Notification",
          message || "This is a test notification for Super Admins",
          type || 'info'
        );
        break;

      case 'send_test_admin':
        await NotificationService.sendAdminNotification(
          title || "Admin Test Notification",
          message || "This is a test notification for Admins",
          type || 'info'
        );
        break;

      case 'send_test_user':
        await NotificationService.sendUserNotification(
          title || "User Test Notification",
          message || "This is a test notification for Users",
          type || 'info'
        );
        break;

      case 'send_test_system':
        await NotificationService.sendSystemNotification(
          title || "System Notification",
          message || "This is a system-wide notification",
          type || 'info'
        );
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: "Test notification sent" })
  } catch (error) {
    console.error("Failed to send test notification:", error)
    return NextResponse.json(
      { error: "Failed to send test notification" },
      { status: 500 }
    )
  }
}