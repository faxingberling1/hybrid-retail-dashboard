import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ValidationUtils } from '@/lib/utils/validation'
import { applyThemeToDocument, themePresets, hexToHsl, generateColorShades } from '@/lib/utils/theme-utils'
import { SettingsService } from '@/lib/services/settings.service'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  organization: string
  phone: string
  avatar: string
  bio: string
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  fontSize: 'small' | 'medium' | 'large'
  density: 'comfortable' | 'compact'
  animations: boolean
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export interface RegionalSettings {
  language: string
  currency: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  firstDayOfWeek: number
  numberFormat: 'comma' | 'dot'
  temperatureUnit: 'celsius' | 'fahrenheit'
}

export interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeout: number
  passwordExpiry: number
  ipWhitelist: string[]
  loginNotifications: boolean
  failedLoginLockout: boolean
  maxLoginAttempts: number
  requireComplexPassword: boolean
  passwordHistorySize: number
  autoLogout: boolean
}

export interface NotificationSettings {
  email: {
    marketing: boolean
    security: boolean
    updates: boolean
    reports: boolean
    billing: boolean
  }
  push: {
    transactions: boolean
    alerts: boolean
    updates: boolean
    reminders: boolean
  }
  sms: {
    alerts: boolean
    otp: boolean
    critical: boolean
  }
  quietHours: {
    enabled: boolean
    startTime: string
    endTime: string
  }
  notificationSound: string
}

export interface SettingsStore {
  // State
  userProfile: UserProfile
  theme: ThemeSettings
  regional: RegionalSettings
  security: SecuritySettings
  notifications: NotificationSettings
  isLoading: boolean
  isSaving: boolean
  lastSaved: string | null
  errors: Record<string, string>
  successMessage: string | null
  version: string
  
  // Actions
  updateUserProfile: (updates: Partial<UserProfile>) => void
  updateTheme: (updates: Partial<ThemeSettings>) => void
  updateRegional: (updates: Partial<RegionalSettings>) => void
  updateSecurity: (updates: Partial<SecuritySettings>) => void
  updateNotifications: (updates: Partial<NotificationSettings>) => void
  applyThemePreset: (preset: keyof typeof themePresets) => void
  addIpAddress: (ip: string) => void
  removeIpAddress: (ip: string) => void
  validateProfile: () => boolean
  validateAll: () => Record<string, string>
  saveSettings: (section?: string) => Promise<boolean>
  saveSection: (section: string, data: any) => Promise<boolean>
  resetToDefaults: () => void
  exportSettings: () => void
  importSettings: (data: any) => boolean
  loadFromStorage: () => void
  clearStorage: () => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  setError: (field: string, message: string) => void
  setSuccess: (message: string) => void
  clearErrors: () => void
  clearSuccess: () => void
  validateIpAddress: (ip: string) => boolean
  validateEmail: (email: string) => boolean
  validatePhone: (phone: string) => boolean
  generateAvatar: (name: string) => string
  updateAvatar: (file: File) => Promise<boolean>
  getSettingsSummary: () => Record<string, any>
  hasUnsavedChanges: () => boolean
  applyThemeToDocument: () => void
}

// Default values
const defaultUserProfile: UserProfile = {
  id: 'USR-001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Administrator',
  organization: 'FashionHub Retail',
  phone: '+92 300 1234567',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  bio: 'System administrator with full access rights.'
}

const defaultTheme: ThemeSettings = {
  mode: 'light',
  primaryColor: '#4F46E5',
  fontSize: 'medium',
  density: 'comfortable',
  animations: true,
  borderRadius: 'md',
  shadow: 'md'
}

const defaultRegional: RegionalSettings = {
  language: 'en-US',
  currency: 'PKR',
  timezone: 'Asia/Karachi',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  firstDayOfWeek: 0,
  numberFormat: 'comma',
  temperatureUnit: 'celsius'
}

const defaultSecurity: SecuritySettings = {
  twoFactorAuth: true,
  sessionTimeout: 30,
  passwordExpiry: 90,
  ipWhitelist: ['192.168.1.0/24', '203.0.113.0/24'],
  loginNotifications: true,
  failedLoginLockout: true,
  maxLoginAttempts: 5,
  requireComplexPassword: true,
  passwordHistorySize: 5,
  autoLogout: true
}

const defaultNotifications: NotificationSettings = {
  email: {
    marketing: true,
    security: true,
    updates: true,
    reports: true,
    billing: true
  },
  push: {
    transactions: true,
    alerts: true,
    updates: false,
    reminders: true
  },
  sms: {
    alerts: false,
    otp: true,
    critical: true
  },
  quietHours: {
    enabled: false,
    startTime: '22:00',
    endTime: '07:00'
  },
  notificationSound: 'default'
}

