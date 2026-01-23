'use client';

import { useState, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';
import { useNotification } from '@/lib/hooks/use-notification';
import { NotificationDropdown } from '@/components/ui/notification-dropdown';

export function NotificationBell() {
  const { unreadCount, notifications } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}