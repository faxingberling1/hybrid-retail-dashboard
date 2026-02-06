"use client"

import { useState } from "react"
import { Search, Bell, ChevronDown, Menu, Shield } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/60">
      <div className="px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden lg:block">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              <input
                type="text"
                placeholder="Search platform..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-72 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">


          {/* Notification Bell with Dropdown */}
          <NotificationBell />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen)
                setIsNotificationOpen(false)
              }}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 pr-3 group"
            >
              <div className="hidden sm:block text-right mr-2">
                <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                  {session?.user?.name || "Super Admin"}
                </p>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Administrator</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md ring-2 ring-white group-hover:ring-gray-100 transition-all">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`} />
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
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 font-medium"
                  >
                    View Landing Page
                  </Link>
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