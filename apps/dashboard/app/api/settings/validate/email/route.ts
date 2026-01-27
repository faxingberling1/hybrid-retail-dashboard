import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body
    
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email is required',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // Comprehensive email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const isFormatValid = emailRegex.test(email)
    
    // Check for common disposable email domains
    const disposableDomains = [
      'tempmail.com', '10minutemail.com', 'guerrillamail.com',
      'mailinator.com', 'yopmail.com', 'throwawaymail.com'
    ]
    
    const domain = email.split('@')[1]?.toLowerCase()
    const isDisposable = disposableDomains.some(d => domain?.includes(d))
    
    // Check for common typos
    const commonTypos = ['gmial.com', 'gmail.con', 'hotmal.com', 'yahooo.com']
    const hasTypo = commonTypos.some(typo => domain?.includes(typo))
    
    const isValid = isFormatValid && !isDisposable && !hasTypo
    
    let message = 'Email is valid'
    if (!isFormatValid) {
      message = 'Invalid email format'
    } else if (isDisposable) {
      message = 'Disposable email addresses are not allowed'
    } else if (hasTypo) {
      message = 'Email may contain a typo'
    }
    
    return NextResponse.json({
      success: true,
      data: { 
        isValid,
        formatValid: isFormatValid,
        disposable: isDisposable,
        hasTypo
      },
      message,
      suggestions: hasTypo ? [
        'Did you mean gmail.com?',
        'Did you mean hotmail.com?',
        'Did you mean yahoo.com?'
      ] : undefined,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Email validation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Email validation failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}