// Session timeout options
export const sessionTimeoutOptions = [
  { value: 5, label: '5 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
  { value: 240, label: '4 hours' },
  { value: 0, label: 'Never (Not recommended)' }
]

// Password expiry options
export const passwordExpiryOptions = [
  { value: 30, label: '30 days' },
  { value: 60, label: '60 days' },
  { value: 90, label: '90 days' },
  { value: 180, label: '6 months' },
  { value: 365, label: '1 year' },
  { value: 0, label: 'Never' }
]

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      userProfile: defaultUserProfile,
      theme: defaultTheme,
      regional: defaultRegional,
      security: defaultSecurity,
      notifications: defaultNotifications,
      isLoading: false,
      isSaving: false,
      lastSaved: null,
      errors: {},
      successMessage: null,
      version: '1.0.0',
      
      // Actions
      updateUserProfile: (updates) => {
        set((state) => {
          const newProfile = { ...state.userProfile, ...updates }
          
          // Clear errors for updated fields
          const newErrors = { ...state.errors }
          Object.keys(updates).forEach(key => {
            delete newErrors[key]
          })
          
          return {
            userProfile: newProfile,
            errors: newErrors
          }
        })
      },
      
      updateTheme: (updates) => {
        set((state) => {
          const newTheme = { ...state.theme, ...updates }
          
          // Apply theme changes immediately to document
          if (Object.keys(updates).length > 0) {
            applyThemeToDocument(newTheme)
          }
          
          return { theme: newTheme }
        })
      },
      
      updateRegional: (updates) => {
        set((state) => ({
          regional: { ...state.regional, ...updates }
        }))
      },
      
      updateSecurity: (updates) => {
        set((state) => ({
          security: { ...state.security, ...updates }
        }))
      },
      
      updateNotifications: (updates) => {
        set((state) => ({
          notifications: { ...state.notifications, ...updates }
        }))
      },
      
      applyThemePreset: (preset) => {
        const presetTheme = themePresets[preset]
        set((state) => {
          const newTheme = { ...state.theme, ...presetTheme }
          applyThemeToDocument(newTheme)
          return { theme: newTheme }
        })
      },
      
      addIpAddress: (ip) => {
        if (!ip.trim()) {
          get().setError('ipAddress', 'IP address cannot be empty')
          return
        }
        
        if (!get().validateIpAddress(ip)) {
          get().setError('ipAddress', 'Invalid IP address format. Use format: 192.168.1.1 or 192.168.1.0/24')
          return
        }
        
        const { security } = get()
        if (security.ipWhitelist.includes(ip)) {
          get().setError('ipAddress', 'IP address already exists in whitelist')
          return
        }
        
        set((state) => ({
          security: {
            ...state.security,
            ipWhitelist: [...state.security.ipWhitelist, ip]
          }
        }))
        
        get().clearErrors()
      },
      
      removeIpAddress: (ip) => {
        set((state) => ({
          security: {
            ...state.security,
            ipWhitelist: state.security.ipWhitelist.filter(i => i !== ip)
          }
        }))
      },
      
      validateProfile: () => {
        const { userProfile } = get()
        const errors: Record<string, string> = {}
        
        // Name validation
        const nameValidation = ValidationUtils.isValidName(userProfile.name)
        if (!nameValidation.valid) {
          errors.name = nameValidation.message || 'Invalid name'
        }
        
        // Email validation
        if (!userProfile.email.trim()) {
          errors.email = 'Email is required'
        } else if (!ValidationUtils.isValidEmail(userProfile.email)) {
          errors.email = 'Invalid email format'
        }
        
        // Phone validation
        if (userProfile.phone && !ValidationUtils.isValidPhone(userProfile.phone)) {
          errors.phone = 'Invalid phone number format'
        }
        
        // Bio validation
        const bioValidation = ValidationUtils.isValidBio(userProfile.bio)
        if (!bioValidation.valid) {
          errors.bio = bioValidation.message || 'Invalid bio'
        }
        
        set({ errors })
        return Object.keys(errors).length === 0
      },
      
      validateAll: () => {
        const errors: Record<string, string> = {}
        const state = get()
        
        // Profile validation
        const profileErrors = get().validateProfile()
        if (!profileErrors) {
          Object.assign(errors, state.errors)
        }
        
        // Theme validation
        if (!ValidationUtils.isValidHexColor(state.theme.primaryColor)) {
          errors.primaryColor = 'Invalid color format'
        }
        
        // Security validation
        const sessionValidation = ValidationUtils.isValidSessionTimeout(state.security.sessionTimeout)
        if (!sessionValidation.valid) {
          errors.sessionTimeout = sessionValidation.message || 'Invalid session timeout'
        }
        
        const passwordExpiryValidation = ValidationUtils.isValidPasswordExpiry(state.security.passwordExpiry)
        if (!passwordExpiryValidation.valid) {
          errors.passwordExpiry = passwordExpiryValidation.message || 'Invalid password expiry'
        }
        
        const maxAttemptsValidation = ValidationUtils.isValidMaxLoginAttempts(state.security.maxLoginAttempts)
        if (!maxAttemptsValidation.valid) {
          errors.maxLoginAttempts = maxAttemptsValidation.message || 'Invalid max login attempts'
        }
        
        // IP whitelist validation
        state.security.ipWhitelist.forEach((ip, index) => {
          if (!get().validateIpAddress(ip)) {
            errors[`ipAddress_${index}`] = `Invalid IP address: ${ip}`
          }
        })
        
        set({ errors })
        return errors
      },
      
      saveSettings: async (section?: string) => {
        const state = get()
        
        // Validate before saving
        const errors = get().validateAll()
        if (Object.keys(errors).length > 0) {
          get().setError('save', 'Please fix validation errors before saving')
          return false
        }
        
        set({ isSaving: true, errors: {} })
        
        try {
          // Prepare data based on section
          let dataToSave: any = {}
          const userId = state.userProfile.id // Get userId from profile
          
          if (section) {
            dataToSave = state[section as keyof SettingsStore]
            
            // Call the section-specific API endpoint
            const result = await SettingsService.saveSection(section, {
              userId,
              data: dataToSave
            })
            
            if (result.success) {
              set({
                isSaving: false,
                lastSaved: new Date().toISOString(),
                successMessage: `${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`
              })
              
              // Apply theme if theme was saved
              if (section === 'theme') {
                get().applyThemeToDocument()
              }
              
              // Clear success message after 3 seconds
              setTimeout(() => {
                get().clearSuccess()
              }, 3000)
              
              return true
            } else {
              throw new Error(result.message || 'Failed to save settings')
            }
          } else {
            // Save all settings
            dataToSave = {
              userProfile: state.userProfile,
              theme: state.theme,
              regional: state.regional,
              security: state.security,
              notifications: state.notifications
            }
            
            // Call the main API endpoint for bulk save
            const result = await SettingsService.saveAllSettings({
              userId,
              settings: dataToSave
            })
            
            if (result.success) {
              set({
                isSaving: false,
                lastSaved: new Date().toISOString(),
                successMessage: 'All settings saved successfully!'
              })
              
              // Apply theme
              get().applyThemeToDocument()
              
              // Clear success message after 3 seconds
              setTimeout(() => {
                get().clearSuccess()
              }, 3000)
              
              return true
            } else {
              throw new Error(result.message || 'Failed to save settings')
            }
          }
        } catch (error) {
          console.error('Failed to save settings:', error)
          set({
            isSaving: false,
            errors: { 
              save: error instanceof Error ? error.message : 'Failed to save settings. Please try again.'
            }
          })
          return false
        }
      },
      
      saveSection: async (section, data) => {
        set({ isSaving: true })
        
        try {
          const result = await SettingsService.saveSection(section, data)
          
          if (result.success) {
            // Update local state
            set((state) => ({
              [section]: { ...state[section as keyof SettingsStore], ...data },
              isSaving: false,
              lastSaved: new Date().toISOString(),
              successMessage: `${section} updated successfully`
            }))
            
            // Apply theme if theme section
            if (section === 'theme') {
              get().applyThemeToDocument()
            }
            
            setTimeout(() => get().clearSuccess(), 3000)
            return true
          } else {
            throw new Error(result.message)
          }
        } catch (error) {
          console.error(`Failed to save ${section}:`, error)
          set({
            isSaving: false,
            errors: { 
              [section]: error instanceof Error ? error.message : `Failed to save ${section}`
            }
          })
          return false
        }
      },
      
      resetToDefaults: () => {
        if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
          set({
            userProfile: defaultUserProfile,
            theme: defaultTheme,
            regional: defaultRegional,
            security: defaultSecurity,
            notifications: defaultNotifications,
            errors: {},
            successMessage: 'Settings reset to default values',
            lastSaved: new Date().toISOString()
          })
          
          // Apply default theme
          get().applyThemeToDocument()
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            get().clearSuccess()
          }, 3000)
        }
      },
      
      exportSettings: () => {
        const state = get()
        
        const data = {
          userProfile: state.userProfile,
          theme: state.theme,
          regional: state.regional,
          security: state.security,
          notifications: state.notifications,
          version: state.version,
          exportedAt: new Date().toISOString(),
          exportedBy: state.userProfile.name,
          exportedFrom: 'Settings Dashboard'
        }
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `settings-backup-${state.userProfile.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
        
        set({ successMessage: 'Settings exported successfully!' })
        setTimeout(() => get().clearSuccess(), 3000)
      },
      
      importSettings: (data) => {
        try {
          // Validate imported data
          const requiredFields = ['userProfile', 'theme', 'regional', 'security', 'notifications', 'version']
          const isValid = requiredFields.every(field => field in data)
          
          if (!isValid) {
            throw new Error('Invalid settings file format')
          }
          
          // Validate version compatibility
          const currentVersion = get().version
          const importedVersion = data.version || '1.0.0'
          
          if (importedVersion !== currentVersion) {
            if (!confirm(`Settings file version (${importedVersion}) differs from current version (${currentVersion}). Some settings may not import correctly. Continue?`)) {
              return false
            }
          }
          
          // Merge with defaults to ensure all fields exist
          const mergedData = {
            userProfile: { ...defaultUserProfile, ...data.userProfile },
            theme: { ...defaultTheme, ...data.theme },
            regional: { ...defaultRegional, ...data.regional },
            security: { ...defaultSecurity, ...data.security },
            notifications: { ...defaultNotifications, ...data.notifications }
          }
          
          set({
            ...mergedData,
            errors: {},
            successMessage: 'Settings imported successfully!',
            lastSaved: new Date().toISOString()
          })
          
          // Apply imported theme
          get().applyThemeToDocument()
          
          setTimeout(() => get().clearSuccess(), 3000)
          return true
        } catch (error) {
          console.error('Failed to import settings:', error)
          set({
            errors: { 
              import: error instanceof Error ? error.message : 'Failed to import settings. Invalid file format.'
            }
          })
          return false
        }
      },
      
      loadFromStorage: () => {
        try {
          const stored = localStorage.getItem('settings-storage')
          if (stored) {
            const parsed = JSON.parse(stored)
            const state = parsed.state
            
            // Validate stored state
            if (state && state.theme && state.userProfile) {
              set({
                userProfile: { ...defaultUserProfile, ...state.userProfile },
                theme: { ...defaultTheme, ...state.theme },
                regional: { ...defaultRegional, ...state.regional },
                security: { ...defaultSecurity, ...state.security },
                notifications: { ...defaultNotifications, ...state.notifications }
              })
              
              // Apply stored theme
              get().applyThemeToDocument()
              return true
            }
          }
        } catch (error) {
          console.error('Failed to load from storage:', error)
        }
        return false
      },
      
      clearStorage: () => {
        localStorage.removeItem('settings-storage')
        get().resetToDefaults()
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
      
      setSaving: (saving) => {
        set({ isSaving: saving })
      },
      
      setError: (field, message) => {
        set((state) => ({
          errors: { ...state.errors, [field]: message }
        }))
      },
      
      setSuccess: (message) => {
        set({ successMessage: message })
      },
      
      clearErrors: () => {
        set({ errors: {} })
      },
      
      clearSuccess: () => {
        set({ successMessage: null })
      },
      
      validateIpAddress: (ip) => {
        return ValidationUtils.isValidIpAddress(ip)
      },
      
      validateEmail: (email) => {
        return ValidationUtils.isValidEmail(email)
      },
      
      validatePhone: (phone) => {
        return ValidationUtils.isValidPhone(phone)
      },
      
      generateAvatar: (name) => {
        return SettingsService.generateAvatarUrl(name)
      },
      
      updateAvatar: async (file) => {
        try {
          const state = get()
          const result = await SettingsService.uploadAvatar(file, state.userProfile.id)
          
          if (result.success && result.url) {
            get().updateUserProfile({ avatar: result.url })
            get().setSuccess('Avatar updated successfully!')
            setTimeout(() => get().clearSuccess(), 3000)
            return true
          } else {
            throw new Error(result.message || 'Upload failed')
          }
        } catch (error) {
          console.error('Avatar update failed:', error)
          get().setError('avatar', error instanceof Error ? error.message : 'Failed to update avatar')
          return false
        }
      },
      
      getSettingsSummary: () => {
        const state = get()
        return {
          profile: {
            name: state.userProfile.name,
            email: state.userProfile.email,
            role: state.userProfile.role
          },
          theme: {
            mode: state.theme.mode,
            color: state.theme.primaryColor
          },
          security: {
            twoFactorEnabled: state.security.twoFactorAuth,
            ipWhitelistCount: state.security.ipWhitelist.length
          },
          lastSaved: state.lastSaved,
          version: state.version
        }
      },
      
      hasUnsavedChanges: () => {
        // Compare current state with last saved state
        // This is a simplified check - in production, you'd want more sophisticated tracking
        const state = get()
        const lastSavedStr = localStorage.getItem('settings-storage')
        
        if (!lastSavedStr || !state.lastSaved) {
          return false
        }
        
        try {
          const lastSaved = JSON.parse(lastSavedStr)
          const currentState = {
            userProfile: state.userProfile,
            theme: state.theme,
            regional: state.regional,
            security: state.security,
            notifications: state.notifications
          }
          
          return JSON.stringify(currentState) !== JSON.stringify(lastSaved.state)
        } catch {
          return false
        }
      },
      
      applyThemeToDocument: () => {
        const { theme } = get()
        applyThemeToDocument(theme)
      }
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        userProfile: state.userProfile,
        theme: state.theme,
        regional: state.regional,
        security: state.security,
        notifications: state.notifications,
        lastSaved: state.lastSaved,
        version: state.version
      }),
      // On rehydration, apply the theme
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            // Apply theme after rehydration
            setTimeout(() => {
              if (state.theme) {
                applyThemeToDocument(state.theme)
              }
            }, 100)
          }
        }
      }
    }
  )
)

// Export helper functions
export const settingsHelpers = {
  // Format settings for display
  formatSettingsForDisplay: (settings: SettingsStore) => {
    return {
      profile: `${settings.userProfile.name} (${settings.userProfile.role})`,
      theme: `${settings.theme.mode} mode - ${settings.theme.primaryColor}`,
      regional: `${settings.regional.language} - ${settings.regional.timezone}`,
      security: `2FA: ${settings.security.twoFactorAuth ? 'Enabled' : 'Disabled'}`,
      lastUpdated: settings.lastSaved ? new Date(settings.lastSaved).toLocaleString() : 'Never'
    }
  },
  
  // Get settings diff (changes between two states)
  getSettingsDiff: (oldState: Partial<SettingsStore>, newState: Partial<SettingsStore>) => {
    const changes: Record<string, { old: any, new: any }> = {}
    
    const compareObjects = (obj1: any, obj2: any, path: string = '') => {
      for (const key in obj2) {
        const currentPath = path ? `${path}.${key}` : key
        
        if (typeof obj2[key] === 'object' && obj2[key] !== null) {
          if (!obj1[key] || typeof obj1[key] !== 'object') {
            changes[currentPath] = { old: obj1[key], new: obj2[key] }
          } else {
            compareObjects(obj1[key], obj2[key], currentPath)
          }
        } else if (obj1[key] !== obj2[key]) {
          changes[currentPath] = { old: obj1[key], new: obj2[key] }
        }
      }
    }
    
    compareObjects(oldState, newState)
    return changes
  },
  
  // Validate settings before save
  validateBeforeSave: (settings: Partial<SettingsStore>) => {
    const errors: string[] = []
    
    if (settings.userProfile) {
      if (!settings.userProfile.name?.trim()) {
        errors.push('Name is required')
      }
      if (!ValidationUtils.isValidEmail(settings.userProfile.email || '')) {
        errors.push('Invalid email address')
      }
    }
    
    if (settings.theme) {
      if (!ValidationUtils.isValidHexColor(settings.theme.primaryColor || '')) {
        errors.push('Invalid primary color')
      }
    }
    
    if (settings.security) {
      if (settings.security.sessionTimeout !== undefined && settings.security.sessionTimeout < 0) {
        errors.push('Session timeout cannot be negative')
      }
      if (settings.security.maxLoginAttempts !== undefined && 
          (settings.security.maxLoginAttempts < 1 || settings.security.maxLoginAttempts > 10)) {
        errors.push('Max login attempts must be between 1 and 10')
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  },
  
  // Create backup summary
  createBackupSummary: (settings: SettingsStore) => {
    return {
      timestamp: new Date().toISOString(),
      user: settings.userProfile.name,
      items: {
        profile: true,
        theme: true,
        regional: true,
        security: true,
        notifications: true
      },
      size: JSON.stringify(settings).length,
      version: settings.version
    }
  }
}

// Export default store instance
export default useSettingsStore