"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  TrendingUp, TrendingDown, Users, Building2, DollarSign, 
  ShoppingCart, Package, CreditCard, BarChart3, PieChart,
  LineChart, Activity, Calendar, Filter, Download,
  RefreshCw, Eye, MoreVertical, ArrowUpRight, ArrowDownRight,
  Clock, Globe, Smartphone, Store, ShoppingBag,
  Tag, Percent, Target, Award, Zap,
  ChartBar, ChartLine, ChartPie, ChartArea,
  ChevronRight, ChevronLeft, Maximize2, Minimize2,
  Search, Info, AlertCircle, CheckCircle
} from "lucide-react"

// Recharts for charts
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart,
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
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts'

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 4200000, transactions: 1248 },
  { month: 'Feb', revenue: 5100000, transactions: 1580 },
  { month: 'Mar', revenue: 4800000, transactions: 1420 },
  { month: 'Apr', revenue: 5900000, transactions: 1840 },
  { month: 'May', revenue: 6800000, transactions: 2100 },
  { month: 'Jun', revenue: 8400000, transactions: 2480 },
  { month: 'Jul', revenue: 9200000, transactions: 2650 },
  { month: 'Aug', revenue: 8100000, transactions: 2340 },
  { month: 'Sep', revenue: 7500000, transactions: 2180 },
  { month: 'Oct', revenue: 6900000, transactions: 1950 },
  { month: 'Nov', revenue: 7800000, transactions: 2250 },
  { month: 'Dec', revenue: 9500000, transactions: 2850 },
]

const organizationGrowth = [
  { name: 'FashionHub', value: 24, color: '#4F46E5' },
  { name: 'TechGadget', value: 18, color: '#10B981' },
  { name: 'FreshMart', value: 32, color: '#F59E0B' },
  { name: 'PharmaCare', value: 12, color: '#EF4444' },
  { name: 'HomeStyle', value: 8, color: '#8B5CF6' },
  { name: 'BookWorm', value: 15, color: '#06B6D4' },
]

const paymentMethodsData = [
  { name: 'Bank Transfer', value: 42, color: '#4F46E5' },
  { name: 'Credit Card', value: 25, color: '#10B981' },
  { name: 'JazzCash', value: 18, color: '#F59E0B' },
  { name: 'Easypaisa', value: 12, color: '#EF4444' },
  { name: 'Other', value: 3, color: '#6B7280' },
]

const performanceMetrics = [
  { name: 'System Uptime', value: 99.9, target: 99.5, status: 'exceeded' },
  { name: 'Response Time', value: 2.4, target: 3.0, status: 'exceeded' },
  { name: 'Customer Satisfaction', value: 4.7, target: 4.5, status: 'exceeded' },
  { name: 'Transaction Success', value: 98.2, target: 97.0, status: 'exceeded' },
  { name: 'Data Accuracy', value: 99.5, target: 99.0, status: 'exceeded' },
]

const topProducts = [
  { name: 'Men\'s Clothing', sales: 12480, growth: 12.5 },
  { name: 'Electronics', sales: 9870, growth: 8.3 },
  { name: 'Grocery Items', sales: 15420, growth: 15.2 },
  { name: 'Pharmacy', sales: 6320, growth: 5.8 },
  { name: 'Home Decor', sales: 4210, growth: 9.1 },
]

const regionPerformance = [
  { region: 'Karachi', revenue: 4200000, growth: 12.5, stores: 24 },
  { region: 'Lahore', revenue: 3800000, growth: 10.8, stores: 18 },
  { region: 'Islamabad', revenue: 3200000, growth: 15.2, stores: 15 },
  { region: 'Rawalpindi', revenue: 1800000, growth: 8.3, stores: 12 },
  { region: 'Faisalabad', revenue: 1500000, growth: 9.1, stores: 8 },
]

