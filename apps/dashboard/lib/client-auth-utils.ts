// lib/client-auth-utils.ts
// Client-side only - no database imports

/**
 * Validate password strength (client-side)
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  
  if (!password.match(/[A-Z]/)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!password.match(/[a-z]/)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!password.match(/[0-9]/)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!password.match(/[^A-Za-z0-9]/)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Generate a secure random password (client-side)
 */
export function generateSecurePassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
  let password = ''
  
  if (typeof window !== 'undefined' && window.crypto) {
    const randomValues = new Uint8Array(length)
    window.crypto.getRandomValues(randomValues)
    for (let i = 0; i < length; i++) {
      password += charset[randomValues[i] % charset.length]
    }
  } else {
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)]
    }
  }
  
  return password
}

/**
 * Helper to check if user is admin (client-side)
 */
export function isAdmin(role?: string): boolean {
  if (!role) return false
  const roleUpper = role.toUpperCase()
  return ['SUPER_ADMIN', 'SUPERADMIN', 'ADMIN', 'MANAGER'].includes(roleUpper)
}

/**
 * Helper to check if user is super admin (client-side)
 */
export function isSuperAdmin(role?: string): boolean {
  if (!role) return false
  const roleUpper = role.toUpperCase()
  return ['SUPER_ADMIN', 'SUPERADMIN'].includes(roleUpper)
}

/**
 * Helper to check if user has a specific role (client-side)
 */
export function hasRole(userRole?: string, requiredRole?: string | string[]): boolean {
  if (!userRole || !requiredRole) return false
  
  const userRoleUpper = userRole.toUpperCase()
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.some(role => 
      userRoleUpper === role.toUpperCase() ||
      (role.toUpperCase() === 'ADMIN' && isAdmin(userRole))
    )
  }
  
  return userRoleUpper === requiredRole.toUpperCase()
}

/**
 * Helper to get user role with fallback (client-side)
 */
export function getUserRole(session: any): string {
  return session?.user?.role || 'USER'
}

/**
 * Create user session data (client-side)
 */
export function createUserSessionData(user: any) {
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
      organizationId: user.organizationId,
      organizationName: user.organizationName,
      organizationIndustry: user.organizationIndustry
    },
    organizationId: user.organizationId,
    organizationName: user.organizationName,
    organizationIndustry: user.organizationIndustry
  }
}

/**
 * Get user organization info from session (client-side)
 */
export async function getUserOrganization(): Promise<{
  organizationId?: string
  organizationName?: string
  organizationIndustry?: string
}> {
  try {
    const { getSession } = await import('next-auth/react')
    const session = await getSession()
    
    if (!session?.user) {
      return {}
    }
    
    return {
      organizationId: session.user.organizationId,
      organizationName: session.user.organizationName,
      organizationIndustry: session.user.organizationIndustry,
    }
  } catch (error) {
    console.error('Error getting user organization:', error)
    return {}
  }
}