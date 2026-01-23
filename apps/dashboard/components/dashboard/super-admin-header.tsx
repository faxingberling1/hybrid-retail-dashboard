"use client"

import { useState } from "react"
import { Search, Bell, ChevronDown, Menu, Shield } from "lucide-react"
import { useSession } from "next-auth/react"
import { NotificationBell } from "@/components/dashboard/notification-bell"
import { NotificationDropdown } from "@/components/ui/notification-dropdown"
import { useNotification } from "@/lib/hooks/use-notification"

export function SuperAdminHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: session } = useSession()
  const { notifications, unreadCount } = useNotification()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <button className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700">
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="hidden lg:block ml-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search platform..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notification Bell with Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen)
                setIsUserMenuOpen(false)
              }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center font-medium">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            
            {isNotificationOpen && (
              <div className="absolute right-0 mt-2">
                <NotificationDropdown
                  notifications={notifications.slice(0, 5)} // Show only 5 latest
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
                  {session?.user?.name || "Super Admin"}
                </p>
                <p className="text-xs text-gray-500">Platform Administrator</p>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`} />
              </div>
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border py-1 z-40">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user?.name || "Super Admin"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session?.user?.email || "superadmin@platform.com"}
                  </p>
                  <p className="text-xs text-purple-600 font-medium mt-1">
                    Super Admin Account
                  </p>
                </div>
                
                <div className="py-1">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                  <a
                    href="/notifications"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                </div>
                
                <div className="py-1 border-t">
                  <a
                    href="/system/audit-logs"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Audit Logs
                  </a>
                  <a
                    href="/system/health"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    System Health
                  </a>
                </div>
                
                <div className="py-1 border-t">
                  <a
                    href="/api/auth/signout"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}