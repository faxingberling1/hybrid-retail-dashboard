"use client"

import { useState } from "react"
import { Search, Bell, ChevronDown, Menu } from "lucide-react"
import { useSession } from "next-auth/react"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const { data: session } = useSession()

  const getRoleStyles = () => {
    switch(session?.user?.role) {
      case 'SUPER_ADMIN':
        return {
          focusRing: 'focus:ring-purple-500',
          userInitials: 'SA',
          userBg: 'from-purple-500 to-indigo-500',
          roleText: 'Platform Administrator'
        }
      case 'ADMIN':
        return {
          focusRing: 'focus:ring-blue-500',
          userInitials: 'MA',
          userBg: 'from-blue-500 to-cyan-500',
          roleText: 'Store Manager'
        }
      case 'USER':
        return {
          focusRing: 'focus:ring-green-500',
          userInitials: 'SU',
          userBg: 'from-green-500 to-emerald-500',
          roleText: 'Staff User'
        }
      default:
        return {
          focusRing: 'focus:ring-gray-500',
          userInitials: 'U',
          userBg: 'from-gray-500 to-gray-600',
          roleText: 'User'
        }
    }
  }

  const styles = getRoleStyles()

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="px-6 h-16 flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button - hidden on desktop */}
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
          {/* Notifications */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500">{styles.roleText}</p>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${styles.userBg} flex items-center justify-center`}>
                <span className="text-white text-sm font-semibold">{styles.userInitials}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}