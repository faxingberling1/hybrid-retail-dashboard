"use client"

import { useState } from "react"
import { Search, Bell, ChevronDown, Menu, User } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { NotificationBell } from "@/components/dashboard/notification-bell"

export function UserHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 supports-[backdrop-filter]:bg-white/60">
      <div className="px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors">
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden lg:block">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-green-500 transition-colors" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-72 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">


          <div className="bg-blue-50/50 border border-blue-100 px-3 py-1.5 rounded-xl hidden sm:block">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Terminal #01</span>
          </div>

          <NotificationBell />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200 pr-3 group"
            >
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                  {session?.user?.name || "Staff User"}
                </p>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Cashier</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-green-500 to-emerald-500 flex items-center justify-center shadow-md ring-2 ring-white group-hover:ring-gray-100 transition-all">
                <User className="h-4 w-4 text-white" />
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900">
                    {session?.user?.name || "Staff User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {session?.user?.email || "staff@techgadget.com"}
                  </p>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider mt-1">
                    Staff Account
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    href="/"
                    className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors font-medium"
                  >
                    View Landing Page
                  </Link>
                  <a
                    href="/user/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors"
                  >
                    Your Profile
                  </a>
                  <a
                    href="/user/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-colors"
                  >
                    Personal Settings
                  </a>
                </div>

                <div className="py-1 border-t border-gray-100">
                  <a
                    href="/api/auth/signout"
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
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