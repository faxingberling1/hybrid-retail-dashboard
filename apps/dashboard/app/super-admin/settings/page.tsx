"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Settings, User, Shield, Bell, CreditCard, Globe,
  Database, Server, Key, Lock, Upload, Download,
  Mail, Phone, Building2, Users, Calendar,
  Palette, Moon, Sun, Eye, EyeOff, Save,
  RefreshCw, CheckCircle, XCircle, AlertCircle,
  ChevronRight, ChevronLeft, Plus, Trash2, Copy,
  ExternalLink, HelpCircle, Shield as ShieldIcon,
  Database as DatabaseIcon, Bell as BellIcon,
  CreditCard as CreditCardIcon, Globe as GlobeIcon,
  Users as UsersIcon, Palette as PaletteIcon,
  FileText, Zap, Cpu, HardDrive, Network,
  Wifi, ShieldCheck, UserCheck, MailCheck,
  Smartphone, Tablet, Monitor, Cloud,
  BellRing, Volume2, Clock, MapPin,
  CreditCard as CardIcon, Wallet, Receipt,
  Key as KeyIcon, Fingerprint, Smartphone as PhoneIcon,
  Globe as WorldIcon, Languages, Currency,
  Clock as TimeIcon, Calendar as CalendarIcon,
  FileBarChart, FileArchive, ShieldAlert,
  AlertTriangle, CheckCircle2, X
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  organization: string
  phone: string
  avatar: string
  bio: string
}

interface Organization {
  id: string
  name: string
  plan: string
  users: number
  storage: string
  createdAt: string
  billingEmail: string
}

interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeout: number
  passwordExpiry: number
  ipWhitelist: string[]
  loginNotifications: boolean
  failedLoginLockout: boolean
  maxLoginAttempts: number
}

interface NotificationPreferences {
  email: {
    marketing: boolean
    security: boolean
    updates: boolean
    reports: boolean
  }
  push: {
    transactions: boolean
    alerts: boolean
    updates: boolean
  }
  sms: {
    alerts: boolean
    otp: boolean
  }
}

interface ThemeSettings {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  fontSize: 'small' | 'medium' | 'large'
  density: 'comfortable' | 'compact'
  animations: boolean
}

interface BillingInfo {
  plan: string
  status: 'active' | 'past_due' | 'canceled'
  nextBillingDate: string
  paymentMethod: string
  billingCycle: 'monthly' | 'yearly'
}

