// ./lib/auth-utils.ts - FIXED VERSION
'use client'

// Re-export everything from client utilities
export * from './client-auth-utils'

// Types
export type { PasswordStrength } from './types/password'
export type { OnboardingStep, OnboardingProgress } from './types/onboarding'
export type { UserOrganization } from './types/user'

// Check if we're on server
const isServer = typeof window === 'undefined'

// Server functions with dynamic imports
export async function hashPassword(password: string): Promise<string> {
  if (!isServer) {
    throw new Error('hashPassword can only be used on the server side')
  }
  
  // Dynamic import for server-side only
  const { hashPassword: serverHashPassword } = await import('./server-auth-utils')
  return serverHashPassword(password)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!isServer) {
    throw new Error('verifyPassword can only be used on the server side')
  }
  
  // Dynamic import for server-side only
  const { verifyPassword: serverVerifyPassword } = await import('./server-auth-utils')
  return serverVerifyPassword(password, hash)
}