const timePeriods = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'quarter', label: 'This Quarter' },
  { id: 'year', label: 'This Year' },
  { id: 'all', label: 'All Time' },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('month')
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-12-31' })
  const [activeChart, setActiveChart] = useState('revenue')
  const [expandedChart, setExpandedChart] = useState<string | null>(null)
  const [orgFilter, setOrgFilter] = useState('all')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const stats = [
    { 
      title: "Total Revenue", 
      value: "₨ 95.2M", 
      change: "+23.5%", 
      isPositive: true,
      icon: <DollarSign className="h-5 w-5" />, 
      color: "bg-green-100 text-green-600",
      description: "Year to date"
    },
    { 
      title: "Active Organizations", 
      value: "42", 
      change: "+12.8%", 
      isPositive: true,
      icon: <Building2 className="h-5 w-5" />, 
      color: "bg-blue-100 text-blue-600",
      description: "Currently active"
    },
    { 
      title: "Total Users", 
      value: "1,248", 
      change: "+15.2%", 
      isPositive: true,
      icon: <Users className="h-5 w-5" />, 
      color: "bg-purple-100 text-purple-600",
      description: "Across all organizations"
    },
    { 
      title: "Avg. Transaction", 
      value: "₨ 3,250", 
      change: "+8.4%", 
      isPositive: true,
      icon: <ShoppingCart className="h-5 w-5" />, 
      color: "bg-orange-100 text-orange-600",
      description: "Per transaction"
    },
  ]

  const kpis = [
    { title: "Monthly Recurring Revenue", value: "₨ 8.4M", change: "+18.2%" },
    { title: "Customer Acquisition Cost", value: "₨ 4,250", change: "-5.3%" },
    { title: "Customer Lifetime Value", value: "₨ 125,000", change: "+12.8%" },
    { title: "Churn Rate", value: "2.4%", change: "-0.8%" },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('PKR', '₨')
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-PK').format(num)
  }

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  const exportData = (format: string) => {
    alert(`Exporting data as ${format.toUpperCase()}`)
    setShowExportMenu(false)
  }

  const toggleChartExpand = (chartId: string) => {
    setExpandedChart(expandedChart === chartId ? null : chartId)
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('revenue') ? formatCurrency(entry.value) : formatNumber(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="relative">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {timePeriods.map(period => (
                <option key={period.id} value={period.id}>{period.label}</option>
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
          <div className="relative">
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button 
                  onClick={() => exportData('pdf')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 border-b"
                >
                  Export as PDF
                </button>
                <button 
                  onClick={() => exportData('csv')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 border-b"
                >
                  Export as CSV
                </button>
                <button 
                  onClick={() => exportData('excel')}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Export as Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm mb-2">{stat.title}</p>
            <p className="text-xs text-gray-500">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue & Growth Chart */}
      <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${expandedChart === 'revenue' ? 'fixed inset-4 z-50' : ''}`}>
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <LineChart className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Revenue & Growth</h2>
              <p className="text-sm text-gray-600">Monthly revenue and transaction trends</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-xs text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center ml-3">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs text-gray-600">Transactions</span>
              </div>
            </div>
            <button
              onClick={() => toggleChartExpand('revenue')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {expandedChart === 'revenue' ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
        
        <div className="p-4" style={{ height: expandedChart === 'revenue' ? 'calc(100vh - 120px)' : '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis 
                yAxisId="left"
                stroke="#666"
                tickFormatter={(value) => formatCurrency(value).replace('₨', '₨')}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#666"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#4F46E5"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Revenue"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="transactions"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                name="Transactions"
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organization Distribution */}
        <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${expandedChart === 'orgs' ? 'fixed inset-4 z-50' : ''}`}>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PieChart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Organization Distribution</h2>
                <p className="text-sm text-gray-600">Users per organization</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleChartExpand('orgs')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {expandedChart === 'orgs' ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="p-4" style={{ height: expandedChart === 'orgs' ? 'calc(100vh - 120px)' : '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={organizationGrowth}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={expandedChart === 'orgs' ? 180 : 100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {organizationGrowth.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${expandedChart === 'payments' ? 'fixed inset-4 z-50' : ''}`}>
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
                <p className="text-sm text-gray-600">Popular payment methods distribution</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleChartExpand('payments')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {expandedChart === 'payments' ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="p-4" style={{ height: expandedChart === 'payments' ? 'calc(100vh - 120px)' : '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentMethodsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {paymentMethodsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Third Row - KPIs & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key Performance Indicators */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Key Metrics</h2>
              <p className="text-sm text-gray-600">Performance indicators</p>
            </div>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {kpis.map((kpi, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-600">{kpi.title}</div>
                  <div className="text-lg font-bold text-gray-900 mt-1">{kpi.value}</div>
                </div>
                <div className={`flex items-center ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.change.startsWith('+') ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                  <span className="text-sm font-medium">{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">System Performance</h2>
              <p className="text-sm text-gray-600">Key metrics vs targets</p>
            </div>
            <Activity className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-gray-900 mr-2">{metric.value}{metric.name.includes('Time') ? 's' : '%'}</span>
                    {metric.status === 'exceeded' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Current: {metric.value}{metric.name.includes('Time') ? 's' : '%'}</span>
                  <span>Target: {metric.target}{metric.name.includes('Time') ? 's' : '%'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products/Services */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Top Categories</h2>
              <p className="text-sm text-gray-600">By sales volume</p>
            </div>
            <ShoppingBag className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-3">
                    <Tag className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-600">{formatNumber(product.sales)} sales</div>
                  </div>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">+{product.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fourth Row - Regional Performance & Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Regional Performance</h2>
              <p className="text-sm text-gray-600">Revenue by region</p>
            </div>
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {regionPerformance.map((region, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                      <Store className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{region.region}</div>
                      <div className="text-xs text-gray-600">{region.stores} stores</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{formatCurrency(region.revenue)}</div>
                    <div className="flex items-center text-green-600 justify-end">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span className="text-xs">+{region.growth}%</span>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(region.revenue / 9500000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Area Chart - User Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">User Activity Trends</h2>
              <p className="text-sm text-gray-600">Daily active users and sessions</p>
            </div>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { day: 'Mon', users: 420, sessions: 850 },
                  { day: 'Tue', users: 380, sessions: 720 },
                  { day: 'Wed', users: 510, sessions: 920 },
                  { day: 'Thu', users: 480, sessions: 880 },
                  { day: 'Fri', users: 550, sessions: 980 },
                  { day: 'Sat', users: 620, sessions: 1120 },
                  { day: 'Sun', users: 580, sessions: 1050 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.3} />
                <Area type="monotone" dataKey="sessions" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Insights & Recommendations</h2>
            <p className="text-purple-200">AI-powered suggestions to improve performance</p>
          </div>
          <Zap className="h-6 w-6 text-purple-200" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 mr-2" />
              <span className="font-semibold">Revenue Growth</span>
            </div>
            <p className="text-sm text-purple-200">
              Revenue increased by 23.5% this month. Consider expanding to new regions.
            </p>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 mr-2" />
              <span className="font-semibold">User Engagement</span>
            </div>
            <p className="text-sm text-purple-200">
              User activity peaks on weekends. Schedule promotions accordingly.
            </p>
          </div>
          
          <div className="bg-white/10 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <CreditCard className="h-5 w-5 mr-2" />
              <span className="font-semibold">Payment Trends</span>
            </div>
            <p className="text-sm text-purple-200">
              JazzCash usage increased by 18%. Consider adding more mobile payment options.
            </p>
          </div>
        </div>
      </div>

      {/* Data Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Data Filters</h2>
            <p className="text-sm text-gray-600">Customize analytics view</p>
          </div>
          <Filter className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization Filter
            </label>
            <select 
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Organizations</option>
              <option value="org-001">FashionHub Retail</option>
              <option value="org-002">TechGadget Store</option>
              <option value="org-003">FreshMart Superstore</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chart Type
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveChart('revenue')}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex-1 ${
                  activeChart === 'revenue' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LineChart className="h-4 w-4 inline mr-2" />
                Line
              </button>
              <button
                onClick={() => setActiveChart('bar')}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex-1 ${
                  activeChart === 'bar' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Bar
              </button>
              <button
                onClick={() => setActiveChart('area')}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex-1 ${
                  activeChart === 'area' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChartArea className="h-4 w-4 inline mr-2" />
                Area
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={() => {
              setTimeRange('month')
              setDateRange({ start: '2024-01-01', end: '2024-12-31' })
              setOrgFilter('all')
              setActiveChart('revenue')
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
          <button
            onClick={() => alert('Applying filters...')}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>Analytics Dashboard • Data updates in real-time • Last updated: Today at 14:30 PKT</p>
        <p className="mt-1">Powered by Advanced Analytics Engine v2.1.4</p>
      </div>

      {/* Expanded Chart Overlay Background */}
      {expandedChart && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setExpandedChart(null)}
        />
      )}
    </div>
  )
}