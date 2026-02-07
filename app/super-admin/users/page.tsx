"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Search, Filter, RefreshCw, Download,
  Users, UserCheck, UserPlus, Activity,
  Mail, Key, Eye, Ban, CheckCircle, XCircle,
  Building2, Shield, User as UserIcon, Clock,
  TrendingUp, MoreVertical, Send, ChevronDown,
  ChevronRight, ChefHat, ShoppingBag, Truck,
  Globe, Package
} from "lucide-react"
import { toast } from "sonner"
import { AnimatePresence } from "framer-motion"

// Industry icon mapping
const INDUSTRY_ICONS: Record<string, any> = {
  retail: ShoppingBag,
  restaurant: ChefHat,
  pharmacy: Shield,
  ecommerce: Globe,
  grocery: Package,
  healthcare: Activity,
  education: Building2,
  manufacturing: Truck,
  default: Building2
}

// Role badge colors
const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
  ADMIN: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
  USER: "bg-slate-100 text-slate-700 border border-slate-200"
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrg, setSelectedOrg] = useState("all")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set())

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [usersRes, orgsRes] = await Promise.all([
        fetch('/api/super-admin/users'),
        fetch('/api/super-admin/organizations')
      ])

      if (!usersRes.ok || !orgsRes.ok) throw new Error("Failed to fetch data")

      const [usersData, orgsData] = await Promise.all([
        usersRes.json(),
        orgsRes.json()
      ])

      setUsers(Array.isArray(usersData) ? usersData : [])
      setOrganizations(Array.isArray(orgsData) ? orgsData : [])
    } catch (error) {
      console.error(error)
      toast.error("Could not load unified data")
      setUsers([])
      setOrganizations([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      // Auto-acknowledge notifications when viewing this page
      try {
        await fetch('/api/super-admin/notifications/acknowledge-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: 'USER' })
        })
      } catch (error) {
        console.error('Failed to acknowledge user notifications:', error)
      }

      // Fetch data after acknowledgment to ensure is_unread is updated
      fetchData()
    }
    init()
  }, [])

  const handleResetPassword = async (userId: string, userEmail: string) => {
    if (!confirm(`Reset password for ${userEmail}?`)) return

    setActionLoading(userId)
    try {
      const res = await fetch(`/api/super-admin/users/${userId}/reset-password`, {
        method: 'POST'
      })
      if (!res.ok) throw new Error("Failed to reset password")
      const data = await res.json()
      toast.success(`Password reset! Temporary password: ${data.temporaryPassword}`)
    } catch (error) {
      console.error(error)
      toast.error("Failed to reset password")
    } finally {
      setActionLoading(null)
    }
  }

  const handleSendWelcomeEmail = async (userId: string, userEmail: string) => {
    setActionLoading(userId)
    try {
      const res = await fetch(`/api/super-admin/users/${userId}/welcome-email`, {
        method: 'POST'
      })
      if (!res.ok) throw new Error("Failed to send email")
      toast.success(`Welcome email sent to ${userEmail}`)
    } catch (error) {
      console.error(error)
      toast.error("Failed to send welcome email")
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId)
    try {
      const res = await fetch('/api/super-admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, is_active: !currentStatus })
      })
      if (!res.ok) throw new Error("Failed to update status")
      toast.success(`User ${!currentStatus ? 'activated' : 'suspended'}`)
      fetchData()
    } catch (error) {
      console.error(error)
      toast.error("Failed to update user status")
    } finally {
      setActionLoading(null)
    }
  }

  // Calculate stats
  const totalUsers = users?.length || 0
  const activeUsers = users?.filter(u => u.is_active).length || 0
  const recentSignups = users?.filter(u => {
    const created = new Date(u.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return created > thirtyDaysAgo
  }).length || 0

  // Organization breakdown from live organizations list
  const orgBreakdown = organizations.reduce((acc: Record<string, number>, org) => {
    acc[org.name] = parseInt(org.user_count) || 0
    return acc
  }, {})

  const filteredUsers = (users || []).filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.organization_name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesOrg = selectedOrg === "all" || user.organization_name === selectedOrg
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" ||
      (selectedStatus === "active" && user.is_active) ||
      (selectedStatus === "inactive" && !user.is_active)
    return matchesSearch && matchesOrg && matchesRole && matchesStatus
  })

  const stats = [
    { title: "Total Users", value: totalUsers, change: "+12%", icon: <Users className="h-5 w-5" />, color: "bg-indigo-500/10 text-indigo-500" },
    { title: "Active Users", value: activeUsers, change: `${Math.round((activeUsers / totalUsers) * 100)}%`, icon: <UserCheck className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-500" },
    { title: "Recent Signups", value: recentSignups, change: "Last 30 days", icon: <UserPlus className="h-5 w-5" />, color: "bg-violet-500/10 text-violet-500" },
    { title: "Organizations", value: Object.keys(orgBreakdown).length, change: "Active", icon: <Building2 className="h-5 w-5" />, color: "bg-amber-500/10 text-amber-500" },
  ]

  const getRelativeTime = (date: string) => {
    if (!date) return 'Never'
    const now = new Date()
    const then = new Date(date)
    const diff = now.getTime() - then.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return `${Math.floor(days / 30)} months ago`
  }

  const toggleOrg = (orgName: string) => {
    setExpandedOrgs(prev => {
      const next = new Set(prev)
      if (next.has(orgName)) next.delete(orgName)
      else next.add(orgName)
      return next
    })
  }

  const groupedUsers = filteredUsers.reduce((acc: Record<string, any[]>, user) => {
    const org = user.organization_name || 'Individual Users'
    if (!acc[org]) acc[org] = []
    acc[org].push(user)
    return acc
  }, {})

  // Source of truth for organizations in the tree
  const treeOrgs = organizations.map(o => ({
    name: o.name,
    industry: o.industry,
    status: o.status,
    plan: o.current_plan,
    user_count: parseInt(o.user_count) || 0
  })).sort((a, b) => a.name.localeCompare(b.name))

  // Add "Individual Users" group if there are any
  if (groupedUsers['Individual Users']) {
    treeOrgs.push({
      name: 'Individual Users',
      industry: 'default',
      status: 'active',
      plan: 'N/A',
      user_count: groupedUsers['Individual Users'].length
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-2 w-8 grad-indigo rounded-full" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">User Registry</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            User Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            Comprehensive user administration across all organizations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw className={`h-5 w-5 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-50 transition-colors flex items-center shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-900/[0.05] dark:border-slate-800/50 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="flex items-center text-emerald-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-bold">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{stat.value}</h3>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Organization Distribution */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-900/[0.05] dark:border-slate-800/50 p-6 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center">
          <Building2 className="h-4 w-4 mr-2 text-indigo-500" />
          Users by Organization
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(orgBreakdown).map(([org, count]) => (
            <div key={org} className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="text-2xl font-black text-slate-900 dark:text-white">{count}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{org}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-900/[0.05] dark:border-slate-800/50 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users, emails, organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
            >
              <option value="all">All Organizations</option>
              {organizations.map(org => (
                <option key={org.id} value={org.name}>{org.name}</option>
              ))}
              {groupedUsers['Individual Users'] && (
                <option value="Individual Users">Individual Users</option>
              )}
            </select>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
            >
              <option value="all">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Organization Tree */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-900/[0.05] dark:border-slate-800/50 p-6 shadow-sm">
            <div className="animate-pulse space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : treeOrgs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-900/[0.05] dark:border-slate-800/50 p-20 text-center shadow-sm">
            <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <div className="text-sm font-black text-slate-400 uppercase tracking-widest">No organizations found</div>
          </div>
        ) : treeOrgs.map((org) => {
          const orgUsers = groupedUsers[org.name] || []
          const isExpanded = expandedOrgs.has(org.name)
          const industry = org.industry?.toLowerCase() || 'default'
          const IndustryIcon = INDUSTRY_ICONS[industry] || INDUSTRY_ICONS.default

          return (
            <motion.div
              key={org.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-900/[0.05] dark:border-slate-800/50 shadow-sm overflow-hidden ${org.status === 'suspended' ? 'opacity-75 grayscale-[0.5]' : ''}`}
            >
              <button
                onClick={() => toggleOrg(org.name)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`h-12 w-12 p-0.5 rounded-2xl flex-shrink-0 ${org.status === 'suspended' ? 'bg-slate-200' : 'grad-indigo'}`}>
                    <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[0.9rem] flex items-center justify-center">
                      <IndustryIcon className={`h-5 w-5 ${org.status === 'suspended' ? 'text-slate-400' : 'text-indigo-500'}`} />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
                        {org.name}
                      </h3>
                      {org.status === 'suspended' && (
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase tracking-widest rounded-md border border-rose-500/20">
                          Suspended
                        </span>
                      )}
                      {org.plan && (
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 text-[8px] font-black uppercase tracking-widest rounded-md border border-indigo-500/20">
                          {org.plan}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <span>{orgUsers.length || org.user_count} Users</span>
                      <span className="h-1 w-1 bg-slate-300 rounded-full" />
                      <span>{orgUsers.filter(u => u.is_active).length} Active</span>
                      {org.industry && (
                        <>
                          <span className="h-1 w-1 bg-slate-300 rounded-full" />
                          <span className="text-indigo-400">{org.industry}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-slate-100 dark:border-slate-800"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50/50 dark:bg-slate-800/20">
                          <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest pl-20">User</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Login</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest pr-8">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {orgUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors group">
                              <td className="px-6 py-4 pl-20">
                                <div className="flex items-center space-x-4">
                                  <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                    {user.avatar_url ? (
                                      <img src={user.avatar_url} alt={user.email} className="h-full w-full rounded-xl object-cover" />
                                    ) : (
                                      <UserIcon className="h-4 w-4 text-slate-400" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white leading-tight flex items-center space-x-2">
                                      <span>{user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : user.name || 'Unnamed User'}</span>
                                      {user.is_unread && (
                                        <motion.span
                                          initial={{ scale: 0.8, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-black uppercase tracking-widest rounded-md shadow-lg shadow-orange-500/20 animate-pulse"
                                        >
                                          New
                                        </motion.span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md inline-block ${ROLE_COLORS[user.role] || ROLE_COLORS.USER}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md border flex items-center space-x-2 w-fit ${user.is_active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                  <div className={`h-1 w-1 rounded-full ${user.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                                  <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center text-xs text-slate-500 font-medium">
                                  <Clock className="h-3 w-3 mr-2 opacity-50" />
                                  {getRelativeTime(user.last_login_at)}
                                </div>
                              </td>
                              <td className="px-6 py-4 pr-8 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleResetPassword(user.id, user.email); }}
                                    disabled={actionLoading === user.id}
                                    className="p-1.5 bg-slate-50 hover:bg-amber-500 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-amber-500 dark:hover:text-white rounded-lg transition-all disabled:opacity-50"
                                    title="Reset Password"
                                  >
                                    <Key className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleSendWelcomeEmail(user.id, user.email); }}
                                    disabled={actionLoading === user.id}
                                    className="p-1.5 bg-slate-50 hover:bg-blue-500 hover:text-white dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-blue-500 dark:hover:text-white rounded-lg transition-all disabled:opacity-50"
                                    title="Send Welcome Email"
                                  >
                                    <Send className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleToggleStatus(user.id, user.is_active); }}
                                    disabled={actionLoading === user.id}
                                    className={`p-1.5 rounded-lg transition-all disabled:opacity-50 ${user.is_active ? 'bg-slate-50 hover:bg-rose-500 hover:text-white dark:bg-slate-800 dark:hover:bg-rose-500' : 'bg-slate-50 hover:bg-emerald-500 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-500'}`}
                                    title={user.is_active ? 'Suspend User' : 'Activate User'}
                                  >
                                    {user.is_active ? <Ban className="h-3.5 w-3.5" /> : <CheckCircle className="h-3.5 w-3.5" />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-700 dark:text-slate-300 font-bold">
            Showing <span className="font-black">{filteredUsers.length}</span> of <span className="font-black">{totalUsers}</span> users
          </div>
        </div>
      </div>
    </div>
  )
}