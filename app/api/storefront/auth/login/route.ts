import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signStorefrontToken } from '@/lib/jose';

export async function POST(request: Request) {
  try {
    const { email, password, organization_id } = await request.json();

    if (!email || !password || !organization_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const customer = await prisma.storefrontCustomer.findUnique({
      where: {
        email_organization_id: {
          email,
          organization_id
        }
      }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, customer.password_hash);
    
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signStorefrontToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
      organization_id: customer.organization_id
    });

    const response = NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        points: 0,
        joinedDate: customer.created_at.toISOString().split('T')[0]
      }
    });

    response.cookies.set({
      name: 'storefront_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Storefront login error:', error);
    return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 });
  }
}
