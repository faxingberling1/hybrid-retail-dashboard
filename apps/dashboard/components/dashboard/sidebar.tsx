"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Building2,
  Users,
  BarChart3,
  Settings,
  FileText,
  Wallet,
  LogOut,
  Menu,
  X,
  Shield,
  Store,
  ShoppingCart,
  Package,
  Receipt,
  User,
  Server,
  Database,
  Globe,
  ShoppingBag,
  CreditCard,
  Calendar,
  Truck,
  QrCode,
  Calculator,
  TrendingUp,
  Clock,
  MessageSquare
} from "lucide-react"

interface SidebarProps {
  userRole?: string
}

export function Sidebar({ userRole }: SidebarProps) {
  const { data: session } = useSession()
  const currentRole = userRole || session?.user?.role || 'USER'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Define role-specific styles
  const getRoleStyles = () => {
    switch (currentRole) {
      case 'SUPER_ADMIN':
        return {
          gradient: 'from-purple-600 to-indigo-600',
          activeBg: 'bg-purple-50',
          activeText: 'text-purple-700',
          activeBorder: 'border-purple-600',
          activeIcon: 'text-purple-600',
          userGradient: 'from-purple-500 to-indigo-500',
          displayName: 'Platform Admin'
        }
      case 'ADMIN':
        return {
          gradient: 'from-blue-600 to-cyan-600',
          activeBg: 'bg-blue-50',
          activeText: 'text-blue-700',
          activeBorder: 'border-blue-600',
          activeIcon: 'text-blue-600',
          userGradient: 'from-blue-500 to-cyan-500',
          displayName: 'Store Admin'
        }
      case 'USER':
        return {
          gradient: 'from-green-600 to-emerald-600',
          activeBg: 'bg-green-50',
          activeText: 'text-green-700',
          activeBorder: 'border-green-600',
          activeIcon: 'text-green-600',
          userGradient: 'from-green-500 to-emerald-500',
          displayName: 'Staff User'
        }
      default:
        return {
          gradient: 'from-gray-600 to-gray-700',
          activeBg: 'bg-gray-50',
          activeText: 'text-gray-700',
          activeBorder: 'border-gray-600',
          activeIcon: 'text-gray-600',
          userGradient: 'from-gray-500 to-gray-600',
          displayName: 'User'
        }
    }
  }

  const styles = getRoleStyles()

  // Define navigation items based on role
  const getNavigationItems = () => {
    if (currentRole === 'SUPER_ADMIN') {
      return [
        { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/super-admin" },
        { name: "Organizations", icon: <Building2 className="h-5 w-5" />, href: "/super-admin/organizations" },
        { name: "Users", icon: <Users className="h-5 w-5" />, href: "/super-admin/users" },
        { name: "Platform Analytics", icon: <BarChart3 className="h-5 w-5" />, href: "/super-admin/analytics" },
        { name: "System Health", icon: <Server className="h-5 w-5" />, href: "/super-admin/system" },
        { name: "Database", icon: <Database className="h-5 w-5" />, href: "/super-admin/database" },
        { name: "Billing", icon: <Wallet className="h-5 w-5" />, href: "/super-admin/billing" },
        { name: "Audit Logs", icon: <FileText className="h-5 w-5" />, href: "/super-admin/logs" },
        { name: "Global Settings", icon: <Settings className="h-5 w-5" />, href: "/super-admin/settings" },
        { name: "Support Tickets", icon: <MessageSquare className="h-5 w-5" />, href: "/super-admin/support" },
      ]
    }

    if (currentRole === 'ADMIN') {
      return [
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
        { name: "Support", icon: <MessageSquare className="h-5 w-5" />, href: "/admin/support" },
      ]
    }

    // USER role
    return [
      { name: "Point of Sale", icon: <ShoppingCart className="h-5 w-5" />, href: "/user" },
      { name: "Quick Sale", icon: <QrCode className="h-5 w-5" />, href: "/user/quick-sale" },
      { name: "View Inventory", icon: <Package className="h-5 w-5" />, href: "/user/inventory" },
      { name: "Customers", icon: <Users className="h-5 w-5" />, href: "/user/customers" },
      { name: "My Sales", icon: <TrendingUp className="h-5 w-5" />, href: "/user/my-sales" },
      { name: "Transactions", icon: <CreditCard className="h-5 w-5" />, href: "/user/transactions" },
      { name: "Reports", icon: <BarChart3 className="h-5 w-5" />, href: "/user/reports" },
      { name: "Calculator", icon: <Calculator className="h-5 w-5" />, href: "/user/calculator" },
      { name: "Support", icon: <MessageSquare className="h-5 w-5" />, href: "/user/support" },
    ]
  }

  const navigationItems = getNavigationItems()

  const getRoleIcon = () => {
    switch (currentRole) {
      case 'SUPER_ADMIN': return <Shield className="h-6 w-6 text-white" />
      case 'ADMIN': return <Store className="h-6 w-6 text-white" />
      case 'USER': return <ShoppingCart className="h-6 w-6 text-white" />
      default: return <User className="h-6 w-6 text-white" />
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-all"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0
        flex flex-col
        transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
      `}>
        {/* Logo & Title */}
        <div className="flex h-16 items-center px-6 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-gradient-to-r ${styles.gradient} rounded-lg shadow-lg`}>
              {getRoleIcon()}
            </div>
            <div>
              <h1 className="font-bold text-gray-900 tracking-tight">HybridPOS</h1>
              <p className={`text-xs font-medium ${styles.activeText}`}>{styles.displayName}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-6">
          {/* Status Card for specialized roles */}
          {(currentRole === 'ADMIN' || currentRole === 'USER') && (
            <div className="px-3">
              <div className={`${styles.activeBg} rounded-xl p-4 border ${styles.activeBorder} border-opacity-20 shadow-sm`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold uppercase tracking-wider ${styles.activeText}`}>
                    {currentRole === 'ADMIN' ? "Today's Status" : "Shift Status"}
                  </span>
                  {currentRole === 'ADMIN' ? <TrendingUp className={`h-4 w-4 ${styles.activeIcon}`} /> : <Clock className={`h-4 w-4 ${styles.activeIcon}`} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900 leading-none">₨ 72,500</span>
                  <span className="text-[10px] text-gray-500 mt-1 font-medium italic">+12.5% from period avg</span>
                </div>
              </div>
            </div>
          )}

          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/')
              return (
                <li key={item.name}>
                  <Link
                    href={item.href as any}
                    className={`
                      flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
                      ${isActive
                        ? `${styles.activeBg} ${styles.activeText} border-l-4 ${styles.activeBorder}`
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={`mr-3 transition-colors ${isActive ? styles.activeIcon : 'text-gray-400 group-hover:text-gray-600'}`}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-100 p-4 bg-gray-50/50">
          <div className="flex items-center justify-between px-2 py-3 bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            <div className="flex items-center">
              <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${styles.userGradient} flex items-center justify-center shadow-md`}>
                <span className="text-white font-bold text-sm">
                  {session?.user?.name ? session.user.name.split(' ').map(n => n[0]).join('') : currentRole[0]}
                </span>
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate leading-none">
                  {session?.user?.name || styles.displayName}
                </p>
                <p className="text-[10px] text-gray-500 mt-1 truncate">
                  {session?.user?.email || 'Active Session'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-red-600 bg-white border border-red-50 rounded-xl hover:bg-red-50 transition-all shadow-sm group"
          >
            <LogOut className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 lg:hidden bg-white border border-gray-200 rounded-lg shadow-lg hover:bg-gray-50 transition-all"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
      )}
    </>
  )
}