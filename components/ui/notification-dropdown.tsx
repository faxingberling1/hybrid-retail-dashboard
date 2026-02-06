'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { format, isToday, isYesterday, subDays, isAfter } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
  Bell,
  Trash2,
  CheckCheck
} from 'lucide-react';
import { Notification } from '@/lib/types/notification';

interface NotificationDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

const typeIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle
};

const typeStyles = {
  info: 'bg-blue-50 text-blue-600 border-blue-100',
  success: 'bg-green-50 text-green-600 border-green-100',
  warning: 'bg-orange-50 text-orange-600 border-orange-100',
  error: 'bg-red-50 text-red-600 border-red-100'
};

export function NotificationDropdown({ notifications, onClose }: NotificationDropdownProps) {
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const unreadCount = localNotifications.filter(n => !n.read).length;

  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      });

      setLocalNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      });

      setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      setLocalNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const groupedNotifications = useMemo(() => {
    const filtered = activeTab === 'unread'
      ? localNotifications.filter(n => !n.read)
      : localNotifications;

    const groups: Record<string, Notification[]> = {
      'New': [],
      'Earlier Today': [],
      'Yesterday': [],
      'Last 7 Days': [],
      'Older': []
    };

    filtered.forEach(n => {
      const date = new Date(n.createdAt);
      if (!n.read && isToday(date)) {
        groups['New'].push(n);
      } else if (isToday(date)) {
        groups['Earlier Today'].push(n);
      } else if (isYesterday(date)) {
        groups['Yesterday'].push(n);
      } else if (isAfter(date, subDays(new Date(), 7))) {
        groups['Last 7 Days'].push(n);
      } else {
        groups['Older'].push(n);
      }
    });

    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }, [localNotifications, activeTab]);

  return (
    <motion.div
      {...({
        initial: { opacity: 0, y: 10, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 10, scale: 0.95 },
        transition: { duration: 0.2 },
        className: "absolute right-0 mt-3 w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-100 ring-1 ring-black/5 z-50 overflow-hidden flex flex-col max-h-[85vh]"
      } as any)}
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gray-900 rounded-xl text-white shadow-lg shadow-gray-900/10">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                {unreadCount} Unread
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={markAllAsRead}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
              title="Mark all as read"
            >
              <CheckCheck className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-gray-100/50 rounded-xl border border-gray-100">
          {(['all', 'unread'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto flex-1 custom-scrollbar scroll-smooth">
        {groupedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <Bell className="h-6 w-6 text-gray-300" />
            </div>
            <h4 className="text-gray-900 font-bold mb-1">All Caught Up</h4>
            <p className="text-sm text-gray-500">No notifications to display at the moment.</p>
          </div>
        ) : (
          <div className="pb-4">
            {groupedNotifications.map(([group, items]) => (
              <div key={group}>
                <div className="px-5 py-2.5 bg-gray-50 border-y border-gray-100 sticky top-0 z-0">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{group}</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {items.map(notification => {
                    const Icon = typeIcons[notification.type];
                    return (
                      <motion.div
                        {...({
                          key: notification.id,
                          layout: true,
                          initial: { opacity: 0 },
                          animate: { opacity: 1 },
                          exit: { opacity: 0 },
                          className: `group relative p-5 transition-all hover:bg-gray-50/50 ${!notification.read ? 'bg-blue-50/10' : ''}`
                        } as any)}
                      >
                        {!notification.read && (
                          <div className="absolute left-0 top-6 w-1 h-8 bg-blue-500 rounded-r-full" />
                        )}

                        <div className="flex gap-4">
                          <div className={`shrink-0 p-2.5 rounded-2xl h-fit border ${typeStyles[notification.type]}`}>
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-sm font-bold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notification.title}
                              </h4>
                              <span className="text-[10px] font-medium text-gray-400 shrink-0 ml-2">
                                {format(new Date(notification.createdAt), 'h:mm a')}
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                              {notification.message}
                            </p>

                            <div className="flex items-center gap-3">
                              {notification.actionUrl && (
                                <Link
                                  href={(notification.actionUrl || "#") as any}
                                  onClick={onClose}
                                  className="text-[10px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  {notification.actionLabel || 'View Details'}
                                </Link>
                              )}

                              <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notification.read && (
                                  <button
                                    onClick={(e) => markAsRead(notification.id, e)}
                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Mark as read"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => deleteNotification(notification.id, e)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <Link
          href="/notifications"
          onClick={onClose}
          className="flex items-center justify-center w-full py-2.5 text-xs font-bold text-gray-600 uppercase tracking-widest hover:bg-white hover:text-gray-900 rounded-xl transition-all border border-transparent hover:border-gray-200 hover:shadow-sm"
        >
          View Full Log
        </Link>
      </div>
    </motion.div>
  );
}