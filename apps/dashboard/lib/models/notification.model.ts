import { query, queryOne, queryAll } from '@/lib/db';
import { Notification, UserRole } from '@/lib/types/notification';

export class NotificationModel {
  /**
   * Create a new notification
   */
  static async create(data: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const sql = `
      INSERT INTO notifications 
      (id, user_id, title, message, type, priority, read, metadata, expires_at, action_url, action_label, created_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      RETURNING *
    `;

    const result = await query(sql, [
      data.userId,
      data.title,
      data.message,
      data.type || 'info',
      data.priority || 'medium',
      data.read || false,
      data.metadata ? JSON.stringify(data.metadata) : null,
      data.expiresAt,
      data.actionUrl,
      data.actionLabel
    ]);

    return this.mapNotification(result.rows[0]);
  }

  /**
   * Find notifications for a specific user with filters
   */
  static async findByUser(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
      types?: string[];
      role?: UserRole;
      dashboard?: string;
      priority?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<Notification[]> {
    let sql = 'SELECT * FROM notifications WHERE user_id = $1';
    const params: any[] = [userId];
    let paramCount = 2;

    if (options?.unreadOnly) {
      sql += ` AND read = false`;
    }

    if (options?.types?.length) {
      sql += ` AND type = ANY($${paramCount})`;
      params.push(options.types);
      paramCount++;
    }

    // Filter by role in metadata
    if (options?.role) {
      sql += ` AND UPPER(metadata->>'role') = UPPER($${paramCount})`;
      params.push(options.role);
      paramCount++;
    }

    // Filter by dashboard in metadata
    if (options?.dashboard) {
      sql += ` AND metadata->>'dashboard' = $${paramCount}`;
      params.push(options.dashboard);
      paramCount++;
    }

    // Filter by priority
    if (options?.priority) {
      sql += ` AND priority = $${paramCount}`;
      params.push(options.priority);
      paramCount++;
    }

    // Filter by date range
    if (options?.startDate) {
      sql += ` AND created_at >= $${paramCount}`;
      params.push(options.startDate);
      paramCount++;
    }

    if (options?.endDate) {
      sql += ` AND created_at <= $${paramCount}`;
      params.push(options.endDate);
      paramCount++;
    }

    sql += ' ORDER BY created_at DESC';

    if (options?.limit) {
      sql += ` LIMIT $${paramCount}`;
      params.push(options.limit);
      paramCount++;
    }

    if (options?.offset) {
      sql += ` OFFSET $${paramCount}`;
      params.push(options.offset);
    }

    const rows = await queryAll(sql, params);
    return rows.map(row => this.mapNotification(row));
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role: UserRole): Promise<string[]> {
    try {
      const rows = await queryAll(
        'SELECT id FROM users WHERE role = $1',
        [role]
      );
      return rows.map((row: any) => row.id);
    } catch (error) {
      console.error('Error getting users by role:', error);

      // Fallback: Return mock data for development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock user IDs for development');
        const mockUsers = {
          'SUPER_ADMIN': ['super-admin-1', 'super-admin-2'],
          'ADMIN': ['admin-1', 'admin-2', 'admin-3'],
          'USER': ['user-1', 'user-2', 'user-3', 'user-4']
        };
        return mockUsers[role] || [];
      }

      throw error;
    }
  }

