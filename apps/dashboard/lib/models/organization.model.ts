export interface Organization {
  id: string
  name: string
  slug: string
  plan: 'basic' | 'pro' | 'enterprise'
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  billing_email?: string
  phone?: string
  address?: string
  country?: string
  timezone: string
  currency: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
}