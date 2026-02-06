// ./lib/models/transaction.model.ts
import { connectDB } from '@/lib/db';

export interface Transaction {
  id: string;
  organizationId: string;
  userId: string;
  type: 'subscription' | 'one_time' | 'refund' | 'credit';
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  description: string;
  stripePaymentIntentId?: string;
  stripeInvoiceId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export class TransactionModel {
  static async create(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const pool = await connectDB();
    const query = `
      INSERT INTO transactions (
        organization_id, user_id, type, amount, currency, status,
        description, stripe_payment_intent_id, stripe_invoice_id, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      data.organizationId,
      data.userId,
      data.type,
      data.amount,
      data.currency,
      data.status,
      data.description,
      data.stripePaymentIntentId,
      data.stripeInvoiceId,
      data.metadata ? JSON.stringify(data.metadata) : null
    ]);
    
    return this.mapTransaction(result.rows[0]);
  }

  static async findByOrganization(organizationId: string, limit: number = 50): Promise<Transaction[]> {
    const pool = await connectDB();
    const result = await pool.query(
      'SELECT * FROM transactions WHERE organization_id = $1 ORDER BY created_at DESC LIMIT $2',
      [organizationId, limit]
    );
    
    return result.rows.map(row => this.mapTransaction(row));
  }

  static async findByUser(userId: string, limit: number = 50): Promise<Transaction[]> {
    const pool = await connectDB();
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2',
      [userId, limit]
    );
    
    return result.rows.map(row => this.mapTransaction(row));
  }

  private static mapTransaction(row: any): Transaction {
    return {
      id: row.id,
      organizationId: row.organization_id,
      userId: row.user_id,
      type: row.type,
      amount: parseFloat(row.amount),
      currency: row.currency,
      status: row.status,
      description: row.description,
      stripePaymentIntentId: row.stripe_payment_intent_id,
      stripeInvoiceId: row.stripe_invoice_id,
      metadata: row.metadata,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
}