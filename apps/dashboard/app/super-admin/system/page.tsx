"use client"

import { useState, useEffect } from "react"
import { 
  Server, 
  Database, 
  Cpu, 
  HardDrive, 
  Network, 
  Activity, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Download,
  Upload,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  Globe,
  Users,
  Key,
  ShieldCheck,
  Lock
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

export default function SystemHealthPage() {
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'security' | 'logs'>('overview')
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Mock data for charts
  const cpuUsageData = [
    { time: '00:00', usage: 35 },
    { time: '04:00', usage: 28 },
    { time: '08:00', usage: 42 },
    { time: '12:00', usage: 68 },
    { time: '16:00', usage: 72 },
    { time: '20:00', usage: 58 },
    { time: '23:59', usage: 45 },
  ]

  const memoryUsageData = [
    { name: 'Used', value: 65, color: '#4F46E5' },
    { name: 'Cached', value: 20, color: '#8B5CF6' },
    { name: 'Free', value: 15, color: '#10B981' },
  ]

  const networkData = [
    { hour: '9AM', in: 1.2, out: 0.8 },
    { hour: '10AM', in: 1.8, out: 1.2 },
    { hour: '11AM', in: 2.4, out: 1.6 },
    { hour: '12PM', in: 3.2, out: 2.1 },
    { hour: '1PM', in: 2.8, out: 1.9 },
    { hour: '2PM', in: 3.5, out: 2.4 },
    { hour: '3PM', in: 4.1, out: 2.8 },
  ]

  const serviceStatus = [
    { name: 'API Gateway', status: 'running', uptime: '99.98%', response: '45ms', lastCheck: '2 minutes ago' },
    { name: 'Authentication', status: 'running', uptime: '99.99%', response: '32ms', lastCheck: '1 minute ago' },
    { name: 'Database', status: 'running', uptime: '99.95%', response: '12ms', lastCheck: '3 minutes ago' },
    { name: 'Cache Server', status: 'running', uptime: '99.97%', response: '8ms', lastCheck: '2 minutes ago' },
    { name: 'File Storage', status: 'warning', uptime: '99.80%', response: '85ms', lastCheck: '5 minutes ago' },
    { name: 'Email Service', status: 'running', uptime: '99.92%', response: '120ms', lastCheck: '4 minutes ago' },
    { name: 'Payment Gateway', status: 'running', uptime: '99.96%', response: '65ms', lastCheck: '1 minute ago' },
    { name: 'Monitoring', status: 'running', uptime: '100%', response: '15ms', lastCheck: 'Just now' },
  ]

  const securityAlerts = [
    { id: 1, type: 'warning', title: 'Unusual Login Activity', description: 'Multiple failed attempts from unknown IP', severity: 'medium', time: '5 minutes ago' },
    { id: 2, type: 'info', title: 'SSL Certificate Expiry', description: 'Certificate expires in 30 days', severity: 'low', time: '2 hours ago' },
    { id: 3, type: 'success', title: 'Security Scan Complete', description: 'No vulnerabilities found', severity: 'low', time: '6 hours ago' },
    { id: 4, type: 'warning', title: 'Database Backup Overdue', description: 'Last backup 48 hours ago', severity: 'medium', time: '1 day ago' },
  ]

  const systemMetrics = [
    { name: 'System Uptime', value: '99.95%', target: '99.9%', status: 'excellent', icon: <Activity className="h-5 w-5" />, color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Error Rate', value: '0.02%', target: '< 0.1%', status: 'good', icon: <AlertCircle className="h-5 w-5" />, color: 'bg-green-100 text-green-600' },
    { name: 'Peak Load', value: '78%', target: '< 80%', status: 'warning', icon: <Cpu className="h-5 w-5" />, color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Disk I/O', value: '1.2 GB/s', target: '2.0 GB/s', status: 'good', icon: <HardDrive className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600' },
  ]

  const recentEvents = [
    { id: 1, type: 'info', message: 'Daily backup completed successfully', time: '2 hours ago' },
    { id: 2, type: 'success', message: 'Security patches applied', time: '4 hours ago' },
    { id: 3, type: 'warning', message: 'Memory usage exceeded 80% threshold', time: '6 hours ago' },
    { id: 4, type: 'info', message: 'Database optimization completed', time: '8 hours ago' },
    { id: 5, type: 'success', message: 'All systems operational', time: '12 hours ago' },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'services', label: 'Services', icon: Server },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'logs', label: 'Event Logs', icon: Activity },
  ]

  const refreshData = () => {
    setLoading(true)
    setTimeout(() => {
      setLastUpdate(new Date())
      setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        refreshData()
      }, 30000) // Refresh every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'running': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'running': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
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
              {entry.name}: {entry.value}{entry.name === 'in' || entry.name === 'out' ? ' Gbps' : '%'}
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600 mt-2">
            Real-time monitoring and diagnostics for platform infrastructure
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
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
          <label className="flex items-center space-x-2 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="sr-only"
              />
              <div className={`block w-12 h-6 rounded-full ${autoRefresh ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${autoRefresh ? 'transform translate-x-6' : ''}`}></div>
            </div>
            <span className="text-sm text-gray-600">Auto-refresh</span>
          </label>
        </div>
      </div>

      {/* System Status Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <Server className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">All Systems Operational</h2>
              <p className="text-emerald-100">Platform is running smoothly with optimal performance</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">99.95%</div>
            <div className="text-emerald-200">Uptime (30 days)</div>
          </div>
        </div>
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
              {/* System Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {systemMetrics.map((metric, index) => (
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
                    <p className="text-xs text-gray-500">Target: {metric.target}</p>
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* CPU Usage */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">CPU Usage (24h)</h2>
                      <p className="text-sm text-gray-600">Real-time CPU utilization</p>
                    </div>
                    <Cpu className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cpuUsageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="time" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="usage" 
                          name="CPU %" 
                          stroke="#4F46E5" 
                          fill="#4F46E5" 
                          fillOpacity={0.1}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></div>
                      <span className="text-gray-600">Current: 45%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-gray-600">Peak: 78%</span>
                    </div>
                  </div>
                </div>

                {/* Memory Distribution */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Memory Distribution</h2>
                      <p className="text-sm text-gray-600">16GB Total Memory</p>
                    </div>
                    <HardDrive className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={memoryUsageData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {memoryUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">10.4GB</div>
                      <div className="text-xs text-gray-500">Used</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">3.2GB</div>
                      <div className="text-xs text-gray-500">Cached</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">2.4GB</div>
                      <div className="text-xs text-gray-500">Free</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Network Traffic */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Network Traffic</h2>
                    <p className="text-sm text-gray-600">Today's inbound/outbound traffic</p>
                  </div>
                  <Network className="h-5 w-5 text-gray-400" />
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={networkData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="hour" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="in" name="Inbound" fill="#10B981" />
                      <Bar dataKey="out" name="Outbound" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Service Status</h2>
                  <p className="text-sm text-gray-600">Monitor all platform services</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">8 services</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    7 running
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    1 warning
                  </span>
                </div>
              </div>

              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uptime
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Response Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Check
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {serviceStatus.map((service) => (
                      <tr key={service.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                                <Server className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                              {getStatusIcon(service.status)}
                              <span className="ml-1">{service.status}</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.uptime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.response}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {service.lastCheck}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Restart</button>
                          <button className="text-gray-600 hover:text-gray-900">Logs</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-blue-900">Quick Actions</h3>
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50">
                      <span className="text-sm font-medium text-blue-900">Restart All Services</span>
                      <RefreshCw className="h-4 w-4 text-blue-600" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50">
                      <span className="text-sm font-medium text-blue-900">Run Diagnostics</span>
                      <Activity className="h-4 w-4 text-blue-600" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50">
                      <span className="text-sm font-medium text-blue-900">Clear Cache</span>
                      <Database className="h-4 w-4 text-blue-600" />
                    </button>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-green-900">Backup Status</h3>
                    <Download className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-700">Last Backup</span>
                        <span className="font-medium">2 hours ago</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-700">Next Backup</span>
                        <span className="font-medium">In 22 hours</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
                      Backup Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Security Dashboard</h2>
                  <p className="text-sm text-gray-600">Monitor security threats and compliance</p>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Security Score: 94/100</span>
                </div>
              </div>

              {/* Security Alerts */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
                <div className="space-y-4">
                  {securityAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border ${
                      alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      alert.type === 'success' ? 'border-green-200 bg-green-50' :
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {alert.type === 'warning' ? 
                            <AlertTriangle className="h-5 w-5 text-yellow-600" /> :
                            alert.type === 'success' ?
                            <CheckCircle className="h-5 w-5 text-green-600" /> :
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                          }
                          <div>
                            <div className="font-medium text-gray-900">{alert.title}</div>
                            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
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
                          <Lock className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Firewall Status</h3>
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active Rules</span>
                      <span className="font-medium">42</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Blocked Today</span>
                      <span className="font-medium text-red-600">128</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">SSL/TLS Status</h3>
                    <Key className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Valid Certificates</span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Expires In</span>
                      <span className="font-medium text-yellow-600">30 days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Access Control</h3>
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active Sessions</span>
                      <span className="font-medium">142</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">2FA Enabled</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Event Logs</h2>
                  <p className="text-sm text-gray-600">System events and audit trail</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export Logs
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                    Clear Old Logs
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="Search logs..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>All Levels</option>
                      <option>Info</option>
                      <option>Warning</option>
                      <option>Error</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Last 24 hours</option>
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                    </select>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          event.type === 'info' ? 'bg-blue-100' :
                          event.type === 'success' ? 'bg-green-100' :
                          'bg-yellow-100'
                        }`}>
                          {event.type === 'info' ? 
                            <AlertCircle className="h-4 w-4 text-blue-600" /> :
                            event.type === 'success' ?
                            <CheckCircle className="h-4 w-4 text-green-600" /> :
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          }
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">{event.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">System Event</span>
                            <span className="text-xs text-gray-500">{event.time}</span>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <AlertCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Globe className="h-5 w-5 text-blue-600" />
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">4.2M</div>
          <p className="text-gray-600 text-sm">Requests Today</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Database className="h-5 w-5 text-purple-600" />
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">12.4 GB</div>
          <p className="text-gray-600 text-sm">Database Size</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-5 w-5 text-green-600" />
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">1,248</div>
          <p className="text-gray-600 text-sm">Active Users</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-5 w-5 text-orange-600" />
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">45ms</div>
          <p className="text-gray-600 text-sm">Avg Response Time</p>
        </div>
      </div>
    </div>
  )
}