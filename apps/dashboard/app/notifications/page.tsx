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
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

const typeFilters = ['all', 'info', 'success', 'warning', 'error'] as const

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
      const response = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id })
      })
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => (n.id === id ? { ...n, read: true } : n))
        )
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      })
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, { 
        method: 'DELETE' 
      })
      
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  // Safe notifications array
  const safeNotifications = Array.isArray(notifications) ? notifications : []

  // Get dashboard URL based on role
  const getDashboardUrl = () => {
    switch(session?.user?.role) {
      case 'SUPER_ADMIN':
        return '/super-admin'
      case 'ADMIN':
        return '/admin'
      case 'USER':
        return '/user'
      default:
        return '/'
    }
  }

  // Get role-specific button color
  const getButtonColor = () => {
    switch(session?.user?.role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-600 hover:bg-purple-700'
      case 'ADMIN':
        return 'bg-blue-600 hover:bg-blue-700'
      case 'USER':
        return 'bg-green-600 hover:bg-green-700'
      default:
        return 'bg-gray-600 hover:bg-gray-700'
    }
  }

  const dashboardUrl = getDashboardUrl()
  const buttonColor = getButtonColor()

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                  <Link
                    href={dashboardUrl}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                  <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600 mt-2">Manage your notifications and preferences</p>
                </div>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Loading notifications...</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                  <Link
                    href={dashboardUrl}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                  <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600 mt-2">Manage your notifications and preferences</p>
                </div>
                <div className="bg-white rounded-lg shadow p-8">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <p className="text-gray-700 mb-4">{error}</p>
                    <button
                      onClick={fetchNotifications}
                      className={`px-4 py-2 text-white rounded-lg ${buttonColor}`}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      <Link
                        href={dashboardUrl}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mr-4"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                      </Link>
                      <Link
                        href="/"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Home
                      </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-600 mt-2">Manage your notifications and preferences</p>
                  </div>
                  <button
                    onClick={markAllAsRead}
                    className={`px-4 py-2 text-white rounded-lg text-sm font-medium ${buttonColor}`}
                  >
                    Mark All as Read
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {typeFilters.map(type => (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                      filter === type
                        ? `${buttonColor} text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-lg shadow">
                {safeNotifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">No notifications</p>
                    <p className="text-gray-500">
                      {filter === 'all' 
                        ? "You don't have any notifications yet." 
                        : `No ${filter} notifications found.`}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {safeNotifications.map(notification => {
                      const typeIcon = {
                        info: <Info className="h-5 w-5 text-blue-500" />,
                        success: <CheckCircle className="h-5 w-5 text-green-500" />,
                        warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
                        error: <AlertCircle className="h-5 w-5 text-red-500" />,
                      }[notification.type]

                      const typeColor = {
                        info: 'bg-blue-50 border-blue-100',
                        success: 'bg-green-50 border-green-100',
                        warning: 'bg-yellow-50 border-yellow-100',
                        error: 'bg-red-50 border-red-100',
                      }[notification.type]

                      return (
                        <div
                          key={notification.id}
                          className={`p-4 flex items-start justify-between transition-colors hover:bg-gray-50 ${
                            !notification.read ? `${typeColor} border-l-4` : ''
                          }`}
                        >
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="flex-shrink-0 mt-1">
                              {typeIcon}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h3 className="font-medium text-gray-900">
                                  {notification.title}
                                </h3>
                                <div className="flex items-center space-x-2 ml-4">
                                  {!notification.read && (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                      title="Mark as read"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                                    title="Delete"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-gray-600 mt-1">{notification.message}</p>
                              <div className="flex items-center mt-2 space-x-4">
                                <span className="text-sm text-gray-500">
                                  {format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a')}
                                </span>
                                {notification.priority === 'high' && (
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                    High Priority
                                  </span>
                                )}
                                {notification.actionUrl && (
                                  <a
                                    href={notification.actionUrl}
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                  >
                                    {notification.actionLabel || 'Take Action'}
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Stats footer */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    <span className="font-medium">{safeNotifications.length}</span> notifications
                    {filter !== 'all' && (
                      <span className="ml-2">(filtered by {filter})</span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium">
                      {safeNotifications.filter(n => !n.read).length}
                    </span> unread
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}