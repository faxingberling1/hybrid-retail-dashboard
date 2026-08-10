import { StorefrontOrder, StorefrontOrderItem } from "@prisma/client"
import prisma from "@/lib/prisma"
import { Package, Truck, CheckCircle2, Clock, XCircle, Search, Calendar, ChevronRight } from "lucide-react"
import Link from "next/link"

export default async function OnlineOrdersPage() {
  let orders: (StorefrontOrder & { items: StorefrontOrderItem[] })[] = []
  let dbError = false

  try {
    orders = await prisma.storefrontOrder.findMany({
      include: {
        items: true,
        address: true,
      },
      orderBy: { created_at: 'desc' }
    })
  } catch (error) {
    console.error("Database connection failed:", error)
    dbError = true
  }

  // Mock data for display if database fails
  if (dbError || orders.length === 0) {
    orders = [
      {
        id: "mock-1234-abcd",
        status: "PENDING",
        total_amount: 4500 as any,
        payment_method: "cod",
        created_at: new Date(),
        items: [
          { name: "Sample Product", quantity: 2, price: 2250 as any } as any
        ]
      } as any
    ]
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'PENDING': return <Clock className="w-5 h-5 text-amber-500" />
      case 'CONFIRMED': return <CheckCircle2 className="w-5 h-5 text-indigo-500" />
      case 'SHIPPED': return <Truck className="w-5 h-5 text-blue-500" />
      case 'DELIVERED': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      case 'CANCELLED': return <XCircle className="w-5 h-5 text-rose-500" />
      default: return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'CONFIRMED': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'SHIPPED': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'CANCELLED': return 'bg-rose-100 text-rose-800 border-rose-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Online Orders</h1>
          <p className="text-gray-500 font-medium">Manage incoming orders from your storefront</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </button>
        </div>
      </div>

      {dbError && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-medium flex items-center">
          <XCircle className="w-5 h-5 mr-2" />
          Warning: Database connection failed. Showing mock data. Please ensure your DATABASE_URL is correct.
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {orders.map((order) => (
            <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                  {getStatusIcon(order.status)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-gray-900 tracking-tight">
                      #{order.id.split('-')[0].toUpperCase()}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(order.created_at))}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                    {order.items.length} items • {order.items.map(i => i.name).join(', ')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-gray-100">
                <div className="text-left md:text-right">
                  <p className="text-sm font-medium text-gray-500 mb-0.5">Total Amount</p>
                  <p className="text-lg font-black text-gray-900">Rs {Number(order.total_amount)}</p>
                </div>
                
                <Link href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


