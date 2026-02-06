"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Filter,
  Check,
  X,
  ExternalLink,
  Loader2,
  ArrowLeft,
  Home
} from "lucide-react"
import { Notification } from "@/lib/types/notification"
import Link from "next/link"
import { SuperAdminSidebar } from "@/components/dashboard/super-admin-sidebar"
import { SuperAdminHeader } from "@/components/dashboard/super-admin-header"
import { AdminSidebar } from "@/components/dashboard/admin-sidebar"
import { AdminHeader } from "@/components/dashboard/admin-header"
import { UserSidebar } from "@/components/dashboard/user-sidebar"
import { UserHeader } from "@/components/dashboard/user-header"

const typeFilters = ['all', 'info', 'success', 'warning', 'error'] as const

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const url = filter === 'all'
        ? '/api/notifications'
        : `/api/notifications?type=${filter}`

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
      }

      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      setError('Failed to load notifications. Please try again.')
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      })

      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      })

      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  // Safe notifications array
  const safeNotifications = Array.isArray(notifications) ? notifications : []

  // Get dashboard URL based on role
  const getDashboardUrl = () => {
    switch (session?.user?.role) {
      case 'SUPER_ADMIN': return '/super-admin'
      case 'ADMIN': return '/admin'
      case 'USER': return '/user'
      default: return '/'
    }
  }

  const renderSidebar = () => {
    switch (session?.user?.role) {
      case 'SUPER_ADMIN': return <SuperAdminSidebar />
      case 'ADMIN': return <AdminSidebar />
      case 'USER': return <UserSidebar />
      default: return null // Or a generic fallback if session loading?
    }
  }

  const renderHeader = () => {
    switch (session?.user?.role) {
      case 'SUPER_ADMIN': return <SuperAdminHeader />
      case 'ADMIN': return <AdminHeader />
      case 'USER': return <UserHeader />
      default: return null
    }
  }

  const dashboardUrl = getDashboardUrl()

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        {renderSidebar()}
        <div className="flex flex-col flex-1 overflow-hidden">
          {renderHeader()}
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            {/* Loading UI ... */}
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        {renderSidebar()}
        <div className="flex flex-col flex-1 overflow-hidden">
          {renderHeader()}
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            {/* Error UI ... */}
            <div className="p-8 text-center">
              <p className="text-red-500">{error}</p>
              <button onClick={fetchNotifications} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg">Try Again</button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50/50">
      {renderSidebar()}
      <div className="flex flex-col flex-1 overflow-hidden">
        {renderHeader()}
        <main className="flex-1 relative overflow-y-auto focus:outline-none custom-scrollbar">
          <div className="min-h-full p-4 lg:p-8 max-w-7xl mx-auto space-y-8">

            {/* Premium Header */}
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 lg:p-12 shadow-2xl shadow-gray-200">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={dashboardUrl}
                      className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white mb-6 transition-colors"
                    >
                      <ArrowLeft className="h-3 w-3 mr-2" />
                      Dashboard
                    </Link>
                    <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 flex items-center gap-4">
                      Notifications
                      <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-xs font-black uppercase tracking-[0.1em] text-white/80">
                        {safeNotifications.filter(n => !n.read).length} Unread
                      </div>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">
                      Stay updated with the latest alerts, system messages, and support updates.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={markAllAsRead}
                      className="px-6 py-3 bg-white text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all shadow-lg active:scale-95 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      Mark All Read
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-20 py-4 bg-gray-50/50 backdrop-blur-md -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100 w-full sm:w-auto">
                {['all', 'info', 'success', 'warning', 'error'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex-1 sm:flex-initial ${filter === type
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Notification List */}
            <div className="space-y-6">
              {safeNotifications.length === 0 ? (
                <div className="bg-white rounded-[32px] p-16 text-center shadow-xl shadow-gray-100/50 border border-gray-100/50 flex flex-col items-center">
                  <div className="h-24 w-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-6 rotate-3">
                    <Bell className="h-10 w-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">All Cleared</h3>
                  <p className="text-gray-400 max-w-sm mx-auto font-medium">You're all caught up. New notifications will appear here.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {safeNotifications.map(notification => {
                    const typeStyles = {
                      info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
                      success: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100' },
                      warning: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
                      error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' }
                    }[notification.type as string] || { icon: Info, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100' };

                    const Icon = typeStyles.icon;

                    return (
                      <div
                        key={notification.id}
                        className={`group relative bg-white p-6 rounded-[24px] shadow-sm border transition-all hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 ${!notification.read ? 'border-l-[8px] border-l-gray-900 border-y-gray-100 border-r-gray-100 pl-4' : 'border-gray-100 opacity-90 hover:opacity-100'
                          }`}
                      >
                        <div className="flex items-start gap-6">
                          <div className={`shrink-0 p-4 rounded-2xl ${typeStyles.bg} ${typeStyles.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <h3 className={`text-lg font-bold leading-tight ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notification.title}
                              </h3>
                              <span className="text-[10px] font-black text-gray-300 uppercase tracking-wider shrink-0 bg-gray-50 px-2 py-1 rounded-lg">
                                {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                              </span>
                            </div>
                            <p className="text-gray-500 font-medium leading-relaxed mb-4 max-w-3xl">
                              {notification.message}
                            </p>

                            <div className="flex items-center gap-3">
                              {notification.actionUrl && (
                                <Link
                                  href={notification.actionUrl}
                                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10"
                                >
                                  {notification.actionLabel || 'View Details'}
                                  <ExternalLink className="h-3 w-3 ml-2" />
                                </Link>
                              )}
                              <div className="flex items-center gap-2 ml-auto">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                                    title="Mark as Read"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                  title="Delete"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}