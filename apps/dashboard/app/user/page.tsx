"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  ShoppingCart, DollarSign, Clock, Package,
  TrendingUp, CreditCard, Users, Store,
  BarChart3, PieChart, Activity, Filter,
  Download, RefreshCw, LogOut, CheckCircle,
  AlertCircle, Info, Eye, Receipt,
  QrCode, Scan, Calculator, Calendar
} from "lucide-react"
import { motion } from "framer-motion"

export default function UserPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('pos')

  useEffect(() => {
    console.log("🔍 User - Session status:", status)
    
    if (status === "unauthenticated") {
      console.log("❌ User - No session, redirecting to login")
      router.push("/login")
      return
    }

    if (status === "authenticated" && session?.user) {
      console.log("✅ User - User authenticated:", session.user.email)
      
      if (session.user.role !== "USER") {
        console.log("⛔ User - Wrong role, redirecting")
        router.push("/unauthorized")
      }
    }
  }, [session, status, router])

  // Mock data
  const recentTransactions = [
    { id: 'TXN-001', customer: 'Ali Ahmed', amount: '₨ 12,500', items: 3, time: '10:30 AM', status: 'completed' },
    { id: 'TXN-002', customer: 'Sara Khan', amount: '₨ 8,750', items: 2, time: '11:15 AM', status: 'completed' },
    { id: 'TXN-003', customer: 'Usman Malik', amount: '₨ 25,000', items: 5, time: '12:45 PM', status: 'pending' },
    { id: 'TXN-004', customer: 'Fatima Raza', amount: '₨ 6,200', items: 1, time: '01:30 PM', status: 'completed' },
    { id: 'TXN-005', customer: 'Bilal Hussain', amount: '₨ 15,800', items: 4, time: '02:15 PM', status: 'completed' },
  ]

  const quickActions = [
    { id: 1, label: 'New Sale', icon: <ShoppingCart className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600' },
    { id: 2, label: 'Scan Product', icon: <Scan className="h-5 w-5" />, color: 'bg-green-100 text-green-600' },
    { id: 3, label: 'View Inventory', icon: <Package className="h-5 w-5" />, color: 'bg-purple-100 text-purple-600' },
    { id: 4, label: 'Customer Lookup', icon: <Users className="h-5 w-5" />, color: 'bg-orange-100 text-orange-600' },
    { id: 5, label: 'Daily Report', icon: <BarChart3 className="h-5 w-5" />, color: 'bg-red-100 text-red-600' },
    { id: 6, label: 'Print Receipt', icon: <Receipt className="h-5 w-5" />, color: 'bg-indigo-100 text-indigo-600' },
  ]

  const todayStats = [
    { title: "Today's Sales", value: "₨ 42,500", change: "+18%", icon: <DollarSign className="h-5 w-5" /> },
    { title: "Transactions", value: "24", change: "+12%", icon: <ShoppingCart className="h-5 w-5" /> },
    { title: "Customers", value: "18", change: "+8%", icon: <Users className="h-5 w-5" /> },
    { title: "Avg. Ticket", value: "₨ 1,770", change: "+5%", icon: <CreditCard className="h-5 w-5" /> },
  ]

  const tabs = [
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'customers', label: 'Customers', icon: Users },
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
          <p className="mt-2 text-gray-600">Loading user dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || !session) {
    return null
  }

  if (session.user?.role !== "USER") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <ShoppingCart className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            User access required.
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
    <div className="min-h-screen bg-gray-50 space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Point of Sale Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome, <span className="font-semibold text-blue-600">{session.user?.name || session.user?.email}</span> • 
            Role: <span className="font-semibold text-blue-600">Staff User</span> • 
            Terminal: <span className="font-medium text-gray-700">Terminal #01</span>
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <button 
            onClick={() => setIsLoading(true)}
            disabled={isLoading}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync
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

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {todayStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-blue-100 text-blue-600`}>
                {stat.icon}
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className={`p-3 rounded-lg ${action.color} mb-2`}>
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calculator */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Calculator</h2>
            <div className="grid grid-cols-4 gap-2">
              {['7', '8', '9', '+', '4', '5', '6', '-', '1', '2', '3', '×', 'C', '0', '.', '÷'].map((btn) => (
                <button
                  key={btn}
                  className={`p-4 rounded-lg font-medium ${
                    ['+', '-', '×', '÷'].includes(btn)
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : btn === 'C'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-right text-2xl font-bold text-gray-900">0.00</div>
            </div>
          </div>
        </div>

        {/* Right Column - POS Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
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
              {activeTab === 'pos' && (
                <div className="space-y-6">
                  {/* Product Scan */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">Scan Product</h3>
                      <QrCode className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        placeholder="Enter product code or scan barcode..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                        Scan
                      </button>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div className="border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">Current Sale</h3>
                      <p className="text-sm text-gray-600">3 items in cart</p>
                    </div>
                    <div className="p-4 space-y-3">
                      {[
                        { name: 'iPhone 15 Pro', qty: 1, price: '₨ 120,000', total: '₨ 120,000' },
                        { name: 'AirPods Pro', qty: 2, price: '₨ 30,000', total: '₨ 60,000' },
                        { name: 'USB-C Cable', qty: 1, price: '₨ 2,500', total: '₨ 2,500' },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-600">Qty: {item.qty} × {item.price}</div>
                          </div>
                          <div className="font-bold text-gray-900">{item.total}</div>
                          <button className="ml-4 text-red-600 hover:text-red-700">
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">₨ 182,500</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tax (17%)</span>
                          <span className="font-medium">₨ 31,025</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>₨ 213,525</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300">
                          Hold Sale
                        </button>
                        <button className="px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                          Process Payment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                      <p className="text-sm text-gray-600">Today's sales transactions</p>
                    </div>
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="space-y-3">
                    {recentTransactions.map((txn, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                            <Receipt className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{txn.id} - {txn.customer}</div>
                            <div className="text-sm text-gray-600">{txn.items} items • {txn.time}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{txn.amount}</div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            txn.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {txn.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Customer Management</h2>
                  {/* Customer management content */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>POS System • Terminal #01 • Staff: {session.user?.name}</p>
        <p className="mt-1">Shift started: 9:00 AM • Status: <span className="text-green-600 font-medium">Active</span></p>
      </div>
    </div>
  )
}