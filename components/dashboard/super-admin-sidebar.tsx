"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
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
  Server,
  Database,
  Globe,
  LifeBuoy,
  LayoutTemplate,
  Sparkles,
  CreditCard,
  PenTool,
  Library,
  MessageSquare as FeatureIcon
} from "lucide-react"
import { signOut } from "next-auth/react"
import { useNotification } from "@/lib/hooks/use-notification"

export function SuperAdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { notifications } = useNotification()
  const [sidebarStats, setSidebarStats] = useState({ organizations: 0, users: 0, billing: 0 })

  const fetchSidebarStats = async () => {
    try {
      const res = await fetch('/api/super-admin/sidebar-stats')
      if (res.ok) {
        const data = await res.json()
        setSidebarStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch sidebar stats:', error)
    }
  }

  useEffect(() => {
    fetchSidebarStats()
    const interval = setInterval(fetchSidebarStats, 60000) // Every minute
    return () => clearInterval(interval)
  }, [])

  const navigationItems = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, href: "/super-admin" },
    { name: "Organizations", icon: <Building2 className="h-5 w-5" />, href: "/super-admin/organizations" },
    { name: "Users", icon: <Users className="h-5 w-5" />, href: "/super-admin/users" },
    { name: "Billing", icon: <Wallet className="h-5 w-5" />, href: "/super-admin/billing" },
    { name: "Platform Analytics", icon: <BarChart3 className="h-5 w-5" />, href: "/super-admin/analytics" },
    { name: "System Health", icon: <Server className="h-5 w-5" />, href: "/super-admin/system" },
    { name: "Database", icon: <Database className="h-5 w-5" />, href: "/super-admin/database" },
    { name: "Audit Logs", icon: <FileText className="h-5 w-5" />, href: "/super-admin/logs" },
    { name: "Feature Requests", icon: <FeatureIcon className="h-5 w-5" />, href: "/super-admin/features" },
    { name: "Support Hub", icon: <LifeBuoy className="h-5 w-5" />, href: "/super-admin/support" },
    { name: "Global Settings", icon: <Settings className="h-5 w-5" />, href: "/super-admin/settings" },
  ]

  const cmsItems = [
    { name: "Hero Section", icon: <LayoutTemplate className="h-5 w-5" />, href: "/super-admin/cms/hero" },
    { name: "Features", icon: <Sparkles className="h-5 w-5" />, href: "/super-admin/cms/features" },
    { name: "Pricing", icon: <CreditCard className="h-5 w-5" />, href: "/super-admin/cms/pricing" },
    { name: "Blog", icon: <PenTool className="h-5 w-5" />, href: "/super-admin/cms/blog" },
    { name: "Resources", icon: <Library className="h-5 w-5" />, href: "/super-admin/cms/resources" },
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
            <div className="p-2.5 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20 ring-1 ring-black/5">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg tracking-tight">HybridPOS</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Super Admin</span>
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
              const hasSupportNotification = item.name === "Support Hub" && notifications.some((n: any) => !n.read && (n.actionUrl?.includes('support') || n.title.toLowerCase().includes('ticket')));

              return (
                <li key={item.name}>
                  <Link
                    href={item.href as any}
                    className={`
                      group flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 font-medium text-sm
                      ${isActive
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/20 translate-x-1'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80 hover:translate-x-1'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={`mr-3.5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-purple-600'}`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                    {hasSupportNotification && !isActive && (
                      <div className="ml-2 w-2 h-2 rounded-full bg-red-500 animate-pulse ring-4 ring-red-500/20 shadow-lg shadow-red-500/40" />
                    )}
                    {/* Beautiful Notification Badge */}
                    {(() => {
                      const count = sidebarStats[item.name.toLowerCase() as keyof typeof sidebarStats]
                      if (count > 0 && !isActive) {
                        return (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="ml-auto"
                          >
                            <span className="flex items-center px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-[8px] font-black text-white uppercase tracking-tighter shadow-lg shadow-orange-500/20 animate-bounce">
                              New
                            </span>
                          </motion.div>
                        )
                      }
                      return null
                    })()}
                    {isActive && !sidebarStats[item.name.toLowerCase() as keyof typeof sidebarStats] && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                    )}
                  </Link>
                </li>
              )
            })}

            {/* CMS Section */}
            <li className="pt-6 pb-2 px-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Content Management</span>
            </li>
            {cmsItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href as any}
                    className={`
                      group flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 font-medium text-sm
                      ${isActive
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/20 translate-x-1'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80 hover:translate-x-1'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={`mr-3.5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-purple-600'}`}>
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
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div className="absolute right-0 bottom-0 h-2.5 w-2.5 bg-green-500 rounded-full ring-2 ring-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">Super Admin</span>
                <span className="text-[10px] font-medium text-gray-400">Full Access</span>
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