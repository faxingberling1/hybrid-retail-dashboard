"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Search, Filter, Plus, Download, MoreVertical, 
  Users as UsersIcon, User, Mail, Phone, Building2, 
  Shield, CheckCircle, XCircle, Clock, Edit,
  Trash2, Eye, Key, ChevronRight, Calendar,
  TrendingUp, Tag, ExternalLink, MessageSquare,
  BarChart3, Lock, Globe, Smartphone, CreditCard,
  MapPin, Activity, Award, Bell, Send,
  ArrowLeft, ArrowRight, RefreshCw, UserPlus,
  MailCheck, PhoneCall, UserCheck, UserX
} from "lucide-react"

// Mock data
const organizations = [
  { id: "org-001", name: "FashionHub Retail", type: "Clothing" },
  { id: "org-002", name: "TechGadget Store", type: "Electronics" },
  { id: "org-003", name: "FreshMart Superstore", type: "Grocery" },
  { id: "org-004", name: "PharmaCare Pharmacy", type: "Pharmacy" },
  { id: "org-005", name: "HomeStyle Furniture", type: "Furniture" },
  { id: "org-006", name: "BookWorm Library", type: "Books" },
]

const mockUsers = [
  {
    id: "user-001",
    name: "Ahmed Khan",
    email: "ahmed@fashionhub.com",
    phone: "+92 300 1234567",
    role: "ADMIN",
    organization: "FashionHub Retail",
    organizationId: "org-001",
    status: "active",
    joinDate: "2023-12-15",
    lastLogin: "2 hours ago",
    loginCount: 142,
    permissions: ["manage_inventory", "view_reports", "manage_staff"],
    plan: "Enterprise",
    department: "Management",
    avatarColor: "bg-blue-500"
  },
  {
    id: "user-002",
    name: "Sara Ahmed",
    email: "sara@techgadget.com",
    phone: "+92 321 7654321",
    role: "USER",
    organization: "TechGadget Store",
    organizationId: "org-002",
    status: "active",
    joinDate: "2024-01-10",
    lastLogin: "1 day ago",
    loginCount: 67,
    permissions: ["view_inventory", "process_sales"],
    plan: "Pro",
    department: "Sales",
    avatarColor: "bg-purple-500"
  },
  {
    id: "user-003",
    name: "Ali Raza",
    email: "ali@freshmart.com",
    phone: "+92 345 9876543",
    role: "SUPER_ADMIN",
    organization: "FreshMart Superstore",
    organizationId: "org-003",
    status: "active",
    joinDate: "2023-11-20",
    lastLogin: "Just now",
    loginCount: 289,
    permissions: ["full_access"],
    plan: "Enterprise",
    department: "IT",
    avatarColor: "bg-green-500"
  },
  {
    id: "user-004",
    name: "Fatima Javed",
    email: "fatima@pharmacare.com",
    phone: "+92 333 1234567",
    role: "ADMIN",
    organization: "PharmaCare Pharmacy",
    organizationId: "org-004",
    status: "inactive",
    joinDate: "2024-01-05",
    lastLogin: "2 weeks ago",
    loginCount: 34,
    permissions: ["manage_inventory", "view_reports"],
    plan: "Business",
    department: "Operations",
    avatarColor: "bg-pink-500"
  },
  {
    id: "user-005",
    name: "Bilal Ahmed",
    email: "bilal@homestyle.com",
    phone: "+92 311 4567890",
    role: "USER",
    organization: "HomeStyle Furniture",
    organizationId: "org-005",
    status: "suspended",
    joinDate: "2023-12-28",
    lastLogin: "1 month ago",
    loginCount: 12,
    permissions: ["view_inventory"],
    plan: "Starter",
    department: "Warehouse",
    avatarColor: "bg-orange-500"
  },
  {
    id: "user-006",
    name: "Zainab Malik",
    email: "zainab@bookworm.com",
    phone: "+92 341 2345678",
    role: "ADMIN",
    organization: "BookWorm Library",
    organizationId: "org-006",
    status: "active",
    joinDate: "2024-01-15",
    lastLogin: "3 hours ago",
    loginCount: 89,
    permissions: ["manage_inventory", "view_reports", "manage_staff"],
    plan: "Business",
    department: "Management",
    avatarColor: "bg-indigo-500"
  },
  {
    id: "user-007",
    name: "Usman Khalid",
    email: "usman@fashionhub.com",
    phone: "+92 300 9876543",
    role: "USER",
    organization: "FashionHub Retail",
    organizationId: "org-001",
    status: "active",
    joinDate: "2024-01-20",
    lastLogin: "1 hour ago",
    loginCount: 45,
    permissions: ["process_sales", "view_inventory"],
    plan: "Enterprise",
    department: "Sales",
    avatarColor: "bg-teal-500"
  },
  {
    id: "user-008",
    name: "Ayesha Tariq",
    email: "ayesha@techgadget.com",
    phone: "+92 321 1234567",
    role: "USER",
    organization: "TechGadget Store",
    organizationId: "org-002",
    status: "pending",
    joinDate: "2024-02-01",
    lastLogin: "Never",
    loginCount: 0,
    permissions: [],
    plan: "Pro",
    department: "Customer Service",
    avatarColor: "bg-red-500"
  },
]

