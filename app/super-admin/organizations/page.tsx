"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Filter, Plus, Download, RefreshCw,
  Building2, Users, DollarSign, TrendingUp,
  Eye, ArrowUpRight, Globe, Mail, Phone,
  MapPin, Calendar, Activity, Package, Shield,
  Trash2, AlertTriangle, UserPlus, Key
} from "lucide-react"
import AddOnsBadge from "@/components/dashboard/super-admin/shared/add-ons-badge"
import { toast } from "sonner"

// Industry icon mapping
const INDUSTRY_ICONS: Record<string, any> = {
  retail: Building2,
  restaurant: Users,
  pharmacy: Shield,
  ecommerce: Globe,
  grocery: Package,
  default: Building2
}

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPlan, setSelectedPlan] = useState("all")
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [deepDetails, setDeepDetails] = useState<any>(null)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmName, setDeleteConfirmName] = useState("")
  const [deleteConfirmWord, setDeleteConfirmWord] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [addUserFormData, setAddUserFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'USER',
    phone: ''
  })

  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    business_type: '',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    city: '',
    country: 'Pakistan',
    plan: 'starter',
    add_ons: [] as string[]
  })

  // Calculate stats
  const totalOrgs = organizations?.length || 0
  const activeOrgs = organizations?.filter(o => o.status === 'active').length || 0
  const totalMRR = organizations?.reduce((acc, org) => {
    const planPrices: Record<string, number> = {
      starter: 0,
      business: 15000,
      pro: 35000,
      enterprise: 75000
    }
    return acc + (planPrices[org.current_plan?.toLowerCase()] || 0)
  }, 0) || 0

  const addOnsAdoption = organizations?.filter(o => o.add_ons && o.add_ons.length > 0).length || 0

  // Industry breakdown
  const industryBreakdown = organizations?.reduce((acc: Record<string, number>, org) => {
    const industry = org.industry || 'Other'
    acc[industry] = (acc[industry] || 0) + 1
    return acc
  }, {}) || {}

  const fetchOrganizations = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/super-admin/organizations')
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      setOrganizations(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      toast.error("Could not load organizations")
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
          body: JSON.stringify({ category: 'ORGANIZATION' })
        })
      } catch (error) {
        console.error('Failed to acknowledge organization notifications:', error)
      }

      // Fetch data after acknowledgment
      fetchOrganizations()
    }
    init()
  }, [])

  const handleAddOrganization = async () => {
    if (!formData.name || !formData.contact_email) {
      toast.error('Organization name and contact email are required')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/super-admin/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create organization')
      }

      toast.success('Organization created successfully!')
      setShowAddModal(false)
      setFormData({
        name: '',
        industry: '',
        business_type: '',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        city: '',
        country: 'Pakistan',
        plan: 'starter',
        add_ons: []
      })
      fetchOrganizations()
    } catch (error: any) {
      console.error('Error creating organization:', error)
      toast.error(error.message || 'Failed to create organization')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "pending": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "suspended": return "bg-rose-500/10 text-rose-500 border-rose-500/20"
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case "enterprise": return "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
      case "pro": return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
      case "business": return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "starter": return "bg-slate-100 text-slate-700 border border-slate-200"
      default: return "bg-slate-100 text-slate-500"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency', currency: 'PKR', minimumFractionDigits: 0
    }).format(amount || 0).replace('PKR', '₨')
  }

  const filteredOrganizations = (organizations || []).filter(org => {
    const matchesSearch = org.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.business_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.city?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = selectedIndustry === "all" || org.industry === selectedIndustry
    const matchesStatus = selectedStatus === "all" || org.status === selectedStatus
    const matchesPlan = selectedPlan === "all" || org.current_plan?.toLowerCase() === selectedPlan.toLowerCase()
    return matchesSearch && matchesIndustry && matchesStatus && matchesPlan
  })

  const handleViewDetails = async (org: any) => {
    setSelectedOrganization(org)
    setShowDetailModal(true)
    setIsDetailsLoading(true)
    setActiveTab("overview")
    setDeepDetails(null)

    try {
      const res = await fetch(`/api/super-admin/organizations/${org.id}`)
      if (!res.ok) throw new Error("Failed to fetch deep details")
      const data = await res.json()
      setDeepDetails(data)
    } catch (error) {
      console.error(error)
      toast.error("Could not load organization details")
    } finally {
      setIsDetailsLoading(false)
    }
  }

  const handleDeleteOrganization = async () => {
    if (!selectedOrganization) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/super-admin/organizations/${selectedOrganization.id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to delete organization')

      toast.success('Organization purged successfully')
      setShowDeleteModal(false)
      setShowDetailModal(false)
      setDeleteConfirmName("")
      setDeleteConfirmWord("")
      fetchOrganizations()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Could not delete organization')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAddUserToOrg = async () => {
    if (!selectedOrganization) return

    setIsEnrolling(true)
    try {
      const res = await fetch('/api/super-admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...addUserFormData,
          organization_id: selectedOrganization.id
        })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to enroll user')

      toast.success(`User ${addUserFormData.email} enrolled successfully!`)
      setShowAddUserModal(false)
      setAddUserFormData({
        email: '',
        first_name: '',
        last_name: '',
        role: 'USER',
        phone: ''
      })

      // Refresh deep details to show new user in list
      handleViewDetails(selectedOrganization)
      fetchOrganizations() // Refresh counts in main list
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Could not enroll user')
    } finally {
      setIsEnrolling(false)
    }
  }

  const stats = [
    {
      title: "Total Organizations",
      value: totalOrgs,
      change: "+12%",
      icon: <Building2 className="h-6 w-6" />,
      color: "from-blue-500/20 to-indigo-500/20 text-indigo-500 border-indigo-500/20",
      glow: "shadow-indigo-500/10"
    },
    {
      title: "Active Organizations",
      value: activeOrgs,
      change: "+8%",
      icon: <Activity className="h-6 w-6" />,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/20",
      glow: "shadow-emerald-500/10"
    },
    {
      title: "Monthly Revenue (MRR)",
      value: formatCurrency(totalMRR),
      change: "+23%",
      icon: <DollarSign className="h-6 w-6" />,
      color: "from-violet-500/20 to-purple-500/20 text-violet-500 border-violet-500/20",
      glow: "shadow-violet-500/10"
    },
    {
      title: "Add-ons Adoption",
      value: `${addOnsAdoption}`,
      subValue: `of ${totalOrgs}`,
      change: `${Math.round((addOnsAdoption / (totalOrgs || 1)) * 100)}%`,
      icon: <Package className="h-6 w-6" />,
      color: "from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/20",
      glow: "shadow-amber-500/10"
    },
  ]

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-3 w-12 grad-indigo rounded-full shadow-lg shadow-indigo-500/20" />
            <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-400">Multi-Tenant Core</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Organization Registry
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold mt-3 text-lg">
            Monitor and govern your platform's enterprise ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchOrganizations}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none active:scale-95"
          >
            <RefreshCw className={`h-6 w-6 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center">
            <Download className="h-4 w-4 mr-3" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 grad-indigo text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all flex items-center shadow-xl shadow-indigo-500/30 active:scale-95"
          >
            <Plus className="h-4 w-4 mr-3" />
            New Organization
          </button>
        </div>
      </div>

      {/* Stats Grid - High Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={`relative group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-2xl ${stat.glow} transition-all duration-500 overflow-hidden`}
          >
            {/* Background Accent */}
            <div className={`absolute -right-10 -top-10 h-40 w-40 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[50px]`} />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg backdrop-blur-md`}>
                  {stat.icon}
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-emerald-500 font-black text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.change}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Growth</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                    {stat.value}
                  </h3>
                  {stat.subValue && (
                    <span className="text-lg font-bold text-slate-400 tracking-tight">{stat.subValue}</span>
                  )}
                </div>
                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  {stat.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Industry Distribution - Premium Visualizer */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] flex items-center">
            <Globe className="h-5 w-5 mr-3 text-indigo-500" />
            Market Penetration
          </h3>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Cross-Sector Distribution
          </span>
        </div>
        <div className="flex flex-wrap gap-4">
          {Object.entries(industryBreakdown).map(([industry, count], idx) => (
            <motion.div
              key={industry}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + (idx * 0.05) }}
              className="px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-md hover:border-indigo-500/30 transition-all flex items-center space-x-4 group cursor-default"
            >
              <div className="h-10 w-10 grad-indigo p-0.5 rounded-xl group-hover:rotate-12 transition-transform">
                <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[0.6rem] flex items-center justify-center">
                  {(() => {
                    const Icon = INDUSTRY_ICONS[industry.toLowerCase()] || Building2;
                    return <Icon className="h-5 w-5 text-indigo-500" />;
                  })()}
                </div>
              </div>
              <div>
                <div className="text-lg font-black text-slate-900 dark:text-white leading-none mb-1">{count}</div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{industry}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Registry - Advanced Card List */}
      <div className="space-y-6">
        {/* Floating Action Bar */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-4 z-20 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-[2rem] shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, industry, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[1.5rem] text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {[
              { value: selectedIndustry, onChange: setSelectedIndustry, options: ["retail", "restaurant", "pharmacy", "ecommerce", "grocery", "healthcare", "education"], label: "Sectors" },
              { value: selectedStatus, onChange: setSelectedStatus, options: ["active", "pending", "suspended"], label: "Status" },
              { value: selectedPlan, onChange: setSelectedPlan, options: ["starter", "business", "pro", "enterprise"], label: "Product" }
            ].map((f) => (
              <select
                key={f.label}
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className="pl-6 pr-10 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <option value="all">All {f.label}</option>
                {f.options.map(opt => <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
              </select>
            ))}
          </div>
        </div>

        {/* Card Registry Grid */}
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-40 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 animate-pulse" />
            ))
          ) : filteredOrganizations.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-20 text-center">
              <Building2 className="h-16 w-16 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
              <h4 className="text-xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">No Matches Found</h4>
              <p className="text-slate-500 mt-2">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredOrganizations.map((org, idx) => {
                const IndustryIcon = INDUSTRY_ICONS[org.industry?.toLowerCase()] || INDUSTRY_ICONS.default
                const planPrices: Record<string, number> = {
                  starter: 0,
                  business: 15000,
                  pro: 35000,
                  enterprise: 75000
                }
                const mrr = planPrices[org.current_plan?.toLowerCase()] || 0

                return (
                  <motion.div
                    key={org.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      {/* Identity Section */}
                      <div className="flex items-center space-x-6 min-w-0 flex-1">
                        <div className="h-20 w-20 grad-indigo p-0.5 rounded-[1.8rem] group-hover:rotate-[10deg] transition-transform duration-500 shadow-xl shadow-indigo-500/20">
                          <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[1.6rem] flex items-center justify-center">
                            <IndustryIcon className="h-10 w-10 text-indigo-500" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate leading-none">
                              {org.name}
                            </h3>
                            {org.is_unread && (
                              <motion.span
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-black uppercase tracking-widest rounded-md shadow-lg shadow-orange-500/20 animate-pulse"
                              >
                                New
                              </motion.span>
                            )}
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md border ${getStatusColor(org.status)}`}>
                              {org.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                              <Shield className="h-3 w-3 mr-1.5" />
                              {org.business_type || 'Private Corp'}
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
                              <MapPin className="h-3 w-3 mr-1.5" />
                              {org.city || 'Karachi'}, {org.country || 'PK'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Metrics Zone */}
                      <div className="flex flex-wrap items-center gap-12 lg:px-12 lg:border-l lg:border-r border-slate-100 dark:border-slate-800">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subscription</p>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${getPlanColor(org.current_plan)}`}>
                              {org.current_plan || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Users</p>
                          <div className="flex items-center text-slate-900 dark:text-white">
                            <Users className="h-4 w-4 mr-2 text-indigo-500" />
                            <span className="text-lg font-black tracking-tight">{org.user_count || 0}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue</p>
                          <div className="flex items-center text-slate-900 dark:text-white">
                            <span className="text-lg font-black tracking-tight">{formatCurrency(mrr)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Zone */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewDetails(org)}
                          className="h-14 w-14 bg-slate-50 dark:bg-slate-800 hover:grad-indigo group/btn relative flex items-center justify-center rounded-2xl transition-all duration-300 shadow-sm overflow-hidden"
                        >
                          <ArrowUpRight className="h-6 w-6 text-slate-400 group-hover/btn:text-white group-hover/btn:scale-125 transition-all duration-300 z-10" />
                          <div className="absolute inset-0 bg-indigo-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>

                    {/* Background Subtle Accent */}
                    <div className={`absolute bottom-0 right-0 h-24 w-24 bg-gradient-to-tl ${getPlanColor(org.current_plan).split(' ')[0]} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 blur-2xl rounded-full`} />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Modern Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-10 bg-slate-50 dark:bg-slate-800/20 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
          <div className="text-sm text-slate-500 dark:text-slate-400 font-bold">
            Displaying <span className="text-slate-900 dark:text-white font-black">{filteredOrganizations.length}</span> entities in terminal registry
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-8 py-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-[1.2rem] font-black uppercase tracking-widest text-[10px] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
              Pre. Sector
            </button>
            <button className="px-6 py-3 grad-indigo text-white rounded-[1.2rem] font-black text-xs shadow-xl shadow-indigo-500/20">
              01
            </button>
            <button className="px-8 py-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-[1.2rem] font-black uppercase tracking-widest text-[10px] border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
              Next Sector
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Organization Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedOrganization && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between grad-dark-indigo">
                <div className="flex items-center space-x-4">
                  <div className="h-14 w-14 grad-indigo p-0.5 rounded-2xl flex-shrink-0">
                    <div className="h-full w-full bg-white dark:bg-slate-900 rounded-[0.9rem] flex items-center justify-center">
                      {(() => {
                        const Icon = INDUSTRY_ICONS[selectedOrganization.industry?.toLowerCase()] || Building2;
                        return <Icon className="h-6 w-6 text-indigo-500" />;
                      })()}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">{selectedOrganization.name}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md border ${getStatusColor(selectedOrganization.status)} bg-white/10`}>
                        {selectedOrganization.status}
                      </span>
                      <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">
                        EST. {new Date(selectedOrganization.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="px-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex space-x-8 overflow-x-auto scrollbar-none">
                {[
                  { id: "overview", label: "Overview", icon: Building2 },
                  { id: "subscription", label: "Subscription & Billing", icon: DollarSign },
                  { id: "users", label: "Users Registry", icon: Users },
                  { id: "activity", label: "Audit Log", icon: Activity }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-5 border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                      ? "border-indigo-500 text-indigo-500"
                      : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="text-sm font-black uppercase tracking-widest">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Modal Content */}
              <div className="p-8 h-[calc(90vh-250px)] overflow-y-auto custom-scrollbar bg-slate-50/30 dark:bg-slate-900/10">
                {isDetailsLoading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="h-12 w-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Compiling details...</p>
                  </div>
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "overview" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="space-y-6">
                          <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Contact Profile</h4>
                            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl">
                                  <Users className="h-5 w-5 text-indigo-500" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Representative</p>
                                  <p className="font-bold text-slate-900 dark:text-white">{selectedOrganization.contact_person || 'N/A'}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                                  <Mail className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Direct Email</p>
                                  <p className="font-bold text-slate-900 dark:text-white truncate">{selectedOrganization.contact_email || 'N/A'}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                                  <Phone className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Line</p>
                                  <p className="font-bold text-slate-900 dark:text-white">{selectedOrganization.contact_phone || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>

                        <section className="space-y-6">
                          <div>
                            <h4 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] mb-4 flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-2" />
                              Danger Zone
                            </h4>
                            <div className="bg-rose-50/50 dark:bg-rose-500/5 rounded-[2rem] border border-rose-200 dark:border-rose-500/20 p-6 flex items-center justify-between shadow-sm">
                              <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Purge Organization</p>
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest leading-relaxed">
                                  Irreversible removal of all data and affiliations.
                                </p>
                              </div>
                              <button
                                onClick={() => setShowDeleteModal(true)}
                                className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-rose-500/20 active:scale-95 flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Destroy Entity
                              </button>
                            </div>
                          </div>
                        </section>
                      </div>
                    )}

                    {activeTab === "subscription" && deepDetails && (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Current Tier</p>
                            <div className={`px-4 py-2 rounded-2xl inline-block font-black text-lg uppercase tracking-tighter ${getPlanColor(deepDetails.subscription?.plan)}`}>
                              {deepDetails.subscription?.plan || 'None'}
                            </div>
                          </div>
                          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Next Renewal</p>
                            <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                              {deepDetails.subscription?.current_period_end ? new Date(deepDetails.subscription.current_period_end).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Billing Status</p>
                            <div className="flex items-center space-x-2">
                              <div className={`h-2 w-2 rounded-full ${deepDetails.subscription?.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                              <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{deepDetails.subscription?.status || 'Unknown'}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Billing History</h4>
                          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                              <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {deepDetails.invoices.length > 0 ? deepDetails.invoices.map((inv: any) => (
                                  <tr key={inv.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{inv.invoice_number}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm font-black text-slate-900 dark:text-white">{formatCurrency(inv.amount)}</td>
                                    <td className="px-6 py-4 text-right">
                                      <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                        {inv.status}
                                      </span>
                                    </td>
                                  </tr>
                                )) : (
                                  <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">No invoices found</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "users" && deepDetails && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Affiliated Personnel</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Found {deepDetails.users.length} active members</p>
                          </div>
                          <button
                            onClick={() => setShowAddUserModal(true)}
                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center"
                          >
                            <Plus className="h-3.5 w-3.5 mr-2" />
                            Add Member
                          </button>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Role</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Access</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Account</th>
                              </tr>
                            </thead>
                            <tbody>
                              {deepDetails.users.length > 0 ? deepDetails.users.map((user: any) => (
                                <tr key={user.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/30 transition-colors">
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                      <div className="font-bold text-slate-900 dark:text-white">{user.name || 'Unnamed User'}</div>
                                      {user.is_unread && (
                                        <motion.span
                                          initial={{ scale: 0.8, opacity: 0 }}
                                          animate={{ scale: 1, opacity: 1 }}
                                          className="px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[7px] font-black uppercase tracking-widest rounded shadow-lg shadow-orange-500/20 animate-pulse"
                                        >
                                          New
                                        </motion.span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-medium">{user.email}</div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[8px] font-black uppercase tracking-widest rounded-md">
                                      {user.role}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                    {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : 'Never'}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md border ${user.is_active ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                      {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                  </td>
                                </tr>
                              )) : (
                                <tr>
                                  <td colSpan={4} className="px-6 py-12 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">No users linked to this organization</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {activeTab === "activity" && deepDetails && (
                      <div className="space-y-6">
                        <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                          {deepDetails.activityLogs.length > 0 ? deepDetails.activityLogs.map((log: any, idx: number) => (
                            <div key={log.id} className="relative">
                              <div className="absolute -left-8 top-1 h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.1)] z-10" />
                              <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{log.action.replace(/_/g, ' ')}</p>
                                  <time className="text-[10px] font-medium text-slate-400">{new Date(log.created_at).toLocaleString()}</time>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                  Performed by <span className="font-bold text-indigo-500">{log.user_name || 'System'}</span>
                                </p>
                              </div>
                            </div>
                          )) : (
                            <div className="py-12 text-center text-sm font-bold text-slate-400 uppercase tracking-widest">No recent activity logs</div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex justify-end items-center">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-8 py-3 text-sm font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Organization Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !isSubmitting && setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Add New Organization</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create a new organization with comprehensive details</p>
            </div>

            <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Organization Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                        placeholder="Enter organization name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Industry</label>
                      <select
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                      >
                        <option value="">Select Industry</option>
                        <option value="retail">Retail</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="grocery">Grocery</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="education">Education</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Business Type</label>
                      <input
                        type="text"
                        value={formData.business_type}
                        onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                        placeholder="e.g., LLC, Corporation"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Contact Person</label>
                      <input
                        type="text"
                        value={formData.contact_person}
                        onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Contact Email *</label>
                      <input
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Contact Phone</label>
                      <input
                        type="tel"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                        placeholder="+92 300 1234567"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                        placeholder="City name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>

                {/* Subscription */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Subscription Plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Plan</label>
                      <select
                        value={formData.plan}
                        onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                      >
                        <option value="starter">Starter (Free)</option>
                        <option value="business">Business (₨15,000/mo)</option>
                        <option value="pro">Pro (₨35,000/mo)</option>
                        <option value="enterprise">Enterprise (₨75,000/mo)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Add-ons (Optional)</label>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Add-ons can be configured after creation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                disabled={isSubmitting}
                className="px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 shadow-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrganization}
                disabled={isSubmitting}
                className="px-6 py-3 text-sm font-bold text-white grad-indigo rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-95 transition-all flex items-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Organization
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedOrganization && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
            onClick={() => {
              setShowDeleteModal(false)
              setDeleteConfirmName("")
              setDeleteConfirmWord("")
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl max-w-lg w-full overflow-hidden border border-rose-500/30"
            >
              <div className="p-8 text-center space-y-6">
                <div className="h-20 w-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto">
                  <AlertTriangle className="h-10 w-10 text-rose-500 animate-pulse" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Critical Action</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-bold mt-2 leading-relaxed">
                    You are about to permanently purge <span className="text-rose-500 underline decoration-rose-500/30">{selectedOrganization.name}</span>. This cannot be undone.
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left ml-2">Type organization name to verify</p>
                    <input
                      type="text"
                      placeholder={selectedOrganization.name}
                      value={deleteConfirmName}
                      onChange={(e) => setDeleteConfirmName(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-black focus:border-rose-500/50 outline-none transition-all dark:text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left ml-2">Type "delete" to confirm</p>
                    <input
                      type="text"
                      placeholder="delete"
                      value={deleteConfirmWord}
                      onChange={(e) => setDeleteConfirmWord(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-black focus:border-rose-500/50 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-3 pt-4">
                  <button
                    disabled={deleteConfirmName !== selectedOrganization.name || deleteConfirmWord.toLowerCase() !== "delete" || isDeleting}
                    onClick={handleDeleteOrganization}
                    className="w-full py-5 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-500/20 active:scale-95 flex items-center justify-center"
                  >
                    {isDeleting ? (
                      <>
                        <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                        Purging Entity...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-5 w-5 mr-3" />
                        Finalize Deletion
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setDeleteConfirmName("")
                      setDeleteConfirmWord("")
                    }}
                    className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                  >
                    Abort Destruction
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Direct User Enrollment Modal */}
      <AnimatePresence>
        {showAddUserModal && selectedOrganization && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
            onClick={() => setShowAddUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 grad-dark-indigo flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight">Enroll New Member</h2>
                    <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest">For {selectedOrganization.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      value={addUserFormData.first_name}
                      onChange={(e) => setAddUserFormData({ ...addUserFormData, first_name: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={addUserFormData.last_name}
                      onChange={(e) => setAddUserFormData({ ...addUserFormData, last_name: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="john.doe@org.com"
                      value={addUserFormData.email}
                      onChange={(e) => setAddUserFormData({ ...addUserFormData, email: e.target.value })}
                      className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Target Role</label>
                    <select
                      value={addUserFormData.role}
                      onChange={(e) => setAddUserFormData({ ...addUserFormData, role: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-500/20 dark:text-white appearance-none cursor-pointer"
                    >
                      <option value="USER">Member (Sales/Staff)</option>
                      <option value="ADMIN">Organization Admin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Direct Phone</label>
                    <input
                      type="tel"
                      placeholder="+92 XXX XXXXXXX"
                      value={addUserFormData.phone}
                      onChange={(e) => setAddUserFormData({ ...addUserFormData, phone: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 dark:text-white"
                    />
                  </div>
                </div>

                <div className="bg-indigo-50/50 dark:bg-indigo-500/5 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 flex items-start space-x-3">
                  <Key className="h-5 w-5 text-indigo-500 mt-0.5" />
                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed uppercase tracking-wider">
                    New members will receive a temporary password ("User@123") and will be required to update it upon their first activation.
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowAddUserModal(false)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!addUserFormData.email || isEnrolling}
                    onClick={handleAddUserToOrg}
                    className="flex-[2] py-4 grad-indigo text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    {isEnrolling ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Enrolling...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Finalize Enrollment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}