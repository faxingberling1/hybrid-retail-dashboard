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
    '/api/public',
    '/auth',
    '/auth/signup', // Signup page
    '/api/auth/signup', // Signup API
    '/auth/verify',
    '/auth/accept-invite',
    '/unauthorized',
    '/api/onboarding',
    '/api/organizations',
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
  
  // === ONBOARDING CHECK - For authenticated users only ===
  // Only check for users with organization ID (new signups will have this)
  if (userOrganizationId) {
    const shouldCheckOnboarding = 
      !pathname.includes('/onboarding') &&
      !pathname.includes('/api/') &&
      !pathname.includes('/_next') &&
      !pathname.includes('.') &&
      !pathname.includes('/auth') &&
      pathname !== '/unauthorized' &&
      pathname !== '/login'
    
    if (shouldCheckOnboarding) {
      console.log('🔄 Checking onboarding status...')
      
      try {
        // Dynamic import to avoid middleware bundling issues
        const { db } = await import('@/lib/db')
        
        const result = await db.query(
          `SELECT 
            COUNT(op.step_id) as completed_steps_count
          FROM organizations o
          LEFT JOIN onboarding_progress op ON o.id = op.organization_id AND op.completed = true
          WHERE o.id = $1
          GROUP BY o.id`,
          [userOrganizationId]
        )
        
        if (result.rows.length > 0) {
          const completedSteps = parseInt(result.rows[0].completed_steps_count) || 0
          // We'll consider onboarding complete if they have at least 3 steps done
          const isOnboardingComplete = completedSteps >= 3
          
          console.log('📊 Onboarding status:', {
            organizationId: userOrganizationId,
            completedSteps,
            isOnboardingComplete
          })
          
          // If onboarding is NOT complete and user is accessing protected areas
          if (!isOnboardingComplete) {
            const isAccessingProtectedArea = 
              pathname.startsWith('/dashboard') ||
              pathname.startsWith('/admin') ||
              pathname.startsWith('/super-admin') ||
              pathname.startsWith('/user') ||
              pathname === '/'
            
            if (isAccessingProtectedArea) {
              console.log('🎯 Redirecting to onboarding - incomplete onboarding detected')
              return NextResponse.redirect(
                new URL(`/onboarding/${userOrganizationId}`, origin),
                {
                  headers: requestHeaders
                }
              )
            }
          }
          
          // If onboarding IS complete and user IS on an onboarding page
          if (isOnboardingComplete && pathname.includes('/onboarding')) {
            console.log('✅ Onboarding complete, redirecting to dashboard')
            return NextResponse.redirect(new URL('/dashboard', origin), {
              headers: requestHeaders
            })
          }
        } else {
          // No onboarding data found - assume new organization needs onboarding
          console.log('📝 No onboarding data found, checking if user is accessing protected areas')
          
          const isAccessingProtectedArea = 
            pathname.startsWith('/dashboard') ||
            pathname.startsWith('/admin') ||
            pathname.startsWith('/super-admin') ||
            pathname.startsWith('/user') ||
            pathname === '/'
          
          if (isAccessingProtectedArea) {
            console.log('🎯 Redirecting to onboarding - no onboarding data')
            return NextResponse.redirect(
              new URL(`/onboarding/${userOrganizationId}`, origin),
              {
                headers: requestHeaders
              }
            )
          }
        }
      } catch (error) {
        console.error('⚠️ Onboarding check failed:', error)
        // Don't block access if onboarding check fails
        console.log('⚠️ Continuing without onboarding check due to error')
      }
    }
  }
  
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
      '/admin',
      '/user',
      '/api/admin',
      '/api/user',
      '/dashboard',
      '/notifications',
      '/settings',
      '/profile',
      '/billing'
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
      '/manager',
      '/user',
      '/api/manager',
      '/api/user',
      '/dashboard',
      '/notifications',
      '/profile'
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
      '/user',
      '/api/user',
      '/dashboard',
      '/notifications',
      '/profile'
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