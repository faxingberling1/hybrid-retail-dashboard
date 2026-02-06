import { pool } from '../db'

export interface Organization {
  id: string
  name: string
  industry: 'pharmacy' | 'fashion' | 'education' | 'healthcare' | 'general'
  subdomain: string
  owner_id: string
  settings: Record<string, any>
  subscription_plan: string
  subscription_status: string
  max_users: number
  is_active: boolean
  trial_ends_at: Date | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface CreateOrganizationInput {
  name: string
  industry: 'pharmacy' | 'fashion' | 'education' | 'healthcare' | 'general'
  subdomain: string
  owner_id: string
  settings?: Record<string, any>
  subscription_plan?: string
  max_users?: number
}

export class OrganizationRepository {
  async findById(id: string): Promise<Organization | null> {
    const result = await pool.query(
      `SELECT id, name, industry, subdomain, owner_id, settings, subscription_plan, 
       subscription_status, max_users, is_active, trial_ends_at, created_at, updated_at
       FROM organizations WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    )
    return result.rows[0] || null
  }

  async findBySubdomain(subdomain: string): Promise<Organization | null> {
    const result = await pool.query(
      `SELECT id, name, industry, subdomain, owner_id, settings, subscription_plan, 
       subscription_status, max_users, is_active, trial_ends_at, created_at, updated_at
       FROM organizations WHERE subdomain = $1 AND deleted_at IS NULL`,
      [subdomain]
    )
    return result.rows[0] || null
  }

  async findByOwner(ownerId: string): Promise<Organization[]> {
    const result = await pool.query(
      `SELECT id, name, industry, subdomain, owner_id, settings, subscription_plan, 
       subscription_status, max_users, is_active, trial_ends_at, created_at, updated_at
       FROM organizations WHERE owner_id = $1 AND deleted_at IS NULL
       ORDER BY created_at DESC`,
      [ownerId]
    )
    return result.rows
  }

  async create(data: CreateOrganizationInput): Promise<Organization> {
    const result = await pool.query(
      `INSERT INTO organizations (
        name, industry, subdomain, owner_id, settings, 
        subscription_plan, subscription_status, max_users
       ) VALUES ($1, $2, $3, $4, $5, $6, 'trial', $7)
       RETURNING id, name, industry, subdomain, owner_id, settings, 
       subscription_plan, subscription_status, max_users, is_active, 
       trial_ends_at, created_at, updated_at`,
      [
        data.name,
        data.industry,
        data.subdomain,
        data.owner_id,
        data.settings || {},
        data.subscription_plan || 'free',
        data.max_users || 10
      ]
    )
    return result.rows[0]
  }

  async update(
    id: string, 
    updates: Partial<{
      name: string
      industry: string
      subdomain: string
      settings: Record<string, any>
      subscription_plan: string
      subscription_status: string
      max_users: number
      is_active: boolean
      trial_ends_at: Date
    }>
  ): Promise<Organization | null> {
    const fields = []
    const values = []
    let paramCount = 1

    // Build dynamic update query
    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount}`)
      values.push(updates.name)
      paramCount++
    }
    if (updates.industry !== undefined) {
      fields.push(`industry = $${paramCount}`)
      values.push(updates.industry)
      paramCount++
    }
    if (updates.subdomain !== undefined) {
      fields.push(`subdomain = $${paramCount}`)
      values.push(updates.subdomain)
      paramCount++
    }
    if (updates.settings !== undefined) {
      fields.push(`settings = $${paramCount}`)
      values.push(JSON.stringify(updates.settings))
      paramCount++
    }
    if (updates.subscription_plan !== undefined) {
      fields.push(`subscription_plan = $${paramCount}`)
      values.push(updates.subscription_plan)
      paramCount++
    }
    if (updates.subscription_status !== undefined) {
      fields.push(`subscription_status = $${paramCount}`)
      values.push(updates.subscription_status)
      paramCount++
    }
    if (updates.max_users !== undefined) {
      fields.push(`max_users = $${paramCount}`)
      values.push(updates.max_users)
      paramCount++
    }
    if (updates.is_active !== undefined) {
      fields.push(`is_active = $${paramCount}`)
      values.push(updates.is_active)
      paramCount++
    }
    if (updates.trial_ends_at !== undefined) {
      fields.push(`trial_ends_at = $${paramCount}`)
      values.push(updates.trial_ends_at)
      paramCount++
    }

    if (fields.length === 0) {
      return null
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)

    const query = `
      UPDATE organizations 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount} AND deleted_at IS NULL
      RETURNING id, name, industry, subdomain, owner_id, settings, 
      subscription_plan, subscription_status, max_users, is_active, 
      trial_ends_at, created_at, updated_at
    `

    const result = await pool.query(query, values)
    return result.rows[0] || null
  }

  async softDelete(id: string): Promise<void> {
    await pool.query(
      'UPDATE organizations SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    )
  }

  async countByOwner(ownerId: string): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) FROM organizations WHERE owner_id = $1 AND deleted_at IS NULL',
      [ownerId]
    )
    return parseInt(result.rows[0].count, 10)
  }

  async isSubdomainAvailable(subdomain: string, excludeId?: string): Promise<boolean> {
    let query = 'SELECT COUNT(*) FROM organizations WHERE subdomain = $1 AND deleted_at IS NULL'
    const params: any[] = [subdomain]

    if (excludeId) {
      query += ' AND id != $2'
      params.push(excludeId)
    }

    const result = await pool.query(query, params)
    return parseInt(result.rows[0].count, 10) === 0
  }

  async updateSubscription(
    id: string,
    plan: string,
    status: string,
    trialEndsAt?: Date
  ): Promise<Organization | null> {
    const updates: any = {
      subscription_plan: plan,
      subscription_status: status
    }

    if (trialEndsAt) {
      updates.trial_ends_at = trialEndsAt
    }

    return this.update(id, updates)
  }
}