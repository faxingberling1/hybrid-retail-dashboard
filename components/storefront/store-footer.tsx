"use client"

import Link from "next/link"
import { Store, Facebook, Instagram, Twitter } from "lucide-react"

export function StoreFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/storefront" className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-500 rounded-lg">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900">HybridRetail</span>
            </Link>
            <p className="text-sm text-gray-500">
              Your daily essentials, delivered in minutes. Groceries, snacks, baby care, and more at your fingertips.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-rose-500"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-rose-500"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-rose-500"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Categories</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="#" className="hover:text-rose-500 transition-colors">Fresh Produce</Link></li>
              <li><Link href="#" className="hover:text-rose-500 transition-colors">Meat & Seafood</Link></li>
              <li><Link href="#" className="hover:text-rose-500 transition-colors">Snacks & Beverages</Link></li>
              <li><Link href="#" className="hover:text-rose-500 transition-colors">Baby Care</Link></li>
              <li><Link href="#" className="hover:text-rose-500 transition-colors">Personal Care</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Customer Service</h3>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/storefront/help" className="hover:text-rose-500 transition-colors">Help Center</Link></li>
              <li><Link href="/storefront/track" className="hover:text-rose-500 transition-colors">Track Order</Link></li>
              <li><Link href="/storefront/return-policy" className="hover:text-rose-500 transition-colors">Return Policy</Link></li>
              <li><Link href="/storefront/delivery-info" className="hover:text-rose-500 transition-colors">Delivery Info</Link></li>
            </ul>
          </div>

          {/* App download */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4 uppercase tracking-wider text-sm">Download App</h3>
            <p className="text-sm text-gray-500 mb-4">Get the best experience on our mobile app.</p>
            <div className="flex flex-col gap-3">
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">App Store</button>
              <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">Google Play</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2026 HybridRetail. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link href="#" className="hover:text-gray-900">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-900">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
