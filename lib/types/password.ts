export type PasswordStrength = {
  isValid: boolean
  score: number
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

export interface PasswordValidationOptions {
  minLength?: number
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumbers?: boolean
  requireSpecialChars?: boolean
  preventCommon?: boolean
}