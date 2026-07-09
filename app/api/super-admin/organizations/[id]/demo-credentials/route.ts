import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const organizationId = params.id;

    // Verify organization exists
    const org = await prisma.organizations.findUnique({
      where: { id: organizationId }
    });

    if (!org) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      );
    }

    // Generate credentials
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const safeOrgName = org.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const email = `admin_${safeOrgName}_${randomSuffix}@demo.hybridpos.pk`;
    const password = `Demo@${Math.random().toString(36).substring(2, 8)}${Math.floor(Math.random() * 100)}`;
    const hashedPassword = await hash(password, 12);

    const userId = crypto.randomUUID();

    // Create user
    await prisma.user.create({
      data: {
        id: userId,
        email,
        password_hash: hashedPassword,
        first_name: 'Demo',
        last_name: 'Admin',
        name: `Demo Admin (${org.name})`,
        role: 'ADMIN',
        organization_id: organizationId,
        is_active: true,
        is_verified: true,
      }
    });

    return NextResponse.json({
      success: true,
      credentials: {
        email,
        password
      }
    });

  } catch (error: any) {
    console.error('Error generating demo credentials:', error);
    return NextResponse.json(
      { error: 'Failed to generate demo credentials' },
      { status: 500 }
    );
  }
}
