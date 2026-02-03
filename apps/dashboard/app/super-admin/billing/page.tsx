"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Search, Filter, Plus, Download, MoreVertical, 
  DollarSign, Calendar, CheckCircle, XCircle, Clock,
  Send, Eye, FileText, CreditCard, Receipt,
  TrendingUp, TrendingDown, RefreshCw, Bell,
  Building2, Users, ChevronRight, ExternalLink,
  Mail, MessageSquare, AlertCircle, DownloadCloud,
  ShoppingBag, Package, Printer, BarChart3, Monitor,
  Smartphone, Tag, Trash2, Edit, PrinterIcon,
  History, ArrowLeft, ArrowRight, Zap,
  Calculator, Briefcase, Shield, Wifi,
  Check, X, Minus, Plus as PlusIcon
} from "lucide-react"

// Add-ons configuration
const availableAddons = [
  {
    id: "addon-1",
    name: "Extra Devices",
    description: "Additional devices for your team",
    price: 1500,
    period: "per device/month",
    icon: <Smartphone className="h-5 w-5" />,
    category: "devices"
  },
  {
    id: "addon-2",
    name: "SMS Receipts",
    description: "Send receipts via SMS to customers",
    price: 1000,
    period: "per month",
    icon: <MessageSquare className="h-5 w-5" />,
    category: "communication"
  },
  {
    id: "addon-3",
    name: "Online BI Reports",
    description: "Advanced business intelligence reports",
    price: 3000,
    period: "per month",
    icon: <BarChart3 className="h-5 w-5" />,
    category: "analytics"
  },
  {
    id: "addon-4",
    name: "On-site Training",
    description: "Professional training at your location",
    price: 10000,
    period: "one-time",
    icon: <Briefcase className="h-5 w-5" />,
    category: "services"
  },
  {
    id: "addon-5",
    name: "Hardware Bundle",
    description: "POS printer, scanner, and tablet",
    price: 60000,
    period: "one-time",
    icon: <Package className="h-5 w-5" />,
    category: "hardware"
  },
  {
    id: "addon-6",
    name: "24/7 Support",
    description: "Round-the-clock priority support",
    price: 5000,
    period: "per month",
    icon: <Shield className="h-5 w-5" />,
    category: "support"
  },
  {
    id: "addon-7",
    name: "Cloud Backup",
    description: "Automatic daily cloud backups",
    price: 2000,
    period: "per month",
    icon: <DownloadCloud className="h-5 w-5" />,
    category: "security"
  },
  {
    id: "addon-8",
    name: "Multi-store Sync",
    description: "Real-time sync across multiple stores",
    price: 4000,
    period: "per month",
    icon: <Wifi className="h-5 w-5" />,
    category: "features"
  }
]

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
  { name: "Bank Transfer", count: 42, percentage: 60 },
  { name: "Credit Card", count: 18, percentage: 25 },
  { name: "JazzCash", count: 6, percentage: 8 },
  { name: "Easypaisa", count: 4, percentage: 5 },
  { name: "Other", count: 2, percentage: 2 },
]