const stats = [
  { title: "Total Users", value: "1,248", change: "+12%", icon: <UsersIcon className="h-5 w-5" />, color: "bg-blue-100 text-blue-600" },
  { title: "Active Users", value: "1,142", change: "+8%", icon: <UserCheck className="h-5 w-5" />, color: "bg-green-100 text-green-600" },
  { title: "Admins", value: "248", change: "+15%", icon: <Shield className="h-5 w-5" />, color: "bg-purple-100 text-purple-600" },
  { title: "Pending Invites", value: "42", change: "-5%", icon: <Clock className="h-5 w-5" />, color: "bg-yellow-100 text-yellow-600" },
]

const roles = [
  { id: "super_admin", name: "Super Admin", description: "Full system access", color: "bg-red-100 text-red-800", icon: <Shield className="h-4 w-4" /> },
  { id: "admin", name: "Admin", description: "Organization management", color: "bg-purple-100 text-purple-800", icon: <Award className="h-4 w-4" /> },
  { id: "user", name: "User", description: "Standard access", color: "bg-blue-100 text-blue-800", icon: <User className="h-4 w-4" /> },
  { id: "viewer", name: "Viewer", description: "Read-only access", color: "bg-gray-100 text-gray-800", icon: <Eye className="h-4 w-4" /> },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedOrganization, setSelectedOrganization] = useState("all")
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [activeTab, setActiveTab] = useState("all") // all, active, inactive, pending

  // Filter and sort users
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.organization.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesOrg = selectedOrganization === "all" || user.organizationId === selectedOrganization
    const matchesTab = activeTab === "all" || user.status === activeTab
    
    return matchesSearch && matchesStatus && matchesRole && matchesOrg && matchesTab
  })

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    }
    if (sortBy === "joinDate") {
      return sortOrder === "asc"
        ? new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
        : new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
    }
    return 0
  })

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUsers = sortedUsers.slice(startIndex, endIndex)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      case "suspended": return "bg-red-100 text-red-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4" />
      case "inactive": return <Clock className="h-4 w-4" />
      case "suspended": return <XCircle className="h-4 w-4" />
      case "pending": return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN": return "bg-red-100 text-red-800"
      case "ADMIN": return "bg-purple-100 text-purple-800"
      case "USER": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewDetails = (user: any) => {
    setSelectedUser(user)
    setShowUserDetailsModal(true)
  }

  const handleInviteUser = () => {
    setShowInviteModal(true)
  }

  const handleSendWelcome = (user: any) => {
    alert(`Welcome email sent to ${user.email}`)
  }

  const handleResetPassword = (user: any) => {
    alert(`Password reset link sent to ${user.email}`)
  }

  const toggleUserStatus = (user: any) => {
    alert(`${user.status === 'active' ? 'Deactivating' : 'Activating'} user ${user.name}`)
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedStatus, selectedRole, selectedOrganization, activeTab])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">Manage all users across organizations</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button 
            onClick={handleInviteUser}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Users
          </button>
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
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
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{stat.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select 
              value={selectedOrganization}
              onChange={(e) => setSelectedOrganization(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Organizations</option>
              {organizations.map(org => (
                <option key={org.id} value={org.id}>{org.name}</option>
              ))}
            </select>
            
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
            
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Tabs */}
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "all" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
          >
            All Users
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "active" ? "bg-green-100 text-green-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
          >
            <div className="flex items-center">
              <UserCheck className="h-4 w-4 mr-2" />
              Active
            </div>
          </button>
          <button
            onClick={() => setActiveTab("inactive")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "inactive" ? "bg-gray-100 text-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
          >
            <div className="flex items-center">
              <UserX className="h-4 w-4 mr-2" />
              Inactive
            </div>
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "pending" ? "bg-yellow-100 text-yellow-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
          >
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Pending
            </div>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
            <p className="text-sm text-gray-600">{sortedUsers.length} users found</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    User
                    {sortBy === "name" && (
                      <ChevronRight className={`h-4 w-4 ml-1 transform ${sortOrder === "desc" ? "rotate-90" : "-rotate-90"}`} />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full ${user.avatarColor} flex items-center justify-center`}>
                        <span className="text-white font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400 flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.organization}</div>
                        <div className="text-xs text-gray-500">{user.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1">{user.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{user.lastLogin}</div>
                    <div className="text-xs text-gray-500">{user.loginCount} logins</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSendWelcome(user)}
                        className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                        title="Send Welcome"
                      >
                        <MailCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(user)}
                        className="p-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Reset Password"
                      >
                        <Key className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user)}
                        className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors"
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
              <span className="font-medium">{Math.min(endIndex, sortedUsers.length)}</span> of{' '}
              <span className="font-medium">{sortedUsers.length}</span> users
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                      currentPage === pageNum
                        ? 'text-white bg-purple-600 border border-purple-600'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowAddUserModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
                <p className="text-sm text-gray-500 mt-1">Create a new user account</p>
              </div>
              
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="+92 300 1234567"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Sales, Management, IT, etc."
                      />
                    </div>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization *
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option value="">Select Organization</option>
                        {organizations.map(org => (
                          <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role *
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option value="">Select Role</option>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Permissions
                      </label>
                      <div className="space-y-2">
                        {["View Inventory", "Manage Inventory", "Process Sales", "View Reports", "Manage Staff", "Full Access"].map((perm) => (
                          <label key={perm} className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 text-purple-600 rounded border-gray-300" />
                            <span className="ml-2 text-sm text-gray-700">{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Send Welcome Email
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-purple-600 rounded border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Send account details to user's email</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700">
                  Create User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetailsModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowUserDetailsModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-16 w-16 rounded-full ${selectedUser.avatarColor} flex items-center justify-center`}>
                      <span className="text-white text-xl font-bold">
                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                      <p className="text-purple-200">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 inline-flex items-center text-sm font-semibold rounded-full bg-white/20`}>
                      {getStatusIcon(selectedUser.status)}
                      <span className="ml-2">{selectedUser.status.toUpperCase()}</span>
                    </span>
                    <button onClick={() => setShowUserDetailsModal(false)} className="p-2 hover:bg-white/20 rounded-lg">
                      <ChevronRight className="h-5 w-5 rotate-90" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Basic Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500">Role</div>
                          <div className="flex items-center mt-1">
                            <span className={`px-2 py-1 text-xs font-semibold rounded ${getRoleColor(selectedUser.role)}`}>
                              {selectedUser.role.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Department</div>
                          <div className="text-sm font-medium mt-1">{selectedUser.department}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Join Date</div>
                          <div className="text-sm font-medium mt-1">{selectedUser.joinDate}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Plan</div>
                          <div className="text-sm font-medium mt-1">{selectedUser.plan}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Contact Information */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">Email</div>
                            <div className="text-sm text-gray-600">{selectedUser.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">Phone</div>
                            <div className="text-sm text-gray-600">{selectedUser.phone}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">Organization</div>
                            <div className="text-sm text-gray-600">{selectedUser.organization}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Permissions */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Permissions</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.permissions.map((perm: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {perm.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Activity & Actions */}
                  <div className="space-y-6">
                    {/* Activity Stats */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Activity</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Activity className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-700">Last Login</span>
                          </div>
                          <span className="text-sm font-medium">{selectedUser.lastLogin}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <BarChart3 className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-700">Total Logins</span>
                          </div>
                          <span className="text-sm font-medium">{selectedUser.loginCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm text-gray-700">Member Since</span>
                          </div>
                          <span className="text-sm font-medium">{selectedUser.joinDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h4>
                      <div className="space-y-2">
                        <button
                          onClick={() => handleSendWelcome(selectedUser)}
                          className="w-full flex items-center justify-between p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center">
                            <MailCheck className="h-4 w-4 text-green-600 mr-3" />
                            <span className="text-sm font-medium">Send Welcome Email</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(selectedUser)}
                          className="w-full flex items-center justify-between p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center">
                            <Key className="h-4 w-4 text-yellow-600 mr-3" />
                            <span className="text-sm font-medium">Reset Password</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(selectedUser)}
                          className="w-full flex items-center justify-between p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center">
                            {selectedUser.status === 'active' ? (
                              <UserX className="h-4 w-4 text-red-600 mr-3" />
                            ) : (
                              <UserCheck className="h-4 w-4 text-green-600 mr-3" />
                            )}
                            <span className="text-sm font-medium">
                              {selectedUser.status === 'active' ? 'Deactivate User' : 'Activate User'}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Danger Zone */}
                    <div className="border border-red-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-red-900 mb-3">Danger Zone</h4>
                      <button className="w-full py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete User Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                <div className="text-sm text-gray-600">
                  User ID: {selectedUser.id}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowUserDetailsModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit User
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Users Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50" onClick={() => setShowInviteModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-6 py-4 bg-white border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Invite Users</h3>
                <p className="text-sm text-gray-500 mt-1">Send invitation emails to new users</p>
              </div>
              
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Addresses
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter email addresses, one per line..."
                      defaultValue="john@example.com"
                    />
                    <p className="text-xs text-gray-500 mt-2">Separate multiple emails with commas or new lines</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organization
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="">Select Organization</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Role
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Message (Optional)
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Add a personal message to the invitation..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Send Invitations
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar (Visible when users are selected) */}
      <div className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-900">3 users selected</span>
          <select className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg">
            <option>Bulk Actions</option>
            <option>Activate</option>
            <option>Deactivate</option>
            <option>Change Role</option>
            <option>Send Email</option>
            <option>Export Selected</option>
          </select>
          <button className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}