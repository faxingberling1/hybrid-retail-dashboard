// ./lib/models/activity.model.ts
import { connectDB } from '@/lib/db';

export interface Activity {
  id: string;
  organizationId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export class ActivityModel {
  static async create(data: Omit<Activity, 'id' | 'createdAt'>): Promise<Activity> {
    const pool = await connectDB();
    const query = `
      INSERT INTO activities (
        organization_id, user_id, action, entity_type, entity_id,
        details, ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      data.organizationId,
      data.userId,
      data.action,
      data.entityType,
      data.entityId,
      data.details ? JSON.stringify(data.details) : null,
      data.ipAddress,
      data.userAgent
    ]);
    
    return this.mapActivity(result.rows[0]);
  }

  static async findByOrganization(organizationId: string, limit: number = 100): Promise<Activity[]> {
    const pool = await connectDB();
    const result = await pool.query(
      'SELECT * FROM activities WHERE organization_id = $1 ORDER BY created_at DESC LIMIT $2',
      [organizationId, limit]
    );
    
    return result.rows.map(row => this.mapActivity(row));
  }

  static async findByUser(userId: string, limit: number = 50): Promise<Activity[]> {
    const pool = await connectDB();
    const result = await pool.query(
      'SELECT * FROM activities WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    
    return result.rows.map(row => this.mapActivity(row));
  }

  private static mapActivity(row: any): Activity {
    return {
      id: row.id,
      organizationId: row.organization_id,
      userId: row.user_id,
      action: row.action,
      entityType: row.entity_type,
      entityId: row.entity_id,
      details: row.details,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      createdAt: new Date(row.created_at)
    };
  }
}