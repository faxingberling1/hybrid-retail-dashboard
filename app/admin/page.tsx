"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  Building2, Users, DollarSign, Package,
  CreditCard, TrendingUp, BarChart3, PieChart,
  ShoppingBag, Tag, Percent, Activity,
  Filter, Download, RefreshCw, LogOut,
  Store, ShoppingCart, Clock, CheckCircle,
  AlertCircle, Info, Eye, Shield
} from "lucide-react"
import { motion } from "framer-motion"
import IndustryDashboardPersonalizer from '@/components/dashboard/industry-dashboard-personalizer';
import { OnboardingBanner } from '@/components/dashboard/onboarding-banner';
import { DashboardFooter } from '@/components/dashboard/dashboard-footer';

// Recharts for charts
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts'

export default function AdminPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [timeRange, setTimeRange] = useState('week')
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    console.log("🔍 Admin - Session status:", status)

    if (status === "unauthenticated") {
      console.log("❌ Admin - No session, redirecting to login")
      router.push("/login")
      return
    }

    if (status === "authenticated" && session?.user) {
      console.log("✅ Admin - User authenticated:", session.user.email)

      if (session.user.role !== "ADMIN") {
        console.log("⛔ Admin - Wrong role, redirecting")
        router.push("/unauthorized")
      }
    }
  }, [session, status, router])

  // Mock data
  const storeData = [
    { day: 'Mon', sales: 42000, transactions: 128, customers: 89 },
    { day: 'Tue', sales: 52000, transactions: 145, customers: 104 },
    { day: 'Wed', sales: 48000, transactions: 138, customers: 97 },
    { day: 'Thu', sales: 61000, transactions: 168, customers: 125 },
    { day: 'Fri', sales: 72000, transactions: 192, customers: 148 },
    { day: 'Sat', sales: 85000, transactions: 218, customers: 168 },
    { day: 'Sun', sales: 68000, transactions: 185, customers: 142 },
  ]

  const inventoryData = [
    { category: 'Electronics', value: 35, color: '#4F46E5' },
    { category: 'Clothing', value: 25, color: '#10B981' },
    { category: 'Home Goods', value: 20, color: '#F59E0B' },
    { category: 'Food & Beverage', value: 15, color: '#EF4444' },
    { category: 'Others', value: 5, color: '#6B7280' },
  ]

  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 42, revenue: '₨ 420,000', growth: '+18%' },
    { name: 'MacBook Air M2', sales: 28, revenue: '₨ 280,000', growth: '+12%' },
    { name: 'AirPods Pro', sales: 56, revenue: '₨ 168,000', growth: '+24%' },
    { name: 'iPad Pro', sales: 19, revenue: '₨ 190,000', growth: '+8%' },
    { name: 'Apple Watch', sales: 34, revenue: '₨ 102,000', growth: '+15%' },
  ]

  const staffMembers = [
    { name: 'Ali Ahmed', role: 'Manager', sales: '₨ 120,000', status: 'active' },
    { name: 'Sara Khan', role: 'Cashier', sales: '₨ 85,000', status: 'active' },
    { name: 'Usman Malik', role: 'Sales Associate', sales: '₨ 65,000', status: 'active' },
    { name: 'Fatima Raza', role: 'Inventory Manager', sales: '₨ 45,000', status: 'break' },
    { name: 'Bilal Hussain', role: 'Customer Service', sales: '₨ 55,000', status: 'active' },
  ]

  const statsData = [
    {
      title: "Today's Sales",
      value: "₨ 72,000",
      change: "+15%",
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-green-100 text-green-600",
      trend: "up"
    },
    {
      title: "Total Orders",
      value: "1,248",
      change: "+8%",
      icon: <ShoppingBag className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-600",
      trend: "up"
    },
    {
      title: "Active Customers",
      value: "892",
      change: "+12%",
      icon: <Users className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-600",
      trend: "up"
    },
    {
      title: "Inventory Items",
      value: "1,456",
      change: "-3%",
      icon: <Package className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-600",
      trend: "down"
    },
  ]

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'reports', label: 'Reports', icon: PieChart },
  ]

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
          <p className="mt-2 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || !session) {
    return null
  }

  if (session.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            Admin access required.
          </p>
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

  return (
    <div className="min-h-screen bg-white space-y-6">
      <OnboardingBanner />

      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {session.user?.industry
                ? `${session.user.industry.charAt(0).toUpperCase() + session.user.industry.slice(1)} Admin Dashboard`
                : 'Store Admin Dashboard'
              }
            </h1>
            <p className="text-gray-600 mt-2">
              Welcome, <span className="font-semibold text-blue-600">{session.user?.name || session.user?.email}</span> •
              Role: <span className="font-semibold text-blue-600">Store Admin</span> •
              Store: <span className="font-medium text-gray-700">TechGadget Store</span>
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
            <button
              onClick={() => setIsLoading(true)}
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

        {/* Industry-Specific Personalization */}
        <IndustryDashboardPersonalizer industry={session.user?.industry || 'retail'} />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend === 'up' ?
                      <TrendingUp className="h-4 w-4 mr-1" /> :
                      <TrendingUp className="h-4 w-4 mr-1 transform rotate-180" />
                    }
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
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
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Sales Chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Sales Performance</h2>
                      <p className="text-sm text-gray-600">Last 7 days sales data</p>
                    </div>
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={storeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="day" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          name="Sales (PKR)"
                          stroke="#4F46E5"
                          fill="#4F46E5"
                          fillOpacity={0.1}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Products & Staff */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Top Products */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
                        <p className="text-sm text-gray-600">This week</p>
                      </div>
                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-4">
                      {topProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                              <Tag className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-600">{product.sales} units sold</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{product.revenue}</div>
                            <div className="flex items-center text-green-600 justify-end">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              <span className="text-xs">{product.growth}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Staff Performance */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Staff Performance</h2>
                        <p className="text-sm text-gray-600">Today's sales</p>
                      </div>
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-4">
                      {staffMembers.map((staff, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-3">
                              <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{staff.name}</div>
                              <div className="text-sm text-gray-600">{staff.role}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{staff.sales}</div>
                            <div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${staff.status === 'active' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'
                                }`}>
                                {staff.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-8">
                {/* Inventory Distribution - FIXED: Simplified label */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Inventory Distribution</h2>
                      <p className="text-sm text-gray-600">By category</p>
                    </div>
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={inventoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry: any) => `${entry.category}: ${entry.value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {inventoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'staff' && (
              <div className="space-y-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Manage Staff</h2>
                  {/* Staff management content */}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-8">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Reports & Analytics</h2>
                  {/* Reports content */}
                </div>
              </div>
            )}
          </div>
        </div>

        <DashboardFooter />
      </div>
    </div>
  )
}