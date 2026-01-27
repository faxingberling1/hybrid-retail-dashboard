// /middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl
  
  console.log('\n=== MIDDLEWARE START ===')
  console.log('📁 Path:', pathname)
  
  // Public paths - allow without authentication
  const publicPaths = [
    '/login', 
    '/api/auth', 
    '/_next', 
    '/favicon.ico',
    '/api/public'
  ]
  
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  if (isPublicPath) {
    console.log('✅ Public path, allowing access')
    return NextResponse.next()
  }
  
  // Get token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  
  console.log('🔐 Token found:', !!token)
  
  // Redirect to login if no token
  if (!token) {
    console.log('❌ No token, redirecting to login')
    const loginUrl = new URL('/login', origin)
    return NextResponse.redirect(loginUrl)
  }
  
  // Extract user data from token
  const userRole = (token.role as string) || ''
  const userEmail = (token.email as string) || ''
  const userId = token.sub || token.id || ''
  
  console.log('👤 User role:', userRole)
  console.log('📧 User email:', userEmail)
  
  // Create headers with user information
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-role', userRole)
  requestHeaders.set('x-user-email', userEmail)
  requestHeaders.set('x-user-id', userId)
  
  // Check if user is admin (for convenience)
  const isAdmin = ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN', 'MANAGER'].includes(userRole.toUpperCase())
  requestHeaders.set('x-is-admin', isAdmin.toString())
  
  // Log headers being set
  console.log('📤 Setting headers:', {
    'x-user-role': userRole,
    'x-user-email': userEmail,
    'x-user-id': userId,
    'x-is-admin': isAdmin.toString()
  })
  
  // Role-based access control
  // SUPER_ADMIN can access everything
  if (userRole.toUpperCase() === 'SUPER_ADMIN' || userRole.toUpperCase() === 'SUPERADMIN') {
    console.log('✅ Super admin access granted')
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
  // ADMIN can access admin and user routes
  if (userRole.toUpperCase() === 'ADMIN') {
    if (pathname.startsWith('/admin') || pathname.startsWith('/user') || pathname.startsWith('/api/admin')) {
      console.log('✅ Admin access granted')
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
    console.log('⛔ Admin access denied')
    return NextResponse.redirect(new URL('/unauthorized', origin))
  }
  
  // MANAGER can access manager and user routes
  if (userRole.toUpperCase() === 'MANAGER') {
    if (pathname.startsWith('/manager') || pathname.startsWith('/user') || pathname.startsWith('/api/manager')) {
      console.log('✅ Manager access granted')
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
    console.log('⛔ Manager access denied')
    return NextResponse.redirect(new URL('/unauthorized', origin))
  }
  
  // USER can only access user routes
  if (userRole.toUpperCase() === 'USER') {
    if (pathname.startsWith('/user') || pathname.startsWith('/api/user')) {
      console.log('✅ User access granted')
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
    console.log('⛔ User access denied')
    return NextResponse.redirect(new URL('/unauthorized', origin))
  }
  
  console.log('⛔ Unknown role:', userRole)
  return NextResponse.redirect(new URL('/unauthorized', origin))
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}