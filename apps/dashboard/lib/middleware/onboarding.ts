// lib/middleware/onboarding.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function checkOnboardingStatus(
  request: NextRequest,
  userId: string,
  pathname: string
): Promise<NextResponse | null> {
  
  // Skip for API calls and static files
  if (
    pathname.includes('/api/') ||
    pathname.includes('/_next') ||
    pathname.includes('.')
  ) {
    return null
  }
  
  // Don't check if already on onboarding page
  if (pathname.includes('/onboarding')) {
    return null
  }
  
  // Don't check if accessing login or public pages
  if (pathname === '/login' || pathname === '/unauthorized') {
    return null
  }
  
  try {
    const result = await db.query(
      `SELECT 
        o.id as organization_id,
        COUNT(op.step_id) as completed_steps
      FROM users u
      JOIN organizations o ON u.organization_id = o.id
      LEFT JOIN onboarding_progress op ON o.id = op.organization_id AND op.completed = true
      WHERE u.id = $1
      GROUP BY o.id`,
      [userId]
    )
    
    if (result.rows.length === 0) {
      return null
    }
    
    const orgData = result.rows[0]
    const completedSteps = parseInt(orgData.completed_steps) || 0
    const isOnboardingComplete = completedSteps >= 5
    
    console.log('🎯 Onboarding check:', {
      userId,
      organizationId: orgData.organization_id,
      completedSteps,
      isOnboardingComplete
    })
    
    // If onboarding is NOT complete and user is trying to access protected areas
    if (!isOnboardingComplete) {
      const isAccessingProtectedArea = 
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/super-admin') ||
        pathname.startsWith('/user') ||
        pathname === '/'
      
      if (isAccessingProtectedArea) {
        return NextResponse.redirect(
          new URL(`/onboarding/${orgData.organization_id}`, request.url)
        )
      }
    }
    
  } catch (error) {
    console.error('⚠️ Onboarding middleware error:', error)
  }
  
  return null
}