import { NotificationModel } from '@/lib/models/notification.model';
import { UserRepository } from '@/lib/repositories/user.repository';
import { CreateNotificationDTO, UserRole } from '@/lib/types/notification';

export class NotificationService {
  /**
   * Send notification to specific user
   */
  static async sendToUser(data: CreateNotificationDTO & { userId: string }): Promise<void> {
    await NotificationModel.create({
      ...data,
      userId: data.userId,
      read: false,
      expiresAt: data.expiresIn ?
        new Date(Date.now() + data.expiresIn * 60 * 60 * 1000) :
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default
    });
  }

  /**
   * Send notification to all users of a specific role
   */
  static async sendToRole(data: CreateNotificationDTO & { role: UserRole }): Promise<void> {
    const userIds = await NotificationModel.getUsersByRole(data.role);

    const promises = userIds.map(userId =>
      NotificationModel.create({
        ...data,
        userId,
        metadata: {
          ...data.metadata,
          role: data.role
        },
        read: false,
        expiresAt: data.expiresIn ?
          new Date(Date.now() + data.expiresIn * 60 * 60 * 1000) :
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      })
    );

    await Promise.all(promises);
  }

  /**
   * Send system-wide notification (all roles)
   */
  static async sendSystemNotification(
    title: string,
    message: string,
    type: 'info' | 'warning' | 'error' = 'info',
    priority: 'low' | 'medium' | 'high' = 'medium'
  ): Promise<void> {
    const allUsers = await UserRepository.findAll();

    const promises = allUsers.map(user =>
      NotificationModel.create({
        userId: user.id,
        title,
        message,
        type,
        priority,
        metadata: {
          role: user.role as UserRole,
          dashboard: 'system'
        },
        read: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      })
    );

    await Promise.all(promises);
  }

  /**
   * Super Admin specific notifications
   */
  static async sendSuperAdminNotification(
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    metadata?: any
  ): Promise<void> {
    await this.sendToRole({
      role: 'SUPER_ADMIN',
      title,
      message,
      type,
      priority: 'medium',
      metadata: {
        ...metadata,
        role: 'SUPER_ADMIN',
        dashboard: 'super-admin'
      }
    });
  }

  /**
   * Admin specific notifications
   */
  static async sendAdminNotification(
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    metadata?: any
  ): Promise<void> {
    await this.sendToRole({
      role: 'ADMIN',
      title,
      message,
      type,
      priority: 'medium',
      metadata: {
        ...metadata,
        role: 'ADMIN',
        dashboard: 'admin'
      }
    });
  }

  /**
   * User specific notifications
   */
  static async sendUserNotification(
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    metadata?: any
  ): Promise<void> {
    await this.sendToRole({
      role: 'USER',
      title,
      message,
      type,
      priority: 'medium',
      metadata: {
        ...metadata,
        role: 'USER',
        dashboard: 'user'
      }
    });
  }

  /**
   * Get notifications filtered by user's role
   */
  static async getNotificationsByUserRole(
    userId: string,
    userRole: UserRole,
    options?: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
    }
  ): Promise<{
    notifications: any[];
    unreadCount: number;
    roleBasedCounts: {
      superAdmin?: number;
      admin?: number;
      user?: number;
      all: number;
    };
  }> {
    // Get all notifications for user
    const allNotifications = await NotificationModel.findByUser(userId, options);

    // Get notifications filtered by user's role
    const roleNotifications = allNotifications.filter(n =>
      !n.metadata?.role || n.metadata.role.toUpperCase() === userRole.toUpperCase()
    );

    // Get unread counts for each role
    const unreadCount = await NotificationModel.getUnreadCountByUserAndRole(userId, userRole);

    // Count notifications by role
    const roleBasedCounts = {
      superAdmin: allNotifications.filter(n => n.metadata?.role?.toUpperCase() === 'SUPER_ADMIN').length,
      admin: allNotifications.filter(n => n.metadata?.role?.toUpperCase() === 'ADMIN').length,
      user: allNotifications.filter(n => n.metadata?.role?.toUpperCase() === 'USER').length,
      all: allNotifications.length
    };

    return {
      notifications: roleNotifications,
      unreadCount,
      roleBasedCounts
    };
  }
}