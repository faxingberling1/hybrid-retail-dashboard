import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"

export default function StorefrontPrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-24 pt-6">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/storefront" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-gray-900 hover:bg-gray-50 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Privacy Policy</h1>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-indigo-500" />
              1. Information We Collect
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-4">
              <p>We collect information that you provide directly to us when using our Storefront:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Contact information (name, email, phone number)</li>
                <li>Delivery address and location details</li>
                <li>Order history and preferences</li>
                <li>Payment transaction records (processed securely)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-indigo-500" />
              2. How We Use Your Information
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>
                We use the information we collect to provide, maintain, and improve our services, process transactions, send related information including confirmations and receipts, and provide customer support.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-indigo-500" />
              3. Data Security
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no security system is impenetrable, and we cannot guarantee the security of our systems 100%.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-indigo-500" />
              4. Contact Us
            </h2>
            <div className="text-sm text-gray-600 leading-relaxed">
              <p>
                If you have any questions about this Privacy Policy, please contact our support team through the Help Center.
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
