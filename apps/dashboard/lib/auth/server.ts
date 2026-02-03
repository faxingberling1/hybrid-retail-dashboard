// @/lib/auth/server.ts - SERVER-SIDE ONLY
import { hash, compare } from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export function generatePasswordResetToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Server-only auth functions
export function validateEmailOnServer(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}