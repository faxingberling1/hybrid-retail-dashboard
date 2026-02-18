import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NotificationService } from "@/lib/services/notification.service"
import { NotificationModel } from "@/lib/models/notification.model"
import { UserRole } from "@/lib/types/notification"

// Helper function to check if a string is a valid UserRole
function isValidUserRole(role: string): role is UserRole {
  const upperRole = role.toUpperCase();
  return upperRole === 'SUPER_ADMIN' || upperRole === 'ADMIN' || upperRole === 'USER'
}

// Helper function to check if a string is a filter role (includes 'all')
function isFilterRole(role: string): boolean {
  return role === 'all' || isValidUserRole(role)
}

export async function GET(request: NextRequest) {
  console.log('🔔 GET /api/notifications triggered');
  try {
    const session = await getServerSession(authOptions)
    console.log('👤 Session lookup:', !!session, session?.user?.email);

    if (!session?.user?.id || !session?.user?.role) {
      console.log('⚠️ No session user id or role found');
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
    const roleParam = searchParams.get("role")

    // Normalize user role from session
    const userRole = session.user.role.toUpperCase() as UserRole;
    console.log('🛠️ Fetching for role:', userRole);

    // Get notifications based on user's role
    const result = await NotificationService.getNotificationsByUserRole(
      session.user.id,
      userRole,
      {
        limit,
        offset,
        unreadOnly,
      }
    );
    console.log('✅ Fetch result:', result.notifications.length, 'notifications found');

    // Apply additional filters
    let filteredNotifications = result.notifications;

    if (type && type !== 'all') {
      filteredNotifications = filteredNotifications.filter(n => n.type === type);
    }

    // Fix: Check if roleParam is a valid filter role and not 'all'
    if (roleParam && roleParam !== 'all' && isValidUserRole(roleParam)) {
      const upperRoleParam = roleParam.toUpperCase();
      filteredNotifications = filteredNotifications.filter(n =>
        n.metadata?.role?.toUpperCase() === upperRoleParam
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
  } catch (error: any) {
    console.error("❌ Failed to fetch notifications:", error.message);
    console.error("📄 Error stack:", error.stack);
    return NextResponse.json(
      {
        notifications: [],
        unreadCount: 0,
        roleBasedCounts: { all: 0 },
        error: "Failed to fetch notifications",
        message: error.message
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