// lib/server-auth-utils.ts - UPDATED
// Server-side only - with dynamic imports

import bcrypt from 'bcryptjs'

/**
 * Hash a password using bcrypt (server-side)
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  } catch (error) {
    console.error('❌ hashPassword error:', error)
    throw new Error('Failed to hash password')
  }
}

/**
 * Verify a password against a bcrypt hash (server-side)
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    if (!password || !hashedPassword) {
      console.error(`❌ verifyPassword: Missing password (${!!password}) or hash (${!!hashedPassword})`)
      return false
    }

    console.log(`DEBUG: verifyPassword called with password prefix: ${password.substring(0, 2)}...`)
    console.log(`DEBUG: verifyPassword called with hash prefix: ${hashedPassword.substring(0, 10)}...`)

    if (!hashedPassword.match(/^\$2[aby]\$\d+\$/)) {
      console.error('❌ verifyPassword: Invalid bcrypt hash format')
      return false
    }

    const isValid = await bcrypt.compare(password, hashedPassword)
    console.log(`🔐 Password verification: ${isValid ? '✅ Valid' : '❌ Invalid'}`)
    return isValid
  } catch (error) {
    console.error('❌ BCrypt comparison error:', error)
    return false
  }
}

/**
 * Helper to check onboarding status (server-side)
 */
export async function checkOnboardingStatus(userId: string): Promise<{
  completed: boolean
  steps: number
  totalSteps: number
  organizationId?: string
}> {
  try {
    // Dynamic import for server-db
    const { db } = await import('./server-db')

    const result = await db.query(
      `SELECT 
        o.id as organization_id,
        COUNT(op.step_id) as completed_steps,
        (
          SELECT COUNT(DISTINCT step_id) 
          FROM onboarding_progress 
          WHERE organization_id = o.id
        ) as total_steps
      FROM users u
      JOIN organizations o ON u.organization_id = o.id
      LEFT JOIN onboarding_progress op ON o.id = op.organization_id AND op.completed = true
      WHERE u.id = $1
      GROUP BY o.id`,
      [userId]
    )

    if (result.rows.length === 0) {
      return {
        completed: false,
        steps: 0,
        totalSteps: 5
      }
    }

    const row = result.rows[0]
    const completedSteps = parseInt(row.completed_steps) || 0
    const totalSteps = parseInt(row.total_steps) || 5

    return {
      completed: completedSteps >= totalSteps,
      steps: completedSteps,
      totalSteps,
      organizationId: row.organization_id
    }
  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return {
      completed: false,
      steps: 0,
      totalSteps: 5
    }
  }
}

// Update other functions similarly - remove top-level import and use dynamic import inside functions