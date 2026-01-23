"use client"

import { useState } from "react"
import { Search, Bell, ChevronDown, Menu, Shield, Building, User } from "lucide-react"
import { useSession } from "next-auth/react"
import { NotificationDropdown } from "@/components/ui/notification-dropdown"
import { useNotification } from "@/lib/hooks/use-notification"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { data: session } = useSession()
  const { notifications = [], unreadCount = 0, loading } = useNotification()

  const getRoleStyles = () => {
    switch(session?.user?.role) {
      case 'SUPER_ADMIN':
        return {
          focusRing: 'focus:ring-purple-500',
          userIcon: Shield,
          userBg: 'from-purple-500 to-indigo-500',
          roleText: 'Platform Administrator',
          roleColor: 'text-purple-600',
          roleBg: 'bg-purple-50',
          userMenuBorder: 'border-purple-100'
        }
      case 'ADMIN':
        return {
          focusRing: 'focus:ring-blue-500',
          userIcon: Building,
          userBg: 'from-blue-500 to-cyan-500',
          roleText: 'Store Manager',
          roleColor: 'text-blue-600',
          roleBg: 'bg-blue-50',
          userMenuBorder: 'border-blue-100'
        }
      case 'USER':
        return {
          focusRing: 'focus:ring-green-500',
          userIcon: User,
          userBg: 'from-green-500 to-emerald-500',
          roleText: 'Staff User',
          roleColor: 'text-green-600',
          roleBg: 'bg-green-50',
          userMenuBorder: 'border-green-100'
        }
      default:
        return {
          focusRing: 'focus:ring-gray-500',
          userIcon: User,
          userBg: 'from-gray-500 to-gray-600',
          roleText: 'User',
          roleColor: 'text-gray-600',
          roleBg: 'bg-gray-50',
          userMenuBorder: 'border-gray-100'
        }
    }
  }

  const styles = getRoleStyles()
  const UserIcon = styles.userIcon

  // Safe notifications array (always an array)
  const safeNotifications = Array.isArray(notifications) ? notifications : []
  const safeUnreadCount = typeof unreadCount === 'number' ? unreadCount : 0

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      window.location.href = '/login'
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700">
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Search on desktop */}
          <div className="hidden lg:block ml-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 w-64 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent ${styles.focusRing}`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications with Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen)
                setIsUserMenuOpen(false)
              }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative transition-colors"
              disabled={loading}
            >
              <Bell className="h-5 w-5" />
              {safeUnreadCount > 0 && (
                <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-medium">
                  {safeUnreadCount > 9 ? "9+" : safeUnreadCount}
                </span>
              )}
              {loading && (
                <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-gray-200 animate-pulse" />
              )}
            </button>
            
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2">
                <NotificationDropdown
                  notifications={safeNotifications.slice(0, 5)}
                  onClose={() => setIsNotificationOpen(false)}
                />
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen)
                setIsNotificationOpen(false)
              }}
              className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">{styles.roleText}</p>
              </div>
              <div className="flex items-center space-x-1">
                <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${styles.userBg} flex items-center justify-center`}>
                  <UserIcon className="h-4 w-4 text-white" />
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`} />
              </div>
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border ${styles.userMenuBorder} py-1 z-40`}>
                <div className="px-4 py-3 border-b">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-r ${styles.userBg} flex items-center justify-center`}>
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session?.user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session?.user?.email || 'user@example.com'}
                      </p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${styles.roleBg} ${styles.roleColor}`}>
                        {session?.user?.role?.replace('_', ' ') || 'User'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="py-1">
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4 mr-3 text-gray-400" />
                    Your Profile
                  </a>
                  <a
                    href="/notifications"
                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <Bell className="h-4 w-4 mr-3 text-gray-400" />
                      Notifications
                    </div>
                    {safeUnreadCount > 0 && (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                        {safeUnreadCount}
                      </span>
                    )}
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </a>
                </div>

                {/* Role-specific menu items */}
                {(session?.user?.role === 'SUPER_ADMIN' || session?.user?.role === 'ADMIN') && (
                  <div className="py-1 border-t">
                    {session?.user?.role === 'SUPER_ADMIN' && (
                      <a
                        href="/super-admin"
                        className="flex items-center px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                      >
                        <Shield className="h-4 w-4 mr-3" />
                        Super Admin Dashboard
                      </a>
                    )}
                    {session?.user?.role === 'ADMIN' && (
                      <a
                        href="/admin"
                        className="flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                      >
                        <Building className="h-4 w-4 mr-3" />
                        Admin Dashboard
                      </a>
                    )}
                  </div>
                )}

                <div className="py-1 border-t">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <svg className="h-4 w-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="lg:hidden px-6 py-2 border-t border-gray-100 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent ${styles.focusRing}`}
          />
        </div>
      </div>
    </header>
  )
}