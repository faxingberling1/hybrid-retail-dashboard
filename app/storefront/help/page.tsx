import Link from "next/link"
import { ArrowLeft, MessageCircle, Phone, Mail, FileText, ChevronRight } from "lucide-react"

export default function HelpCenterPage() {
  const faqs = [
    { q: "How long does delivery take?", a: "We aim to deliver all grocery orders within 15-30 minutes depending on your location and traffic conditions." },
    { q: "What payment methods do you accept?", a: "We accept Cash on Delivery, Easypaisa, JazzCash, and all major Credit/Debit Cards." },
    { q: "Can I track my order?", a: "Yes! Once you place an order, you will be redirected to an order tracking page where you can see live updates." },
    { q: "What is your refund policy?", a: "If you receive damaged goods or incorrect items, please contact support within 24 hours for a full refund or replacement." }
  ]

  return (
    <main className="min-h-screen bg-gray-50 pb-24 pt-6">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/storefront" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-900 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Help Center</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Live Chat</h3>
              <p className="text-sm text-gray-500">Typically replies in 2m</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Call Us</h3>
              <p className="text-sm text-gray-500">UAN: 111-123-456</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-emerald-500" /> Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          Still need help? <a href="mailto:support@storefront.com" className="font-bold text-rose-500 hover:underline">Email us</a>
        </div>
      </div>
    </main>
  )
}
