"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import {
  Users, Building2, DollarSign, Activity,
  BarChart3, Shield, Server, RefreshCw, LogOut,
  Database, Zap
} from "lucide-react"

// Dynamically import tab components for performance optimization
const OverviewTab = dynamic(() => import("@/components/dashboard/super-admin/overview-tab"), {
  loading: () => <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl animate-pulse text-gray-400">Loading Overview...</div>
})

const OrganizationsTab = dynamic(() => import("@/components/dashboard/super-admin/organizations-tab"), {
  loading: () => <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl animate-pulse text-gray-400">Loading Organizations...</div>
})

const SecurityTab = dynamic(() => import("@/components/dashboard/super-admin/security-tab"), {
  loading: () => <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl animate-pulse text-gray-400">Loading Security...</div>
})

const SystemTab = dynamic(() => import("@/components/dashboard/super-admin/system-tab"), {
  loading: () => <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl animate-pulse text-gray-400">Loading System Health...</div>
})

const ControlHubTab = dynamic(() => import("@/components/dashboard/super-admin/control-hub-tab"), {
  loading: () => <div className="h-80 flex items-center justify-center bg-gray-50 rounded-xl animate-pulse text-gray-400">Loading Control Hub...</div>
})

// Shared Components
import StatsGrid from "@/components/dashboard/super-admin/shared/stats-grid"
import RecentActivity from "@/components/dashboard/super-admin/shared/recent-activity"
import SystemStatusBanner from "@/components/dashboard/super-admin/shared/system-status-banner"

