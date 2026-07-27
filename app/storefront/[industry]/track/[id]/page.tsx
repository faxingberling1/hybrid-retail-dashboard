import Link from "next/link"
import { ArrowLeft, MapPin, Package, CheckCircle2, Clock, Truck, Phone, Navigation, FileText, ChevronRight, Gift, Download } from "lucide-react"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function TrackOrderPage({ params }: { params: { id: string } }) {
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

  // Fetch product images manually since there's no direct Prisma relation
  const productIds = order.items.map(item => item.product_id);
  const products = await prisma.storefrontProduct.findMany({
    where: { id: { in: productIds } },
    select: { id: true, image_url: true }
  });
  
  const productImages = products.reduce((acc, p) => {
    acc[p.id] = p.image_url;
    return acc;
  }, {} as Record<string, string | null>);

  // Determine current step based on status
  // PENDING -> PROCESSING -> SHIPPED -> DELIVERED
  let currentStep = 1;
  if (order.status === "PROCESSING") currentStep = 2;
  if (order.status === "SHIPPED") currentStep = 3;
  if (order.status === "DELIVERED") currentStep = 4;

  const steps = [
    { title: "Order Placed", desc: "We have received your order", icon: Package, done: currentStep >= 1, active: currentStep === 1 },
    { title: "Processing", desc: "Your items are being packed", icon: Clock, done: currentStep >= 2, active: currentStep === 2 },
    { title: "Out for Delivery", desc: "Rider is on the way", icon: Truck, done: currentStep >= 3, active: currentStep === 3 },
    { title: "Delivered", desc: "Order has been delivered", icon: CheckCircle2, done: currentStep >= 4, active: currentStep === 4 }
  ]

  // Mock ETA Calculation: Order created_at + 45 minutes
  const orderTime = new Date(order.created_at)
  const etaTime = new Date(orderTime.getTime() + 45 * 60000)
  const etaFormatted = etaTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Map Header Area */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden bg-slate-200 pointer-events-none sm:pointer-events-auto">
        {order.address ? (
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ border: 0 }} 
            src={`https://maps.google.com/maps?q=${encodeURIComponent(`${order.address.street}, ${order.address.city}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
            allowFullScreen
            className="absolute inset-0 z-0"
          ></iframe>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-500 font-bold">
            Address not found
          </div>
        )}

        {/* Shadow Overlay to blend with content below */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none"></div>

        {/* Back Button */}
        <div className="absolute top-6 left-4 z-20 pointer-events-auto">
          <Link href={`/storefront/thank-you/${order.id}`} className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-gray-100 text-gray-900 hover:bg-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl -mt-16 relative z-20">
        
        {/* Promotional Banner */}
        <div className="bg-gradient-to-r from-rose-500 to-indigo-600 rounded-3xl p-6 text-white mb-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center flex-shrink-0">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight">Get 10% Off Your Next Order!</h3>
              <p className="text-white/80 text-sm font-medium">Use code <span className="bg-white/20 px-2 py-0.5 rounded text-white font-mono font-bold tracking-widest">TRACK10</span> at checkout.</p>
            </div>
          </div>
          <Link href="/storefront" className="relative z-10 px-6 py-3 bg-white text-indigo-600 font-black text-sm uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap shadow-md">
            Shop Now
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Tracking Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live ETA Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Estimated Delivery</p>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900">{etaFormatted}</h2>
              </div>
              {currentStep === 3 && (
                <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full font-bold text-sm animate-pulse">
                  <Navigation className="w-4 h-4" /> Live
                </div>
              )}
            </div>

            {/* Rider Details (Mock) */}
            {currentStep >= 3 && (
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Rider" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Ali Khan</h3>
                    <p className="text-xs text-slate-500">Honda CD-70 • ABC-1234</p>
                  </div>
                </div>
                <button className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center hover:bg-green-100 transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="relative pl-6 py-4">
                {/* Vertical Line */}
                <div className="absolute left-[35px] top-8 bottom-8 w-1 bg-slate-100 rounded-full"></div>
                
                {/* Steps */}
                <div className="space-y-8 relative z-10">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm border-4 border-white relative transition-colors duration-500 ${step.done ? (step.active ? 'bg-[#ffc000] text-gray-900' : 'bg-slate-900 text-white') : 'bg-slate-100 text-slate-400'}`}>
                        <step.icon className="h-6 w-6" />
                        {step.active && (
                          <div className="absolute -inset-1 rounded-full border-2 border-[#ffc000] animate-ping opacity-50"></div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className={`font-black text-lg ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</h3>
                        <p className={`text-sm ${step.done ? 'text-slate-600' : 'text-slate-400'}`}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-rose-500" /> Delivery Address
              </h2>
              <div className="bg-slate-50 rounded-xl p-4 border border-gray-100">
                <p className="font-bold text-slate-900 mb-1 text-lg">{order.address?.name}</p>
                <p className="text-sm text-slate-600 mb-1 leading-relaxed">{order.address?.street}, {order.address?.city}</p>
                <p className="text-sm font-bold text-slate-600">{order.address?.phone}</p>
              </div>
            </div>

          </div>

          {/* Details Sidebar Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Details</p>
                  <p className="font-black text-gray-900 text-xl">#{order.id.split('-')[0].toUpperCase()}</p>
                </div>
                <Link href={`/invoice/${order.id}`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors border border-indigo-100 group">
                  <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" /> View Invoice
                </Link>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100">
                      {productImages[item.product_id] ? (
                        <img src={productImages[item.product_id]!} alt={item.name} className="w-full h-full object-cover mix-blend-multiply p-1" />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-black text-gray-900 mt-1">Rs. {Number(item.price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3 mb-6">
                <div className="flex justify-between text-sm font-medium text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900">Rs. {(Number(order.total_amount) - Number(order.delivery_fee) + Number(order.discount_amount)).toLocaleString()}</span>
                </div>
                {Number(order.delivery_fee) > 0 && (
                  <div className="flex justify-between text-sm font-medium text-gray-500">
                    <span>Delivery</span>
                    <span className="text-gray-900">Rs. {Number(order.delivery_fee).toLocaleString()}</span>
                  </div>
                )}
                {Number(order.discount_amount) > 0 && (
                  <div className="flex justify-between text-sm font-medium text-emerald-500">
                    <span>Discount</span>
                    <span>- Rs. {Number(order.discount_amount).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="font-bold text-gray-900 uppercase tracking-widest text-xs">Total</span>
                  <span className="text-2xl font-black text-indigo-600">Rs. {Number(order.total_amount).toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between border border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Payment</span>
                <span className="text-sm font-black text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm border border-gray-200">{order.payment_method}</span>
              </div>

            </div>
              {/* Advertisement Banner */}
              <div className="bg-slate-900 rounded-3xl p-1 overflow-hidden relative group cursor-pointer shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-indigo-500 to-slate-900 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative bg-slate-900 rounded-[22px] p-6 text-white flex flex-col justify-between overflow-hidden min-h-[220px]">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-30"></div>
                   <div className="flex justify-between items-start mb-8 relative z-10">
                     <span className="px-2 py-1 bg-white/10 rounded uppercase tracking-widest text-[10px] font-bold">Sponsored</span>
                     <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="h-6 w-auto filter invert opacity-80" alt="Apple" />
                   </div>
                   <div className="relative z-10">
                     <h4 className="text-xl font-black mb-1">AirPods Pro (2nd Gen)</h4>
                     <p className="text-slate-400 text-sm mb-4">Immersive sound with active noise cancellation.</p>
                     <button className="text-sm font-bold bg-white text-slate-900 px-4 py-2 rounded-xl hover:scale-105 transition-transform shadow-md">
                       Shop Apple
                     </button>
                   </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  )
}

