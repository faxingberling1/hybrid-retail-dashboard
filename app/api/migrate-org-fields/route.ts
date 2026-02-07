import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
    try {
        console.log('Starting migration...')

        // Add new columns to organizations table
        await db.query(`
            ALTER TABLE organizations 
            ADD COLUMN IF NOT EXISTS business_type VARCHAR(100),
            ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255),
            ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
            ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50),
            ADD COLUMN IF NOT EXISTS address TEXT,
            ADD COLUMN IF NOT EXISTS city VARCHAR(100),
            ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Pakistan'
        `)
        console.log('✓ Added columns to organizations table')

        // Update industry column type
        await db.query(`
            ALTER TABLE organizations 
            ALTER COLUMN industry TYPE VARCHAR(100)
        `)
        console.log('✓ Updated industry column type')

        // Add add_ons column to subscriptions table
        await db.query(`
            ALTER TABLE subscriptions 
            ADD COLUMN IF NOT EXISTS add_ons JSONB
        `)
        console.log('✓ Added add_ons column to subscriptions table')

        // Create indexes
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_organizations_industry ON organizations(industry)
        `)
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_organizations_city ON organizations(city)
        `)
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status)
        `)
        console.log('✓ Created indexes')

        return NextResponse.json({
            success: true,
            message: 'Migration completed successfully!'
        })
    } catch (error: any) {
        console.error('Migration failed:', error)
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
