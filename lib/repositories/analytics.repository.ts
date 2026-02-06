import { pool } from '../db'

export interface AnalyticsStats {
  total_revenue: number
  total_orders: number
  total_customers: number
  active_users: number
  avg_order_value: number
  conversion_rate: number
}

export interface RevenueData {
  date: string
  revenue: number
}

export interface TopProduct {
  id: string
  name: string
  quantity: number
  revenue: number
}

export class AnalyticsRepository {
  async getDashboardStats(organizationId: string): Promise<AnalyticsStats> {
    // Get stats for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Total revenue
    const revenueResult = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) as total_revenue
       FROM orders 
       WHERE organization_id = $1 
         AND status = 'completed'
         AND created_at >= $2
         AND deleted_at IS NULL`,
      [organizationId, thirtyDaysAgo]
    )

    // Total orders
    const ordersResult = await pool.query(
      `SELECT COUNT(*) as total_orders
       FROM orders 
       WHERE organization_id = $1 
         AND created_at >= $2
         AND deleted_at IS NULL`,
      [organizationId, thirtyDaysAgo]
    )

    // Total customers (unique customers who placed orders)
    const customersResult = await pool.query(
      `SELECT COUNT(DISTINCT customer_id) as total_customers
       FROM orders 
       WHERE organization_id = $1 
         AND created_at >= $2
         AND deleted_at IS NULL`,
      [organizationId, thirtyDaysAgo]
    )

    // Active users (users who logged in last 7 days)
    const usersResult = await pool.query(
      `SELECT COUNT(*) as active_users
       FROM users 
       WHERE organization_id = $1 
         AND is_active = true
         AND last_login_at >= NOW() - INTERVAL '7 days'
         AND deleted_at IS NULL`,
      [organizationId]
    )

    // Average order value
    const avgOrderResult = await pool.query(
      `SELECT COALESCE(AVG(total_amount), 0) as avg_order_value
       FROM orders 
       WHERE organization_id = $1 
         AND status = 'completed'
         AND created_at >= $2
         AND deleted_at IS NULL`,
      [organizationId, thirtyDaysAgo]
    )

    // Conversion rate (orders / visits) - using mock for now
    const conversionRate = 2.5 // Mock value

    return {
      total_revenue: parseFloat(revenueResult.rows[0]?.total_revenue) || 0,
      total_orders: parseInt(ordersResult.rows[0]?.total_orders, 10) || 0,
      total_customers: parseInt(customersResult.rows[0]?.total_customers, 10) || 0,
      active_users: parseInt(usersResult.rows[0]?.active_users, 10) || 0,
      avg_order_value: parseFloat(avgOrderResult.rows[0]?.avg_order_value) || 0,
      conversion_rate: conversionRate
    }
  }

  async getRevenueByDateRange(
    organizationId: string,
    startDate: Date,
    endDate: Date,
    interval: 'day' | 'week' | 'month' = 'day'
  ): Promise<RevenueData[]> {
    let dateTrunc = 'day'
    
    switch (interval) {
      case 'week':
        dateTrunc = 'week'
        break
      case 'month':
        dateTrunc = 'month'
        break
    }

    const result = await pool.query(
      `SELECT 
         DATE_TRUNC($1, created_at) as date,
         COALESCE(SUM(total_amount), 0) as revenue
       FROM orders 
       WHERE organization_id = $2 
         AND status = 'completed'
         AND created_at BETWEEN $3 AND $4
         AND deleted_at IS NULL
       GROUP BY DATE_TRUNC($1, created_at)
       ORDER BY date`,
      [dateTrunc, organizationId, startDate, endDate]
    )

    return result.rows.map(row => ({
      date: new Date(row.date).toISOString().split('T')[0],
      revenue: parseFloat(row.revenue) || 0
    }))
  }

  async getTopProducts(
    organizationId: string,
    limit: number = 10,
    startDate?: Date,
    endDate?: Date
  ): Promise<TopProduct[]> {
    let dateFilter = ''
    const params: any[] = [organizationId, limit]

    if (startDate && endDate) {
      dateFilter = 'AND o.created_at BETWEEN $3 AND $4'
      params.push(startDate, endDate)
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      dateFilter = 'AND o.created_at >= $3'
      params.push(thirtyDaysAgo)
    }

    const query = `
      SELECT 
        p.id,
        p.name,
        SUM(oi.quantity) as quantity,
        SUM(oi.quantity * oi.unit_price) as revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN products p ON oi.product_id = p.id
      WHERE o.organization_id = $1
        AND o.status = 'completed'
        ${dateFilter}
        AND o.deleted_at IS NULL
        AND p.deleted_at IS NULL
      GROUP BY p.id, p.name
      ORDER BY revenue DESC
      LIMIT $2
    `

    const result = await pool.query(query, params)

    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      quantity: parseInt(row.quantity, 10) || 0,
      revenue: parseFloat(row.revenue) || 0
    }))
  }

  async getIndustryComparison(industry: string): Promise<{
    avg_revenue: number
    avg_orders: number
    avg_customers: number
  }> {
    // Get average stats for the given industry
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const result = await pool.query(
      `SELECT 
         COALESCE(AVG(revenue_stats.total_revenue), 0) as avg_revenue,
         COALESCE(AVG(order_stats.total_orders), 0) as avg_orders,
         COALESCE(AVG(customer_stats.total_customers), 0) as avg_customers
       FROM organizations o
       LEFT JOIN LATERAL (
         SELECT COALESCE(SUM(total_amount), 0) as total_revenue
         FROM orders 
         WHERE organization_id = o.id 
           AND status = 'completed'
           AND created_at >= $2
           AND deleted_at IS NULL
       ) revenue_stats ON true
       LEFT JOIN LATERAL (
         SELECT COUNT(*) as total_orders
         FROM orders 
         WHERE organization_id = o.id 
           AND created_at >= $2
           AND deleted_at IS NULL
       ) order_stats ON true
       LEFT JOIN LATERAL (
         SELECT COUNT(DISTINCT customer_id) as total_customers
         FROM orders 
         WHERE organization_id = o.id 
           AND created_at >= $2
           AND deleted_at IS NULL
       ) customer_stats ON true
       WHERE o.industry = $1 
         AND o.deleted_at IS NULL
         AND o.is_active = true`,
      [industry, thirtyDaysAgo]
    )

    return {
      avg_revenue: parseFloat(result.rows[0]?.avg_revenue) || 0,
      avg_orders: parseFloat(result.rows[0]?.avg_orders) || 0,
      avg_customers: parseFloat(result.rows[0]?.avg_customers) || 0
    }
  }

  async getUserActivity(
    organizationId: string,
    days: number = 7
  ): Promise<Array<{ date: string; active_users: number }>> {
    const result = await pool.query(
      `SELECT 
         DATE(last_login_at) as date,
         COUNT(*) as active_users
       FROM users 
       WHERE organization_id = $1 
         AND last_login_at >= NOW() - INTERVAL '${days} days'
         AND deleted_at IS NULL
       GROUP BY DATE(last_login_at)
       ORDER BY date`,
      [organizationId]
    )

    return result.rows.map(row => ({
      date: new Date(row.date).toISOString().split('T')[0],
      active_users: parseInt(row.active_users, 10) || 0
    }))
  }
}