export default function SuperAdminPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState('month')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated" && session?.user) {
      setUserName(session.user.name || session.user.email || "Super Admin")

      if (session.user.role !== "SUPER_ADMIN") {
        router.push("/unauthorized")
      }
    }
  }, [session, status, router])

  // Data for components (In a real app, this would be fetched via TanStack Query)
  const platformGrowthData = [
    { month: 'Jan', organizations: 32, users: 850, revenue: 3200000 },
    { month: 'Feb', organizations: 35, users: 920, revenue: 3800000 },
    { month: 'Mar', organizations: 38, users: 1020, revenue: 4200000 },
    { month: 'Apr', organizations: 40, users: 1150, revenue: 4800000 },
    { month: 'May', organizations: 42, users: 1248, revenue: 5200000 },
    { month: 'Jun', organizations: 45, users: 1380, revenue: 5900000 },
  ]

  const revenueData = [
    { name: 'FashionHub', value: 28, revenue: 2352000, growth: '+12.5%', color: '#4F46E5', status: 'up' },
    { name: 'TechGadget', value: 22, revenue: 1848000, growth: '+8.2%', color: '#10B981', status: 'up' },
    { name: 'FreshMart', value: 18, revenue: 1512000, growth: '-2.4%', color: '#F59E0B', status: 'down' },
    { name: 'PharmaCare', value: 15, revenue: 1260000, growth: '+15.8%', color: '#EF4444', status: 'up' },
    { name: 'Others', value: 17, revenue: 1428000, growth: '+5.4', color: '#6B7280', status: 'up' },
  ]

  const systemMetrics = [
    { name: 'API Response Time', value: '45ms', target: '100ms', status: 'good', change: '+5%' },
    { name: 'Database Load', value: '68%', target: '80%', status: 'warning', change: '+12%' },
    { name: 'Server Uptime', value: '99.95%', target: '99.9%', status: 'good', change: '+0.05%' },
    { name: 'Active Sessions', value: '1,248', target: '2,000', status: 'good', change: '+8%' },
  ]

  const recentActivities = [
    { id: 1, action: "New organization registered: HomeStyle Decor", user: "system", time: "10 minutes ago", type: "success" },
    { id: 2, action: "System maintenance completed successfully", user: "admin", time: "1 hour ago", type: "info" },
    { id: 3, action: "Monthly financial report generated", user: "system", time: "2 hours ago", type: "info" },
    { id: 4, action: "Security audit initiated", user: "security-team", time: "3 hours ago", type: "warning" },
    { id: 5, action: "Database backup completed (2.4GB)", user: "system", time: "4 hours ago", type: "success" },
  ]

  const topOrganizations = [
    { name: 'FashionHub Retail', revenue: '₨ 2.4M', growth: '+23.5%', users: 128, status: 'active' },
    { name: 'TechGadget Store', revenue: '₨ 1.8M', growth: '+18.2%', users: 96, status: 'active' },
    { name: 'FreshMart Superstore', revenue: '₨ 1.5M', growth: '+15.8%', users: 84, status: 'active' },
    { name: 'PharmaCare Pharmacy', revenue: '₨ 1.2M', growth: '+12.4%', users: 72, status: 'active' },
    { name: 'HomeStyle Decor', revenue: '₨ 0.9M', growth: '+8.7%', users: 48, status: 'pending' },
  ]

  const securityAlerts = [
    { id: 1, type: 'warning', message: 'Multiple failed login attempts detected', severity: 'medium', time: '5 minutes ago' },
    { id: 2, type: 'info', message: 'Security certificate renewed', severity: 'low', time: '2 hours ago' },
    { id: 3, type: 'success', message: 'Vulnerability scan completed', severity: 'low', time: '6 hours ago' },
  ]

  const statsData = [
    { title: "Total Organizations", value: "42", change: "+12%", icon: <Building2 className="h-5 w-5" />, color: "bg-blue-600 shadow-blue-500/20", trend: "up", description: "Active across platform" },
    { title: "Active Users", value: "1,248", change: "+8%", icon: <Users className="h-5 w-5" />, color: "bg-indigo-600 shadow-indigo-500/20", trend: "up", description: "Logged in last 24h" },
    { title: "Monthly Revenue", value: "₨ 8.4M", change: "+23%", icon: <DollarSign className="h-5 w-5" />, color: "bg-violet-600 shadow-violet-500/20", trend: "up", description: "Platform revenue" },
    { title: "System Health", value: "99.95%", change: "+0.05%", icon: <Activity className="h-5 w-5" />, color: "bg-emerald-600 shadow-emerald-500/20", trend: "up", description: "System health" },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'organizations', label: 'Organization Management', icon: Building2 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Server },
    { id: 'control-hub', label: 'Control Hub', icon: Zap },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency', currency: 'PKR', minimumFractionDigits: 0, maximumFractionDigits: 0
    }).format(amount).replace('PKR', '₨')
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading session...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== "SUPER_ADMIN") return null

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 dashboard-grid pb-12">
      {/* Session Debug Banner (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="max-w-[1600px] mx-auto pt-4 px-4">
          <div className="bg-amber-500/10 backdrop-blur-sm border border-amber-200/20 rounded-xl p-3 flex items-center">
            <Database className="h-4 w-4 text-amber-500 mr-2" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              System Active: {session.user?.email}
            </span>
          </div>
        </div>
      )}

      {/* Unified Dashboard Container */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 space-y-12 pt-8 pb-12">
        {/* Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-900/5 pb-8 mb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-12 grad-indigo rounded-full" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">Super Admin</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Platform <span className="text-grad">Intelligence</span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                Monitoring <span className="text-slate-900 dark:text-slate-200 font-bold">{userName}</span> •
                <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                  {session.user?.role} Access
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 glass p-2 rounded-2xl">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2.5 bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800/30 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:bg-white"
              >
                <option value="today">Real-time (Today)</option>
                <option value="week">Historical (Week)</option>
                <option value="month">Enterprise (Month)</option>
              </select>

              <button
                onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 1000) }}
                disabled={isLoading}
                className="p-2.5 glass-card rounded-xl disabled:opacity-50 group hover:bg-indigo-500"
              >
                <RefreshCw className={`h-5 w-5 text-indigo-500 group-hover:text-white transition-colors ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleLogout}
                className="px-5 py-2.5 grad-warm text-white rounded-xl font-black text-sm uppercase tracking-widest hover:shadow-lg hover:shadow-rose-500/20 active:scale-95 transition-all flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Exit
              </button>
            </div>
          </div>
        </motion.div>

        {/* Global Persistence Layer */}
        <div className="space-y-8">
          <SystemStatusBanner />
          <StatsGrid statsData={statsData} />
        </div>

        {/* Dynamic Navigation & Content Layer */}
        <div className="space-y-8">
          <div className="flex items-center w-full">
            <nav className="flex items-center w-full glass p-2 rounded-2xl border border-slate-900/[0.08]" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative flex-1 py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center ${isActive
                      ? 'text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0">
                        <motion.div
                          layoutId="activeTab"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          className="absolute inset-0 grad-indigo rounded-xl shadow-lg"
                        />
                      </div>
                    )}
                    <div className="relative z-10 flex items-center space-x-2">
                      <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Module Content Switcher */}
          <div className="glass p-1 rounded-[2rem] overflow-hidden shadow-premium border border-slate-900/[0.08]">
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-[1.8rem] border border-slate-900/5">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab === 'overview' && (
                  <OverviewTab
                    platformGrowthData={platformGrowthData}
                    revenueData={revenueData}
                    systemMetrics={systemMetrics}
                    formatCurrency={formatCurrency}
                    CustomTooltip={CustomTooltip}
                  />
                )}

                {activeTab === 'organizations' && <OrganizationsTab />}
                {activeTab === 'security' && <SecurityTab securityAlerts={securityAlerts} />}
                {activeTab === 'system' && <SystemTab />}
                {activeTab === 'control-hub' && <ControlHubTab />}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Lower Section */}
        <div className="grid grid-cols-1 gap-8">
          <div className="w-full">
            <RecentActivity recentActivities={recentActivities} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-400 pt-8 border-t border-slate-100 dark:border-slate-800">
          <p className="font-bold uppercase tracking-widest text-[10px]">Platform Dashboard • Real-time monitoring • Last updated: {new Date().toLocaleTimeString()}</p>
          <div className="mt-2 flex items-center justify-center space-x-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">All Systems Operational</span>
          </div>
        </div>
      </div>
    </div>
  )
}
