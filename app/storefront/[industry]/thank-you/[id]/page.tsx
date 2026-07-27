import Link from "next/link"
import { CheckCircle2, Package, MapPin, ChevronRight, Trophy } from "lucide-react"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function ThankYouPage({ params }: { params: { id: string } }) {
  const { id } = await params
  
  const order = await prisma.storefrontOrder.findUnique({
    where: { id },
    include: {
      items: true,
      address: true
    }
  })

  if (!order) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 pb-24 px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-6">Your order <span className="font-bold text-gray-900">#{order.id.split('-')[0].toUpperCase()}</span> has been placed successfully. We'll start processing it right away.</p>
        
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-center justify-center gap-3">
          <div className="bg-[#ffc000] text-gray-900 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-sm font-black text-gray-900 uppercase tracking-widest">Rewards Earned</p>
            <p className="font-bold text-amber-700">+{Math.floor(Number(order.total_amount) * 0.05).toLocaleString()} Hybrid Points</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Order Summary</h3>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Total Items</span>
            <span className="font-bold text-gray-900">{order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-bold text-rose-500">Rs. {Number(order.total_amount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-bold text-gray-900 uppercase">{order.payment_method}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/storefront/track/${order.id}`} className="flex-1 bg-slate-900 text-white px-6 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2">
            <Package className="w-5 h-5" /> Track Order
          </Link>
          <Link href="/storefront" className="flex-1 bg-gray-100 text-gray-900 px-6 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  )
}
