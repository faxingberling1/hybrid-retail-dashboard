import Link from "next/link"
import { ArrowLeft, CheckSquare } from "lucide-react"

export default function StorefrontTermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24 pt-6">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/storefront" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-900 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Terms & Conditions</h1>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-amber-500" />
              1. Acceptance of Terms
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>
                By accessing or using our Storefront, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-amber-500" />
              2. User Obligations
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-4">
              <p>You are responsible for:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Maintaining the confidentiality of your account credentials.</li>
                <li>All activities that occur under your account.</li>
                <li>Providing accurate delivery and contact information.</li>
                <li>Notifying us immediately of any unauthorized use of your account.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-amber-500" />
              3. Service Usage & Ordering
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>
                All orders are subject to availability. We reserve the right to cancel or modify any order. Delivery times are estimates and may vary based on conditions. You must be present at the delivery address to receive your order.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckSquare className="h-6 w-6 text-amber-500" />
              4. Termination
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>
                We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </div>
          </section>
        </div>

        <div className="text-center text-gray-500 text-sm">
          Last Revision: February 2026
        </div>
      </div>
    </main>
  )
}
