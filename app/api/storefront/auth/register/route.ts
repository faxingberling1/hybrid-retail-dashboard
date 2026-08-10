import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signStorefrontToken } from '@/lib/jose';

export async function POST(request: Request) {
  try {
    const { name, email, password, organization_id } = await request.json();

    if (!name || !email || !password || !organization_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if customer already exists for this storefront
    const existing = await prisma.storefrontCustomer.findUnique({
      where: {
        email_organization_id: {
          email,
          organization_id
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Account already exists' }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const customer = await prisma.storefrontCustomer.create({
      data: {
        name,
        email,
        password_hash,
        organization_id
      }
    });

    // Create session token
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
    console.error('Storefront register error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
