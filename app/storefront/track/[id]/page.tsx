import Link from "next/link"
import { ArrowLeft, MapPin, Package, CheckCircle2, Clock, Truck, Phone, Navigation } from "lucide-react"
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

      <div className="container mx-auto px-4 max-w-2xl -mt-16 relative z-20">
        
        {/* Live ETA Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-6 flex justify-between items-center">
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
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-6 flex items-center justify-between">
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

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Number</p>
              <p className="font-black text-gray-900">#{order.id.split('-')[0].toUpperCase()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="font-black text-[#ffc000]">Rs. {Number(order.total_amount).toLocaleString()}</p>
            </div>
          </div>

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

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-rose-500" /> Delivery Address
          </h2>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="font-bold text-slate-900 mb-1">{order.address?.name}</p>
            <p className="text-sm text-slate-600 mb-1">{order.address?.street}, {order.address?.city}</p>
            <p className="text-sm text-slate-600">{order.address?.phone}</p>
          </div>
        </div>

      </div>
    </main>
  )
}
