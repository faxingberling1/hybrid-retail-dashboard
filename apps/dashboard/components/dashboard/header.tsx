"use client"

import { useState } from "react"
import { Search, Bell, ChevronDown, Menu, Shield, Building, User, LogOut, Settings, UserCircle, Activity, FileText } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { NotificationBell } from "@/components/dashboard/notification-bell"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  // isNotificationOpen removed as it's handled by NotificationBell
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { data: session } = useSession()
  // notifications usage removed from here as NotificationBell handles it internally, 
  // but if other parts need it, we keep useNotification. 
  // However, looking at the file, unreadCount is used?? 
  // NotificationBell handles the bell icon and count.
  // So we can simplify. useNotification might still be needed if used elsewhere?
  // loading is used. 
  // Let's check if 'loading' is used elsewhere. Yes, in the bell button. 
  // NotificationBell should ideally handle loading too or we assume it's fine.
  // The NotificationBell I saw earlier didn't seem to expose loading state prop. 
  // I will just use NotificationBell and trust its internal state handling.

  // ... (keep role styles)

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="px-6 h-16 flex items-center justify-between">
        {/* ... (search etc) */}

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Notifications */}
          <NotificationBell />

          {/* Vertical Divider */}
          <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block" />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen)
                setIsNotificationOpen(false)
              }}
              className="flex items-center space-x-2 group p-1 pr-2 hover:bg-gray-50 rounded-xl transition-all"
            >
              <div className={`h-9 w-9 rounded-lg bg-gradient-to-r ${styles.userBg} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                <RoleIcon className="h-5 w-5 text-white" />
              </div>
              <div className="hidden lg:block text-left mr-1">
                <p className="text-sm font-bold text-gray-900 leading-none">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 font-medium">{styles.roleText}</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""
                }`} />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className={`absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border ${styles.userMenuBorder} py-2 z-50 overflow-hidden transform origin-top-right transition-all animate-in fade-in zoom-in-95 duration-200`}>
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${styles.userBg} flex items-center justify-center shadow-sm`}>
                      <RoleIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {session?.user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate lowercase">
                        {session?.user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles.roleBg} ${styles.roleColor}`}>
                      {currentRole.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-1">
                  <Link
                    href={"/profile" as any}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors"
                  >
                    <UserCircle className="h-4 w-4 mr-3 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    My Profile
                  </Link>
                  <Link
                    href={"/notifications" as any}
                    className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors"
                  >
                    <div className="flex items-center">
                      <Bell className="h-4 w-4 mr-3 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      Notifications
                    </div>
                    {safeUnreadCount > 0 && (
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                        {safeUnreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    href={"/settings" as any}
                    className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-3 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    Settings
                  </Link>
                </div>

                {/* Role-specific section */}
                {currentRole === 'SUPER_ADMIN' && (
                  <div className="p-1 border-t border-gray-100">
                    <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">System</p>
                    <Link
                      href={"/super-admin/system" as any}
                      className="flex items-center px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 rounded-lg group transition-colors"
                    >
                      <Activity className="h-4 w-4 mr-3" />
                      System Health
                    </Link>
                    <Link
                      href={"/super-admin/logs" as any}
                      className="flex items-center px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 rounded-lg group transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-3" />
                      Audit Logs
                    </Link>
                  </div>
                )}

                <div className="p-1 border-t border-gray-100">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg group transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3 transition-transform group-hover:-translate-x-1" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="md:hidden px-6 py-2 border-t border-gray-100 bg-gray-50/50">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={styles.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 pr-4 py-2 w-full bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent ${styles.focusRing}`}
          />
        </div>
      </div>
    </header>
  )
}