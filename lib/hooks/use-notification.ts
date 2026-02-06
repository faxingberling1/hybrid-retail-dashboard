"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Notification, UserRole } from "@/lib/types/notification"

interface NotificationResult {
  notifications: Notification[];
  unreadCount: number;
  roleBasedCounts: {
    superAdmin?: number;
    admin?: number;
    user?: number;
    all: number;
  };
  userRole?: UserRole;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useNotification(): NotificationResult {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [roleBasedCounts, setRoleBasedCounts] = useState({
    superAdmin: 0,
    admin: 0,
    user: 0,
    all: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    if (!session?.user?.id) {
      setNotifications([])
      setUnreadCount(0)
      setRoleBasedCounts({ superAdmin: 0, admin: 0, user: 0, all: 0 })
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/notifications")
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }
      
      const data = await response.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
      setRoleBasedCounts(data.roleBasedCounts || { all: 0 })
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      setError("Failed to load notifications")
      setNotifications([])
      setUnreadCount(0)
      setRoleBasedCounts({ superAdmin: 0, admin: 0, user: 0, all: 0 })
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id])

  useEffect(() => {
    fetchNotifications()
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    
    return () => clearInterval(interval)
  }, [fetchNotifications])

  return {
    notifications,
    unreadCount,
    roleBasedCounts,
    userRole: session?.user?.role as UserRole,
    loading,
    error,
    refresh: fetchNotifications,
  }
}