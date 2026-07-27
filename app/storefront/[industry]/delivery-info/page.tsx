import Link from "next/link"
import { ArrowLeft, Truck, Map, Clock, ShieldCheck } from "lucide-react"

export default function DeliveryInfoPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24 pt-6">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/storefront" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-900 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Delivery Information</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Fast Delivery</h3>
              <p className="text-sm text-gray-500">We aim to deliver most orders within 15-30 minutes.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Map className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Wide Coverage</h3>
              <p className="text-sm text-gray-500">Serving major metropolitan areas and expanding rapidly.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#ffc000]/20 text-[#ffc000] rounded-2xl flex items-center justify-center">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Delivery Fees & Minimums</h2>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="font-medium text-gray-600">Minimum Order Value</span>
              <span className="font-bold text-gray-900">Rs. 500</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="font-medium text-gray-600">Standard Delivery Fee</span>
              <span className="font-bold text-gray-900">Rs. 99</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <span className="font-medium text-gray-600">Orders above Rs. 2000</span>
              <span className="font-bold text-emerald-500">FREE</span>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Safe & Contactless Delivery</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your safety is our priority. You can choose "Leave at door" during checkout for a contactless delivery experience. Our riders are trained in hygienic handling of all grocery items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
