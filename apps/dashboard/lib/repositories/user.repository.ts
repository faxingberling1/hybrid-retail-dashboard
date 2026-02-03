import { pool } from '../db'
import { User, CreateUserInput } from '../models/user.model'

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT id, organization_id, email, first_name, last_name, role, phone, 
       avatar_url, is_active, is_verified, last_login_at, two_factor_enabled,
       email_verified_at, phone_verified_at, created_at, updated_at
       FROM users WHERE email = $1 AND deleted_at IS NULL`,
      [email]
    )
    return result.rows[0] || null
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT id, organization_id, email, first_name, last_name, role, phone, 
       avatar_url, is_active, is_verified, last_login_at, two_factor_enabled,
       email_verified_at, phone_verified_at, created_at, updated_at
       FROM users WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    )
    return result.rows[0] || null
  }

  async create(data: CreateUserInput): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (organization_id, email, password_hash, first_name, last_name, role, phone)
       VALUES ($1, $2, crypt($3, gen_salt('bf')), $4, $5, $6, $7)
       RETURNING id, organization_id, email, first_name, last_name, role, phone, 
       is_active, is_verified, created_at, updated_at`,
      [
        data.organization_id,
        data.email,
        data.password,
        data.first_name,
        data.last_name,
        data.role || 'user',
        data.phone
      ]
    )
    return result.rows[0]
  }

  async updateLastLogin(userId: string): Promise<void> {
    await pool.query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    )
  }

  async findAll(): Promise<User[]> {
    const result = await pool.query(
      `SELECT id, organization_id, email, first_name, last_name, role, phone, 
       avatar_url, is_active, is_verified, last_login_at, two_factor_enabled,
       email_verified_at, phone_verified_at, created_at, updated_at
       FROM users WHERE deleted_at IS NULL`
    )
    return result.rows
  }
}