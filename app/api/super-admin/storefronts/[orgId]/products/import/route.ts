import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Papa from 'papaparse'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orgId } = await params
    
    // We expect multipart form data with a 'file'
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const text = await file.text()
    
    // Parse CSV
    const result = Papa.parse(text, { header: true, skipEmptyLines: true })
    if (result.errors.length > 0) {
      return NextResponse.json({ error: 'Failed to parse CSV', details: result.errors }, { status: 400 })
    }

    const rows = result.data as any[]
    let imported = 0
    let failed = 0

    // Begin transaction for bulk insert
    await db.query('BEGIN')

    for (const row of rows) {
      // Expected CSV headers: Name, Slug, Price, CategoryId, Description, Image_URL
      const { Name, Slug, Price, CategoryId, Description, Image_URL } = row
      
      if (!Name || !Slug || !Price || !CategoryId) {
        failed++
        continue
      }

      try {
        await db.query(
          `INSERT INTO storefront_products (name, slug, price, category_id, description, image_url, organization_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [Name, Slug, parseFloat(Price), CategoryId, Description || '', Image_URL || '', orgId]
        )
        imported++
      } catch (err) {
        console.error('Failed to insert row', row, err)
        failed++
      }
    }

    await db.query('COMMIT')

    return NextResponse.json({ success: true, imported, failed })
  } catch (error) {
    await db.query('ROLLBACK')
    console.error('Error importing products:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
