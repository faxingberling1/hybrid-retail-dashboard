import { NextResponse } from 'next/server'
import { db, queryAll } from '@/lib/db'

export async function GET() {
  try {
    const invoices = await queryAll(`
      SELECT 
        i.*,
        o.name as organization_name
      FROM invoices i
      LEFT JOIN organizations o ON i.organization_id = o.id
      ORDER BY i.created_at DESC
    `)
    return NextResponse.json(invoices)
  } catch (error) {
    console.error('Failed to fetch invoices:', error)
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      organization_id, 
      invoice_number, 
      amount, 
      currency = 'PKR', 
      status = 'draft',
      due_date,
      notes,
      items
    } = body

    if (!organization_id || !invoice_number || amount === undefined || !items) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await db.query(
      `INSERT INTO invoices (
        organization_id, 
        invoice_number, 
        amount, 
        currency, 
        status, 
        due_date, 
        notes, 
        items
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [
        organization_id, 
        invoice_number, 
        amount, 
        currency, 
        status, 
        due_date ? new Date(due_date) : null, 
        notes || null, 
        JSON.stringify(items)
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error: any) {
    console.error('Failed to create invoice:', error)
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Invoice number already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}
