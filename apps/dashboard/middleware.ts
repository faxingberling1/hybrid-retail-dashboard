import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl
  
  console.log('\n=== MIDDLEWARE START ===')
  console.log('📁 Path:', pathname)
  
  // Public paths
  const publicPaths = ['/login', '/api/auth', '/_next', '/favicon.ico']
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
  
  // Role-based access control
  const userRole = token.role as string
  console.log('👤 User role:', userRole)
  
  // SUPER_ADMIN can access everything
  if (userRole === 'SUPER_ADMIN') {
    console.log('✅ Super admin access granted')
    return NextResponse.next()
  }
  
  // ADMIN can access admin and user routes
  if (userRole === 'ADMIN') {
    if (pathname.startsWith('/admin') || pathname.startsWith('/user')) {
      console.log('✅ Admin access granted')
      return NextResponse.next()
    }
    console.log('⛔ Admin access denied')
    return NextResponse.redirect(new URL('/unauthorized', origin))
  }
  
  // USER can only access user routes
  if (userRole === 'USER') {
    if (pathname.startsWith('/user')) {
      console.log('✅ User access granted')
      return NextResponse.next()
    }
    console.log('⛔ User access denied')
    return NextResponse.redirect(new URL('/unauthorized', origin))
  }
  
  console.log('⛔ Unknown role')
  return NextResponse.redirect(new URL('/unauthorized', origin))
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}