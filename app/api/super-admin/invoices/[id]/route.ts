import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, organization_id, invoice_number, amount, due_date, notes, items } = body

    if (status && !organization_id) {
      // It's just a status update
      const paid_at = status === 'paid' ? new Date().toISOString() : null
      const result = await db.query(
        `UPDATE invoices 
         SET status = $1, paid_at = COALESCE(paid_at, $2)
         WHERE id = $3 
         RETURNING *`,
        [status, paid_at, id]
      )
      if (result.rows.length === 0) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
      return NextResponse.json(result.rows[0])
    } else {
      // It's a full draft update
      const result = await db.query(
        `UPDATE invoices 
         SET organization_id = $1, invoice_number = $2, amount = $3, due_date = $4, notes = $5, items = $6
         WHERE id = $7 AND status = 'draft'
         RETURNING *`,
        [
          organization_id, 
          invoice_number, 
          amount, 
          due_date ? new Date(due_date) : null, 
          notes || null, 
          JSON.stringify(items), 
          id
        ]
      )
      if (result.rows.length === 0) return NextResponse.json({ error: 'Draft invoice not found' }, { status: 404 })
      return NextResponse.json(result.rows[0])
    }
  } catch (error) {
    console.error('Failed to update invoice:', error)
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const result = await db.query(
      `DELETE FROM invoices WHERE id = $1 RETURNING id`,
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete invoice:', error)
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 })
  }
}
