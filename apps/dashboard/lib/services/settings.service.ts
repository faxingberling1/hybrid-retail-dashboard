export class SettingsService {
  private static BASE_URL = '/api/settings'
  
  // Helper to get userId from your app state/localStorage
  private static getUserId(): string {
    // Try to get userId from localStorage
    if (typeof window !== 'undefined') {
      const settings = localStorage.getItem('userSettings')
      if (settings) {
        try {
          const parsed = JSON.parse(settings)
          return parsed.userProfile?.id || 'USR-001'
        } catch (error) {
          console.error('Failed to parse settings:', error)
        }
      }
    }
    return 'USR-001' // Default fallback
  }
  
  static async saveAllSettings(data: any): Promise<SettingsApiResponse> {
    const userId = this.getUserId()
    return this.makeRequest(`${this.BASE_URL}`, 'POST', { 
      userId, 
      settings: data 
    })
  }
  
  static async saveSection(section: string, data: any): Promise<SettingsApiResponse> {
    const userId = this.getUserId()
    return this.makeRequest(`${this.BASE_URL}/${section}`, 'PUT', { 
      userId, 
      data 
    })
  }
  
  static async getUserSettings(userId?: string): Promise<SettingsApiResponse> {
    const targetUserId = userId || this.getUserId()
    return this.makeRequest(`${this.BASE_URL}/user/${targetUserId}`, 'GET')
  }
  
  static async validateEmail(email: string): Promise<SettingsApiResponse> {
    return this.makeRequest(`${this.BASE_URL}/validate/email`, 'POST', { email })
  }
  
  static async uploadAvatar(file: File, userId?: string): Promise<{ success: boolean; url?: string; message?: string }> {
    try {
      const targetUserId = userId || this.getUserId()
      const formData = new FormData()
      formData.append('avatar', file)
      formData.append('userId', targetUserId)
      
      const response = await fetch(`${this.BASE_URL}/avatar`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Avatar upload failed:', error)
      return { success: false, message: 'Failed to upload avatar' }
    }
  }
  
  static generateAvatarUrl(name: string): string {
    const seed = name.toLowerCase().replace(/\s+/g, '-')
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=4f46e5`
  }
  
  private static async makeRequest(endpoint: string, method: string = 'GET', data?: any): Promise<SettingsApiResponse> {
    try {
      console.log(`🚀 Making ${method} request to ${endpoint}`, data)
      
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      }
      
      if (data && method !== 'GET') {
        options.body = JSON.stringify(data)
        console.log('📦 Request body:', options.body)
      }
      
      const response = await fetch(endpoint, options)
      
      console.log(`📨 Response status: ${response.status} ${response.statusText}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Response error:', errorText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('✅ Response data:', result)
      return result
    } catch (error) {
      console.error('❌ API request failed:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network request failed',
        timestamp: new Date().toISOString()
      }
    }
  }
}