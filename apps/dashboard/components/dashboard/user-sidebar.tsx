"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  QrCode,
  Calculator,
  Receipt,
  Clock,
  User,
  TrendingUp,
  LifeBuoy
} from "lucide-react"
import { signOut } from "next-auth/react"

export function UserSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const navigationItems = [
    { name: "Point of Sale", icon: <ShoppingCart className="h-5 w-5" />, href: "/user" },
    { name: "Quick Sale", icon: <QrCode className="h-5 w-5" />, href: "/user/quick-sale" },
    { name: "View Inventory", icon: <Package className="h-5 w-5" />, href: "/user/inventory" },
    { name: "Customers", icon: <Users className="h-5 w-5" />, href: "/user/customers" },
    { name: "My Sales", icon: <TrendingUp className="h-5 w-5" />, href: "/user/my-sales" },
    { name: "Transactions", icon: <CreditCard className="h-5 w-5" />, href: "/user/transactions" },
    { name: "Reports", icon: <BarChart3 className="h-5 w-5" />, href: "/user/reports" },
    { name: "Calculator", icon: <Calculator className="h-5 w-5" />, href: "/user/calculator" },
    { name: "Support", icon: <LifeBuoy className="h-5 w-5" />, href: "/user/support" },
  ]

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:block
        flex flex-col h-screen
        transition-all duration-300 ease-out shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]
      `}>
        {/* Logo & Title */}
        <div className="flex h-20 items-center px-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg shadow-green-500/20 ring-1 ring-black/5">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg tracking-tight">POS Terminal</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Staff Access</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 overflow-y-auto custom-scrollbar">
          <div className="mb-8 px-2">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100 shadow-sm relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-green-200/20 rounded-full blur-2xl -mr-6 -mt-6 transition-transform group-hover:scale-110 duration-700"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Current Shift</span>
                  <div className="p-1.5 bg-white/60 rounded-lg backdrop-blur-sm">
                    <Clock className="h-3.5 w-3.5 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900 tracking-tight">₨ 42,500</p>
                <div className="flex items-center mt-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse mr-2"></div>
                  <p className="text-xs font-medium text-green-600">Live Updates</p>
                </div>
              </div>
            </div>
          </div>

          <ul className="space-y-1.5">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      group flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 font-medium text-sm
                      ${isActive
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl shadow-green-500/20 translate-x-1'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80 hover:translate-x-1'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={`mr-3.5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-green-600'}`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 flex items-center justify-center ring-2 ring-white shadow-md">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="absolute right-0 bottom-0 h-2.5 w-2.5 bg-green-500 rounded-full ring-2 ring-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">Staff User</span>
                <span className="text-[10px] font-medium text-gray-400">Cashier Access</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 lg:hidden bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        <Menu className="h-6 w-6" />
      </button>
    </>
  )
}