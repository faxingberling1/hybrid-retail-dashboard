import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { items, total_amount, payment_method, shipping_address, delivery_fee, discount_amount, scheduled_for } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Since we don't have authenticated users yet, we'll create a dummy order
    // In a real app, we'd get the user ID from the session
    // For now we just create the order without a user_id
    
    // First, let's create an address record
    const address = await prisma.storefrontAddress.create({
      data: {
        name: "Home",
        street: shipping_address.street,
        city: shipping_address.city,
        state: shipping_address.state,
        zip_code: shipping_address.postalCode,
        phone: shipping_address.phone,
        is_default: true
      }
    })

    // Now create the order
    const order = await prisma.storefrontOrder.create({
      data: {
        total_amount: total_amount,
        delivery_fee: delivery_fee || 0,
        discount_amount: discount_amount || 0,
        scheduled_for: scheduled_for ? new Date(scheduled_for) : null,
        status: "PENDING",
        payment_status: payment_method === "cod" ? "PENDING" : "PAID",
        payment_method: payment_method,
        address_id: address.id,
        items: {
          create: items.map((item: any) => ({
            product_id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      id: order.id
    })

  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
