// apps/dashboard/app/api/database/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/services/database.service';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'tables':
        const tables = await DatabaseService.getTables();
        return NextResponse.json({ success: true, tables });

      case 'stats':
        const stats = await DatabaseService.getDatabaseStats();
        return NextResponse.json({ success: true, stats });

      case 'health':
        const health = await DatabaseService.getHealthStatus();
        return NextResponse.json({ success: true, health });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'execute_query':
        if (!data.query) {
          return NextResponse.json(
            { success: false, error: 'Query is required' },
            { status: 400 }
          );
        }
        const queryResult = await DatabaseService.executeQuery(data.query);
        return NextResponse.json(queryResult);

      case 'table_data':
        if (!data.tableName) {
          return NextResponse.json(
            { success: false, error: 'Table name is required' },
            { status: 400 }
          );
        }
        const tableData = await DatabaseService.getTableData(
          data.tableName,
          data.page || 1,
          data.pageSize || 10
        );
        return NextResponse.json({ success: true, ...tableData });

      case 'insert_data':
        if (!data.tableName || !data.data) {
          return NextResponse.json(
            { success: false, error: 'Table name and data are required' },
            { status: 400 }
          );
        }
        const insertResult = await DatabaseService.insertData(data.tableName, data.data);
        return NextResponse.json(insertResult);

      case 'update_data':
        if (!data.tableName || !data.id || !data.data) {
          return NextResponse.json(
            { success: false, error: 'Table name, id, and data are required' },
            { status: 400 }
          );
        }
        const updateResult = await DatabaseService.updateData(
          data.tableName,
          data.id,
          data.data,
          data.idColumn
        );
        return NextResponse.json(updateResult);

      case 'delete_data':
        if (!data.tableName || !data.id) {
          return NextResponse.json(
            { success: false, error: 'Table name and id are required' },
            { status: 400 }
          );
        }
        const deleteResult = await DatabaseService.deleteData(
          data.tableName,
          data.id,
          data.idColumn
        );
        return NextResponse.json(deleteResult);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}