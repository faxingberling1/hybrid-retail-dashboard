"use client"

import { useState, useEffect } from "react"
import { 
  Database, 
  Server, 
  HardDrive, 
  Cpu, 
  RefreshCw, 
  Download, 
  Upload,
  Play,
  Pause,
  Settings,
  Key,
  Table,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Trash2,
  Plus,
  Edit,
  Lock,
  Unlock,
  Shield,
  Globe,
  Users,
  FileText,
  Zap
} from "lucide-react"
import { motion } from "framer-motion"

// Recharts for charts
import {
  LineChart, Line,
  BarChart, Bar,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

export default function DatabasePage() {
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [activeTab, setActiveTab] = useState<'overview' | 'tables' | 'queries' | 'backup' | 'users'>('overview')
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDatabase, setSelectedDatabase] = useState("hybridpos_db")
  const [showQueryModal, setShowQueryModal] = useState(false)
  const [query, setQuery] = useState("SELECT * FROM users LIMIT 10;")

  // Mock data for charts
  const queryPerformanceData = [
    { time: '00:00', avg: 12, slow: 2 },
    { time: '04:00', avg: 8, slow: 1 },
    { time: '08:00', avg: 18, slow: 3 },
    { time: '12:00', avg: 25, slow: 5 },
    { time: '16:00', avg: 32, slow: 8 },
    { time: '20:00', avg: 22, slow: 4 },
    { time: '23:59', avg: 15, slow: 2 },
  ]

  const storageDistribution = [
    { name: 'User Data', value: 45, color: '#4F46E5' },
    { name: 'Transactions', value: 30, color: '#10B981' },
    { name: 'Logs', value: 15, color: '#F59E0B' },
    { name: 'Backups', value: 10, color: '#EF4444' },
  ]

  const connectionStats = [
    { hour: '9AM', active: 42, idle: 8 },
    { hour: '10AM', active: 58, idle: 12 },
    { hour: '11AM', active: 72, idle: 18 },
    { hour: '12PM', active: 85, idle: 15 },
    { hour: '1PM', active: 68, idle: 12 },
    { hour: '2PM', active: 92, idle: 28 },
    { hour: '3PM', active: 78, idle: 22 },
  ]

  const databaseMetrics = [
    { name: 'Database Size', value: '12.4 GB', target: '50 GB', status: 'good', icon: <HardDrive className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600', usage: '25%' },
    { name: 'Active Connections', value: '85', target: '200', status: 'good', icon: <Users className="h-5 w-5" />, color: 'bg-green-100 text-green-600', usage: '42%' },
    { name: 'Query Throughput', value: '1,248/sec', target: '5,000/sec', status: 'excellent', icon: <Zap className="h-5 w-5" />, color: 'bg-purple-100 text-purple-600', usage: '25%' },
    { name: 'Cache Hit Ratio', value: '98.2%', target: '95%', status: 'excellent', icon: <Cpu className="h-5 w-5" />, color: 'bg-emerald-100 text-emerald-600', usage: '100%' },
  ]

  const tableList = [
    { name: 'users', rows: '1,248', size: '124 MB', lastUpdated: '2 hours ago', indexes: 3 },
    { name: 'organizations', rows: '42', size: '8 MB', lastUpdated: '1 hour ago', indexes: 2 },
    { name: 'transactions', rows: '45,820', size: '2.4 GB', lastUpdated: '5 minutes ago', indexes: 4 },
    { name: 'products', rows: '12,456', size: '456 MB', lastUpdated: '3 hours ago', indexes: 5 },
    { name: 'inventory', rows: '8,924', size: '342 MB', lastUpdated: '10 minutes ago', indexes: 3 },
    { name: 'customers', rows: '23,451', size: '1.2 GB', lastUpdated: '30 minutes ago', indexes: 4 },
    { name: 'orders', rows: '38,942', size: '1.8 GB', lastUpdated: '15 minutes ago', indexes: 6 },
    { name: 'logs', rows: '245,821', size: '4.2 GB', lastUpdated: 'Just now', indexes: 2 },
  ]

  const slowQueries = [
    { id: 1, query: 'SELECT * FROM transactions WHERE created_at > NOW() - INTERVAL \'30 days\'', duration: '2.4s', calls: 42, lastRun: '5 minutes ago' },
    { id: 2, query: 'UPDATE inventory SET quantity = quantity - 1 WHERE product_id = $1', duration: '1.8s', calls: 128, lastRun: '2 minutes ago' },
    { id: 3, query: 'SELECT users.*, organizations.name FROM users JOIN organizations ON users.org_id = organizations.id', duration: '1.2s', calls: 56, lastRun: '10 minutes ago' },
    { id: 4, query: 'DELETE FROM logs WHERE created_at < NOW() - INTERVAL \'90 days\'', duration: '3.5s', calls: 1, lastRun: '1 hour ago' },
  ]

  const backupHistory = [
    { id: 1, type: 'Full', size: '12.4 GB', status: 'completed', date: '2 hours ago', duration: '15m 24s' },
    { id: 2, type: 'Incremental', size: '2.1 GB', status: 'completed', date: '1 hour ago', duration: '4m 12s' },
    { id: 3, type: 'Full', size: '12.4 GB', status: 'completed', date: 'Yesterday', duration: '16m 08s' },
    { id: 4, type: 'Incremental', size: '1.8 GB', status: 'failed', date: 'Yesterday', duration: '3m 45s' },
    { id: 5, type: 'Full', size: '12.1 GB', status: 'completed', date: '2 days ago', duration: '14m 56s' },
  ]

  const databaseUsers = [
    { username: 'hybridpos_app', role: 'Application', connections: 42, lastActive: 'Just now', status: 'active' },
    { username: 'hybridpos_admin', role: 'Administrator', connections: 1, lastActive: '2 hours ago', status: 'active' },
    { username: 'hybridpos_readonly', role: 'Read Only', connections: 3, lastActive: '5 minutes ago', status: 'active' },
    { username: 'backup_user', role: 'Backup', connections: 0, lastActive: '6 hours ago', status: 'idle' },
    { username: 'report_user', role: 'Reporting', connections: 8, lastActive: '15 minutes ago', status: 'active' },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tables', label: 'Tables', icon: Table },
    { id: 'queries', label: 'Queries', icon: Search },
    { id: 'backup', label: 'Backup', icon: Download },
    { id: 'users', label: 'Users', icon: Users },
  ]

  const databases = [
    { name: 'hybridpos_db', size: '12.4 GB', connections: 85, status: 'online' },
    { name: 'analytics_db', size: '8.2 GB', connections: 12, status: 'online' },
    { name: 'backup_db', size: '24.8 GB', connections: 1, status: 'online' },
    { name: 'test_db', size: '256 MB', connections: 0, status: 'offline' },
  ]

  const refreshData = () => {
    setLoading(true)
    setTimeout(() => {
      setLastUpdate(new Date())
      setLoading(false)
    }, 1000)
  }

  const executeQuery = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowQueryModal(false)
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Byte'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online':
      case 'active':
      case 'completed': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'error':
      case 'failed': return 'bg-red-100 text-red-800'
      case 'idle': return 'bg-gray-100 text-gray-800'
      case 'offline': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'online':
      case 'active':
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertCircle className="h-4 w-4" />
      case 'error':
      case 'failed': return <AlertCircle className="h-4 w-4" />
      case 'idle': return <Clock className="h-4 w-4" />
      case 'offline': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.name === 'duration' ? 'ms' : ''}
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Database Management</h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage PostgreSQL database instances
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg">
            <Database className="h-4 w-4 text-gray-500" />
            <select 
              value={selectedDatabase}
              onChange={(e) => setSelectedDatabase(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none"
            >
              {databases.map(db => (
                <option key={db.name} value={db.name}>
                  {db.name} ({db.status})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-lg">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Last update: {formatTime(lastUpdate)}
            </span>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50"
          >
            {loading ? (
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
        </div>
      </div>

      {/* Database Status Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Database className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{selectedDatabase}</h2>
              <p className="text-blue-100">PostgreSQL 15.3 • 12.4 GB • 85 active connections</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">Online</div>
            <div className="text-blue-200">Status: Healthy</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button 
          onClick={() => setShowQueryModal(true)}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Query Editor</p>
              <p className="text-xs text-gray-500">Run SQL queries</p>
            </div>
          </div>
          <Play className="h-4 w-4 text-gray-400" />
        </button>

        <button className="bg-white border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Download className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Backup Now</p>
              <p className="text-xs text-gray-500">Create backup</p>
            </div>
          </div>
          <Download className="h-4 w-4 text-gray-400" />
        </button>

        <button className="bg-white border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-md transition-all flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Optimize</p>
              <p className="text-xs text-gray-500">Run maintenance</p>
            </div>
          </div>
          <Zap className="h-4 w-4 text-gray-400" />
        </button>

        <button className="bg-white border border-gray-200 rounded-lg p-4 hover:border-red-300 hover:shadow-md transition-all flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Clear Logs</p>
              <p className="text-xs text-gray-500">Remove old data</p>
            </div>
          </div>
          <Trash2 className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
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
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Database Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {databaseMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${metric.color}`}>
                        {metric.icon}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        metric.status === 'excellent' ? 'bg-emerald-100 text-emerald-800' :
                        metric.status === 'good' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {metric.status}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                    <p className="text-gray-600 text-sm mb-2">{metric.name}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Usage</span>
                        <span className="font-medium">{metric.usage}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            metric.status === 'excellent' ? 'bg-emerald-500' :
                            metric.status === 'good' ? 'bg-green-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ width: metric.usage }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Query Performance */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Query Performance</h2>
                      <p className="text-sm text-gray-600">Average vs Slow queries (24h)</p>
                    </div>
                    <Zap className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={queryPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="time" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="avg" 
                          name="Avg (ms)" 
                          stroke="#4F46E5" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="slow" 
                          name="Slow >1s" 
                          stroke="#EF4444" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Storage Distribution */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Storage Distribution</h2>
                      <p className="text-sm text-gray-600">Database storage by type</p>
                    </div>
                    <HardDrive className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={storageDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {storageDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Connection Stats */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Connection Statistics</h2>
                    <p className="text-sm text-gray-600">Active vs idle connections</p>
                  </div>
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={connectionStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="hour" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="active" 
                        name="Active" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.1}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="idle" 
                        name="Idle" 
                        stroke="#8B5CF6" 
                        fill="#8B5CF6" 
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Database Tables</h2>
                  <p className="text-sm text-gray-600">Manage and monitor database tables</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tables..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    New Table
                  </button>
                </div>
              </div>

              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Table Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rows
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Indexes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableList.map((table) => (
                      <tr key={table.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                                <Table className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{table.name}</div>
                              <div className="text-xs text-gray-500">public schema</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {table.rows}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {table.size}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {table.indexes} indexes
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {table.lastUpdated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3 flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 flex items-center">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-blue-900">Total Tables</h3>
                    <Table className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-700 mb-2">{tableList.length}</div>
                  <p className="text-sm text-blue-600">Across all schemas</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-green-900">Total Rows</h3>
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-700 mb-2">378,822</div>
                  <p className="text-sm text-green-600">All tables combined</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-purple-900">Total Size</h3>
                    <HardDrive className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-700 mb-2">12.4 GB</div>
                  <p className="text-sm text-purple-600">Including indexes</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'queries' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Query Analysis</h2>
                  <p className="text-sm text-gray-600">Monitor and optimize database queries</p>
                </div>
                <button 
                  onClick={() => setShowQueryModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Run Query
                </button>
              </div>

              {/* Slow Queries */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Slow Queries</h3>
                <div className="space-y-4">
                  {slowQueries.map((query) => (
                    <div key={query.id} className="p-4 border border-gray-200 rounded-lg hover:border-yellow-300">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <code className="text-sm bg-gray-50 p-2 rounded block font-mono text-gray-800 mb-3">
                            {query.query.length > 80 ? query.query.substring(0, 80) + '...' : query.query}
                          </code>
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-gray-600">{query.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <Play className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-gray-600">{query.calls} calls</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-gray-600">Last: {query.lastRun}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          <button className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 rounded-lg">
                            <Zap className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Query Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Query Performance</h3>
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Avg Query Time</span>
                        <span className="font-medium">24ms</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Slow Queries (>1s)</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Query Cache Hit</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Query Throughput</h3>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">1,248</div>
                        <div className="text-xs text-gray-500">Queries/sec</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">4.2M</div>
                        <div className="text-xs text-gray-500">Today</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center justify-between mb-1">
                        <span>SELECT</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span>INSERT/UPDATE</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Other</span>
                        <span className="font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Backup Management</h2>
                  <p className="text-sm text-gray-600">Schedule and manage database backups</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Backup Now
                </button>
              </div>

              {/* Backup Schedule */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Backup Schedule</h3>
                    <p className="text-sm text-gray-600">Automated backup configuration</p>
                  </div>
                  <Settings className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Full Backup</h4>
                      <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Active
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Complete database backup</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Schedule</span>
                        <span className="font-medium">Daily at 02:00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Retention</span>
                        <span className="font-medium">30 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Incremental</h4>
                      <div className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Active
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Changes since last backup</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Schedule</span>
                        <span className="font-medium">Every 6 hours</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Retention</span>
                        <span className="font-medium">7 days</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Log Backup</h4>
                      <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Paused
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Transaction log backup</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Schedule</span>
                        <span className="font-medium">Every hour</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Retention</span>
                        <span className="font-medium">24 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Backup History */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Backups</h3>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {backupHistory.map((backup) => (
                        <tr key={backup.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              backup.type === 'Full' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {backup.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {backup.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                              {getStatusIcon(backup.status)}
                              <span className="ml-1">{backup.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {backup.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {backup.duration}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">Restore</button>
                            <button className="text-gray-600 hover:text-gray-900">Download</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Storage Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Backup Storage</h3>
                    <HardDrive className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Used</span>
                        <span className="font-medium">24.8 GB / 50 GB</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }} />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center justify-between mb-1">
                        <span>Full Backups</span>
                        <span className="font-medium">18.6 GB</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span>Incremental</span>
                        <span className="font-medium">6.2 GB</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Backup Locations</h3>
                    <Globe className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Server className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium">Local Server</span>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Primary
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium">AWS S3</span>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Secondary
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium">Google Cloud</span>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Inactive
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Database Users</h2>
                  <p className="text-sm text-gray-600">Manage database users and permissions</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </button>
              </div>

              {/* User List */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Connections
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Active
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {databaseUsers.map((user) => (
                        <tr key={user.username} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                <div className="text-xs text-gray-500">Database user</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.role === 'Administrator' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'Application' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.connections}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.lastActive}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                              {getStatusIcon(user.status)}
                              <span className="ml-1">{user.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <Key className="h-4 w-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 mr-3">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* User Permissions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">User Permissions</h3>
                    <Lock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-3">
                    {[
                      { user: 'hybridpos_app', permissions: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'] },
                      { user: 'hybridpos_admin', permissions: ['ALL PRIVILEGES'] },
                      { user: 'hybridpos_readonly', permissions: ['SELECT'] },
                    ].map((perm, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-lg">
                        <div className="font-medium text-gray-900 mb-2">{perm.user}</div>
                        <div className="flex flex-wrap gap-1">
                          {perm.permissions.map((p, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Security Settings</h3>
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Password Encryption</span>
                        <span className="font-medium text-green-600">Enabled</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">SSL Connections</span>
                        <span className="font-medium text-green-600">Required</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Failed Login Lock</span>
                        <span className="font-medium text-green-600">5 attempts</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Query Modal */}
      {showQueryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Query Editor</h3>
                <button
                  onClick={() => setShowQueryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SQL Query
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full h-48 font-mono text-sm border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your SQL query here..."
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Database: {selectedDatabase}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowQueryModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeQuery}
                    disabled={loading || !query.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Execute Query
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Database className="h-5 w-5 text-blue-600" />
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">8</div>
          <p className="text-gray-600 text-sm">Active Tables</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-5 w-5 text-purple-600" />
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">5</div>
          <p className="text-gray-600 text-sm">Database Users</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <HardDrive className="h-5 w-5 text-green-600" />
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">98.2%</div>
          <p className="text-gray-600 text-sm">Cache Hit Ratio</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Zap className="h-5 w-5 text-orange-600" />
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">1.2K/s</div>
          <p className="text-gray-600 text-sm">Query Throughput</p>
        </div>
      </div>
    </div>
  )
}