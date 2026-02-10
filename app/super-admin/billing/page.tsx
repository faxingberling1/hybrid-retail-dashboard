"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Filter, Plus, Download, MoreVertical,
  DollarSign, Calendar, CheckCircle, XCircle, Clock,
  Send, Eye, FileText, CreditCard, Receipt,
  TrendingUp, TrendingDown, RefreshCw, Bell,
  Building2, Users, ChevronRight, ExternalLink,
  Mail, MessageSquare, AlertCircle, DownloadCloud,
  ShoppingBag, Package, Printer, BarChart3, Monitor,
  Smartphone, Tag, Trash2, Edit, PrinterIcon, Save,
  History, ArrowLeft, ArrowRight, Zap,
  Calculator, Briefcase, Shield, Wifi, ShieldCheck,
  Check, X, Minus, Plus as PlusIcon, Wrench
} from "lucide-react"
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts'
import { toast } from "sonner"

// Helper for consistent toast usage if not already defined
const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
  if (type === 'success') toast.success(message)
  else if (type === 'error') toast.error(message)
  else if (type === 'info') toast.message(message) // Sonner uses message or info
  else toast.message(message)
}


// Types for Plan and Addon
type Plan = {
  id: string
  name: string
  price: number
  interval: string
  features: string[]
  is_active: boolean
}

type Addon = {
  id: string
  name: string
  description: string
  price: number
  interval: string
  icon: string // Storing icon name for dynamic rendering
  is_active: boolean
}






// Mock data
const organizations = [
  {
    id: "org-001",
    name: "FashionHub Retail",
    plan: "Enterprise",
    basePrice: 45000,
    addons: [
      { id: "addon-2", quantity: 1, addedDate: "2024-01-01" },
      { id: "addon-3", quantity: 1, addedDate: "2024-01-01" },
      { id: "addon-6", quantity: 1, addedDate: "2024-01-15" }
    ],
    status: "active"
  },
  {
    id: "org-002",
    name: "TechGadget Store",
    plan: "Pro",
    basePrice: 35000,
    addons: [
      { id: "addon-1", quantity: 3, addedDate: "2024-01-01" },
      { id: "addon-5", quantity: 1, addedDate: "2024-01-10" }
    ],
    status: "active"
  },
  {
    id: "org-003",
    name: "FreshMart Superstore",
    plan: "Enterprise",
    basePrice: 65000,
    addons: [
      { id: "addon-1", quantity: 5, addedDate: "2024-01-01" },
      { id: "addon-2", quantity: 1, addedDate: "2024-01-01" },
      { id: "addon-3", quantity: 1, addedDate: "2024-01-01" },
      { id: "addon-6", quantity: 1, addedDate: "2024-01-01" },
      { id: "addon-7", quantity: 1, addedDate: "2024-01-01" }
    ],
    status: "active"
  }
]

// Invoice mock data with add-ons breakdown
const billingHistory = [
  {
    id: 1,
    organization: "FashionHub Retail",
    organizationId: "FH-001",
    invoiceId: "INV-2024-001",
    amount: 52000,
    formattedAmount: "₨ 52,000",
    plan: "Enterprise",
    period: "Jan 1 - Jan 31, 2024",
    dueDate: "Jan 15, 2024",
    status: "paid",
    paymentDate: "Jan 10, 2024",
    paymentMethod: "Bank Transfer",
    receiptUrl: "#",
    breakdown: {
      basePlan: 45000,
      addons: [
        { name: "SMS Receipts", price: 1000, quantity: 1 },
        { name: "Online BI Reports", price: 3000, quantity: 1 },
        { name: "24/7 Support", price: 3000, quantity: 1 }
      ],
      discount: 0,
      tax: 0
    }
  },
  {
    id: 2,
    organization: "TechGadget Store",
    organizationId: "TG-002",
    invoiceId: "INV-2024-002",
    amount: 50000,
    formattedAmount: "₨ 50,000",
    plan: "Pro",
    period: "Jan 1 - Jan 31, 2024",
    dueDate: "Jan 15, 2024",
    status: "paid",
    paymentDate: "Jan 12, 2024",
    paymentMethod: "Credit Card",
    receiptUrl: "#",
    breakdown: {
      basePlan: 35000,
      addons: [
        { name: "Extra Devices", price: 1500, quantity: 3 },
        { name: "Hardware Bundle", price: 6000, quantity: 1 }
      ],
      discount: 0,
      tax: 0
    }
  },
  {
    id: 3,
    organization: "FreshMart Superstore",
    organizationId: "FM-003",
    invoiceId: "INV-2024-003",
    amount: 99000,
    formattedAmount: "₨ 99,000",
    plan: "Enterprise",
    period: "Jan 1 - Jan 31, 2024",
    dueDate: "Jan 15, 2024",
    status: "pending",
    paymentDate: null,
    paymentMethod: null,
    receiptUrl: null,
    breakdown: {
      basePlan: 65000,
      addons: [
        { name: "Extra Devices", price: 1500, quantity: 5 },
        { name: "SMS Receipts", price: 1000, quantity: 1 },
        { name: "Online BI Reports", price: 3000, quantity: 1 },
        { name: "24/7 Support", price: 5000, quantity: 1 },
        { name: "Cloud Backup", price: 2000, quantity: 1 }
      ],
      discount: 0,
      tax: 0
    }
  },
  {
    id: 4,
    organization: "PharmaCare Pharmacy",
    organizationId: "PC-004",
    invoiceId: "INV-2024-004",
    amount: 25000,
    formattedAmount: "₨ 25,000",
    plan: "Business",
    period: "Jan 1 - Jan 31, 2024",
    dueDate: "Jan 15, 2024",
    status: "overdue",
    paymentDate: null,
    paymentMethod: null,
    receiptUrl: null,
    breakdown: {
      basePlan: 25000,
      addons: [],
      discount: 0,
      tax: 0
    }
  },
  {
    id: 5,
    organization: "HomeStyle Furniture",
    organizationId: "HS-005",
    invoiceId: "INV-2024-005",
    amount: 15000,
    formattedAmount: "₨ 15,000",
    plan: "Starter",
    period: "Jan 1 - Jan 31, 2024",
    dueDate: "Jan 15, 2024",
    status: "paid",
    paymentDate: "Jan 14, 2024",
    paymentMethod: "JazzCash",
    receiptUrl: "#",
    breakdown: {
      basePlan: 15000,
      addons: [],
      discount: 0,
      tax: 0
    }
  },
]

const billingStats = [
  { title: "Total Revenue", value: "₨ 8.4M", change: "+23%", icon: <DollarSign className="h-5 w-5" />, color: "bg-green-100 text-green-600" },
  { title: "Pending Payments", value: "₨ 1.24M", change: "-15%", icon: <Clock className="h-5 w-5" />, color: "bg-yellow-100 text-yellow-600" },
  { title: "Overdue Payments", value: "₨ 65,000", change: "+8%", icon: <AlertCircle className="h-5 w-5" />, color: "bg-red-100 text-red-600" },
  { title: "Add-on Revenue", value: "₨ 1.8M", change: "+32%", icon: <Package className="h-5 w-5" />, color: "bg-purple-100 text-purple-600" },
]

const paymentMethods = [
  { name: "Bank Transfer", count: 42, percentage: 60, color: '#8884d8' },
  { name: "Credit Card", count: 18, percentage: 25, color: '#82ca9d' },
  { name: "JazzCash", count: 6, percentage: 8, color: '#ffc658' },
  { name: "Easypaisa", count: 4, percentage: 5, color: '#ff8042' },
  { name: "Other", count: 2, percentage: 2, color: '#0088fe' },
]

const revenueData = [
  { name: 'Aug', revenue: 4200000, expenses: 2100000 },
  { name: 'Sep', revenue: 4800000, expenses: 2300000 },
  { name: 'Oct', revenue: 5100000, expenses: 2400000 },
  { name: 'Nov', revenue: 5900000, expenses: 2800000 },
  { name: 'Dec', revenue: 7200000, expenses: 3100000 },
  { name: 'Jan', revenue: 8400000, expenses: 3400000 },
]

const planDistributionData = [
  { name: 'Starter', value: 15 },
  { name: 'Business', value: 35 },
  { name: 'Pro', value: 30 },
  { name: 'Enterprise', value: 20 },
]

