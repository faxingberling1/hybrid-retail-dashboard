import { NextRequest, NextResponse } from 'next/server'

// Mock database for demo purposes
const mockUserSettings = {
  'USR-001': {
    userProfile: {
      id: 'USR-001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Administrator',
      organization: 'FashionHub Retail',
      phone: '+92 300 1234567',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      bio: 'System administrator with full access rights.'
    },
    theme: {
      mode: 'light' as const,
      primaryColor: '#4F46E5',
      fontSize: 'medium' as const,
      density: 'comfortable' as const,
      animations: true,
      borderRadius: 'md' as const,
      shadow: 'md' as const
    },
    regional: {
      language: 'en-US',
      currency: 'PKR',
      timezone: 'Asia/Karachi',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '12h' as const,
      firstDayOfWeek: 0,
      numberFormat: 'comma' as const,
      temperatureUnit: 'celsius' as const
    },
    security: {
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
    }
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    
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
    
    const userSettings = mockUserSettings[userId as keyof typeof mockUserSettings]
    
    if (!userSettings) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User settings not found',
          timestamp: new Date().toISOString()
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: userSettings,
      message: 'User settings retrieved successfully',
      metadata: {
        userId,
        lastUpdated: new Date().toISOString(),
        settingsCount: Object.keys(userSettings).length
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Get user settings error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve user settings',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    const body = await request.json()
    
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
    
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Settings data is required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // In production, you would save to database
    console.log(`Updating settings for user ${userId}:`, body)
    
    // Update mock data
    if (mockUserSettings[userId as keyof typeof mockUserSettings]) {
      mockUserSettings[userId as keyof typeof mockUserSettings] = {
        ...mockUserSettings[userId as keyof typeof mockUserSettings],
        ...body
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'User settings updated successfully',
      data: {
        userId,
        updatedFields: Object.keys(body),
        updatedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Update user settings error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update user settings',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}