export default function BillingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [showSendReminderModal, setShowSendReminderModal] = useState(false)
  const [showPaymentDetailsModal, setShowPaymentDetailsModal] = useState(false)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showAddonModal, setShowAddonModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null)
  const [reminderType, setReminderType] = useState("email")
  const [reminderMessage, setReminderMessage] = useState("")
  const [activeTab, setActiveTab] = useState("invoices") // invoices, organizations, addons
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "overdue": return "bg-red-100 text-red-800"
      case "upcoming": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-4 w-4" />
      case "pending": return <Clock className="h-4 w-4" />
      case "overdue": return <XCircle className="h-4 w-4" />
      case "upcoming": return <Calendar className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredBilling = billingHistory.filter(item => {
    const matchesSearch = item.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.invoiceId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    return matchesSearch && matchesStatus
  })

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
    setReminderMessage(`Dear ${invoice.organization},\n\nThis is a reminder that your invoice ${invoice.invoiceId} for amount ${invoice.formattedAmount} is due on ${invoice.dueDate}.\n\nPlease make the payment at your earliest convenience.\n\nBest regards,\nHybridPOS Team`)
    setShowSendReminderModal(true)
  }

  const handleManageAddons = (organization: any) => {
    setSelectedOrganization(organization)
    setShowAddonModal(true)
  }

  const sendReminder = () => {
    // In a real app, this would call an API
    alert(`Reminder sent to ${selectedInvoice?.organization} via ${reminderType}`)
    setShowSendReminderModal(false)
  }

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const calculateAddonTotal = (addons: any[]) => {
    return addons.reduce((total, addon) => {
      const addonConfig = availableAddons.find(a => a.id === addon.id)
      return total + (addonConfig?.price || 0) * addon.quantity
    }, 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount).replace('PKR', '₨')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600 mt-2">Manage organization billing, add-ons, payments, and send reminders</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Generate Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {billingStats.map((stat, index) => (
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
        <div className={`flex items-center ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {stat.change.startsWith('+') ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          <span className="text-sm font-medium">{stat.change}</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
      <p className="text-gray-600 text-sm">{stat.title}</p>
    </motion.div>
  ))}
</div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1">
        <nav className="flex space-x-1">
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "invoices" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
          >
            <div className="flex items-center">
              <Receipt className="h-4 w-4 mr-2" />
              Invoices
            </div>
          </button>
          <button
            onClick={() => setActiveTab("organizations")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "organizations" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
          >
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Organizations
            </div>
          </button>
          <button
            onClick={() => setActiveTab("addons")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "addons" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
          >
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Add-ons
            </div>
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "reports" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
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
                  {filteredBilling.length} invoices found
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
                    <th className="px6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBilling.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                            <Receipt className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.invoiceId}</div>
                            <div className="text-sm text-gray-500">{item.period}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.organization}</div>
                          <div className="text-xs text-gray-500">{item.organizationId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{item.formattedAmount}</div>
                        <div className="text-xs text-gray-500">
                          {item.breakdown.addons.length > 0 
                            ? `Includes ${item.breakdown.addons.length} add-ons`
                            : 'Base plan only'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          {item.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {item.dueDate}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1">{item.status}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(item)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleViewFullInvoice(item)}
                            className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                            title="View Full Invoice"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          {item.status !== 'paid' && (
                            <button
                              onClick={() => handleSendReminder(item)}
                              className="p-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Send Reminder"
                            >
                              <Bell className="h-4 w-4" />
                            </button>
                          )}
                          {item.receiptUrl && (
                            <button
                              onClick={() => window.open(item.receiptUrl, '_blank')}
                              className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                              title="Download Receipt"
                            >
                              <DownloadCloud className="h-4 w-4" />
                            </button>
                          )}
                          <button className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
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
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Organization Billing Plans</h2>
                <p className="text-gray-600 text-sm">View and manage organization subscriptions and add-ons</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100">
                Export Plans
              </button>
            </div>

            <div className="space-y-4">
              {organizations.map((org) => {
                const addonTotal = calculateAddonTotal(org.addons)
                const totalAmount = org.basePrice + addonTotal
                
                return (
                  <div key={org.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start">
                        <div className="h-12 w-12 flex-shrink-0 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900">{org.name}</h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                              {org.plan} Plan
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              org.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {org.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{formatCurrency(totalAmount)}</div>
                        <div className="text-sm text-gray-500">Monthly total</div>
                      </div>
                    </div>

                    {/* Plan Details */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Base Plan</span>
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(org.basePrice)}</span>
                      </div>
                      {org.addons.length > 0 ? (
                        <>
                          <div className="text-sm font-medium text-gray-700 mb-2">Active Add-ons</div>
                          <div className="space-y-2">
                            {org.addons.map((addon, index) => {
                              const addonConfig = availableAddons.find(a => a.id === addon.id)
                              return addonConfig ? (
                                <div key={index} className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="h-6 w-6 flex-shrink-0 bg-purple-100 rounded flex items-center justify-center mr-2">
                                      {addonConfig.icon}
                                    </div>
                                    <span className="text-sm text-gray-600">
                                      {addonConfig.name} {addon.quantity > 1 ? `× ${addon.quantity}` : ''}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {formatCurrency(addonConfig.price * addon.quantity)}
                                  </span>
                                </div>
                              ) : null
                            })}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">No add-ons active</div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Next billing:</span> Feb 15, 2024
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleManageAddons(org)}
                          className="px-3 py-1.5 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100"
                        >
                          Manage Add-ons
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                          View History
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add-ons Tab */}
      {activeTab === "addons" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Available Add-ons</h2>
                <p className="text-gray-600 text-sm">Additional features and services for organizations</p>
              </div>
              <div className="flex items-center space-x-3">
                <select className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>All Categories</option>
                  <option>Devices</option>
                  <option>Communication</option>
                  <option>Analytics</option>
                  <option>Services</option>
                  <option>Hardware</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableAddons.map((addon) => (
                <div key={addon.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                      {addon.icon}
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {addon.category}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{addon.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{addon.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{formatCurrency(addon.price)}</div>
                      <div className="text-xs text-gray-500">{addon.period}</div>
                    </div>
                  </div>
                  
                  <button className="w-full py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                    View Details
                  </button>
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

            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Add-on Revenue Trend</h3>
                <select className="px-3 py-1.5 text-sm bg-gray-100 border border-gray-300 rounded-lg">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                  <option>All Time</option>
                </select>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Revenue chart will appear here</p>
                  <p className="text-sm">(Interactive chart implementation)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Reminder Modal */}
      {showSendReminderModal && selectedInvoice && (
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
                    <div className="text-sm font-medium text-gray-900">{selectedInvoice.organization}</div>
                    <span className="text-sm font-semibold text-gray-900">{selectedInvoice.formattedAmount}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Invoice: {selectedInvoice.invoiceId} • Due: {selectedInvoice.dueDate}
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
                        className={`p-3 border rounded-lg flex items-center justify-center ${
                          reminderType === "email" 
                            ? "border-purple-500 bg-purple-50" 
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <Mail className="h-5 w-5 mr-2" />
                        <span>Email</span>
                      </button>
                      <button
                        onClick={() => setReminderType("sms")}
                        className={`p-3 border rounded-lg flex items-center justify-center ${
                          reminderType === "sms" 
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
      )}

      {/* Payment Details Modal */}
      {showPaymentDetailsModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowPaymentDetailsModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                    <p className="text-sm text-gray-500">{selectedInvoice.invoiceId}</p>
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
                      <h4 className="font-medium text-gray-900">{selectedInvoice.organization}</h4>
                      <p className="text-sm text-gray-500">{selectedInvoice.organizationId}</p>
                    </div>
                  </div>
                  
                  {/* Invoice Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Amount</div>
                        <div className="text-lg font-semibold text-gray-900">{selectedInvoice.formattedAmount}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Plan</div>
                        <div className="text-sm font-medium">{selectedInvoice.plan}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Add-ons Breakdown</div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Base Plan</span>
                          <span className="text-sm font-medium">{formatCurrency(selectedInvoice.breakdown.basePlan)}</span>
                        </div>
                        {selectedInvoice.breakdown.addons.map((addon: any, index: number) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-sm text-gray-600">{addon.name} {addon.quantity > 1 ? `× ${addon.quantity}` : ''}</span>
                            <span className="text-sm font-medium">{formatCurrency(addon.price * addon.quantity)}</span>
                          </div>
                        ))}
                        <div className="pt-2 border-t">
                          <div className="flex justify-between font-semibold">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">{selectedInvoice.formattedAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  {selectedInvoice.status !== 'paid' && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Actions Required</h4>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleSendReminder(selectedInvoice)}
                          className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 flex items-center"
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          Send Reminder
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                          Mark as Paid
                        </button>
                      </div>
                    </div>
                  )}
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
      )}

      {/* Full Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowInvoiceModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Invoice Header */}
              <div className="px-8 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">INVOICE</h2>
                    <p className="text-purple-200">{selectedInvoice.invoiceId}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{selectedInvoice.formattedAmount}</div>
                    <div className="text-purple-200">Due: {selectedInvoice.dueDate}</div>
                  </div>
                </div>
              </div>
              
              <div className="px-8 py-6">
                {/* Company & Client Info */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center mr-3 shadow">
                        <Building2 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">HybridPOS</h3>
                        <p className="text-sm text-gray-600">Retail Management System</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>123 Business Street, Karachi</p>
                      <p>contact@hybridpos.pk</p>
                      <p>+92 300 123 4567</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Bill To</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-900">{selectedInvoice.organization}</p>
                      <p>Account: {selectedInvoice.organizationId}</p>
                      <p>{selectedInvoice.plan} Plan</p>
                      <p>Period: {selectedInvoice.period}</p>
                    </div>
                  </div>
                </div>
                
                {/* Invoice Items */}
                <div className="mb-8">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Quantity</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Unit Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {/* Base Plan */}
                      <tr>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{selectedInvoice.plan} Plan</div>
                          <div className="text-sm text-gray-600">Monthly subscription</div>
                        </td>
                        <td className="px-4 py-3 text-gray-900">1</td>
                        <td className="px-4 py-3 text-gray-900">{formatCurrency(selectedInvoice.breakdown.basePlan)}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(selectedInvoice.breakdown.basePlan)}</td>
                      </tr>
                      
                      {/* Add-ons */}
                      {selectedInvoice.breakdown.addons.map((addon: any, index: number) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{addon.name}</div>
                            <div className="text-sm text-gray-600">Add-on service</div>
                          </td>
                          <td className="px-4 py-3 text-gray-900">{addon.quantity}</td>
                          <td className="px-4 py-3 text-gray-900">{formatCurrency(addon.price)}</td>
                          <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(addon.price * addon.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatCurrency(selectedInvoice.amount)}</span>
                      </div>
                      {selectedInvoice.breakdown.discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Discount</span>
                          <span className="font-medium text-green-600">-{formatCurrency(selectedInvoice.breakdown.discount)}</span>
                        </div>
                      )}
                      {selectedInvoice.breakdown.tax > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-medium">{formatCurrency(selectedInvoice.breakdown.tax)}</span>
                        </div>
                      )}
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total</span>
                          <span>{selectedInvoice.formattedAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment Status */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Payment Status</div>
                      <div className="text-sm text-gray-600">
                        {selectedInvoice.status === 'paid' 
                          ? `Paid on ${selectedInvoice.paymentDate} via ${selectedInvoice.paymentMethod}`
                          : `Due on ${selectedInvoice.dueDate}`
                        }
                      </div>
                    </div>
                    <span className={`px-4 py-2 inline-flex items-center text-sm font-semibold rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                      {getStatusIcon(selectedInvoice.status)}
                      <span className="ml-2">{selectedInvoice.status.toUpperCase()}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Footer Actions */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Invoice generated on: Jan 1, 2024
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                    <PrinterIcon className="h-4 w-4 mr-2" />
                    Print
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 flex items-center">
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
      )}

      {/* Manage Add-ons Modal */}
      {showAddonModal && selectedOrganization && (
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
                        Current Total: {formatCurrency(selectedOrganization.basePrice + calculateAddonTotal(selectedOrganization.addons))}
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
                      {selectedOrganization.addons.length > 0 ? (
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
                                  <button className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="px-2 py-1 text-sm font-medium bg-gray-100 rounded">
                                    {addon.quantity}
                                  </span>
                                  <button className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded">
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
                        const isActive = selectedOrganization.addons.some((a: any) => a.id === addon.id)
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
                                <button className="px-3 py-1 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100">
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
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}