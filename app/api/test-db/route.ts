import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    console.log('📡 Test-DB API: Checking database connectivity...');
    try {
        const result = await query('SELECT COUNT(*) as count FROM users');
        console.log('✅ Test-DB API: Connection successful. User count:', result.rows[0].count);

        return NextResponse.json({
            success: true,
            userCount: result.rows[0].count,
            database_host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0],
            node_env: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('❌ Test-DB API: Connection failed:', error.message);
        return NextResponse.json({
            success: false,
            error: error.message,
            detail: error.detail,
            hint: error.hint,
            code: error.code
        }, { status: 500 });
    }
}