  /**
   * Get unread count for a user filtered by role
   */
  static async getUnreadCountByUserAndRole(userId: string, role?: UserRole): Promise<number> {
    try {
      let sql = 'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read = false';
      const params: any[] = [userId];

      if (role) {
        sql += ` AND (metadata->>'role' = $2 OR metadata->>'role' IS NULL)`;
        params.push(role);
      }

      const row = await queryOne(sql, params);
      return parseInt(row?.count) || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Get notification statistics for a user
   */
  static async getStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<string, number>;
    byRole: Record<string, number>;
    byPriority: Record<string, number>;
  }> {
    try {
      // Get total and unread counts
      const totalResult = await query(
        'SELECT COUNT(*) FROM notifications WHERE user_id = $1',
        [userId]
      );

      const unreadResult = await query(
        'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND read = false',
        [userId]
      );

      // Get counts by type
      const typeResult = await query(`
        SELECT type, COUNT(*) as count 
        FROM notifications 
        WHERE user_id = $1 
        GROUP BY type
      `, [userId]);

      // Get counts by role from metadata
      const roleResult = await query(`
        SELECT metadata->>'role' as role, COUNT(*) as count 
        FROM notifications 
        WHERE user_id = $1 
        AND metadata->>'role' IS NOT NULL
        GROUP BY metadata->>'role'
      `, [userId]);

      // Get counts by priority
      const priorityResult = await query(`
        SELECT priority, COUNT(*) as count 
        FROM notifications 
        WHERE user_id = $1 
        GROUP BY priority
      `, [userId]);

      const byType: Record<string, number> = {};
      typeResult.rows.forEach((row: any) => {
        byType[row.type] = parseInt(row.count);
      });

      const byRole: Record<string, number> = {};
      roleResult.rows.forEach((row: any) => {
        byRole[row.role] = parseInt(row.count);
      });

      const byPriority: Record<string, number> = {};
      priorityResult.rows.forEach((row: any) => {
        byPriority[row.priority] = parseInt(row.count);
      });

      return {
        total: parseInt(totalResult.rows[0].count) || 0,
        unread: parseInt(unreadResult.rows[0].count) || 0,
        byType,
        byRole,
        byPriority
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return {
        total: 0,
        unread: 0,
        byType: {},
        byRole: {},
        byPriority: {}
      };
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId?: string): Promise<void> {
    let sql = 'UPDATE notifications SET read = true WHERE id = $1';
    const params: any[] = [notificationId];

    if (userId) {
      sql += ' AND user_id = $2';
      params.push(userId);
    }

    await query(sql, params);
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string, options?: {
    role?: UserRole;
    type?: string;
  }): Promise<void> {
    let sql = 'UPDATE notifications SET read = true WHERE user_id = $1';
    const params: any[] = [userId];
    let paramCount = 2;

    if (options?.role) {
      sql += ` AND metadata->>'role' = $${paramCount}`;
      params.push(options.role);
      paramCount++;
    }

    if (options?.type) {
      sql += ` AND type = $${paramCount}`;
      params.push(options.type);
    }

    await query(sql, params);
  }

  /**
   * Delete a notification
   */
  static async delete(notificationId: string, userId?: string): Promise<void> {
    let sql = 'DELETE FROM notifications WHERE id = $1';
    const params: any[] = [notificationId];

    if (userId) {
      sql += ' AND user_id = $2';
      params.push(userId);
    }

    await query(sql, params);
  }

  /**
   * Delete all notifications for a user
   */
  static async deleteAll(userId: string, options?: {
    readOnly?: boolean;
    role?: UserRole;
  }): Promise<void> {
    let sql = 'DELETE FROM notifications WHERE user_id = $1';
    const params: any[] = [userId];
    let paramCount = 2;

    if (options?.readOnly) {
      sql += ` AND read = true`;
    }

    if (options?.role) {
      sql += ` AND metadata->>'role' = $${paramCount}`;
      params.push(options.role);
    }

    await query(sql, params);
  }

  /**
   * Clean up expired notifications
   */
  static async cleanupExpired(): Promise<number> {
    try {
      const result = await query(
        'DELETE FROM notifications WHERE expires_at < NOW() RETURNING id'
      );
      return result.rows.length;
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
      return 0;
    }
  }

  /**
   * Get notifications by metadata criteria
   */
  static async findByMetadata(
    criteria: Record<string, any>,
    options?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<Notification[]> {
    let sql = 'SELECT * FROM notifications WHERE ';
    const params: any[] = [];
    let paramCount = 1;

    const conditions = Object.entries(criteria).map(([key, value]) => {
      params.push(value);
      const condition = `metadata->>'${key}' = $${paramCount}`;
      paramCount++;
      return condition;
    });

    sql += conditions.join(' AND ');

    if (options?.limit) {
      sql += ` LIMIT $${paramCount}`;
      params.push(options.limit);
      paramCount++;
    }

    if (options?.offset) {
      sql += ` OFFSET $${paramCount}`;
      params.push(options.offset);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    return result.rows.map((row: any) => this.mapNotification(row));
  }

  /**
   * Get recent notifications across all users (for super admin)
   */
  static async getRecentNotifications(limit: number = 50): Promise<Notification[]> {
    try {
      const result = await query(
        'SELECT * FROM notifications ORDER BY created_at DESC LIMIT $1',
        [limit]
      );
      return result.rows.map((row: any) => this.mapNotification(row));
    } catch (error) {
      console.error('Error getting recent notifications:', error);
      return [];
    }
  }

  /**
   * Get notification by ID
   */
  static async findById(notificationId: string, userId?: string): Promise<Notification | null> {
    let sql = 'SELECT * FROM notifications WHERE id = $1';
    const params: any[] = [notificationId];

    if (userId) {
      sql += ' AND user_id = $2';
      params.push(userId);
    }

    const row = await queryOne(sql, params);

    if (!row) {
      return null;
    }

    return this.mapNotification(row);
  }

  /**
   * Update notification
   */
  static async update(
    notificationId: string,
    updates: Partial<Omit<Notification, 'id' | 'userId' | 'createdAt'>>
  ): Promise<Notification | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'metadata' && typeof value === 'object') {
          fields.push(`${key} = $${paramCount}`);
          values.push(JSON.stringify(value));
        } else {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return null;
    }

    values.push(notificationId);

    const sql = `
      UPDATE notifications 
      SET ${fields.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await query(sql, values);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapNotification(result.rows[0]);
  }

  /**
   * Create multiple notifications at once
   */
  static async createBatch(notifications: Omit<Notification, 'id' | 'createdAt'>[]): Promise<void> {
    if (notifications.length === 0) {
      return;
    }

    const valuesStrings: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    notifications.forEach((notification) => {
      const valuePlaceholders = [];

      // Generate UUID for each notification
      valuePlaceholders.push(`gen_random_uuid()`);

      // Add user_id
      valuePlaceholders.push(`$${paramCount}`);
      params.push(notification.userId);
      paramCount++;

      // Add title
      valuePlaceholders.push(`$${paramCount}`);
      params.push(notification.title);
      paramCount++;

      // Add message
      valuePlaceholders.push(`$${paramCount}`);
      params.push(notification.message);
      paramCount++;

      // Add type
      valuePlaceholders.push(`$${paramCount}`);
      params.push(notification.type || 'info');
      paramCount++;

      // Add priority
      valuePlaceholders.push(`$${paramCount}`);
      params.push(notification.priority || 'medium');
      paramCount++;

      // Add read status
      valuePlaceholders.push(`$${paramCount}`);
      params.push(notification.read || false);
      paramCount++;

      // Add metadata
      valuePlaceholders.push(`$${paramCount}`);
      params.push(notification.metadata ? JSON.stringify(notification.metadata) : null);
      paramCount++;

      // Add expires_at
      valuePlaceholders.push(`$${paramCount}`);
      params.push(notification.expiresAt || null);
      paramCount++;

      // Add action_url
      valuePlaceholders.push(`$${paramCount}`);
      params.push(notification.actionUrl || null);
      paramCount++;

      // Add action_label
      valuePlaceholders.push(`$${paramCount}`);
      params.push(notification.actionLabel || null);
      paramCount++;

      valuesStrings.push(`(${valuePlaceholders.join(', ')}, NOW())`);
    });

    const sql = `
      INSERT INTO notifications 
      (id, user_id, title, message, type, priority, read, metadata, expires_at, action_url, action_label, created_at)
      VALUES ${valuesStrings.join(', ')}
    `;

    await query(sql, params);
  }

  /**
   * Helper method to map database row to Notification object
   */
  private static mapNotification(row: any): Notification {
    return {
      id: row.id,
      userId: row.user_id,
      title: row.title,
      message: row.message,
      type: row.type,
      priority: row.priority,
      read: row.read,
      metadata: row.metadata || undefined,
      createdAt: new Date(row.created_at),
      expiresAt: row.expires_at ? new Date(row.expires_at) : undefined,
      actionUrl: row.action_url,
      actionLabel: row.action_label
    };
  }

  /**
   * Get paginated notifications with filters
   */
  static async getPaginated(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      unreadOnly?: boolean;
      type?: string;
      role?: UserRole;
      priority?: string;
      search?: string;
    }
  ): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * pageSize;

    const notifications = await this.findByUser(userId, {
      limit: pageSize,
      offset,
      unreadOnly: filters?.unreadOnly,
      types: filters?.type ? [filters.type] : undefined,
      role: filters?.role,
      priority: filters?.priority
    });

    // Get total count with same filters
    let countQuery = 'SELECT COUNT(*) FROM notifications WHERE user_id = $1';
    const countParams: any[] = [userId];
    let paramCount = 2;

    if (filters?.unreadOnly) {
      countQuery += ` AND read = false`;
    }

    if (filters?.type) {
      countQuery += ` AND type = $${paramCount}`;
      countParams.push(filters.type);
      paramCount++;
    }

    if (filters?.role) {
      countQuery += ` AND metadata->>'role' = $${paramCount}`;
      countParams.push(filters.role);
      paramCount++;
    }

    if (filters?.priority) {
      countQuery += ` AND priority = $${paramCount}`;
      countParams.push(filters.priority);
    }

    const countRow = await queryOne(countQuery, countParams);
    const total = parseInt(countRow?.count) || 0;

    return {
      notifications,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }
}