interface Integration {
  id: string
  name: string
  type: 'payment' | 'shipping' | 'analytics' | 'communication'
  status: 'active' | 'inactive' | 'error'
  apiKey: string
  lastSynced: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'billing' | 'integrations' | 'advanced'>('general')
  const [isLoading, setIsLoading] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Mock data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'USR-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Administrator',
    organization: 'FashionHub Retail',
    phone: '+92 300 1234567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    bio: 'System administrator with full access rights.'
  })

  const [organization, setOrganization] = useState<Organization>({
    id: 'ORG-001',
    name: 'FashionHub Retail',
    plan: 'Enterprise',
    users: 42,
    storage: '24.5 GB / 100 GB',
    createdAt: '2023-01-15',
    billingEmail: 'billing@fashionhub.com'
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    ipWhitelist: ['192.168.1.0/24', '203.0.113.0/24'],
    loginNotifications: true,
    failedLoginLockout: true,
    maxLoginAttempts: 5
  })

  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email: {
      marketing: true,
      security: true,
      updates: true,
      reports: true
    },
    push: {
      transactions: true,
      alerts: true,
      updates: false
    },
    sms: {
      alerts: false,
      otp: true
    }
  })

  const [theme, setTheme] = useState<ThemeSettings>({
    mode: 'light',
    primaryColor: '#4F46E5',
    fontSize: 'medium',
    density: 'comfortable',
    animations: true
  })

  const [billing, setBilling] = useState<BillingInfo>({
    plan: 'Enterprise',
    status: 'active',
    nextBillingDate: '2024-02-15',
    paymentMethod: 'Visa **** 4242',
    billingCycle: 'monthly'
  })

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'INT-001',
      name: 'Stripe Payments',
      type: 'payment',
      status: 'active',
      apiKey: 'sk_live_***************',
      lastSynced: '2024-01-15 14:30:00'
    },
    {
      id: 'INT-002',
      name: 'JazzCash',
      type: 'payment',
      status: 'active',
      apiKey: 'jz_***************',
      lastSynced: '2024-01-15 14:25:00'
    },
    {
      id: 'INT-003',
      name: 'Google Analytics',
      type: 'analytics',
      status: 'active',
      apiKey: 'UA-***************',
      lastSynced: '2024-01-15 13:45:00'
    },
    {
      id: 'INT-004',
      name: 'SendGrid',
      type: 'communication',
      status: 'inactive',
      apiKey: 'SG.***************',
      lastSynced: '2024-01-10 09:15:00'
    }
  ])

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'integrations', label: 'Integrations', icon: Server },
    { id: 'advanced', label: 'Advanced', icon: Cpu }
  ]

  const themeModes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor }
  ]

  const primaryColors = [
    { id: 'purple', value: '#4F46E5', name: 'Purple' },
    { id: 'blue', value: '#3B82F6', name: 'Blue' },
    { id: 'green', value: '#10B981', name: 'Green' },
    { id: 'orange', value: '#F59E0B', name: 'Orange' },
    { id: 'red', value: '#EF4444', name: 'Red' },
    { id: 'pink', value: '#EC4899', name: 'Pink' }
  ]

  const sessionTimeouts = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 240, label: '4 hours' },
    { value: 0, label: 'Never (Not recommended)' }
  ]

  const passwordExpiryOptions = [
    { value: 30, label: '30 days' },
    { value: 60, label: '60 days' },
    { value: 90, label: '90 days' },
    { value: 180, label: '6 months' },
    { value: 365, label: '1 year' },
    { value: 0, label: 'Never' }
  ]

  const saveSettings = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setShowSaveSuccess(true)
      setTimeout(() => setShowSaveSuccess(false), 3000)
    }, 1000)
  }

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      alert('Settings reset to default (this is a demo)')
    }
  }

  const exportSettings = () => {
    const data = {
      userProfile,
      organization,
      security,
      notifications,
      theme,
      billing,
      integrations
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'settings-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const addIpAddress = () => {
    const ip = prompt('Enter IP address or CIDR (e.g., 192.168.1.0/24):')
    if (ip) {
      setSecurity(prev => ({
        ...prev,
        ipWhitelist: [...prev.ipWhitelist, ip]
      }))
    }
  }

  const removeIpAddress = (ip: string) => {
    setSecurity(prev => ({
      ...prev,
      ipWhitelist: prev.ipWhitelist.filter(i => i !== ip)
    }))
  }

  const regenerateApiKey = (integrationId: string) => {
    if (confirm('Are you sure you want to regenerate the API key? This will invalidate the current key.')) {
      setIntegrations(prev => prev.map(int => 
        int.id === integrationId 
          ? { ...int, apiKey: `new_key_${Math.random().toString(36).substr(2, 9)}` }
          : int
      ))
      alert('API key regenerated successfully')
    }
  }

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === integrationId 
        ? { ...int, status: int.status === 'active' ? 'inactive' : 'active' }
        : int
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'payment': return <CreditCard className="h-5 w-5" />
      case 'shipping': return <Truck className="h-5 w-5" />
      case 'analytics': return <BarChart3 className="h-5 w-5" />
      case 'communication': return <Mail className="h-5 w-5" />
      default: return <Server className="h-5 w-5" />
    }
  }

  // Add missing Truck icon import
  const Truck = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  )

  const BarChart3 = ({ className }: { className: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account, security, and preferences</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button 
            onClick={exportSettings}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Settings
          </button>
          <button 
            onClick={resetSettings}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Default
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200">
            <nav className="p-6 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    )}
                  </button>
                )
              })}
            </nav>

            {/* Organization Info */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{organization.name}</div>
                  <div className="text-sm text-gray-600">{organization.plan} Plan</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Users:</span>
                  <span className="font-medium">{organization.users}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage:</span>
                  <span className="font-medium">{organization.storage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">{new Date(organization.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {/* Success Message */}
            {showSaveSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="m-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Settings saved successfully!</span>
                </div>
                <button
                  onClick={() => setShowSaveSuccess(false)}
                  className="text-green-600 hover:text-green-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>
            )}

            <div className="p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-8">
                  {/* Profile Section */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                        <p className="text-sm text-gray-600">Update your personal details</p>
                      </div>
                      <User className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
                        <div className="mb-4 lg:mb-0">
                          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 flex items-center justify-center">
                            <User className="h-12 w-12 text-purple-600" />
                          </div>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={userProfile.name}
                              onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={userProfile.email}
                              onChange={(e) => setUserProfile(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={userProfile.phone}
                              onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Role
                            </label>
                            <input
                              type="text"
                              value={userProfile.role}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Bio
                            </label>
                            <textarea
                              value={userProfile.bio}
                              onChange={(e) => setUserProfile(prev => ({ ...prev, bio: e.target.value }))}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Theme Settings */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Theme & Appearance</h2>
                        <p className="text-sm text-gray-600">Customize the look and feel</p>
                      </div>
                      <Palette className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Theme Mode
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {themeModes.map((mode) => {
                            const Icon = mode.icon
                            return (
                              <button
                                key={mode.id}
                                onClick={() => setTheme(prev => ({ ...prev, mode: mode.id as any }))}
                                className={`p-4 border rounded-lg text-left transition-colors ${
                                  theme.mode === mode.id
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <Icon className="h-5 w-5 mb-2" />
                                <div className="font-medium">{mode.label}</div>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Primary Color
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                          {primaryColors.map((color) => (
                            <button
                              key={color.id}
                              onClick={() => setTheme(prev => ({ ...prev, primaryColor: color.value }))}
                              className={`p-3 border rounded-lg text-center ${
                                theme.primaryColor === color.value
                                  ? 'ring-2 ring-offset-2 ring-purple-500'
                                  : 'border-gray-200'
                              }`}
                            >
                              <div
                                className="h-8 w-8 rounded-full mx-auto mb-2"
                                style={{ backgroundColor: color.value }}
                              />
                              <div className="text-xs font-medium">{color.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Font Size
                          </label>
                          <select
                            value={theme.fontSize}
                            onChange={(e) => setTheme(prev => ({ ...prev, fontSize: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Density
                          </label>
                          <select
                            value={theme.density}
                            onChange={(e) => setTheme(prev => ({ ...prev, density: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="comfortable">Comfortable</option>
                            <option value="compact">Compact</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Animations</div>
                          <div className="text-sm text-gray-600">Enable smooth transitions and animations</div>
                        </div>
                        <button
                          onClick={() => setTheme(prev => ({ ...prev, animations: !prev.animations }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            theme.animations ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              theme.animations ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Regional Settings */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Regional Settings</h2>
                        <p className="text-sm text-gray-600">Language, currency, and timezone</p>
                      </div>
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                          <option>English (US)</option>
                          <option>English (UK)</option>
                          <option>Urdu</option>
                          <option>Arabic</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                          <option>PKR - Pakistani Rupee</option>
                          <option>USD - US Dollar</option>
                          <option>EUR - Euro</option>
                          <option>GBP - British Pound</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                          <option>Asia/Karachi (UTC+5)</option>
                          <option>Asia/Dubai (UTC+4)</option>
                          <option>America/New_York (UTC-5)</option>
                          <option>Europe/London (UTC+0)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  {/* Two-Factor Authentication */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <ShieldCheck className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Enable 2FA</div>
                          <div className="text-sm text-gray-600">Require a verification code when signing in</div>
                        </div>
                        <button
                          onClick={() => setSecurity(prev => ({ ...prev, twoFactorAuth: !prev.twoFactorAuth }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            security.twoFactorAuth ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {security.twoFactorAuth && (
                        <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                            <span className="text-green-800 font-medium">2FA is enabled</span>
                          </div>
                          <p className="text-sm text-green-700 mt-2">
                            You'll need to enter a verification code from your authenticator app when signing in.
                          </p>
                          <button className="mt-3 text-sm font-medium text-green-700 hover:text-green-800">
                            Manage authenticator apps →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Session Management */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout
                        </label>
                        <select
                          value={security.sessionTimeout}
                          onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {sessionTimeouts.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-2">
                          Automatically log out after period of inactivity
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Expiry
                        </label>
                        <select
                          value={security.passwordExpiry}
                          onChange={(e) => setSecurity(prev => ({ ...prev, passwordExpiry: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {passwordExpiryOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-2">
                          Require password change after specified days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* IP Whitelist */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">IP Whitelist</h3>
                        <p className="text-sm text-gray-600">Restrict access to specific IP addresses</p>
                      </div>
                      <button
                        onClick={addIpAddress}
                        className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add IP
                      </button>
                    </div>

                    <div className="space-y-2">
                      {security.ipWhitelist.map((ip, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Network className="h-4 w-4 text-gray-400 mr-3" />
                            <span className="font-mono text-sm">{ip}</span>
                          </div>
                          <button
                            onClick={() => removeIpAddress(ip)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      {security.ipWhitelist.length === 0 && (
                        <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                          No IP addresses whitelisted. Click "Add IP" to add one.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Login Security */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Security</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Login Notifications</div>
                          <div className="text-sm text-gray-600">Get notified when someone logs into your account</div>
                        </div>
                        <button
                          onClick={() => setSecurity(prev => ({ ...prev, loginNotifications: !prev.loginNotifications }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            security.loginNotifications ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              security.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">Failed Login Lockout</div>
                          <div className="text-sm text-gray-600">Temporarily lock account after failed attempts</div>
                        </div>
                        <button
                          onClick={() => setSecurity(prev => ({ ...prev, failedLoginLockout: !prev.failedLoginLockout }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            security.failedLoginLockout ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              security.failedLoginLockout ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {security.failedLoginLockout && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Login Attempts
                          </label>
                          <input
                            type="number"
                            value={security.maxLoginAttempts}
                            onChange={(e) => setSecurity(prev => ({ ...prev, maxLoginAttempts: Number(e.target.value) }))}
                            min="1"
                            max="10"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Password Management */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Management</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="p-4 border border-gray-200 rounded-lg text-left hover:border-purple-300 transition-colors">
                        <Key className="h-5 w-5 text-purple-600 mb-2" />
                        <div className="font-medium text-gray-900">Change Password</div>
                        <div className="text-sm text-gray-600 mt-1">Update your account password</div>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg text-left hover:border-purple-300 transition-colors">
                        <Fingerprint className="h-5 w-5 text-purple-600 mb-2" />
                        <div className="font-medium text-gray-900">Biometric Login</div>
                        <div className="text-sm text-gray-600 mt-1">Set up fingerprint or face ID</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  {/* Email Notifications */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Email Notifications</h2>
                        <p className="text-sm text-gray-600">Manage what emails you receive</p>
                      </div>
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-3">
                      {Object.entries(notifications.email).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">
                              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                            </div>
                            <div className="text-sm text-gray-600">
                              {key === 'marketing' && 'Product updates and promotional offers'}
                              {key === 'security' && 'Security alerts and login notifications'}
                              {key === 'updates' && 'System updates and maintenance notices'}
                              {key === 'reports' && 'Weekly and monthly reports'}
                            </div>
                          </div>
                          <button
                            onClick={() => setNotifications(prev => ({
                              ...prev,
                              email: { ...prev.email, [key]: !value }
                            }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-purple-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Push Notifications</h2>
                        <p className="text-sm text-gray-600">Control push notifications on your devices</p>
                      </div>
                      <BellRing className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-3">
                      {Object.entries(notifications.push).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">
                              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                            </div>
                            <div className="text-sm text-gray-600">
                              {key === 'transactions' && 'Real-time transaction notifications'}
                              {key === 'alerts' && 'Important system alerts'}
                              {key === 'updates' && 'App updates and announcements'}
                            </div>
                          </div>
                          <button
                            onClick={() => setNotifications(prev => ({
                              ...prev,
                              push: { ...prev.push, [key]: !value }
                            }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-purple-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SMS Notifications */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">SMS Notifications</h2>
                        <p className="text-sm text-gray-600">Manage text message notifications</p>
                      </div>
                      <Smartphone className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-3">
                      {Object.entries(notifications.sms).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">
                              {key.toUpperCase()} Notifications
                            </div>
                            <div className="text-sm text-gray-600">
                              {key === 'alerts' && 'Critical alerts via SMS'}
                              {key === 'otp' && 'One-time passwords for authentication'}
                            </div>
                          </div>
                          <button
                            onClick={() => setNotifications(prev => ({
                              ...prev,
                              sms: { ...prev.sms, [key]: !value }
                            }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-purple-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notification Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quiet Hours
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="time"
                            defaultValue="22:00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                          <input
                            type="time"
                            defaultValue="07:00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">No notifications during these hours</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notification Sound
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                          <option>Default</option>
                          <option>Chime</option>
                          <option>Bell</option>
                          <option>None</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Settings */}
              {activeTab === 'billing' && (
                <div className="space-y-8">
                  {/* Current Plan */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
                        <p className="text-sm text-gray-600">Manage your subscription and billing</p>
                      </div>
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div>
                          <div className="text-xl font-bold">{billing.plan} Plan</div>
                          <div className="text-purple-200 mt-1">
                            {billing.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} billing
                          </div>
                          <div className="flex items-center mt-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              billing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {billing.status.replace('_', ' ').toUpperCase()}
                            </div>
                            <div className="ml-4 text-sm">
                              Next billing: {new Date(billing.nextBillingDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 lg:mt-0">
                          <button className="px-6 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                            Upgrade Plan
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="text-sm text-gray-600">Monthly Price</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">₨ 49,999</div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="text-sm text-gray-600">Users Included</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">50</div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="text-sm text-gray-600">Storage</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">100 GB</div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4">
                            <CardIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{billing.paymentMethod}</div>
                            <div className="text-sm text-gray-600">Primary payment method</div>
                          </div>
                        </div>
                        <button className="text-purple-600 hover:text-purple-800 font-medium">
                          Change
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Billing History */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
                      <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        View All
                      </button>
                    </div>

                    <div className="space-y-3">
                      {[
                        { date: '2024-01-15', amount: '₨ 49,999', status: 'Paid', invoice: 'INV-001' },
                        { date: '2023-12-15', amount: '₨ 49,999', status: 'Paid', invoice: 'INV-002' },
                        { date: '2023-11-15', amount: '₨ 49,999', status: 'Paid', invoice: 'INV-003' },
                      ].map((invoice, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{invoice.invoice}</div>
                            <div className="text-sm text-gray-600">{new Date(invoice.date).toLocaleDateString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">{invoice.amount}</div>
                            <div className={`text-sm ${
                              invoice.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {invoice.status}
                            </div>
                          </div>
                          <button className="text-purple-600 hover:text-purple-800">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Billing Actions */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="p-4 border border-gray-200 rounded-lg text-left hover:border-purple-300 transition-colors">
                        <Receipt className="h-5 w-5 text-purple-600 mb-2" />
                        <div className="font-medium text-gray-900">Update Billing Info</div>
                        <div className="text-sm text-gray-600 mt-1">Change billing address and details</div>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg text-left hover:border-purple-300 transition-colors">
                        <FileBarChart className="h-5 w-5 text-purple-600 mb-2" />
                        <div className="font-medium text-gray-900">Usage Reports</div>
                        <div className="text-sm text-gray-600 mt-1">View resource usage and costs</div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations Settings */}
              {activeTab === 'integrations' && (
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Connected Services</h2>
                        <p className="text-sm text-gray-600">Manage your third-party integrations</p>
                      </div>
                      <button className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Integration
                      </button>
                    </div>

                    <div className="space-y-4">
                      {integrations.map((integration) => (
                        <div key={integration.id} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {getIntegrationIcon(integration.type)}
                              <div>
                                <div className="font-medium text-gray-900">{integration.name}</div>
                                <div className="text-sm text-gray-600">
                                  {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)} Integration
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(integration.status)}`}>
                                {integration.status.toUpperCase()}
                              </span>
                              <button
                                onClick={() => toggleIntegration(integration.id)}
                                className="text-sm text-gray-600 hover:text-gray-900"
                              >
                                {integration.status === 'active' ? 'Disable' : 'Enable'}
                              </button>
                            </div>
                          </div>

                          <div className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  API Key
                                </label>
                                <div className="flex items-center">
                                  <input
                                    type={showApiKey ? 'text' : 'password'}
                                    value={integration.apiKey}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-l-lg text-sm bg-gray-50 font-mono"
                                  />
                                  <button
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100"
                                  >
                                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Last Synced
                                </label>
                                <div className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50">
                                  {integration.lastSynced}
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => regenerateApiKey(integration.id)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                Regenerate Key
                              </button>
                              <button
                                onClick={() => navigator.clipboard.writeText(integration.apiKey)}
                                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                              >
                                Copy Key
                              </button>
                              <button className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available Integrations */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Integrations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { name: 'EasyPaisa', type: 'payment', description: 'Mobile payments integration' },
                        { name: 'Telenor', type: 'payment', description: 'Mobile banking integration' },
                        { name: 'FedEx', type: 'shipping', description: 'Shipping and logistics' },
                        { name: 'DHL', type: 'shipping', description: 'Express shipping services' },
                        { name: 'Mailchimp', type: 'communication', description: 'Email marketing platform' },
                        { name: 'Twilio', type: 'communication', description: 'SMS and voice services' },
                      ].map((service, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="h-10 w-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                              <Server className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{service.name}</div>
                              <div className="text-xs text-gray-500">{service.type}</div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                          <button className="w-full px-3 py-2 text-sm font-medium text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                            Connect
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Advanced Settings */}
              {activeTab === 'advanced' && (
                <div className="space-y-8">
                  {/* Data Management */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Data Management</h2>
                        <p className="text-sm text-gray-600">Manage your data and backups</p>
                      </div>
                      <Database className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">Auto Backup</div>
                            <div className="text-sm text-gray-600">Daily automatic backups</div>
                          </div>
                          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600">
                            <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                          </button>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          Next backup: Today at 02:00 AM
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="p-4 border border-gray-200 rounded-lg text-left hover:border-purple-300 transition-colors">
                          <Download className="h-5 w-5 text-purple-600 mb-2" />
                          <div className="font-medium text-gray-900">Export Data</div>
                          <div className="text-sm text-gray-600 mt-1">Download all your data</div>
                        </button>

                        <button className="p-4 border border-gray-200 rounded-lg text-left hover:border-purple-300 transition-colors">
                          <Upload className="h-5 w-5 text-purple-600 mb-2" />
                          <div className="font-medium text-gray-900">Import Data</div>
                          <div className="text-sm text-gray-600 mt-1">Upload data from backup</div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* API Access */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">API Access</h3>
                    <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-medium text-gray-900">API Access Token</div>
                            <div className="text-sm text-gray-600">For programmatic access to your data</div>
                          </div>
                          <button className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50">
                            Generate New
                          </button>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="password"
                            value="sk_live_***************"
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-l-lg text-sm bg-gray-50 font-mono"
                          />
                          <button className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100">
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          This token grants full access to your account. Keep it secure.
                        </div>
                      </div>

                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="font-medium text-gray-900 mb-2">API Usage</div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Requests Today</span>
                            <span className="font-medium">1,248 / 10,000</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '12.5%' }} />
                          </div>
                          <div className="text-xs text-gray-500">
                            Reset at midnight
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Dashboard Version</span>
                          <span className="text-sm font-medium">v2.1.4</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">API Version</span>
                          <span className="text-sm font-medium">v3.0.1</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Database Version</span>
                          <span className="text-sm font-medium">PostgreSQL 14.6</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Last Updated</span>
                          <span className="text-sm font-medium">2024-01-15</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">System Uptime</span>
                          <span className="text-sm font-medium">99.9%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Danger Zone</h3>
                        <p className="text-sm text-gray-600">Irreversible actions</p>
                      </div>
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full p-4 border border-red-200 bg-red-50 rounded-lg text-left hover:bg-red-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-red-900">Delete Account</div>
                            <div className="text-sm text-red-700 mt-1">
                              Permanently delete your account and all data
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-red-600" />
                        </div>
                      </button>

                      <button className="w-full p-4 border border-yellow-200 bg-yellow-50 rounded-lg text-left hover:bg-yellow-100 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-yellow-900">Reset All Settings</div>
                            <div className="text-sm text-yellow-700 mt-1">
                              Reset all settings to factory defaults
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-yellow-600" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              {activeTab !== 'advanced' && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-end">
                    <button
                      onClick={saveSettings}
                      disabled={isLoading}
                      className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.
                </p>
                
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-sm text-red-700">
                    <strong>Warning:</strong> This will immediately delete:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>All user data and preferences</li>
                      <li>Organization data and settings</li>
                      <li>Transaction history and logs</li>
                      <li>API keys and integrations</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type "DELETE" to confirm
                  </label>
                  <input
                    type="text"
                    placeholder="DELETE"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert('Account deletion requested (this is a demo)')
                    setShowDeleteModal(false)
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>Settings last updated: {new Date().toLocaleString()}</p>
        <p className="mt-1">Need help? Contact support@example.com</p>
      </div>
    </div>
  )
}