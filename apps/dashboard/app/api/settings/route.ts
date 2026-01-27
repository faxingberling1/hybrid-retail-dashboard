import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'User ID is required',
          success: false,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // Return all settings
    const settings = {
      userId,
      theme: { mode: 'light', primaryColor: '#4F46E5' },
      regional: { language: 'en-US', timezone: 'UTC' },
      security: { twoFactorAuth: false },
      notifications: {},
      lastUpdated: new Date().toISOString()
    }
    
    return NextResponse.json({ 
      success: true, 
      data: settings,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        success: false,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, settings } = body
    
    if (!userId || !settings) {
      return NextResponse.json(
        { 
          error: 'User ID and settings are required',
          success: false,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // In a real app, save to database
    console.log('Saving all settings for user:', userId)
    
    return NextResponse.json({
      success: true,
      message: 'All settings saved successfully',
      data: {
        userId,
        sectionsSaved: Object.keys(settings).length,
        timestamp: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to save settings:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        success: false,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, section, data } = body
    
    if (!userId) {
      return NextResponse.json(
        { 
          error: 'User ID is required',
          success: false,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // Handle both section-specific and bulk updates
    if (section && data) {
      console.log('Updating section:', section, 'for user:', userId)
      return NextResponse.json({
        success: true,
        message: `${section} settings updated successfully`,
        timestamp: new Date().toISOString()
      })
    } else if (body.settings) {
      // Bulk update
      console.log('Bulk updating settings for user:', userId)
      return NextResponse.json({
        success: true,
        message: 'Settings updated successfully',
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          success: false,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        success: false,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}