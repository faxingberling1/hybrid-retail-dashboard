import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Package, Truck, Home } from "lucide-react"

export default async function ThankYouPage({
  params
}: {
  params: Promise<{ subdomain: string, id: string }>
}) {
  const resolvedParams = await params
  const { id, subdomain } = resolvedParams

  // Fetch the order
  const order = await prisma.storefrontOrder.findUnique({
    where: { id },
    include: {
      items: true,
      address: true,
      organization: true
    }
  })

  if (!order) {
    return notFound()
  }

  // Format date
  const orderDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(order.created_at))

  const scheduledDate = order.scheduled_for ? new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(order.scheduled_for)) : null

  return (
    <main className="min-h-screen bg-gray-50 pt-10 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div className="bg-emerald-500 p-8 text-center sm:p-12">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Order Confirmed!</h1>
            <p className="text-emerald-50 text-lg">Thank you for shopping with us.</p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-8 mb-8 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Order Number</p>
                <p className="text-lg font-bold text-gray-900 tracking-tight">#{order.id.split('-')[0].toUpperCase()}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-sm font-medium text-gray-500 mb-1">Order Date</p>
                <p className="text-gray-900 font-medium">{orderDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-indigo-500" />
                  Delivery Details
                </h3>
                
                {order.address && (
                  <div className="bg-gray-50 rounded-2xl p-5 mb-4">
                    <p className="font-bold text-gray-900 mb-1">{order.address.name || 'Home'}</p>
                    <p className="text-gray-600 text-sm mb-1">{order.address.street}</p>
                    <p className="text-gray-600 text-sm mb-2">{order.address.city}, {order.address.state} {order.address.zip_code}</p>
                    <p className="text-gray-600 text-sm font-medium">{order.address.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-indigo-500" />
                  Order Summary
                </h3>
                <div className="bg-gray-50 rounded-2xl p-5">
                  <div className="space-y-3 mb-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium text-gray-900">
                          Rs {Number(item.price) * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-lg font-black text-indigo-600">Rs {Number(order.total_amount)}</span>
                  </div>
                  
                  <div className="mt-4 inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-600 border border-gray-200 uppercase tracking-wide">
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Paid'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
              <Link 
                href="/"
                className="flex-1 flex justify-center items-center py-4 px-6 rounded-xl font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                <Home className="w-5 h-5 mr-2" />
                Return to Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
