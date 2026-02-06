// /proxy.ts (migrated from middleware.ts for Next.js 16)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl

  console.log('\n=== MIDDLEWARE START ===')
  console.log('📁 Path:', pathname)

  // Public paths - allow without authentication
  const publicPaths = [
    '/',
    '/home',
    '/index.html',
    '/docs.html',
    '/support.html',
    '/compliance.html',
    '/login',
    '/contact',
    '/api/auth',
    '/_next',
    '/favicon.ico',
    '/api/public',
    '/auth',
    '/auth/signup', // Signup page
    '/api/signup', // Signup API
    '/api/auth/signup', // Alternative signup API path
    '/auth/verify',
    '/auth/accept-invite',
    '/unauthorized',
    '/maintenance',
    '/api/onboarding',
    '/api/organizations',
    '/api/system/settings',
    '/images', // Allow image assets
    '/fonts', // Allow font assets
    '/icon.svg', // Allow favicon
    '/manifest.json', // Allow PWA manifest
  ]


  const isPublicPath = publicPaths.some(path =>
    pathname === path || pathname.startsWith(`${path}/`)
  )


  // Also check for static files
  const isStaticFile = pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/)

  if (isPublicPath || isStaticFile) {
    console.log('✅ Public/static path, allowing access')
    return NextResponse.next()
  }

  // Get token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key'
  })

  console.log('🔐 Token found:', !!token)

  // Redirect to login if no token
  if (!token) {
    console.log('❌ No token, redirecting to login')
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('callbackUrl', encodeURI(pathname))
    return NextResponse.redirect(loginUrl)
  }

  // Extract user data from token
  const userRole = (token.role as string) || ''
  const userEmail = (token.email as string) || ''
  const userId = token.sub || token.id || ''
  const userOrganizationId = (token.organizationId as string) || ''

  console.log('👤 User info:', {
    role: userRole,
    email: userEmail,
    id: userId,
    orgId: userOrganizationId
  })

  // Create headers with user information
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-role', userRole)
  requestHeaders.set('x-user-email', userEmail)
  requestHeaders.set('x-user-id', userId)
  if (userOrganizationId) {
    requestHeaders.set('x-user-organization-id', userOrganizationId)
  }

  // Check if user is admin (for convenience)
  const isAdmin = ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN', 'MANAGER'].includes(userRole.toUpperCase())
  requestHeaders.set('x-is-admin', isAdmin.toString())

  console.log('📤 Setting headers:', {
    'x-user-role': userRole,
    'x-user-email': userEmail,
    'x-user-id': userId,
    'x-user-organization-id': userOrganizationId,
    'x-is-admin': isAdmin.toString()
  })

  // === MAINTENANCE MODE CHECK ===
  // We'll rely on the GlobalMaintenanceBanner for the 'visual indicator on their screen' requirement
  // to allow Admins and Users to see the banner while still being able to access relevant dashboards.
  // The redirect was too restrictive based on the user's requirement for a 'visual indicator'.

  // === ONBOARDING CHECK - Disabled for Edge Runtime ===
  // Database queries are not supported in Edge Runtime (proxy)
  // Onboarding checks should be handled in page components or API routes instead

  // Allow access to onboarding pages regardless of role
  if (pathname.includes('/onboarding')) {
    console.log('✅ Onboarding page, allowing access')
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

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
    const allowedPaths = [
      '/',
      '/admin',
      '/user',
      '/api/admin',
      '/api/user',
      '/dashboard',
      '/notifications',
      '/settings',
      '/profile',
      '/billing',
      '/api/tickets',
      '/api/notifications',
      '/api/inventory',
      '/api/sales'
    ]

    const isAllowed = allowedPaths.some(path =>
      pathname === path || pathname.startsWith(`${path}/`)
    )

    if (isAllowed) {
      console.log('✅ Admin access granted')
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
    console.log('⛔ Admin access denied for path:', pathname)
    return NextResponse.redirect(new URL('/unauthorized', origin), {
      headers: requestHeaders
    })
  }

  // MANAGER can access manager and user routes
  if (userRole.toUpperCase() === 'MANAGER') {
    const allowedPaths = [
      '/',
      '/manager',
      '/user',
      '/api/manager',
      '/api/user',
      '/dashboard',
      '/notifications',
      '/profile',
      '/api/tickets',
      '/api/notifications',
      '/api/inventory',
      '/api/sales'
    ]

    const isAllowed = allowedPaths.some(path =>
      pathname === path || pathname.startsWith(`${path}/`)
    )

    if (isAllowed) {
      console.log('✅ Manager access granted')
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
    console.log('⛔ Manager access denied for path:', pathname)
    return NextResponse.redirect(new URL('/unauthorized', origin), {
      headers: requestHeaders
    })
  }

  // USER can only access user routes
  if (userRole.toUpperCase() === 'USER') {
    const allowedPaths = [
      '/',
      '/user',
      '/api/user',
      '/dashboard',
      '/notifications',
      '/profile',
      '/api/tickets',
      '/api/notifications',
      '/api/inventory',
      '/api/sales'
    ]

    const isAllowed = allowedPaths.some(path =>
      pathname === path || pathname.startsWith(`${path}/`)
    )

    if (isAllowed) {
      console.log('✅ User access granted')
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
    console.log('⛔ User access denied for path:', pathname)
    return NextResponse.redirect(new URL('/unauthorized', origin), {
      headers: requestHeaders
    })
  }

  // Fallback for new users (no role assigned yet)
  if (!userRole) {
    console.log('⚠️ No role assigned, redirecting to onboarding or dashboard')

    // If they have an organization ID, send to onboarding
    if (userOrganizationId) {
      return NextResponse.redirect(
        new URL(`/onboarding/${userOrganizationId}`, origin),
        {
          headers: requestHeaders
        }
      )
    }

    // Otherwise send to profile to complete setup
    return NextResponse.redirect(new URL('/profile', origin), {
      headers: requestHeaders
    })
  }

  console.log('⛔ Unknown role:', userRole)
  console.log('⛔ Path:', pathname)
  return NextResponse.redirect(new URL('/unauthorized', origin), {
    headers: requestHeaders
  })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