export default function BillingPage() {
  // -- Dynamic Billing State & Handlers --
  const [plans, setPlans] = useState<Plan[]>([])
  const [addons, setAddons] = useState<Addon[]>([])
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [showAddonModal, setShowAddonModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null)

  // Fetch Plans & Addons
  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/super-admin/plans')
      if (res.ok) setPlans(await res.json())
    } catch (error) {
      console.error("Failed to fetch plans", error)
      addToast("Failed to fetch plans", "error")
    }
  }

  const fetchAddons = async () => {
    try {
      const res = await fetch('/api/super-admin/addons')
      if (res.ok) setAddons(await res.json())
    } catch (error) {
      console.error("Failed to fetch addons", error)
      addToast("Failed to fetch addons", "error")
    }
  }

  useEffect(() => {
    fetchPlans()
    fetchAddons()
  }, [])

  // Debug logging for plans and addons
  useEffect(() => {
    if (plans.length > 0) {
      console.log('📦 Available Plans loaded:', plans)
      console.log('📦 Plan Names:', plans.map(p => `${p.name} (₨${p.price}/${p.interval})`))
    }
  }, [plans])

  useEffect(() => {
    if (addons.length > 0) {
      console.log('🔌 Available Add-ons loaded:', addons)
      console.log('🔌 Add-on Names:', addons.map(a => `${a.name} (₨${a.price}/${a.interval})`))
    }
  }, [addons])

  const handleSavePlan = async (planData: Partial<Plan>) => {
    try {
      const method = editingPlan ? 'PUT' : 'POST'
      const url = editingPlan ? `/api/super-admin/plans/${editingPlan.id}` : '/api/super-admin/plans'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      })
      if (res.ok) {
        addToast(`Plan ${editingPlan ? 'updated' : 'created'} successfully`, "success")
        setShowPlanModal(false)
        fetchPlans()
      } else {
        addToast("Failed to save plan", "error")
      }
    } catch (error) {
      console.error("Error saving plan:", error)
      addToast("Error saving plan", "error")
    }
  }

  const handleSaveAddon = async (addonData: Partial<Addon>) => {
    try {
      const method = editingAddon ? 'PUT' : 'POST'
      const url = editingAddon ? `/api/super-admin/addons/${editingAddon.id}` : '/api/super-admin/addons'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addonData)
      })
      if (res.ok) {
        addToast(`Add-on ${editingAddon ? 'updated' : 'created'} successfully`, "success")
        setShowAddonModal(false)
        fetchAddons()
      } else {
        addToast("Failed to save add-on", "error")
      }
    } catch (error) {
      console.error("Error saving add-on:", error)
      addToast("Error saving add-on", "error")
    }
  }

  // Helper to render icon dynamically
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Package': return <Package className="h-5 w-5" />
      case 'Monitor': return <Monitor className="h-5 w-5" />
      case 'Wifi': return <Wifi className="h-5 w-5" />
      case 'Shield': return <Shield className="h-5 w-5" />
      case 'MessageSquare': return <MessageSquare className="h-5 w-5" />
      case 'BarChart3': return <BarChart3 className="h-5 w-5" />
      case 'Briefcase': return <Briefcase className="h-5 w-5" />
      case 'Printer': return <Printer className="h-5 w-5" />
      case 'DownloadCloud': return <DownloadCloud className="h-5 w-5" />
      case 'Zap': return <Zap className="h-5 w-5" />
      case 'Tool': return <Wrench className="h-5 w-5" />
      case 'Calendar': return <Calendar className="h-5 w-5" />
      default: return <Package className="h-5 w-5" />
    }
  }

  // Derive availableAddons for backward compatibility
  const availableAddons = addons.map(a => ({
    id: a.id,
    name: a.name,
    description: a.description || "",
    price: a.price,
    period: a.interval || "month",
    icon: renderIcon(a.icon),
    category: "General"
  }))
  // -- End Dynamic Billing State --

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [showSendReminderModal, setShowSendReminderModal] = useState(false)
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)

  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null)
  const [reminderType, setReminderType] = useState("email")
  const [reminderMessage, setReminderMessage] = useState("")
  const [activeTab, setActiveTab] = useState("plans")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedAddonCategory, setSelectedAddonCategory] = useState("All Categories")
  const [showAssignAddonModal, setShowAssignAddonModal] = useState(false)
  const [selectedAddonForAssign, setSelectedAddonForAssign] = useState<any>(null)
  const [assignSearchQuery, setAssignSearchQuery] = useState("")

  // Premium Notifications & Confirmations
  const [toasts, setToasts] = useState<any[]>([])
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'warning' | 'danger' | 'info';
  }>({
    show: false,
    title: "",
    message: "",
    onConfirm: () => { },
    type: 'info'
  })

  const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'warning' | 'danger' | 'info' = 'warning') => {
    setConfirmModal({ show: true, title, message, onConfirm, type })
  }

  // New Invoice State
  const [invoiceCreationStep, setInvoiceCreationStep] = useState(1)
  const [invoiceType, setInvoiceType] = useState<'plan' | 'addon' | 'custom'>('plan')
  const [newInvoiceData, setNewInvoiceData] = useState({
    organization_id: "",
    amount: 0,
    due_date: new Date().toISOString().split('T')[0],
    notes: "",
    items: [] as any[]
  })
  const [selectedInvoiceAddons, setSelectedInvoiceAddons] = useState<string[]>([])

  // Real data state
  const [stats, setStats] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [planDistribution, setPlanDistribution] = useState<any[]>([])
  const [organizationsData, setOrganizationsData] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set())
  const [expandedOrgDetails, setExpandedOrgDetails] = useState<Set<string>>(new Set())
  const [activeOrgTabs, setActiveOrgTabs] = useState<Record<string, 'services' | 'assets' | 'history'>>({})

  // --- New Hub Management State ---
  const [isConfiguringHub, setIsConfiguringHub] = useState(false)
  const [hubTargetOrg, setHubTargetOrg] = useState<any>(null)
  const [configSelectedPlanId, setConfigSelectedPlanId] = useState<string | null>(null)
  const [configSelectedAddons, setConfigSelectedAddons] = useState<any[]>([]) // { id, qty, price }

  // --- New Secure Deletion State ---
  const [showSecureDeleteModal, setShowSecureDeleteModal] = useState(false)
  const [targetForDeletion, setTargetForDeletion] = useState<any>(null)
  const [deleteConfirmationName, setDeleteConfirmationName] = useState("")

  const toggleOrgExpansion = (orgId: string) => {
    const newExpanded = new Set(expandedOrgs)
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId)
    } else {
      newExpanded.add(orgId)
    }
    setExpandedOrgs(newExpanded)
  }

  const groupedInvoices = invoices.reduce((acc: any, inv: any) => {
    const orgId = inv.organization_id;
    if (!acc[orgId]) {
      acc[orgId] = {
        id: orgId,
        name: inv.organization_name,
        user_count: inv.user_count,
        invoices: [],
        totalPending: 0,
        totalPaid: 0,
        unpaidCount: 0
      }
    }
    acc[orgId].invoices.push(inv)
    if (inv?.status?.toLowerCase() === 'paid') {
      acc[orgId].totalPaid += Number(inv.amount)
    } else {
      acc[orgId].totalPending += Number(inv.amount)
      acc[orgId].unpaidCount++
    }
    return acc
  }, {})

  const sortedOrgs = Object.values(groupedInvoices).sort((a: any, b: any) => b.totalPending - a.totalPending)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [statsRes, orgsRes, invoicesRes] = await Promise.all([
        fetch('/api/super-admin/billing/stats').then(res => res.json()),
        fetch('/api/super-admin/billing/organizations').then(res => res.json()),
        fetch(`/api/super-admin/billing/invoices?status=${selectedStatus}&search=${searchQuery}`).then(res => res.json())
      ])

      if (statsRes) {
        setStats(statsRes.stats || [])
        setRevenueData(statsRes.revenueData || [])
        setPlanDistribution(statsRes.planDistribution || [])
      }
      if (orgsRes) {
        const parsedOrgs = (orgsRes.organizations || []).map((org: any) => ({
          ...org,
          addons: typeof org.add_ons === 'string' ? JSON.parse(org.add_ons) : (org.add_ons || org.addons || [])
        }))
        console.log('📊 Organizations fetched after refresh:', parsedOrgs.map((o: any) => ({
          name: o.name,
          plan: o.plan,
          add_ons_raw: o.add_ons,
          addons_parsed: o.addons
        })))
        setOrganizationsData(parsedOrgs)
      }
      if (invoicesRes) setInvoices(invoicesRes.invoices || [])
    } catch (error) {
      console.error('Failed to fetch billing data:', error)
      addToast('Failed to sync dashboard data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSeedDemo = async () => {
    try {
      const res = await fetch('/api/super-admin/billing/seed', { method: 'POST' })
      if (res.ok) {
        addToast('Demo invoice seeded successfully', 'success')
        fetchData()
      } else {
        addToast('Failed to seed demo data', 'error')
      }
    } catch (error) {
      console.error('Error seeding demo data:', error)
      addToast('Critical error during seeding', 'error')
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedStatus, searchQuery])

  const filteredAddons = selectedAddonCategory === "All Categories"
    ? availableAddons
    : availableAddons.filter(addon => addon.category.toLowerCase() === selectedAddonCategory.toLowerCase())

  const handleAssignAddonToOrg = async (orgId: string) => {
    if (!selectedAddonForAssign) return

    try {
      // Mock API call - in a real app, this would update the subscription in the DB
      addToast(`Assigning ${selectedAddonForAssign.name} to organization...`, 'info')

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800))

      addToast(`${selectedAddonForAssign.name} assigned successfully`, 'success')
      setShowAssignAddonModal(false)
      fetchData() // Refresh data to show new add-on if reflected in API
    } catch (error) {
      console.error('Failed to assign add-on:', error)
      addToast('Failed to assign add-on', 'error')
    }
  }

  const updateOrgAddons = (orgId: string, addonId: string, action: 'ADD' | 'REMOVE' | 'INCREMENT' | 'DECREMENT') => {
    setOrganizationsData(prevOrgs => {
      const newOrgs = prevOrgs.map(org => {
        if (org.id !== orgId) return org

        let newAddons = [...(org.addons || [])]
        const existingIdx = newAddons.findIndex(a => a.id === addonId)

        if (action === 'ADD') {
          if (existingIdx === -1) {
            const addonConfig = availableAddons.find(a => a.id === addonId)
            newAddons.push({
              id: addonId,
              quantity: 1,
              addedDate: new Date().toISOString().split('T')[0],
              name: addonConfig?.name,
              price: addonConfig?.price
            })
            addToast(`Added ${addonConfig?.name || 'add-on'} to ${org.name}`, 'success')
          }
        } else if (action === 'INCREMENT') {
          if (existingIdx !== -1) {
            newAddons[existingIdx].quantity += 1
          }
        } else if (action === 'DECREMENT') {
          if (existingIdx !== -1) {
            if (newAddons[existingIdx].quantity > 1) {
              newAddons[existingIdx].quantity -= 1
            } else {
              const addonName = newAddons[existingIdx].name || availableAddons.find(a => a.id === addonId)?.name
              newAddons.splice(existingIdx, 1)
              addToast(`Removed ${addonName || 'add-on'} from ${org.name}`, 'info')
            }
          }
        } else if (action === 'REMOVE') {
          if (existingIdx !== -1) {
            const addonName = newAddons[existingIdx].name || availableAddons.find(a => a.id === addonId)?.name
            newAddons.splice(existingIdx, 1)
            addToast(`Removed ${addonName || 'add-on'} from ${org.name}`, 'info')
          }
        }

        const updatedOrg = { ...org, addons: newAddons }
        if (selectedOrganization?.id === orgId) {
          setSelectedOrganization(updatedOrg)
        }
        return updatedOrg
      })
      return newOrgs
    })
  }

  const handleSaveAddonChanges = async () => {
    if (!selectedOrganization) return

    try {
      addToast(`Saving add-on changes for ${selectedOrganization.name}...`, 'info')

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate a billing receipt
      const totalAddonAmount = calculateAddonTotal(selectedOrganization.addons)
      if (totalAddonAmount > 0) {
        const newInvoice = {
          id: `INV-ADDON-${Date.now()}`,
          organization_id: selectedOrganization.id,
          organization_name: selectedOrganization.name,
          invoice_number: `ACC-${Math.floor(Math.random() * 9000) + 1000}`,
          amount: totalAddonAmount,
          status: 'paid',
          due_date: new Date().toISOString(),
          paid_at: new Date().toISOString(),
          billing_period: `${new Date().toLocaleString('default', { month: 'long' })} Add-on Adjustment`,
          plan: selectedOrganization.plan,
          user_count: selectedOrganization.user_count || 0,
          is_shared: true,
          shared_at: new Date().toISOString()
        }

        setInvoices(prev => [newInvoice, ...prev])
        addToast('Billing receipt generated and added to history', 'success')
      }

      addToast('Changes saved successfully', 'success')
      setShowAddonModal(false)
    } catch (error) {
      console.error('Failed to save add-on changes:', error)
      addToast('Failed to save changes', 'error')
    }
  }

  const handleShareInvoice = async (invoiceId: string, isShared: boolean) => {
    try {
      const res = await fetch(`/api/super-admin/billing/invoices/${invoiceId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isShared })
      })
      if (res.ok) {
        fetchData()
        addToast(`Invoice ${isShared ? 'shared with' : 'hidden from'} organization dashboard`, 'success')
      }
    } catch (error) {
      console.error('Failed to share invoice:', error)
    }
  }

  const handleCreateInvoice = async () => {
    if (!newInvoiceData.organization_id) {
      addToast("Please select an organization", "error")
      return
    }

    let finalAmount = newInvoiceData.amount
    let finalNotes = newInvoiceData.notes

    if (invoiceType === 'addon') {
      const selectedAddonDetails = availableAddons.filter(a => selectedInvoiceAddons.includes(a.id))
      finalAmount = selectedAddonDetails.reduce((sum, a) => sum + a.price, 0)
      const itemDetails = selectedAddonDetails.map(a => `${a.name} (${formatCurrency(a.price)})`).join(', ')
      finalNotes = finalNotes ? `${finalNotes}\n\nAdd-ons: ${itemDetails}` : `Add-ons: ${itemDetails}`
    }

    if (!finalAmount || finalAmount <= 0) {
      addToast("Invoice amount must be greater than 0", "error")
      return
    }

    try {
      const res = await fetch('/api/super-admin/billing/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: newInvoiceData.organization_id,
          amount: finalAmount,
          due_date: newInvoiceData.due_date,
          notes: finalNotes,
          type: invoiceType
        })
      })
      if (res.ok) {
        setShowCreateInvoiceModal(false)
        fetchData()
        addToast("Invoice created successfully", "success")
        setNewInvoiceData({
          organization_id: "",
          amount: 0,
          due_date: new Date().toISOString().split('T')[0],
          notes: "",
          items: []
        })
        setInvoiceCreationStep(1)
        setInvoiceType('plan')
        setSelectedInvoiceAddons([])
      }
    } catch (error) {
      console.error('Failed to create invoice:', error)
      addToast("Failed to create invoice", "error")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "overdue": return "bg-red-100 text-red-800"
      case "upcoming": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid": return <CheckCircle className="h-4 w-4" />
      case "pending": return <Clock className="h-4 w-4" />
      case "overdue": return <XCircle className="h-4 w-4" />
      case "upcoming": return <Calendar className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const handleViewDetails = (invoice: any) => {
    setSelectedInvoice(invoice)
    setShowPaymentDetailsModal(true)
  }

  const handleViewFullInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setShowInvoiceModal(true)
  }

  const handleSendReminder = (invoice: any) => {
    setSelectedInvoice(invoice)
    setReminderMessage(`Dear ${invoice.organization_name},\n\nThis is a reminder that your invoice ${invoice.invoice_number} for amount ₨ ${invoice.amount} is due on ${new Date(invoice.due_date).toLocaleDateString()}.\n\nPlease make the payment at your earliest convenience.\n\nBest regards,\nHybridPOS Team`)
    setShowSendReminderModal(true)
  }

  const handleManageAddons = (organization: any) => {
    setHubTargetOrg(organization)
    setIsConfiguringHub(true)
  }

  const handleUpgradeAndInvoice = async (planName: string, selectedAddons: any[]) => {
    if (!hubTargetOrg) return
    try {
      console.log(`🔄 Starting upgrade for ${hubTargetOrg.name}`)
      console.log(`📦 Plan: ${planName}`)
      console.log(`🔌 Selected Add-ons:`, selectedAddons)

      addToast(`Authorizing Upgrade for ${hubTargetOrg.name}...`, 'info')

      // 1. Sync Subscription
      const syncRes = await fetch(`/api/super-admin/billing/organizations/${hubTargetOrg.id}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planName, add_ons: selectedAddons })
      })

      if (!syncRes.ok) {
        addToast("Failed to synchronize subscription state", "error")
        return
      }

      console.log(`✅ Subscription synced successfully`)

      // 2. Generate Itemized Invoice
      const planObj = plans.find((p: any) => p.name === planName)
      const items = [
        // Include Base Plan
        {
          name: `[CORE] ${planName} Subscription`,
          quantity: 1,
          price: planObj?.price || 0
        },
        // Include Add-ons
        ...selectedAddons.map(sa => {
          const addonObj = availableAddons.find(a => a.id === sa.id)
          const categoryLabel = addonObj?.category ? `[${addonObj.category.toUpperCase()}] ` : ''
          return {
            name: `${categoryLabel}${addonObj?.name || 'Modular Service'}`,
            quantity: sa.quantity || 1,
            price: addonObj?.price || 0
          }
        })
      ]

      const totalAmount = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)

      const invoiceRes = await fetch('/api/super-admin/billing/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_id: hubTargetOrg.id,
          amount: totalAmount,
          due_date: new Date().toISOString().split('T')[0],
          notes: `Itemized upgrade invoice for ${planName} and selected services.`,
          items: items
        })
      })

      if (invoiceRes.ok) {
        addToast("Upgrade successful: State synced & Invoice issued", "success")
        setIsConfiguringHub(false)
        console.log(`🔄 Refreshing organization data...`)
        await fetchData()
        console.log(`✅ Organization data refreshed`)
      } else {
        addToast("Subscription synced, but failed to issue invoice", "warning")
        setIsConfiguringHub(false)
        await fetchData()
      }
    } catch (error) {
      console.error("Upgrade error:", error)
      addToast("Connection error during upgrade flow", "error")
    }
  }

  const handleSecureAddonDeletion = async (addon: any) => {
    try {
      addToast(`Destroying service: ${addon.name}...`, 'info')
      const res = await fetch(`/api/super-admin/addons/${addon.id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        addToast("Service permanently removed", "success")
        setShowSecureDeleteModal(false)
        fetchAddons()
      } else {
        addToast("Failed to destroy service", "error")
      }
    } catch (error) {
      console.error("Deletion error:", error)
      addToast("Network error during service removal", "error")
    }
  }

  const handleUpdateStatus = async (invoiceId: string, status: string) => {
    const performUpdate = async () => {
      try {
        const res = await fetch(`/api/super-admin/billing/invoices/${invoiceId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        })
        if (res.ok) {
          fetchData()
          if (selectedInvoice?.id === invoiceId) {
            setSelectedInvoice({
              ...selectedInvoice,
              status,
              paid_at: status === 'paid' ? new Date().toISOString() : null
            })
          }
          addToast(`Invoice marked as ${status} successfully`, 'success')
        }
      } catch (error) {
        console.error(`Failed to update invoice status to ${status}:`, error)
        addToast(`Failed to update status to ${status}`, 'error')
      }
    }

    if (status === 'pending' && selectedInvoice?.status === 'paid') {
      showConfirm(
        "Revert Payment Status?",
        "Are you sure you want to mark this invoice as unpaid? This will clear the payment timestamp and reset the billing status.",
        performUpdate,
        'warning'
      )
    } else {
      performUpdate()
    }
  }

  const sendReminder = async () => {
    if (!selectedInvoice) return
    try {
      const res = await fetch(`/api/super-admin/billing/invoices/${selectedInvoice.id}/remind`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reminderMessage })
      })
      if (res.ok) {
        setShowSendReminderModal(false)
        addToast(`Reminder sent to ${selectedInvoice.organization_name}`, 'success')
      }
    } catch (error) {
      console.error('Failed to send reminder:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount).replace('PKR', '₨')
  }

  const calculateAddonTotal = (addons: any[]) => {
    if (!addons || !Array.isArray(addons)) return 0
    return addons.reduce((total, addon) => {
      const price = addon.price || availableAddons.find(a => a.id === addon.id)?.price || 0
      return total + (Number(price) * (Number(addon.quantity) || 0))
    }, 0)
  }

  if (loading && stats.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 text-purple-600 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6 hide-on-print">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Billing & Management</h1>
            <p className="text-gray-600 mt-2">Manage organization plans, add-ons, and real-time revenue cycles</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition-all flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold shadow-sm hover:bg-gray-50 transition-all flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Sync Data
            </button>
            <button
              onClick={handleSeedDemo}
              className="px-4 py-2 bg-purple-50 border border-purple-100 text-purple-600 rounded-xl font-bold shadow-sm hover:bg-purple-100 transition-all flex items-center"
              title="Seed Demo Invoice"
            >
              <Zap className="h-4 w-4 mr-2" />
              Seed Demo
            </button>
            <button
              onClick={() => setShowCreateInvoiceModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:scale-[1.02] transition-all flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color} group-hover:scale-110 transition-transform`}>
                  {stat.title === "Total Revenue" && <DollarSign className="h-5 w-5" />}
                  {stat.title === "Pending Payments" && <Clock className="h-5 w-5" />}
                  {stat.title === "Overdue Payments" && <AlertCircle className="h-5 w-5" />}
                  {stat.title === "Add-on Revenue" && <Zap className="h-5 w-5" />}
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-bold ${stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {stat.change.startsWith('+') ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-1">
                {typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value}
              </h3>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
                <p className="text-sm text-gray-500">6-month revenue and expenses trend</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="flex items-center text-xs font-medium text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-purple-600 mr-1"></div> Revenue
                </span>
                <span className="flex items-center text-xs font-medium text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mr-1"></div> Expenses
                </span>
                <select className="ml-4 text-xs font-medium border-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 py-1">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(val) => `₨${val / 1000000}M`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: number | undefined) => [`₨ ${(value || 0 / 1000).toLocaleString()}k`, '']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="expenses" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Plan Distribution</h3>
            <p className="text-sm text-gray-500 mb-6">Active subscriptions by plan type</p>
            <div className="h-[220px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {planDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'][index % 4]} className="focus:outline-none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-900">
                  {planDistribution.reduce((acc: number, curr: any) => acc + Number(curr.value), 0)}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Orgs</span>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {planDistribution.map((item: any, index: number) => {
                const total = planDistribution.reduce((acc: number, curr: any) => acc + Number(curr.value), 0);
                const percentage = Math.round((Number(item.value) / total) * 100) || 0;
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2.5 h-2.5 rounded-full mr-3 shadow-sm" style={{ backgroundColor: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'][index % 4] }}></div>
                      <span className="text-sm font-semibold text-gray-600">{item.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-bold text-gray-900 mr-2">{percentage}%</span>
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'][index % 4] }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 p-1">
          <nav className="flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("plans")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === "plans" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Plans
              </div>
            </button>
            <button
              onClick={() => setActiveTab("addons")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === "addons" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              <div className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Add-ons
              </div>
            </button>
            <button
              onClick={() => setActiveTab("organizations")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === "organizations" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Organizations
              </div>
            </button>
            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === "invoices" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              <div className="flex items-center">
                <Receipt className="h-4 w-4 mr-2" />
                Invoices
              </div>
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${activeTab === "reports" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Reports
              </div>
            </button>
          </nav>
        </div>

        {/* Invoices Tab */}
        {activeTab === "invoices" && (
          <div className="space-y-6">
            {/* Filters & Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search invoices or organizations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>

                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Months</option>
                    <option value="january">January 2024</option>
                    <option value="december">December 2023</option>
                    <option value="november">November 2023</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Billing History Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Billing History</h2>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">
                    {invoices.length} invoices found
                  </span>
                  <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
                    View All
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shared</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedOrgs.map((org: any) => (
                      <React.Fragment key={org.id}>
                        {/* Organization Header Row */}
                        <tr className="bg-gray-50/30 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleOrgExpansion(org.id)}>
                          <td colSpan={2} className="px-6 py-4">
                            <div className="flex items-center">
                              <motion.div
                                animate={{ rotate: expandedOrgs.has(org.id) ? 90 : 0 }}
                                className="mr-3 text-gray-400"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </motion.div>
                              <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center border border-purple-200">
                                <Building2 className="h-5 w-5 text-purple-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-bold text-gray-900">{org.name}</div>
                                <div className="flex items-center mt-0.5">
                                  <Users className="h-3 w-3 text-gray-400 mr-1" />
                                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
                                    {org.user_count || 0} Synced Users
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-gray-900">{formatCurrency(org.totalPending + org.totalPaid)}</span>
                              <span className="text-[10px] font-bold text-gray-400">Total Lifecycle</span>
                            </div>
                          </td>
                          <td className="px-6 py-4" colSpan={2}>
                            <div className="flex items-center space-x-4">
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-amber-600">{formatCurrency(org.totalPending)}</span>
                                <span className="text-[9px] font-black uppercase tracking-tighter text-amber-400">Pending</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-green-600">{formatCurrency(org.totalPaid)}</span>
                                <span className="text-[9px] font-black uppercase tracking-tighter text-green-400">Paid</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {org.unpaidCount > 0 ? (
                              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center w-fit">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {org.unpaidCount} Action Required
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center w-fit">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                All Settled
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right" colSpan={2}>
                            <div className="flex justify-end space-x-2">
                              {org.unpaidCount > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    addToast(`All ${org.unpaidCount} pending reminders sent to ${org.name}`, 'info')
                                  }}
                                  className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-100 hover:bg-amber-100 transition-all"
                                >
                                  Notify Org
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleOrgExpansion(org.id); }}
                                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                              >
                                {expandedOrgs.has(org.id) ? "Hide Invoices" : "View Invoices"}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Invoice Rows */}
                        <AnimatePresence>
                          {expandedOrgs.has(org.id) && org.invoices.map((item: any, idx: number) => (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-white hover:bg-purple-50/30 transition-colors border-l-4 border-l-purple-500"
                            >
                              <td className="px-6 py-3 pl-12">
                                <div className="flex items-center">
                                  <div className="h-8 w-8 flex-shrink-0 bg-white rounded-lg flex items-center justify-center border border-gray-100 shadow-sm">
                                    <Receipt className="h-4 w-4 text-purple-600" />
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-xs font-bold text-gray-900">{item.invoice_number}</div>
                                    <div className="text-[9px] font-bold text-gray-400 uppercase">Period end: {new Date(item.due_date).toLocaleDateString()}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-3"></td>
                              <td className="px-6 py-3 font-bold text-gray-700 text-sm">{formatCurrency(item.amount)}</td>
                              <td className="px-6 py-3">
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-50 border border-gray-100 rounded text-gray-600 uppercase tracking-tighter">
                                  {item.plan || 'Standard'}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-xs text-gray-500 font-medium">
                                {new Date(item.due_date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-3">
                                <span className={`px-2 py-0.5 inline-flex items-center text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm ${getStatusColor(item.status)}`}>
                                  {getStatusIcon(item.status)}
                                  <span className="ml-1">{item.status}</span>
                                </span>
                              </td>
                              <td className="px-6 py-3">
                                <div className="flex items-center group cursor-pointer" onClick={(e) => { e.stopPropagation(); handleShareInvoice(item.id, !item.is_shared); }}>
                                  <div className={`p-1 rounded-lg transition-all ${item.is_shared ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-50 text-gray-300 group-hover:bg-indigo-50 group-hover:text-indigo-400'}`}>
                                    <Send className={`h-3 w-3 ${item.is_shared ? 'fill-current' : ''}`} />
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-3 text-right">
                                <div className="flex items-center justify-end space-x-1">
                                  <button onClick={(e) => { e.stopPropagation(); handleViewDetails(item); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye className="h-3.5 w-3.5" /></button>
                                  <button onClick={(e) => { e.stopPropagation(); handleViewFullInvoice(item); }} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-all"><FileText className="h-3.5 w-3.5" /></button>
                                  {item.status?.toLowerCase() !== 'paid' && (
                                    <button onClick={(e) => { e.stopPropagation(); handleSendReminder(item); }} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-all"><Bell className="h-3.5 w-3.5" /></button>
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                    <span className="font-medium">12</span> invoices
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-lg">
                      1
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      2
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      3
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === "organizations" && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Enhanced Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-purple-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-600 rounded-xl shadow-lg shadow-purple-500/20">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Organization Registry</h2>
                </div>
                <p className="text-gray-500 font-medium ml-1">Streamlined view of global subscriptions and modular service stacks</p>
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="px-5 py-2.5 bg-gray-900/5 backdrop-blur-md rounded-2xl border border-gray-900/5 flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Nodes</span>
                    <span className="text-sm font-black text-gray-900">{organizationsData.length} Partners</span>
                  </div>
                </div>
                <button className="px-6 py-3 bg-white text-gray-900 font-black uppercase tracking-widest text-xs rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-purple-300 transition-all flex items-center gap-2 shadow-xl shadow-gray-200/20">
                  <Download className="h-4 w-4" />
                  Export Hub
                </button>
              </div>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
              className="grid grid-cols-1 gap-8"
            >
              {organizationsData.map((org) => {
                // Cross-reference with actual plans array for accurate data (case-insensitive)
                const currentPlan = plans.find((p: any) => p.name.toLowerCase() === (org.plan || '').toLowerCase()) || {
                  name: org.plan || 'No Plan',
                  price: org.basePrice || 0,
                  interval: 'month'
                }
                const planPrice = Number(currentPlan.price) || 0

                // Calculate addon total with accurate pricing from availableAddons
                const orgAddons = org.addons || org.add_ons || []

                const addonTotal = orgAddons.reduce((sum: number, addon: any) => {
                  const addonConfig = availableAddons.find(a => a.id === addon.id)
                  const price = Number(addonConfig?.price || addon.price || 0)
                  const quantity = addon.quantity || 1
                  return sum + (price * quantity)
                }, 0)

                const totalAmount = planPrice + addonTotal

                return (
                  <motion.div
                    key={org.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="group relative bg-white/60 backdrop-blur-xl border border-white/40 rounded-[3rem] shadow-xl hover:shadow-[0_32px_64px_-16px_rgba(139,92,246,0.1)] transition-all duration-500 overflow-hidden"
                  >
                    {/* Decorative Gradient Background */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-50/50 to-transparent pointer-events-none group-hover:from-purple-100/50 transition-colors duration-500"></div>

                    <div className="p-8 lg:p-10 flex flex-col lg:flex-row gap-8 relative z-10">
                      {/* Left Section: Org Identity & Plan Hero */}
                      <div className="lg:w-1/3 flex flex-col">
                        <div className="flex items-center gap-5 mb-8">
                          <div className="h-20 w-20 flex-shrink-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] flex items-center justify-center border-4 border-white shadow-2xl group-hover:rotate-6 transition-transform duration-500">
                            <Building2 className="h-10 w-10 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight uppercase group-hover:text-purple-600 transition-colors italic">{org.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center px-3 py-1 bg-green-50 border border-green-100 rounded-full">
                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${org.subscription_status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">{org.subscription_status || org.status}</span>
                              </div>
                              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{org.id}</span>
                            </div>
                          </div>
                        </div>

                        {/* Main Plan Information Card */}
                        <div className="bg-gray-900 rounded-[2rem] p-6 shadow-2xl shadow-gray-900/20 relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-1">Current Tier</div>
                                <div className="text-2xl font-black text-white italic tracking-tight">{currentPlan.name} Plan</div>
                              </div>
                              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                                <Zap className="h-5 w-5 text-purple-400" />
                              </div>
                            </div>
                            <div className="flex items-end gap-2">
                              <span className="text-3xl font-black text-white">{formatCurrency(planPrice)}</span>
                              <span className="text-xs font-bold text-gray-400 mb-1.5 tracking-widest uppercase">/ {currentPlan.interval === 'year' ? 'Year' : 'Month'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Middle Section: Active Modules & Add-ons */}
                      <div className="lg:w-1/3 border-l border-gray-100 lg:pl-8">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 italic">Opted-for Services</h4>
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-600 text-[10px] font-black rounded-lg">
                            {org.addons?.length || org.add_ons?.length || 0} Modules
                          </span>
                        </div>

                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                          {(org.addons || org.add_ons)?.length > 0 ? (org.addons || org.add_ons).map((addon: any, index: number) => {
                            const addonConfig = availableAddons.find(a => a.id === addon.id)
                            return (
                              <div key={index} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-white transition-all group/item">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 flex-shrink-0 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm border border-gray-100 group-hover/item:scale-110 transition-transform">
                                    {addonConfig ? addonConfig.icon : <Package className="h-5 w-5" />}
                                  </div>
                                  <div>
                                    <div className="text-sm font-black text-gray-900 tracking-tight">{addonConfig?.name || addon.name || "Custom Module"}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                      Qty: {addon.quantity || 1} • {formatCurrency(addon.price || addonConfig?.price || 0)}
                                      <span className="ml-1 opacity-60">/{addonConfig?.period === 'year' ? 'yr' : 'mo'}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-black text-gray-900 italic">
                                    {formatCurrency((addon.price || addonConfig?.price || 0) * (addon.quantity || 1))}
                                  </div>
                                </div>
                              </div>
                            )
                          }) : (
                            <div className="flex flex-col items-center justify-center py-10 opacity-30 italic">
                              <Package className="h-8 w-8 mb-2" />
                              <span className="text-xs font-bold uppercase tracking-widest">No Add-ons Active</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Section: Financial Lifecycle & Actions */}
                      <div className="lg:w-1/3 border-l border-gray-100 lg:pl-8 flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 italic">Financial Lifecycle</div>
                          <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100 flex flex-col">
                              <span className="text-[10px] font-black text-green-600 uppercase tracking-widest italic mb-1">Paid to Date</span>
                              <span className="text-xl font-black text-green-900">{formatCurrency(org.total_paid || 0)}</span>
                            </div>
                            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 flex flex-col">
                              <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest italic mb-1">Owed (Pending)</span>
                              <span className="text-xl font-black text-amber-900">{formatCurrency(org.total_pending || 0)}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-5 bg-purple-50 rounded-[1.5rem] border border-purple-100">
                            <div>
                              <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Next Billing Total</div>
                              <div className="text-2xl font-black text-purple-900">{formatCurrency(totalAmount)}</div>
                            </div>
                            <div className="h-12 w-12 bg-white rounded-xl border border-purple-200 flex items-center justify-center text-purple-600 shadow-sm">
                              <BarChart3 className="h-6 w-6" />
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 flex items-center gap-3">
                          <button
                            onClick={() => handleManageAddons(org)}
                            className="flex-1 py-4 bg-purple-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-purple-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2"
                          >
                            <Wrench className="h-4 w-4" />
                            Manage Subscription
                          </button>
                          <button
                            onClick={() => {
                              const newExpanded = new Set(expandedOrgDetails)
                              if (newExpanded.has(org.id)) newExpanded.delete(org.id)
                              else newExpanded.add(org.id)
                              setExpandedOrgDetails(newExpanded)
                            }}
                            className={`p-4 rounded-2xl border transition-all ${expandedOrgDetails.has(org.id) ? 'bg-gray-900 text-white border-gray-900 shadow-xl' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100 hover:text-gray-900'}`}
                          >
                            <History className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Advanced Analytics & Asset Insights (Expandable) */}
                    <AnimatePresence>
                      {expandedOrgDetails.has(org.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-100 bg-gray-50/50"
                        >
                          <div className="p-10">
                            {/* Inner Tabs for Org Details */}
                            <div className="flex space-x-4 mb-8 border-b border-gray-200">
                              {[
                                { id: 'services', label: 'Service Stack', icon: Package },
                                { id: 'assets', label: 'Asset Insights', icon: Monitor },
                                { id: 'history', label: 'Billing Activity', icon: History }
                              ].map((tab) => (
                                <button
                                  key={tab.id}
                                  onClick={() => setActiveOrgTabs(prev => ({ ...prev, [org.id]: tab.id as any }))}
                                  className={`flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${(activeOrgTabs[org.id] || 'services') === tab.id
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                  <tab.icon className="h-3.5 w-3.5" />
                                  {tab.label}
                                </button>
                              ))}
                            </div>

                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                              {(activeOrgTabs[org.id] || 'services') === 'services' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {(org.addons || org.add_ons)?.length > 0 ? (org.addons || org.add_ons).map((addon: any, idx: number) => {
                                    const config = availableAddons.find(a => a.id === addon.id)
                                    return (
                                      <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                                          {config ? config.icon : <Package className="h-6 w-6" />}
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight italic">{config?.name || addon.name || 'Micro-Service'}</h4>
                                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                            {addon.quantity || 1} Instances • {formatCurrency(addon.price || config?.price || 0)}
                                          </p>
                                        </div>
                                      </div>
                                    )
                                  }) : (
                                    <div className="col-span-full py-12 flex flex-col items-center justify-center opacity-30 italic">
                                      <Package className="h-12 w-12 mb-4" />
                                      <span className="text-xs font-black uppercase tracking-widest">No modular services deployed to this hub</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {(activeOrgTabs[org.id] || 'services') === 'assets' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                  <div className="lg:col-span-2 space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="h-2 w-8 bg-purple-600 rounded-full"></div>
                                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">Advanced Asset Insights</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:border-purple-200 transition-all">
                                        <div className="flex justify-between items-center mb-4">
                                          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                            <Monitor className="h-5 w-5" />
                                          </div>
                                          <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black rounded-lg uppercase">3 Terminals</span>
                                        </div>
                                        <h5 className="font-black text-gray-900 uppercase tracking-tight mb-1">POS Hardware Registry</h5>
                                        <p className="text-xs text-gray-400 font-medium mb-4">All devices are synced and operational for the current lifecycle.</p>
                                        <div className="flex items-center gap-2">
                                          <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 w-[75%] rounded-full"></div>
                                          </div>
                                          <span className="text-[10px] font-black text-indigo-600 uppercase">75% Load</span>
                                        </div>
                                      </div>

                                      <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:border-amber-200 transition-all">
                                        <div className="flex justify-between items-center mb-4">
                                          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                                            <Shield className="h-5 w-5" />
                                          </div>
                                          <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-lg uppercase">System Alert</span>
                                        </div>
                                        <h5 className="font-black text-gray-900 uppercase tracking-tight mb-1">Pending Service Requests</h5>
                                        <p className="text-xs text-gray-400 font-medium mb-4">"Advanced API Core" activation requested on Feb 05.</p>
                                        <div className="flex gap-2">
                                          <button className="flex-1 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-purple-600 transition-all">Process</button>
                                          <button className="px-4 py-2 border border-gray-200 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all">Detail</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="h-2 w-8 bg-green-500 rounded-full"></div>
                                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-900">Partner Growth</h4>
                                    </div>
                                    <div className="bg-gray-900 rounded-[2.5rem] p-8 relative overflow-hidden group/chart">
                                      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
                                      <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-8">
                                          <div>
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Estimated LTV</div>
                                            <div className="text-3xl font-black text-white italic tracking-tighter">{formatCurrency(1250000)}</div>
                                          </div>
                                          <TrendingUp className="h-8 w-8 text-green-400 opacity-50" />
                                        </div>
                                        <div className="space-y-6">
                                          <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                              <span>User Scaling</span>
                                              <span className="text-green-400">+12.4%</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                              <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "12.4%" }}
                                                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                                              />
                                            </div>
                                          </div>
                                          <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                              <span>Activity Score</span>
                                              <span className="text-purple-400">92/100</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                              <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "92%" }}
                                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {(activeOrgTabs[org.id] || 'services') === 'history' && (
                                <div className="py-12 flex flex-col items-center justify-center opacity-30 italic">
                                  <History className="h-12 w-12 mb-4" />
                                  <span className="text-xs font-black uppercase tracking-widest">Billing history ledger is currently being synced...</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        )}

        {/* Add-ons Tab */}
        {
          activeTab === "addons" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Available Add-ons</h2>
                    <p className="text-gray-600 text-sm">Additional features and services for organizations</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <select
                        value={selectedAddonCategory}
                        onChange={(e) => setSelectedAddonCategory(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all cursor-pointer shadow-sm hover:border-purple-300"
                      >
                        <option>All Categories</option>
                        <option>Devices</option>
                        <option>Communication</option>
                        <option>Analytics</option>
                        <option>Services</option>
                        <option>Hardware</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500 pointer-events-none rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredAddons.map((addon) => (
                    <div key={addon.id} className="group relative bg-white border border-gray-200 rounded-2xl p-5 hover:border-purple-500 hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="absolute top-0 right-0 p-3">
                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          {addon.category}
                        </span>
                      </div>
                      <div className="h-12 w-12 flex-shrink-0 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform shadow-lg">
                        <div className="text-white">
                          {addon.icon}
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-900 mb-1 leading-tight">{addon.name}</h3>
                      <p className="text-xs text-gray-500 mb-6 line-clamp-2 leading-relaxed">{addon.description}</p>

                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <div className="text-xl font-black text-gray-900 leading-none">{formatCurrency(addon.price)}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">
                            {addon.period === 'year' ? 'Per Year' : 'Per Month'}
                          </div>
                        </div>
                      </div>


                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedAddonForAssign(addon)
                            setShowAssignAddonModal(true)
                          }}
                          className="flex-1 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-white bg-gray-900 rounded-xl hover:bg-purple-600 transition-all shadow-md group-hover:shadow-purple-200"
                        >
                          Assign Org
                        </button>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              const originalAddon = addons.find(a => a.id === addon.id)
                              setEditingAddon(originalAddon || null)
                              setShowAddonModal(true)
                            }}
                            className="p-2.5 bg-gray-50 text-gray-400 hover:text-purple-600 rounded-xl border border-gray-100 transition-all"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setTargetForDeletion(addon)
                              setShowSecureDeleteModal(true)
                            }}
                            className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-600 rounded-xl border border-gray-100 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-on Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Most Popular Add-ons</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Extra Devices", count: 42, revenue: "₨ 63,000" },
                      { name: "SMS Receipts", count: 38, revenue: "₨ 38,000" },
                      { name: "Online BI Reports", count: 32, revenue: "₨ 96,000" },
                      { name: "24/7 Support", count: 28, revenue: "₨ 140,000" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.name}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{item.revenue}</div>
                          <div className="text-xs text-gray-500">{item.count} organizations</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-bold text-gray-900">Monthly Add-on Revenue</h3>
                      <p className="text-xs text-gray-500 mt-1">Breakdown of revenue from optional value-added services</p>
                    </div>
                    <select className="text-xs font-bold border-gray-200 rounded-lg py-1 px-3">
                      <option>Last 6 Months</option>
                    </select>
                  </div>
                  <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(val) => `₨${val / 1000}k`} />
                        <Tooltip
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        {/* Reports Tab */}
        {
          activeTab === "reports" && (
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
              {/* Immersive Command Header */}
              <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -ml-32 -mb-32" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                        <BarChart3 className="h-7 w-7 text-purple-300" />
                      </div>
                      <h2 className="text-3xl font-black uppercase tracking-tight italic">Financial Command Center</h2>
                    </div>
                    <p className="text-purple-100/70 font-medium text-lg leading-relaxed max-w-2xl">
                      Real-time visualization of global revenue streams, organization benchmarks, and projection dynamics across the HybridPOS ecosystem.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10">
                      <div className="text-[10px] font-black text-purple-300 uppercase tracking-widest mb-1">Estimated MRR</div>
                      <div className="text-2xl font-black italic">₨ 1.2M+</div>
                      <div className="flex items-center gap-1 mt-2 text-green-400">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-[10px] font-black">+14.2%</span>
                      </div>
                    </div>
                    <div className="p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10">
                      <div className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Annual Proj.</div>
                      <div className="text-2xl font-black italic">₨ 15M</div>
                      <div className="text-[10px] font-bold text-white/40 mt-2 uppercase tracking-tighter">Verified Run-rate</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Stream Visualizer */}
                <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-2xl relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Revenue Stream Matrix</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Multi-tier billing performance</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg border border-green-100 italic">Live Feed</span>
                    </div>
                  </div>

                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} tickFormatter={(val) => `₨${val / 1000}k`} />
                        <Tooltip
                          contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '16px' }}
                          labelStyle={{ fontWeight: 'black', textTransform: 'uppercase', marginBottom: '8px', color: '#111827' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Service Engagement */}
                <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white shadow-2xl">
                  <div className="mb-8">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Tier Distribution</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Market adoption density</p>
                  </div>

                  <div className="h-[250px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={planDistribution}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {planDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#d946ef', '#ec4899'][index % 4]} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Platform</span>
                      <span className="text-2xl font-black italic text-gray-900 leading-none">Usage</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {planDistribution.slice(0, 3).map((plan, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${['bg-indigo-500', 'bg-purple-500', 'bg-pink-500'][idx]}`} />
                          <span className="text-[11px] font-black text-gray-700 uppercase tracking-tight">{plan.name}</span>
                        </div>
                        <span className="text-[11px] font-black text-gray-900">{plan.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Advanced Financial Ledger */}
              <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-10 border border-white/50 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Financial Document Ledger</h3>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Available fiscal registries and analysis exports</p>
                  </div>
                  <button className="px-8 py-3 bg-white text-gray-900 font-black uppercase tracking-widest text-xs rounded-2xl border border-gray-200 hover:bg-gray-900 hover:text-white hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-gray-200/20">
                    <Calculator className="h-4 w-4" />
                    Compute Custom Audit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Revenue Summary Rollup", type: "Fiscal", date: "FEB 2024", format: "PDF", size: "1.2 MB", color: "from-blue-500 to-indigo-600" },
                    { title: "Partner Growth Dynamics", type: "Analytics", date: "JAN 2024", format: "CSV", size: "856 KB", color: "from-purple-500 to-pink-600" },
                    { title: "Modular Usage Audit", type: "Registry", date: "DEC 2023", format: "PDF", size: "2.1 MB", color: "from-emerald-500 to-teal-600" },
                  ].map((report, idx) => (
                    <div key={idx} className="group relative bg-white rounded-[2rem] p-6 border border-gray-100 hover:border-purple-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${report.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity -mr-16 -mt-16 rounded-full`} />

                      <div className="flex items-start justify-between mb-6">
                        <div className={`p-4 bg-gradient-to-br ${report.color} rounded-2xl text-white shadow-lg`}>
                          <FileText className="h-6 w-6" />
                        </div>
                        <button className="p-3 bg-gray-50 text-gray-400 hover:text-purple-600 hover:bg-white hover:shadow-md rounded-xl transition-all">
                          <DownloadCloud className="h-5 w-5" />
                        </button>
                      </div>

                      <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight italic mb-2 leading-tight">{report.title}</h4>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">{report.type} Stack • {report.date}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-gray-900 text-white text-[9px] font-black rounded-lg uppercase tracking-widest">{report.format}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{report.size}</span>
                        </div>
                        <button className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:underline">Preview Audit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }

        {/* Plans Management Tab */}
        {
          activeTab === "plans" && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-xl shadow-purple-500/5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Subscription Plans</h2>
                    <div className="px-2 py-0.5 bg-green-500 rounded-lg animate-pulse shadow-lg shadow-green-500/20">
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Engine</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Manage global pricing tiers and platform features</p>
                </div>
                <button
                  onClick={() => { setEditingPlan(null); setShowPlanModal(true) }}
                  className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-purple-500/25"
                >
                  <div className="p-1.5 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform">
                    <PlusIcon className="h-4 w-4" />
                  </div>
                  New Infrastructure Plan
                </button>
              </div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {plans.map(plan => (
                  <motion.div
                    key={plan.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    className="group relative bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/50 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                  >
                    {/* Gradient Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 blur-[80px] group-hover:bg-purple-500/20 transition-colors" />

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[1.5rem] text-purple-600 shadow-inner">
                          <Zap className="h-8 w-8" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border shadow-sm ${plan.is_active ? 'bg-green-50/50 text-green-600 border-green-200/50' : 'bg-gray-50/50 text-gray-500 border-gray-200/50'}`}>
                            {plan.is_active ? 'Online' : 'Draft'}
                          </span>
                          <button
                            onClick={() => { setEditingPlan(plan); setShowPlanModal(true) }}
                            className="p-2.5 bg-white rounded-xl border border-gray-100 text-gray-400 hover:text-purple-600 hover:border-purple-100 hover:shadow-lg transition-all"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-2xl font-black text-gray-900 mb-2 truncate group-hover:text-purple-600 transition-colors uppercase tracking-tight italic">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-8">
                        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600">
                          {formatCurrency(plan.price)}
                        </span>
                        <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">/{plan.interval}</span>
                      </div>

                      <div className="space-y-4 mb-8">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Core Features</div>
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3 group/item">
                            <div className="h-6 w-6 rounded-lg bg-green-50 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                            </div>
                            <span className="text-sm text-gray-600 font-medium group-hover/item:text-gray-900 transition-colors">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button className="w-full py-4 rounded-2xl bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-[0.3em] border border-gray-100 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-500 group-hover:shadow-xl group-hover:shadow-purple-500/20 transition-all">
                        Plan Analytics
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )
        }
      </div>

      {/* Modals are rendered below */}
      {/* Send Reminder Modal */}
      {
        showSendReminderModal && selectedInvoice && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowSendReminderModal(false)} />

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="px-6 py-4 bg-white border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Send Payment Reminder</h3>
                </div>

                <div className="px-6 py-4">
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-900">{selectedInvoice.organization_name}</div>
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(selectedInvoice.amount)}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Invoice: {selectedInvoice.invoice_number} • Due: {new Date(selectedInvoice.due_date).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reminder Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setReminderType("email")}
                          className={`p-3 border rounded-lg flex items-center justify-center ${reminderType === "email"
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                          <Mail className="h-5 w-5 mr-2" />
                          <span>Email</span>
                        </button>
                        <button
                          onClick={() => setReminderType("sms")}
                          className={`p-3 border rounded-lg flex items-center justify-center ${reminderType === "sms"
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-300 hover:border-gray-400"
                            }`}
                        >
                          <MessageSquare className="h-5 w-5 mr-2" />
                          <span>SMS</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={reminderMessage}
                        onChange={(e) => setReminderMessage(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Type your reminder message here..."
                      />
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                      This message will be sent to the organization's registered contact
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowSendReminderModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendReminder}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 flex items-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Payment Details Modal */}
      {
        showPaymentDetailsModal && selectedInvoice && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowPaymentDetailsModal(false)} />

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="px-6 py-4 bg-white border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                      <p className="text-sm text-gray-500">{selectedInvoice.invoice_number}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                        {getStatusIcon(selectedInvoice.status)}
                        <span className="ml-1">{selectedInvoice.status}</span>
                      </span>
                      <button onClick={() => setShowPaymentDetailsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronRight className="h-5 w-5 text-gray-500 rotate-90" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="space-y-6">
                    {/* Organization Info */}
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="h-12 w-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{selectedInvoice.organization_name}</div>
                        <div className="text-xs text-gray-500">Reg: {selectedInvoice.organization_id}</div>
                      </div>
                    </div>

                    {/* Billing Summary */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Amount</div>
                        <div className="text-lg font-bold text-gray-900">{formatCurrency(selectedInvoice.amount)}</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Due Date</div>
                        <div className="text-sm font-medium text-gray-900">{new Date(selectedInvoice.due_date).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* Action History / Notes */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900">Payment Status Logic</h4>
                      <div className="relative pl-6 border-l-2 border-gray-100 space-y-6">
                        <div className="relative">
                          <div className="absolute -left-[25px] top-0 h-4 w-4 rounded-full bg-green-500 border-4 border-white shadow-sm"></div>
                          <div className="text-sm font-medium text-gray-900">Invoice Generated</div>
                          <div className="text-xs text-gray-500">{new Date(selectedInvoice.created_at).toLocaleDateString()}</div>
                        </div>
                        <div className="relative">
                          <div className={`absolute -left-[25px] top-0 h-4 w-4 rounded-full border-4 border-white shadow-sm ${selectedInvoice.status === 'paid' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <div className="text-sm font-medium text-gray-900">Payment Received</div>
                          <div className="text-xs text-gray-500">
                            {selectedInvoice.status === 'paid' ? (selectedInvoice.paid_at ? new Date(selectedInvoice.paid_at).toLocaleDateString() : 'Confirmed') : 'Awaiting Settlement'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <ArrowRight className="h-5 w-5 text-purple-600" />
                      <div className="text-sm text-purple-700">
                        Marking as paid will instantly restore any suspended features for this organization.
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleSendReminder(selectedInvoice)}
                        className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 flex items-center"
                      >
                        <Bell className="h-4 w-4 mr-2" />
                        Send Reminder
                      </button>
                      {selectedInvoice.status === 'paid' ? (
                        <button
                          onClick={() => handleUpdateStatus(selectedInvoice.id, 'pending')}
                          className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50"
                        >
                          Mark as Unpaid
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(selectedInvoice.id, 'paid')}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Mark as Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewFullInvoice(selectedInvoice)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Full Invoice
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowPaymentDetailsModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Full Invoice Modal */}
      {
        showInvoiceModal && selectedInvoice && (
          <>
            {/* Print-specific styles */}
            <style jsx global>{`
              @media print {
                /* Aggressive global print resets */
                @page {
                  margin: 0;
                  size: auto;
                }
                
                body, html {
                  background: white !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 210mm !important; /* Standard A4 Width */
                  height: auto !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }

                aside, header, nav, footer:not(.invoice-footer), 
                .hide-on-print, .no-print, button, 
                [role="button"], .fixed.inset-0.bg-black {
                  display: none !important;
                }

                .fixed.inset-0.z-50.overflow-y-auto {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  height: auto !important;
                  display: block !important;
                  overflow: visible !important;
                  background: white !important;
                  z-index: auto !important;
                }

                .invoice-print-container {
                  visibility: visible !important;
                  position: relative !important;
                  width: 100% !important;
                  max-width: none !important;
                  margin: 0 !important;
                  padding: 1.5cm !important;
                  box-shadow: none !important;
                  border-radius: 0 !important;
                  transform: none !important;
                  border: none !important;
                  background: white !important;
                  display: block !important;
                }

                /* Fine-tune typography for print */
                h1, h2, h3, h4, p, span, td, th {
                  color: #000 !important;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                }

                .text-white, .text-white * {
                  color: #fff !important;
                }

                .text-purple-600, .text-indigo-600 {
                  color: #4f46e5 !important;
                }

                .bg-gray-50 {
                  background-color: #f9fafb !important;
                }

                .border-gray-200 {
                  border-color: #e5e7eb !important;
                }

                /* Ensure table lines are crisp */
                table {
                  border-collapse: collapse !important;
                  width: 100% !important;
                }
                
                th, td {
                  border-bottom: 1px solid #eee !important;
                }

                .invoice-header-bar {
                  border-bottom: 4px solid #4f46e5 !important;
                  margin-bottom: 2rem !important;
                }
              }
            `}</style>

            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowInvoiceModal(false)} />

                <div className="invoice-print-container inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                  {/* Invoice Header */}
                  <div className="px-8 py-10 invoice-header-bar flex justify-between items-end bg-white border-b-2 border-gray-100">
                    <div>
                      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter uppercase mb-1">Invoice</h1>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">{selectedInvoice.invoice_number}</span>
                        <div className="h-1 w-1 rounded-full bg-gray-300" />
                        <span className="text-sm text-gray-500 font-medium">Issued on: {new Date(selectedInvoice.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Amount Due</div>
                      <div className="text-3xl font-black text-gray-900 tracking-tight">{formatCurrency(selectedInvoice.amount)}</div>
                      <p className="text-xs font-bold text-red-500 uppercase tracking-widest mt-1">Due by: {new Date(selectedInvoice.due_date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="px-8 py-6">
                    {/* Company & Client Info */}
                    <div className="grid grid-cols-2 gap-12 mb-12">
                      <div>
                        {/* Dynamic branding - show store name if invoice created by store */}
                        {(() => {
                          const isStoreInvoice = selectedInvoice.created_by_org_id && selectedInvoice.created_by_org_id !== selectedInvoice.organization_id;
                          const companyName = isStoreInvoice ? selectedInvoice.organization_name : 'HybridPOS';
                          const companySubtitle = isStoreInvoice ? 'Authorized Retail Partner' : 'Enterprise POS Infrastructure';

                          return (
                            <div className="space-y-4">
                              <div className="flex items-center">
                                <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-indigo-200">
                                  <Building2 className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight italic">{companyName}</h3>
                                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">{companySubtitle}</p>
                                </div>
                              </div>
                              <div className="text-sm text-gray-500 space-y-1 font-medium leading-relaxed">
                                <p>123 Digital Square • Suite 402</p>
                                <p>Karachi Corporate Hub, PK 75500</p>
                                <p className="text-gray-900 font-bold">contact@{isStoreInvoice ? selectedInvoice.organization_name.toLowerCase().replace(/\s+/g, '') : 'hybridpos'}.pk</p>
                                <p className="text-gray-400 font-bold tracking-widest text-[10px]">+92 300 123 4567</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Recipient Information</h4>
                          <div className="space-y-2">
                            <p className="text-xl font-black text-gray-900 tracking-tight italic">{selectedInvoice.organization_name}</p>
                            <p className="text-xs font-bold text-gray-500">Org ID: <span className="text-indigo-600 tracking-widest uppercase">{selectedInvoice.organization_id}</span></p>
                          </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200/50 flex items-center justify-between">
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing Plan</div>
                          <div className="px-3 py-1 bg-white rounded-lg border border-gray-100 text-[10px] font-black text-gray-900 uppercase tracking-widest">{selectedInvoice.plan || 'Standard'} Tier</div>
                        </div>
                      </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="mb-12 overflow-hidden rounded-3xl border border-gray-100">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50/50">
                            <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Infrastructure / Service</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Qty</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Unit Rate</th>
                            <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Extended Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(() => {
                            // Parse items from JSON field
                            let items = [];
                            try {
                              items = typeof selectedInvoice.items === 'string'
                                ? JSON.parse(selectedInvoice.items)
                                : (selectedInvoice.items || []);
                            } catch (e) {
                              console.error('Failed to parse invoice items:', e);
                              items = [];
                            }

                            // If no items found, show the base plan as fallback
                            if (items.length === 0) {
                              items = [{
                                name: `${selectedInvoice.plan || 'Standard'} Infrastructure Tier`,
                                quantity: 1,
                                price: selectedInvoice.amount
                              }];
                            }

                            return items.map((item: any, index: number) => (
                              <tr key={index} className="group hover:bg-gray-50/30 transition-colors">
                                <td className="px-6 py-5">
                                  <div className="font-black text-gray-900 uppercase tracking-tight italic">{item.name}</div>
                                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    {item.name.includes('[CORE]') ? 'Platform Core Subscription' : 'Modular Feature Extension'}
                                  </div>
                                </td>
                                <td className="px-6 py-5 text-center text-sm font-bold text-gray-500">0{item.quantity || 1}</td>
                                <td className="px-6 py-5 text-right text-sm font-bold text-gray-900">{formatCurrency(Number(item.price) || 0)}</td>
                                <td className="px-6 py-5 text-right font-black text-indigo-600 italic">
                                  {formatCurrency((Number(item.price) || 0) * (Number(item.quantity) || 1))}
                                </td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>

                    {/* Payment Status & Footer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                      <div>
                        {selectedInvoice.notes && (
                          <div className="mb-6">
                            <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Internal Registry Notes</h5>
                            <p className="text-xs text-gray-500 leading-relaxed italic">{selectedInvoice.notes}</p>
                          </div>
                        )}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-indigo-600">
                            <ShieldCheck className="h-5 w-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Digital Auth Verified</span>
                          </div>
                          <p className="text-[10px] text-gray-400 font-medium leading-relaxed max-w-xs">
                            This is a system generated document. For inquiries, please contact our administrative desk at support@hybridpos.pk.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-8 bg-gray-900 rounded-[2.5rem] text-white relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap className="h-24 w-24 -rotate-12" />
                          </div>
                          <div className="relative z-10">
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">Total Settlement</div>
                            <div className="flex justify-between items-baseline mb-6 border-b border-white/10 pb-4">
                              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Subtotal due</span>
                              <span className="text-lg font-black italic tracking-tighter">{formatCurrency(selectedInvoice.amount)}</span>
                            </div>
                            <div className="flex justify-between items-end">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Grand Total</span>
                                <span className="text-4xl font-black italic tracking-tighter leading-none">{formatCurrency(selectedInvoice.amount)}</span>
                              </div>
                              <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${selectedInvoice.status === 'paid' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                {selectedInvoice.status === 'paid' ? 'Settled' : 'Pending'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {selectedInvoice.status === 'paid' && (
                          <div className="flex items-center justify-center p-4 bg-green-50 rounded-2xl border border-green-100">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Payment Confirmed {selectedInvoice.paid_at ? `on ${new Date(selectedInvoice.paid_at).toLocaleDateString()}` : ''}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col items-center">
                      <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] mb-4 text-center">Thank you for choosing HybridPOS infrastructure</div>
                      <div className="flex items-center gap-6 grayscale opacity-30">
                        <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                        <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                        <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="no-print px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Invoice generated on: Jan 1, 2024
                    </div>
                    <div className="flex items-center space-x-3">
                      {selectedInvoice.status !== 'paid' ? (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(selectedInvoice.id, 'paid')}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 flex items-center shadow-md shadow-green-100"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Paid
                          </button>
                          <button
                            onClick={() => handleSendReminder(selectedInvoice)}
                            className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 flex items-center shadow-md shadow-yellow-100"
                          >
                            <Bell className="h-4 w-4 mr-2" />
                            Send Reminder
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(selectedInvoice.id, 'pending')}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 flex items-center shadow-md shadow-red-100"
                        >
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Mark as Unpaid
                        </button>
                      )}
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                      >
                        <PrinterIcon className="h-4 w-4 mr-2" />
                        Print
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 flex items-center"
                      >
                        <DownloadCloud className="h-4 w-4 mr-2" />
                        Download PDF
                      </button>
                      <button
                        onClick={() => setShowInvoiceModal(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }
      {
        showPlanModal && (
          <PlanModal
            plan={editingPlan}
            onClose={() => setShowPlanModal(false)}
            onSave={handleSavePlan}
          />
        )
      }
      {
        showAddonModal && (
          <AddonModal
            addon={editingAddon}
            onClose={() => setShowAddonModal(false)}
            onSave={handleSaveAddon}
          />
        )
      }


      {/* Immersive Create Invoice Modal */}
      {
        showCreateInvoiceModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-black bg-opacity-60 backdrop-blur-sm" onClick={() => setShowCreateInvoiceModal(false)} />

              <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-100">

                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="h-6 w-6 text-purple-600" />
                      Create New Invoice
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Generate a manual billing record or service charge</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${invoiceCreationStep >= 1 ? 'bg-purple-600 ring-2 ring-purple-100' : 'bg-gray-200'}`} />
                    <div className={`h-0.5 w-10 transition-colors duration-300 ${invoiceCreationStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`} />
                    <div className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${invoiceCreationStep >= 2 ? 'bg-purple-600 ring-2 ring-purple-100' : 'bg-gray-200'}`} />
                  </div>
                </div>

                {/* Body */}
                <div className="p-8">
                  {invoiceCreationStep === 1 ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                      {/* Organization Selection */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Select Organization</label>
                        <select
                          value={newInvoiceData.organization_id}
                          onChange={(e) => setNewInvoiceData({ ...newInvoiceData, organization_id: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                        >
                          <option value="">Choose an organization...</option>
                          {organizationsData.map((org: any) => (
                            <option key={org.id} value={org.id}>{org.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Invoice Type Selection */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">Invoice Type</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <button
                            onClick={() => setInvoiceType('plan')}
                            className={`relative p-4 rounded-xl border-2 text-left transition-all ${invoiceType === 'plan' ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-purple-200 hover:bg-gray-50'}`}
                          >
                            <div className={`p-2 rounded-lg inline-block mb-3 ${invoiceType === 'plan' ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                              <CreditCard className="h-6 w-6" />
                            </div>
                            <h4 className={`font-bold ${invoiceType === 'plan' ? 'text-purple-900' : 'text-gray-900'}`}>Subscription Plan</h4>
                            <p className="text-xs text-gray-500 mt-1">Bill for monthly/yearly software license.</p>
                            {invoiceType === 'plan' && <div className="absolute top-3 right-3 text-purple-600"><CheckCircle className="h-5 w-5" /></div>}
                          </button>

                          <button
                            onClick={() => setInvoiceType('addon')}
                            className={`relative p-4 rounded-xl border-2 text-left transition-all ${invoiceType === 'addon' ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-purple-200 hover:bg-gray-50'}`}
                          >
                            <div className={`p-2 rounded-lg inline-block mb-3 ${invoiceType === 'addon' ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                              <Package className="h-6 w-6" />
                            </div>
                            <h4 className={`font-bold ${invoiceType === 'addon' ? 'text-purple-900' : 'text-gray-900'}`}>Add-ons</h4>
                            <p className="text-xs text-gray-500 mt-1">Charge for specific additional services.</p>
                            {invoiceType === 'addon' && <div className="absolute top-3 right-3 text-purple-600"><CheckCircle className="h-5 w-5" /></div>}
                          </button>

                          <button
                            onClick={() => setInvoiceType('custom')}
                            className={`relative p-4 rounded-xl border-2 text-left transition-all ${invoiceType === 'custom' ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-purple-200 hover:bg-gray-50'}`}
                          >
                            <div className={`p-2 rounded-lg inline-block mb-3 ${invoiceType === 'custom' ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                              <Briefcase className="h-6 w-6" />
                            </div>
                            <h4 className={`font-bold ${invoiceType === 'custom' ? 'text-purple-900' : 'text-gray-900'}`}>Custom / Maintenance</h4>
                            <p className="text-xs text-gray-500 mt-1">One-time fees or manual billing.</p>
                            {invoiceType === 'custom' && <div className="absolute top-3 right-3 text-purple-600"><CheckCircle className="h-5 w-5" /></div>}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                      {/* Dynamic Configuration Fields */}
                      {invoiceType === 'plan' && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-blue-900">Plan Billing</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              This will create an invoice linked to the organization's current subscription tier.
                              Please verify the amount below.
                            </p>
                          </div>
                        </div>
                      )}

                      {invoiceType === 'addon' && (
                        <div className="space-y-4">
                          <label className="block text-sm font-bold text-gray-700">Select Add-ons to Bill</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[240px] overflow-y-auto p-1">
                            {availableAddons.map(addon => (
                              <div
                                key={addon.id}
                                onClick={() => {
                                  if (selectedInvoiceAddons.includes(addon.id)) {
                                    setSelectedInvoiceAddons(prev => prev.filter(id => id !== addon.id))
                                  } else {
                                    setSelectedInvoiceAddons(prev => [...prev, addon.id])
                                  }
                                }}
                                className={`cursor-pointer p-3 rounded-lg border flex items-center justify-between transition-all ${selectedInvoiceAddons.includes(addon.id) ? 'bg-purple-50 border-purple-500' : 'bg-white border-gray-200 hover:border-purple-300'}`}
                              >
                                <div className="flex items-center">
                                  <div className={`p-1.5 rounded mr-3 ${selectedInvoiceAddons.includes(addon.id) ? 'bg-purple-200' : 'bg-gray-100'}`}>
                                    {addon.icon}
                                  </div>
                                  <span className={`text-sm font-medium ${selectedInvoiceAddons.includes(addon.id) ? 'text-purple-900' : 'text-gray-700'}`}>{addon.name}</span>
                                </div>
                                {selectedInvoiceAddons.includes(addon.id) && <CheckCircle className="h-4 w-4 text-purple-600" />}
                              </div>
                            ))}
                          </div>
                          {selectedInvoiceAddons.length > 0 && (
                            <div className="text-right text-sm font-bold text-purple-700">
                              Selected Total: {formatCurrency(availableAddons.filter(a => selectedInvoiceAddons.includes(a.id)).reduce((sum, a) => sum + a.price, 0))}
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Amount (₨)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₨</span>
                          </div>
                          <input
                            type="number"
                            value={invoiceType === 'addon'
                              ? availableAddons.filter(a => selectedInvoiceAddons.includes(a.id)).reduce((sum, a) => sum + a.price, 0)
                              : newInvoiceData.amount
                            }
                            onChange={(e) => {
                              if (invoiceType !== 'addon') {
                                setNewInvoiceData({ ...newInvoiceData, amount: Number(e.target.value) })
                              }
                            }}
                            disabled={invoiceType === 'addon'}
                            className={`w-full pl-7 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${invoiceType === 'addon' ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
                            placeholder="0.00"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Due Date</label>
                          <input
                            type="date"
                            value={newInvoiceData.due_date}
                            onChange={(e) => setNewInvoiceData({ ...newInvoiceData, due_date: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Billing Period</label>
                          <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm">
                            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Notes & Descriptions</label>
                        <textarea
                          value={newInvoiceData.notes}
                          onChange={(e) => setNewInvoiceData({ ...newInvoiceData, notes: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                          placeholder={invoiceType === 'custom' ? "Describe the custom service charges..." : "Add any internal notes..."}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  {invoiceCreationStep === 1 ? (
                    <button
                      onClick={() => setShowCreateInvoiceModal(false)}
                      className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => setInvoiceCreationStep(1)}
                      className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Back
                    </button>
                  )}

                  {invoiceCreationStep === 1 ? (
                    <button
                      onClick={() => {
                        if (newInvoiceData.organization_id) {
                          setInvoiceCreationStep(2)
                          // If plan, pre-fill amount if possible (mock logic here)
                          const org = organizationsData.find(o => o.id === newInvoiceData.organization_id)
                          if (invoiceType === 'plan' && org) {
                            setNewInvoiceData(prev => ({ ...prev, amount: org.basePrice || 0 }))
                          } else if (invoiceType === 'addon') {
                            // Amount calculated dynamically
                          } else {
                            setNewInvoiceData(prev => ({ ...prev, amount: 0 }))
                          }
                        } else {
                          addToast("Please select an organization first", "error")
                        }
                      }}
                      className="px-8 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-gray-800 transition-all flex items-center"
                    >
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleCreateInvoice}
                      className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Create Invoice
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        )
      }
      {
        showAddonModal && selectedOrganization && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowAddonModal(false)} />

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="px-6 py-4 bg-white border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Manage Add-ons</h3>
                      <p className="text-sm text-gray-500">{selectedOrganization.name}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          Current Total: {formatCurrency((selectedOrganization.basePrice || 0) + calculateAddonTotal(selectedOrganization.addons))}
                        </div>
                        <div className="text-xs text-gray-500">Monthly</div>
                      </div>
                      <button onClick={() => setShowAddonModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ChevronRight className="h-5 w-5 text-gray-500 rotate-90" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Current Add-ons */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Current Add-ons</h4>
                      <div className="space-y-3">
                        {selectedOrganization.addons && selectedOrganization.addons.length > 0 ? (
                          selectedOrganization.addons.map((addon: any, index: number) => {
                            const addonConfig = availableAddons.find(a => a.id === addon.id)
                            return addonConfig ? (
                              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center">
                                    <div className="h-8 w-8 flex-shrink-0 bg-purple-100 rounded flex items-center justify-center mr-3">
                                      {addonConfig.icon}
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-900">{addonConfig.name}</div>
                                      <div className="text-xs text-gray-500">{formatCurrency(addonConfig.price)} {addonConfig.period}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => updateOrgAddons(selectedOrganization.id, addon.id, 'DECREMENT')}
                                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-2 py-1 text-sm font-medium bg-gray-100 rounded">
                                      {addon.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateOrgAddons(selectedOrganization.id, addon.id, 'INCREMENT')}
                                      className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
                                    >
                                      <PlusIcon className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Added: {addon.addedDate}</span>
                                  <span className="font-medium text-gray-900">
                                    {formatCurrency(addonConfig.price * addon.quantity)}
                                  </span>
                                </div>
                              </div>
                            ) : null
                          })
                        ) : (
                          <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
                            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No add-ons active</p>
                            <p className="text-sm text-gray-400">Add services from the available options</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Available Add-ons */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Available Add-ons</h4>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {availableAddons.map((addon) => {
                          const isActive = selectedOrganization.addons?.some((a: any) => a.id === addon.id)
                          return (
                            <div key={addon.id} className="p-3 border border-gray-200 rounded-lg hover:border-purple-300">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-start">
                                  <div className="h-8 w-8 flex-shrink-0 bg-gradient-to-r from-purple-100 to-purple-200 rounded flex items-center justify-center mr-3">
                                    {addon.icon}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{addon.name}</div>
                                    <div className="text-xs text-gray-500">{addon.description}</div>
                                  </div>
                                </div>
                                {isActive ? (
                                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                    Active
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => updateOrgAddons(selectedOrganization.id, addon.id, 'ADD')}
                                    className="px-3 py-1 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100"
                                  >
                                    Add
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">{addon.category}</span>
                                <span className="font-bold text-gray-900">{formatCurrency(addon.price)}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Changes will apply from next billing cycle
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowAddonModal(false)}
                      className="px-6 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAddonChanges}
                      className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      {/* Assign Add-on Modal */}
      <AnimatePresence>
        {showAssignAddonModal && selectedAddonForAssign && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowAssignAddonModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 z-10"
            >
              <div className="px-8 py-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <h3 className="text-xl font-black uppercase tracking-tight relative z-10">Assign {selectedAddonForAssign.name}</h3>
                <p className="text-purple-100 text-[10px] font-bold uppercase tracking-widest mt-1 relative z-10">Link feature to organization</p>
              </div>

              <div className="p-8">
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search organizations..."
                    value={assignSearchQuery}
                    onChange={(e) => setAssignSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>

                <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {organizationsData
                    .filter(org => org.name.toLowerCase().includes(assignSearchQuery.toLowerCase()))
                    .map((org) => (
                      <button
                        key={org.id}
                        onClick={() => handleAssignAddonToOrg(org.id)}
                        className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-purple-50 hover:border-purple-200 transition-all group relative overflow-hidden"
                      >
                        <div className="flex items-center relative z-10">
                          <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 mr-4 shadow-sm group-hover:scale-110 transition-transform">
                            <Building2 className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-gray-900 group-hover:text-purple-900 transition-colors uppercase tracking-tight">{org.name}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{org.plan} Plan</div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-500/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                      </button>
                    ))}
                  {organizationsData.filter(org => org.name.toLowerCase().includes(assignSearchQuery.toLowerCase())).length === 0 && (
                    <div className="text-center py-12">
                      <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
                        <Search className="h-8 w-8 text-gray-200" />
                      </div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">No organizations matches</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-end items-center">
                <button
                  onClick={() => setShowAssignAddonModal(false)}
                  className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* New Management Hub Modals */}
      {
        isConfiguringHub && hubTargetOrg && (
          <SubscriptionConfigurator
            org={hubTargetOrg}
            plans={plans}
            addons={availableAddons}
            onClose={() => setIsConfiguringHub(false)}
            onUpgradeAndInvoice={handleUpgradeAndInvoice}
          />
        )
      }

      {showSecureDeleteModal && targetForDeletion && (
        <SecureDeleteModal
          target={targetForDeletion}
          onClose={() => setShowSecureDeleteModal(false)}
          onConfirm={handleSecureAddonDeletion}
        />
      )}
      {confirmModal.show && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          type={confirmModal.type}
          onConfirm={() => {
            confirmModal.onConfirm();
            setConfirmModal(prev => ({ ...prev, show: false }));
          }}
          onClose={() => setConfirmModal(prev => ({ ...prev, show: false }))}
        />
      )}
    </>
  )
}

function PlanModal({ plan, onClose, onSave }: any) {
  const [formData, setFormData] = useState(plan || { name: '', price: 0, interval: 'month', features: ['Analytics', '24/7 Support'], is_active: true })

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[3rem] w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Editor Side */}
        <div className="flex-1 p-10 md:p-12 bg-white flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-500/30">
              <PlusIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">{plan ? 'Refine Infrastructure' : 'New Tier Engine'}</h3>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-0.5">Configure billing and features</p>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Plan Nomenclature</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 font-bold transition-all"
                  placeholder="e.g. Enterprise Quantum"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Rate (₨)</label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black italic">₨</div>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 font-bold transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Billing Frequency</label>
              <div className="flex gap-4 p-2 bg-gray-50 rounded-2xl">
                {['month', 'year'].map((int) => (
                  <button
                    key={int}
                    onClick={() => setFormData({ ...formData, interval: int })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.interval === int ? 'bg-white text-purple-600 shadow-sm border border-purple-100' : 'text-gray-400'}`}
                  >
                    {int}ly
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Capability Stack (Comma Separated)</label>
              <textarea
                value={formData.features.join(', ')}
                onChange={e => setFormData({ ...formData, features: e.target.value.split(',').map((s: string) => s.trim()) })}
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 font-medium transition-all min-h-[120px]"
                placeholder="Unlimited POS, Cloud Sync, AI Analytics..."
              />
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="flex-1">
                <div className="text-sm font-black text-gray-900 uppercase tracking-tight italic">Status Toggle</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Enable or disable this plan globally</div>
              </div>
              <button
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${formData.is_active ? 'bg-green-500 shadow-lg shadow-green-500/25' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-sm ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-12">
            <button onClick={onClose} className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-900 transition-colors">Abort</button>
            <button
              onClick={() => onSave(formData)}
              className="px-10 py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-black hover:scale-105 transition-all"
            >
              Sync Infrastructure
            </button>
          </div>
        </div>

        {/* Preview Side */}
        <div className="hidden md:flex w-[400px] bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-12 flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full -ml-32 -mb-32 blur-[80px]" />

          <div className="relative z-10">
            <div className="text-[10px] font-black text-purple-300 uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
              <div className="h-4 w-4 rounded-full border border-purple-300 animate-ping" />
              Live Preview Engine
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6">
                <div className={`h-2 w-2 rounded-full ${formData.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
              </div>
              <div className="p-4 bg-purple-50 rounded-2xl text-purple-600 w-fit mb-6">
                <Zap className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight italic mb-1">{formData.name || 'Plan Name'}</h4>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black text-gray-900 italic">₨ {formData.price.toLocaleString()}</span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">/{formData.interval}</span>
              </div>
              <div className="space-y-3 mb-8">
                {formData.features.slice(0, 4).map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>{f || 'New Feature'}</span>
                  </div>
                ))}
              </div>
              <div className="w-full py-3 bg-gray-900 rounded-xl flex items-center justify-center">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Activate Tier</span>
              </div>
            </div>

            <p className="mt-12 text-center text-[10px] text-purple-200/50 font-bold uppercase tracking-widest leading-relaxed">
              Confirm these settings to update the<br />global pricing architecture system.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function AddonModal({ addon, onClose, onSave }: any) {
  const [formData, setFormData] = useState(addon || { name: '', price: 0, description: '', icon: 'Package', interval: 'month', is_active: true })

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[3rem] w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Editor Side */}
        <div className="flex-1 p-10 md:p-12 bg-white flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">{addon ? 'Refine Service' : 'Registry Micro-Service'}</h3>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-0.5">Extend core infrastructure</p>
            </div>
          </div>

          <div className="space-y-6 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Service Tag</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-bold transition-all"
                  placeholder="e.g. AI-Vision POS"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Legacy Rate (₨)</label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-black italic">₨</div>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-bold transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">System Categorization</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-medium transition-all min-h-[100px]"
                placeholder="Briefly describe the micro-service functionality..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Icon Visualization (Lucide Name)</label>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-500">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 font-bold transition-all"
                    placeholder="Package, Monitor, Shield, Zap..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Billing Cycle</label>
                <div className="flex bg-gray-50 p-1 rounded-2xl border border-transparent focus-within:border-indigo-500 transition-all">
                  <button
                    onClick={() => setFormData({ ...formData, interval: 'month' })}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${formData.interval === 'month' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, interval: 'year' })}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${formData.interval === 'year' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="flex-1">
                <div className="text-sm font-black text-gray-900 uppercase tracking-tight italic">Service Status</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Toggle availability in organization catalogs</div>
              </div>
              <button
                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${formData.is_active ? 'bg-indigo-500 shadow-lg shadow-indigo-500/25' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 shadow-sm ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-12">
            <button onClick={onClose} className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-900 transition-colors">Abort</button>
            <button
              onClick={() => onSave(formData)}
              className="px-10 py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-black hover:scale-105 transition-all"
            >
              Registry Service
            </button>
          </div>
        </div>

        {/* Preview Side */}
        <div className="hidden md:flex w-[400px] bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-900 p-12 flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32 blur-[80px]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mb-32 blur-[80px]" />

          <div className="relative z-10">
            <div className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
              <div className="h-4 w-4 rounded-full border border-indigo-300 border-2 border-dashed animate-spin duration-3000" />
              Service Virtualizer
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 w-fit">
                  <Package className="h-8 w-8" />
                </div>
                <div className={`w-2 h-2 rounded-full ${formData.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`} />
              </div>

              <h4 className="text-xl font-black text-gray-900 uppercase tracking-tight italic mb-2">{formData.name || 'Service Tag'}</h4>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6 leading-relaxed">
                {formData.description || 'Service Description Preview...'}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rate</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-gray-900 italic tracking-tighter">
                      ₨ {formData.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      /{formData.interval === 'month' ? 'mo' : 'yr'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-gray-900 rounded-2xl text-white">
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            <p className="mt-12 text-center text-[10px] text-indigo-200/50 font-bold uppercase tracking-widest leading-relaxed">
              Updates to micro-services reflect<br />instantly in administrative registries.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function SubscriptionConfigurator({ org, plans, addons, onClose, onUpgradeAndInvoice }: any) {
  const [selectedPlanId, setSelectedPlanId] = useState(plans.find((p: any) => p.name === org.plan)?.id || plans[0]?.id)
  const [selectedAddons, setSelectedAddons] = useState<any[]>(() => {
    try {
      if (typeof org.add_ons === 'string') return JSON.parse(org.add_ons)
      return org.add_ons || []
    } catch { return [] }
  })

  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState(false)
  const [upgradeConfirmText, setUpgradeConfirmText] = useState("")

  // Live Price Engine
  const selectedPlan = plans.find((p: any) => p.id === selectedPlanId)
  const planPrice = Number(selectedPlan?.price || 0)
  const addonsTotal = selectedAddons.reduce((sum, sa) => {
    const addonObj = addons.find((a: any) => a.id === sa.id)
    return sum + (Number(addonObj?.price || 0) * (sa.quantity || 1))
  }, 0)
  const totalPrice = planPrice + addonsTotal

  const toggleAddon = (addonId: string) => {
    if (selectedAddons.find(a => a.id === addonId)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addonId))
    } else {
      setSelectedAddons([...selectedAddons, { id: addonId, quantity: 1 }])
    }
  }

  const updateAddonQty = (addonId: string, delta: number) => {
    setSelectedAddons(selectedAddons.map(a =>
      a.id === addonId ? { ...a, quantity: Math.max(1, (a.quantity || 1) + delta) } : a
    ))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[3rem] w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[700px] relative"
      >
        {/* Upgrade Confirmation Popup */}
        <AnimatePresence>
          {showUpgradeConfirm && (
            <div className="absolute inset-0 z-[110] flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-12 rounded-[3rem] max-w-md w-full shadow-2xl"
              >
                <div className="h-20 w-20 bg-purple-100 text-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-10 w-10" />
                </div>
                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic mb-2">Upgrade & Invoice</h4>
                <p className="text-gray-500 font-medium mb-8">
                  You are about to authorize an immediate upgrade and issue an itemized invoice for <span className="text-gray-900 font-black">{org.name}</span>.
                </p>
                <div className="space-y-4">
                  <div className="text-left">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-2 block">Security Authorization</label>
                    <input
                      type="text"
                      placeholder='Type "Upgrade" to authorize'
                      value={upgradeConfirmText}
                      onChange={(e) => setUpgradeConfirmText(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all italic"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowUpgradeConfirm(false)}
                      className="flex-1 py-4 bg-gray-100 text-gray-500 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-gray-200 transition-all"
                    >
                      Wait, Back
                    </button>
                    <button
                      disabled={upgradeConfirmText !== "Upgrade"}
                      onClick={() => onUpgradeAndInvoice(selectedPlan?.name, selectedAddons)}
                      className={`flex-1 py-4 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all shadow-xl ${upgradeConfirmText === "Upgrade" ? 'bg-purple-600 text-white shadow-purple-500/25 hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed'}`}
                    >
                      Authorize & Send
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Editor Side */}
        <div className="flex-1 p-10 md:p-12 bg-white flex flex-col overflow-y-auto max-h-[90vh]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-500/30">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Organization Subscription Management</h3>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-0.5">Configuring: {org.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-xl transition-all">
              <XCircle className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          <div className="space-y-10">
            {/* Plan Selection */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-4 w-4 text-purple-600" />
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Global Base Plans</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan: any) => (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`p-6 rounded-[2rem] border-2 text-left transition-all ${selectedPlanId === plan.id ? 'border-purple-600 bg-purple-50/50 shadow-lg' : 'border-gray-100 hover:border-purple-200 bg-gray-50/30'}`}
                  >
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{plan.name}</div>
                    <div className="text-xl font-black text-gray-900 italic">₨ {Number(plan.price).toLocaleString()}<span className="text-[10px] lowercase font-bold text-gray-400">/{plan.interval === 'year' ? 'yr' : 'mo'}</span></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-on Stack */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-4 w-4 text-indigo-600" />
                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Available Add-ons</h4>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {addons.map((addon: any) => {
                  const isSelected = selectedAddons.find(a => a.id === addon.id)
                  const selectedData = selectedAddons.find(a => a.id === addon.id)
                  return (
                    <div
                      key={addon.id}
                      className={`p-5 rounded-2xl border transition-all flex items-center justify-between ${isSelected ? 'border-indigo-600 bg-indigo-50/30 shadow-sm' : 'border-gray-100 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleAddon(addon.id)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}
                        >
                          {isSelected ? <CheckCircle className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                        </button>
                        <div>
                          <div className="text-sm font-black text-gray-900 uppercase tracking-tight italic">{addon.name}</div>
                          <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">₨ {Number(addon.price).toLocaleString()} / {addon.interval === 'year' ? 'yr' : 'mo'}</div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-indigo-100 shadow-sm">
                          <button onClick={() => updateAddonQty(addon.id, -1)} className="p-1 hover:bg-gray-100 rounded-md transition-all text-indigo-600"><Minus className="h-3 w-3" /></button>
                          <span className="text-xs font-black text-gray-900 w-4 text-center">{selectedData.quantity || 1}</span>
                          <button onClick={() => updateAddonQty(addon.id, 1)} className="p-1 hover:bg-gray-100 rounded-md transition-all text-indigo-600"><Plus className="h-3 w-3" /></button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Side */}
        <div className="w-full md:w-[400px] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-12 flex flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32 blur-[80px]" />

          <div className="relative z-10 flex-1">
            <div className="text-[10px] font-black text-purple-300 uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
              <div className="h-4 w-4 rounded-full border border-purple-300 border-2 border-dashed animate-spin duration-3000" />
              Bill Virtualizer
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10">
                <div className="text-[9px] font-black text-purple-300 uppercase tracking-[0.2em] mb-4">Base Subscription</div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black italic uppercase">{selectedPlan?.name || 'No Plan Selected'}</span>
                  <span className="text-sm font-bold">₨ {planPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 min-h-[150px]">
                <div className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-4">Modular Service Stack</div>
                <div className="space-y-2">
                  {selectedAddons.length > 0 ? selectedAddons.map(sa => {
                    const add = addons.find((a: any) => a.id === sa.id)
                    return (
                      <div key={sa.id} className="flex justify-between items-center text-xs">
                        <span className="text-white/70">{add?.name} (x{sa.quantity || 1})</span>
                        <span className="font-bold">₨ {((add?.price || 0) * (sa.quantity || 1)).toLocaleString()}</span>
                      </div>
                    )
                  }) : <p className="text-white/30 italic text-xs">No extra modules configured</p>}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Calculated Total</span>
                    <span className="text-4xl font-black italic tracking-tighter">₨ {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-4 mt-8">
            <button
              onClick={() => setShowUpgradeConfirm(true)}
              className="w-full py-4 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4 text-purple-400" />
              Upgrade & Send Invoice
            </button>
            <button
              onClick={onClose}
              className="w-full py-5 bg-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-purple-600/50 hover:bg-purple-500 hover:scale-105 active:scale-95 transition-all text-white flex items-center justify-center gap-2"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function SecureDeleteModal({ target, onClose, onConfirm }: any) {
  const [typedName, setTypedName] = useState("")
  const isCorrect = typedName.toLowerCase() === (target?.name || "").toLowerCase()

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 shadow-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-red-50 rounded-2xl text-red-600">
            <XCircle className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Secure Deletion</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Permanent infrastructure removal</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-red-50/50 border border-red-100 rounded-3xl">
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              You are about to permanently destroy <span className="font-black text-red-600">"{target?.name}"</span>.
              This action will remove the service from all future billing cycles and catalogs.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Type name to confirm destruction</label>
            <input
              type="text"
              value={typedName}
              onChange={e => setTypedName(e.target.value)}
              className="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-2xl focus:ring-2 focus:ring-red-500 outline-none text-gray-900 font-black tracking-widest text-center transition-all"
              placeholder={target?.name}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={onClose}
              className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!isCorrect}
              onClick={() => onConfirm(target)}
              className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl ${isCorrect ? 'bg-red-600 text-white shadow-red-500/25 hover:bg-red-700 hover:scale-105' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              Destroy Service
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function ConfirmModal({ title, message, type, onConfirm, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl overflow-hidden relative"
      >
        <div className={`absolute top-0 left-0 w-full h-2 ${type === 'danger' ? 'bg-red-600' : 'bg-yellow-500'}`} />

        <div className="flex items-center gap-4 mb-6">
          <div className={`p-4 rounded-2xl ${type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'}`}>
            <AlertCircle className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">{title}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">System Authorization Required</p>
          </div>
        </div>

        <p className="text-gray-500 font-medium leading-relaxed mb-8">
          {message}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onClose}
            className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl text-white ${type === 'danger' ? 'bg-red-600 shadow-red-500/25 hover:bg-red-700' : 'bg-yellow-600 shadow-yellow-500/25 hover:bg-yellow-700'} hover:scale-105`}
          >
            Confirm Action
          </button>
        </div>
      </motion.div>
    </div>
  )
}
