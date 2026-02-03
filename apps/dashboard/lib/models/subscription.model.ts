// ./lib/models/subscription.model.ts
import { connectDB } from '@/lib/db';

export interface Subscription {
  id: string;
  organizationId: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trial';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  priceId?: string;
  quantity: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class SubscriptionModel {
  static async create(data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subscription> {
    const pool = await connectDB();
    const query = `
      INSERT INTO subscriptions (
        organization_id, plan, status, current_period_start, current_period_end,
        cancel_at_period_end, stripe_customer_id, stripe_subscription_id,
        price_id, quantity, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      data.organizationId,
      data.plan,
      data.status,
      data.currentPeriodStart,
      data.currentPeriodEnd,
      data.cancelAtPeriodEnd,
      data.stripeCustomerId,
      data.stripeSubscriptionId,
      data.priceId,
      data.quantity,
      data.metadata ? JSON.stringify(data.metadata) : null
    ]);
    
    return this.mapSubscription(result.rows[0]);
  }

  static async findByOrganization(organizationId: string): Promise<Subscription | null> {
    const pool = await connectDB();
    const result = await pool.query(
      'SELECT * FROM subscriptions WHERE organization_id = $1',
      [organizationId]
    );
    
    return result.rows.length > 0 ? this.mapSubscription(result.rows[0]) : null;
  }

  static async update(
    subscriptionId: string,
    updates: Partial<Omit<Subscription, 'id' | 'createdAt'>>
  ): Promise<Subscription | null> {
    const pool = await connectDB();
    
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        // Convert camelCase to snake_case for database
        const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        fields.push(`${dbKey} = $${paramCount}`);
        
        if (key === 'metadata' && typeof value === 'object') {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return null;
    }

    fields.push('updated_at = NOW()');
    values.push(subscriptionId);
    
    const query = `
      UPDATE subscriptions 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? this.mapSubscription(result.rows[0]) : null;
  }

  private static mapSubscription(row: any): Subscription {
    return {
      id: row.id,
      organizationId: row.organization_id,
      plan: row.plan,
      status: row.status,
      currentPeriodStart: new Date(row.current_period_start),
      currentPeriodEnd: new Date(row.current_period_end),
      cancelAtPeriodEnd: row.cancel_at_period_end,
      stripeCustomerId: row.stripe_customer_id,
      stripeSubscriptionId: row.stripe_subscription_id,
      priceId: row.price_id,
      quantity: row.quantity,
      metadata: row.metadata,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}