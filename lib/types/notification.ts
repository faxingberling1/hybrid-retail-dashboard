export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  read: boolean;
  metadata?: {
    role?: UserRole;
    dashboard?: string;
    entityId?: string;
    entityType?: string;
    [key: string]: any;
  };
  createdAt: Date;
  expiresAt?: Date;
  actionUrl?: string;
  actionLabel?: string;
}

export interface CreateNotificationDTO {
  userId?: string; // If not provided, will send to all users of specified role
  title: string;
  message: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  metadata?: {
    role?: UserRole;
    dashboard?: string;
    entityId?: string;
    entityType?: string;
    [key: string]: any;
  };
  expiresIn?: number; // hours
  actionUrl?: string;
  actionLabel?: string;
  role?: UserRole; // Send to all users with this role
}