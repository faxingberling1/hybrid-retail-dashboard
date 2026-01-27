import { NextRequest, NextResponse } from 'next/server'

// Valid sections
const validSections = ['theme', 'regional', 'security', 'notifications', 'profile']

// Mock storage for demo
const sectionData: Record<string, Record<string, any>> = {
  theme: {},
  regional: {},
  security: {},
  notifications: {},
  profile: {}
}

export async function GET(
  request: NextRequest,
  { params }: { params: { section: string } }
) {
  try {
    const { section } = params
    
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid section. Valid sections are: ${validSections.join(', ')}`,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    const userId = request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User ID is required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // Get data for this user and section
    const userSectionKey = `${userId}_${section}`
    const data = sectionData[section][userSectionKey] || getDefaultSectionData(section)
    
    return NextResponse.json({
      success: true,
      data,
      message: `${section} settings retrieved successfully`,
      metadata: {
        section,
        userId,
        dataSize: JSON.stringify(data).length,
        retrievedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Get section settings error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve section settings',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { section: string } }
) {
  try {
    const { section } = params
    const body = await request.json()
    const { userId, data } = body
    
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Invalid section. Valid sections are: ${validSections.join(', ')}`,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    if (!userId || !data) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User ID and data are required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // Validate section-specific data
    const validation = validateSectionData(section, data)
    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          message: validation.message,
          errors: validation.errors,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // Save data
    const userSectionKey = `${userId}_${section}`
    sectionData[section][userSectionKey] = {
      ...(sectionData[section][userSectionKey] || getDefaultSectionData(section)),
      ...data,
      lastUpdated: new Date().toISOString()
    }
    
    console.log(`Updated ${section} settings for user ${userId}:`, data)
    
    return NextResponse.json({
      success: true,
      message: `${section} settings updated successfully`,
      data: {
        section,
        userId,
        updatedFields: Object.keys(data),
        updatedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Update section settings error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update section settings',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Helper functions
function getDefaultSectionData(section: string): any {
  const defaults: Record<string, any> = {
    theme: {
      mode: 'light',
      primaryColor: '#4F46E5',
      fontSize: 'medium',
      density: 'comfortable',
      animations: true,
      borderRadius: 'md',
      shadow: 'md'
    },
    regional: {
      language: 'en-US',
      currency: 'PKR',
      timezone: 'Asia/Karachi',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h',
      firstDayOfWeek: 0,
      numberFormat: 'comma',
      temperatureUnit: 'celsius'
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      ipWhitelist: [],
      loginNotifications: true,
      failedLoginLockout: true,
      maxLoginAttempts: 5,
      requireComplexPassword: true,
      passwordHistorySize: 5,
      autoLogout: true
    },
    notifications: {
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
    },
    profile: {
      name: '',
      email: '',
      phone: '',
      bio: '',
      avatar: ''
    }
  }
  
  return defaults[section] || {}
}

function validateSectionData(section: string, data: any): { valid: boolean; message?: string; errors?: string[] } {
  const errors: string[] = []
  
  switch (section) {
    case 'theme':
      if (data.mode && !['light', 'dark', 'system'].includes(data.mode)) {
        errors.push('Invalid theme mode')
      }
      if (data.primaryColor && !/^#[0-9A-F]{6}$/i.test(data.primaryColor)) {
        errors.push('Invalid color format')
      }
      break
      
    case 'regional':
      if (data.timezone && !Intl.supportedValuesOf('timeZone').includes(data.timezone)) {
        errors.push('Invalid timezone')
      }
      if (data.language && !/^[a-z]{2}-[A-Z]{2}$/.test(data.language)) {
        errors.push('Invalid language format')
      }
      break
      
    case 'security':
      if (data.sessionTimeout && (data.sessionTimeout < 0 || data.sessionTimeout > 480)) {
        errors.push('Session timeout must be between 0 and 480 minutes')
      }
      if (data.maxLoginAttempts && (data.maxLoginAttempts < 1 || data.maxLoginAttempts > 10)) {
        errors.push('Max login attempts must be between 1 and 10')
      }
      break
      
    case 'profile':
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Invalid email format')
      }
      if (data.name && data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters')
      }
      break
  }
  
  return {
    valid: errors.length === 0,
    message: errors.length > 0 ? 'Validation failed' : 'Validation passed',
    errors: errors.length > 0 ? errors : undefined
  }
}