export interface User {
  id: string
  organization_id: string
  email: string
  first_name: string
  last_name: string
  role: 'super_admin' | 'admin' | 'manager' | 'user' | 'viewer'
  phone?: string
  avatar_url?: string
  is_active: boolean
  is_verified: boolean
  last_login_at?: Date
  two_factor_enabled: boolean
  email_verified_at?: Date
  phone_verified_at?: Date
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}

export interface CreateUserInput {
  organization_id: string
  email: string
  password: string
  first_name: string
  last_name: string
  role?: 'super_admin' | 'admin' | 'manager' | 'user' | 'viewer'
  phone?: string
}