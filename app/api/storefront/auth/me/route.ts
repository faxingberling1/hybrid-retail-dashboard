import { NextResponse, NextRequest } from 'next/server';
import { verifyStorefrontToken } from '@/lib/jose';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('storefront_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = await verifyStorefrontToken(sessionToken);

    if (!payload || !payload.id) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const customer = await prisma.storefrontCustomer.findUnique({
      where: { id: payload.id as string },
      include: {
        orders: {
          orderBy: { created_at: 'desc' },
          include: {
            items: true
          }
        }
      }
    });

    if (!customer) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Map orders to the expected format
    const formattedOrders = customer.orders.map(order => ({
      id: order.id,
      date: order.created_at.toISOString().split('T')[0],
      total: Number(order.total_amount),
      status: order.status,
      items: order.items.reduce((acc, item) => acc + item.quantity, 0)
    }));

    return NextResponse.json({
      authenticated: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        points: 0,
        joinedDate: customer.created_at.toISOString().split('T')[0]
      },
      orders: formattedOrders
    });
  } catch (error) {
    console.error('Storefront me error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
