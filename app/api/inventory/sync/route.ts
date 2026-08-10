import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/inventory/sync
export async function POST(request: Request) {
  try {
    const { productId, storefrontCategoryId, isPublishing } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Get the physical POS product
    const posProduct = await prisma.products.findUnique({
      where: { id: productId }
    })

    if (!posProduct) {
      return NextResponse.json({ error: 'POS Product not found' }, { status: 404 })
    }

    if (!isPublishing) {
      // Unpublish: Delete the StorefrontProduct link
      await prisma.storefrontProduct.deleteMany({
        where: { pos_product_id: productId }
      })
      return NextResponse.json({ success: true, message: 'Unpublished successfully' })
    }

    // Publish / Sync
    // (Category logic handled below)

    // Create a safe slug
    const baseSlug = posProduct.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')
    const slug = baseSlug + '-' + Math.floor(Math.random() * 1000)

    // Upsert the StorefrontProduct
    const storefrontProduct = await prisma.storefrontProduct.upsert({
      where: {
        pos_product_id: productId
      },
      update: {
        name: posProduct.name,
        description: posProduct.description || '',
        price: posProduct.price,
        stock: posProduct.stock || 0,
        is_active: true
      },
      create: {
        name: posProduct.name,
        slug: slug,
        description: posProduct.description || '',
        price: posProduct.price,
        stock: posProduct.stock || 0,
        is_active: true,
        organization_id: posProduct.organization_id,
        pos_product_id: productId,
        category_id: storefrontCategoryId || (await prisma.storefrontCategory.findFirst({ where: { organization_id: posProduct.organization_id } }))?.id || (await prisma.storefrontCategory.create({ data: { name: 'Uncategorized', slug: 'uncategorized', organization_id: posProduct.organization_id || '' } })).id,
        images: []
      }
    })

    return NextResponse.json({ 
      success: true, 
      storefrontProduct 
    })

  } catch (error) {
    console.error('Inventory sync error:', error)
    return NextResponse.json({ error: 'Failed to sync inventory' }, { status: 500 })
  }
}
