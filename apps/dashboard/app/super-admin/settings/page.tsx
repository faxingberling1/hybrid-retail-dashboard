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
  AlertTriangle, CheckCircle2, X,
  Bug, Search, Filter, BarChart
} from "lucide-react"

// Import all components
import ProfileSection from "@/components/ui/general-settings/profile-section"
import ThemeSection from "@/components/ui/general-settings/theme-section"
import RegionalSection from "@/components/ui/general-settings/regional-section"
import {
  TwoFactorSection,
  SessionSection,
  IpWhitelistSection,
  LoginSecuritySection,
  PasswordManagementSection,
  SecurityAuditSection
} from "@/components/ui/security-settings"
import {
  EmailNotificationsSection,
  PushNotificationsSection,
  SmsNotificationsSection,
  NotificationPreferencesSection,
  NotificationChannelsSection,
  NotificationTestSection
} from "@/components/ui/notifications-settings"
import {
  CurrentPlanSection,
  PaymentMethodSection,
  BillingHistorySection,
  UsageMetricsSection,
  BillingActionsSection,
  PlanComparisonSection
} from "@/components/ui/billing-settings"
import {
  IntegrationsSection,
  Integration,
  AvailableIntegration
} from "@/components/ui/integrations-settings"
import {
  AdvancedSection,
  LogEntry,
  DebugTool,
  DangerZoneAction
} from "@/components/ui/advanced-settings"

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
    },
    {
      id: 'INT-005',
      name: 'FedEx',
      type: 'shipping',
      status: 'active',
      apiKey: 'fedex_***************',
      lastSynced: '2024-01-16 10:30:00'
    },
    {
      id: 'INT-006',
      name: 'Mailchimp',
      type: 'communication',
      status: 'error',
      apiKey: 'mc_***************',
      lastSynced: '2024-01-14 16:45:00'
    }
  ])

  const [availableIntegrations] = useState<AvailableIntegration[]>([
    {
      id: 'EASY-001',
      name: 'EasyPaisa',
      type: 'payment',
      description: 'Mobile payments integration for Pakistani users',
      category: 'Payment Gateway',
      isPopular: true
    },
    {
      id: 'TEL-001',
      name: 'Telenor',
      type: 'payment',
      description: 'Mobile banking integration',
      category: 'Payment Gateway'
    },
    {
      id: 'FED-001',
      name: 'FedEx',
      type: 'shipping',
      description: 'Shipping and logistics integration',
      category: 'Shipping',
      isPopular: true
    },
    {
      id: 'DHL-001',
      name: 'DHL',
      type: 'shipping',
      description: 'Express shipping services',
      category: 'Shipping'
    },
    {
      id: 'MAIL-001',
      name: 'Mailchimp',
      type: 'communication',
      description: 'Email marketing platform',
      category: 'Marketing'
    },
    {
      id: 'TWIL-001',
      name: 'Twilio',
      type: 'communication',
      description: 'SMS and voice services',
      category: 'Communication',
      isNew: true
    },
    {
      id: 'GOOG-001',
      name: 'Google Drive',
      type: 'cloud',
      description: 'Cloud storage and file sharing',
      category: 'Cloud Storage'
    },
    {
      id: 'DROP-001',
      name: 'Dropbox',
      type: 'cloud',
      description: 'File synchronization service',
      category: 'Cloud Storage'
    },
    {
      id: 'ZOOM-001',
      name: 'Zoom',
      type: 'communication',
      description: 'Video conferencing platform',
      category: 'Communication'
    },
    {
      id: 'STRP-001',
      name: 'Stripe',
      type: 'payment',
      description: 'Online payment processing',
      category: 'Payment Gateway',
      isPopular: true
    },
    {
      id: 'PAYP-001',
      name: 'PayPal',
      type: 'payment',
      description: 'Global online payments',
      category: 'Payment Gateway'
    },
    {
      id: 'UPS-001',
      name: 'UPS',
      type: 'shipping',
      description: 'Package delivery services',
      category: 'Shipping'
    }
  ])

  // Advanced Settings State
  const [autoBackup, setAutoBackup] = useState(true)
  const [nextBackup, setNextBackup] = useState('Today at 02:00 AM')
  const [apiToken, setApiToken] = useState('sk_live_***************')
  const [apiUsage] = useState({
    requestsToday: 1248,
    requestsLimit: 10000,
    resetTime: 'midnight'
  })

  const [systemInfo] = useState({
    dashboardVersion: 'v2.1.4',
    apiVersion: 'v3.0.1',
    databaseVersion: 'PostgreSQL 14.6',
    lastUpdated: '2024-01-15',
    systemUptime: '99.9%',
    serverLocation: 'AWS Frankfurt (eu-central-1)'
  })

  const [logs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '2024-01-16 14:30:15',
      level: 'info',
      message: 'User login successful',
      source: 'AuthService',
      user: 'john.doe@example.com'
    },
    {
      id: '2',
      timestamp: '2024-01-16 14:25:42',
      level: 'warning',
      message: 'API rate limit warning',
      source: 'APIGateway',
      user: 'api-client-001'
    },
    {
      id: '3',
      timestamp: '2024-01-16 14:20:18',
      level: 'info',
      message: 'Database backup completed',
      source: 'BackupService'
    },
    {
      id: '4',
      timestamp: '2024-01-16 14:15:33',
      level: 'error',
      message: 'Failed to sync with external service',
      source: 'IntegrationService',
      user: 'system'
    },
    {
      id: '5',
      timestamp: '2024-01-16 14:10:55',
      level: 'info',
      message: 'Cache cleared successfully',
      source: 'CacheService'
    },
    {
      id: '6',
      timestamp: '2024-01-16 14:05:21',
      level: 'info',
      message: 'New user registered',
      source: 'UserService',
      user: 'alice.smith@example.com'
    },
    {
      id: '7',
      timestamp: '2024-01-16 14:00:47',
      level: 'warning',
      message: 'High memory usage detected',
      source: 'SystemMonitor'
    },
    {
      id: '8',
      timestamp: '2024-01-16 13:55:12',
      level: 'info',
      message: 'Email notification sent',
      source: 'NotificationService',
      user: 'bob.johnson@example.com'
    },
    {
      id: '9',
      timestamp: '2024-01-16 13:50:38',
      level: 'error',
      message: 'Payment gateway timeout',
      source: 'PaymentService'
    },
    {
      id: '10',
      timestamp: '2024-01-16 13:45:24',
      level: 'info',
      message: 'System health check passed',
      source: 'HealthCheckService'
    }
  ])

  const [debugTools] = useState<DebugTool[]>([
    {
      id: 'cache-clear',
      title: 'Clear Cache',
      description: 'Clear all cached data and sessions',
      icon: <RefreshCw className="h-5 w-5" />,
      onClick: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert('Cache cleared successfully')
      },
      variant: 'primary'
    },
    {
      id: 'db-optimize',
      title: 'Optimize Database',
      description: 'Run database optimization and cleanup',
      icon: <Database className="h-5 w-5" />,
      onClick: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        alert('Database optimization completed')
      },
      variant: 'primary'
    },
    {
      id: 'system-check',
      title: 'System Health Check',
      description: 'Run comprehensive system diagnostics',
      icon: <Zap className="h-5 w-5" />,
      onClick: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500))
        alert('System health check completed. All systems operational.')
      },
      variant: 'secondary'
    },
    {
      id: 'log-purge',
      title: 'Purge Old Logs',
      description: 'Remove logs older than 30 days',
      icon: <Trash2 className="h-5 w-5" />,
      onClick: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert('Old logs purged successfully')
      },
      variant: 'danger'
    },
    {
      id: 'ssl-check',
      title: 'Check SSL Certificate',
      description: 'Verify SSL certificate validity',
      icon: <Shield className="h-5 w-5" />,
      onClick: async () => {
        await new Promise(resolve => setTimeout(resolve, 1200))
        alert('SSL certificate is valid and up to date')
      },
      variant: 'secondary'
    },
    {
      id: 'network-test',
      title: 'Network Diagnostics',
      description: 'Test network connectivity and speed',
      icon: <Wifi className="h-5 w-5" />,
      onClick: async () => {
        await new Promise(resolve => setTimeout(resolve, 1800))
        alert('Network diagnostics completed successfully')
      },
      variant: 'secondary'
    }
  ])

  const [dangerZoneActions] = useState<DangerZoneAction[]>([
    {
      id: 'delete-account',
      title: 'Delete Account',
      description: 'Permanently delete your account and all data',
      icon: <Trash2 className="h-5 w-5" />,
      onClick: () => {
        alert('Account deletion requested (this is a demo)')
        setShowDeleteModal(false)
      },
      variant: 'danger',
      confirmationText: 'Are you sure you want to delete your account? This action cannot be undone.'
    },
    {
      id: 'reset-settings',
      title: 'Reset All Settings',
      description: 'Reset all settings to factory defaults',
      icon: <RefreshCw className="h-5 w-5" />,
      onClick: () => {
        alert('All settings reset to factory defaults (this is a demo)')
      },
      variant: 'warning',
      confirmationText: 'Are you sure you want to reset all settings? This cannot be undone.'
    },
    {
      id: 'purge-data',
      title: 'Purge All Data',
      description: 'Delete all user data and logs',
      icon: <Database className="h-5 w-5" />,
      onClick: () => {
        alert('All data purged (this is a demo)')
      },
      variant: 'danger',
      confirmationText: 'This will delete ALL user data. Are you absolutely sure?'
    },
    {
      id: 'disable-system',
      title: 'Disable System',
      description: 'Temporarily disable all system functions',
      icon: <Shield className="h-5 w-5" />,
      onClick: () => {
        alert('System disabled (this is a demo)')
      },
      variant: 'warning',
      confirmationText: 'This will disable the system for all users. Continue?'
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

  // Notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    notificationSound: 'default'
  })

  // Notification channels
  const [notificationChannels] = useState([
    {
      id: 'email-channel',
      name: 'Email',
      type: 'email' as const,
      status: 'active' as const,
      description: 'Receive notifications via email',
      icon: <Mail className="h-5 w-5" />
    },
    {
      id: 'push-channel',
      name: 'Push Notifications',
      type: 'push' as const,
      status: 'active' as const,
      description: 'Browser and mobile push notifications',
      icon: <Bell className="h-5 w-5" />
    },
    {
      id: 'sms-channel',
      name: 'SMS',
      type: 'sms' as const,
      status: 'inactive' as const,
      description: 'Text message notifications',
      icon: <Smartphone className="h-5 w-5" />
    },
    {
      id: 'web-channel',
      name: 'Web Dashboard',
      type: 'web' as const,
      status: 'active' as const,
      description: 'In-app notifications',
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: 'mobile-channel',
      name: 'Mobile App',
      type: 'mobile' as const,
      status: 'active' as const,
      description: 'Mobile app notifications',
      icon: <Tablet className="h-5 w-5" />
    },
    {
      id: 'slack-channel',
      name: 'Slack',
      type: 'push' as const,
      status: 'inactive' as const,
      description: 'Slack channel notifications',
      icon: <Bell className="h-5 w-5" />
    }
  ])

  // Billing data
  const [paymentMethod] = useState({
    method: 'Visa **** 4242',
    type: 'Visa',
    lastFour: '4242',
    expiryDate: '12/25'
  })

  const [invoices] = useState([
    {
      id: 'INV-001',
      date: '2024-01-15',
      amount: '₨ 49,999',
      status: 'paid' as const,
      description: 'Enterprise Plan - January 2024'
    },
    {
      id: 'INV-002',
      date: '2023-12-15',
      amount: '₨ 49,999',
      status: 'paid' as const,
      description: 'Enterprise Plan - December 2023'
    },
    {
      id: 'INV-003',
      date: '2023-11-15',
      amount: '₨ 49,999',
      status: 'paid' as const,
      description: 'Enterprise Plan - November 2023'
    },
    {
      id: 'INV-004',
      date: '2023-10-15',
      amount: '₨ 49,999',
      status: 'paid' as const,
      description: 'Enterprise Plan - October 2023'
    }
  ])

  const [usageMetrics] = useState([
    {
      name: 'Users',
      current: 42,
      limit: 50,
      unit: 'users',
      trend: 'up' as const,
      percentage: 84
    },
    {
      name: 'Storage',
      current: 24.5,
      limit: 100,
      unit: 'GB',
      trend: 'up' as const,
      percentage: 24.5
    },
    {
      name: 'API Requests',
      current: 1248,
      limit: 10000,
      unit: 'requests',
      trend: 'stable' as const,
      percentage: 12.48
    },
    {
      name: 'Bandwidth',
      current: 45.2,
      limit: 100,
      unit: 'GB',
      trend: 'down' as const,
      percentage: 45.2
    }
  ])

  const [billingActions] = useState([
    {
      id: 'update-billing',
      title: 'Update Billing Info',
      description: 'Change billing address and details',
      icon: <Receipt className="h-5 w-5" />,
      onClick: () => alert('Update billing info clicked'),
      variant: 'primary' as const
    },
    {
      id: 'usage-reports',
      title: 'Usage Reports',
      description: 'View resource usage and costs',
      icon: <FileBarChart className="h-5 w-5" />,
      onClick: () => alert('Usage reports clicked'),
      variant: 'primary' as const
    },
    {
      id: 'export-invoices',
      title: 'Export Invoices',
      description: 'Download all billing history',
      icon: <Download className="h-5 w-5" />,
      onClick: () => alert('Export invoices clicked'),
      variant: 'secondary' as const
    },
    {
      id: 'request-refund',
      title: 'Request Refund',
      description: 'Submit a refund request',
      icon: <Upload className="h-5 w-5" />,
      onClick: () => alert('Request refund clicked'),
      variant: 'secondary' as const
    },
    {
      id: 'billing-support',
      title: 'Billing Support',
      description: 'Contact billing support team',
      icon: <HelpCircle className="h-5 w-5" />,
      onClick: () => alert('Billing support clicked'),
      variant: 'secondary' as const
    },
    {
      id: 'cancel-subscription',
      title: 'Cancel Subscription',
      description: 'Cancel your current plan',
      icon: <XCircle className="h-5 w-5" />,
      onClick: () => {
        if (confirm('Are you sure you want to cancel your subscription?')) {
          alert('Subscription cancellation requested');
        }
      },
      variant: 'danger' as const
    }
  ])

  const [plans] = useState([
    {
      id: 'basic',
      name: 'Basic',
      price: '₨ 9,999',
      description: 'For small teams just getting started',
      features: [
        'Up to 10 users',
        '50 GB storage',
        'Basic analytics',
        'Email support',
        '7-day trial'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Professional',
      price: '₨ 24,999',
      description: 'For growing businesses',
      features: [
        'Up to 50 users',
        '200 GB storage',
        'Advanced analytics',
        'Priority support',
        'Custom integrations'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₨ 49,999',
      description: 'For large organizations',
      features: [
        'Unlimited users',
        '1 TB storage',
        'Enterprise analytics',
        '24/7 dedicated support',
        'Custom development',
        'SLA guarantee'
      ],
      popular: false
    }
  ])

  const [planFeatures] = useState([
    { name: 'Number of Users', basic: true, pro: true, enterprise: true },
    { name: 'Storage Space', basic: true, pro: true, enterprise: true },
    { name: 'API Access', basic: true, pro: true, enterprise: true },
    { name: 'Custom Integrations', basic: false, pro: true, enterprise: true },
    { name: 'Priority Support', basic: false, pro: true, enterprise: true },
    { name: 'Dedicated Account Manager', basic: false, pro: false, enterprise: true },
    { name: 'Custom Development', basic: false, pro: false, enterprise: true },
    { name: 'SLA Guarantee', basic: false, pro: false, enterprise: true },
    { name: 'White Labeling', basic: false, pro: false, enterprise: true }
  ])

  // Security audit data
  const [securityAudit] = useState({
    lastLogin: '2 hours ago',
    lastLoginIp: '192.168.1.105',
    activeSessions: 3,
    devices: [
      { name: 'MacBook Pro 16"', lastActive: 'Now' },
      { name: 'iPhone 15 Pro', lastActive: '5 minutes ago' },
      { name: 'Windows Desktop', lastActive: '2 days ago' }
    ]
  })

  // Regional settings state
  const [regionalSettings, setRegionalSettings] = useState({
    language: 'en-US',
    currency: 'PKR',
    timezone: 'Asia/Karachi'
  })

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

  // Security handlers
  const handleTwoFactorChange = (enabled: boolean) => {
    setSecurity(prev => ({ ...prev, twoFactorAuth: enabled }))
  }

  const handleSessionTimeoutChange = (timeout: number) => {
    setSecurity(prev => ({ ...prev, sessionTimeout: timeout }))
  }

  const handlePasswordExpiryChange = (expiry: number) => {
    setSecurity(prev => ({ ...prev, passwordExpiry: expiry }))
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

  const handleLoginNotificationsChange = (enabled: boolean) => {
    setSecurity(prev => ({ ...prev, loginNotifications: enabled }))
  }

  const handleFailedLoginLockoutChange = (enabled: boolean) => {
    setSecurity(prev => ({ ...prev, failedLoginLockout: enabled }))
  }

  const handleMaxLoginAttemptsChange = (attempts: number) => {
    setSecurity(prev => ({ ...prev, maxLoginAttempts: attempts }))
  }

  const handleChangePassword = () => {
    alert('Change password functionality would open here (this is a demo)')
  }

  const handleBiometricSetup = () => {
    alert('Biometric setup would open here (this is a demo)')
  }

  // Notification handlers
  const handleEmailNotificationsChange = (emailNotifications: NotificationPreferences['email']) => {
    setNotifications(prev => ({
      ...prev,
      email: emailNotifications
    }))
  }

  const handlePushNotificationsChange = (pushNotifications: NotificationPreferences['push']) => {
    setNotifications(prev => ({
      ...prev,
      push: pushNotifications
    }))
  }

  const handleSmsNotificationsChange = (smsNotifications: NotificationPreferences['sms']) => {
    setNotifications(prev => ({
      ...prev,
      sms: smsNotifications
    }))
  }

  const handleChannelToggle = (channelId: string) => {
    alert(`Channel ${channelId} toggled (this is a demo)`)
  }

  const handleTestNotification = (type: 'email' | 'push' | 'sms') => {
    alert(`Testing ${type} notification...`)
  }

  // Billing handlers
  const handleUpgradePlan = () => {
    alert('Plan upgrade dialog would open here')
  }

  const handleChangePaymentMethod = () => {
    alert('Change payment method dialog would open here')
  }

  const handleViewAllInvoices = () => {
    alert('View all invoices would open here')
  }

  const handleDownloadInvoice = (invoiceId: string) => {
    alert(`Downloading invoice ${invoiceId}...`)
  }

  const handleSelectPlan = (planId: string) => {
    alert(`Selected plan: ${planId}`)
  }

  // Integration handlers
  const toggleIntegration = (integrationId: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === integrationId 
        ? { ...int, status: int.status === 'active' ? 'inactive' : 'active' }
        : int
    ))
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

  const removeIntegration = (integrationId: string) => {
    if (confirm('Are you sure you want to remove this integration?')) {
      setIntegrations(prev => prev.filter(int => int.id !== integrationId))
    }
  }

  const handleAddIntegration = () => {
    alert('Add integration modal would open here')
  }

  const handleConnectIntegration = (integration: AvailableIntegration) => {
    const newIntegration: Integration = {
      id: `INT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      name: integration.name,
      type: integration.type as any,
      status: 'active',
      apiKey: `${integration.name.toLowerCase()}_key_${Math.random().toString(36).substr(2, 9)}`,
      lastSynced: new Date().toLocaleString(),
      description: integration.description
    }
    setIntegrations(prev => [...prev, newIntegration])
    alert(`${integration.name} integration added successfully!`)
  }

  // Advanced settings handlers
  const handleAutoBackupChange = (enabled: boolean) => {
    setAutoBackup(enabled)
    if (enabled) {
      setNextBackup('Today at 02:00 AM')
    } else {
      setNextBackup('Disabled')
    }
  }

  const handleExportData = () => {
    const data = {
      userProfile,
      organization,
      security,
      notifications,
      theme,
      billing,
      integrations,
      logs,
      systemInfo,
      timestamp: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `system-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = () => {
    alert('Data import dialog would open here')
  }

  const handleGenerateToken = () => {
    const newToken = `sk_live_${Math.random().toString(36).substr(2, 24)}`
    setApiToken(newToken)
    alert('New API token generated successfully')
  }

  const handleSearchLogs = (query: string) => {
    console.log('Searching logs for:', query)
  }

  const handleDownloadLogs = () => {
    const logText = logs.map(log => 
      `${log.timestamp} [${log.level.toUpperCase()}] ${log.message} (${log.source})`
    ).join('\n')
    
    const blob = new Blob([logText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `system-logs-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      alert('Logs cleared (this is a demo)')
    }
  }

  // Add missing Truck icon component
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
                  <ProfileSection
                    profile={userProfile}
                    onProfileChange={setUserProfile}
                  />
                  
                  <ThemeSection
                    theme={theme}
                    onThemeChange={setTheme}
                  />
                  
                  <RegionalSection
                    settings={regionalSettings}
                    onSettingsChange={setRegionalSettings}
                  />
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  <TwoFactorSection
                    twoFactorAuth={security.twoFactorAuth}
                    onTwoFactorChange={handleTwoFactorChange}
                  />

                  <SessionSection
                    sessionTimeout={security.sessionTimeout}
                    passwordExpiry={security.passwordExpiry}
                    onSessionTimeoutChange={handleSessionTimeoutChange}
                    onPasswordExpiryChange={handlePasswordExpiryChange}
                    sessionTimeouts={sessionTimeouts}
                    passwordExpiryOptions={passwordExpiryOptions}
                  />

                  <IpWhitelistSection
                    ipWhitelist={security.ipWhitelist}
                    onAddIp={addIpAddress}
                    onRemoveIp={removeIpAddress}
                  />

                  <LoginSecuritySection
                    loginNotifications={security.loginNotifications}
                    failedLoginLockout={security.failedLoginLockout}
                    maxLoginAttempts={security.maxLoginAttempts}
                    onLoginNotificationsChange={handleLoginNotificationsChange}
                    onFailedLoginLockoutChange={handleFailedLoginLockoutChange}
                    onMaxLoginAttemptsChange={handleMaxLoginAttemptsChange}
                  />

                  <SecurityAuditSection
                    lastLogin={securityAudit.lastLogin}
                    lastLoginIp={securityAudit.lastLoginIp}
                    activeSessions={securityAudit.activeSessions}
                    devices={securityAudit.devices}
                  />

                  <PasswordManagementSection
                    onChangePassword={handleChangePassword}
                    onBiometricSetup={handleBiometricSetup}
                  />
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <EmailNotificationsSection
                    emailNotifications={notifications.email}
                    onEmailNotificationsChange={handleEmailNotificationsChange}
                  />

                  <PushNotificationsSection
                    pushNotifications={notifications.push}
                    onPushNotificationsChange={handlePushNotificationsChange}
                  />

                  <SmsNotificationsSection
                    smsNotifications={notifications.sms}
                    onSmsNotificationsChange={handleSmsNotificationsChange}
                  />

                  <NotificationPreferencesSection
                    preferences={notificationPreferences}
                    onPreferencesChange={setNotificationPreferences}
                  />

                  <NotificationChannelsSection
                    channels={notificationChannels}
                    onChannelToggle={handleChannelToggle}
                  />

                  <NotificationTestSection
                    onTestNotification={handleTestNotification}
                  />
                </div>
              )}

              {/* Billing Settings */}
              {activeTab === 'billing' && (
                <div className="space-y-8">
                  <CurrentPlanSection
                    plan={billing}
                    onUpgradePlan={handleUpgradePlan}
                  />

                  <PaymentMethodSection
                    paymentMethod={paymentMethod}
                    onChangePaymentMethod={handleChangePaymentMethod}
                  />

                  <BillingHistorySection
                    invoices={invoices}
                    onViewAll={handleViewAllInvoices}
                    onDownloadInvoice={handleDownloadInvoice}
                  />

                  <UsageMetricsSection
                    metrics={usageMetrics}
                  />

                  <BillingActionsSection
                    actions={billingActions}
                  />

                  <PlanComparisonSection
                    plans={plans}
                    features={planFeatures}
                    onSelectPlan={handleSelectPlan}
                  />
                </div>
              )}

              {/* Integrations Settings */}
              {activeTab === 'integrations' && (
                <IntegrationsSection
                  integrations={integrations}
                  availableIntegrations={availableIntegrations}
                  onToggleIntegration={toggleIntegration}
                  onRegenerateKey={regenerateApiKey}
                  onRemoveIntegration={removeIntegration}
                  onAddIntegration={handleAddIntegration}
                  onConnectIntegration={handleConnectIntegration}
                />
              )}

              {/* Advanced Settings */}
              {activeTab === 'advanced' && (
                <AdvancedSection
                  // Data Management
                  autoBackup={autoBackup}
                  onAutoBackupChange={handleAutoBackupChange}
                  nextBackup={nextBackup}
                  onExportData={handleExportData}
                  onImportData={handleImportData}
                  
                  // API Access
                  apiToken={apiToken}
                  onGenerateToken={handleGenerateToken}
                  apiUsage={apiUsage}
                  
                  // System Information
                  systemInfo={systemInfo}
                  
                  // Logs
                  logs={logs}
                  onSearchLogs={handleSearchLogs}
                  onDownloadLogs={handleDownloadLogs}
                  onClearLogs={handleClearLogs}
                  
                  // Debug Tools
                  debugTools={debugTools}
                  
                  // Danger Zone
                  dangerZoneActions={dangerZoneActions}
                />
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