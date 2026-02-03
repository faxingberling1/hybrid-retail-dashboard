"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { 
  TrendingUp, TrendingDown, Users, Building2, DollarSign, 
  Package, CreditCard, Clock, ArrowUpRight, ArrowDownRight,
  Filter, Download, Eye, AlertCircle, CheckCircle,
  BarChart3, PieChart, Activity, Shield, Server,
  Database, Cpu, HardDrive, Network, Calendar,
  RefreshCw, Maximize2, Minimize2, Search,
  Mail, Phone, Globe, Smartphone, Store,
  ShoppingBag, Tag, Percent, Target, Award,
  Zap, ShieldAlert, UserCheck, Lock, Unlock,
  Info, LogOut
} from "lucide-react"
import { motion } from "framer-motion"

// Recharts for charts
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

export default function SuperAdminPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState('month')
  const [activeTab, setActiveTab] = useState('overview')
  const [sessionDebug, setSessionDebug] = useState("")

  useEffect(() => {
    console.log("🔍 Session status:", status)
    console.log("🔍 Session data:", session)
    console.log("🔍 Full session object:", JSON.stringify(session, null, 2))
    
    if (status === "loading") {
      setSessionDebug("Loading session...")
      return
    }

    if (status === "unauthenticated") {
      console.log("❌ No session, redirecting to login")
      setSessionDebug("Unauthenticated - redirecting")
      router.push("/login")
      return
    }

    if (status === "authenticated" && session?.user) {
      console.log("✅ User authenticated:", session.user)
      console.log("✅ User role:", session.user.role)
      setUserName(session.user.name || session.user.email || "Super Admin")
      setSessionDebug(`Authenticated as: ${session.user.email} (${session.user.role})`)
      
      // Check role for extra security
      if (session.user.role !== "SUPER_ADMIN") {
        console.log("⛔ Wrong role, redirecting to unauthorized")
        router.push("/unauthorized")
      } else {
        console.log("🎉 Role check passed, loading dashboard...")
      }
    }
  }, [session, status, router])

  // Mock data for charts
  const platformGrowthData = [
    { month: 'Jan', organizations: 32, users: 850, revenue: 3200000 },
    { month: 'Feb', organizations: 35, users: 920, revenue: 3800000 },
    { month: 'Mar', organizations: 38, users: 1020, revenue: 4200000 },
    { month: 'Apr', organizations: 40, users: 1150, revenue: 4800000 },
    { month: 'May', organizations: 42, users: 1248, revenue: 5200000 },
    { month: 'Jun', organizations: 45, users: 1380, revenue: 5900000 },
  ]

  const revenueData = [
    { name: 'FashionHub', value: 28, color: '#4F46E5' },
    { name: 'TechGadget', value: 22, color: '#10B981' },
    { name: 'FreshMart', value: 18, color: '#F59E0B' },
    { name: 'PharmaCare', value: 15, color: '#EF4444' },
    { name: 'Others', value: 17, color: '#6B7280' },
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
    { 
      title: "Total Organizations", 
      value: "42", 
      change: "+12%", 
      icon: <Building2 className="h-5 w-5" />, 
      color: "bg-blue-100 text-blue-600",
      trend: "up",
      description: "Active across platform"
    },
    { 
      title: "Active Users", 
      value: "1,248", 
      change: "+8%", 
      icon: <Users className="h-5 w-5" />, 
      color: "bg-green-100 text-green-600",
      trend: "up",
      description: "Logged in last 24h"
    },
    { 
      title: "Monthly Revenue", 
      value: "₨ 8.4M", 
      change: "+23%", 
      icon: <DollarSign className="h-5 w-5" />, 
      color: "bg-purple-100 text-purple-600",
      trend: "up",
      description: "Platform revenue"
    },
    { 
      title: "System Health", 
      value: "99.95%", 
      change: "+0.05%", 
      icon: <Activity className="h-5 w-5" />, 
      color: "bg-emerald-100 text-emerald-600",
      trend: "up",
      description: "Uptime last 30 days"
    },
  ]

  const timeRanges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Server },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('PKR', '₨')
  }

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
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

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading session...</p>
          <p className="mt-1 text-sm text-gray-500">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (status === "unauthenticated" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
          <button 
            onClick={() => router.push("/login")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  // Check if user has SUPER_ADMIN role
  if (session.user?.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access the Super Admin dashboard.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Your role: <span className="font-semibold">{session.user?.role || 'Unknown'}</span>
          </p>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
          >
            Logout
          </button>
          <button 
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 space-y-6 p-4 md:p-6">
      {/* Session Debug Banner (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Database className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">Session Debug</span>
            </div>
            <button 
              onClick={() => console.log("Session:", session)}
              className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded"
            >
              Log Session
            </button>
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            Status: {status} • User: {session.user?.email} • Role: {session.user?.role}
          </p>
        </div>
      )}

      {/* Header with Logout */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Platform Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, <span className="font-semibold text-purple-600">{userName}</span> • 
            Role: <span className="font-semibold text-blue-600">{session.user?.role}</span> • 
            Email: <span className="font-medium text-gray-700">{session.user?.email}</span>
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="relative">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {timeRanges.map(range => (
                <option key={range.id} value={range.id}>{range.label}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={refreshData}
            disabled={isLoading}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}>
                
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend === 'up' ? 
                      <TrendingUp className="h-4 w-4 mr-1" /> : 
                      <TrendingDown className="h-4 w-4 mr-1" />
                    }
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </motion.div>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Platform Growth Chart */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Platform Growth</h2>
                    <p className="text-sm text-gray-600">Monthly growth metrics</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-xs text-gray-600">Organizations</span>
                    </div>
                    <div className="flex items-center ml-3">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-xs text-gray-600">Users</span>
                    </div>
                    <div className="flex items-center ml-3">
                      <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-xs text-gray-600">Revenue</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={platformGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" />
                      <YAxis 
                        yAxisId="left"
                        stroke="#666"
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        stroke="#666"
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="organizations"
                        stroke="#4F46E5"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Organizations"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="users"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Users"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Revenue"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Distribution */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Revenue Distribution</h2>
                      <p className="text-sm text-gray-600">By top organizations</p>
                    </div>
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                          <Pie
                            data={revenueData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {revenueData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                          <Legend />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* System Metrics */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">System Performance</h2>
                      <p className="text-sm text-gray-600">Key metrics vs targets</p>
                    </div>
                    <Activity className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="space-y-4">
                    {systemMetrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                          <div className="flex items-center">
                            <span className="text-sm font-bold text-gray-900 mr-2">{metric.value}</span>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              metric.status === 'good' ? 'bg-green-100 text-green-800' :
                              metric.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {metric.change}
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              metric.status === 'good' ? 'bg-green-500' :
                              metric.status === 'warning' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ 
                              width: metric.name.includes('Uptime') ? '100%' :
                              metric.name.includes('Sessions') ? '62%' :
                              metric.name.includes('Database') ? '85%' : '45%'
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Current: {metric.value}</span>
                          <span>Target: {metric.target}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'organizations' && (
            <div className="space-y-8">
              {/* Top Organizations */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Top Organizations</h2>
                    <p className="text-sm text-gray-600">By revenue and growth</p>
                  </div>
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {topOrganizations.map((org, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{org.name}</div>
                          <div className="text-sm text-gray-600">{org.users} users</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{org.revenue}</div>
                        <div className="flex items-center text-green-600 justify-end">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span className="text-xs">{org.growth}</span>
                        </div>
                      </div>
                      <div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {org.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organization Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Package className="h-8 w-8 text-blue-200" />
                    <span className="text-sm font-medium bg-blue-400/30 px-3 py-1 rounded-full">
                      Today
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">1,248</h3>
                  <p className="text-blue-100">Total Transactions</p>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+12.5% from yesterday</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <CreditCard className="h-8 w-8 text-purple-200" />
                    <span className="text-sm font-medium bg-purple-400/30 px-3 py-1 rounded-full">
                      This Month
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">₨ 8.4M</h3>
                  <p className="text-purple-100">Platform Revenue</p>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+23.1% from last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="h-8 w-8 text-emerald-200" />
                    <span className="text-sm font-medium bg-emerald-400/30 px-3 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">98.2%</h3>
                  <p className="text-emerald-100">Satisfaction Rate</p>
                  <div className="mt-4 flex items-center text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Based on 42 organizations</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              {/* Security Alerts */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Security Dashboard</h2>
                    <p className="text-sm text-gray-600">Real-time security monitoring</p>
                  </div>
                  <ShieldAlert className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  {securityAlerts.map((alert, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      alert.type === 'success' ? 'border-green-200 bg-green-50' :
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {alert.type === 'warning' ? 
                            <AlertCircle className="h-5 w-5 text-yellow-600" /> :
                            alert.type === 'success' ?
                            <CheckCircle className="h-5 w-5 text-green-600" /> :
                            <Info className="h-5 w-5 text-blue-600" />
                          }
                          <div>
                            <div className="font-medium text-gray-900">{alert.message}</div>
                            <div className="flex items-center mt-2 space-x-3">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                                alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {alert.severity.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500">{alert.time}</span>
                            </div>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Security Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <Lock className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">Security Score</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">94/100</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }} />
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <UserCheck className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">2FA Adoption</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">78%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-8">
              {/* System Health */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
                    <p className="text-sm text-gray-600">Real-time system monitoring</p>
                  </div>
                  <Server className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">CPU Usage</h3>
                      <Cpu className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current</span>
                        <span className="font-medium text-green-600">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }} />
                      </div>
                      <div className="text-xs text-gray-500">Normal load</div>
                    </div>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">Memory Usage</h3>
                      <HardDrive className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Used</span>
                        <span className="font-medium text-blue-600">6.2GB / 16GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '38%' }} />
                      </div>
                      <div className="text-xs text-gray-500">38% of total</div>
                    </div>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">Network I/O</h3>
                      <Network className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Throughput</span>
                        <span className="font-medium text-orange-600">1.2 Gbps</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }} />
                      </div>
                      <div className="text-xs text-gray-500">Peak: 2.4 Gbps</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Services */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Services Status</h3>
                <div className="space-y-3">
                  {[
                    { service: 'Database', status: 'running', uptime: '99.9%' },
                    { service: 'API Gateway', status: 'running', uptime: '99.8%' },
                    { service: 'Authentication', status: 'running', uptime: '99.7%' },
                    { service: 'Payment Processing', status: 'running', uptime: '99.6%' },
                    { service: 'Email Service', status: 'running', uptime: '99.5%' },
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`h-2 w-2 rounded-full ${
                          service.status === 'running' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm font-medium">{service.service}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Uptime: <span className="font-medium">{service.uptime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'success' ? 'bg-green-100' :
                  activity.type === 'warning' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  {activity.type === 'success' ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> :
                    activity.type === 'warning' ?
                    <AlertCircle className="h-4 w-4 text-yellow-600" /> :
                    <Info className="h-4 w-4 text-blue-600" />
                  }
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{activity.action}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500">By: {activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full p-4 border border-purple-200 bg-purple-50 rounded-lg text-left hover:bg-purple-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Security Audit</div>
                  <div className="text-sm text-gray-600">Run full security scan</div>
                </div>
              </div>
            </button>
            <button className="w-full p-4 border border-blue-200 bg-blue-50 rounded-lg text-left hover:bg-blue-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Backup Now</div>
                  <div className="text-sm text-gray-600">Create immediate backup</div>
                </div>
              </div>
            </button>
            <button className="w-full p-4 border border-green-200 bg-green-50 rounded-lg text-left hover:bg-green-100 transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Add Organization</div>
                  <div className="text-sm text-gray-600">Register new organization</div>
                </div>
              </div>
            </button>
            <button className="w-full p-4 border border-orange-200 bg-orange-50 rounded-lg text-left hover:bg-orange-100 transition-colors">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="font-medium text-gray-900">Generate Report</div>
                  <div className="text-sm text-gray-600">Create monthly report</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>Platform Dashboard • Real-time monitoring • Last updated: {new Date().toLocaleTimeString()}</p>
        <p className="mt-1">System Status: <span className="text-green-600 font-medium">All Systems Operational</span></p>
      </div>
    </div>
  )
}