import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('avatar') as File
    const userId = formData.get('userId') as string
    
    if (!file || !userId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File and userId are required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP)',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File size too large. Maximum size is 5MB',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // For demo purposes, generate a mock avatar URL
    // In production, you would upload to cloud storage (S3, Cloudinary, etc.)
    const seed = userId.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=4f46e5`
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return NextResponse.json({
      success: true,
      url: avatarUrl,
      message: 'Avatar uploaded successfully',
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to upload avatar. Please try again.',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to retrieve avatar
export async function GET(request: NextRequest) {
  try {
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
    
    const seed = userId.toLowerCase().replace(/[^a-z0-9]/g, '-')
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=4f46e5`
    
    return NextResponse.json({
      success: true,
      url: avatarUrl,
      userId,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Get avatar error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve avatar',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}