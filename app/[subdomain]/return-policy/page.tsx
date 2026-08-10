import Link from "next/link"
import { ArrowLeft, RefreshCw, Clock, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24 pt-6">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/storefront" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-900 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Return Policy</h1>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Our Guarantee</h2>
              <p className="text-sm text-gray-500">100% Satisfaction or your money back.</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-6">
              We want you to be completely satisfied with every purchase from our storefront. If you receive an item that is damaged, expired, or incorrect, we offer a hassle-free return and refund process.
            </p>

            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-indigo-500" /> Timeframe for Returns
            </h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-6">
              <li><strong>Fresh Produce & Perishables:</strong> Must be reported within 24 hours of delivery.</li>
              <li><strong>Packaged Groceries:</strong> Can be returned within 7 days of delivery if unopened.</li>
              <li><strong>Non-Food Items:</strong> Can be returned within 14 days of delivery in original packaging.</li>
            </ul>

            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Acceptable Return Conditions
            </h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-6">
              <li>Product was damaged or defective upon arrival.</li>
              <li>Product was expired at the time of delivery.</li>
              <li>You received an incorrect item.</li>
            </ul>

            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Non-Returnable Items
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              For health and safety reasons, we cannot accept returns on opened personal care items, baby formula, or partially consumed food products unless they are found to be defective.
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">How to initiate a return:</h4>
              <p className="text-sm text-gray-600">
                Please contact our customer support via the <Link href="/storefront/help" className="text-rose-500 hover:underline font-medium">Help Center</Link> with your Order ID and a photo of the item in question. We will process your refund or replacement immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
