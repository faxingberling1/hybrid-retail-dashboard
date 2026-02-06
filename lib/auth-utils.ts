// ./lib/auth-utils.ts
'use client'

/**
 * This file is a proxy for client-side authentication utilities.
 * Avoid adding server-side imports or dynamic imports to server-only modules here.
 */

// Re-export everything from client utilities
export * from './client-auth-utils'

// Types
export type { PasswordStrength } from './types/password'
export type { OnboardingStep, OnboardingProgress } from './types/onboarding'
export type { UserOrganization } from './types/user'