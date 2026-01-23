"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  FileText,
  DollarSign,
  LogOut,
  Menu,
  X,
  Store,
  CreditCard,
  Calendar,
  Truck
} from "lucide-react"
import { signOut } from "next-auth/react"

export function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const navigationItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/admin" },
    { name: "Sales", icon: <ShoppingBag className="h-5 w-5" />, href: "/admin/sales" },
    { name: "Inventory", icon: <Package className="h-5 w-5" />, href: "/admin/inventory" },
    { name: "Customers", icon: <Users className="h-5 w-5" />, href: "/admin/customers" },
    { name: "Staff", icon: <Users className="h-5 w-5" />, href: "/admin/staff" },
    { name: "Reports", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/reports" },
    { name: "Transactions", icon: <CreditCard className="h-5 w-5" />, href: "/admin/transactions" },
    { name: "Suppliers", icon: <Truck className="h-5 w-5" />, href: "/admin/suppliers" },
    { name: "Schedule", icon: <Calendar className="h-5 w-5" />, href: "/admin/schedule" },
    { name: "Store Settings", icon: <Settings className="h-5 w-5" />, href: "/admin/settings" },
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
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
        flex flex-col
        transition-transform duration-300 ease-in-out
      `}>
        {/* Logo & Title */}
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">TechGadget Store</h1>
              <p className="text-xs text-gray-500">Store Admin</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Store Stats */}
        <div className="border-t border-gray-200 p-4">
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-900">Today's Sales</span>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-blue-700">₨ 72,000</p>
            <p className="text-xs text-blue-600 mt-1">+15% from yesterday</p>
          </div>

          <div className="flex items-center justify-between px-2 py-3">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Store Admin</p>
                <p className="text-xs text-gray-500">Manager Access</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="h-5 w-5" />
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