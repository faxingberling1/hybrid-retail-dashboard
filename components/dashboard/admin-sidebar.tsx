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
  Truck,
  LifeBuoy,
  Pill,
  Stethoscope,
  Utensils,
  GraduationCap,
  Home,
  Car,
  Factory,
  Scissors
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useNotification } from "@/lib/hooks/use-notification"

export function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { notifications } = useNotification()

  const industry = session?.user?.industry?.toLowerCase() || 'retail'

  const baseItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/admin" },
    { name: "Inventory Management", icon: <Package className="h-5 w-5" />, href: "/admin/inventory" },
    { name: "Sales", icon: <ShoppingBag className="h-5 w-5" />, href: "/admin/sales" },
  ]

  const industryItems: Record<string, any[]> = {
    pharmacy: [
      { name: "Prescriptions", icon: <Pill className="h-5 w-5" />, href: "/admin/prescriptions" },
      { name: "Patient Records", icon: <Users className="h-5 w-5" />, href: "/admin/patients" },
    ],
    healthcare: [
      { name: "Appointments", icon: <Calendar className="h-5 w-5" />, href: "/admin/appointments" },
      { name: "Patient Files", icon: <Stethoscope className="h-5 w-5" />, href: "/admin/patients" },
    ],
    fashion: [
      { name: "Collections", icon: <Scissors className="h-5 w-5" />, href: "/admin/collections" },
      { name: "Trend Analysis", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/trends" },
    ],
    restaurant: [
      { name: "Menu Management", icon: <Utensils className="h-5 w-5" />, href: "/admin/menu" },
      { name: "Table Orders", icon: <ShoppingBag className="h-5 w-5" />, href: "/admin/orders" },
    ],
    manufacturing: [
      { name: "Production Line", icon: <Factory className="h-5 w-5" />, href: "/admin/production" },
    ],
    education: [
      { name: "Students", icon: <GraduationCap className="h-5 w-5" />, href: "/admin/students" },
      { name: "Course Content", icon: <FileText className="h-5 w-5" />, href: "/admin/courses" },
    ]
  }

  const commonEndItems = [
    { name: "Customers", icon: <Users className="h-5 w-5" />, href: "/admin/customers" },
    { name: "Staff", icon: <Users className="h-5 w-5" />, href: "/admin/staff" },
    { name: "Reports", icon: <BarChart3 className="h-5 w-5" />, href: "/admin/reports" },
    { name: "Transactions", icon: <CreditCard className="h-5 w-5" />, href: "/admin/transactions" },
    { name: "Suppliers", icon: <Truck className="h-5 w-5" />, href: "/admin/suppliers" },
    { name: "Schedule", icon: <Calendar className="h-5 w-5" />, href: "/admin/schedule" },
    { name: "Support", icon: <LifeBuoy className="h-5 w-5" />, href: "/admin/support" },
    { name: "Store Settings", icon: <Settings className="h-5 w-5" />, href: "/admin/settings" },
  ]

  const navigationItems = [
    ...baseItems,
    ...(industryItems[industry] || []),
    ...commonEndItems
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
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 ring-1 ring-black/5">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg tracking-tight">TechGadget</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Admin Portal</span>
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
          <ul className="space-y-1.5">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              const hasSupportNotification = item.name === "Support" && notifications.some((n: any) => !n.read && (n.actionUrl?.includes('support') || n.title.toLowerCase().includes('ticket')));

              return (
                <li key={item.name}>
                  <Link
                    href={item.href as any}
                    className={`
                      group flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 font-medium text-sm
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20 translate-x-1'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80 hover:translate-x-1'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={`mr-3.5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                    {hasSupportNotification && !isActive && (
                      <div className="ml-2 w-2 h-2 rounded-full bg-red-500 animate-pulse ring-4 ring-red-500/20 shadow-lg shadow-red-500/40" />
                    )}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Store Stats */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-100">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 transition-transform hover:-translate-y-0.5 duration-300">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Sales</span>
              <div className="p-1.5 bg-green-50 rounded-lg">
                <DollarSign className="h-3.5 w-3.5 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900 tracking-tight">₨ 72,000</p>
            <div className="flex items-center mt-2 text-[10px] font-bold">
              <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                +15%
              </span>
              <span className="text-gray-400 ml-2">vs yesterday</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 flex items-center justify-center ring-2 ring-white shadow-md">
                  <Store className="h-4 w-4 text-white" />
                </div>
                <div className="absolute right-0 bottom-0 h-2.5 w-2.5 bg-green-500 rounded-full ring-2 ring-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">Store Admin</span>
                <span className="text-[10px] font-medium text-gray-400">Manager Access</span>
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