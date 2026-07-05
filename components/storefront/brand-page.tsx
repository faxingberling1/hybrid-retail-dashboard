import React from "react"
import Link from "next/link"
import { ProductCard } from "@/components/storefront/product-card"
import { queryAll } from "@/lib/db"
import { ArrowLeft, Store, MapPin, Package, Award, Sparkles } from "lucide-react"

interface BrandPageProps {
  brandName: string
  searchKeyword: string
  logoUrl: string
  bannerBg: string
}

export async function BrandPage({ brandName, searchKeyword, logoUrl, bannerBg }: BrandPageProps) {
  // Fetch all products matching the brand keyword
  const products = await queryAll(`
    SELECT p.id, p.name, p.price, p.compare_at_price, p.image_url, p.category_id,
           c.name as category_name
    FROM storefront_products p
    JOIN storefront_categories c ON p.category_id = c.id
    WHERE p.is_active = true 
    AND p.name ILIKE $1
    ORDER BY p.created_at DESC
  `, [`%${searchKeyword}%`])

  // Group products by category
  const groupedProducts: Record<string, { categoryName: string; products: typeof products }> = {}
  
  products.forEach(product => {
    if (!groupedProducts[product.category_id]) {
      groupedProducts[product.category_id] = {
        categoryName: product.category_name,
        products: []
      }
    }
    groupedProducts[product.category_id].products.push(product)
  })

  const subcategories = Object.values(groupedProducts)

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Brand Hero Banner */}
      <div className={`w-full py-12 lg:py-20 ${bannerBg} border-b border-black/5`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-3xl shadow-xl flex items-center justify-center overflow-hidden flex-shrink-0 border-4 border-white">
              <img 
                src={logoUrl} 
                alt={`${brandName} Logo`} 
                className="w-full h-full object-contain p-4"
              />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/50 backdrop-blur-md rounded-full text-sm font-bold text-gray-800 mb-4 border border-white/50">
                <Award className="w-4 h-4 text-amber-500" />
                Featured Brand Partner
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 mb-4 drop-shadow-sm">
                {brandName}
              </h1>
              <p className="text-lg md:text-xl text-gray-700 font-medium max-w-2xl drop-shadow-sm">
                Discover the finest selection of {brandName} products, delivered fresh to your door in minutes.
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl font-bold text-sm text-gray-800 backdrop-blur-md">
                  <Package className="w-4 h-4 text-indigo-600" />
                  {products.length} Products
                </div>
                <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl font-bold text-sm text-gray-800 backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  {subcategories.length} Categories
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Back Navigation */}
          <Link 
            href="/storefront" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-10 transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 hover:border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Storefront
          </Link>

          {products.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 p-12 lg:p-20 text-center shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                Products Arriving Soon!
              </h2>
              <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                We are actively working on bringing {brandName} products to our catalog. Please check back later.
              </p>
              <Link 
                href="/storefront" 
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white rounded-xl font-bold mt-8 hover:bg-black transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-16">
              {subcategories.map((sub, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3">
                      {sub.categoryName}
                      <span className="text-sm font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
                        {sub.products.length} items
                      </span>
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {sub.products.map(product => (
                      <ProductCard 
                        key={product.id}
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          compareAtPrice: product.compare_at_price,
                          imageUrl: product.image_url
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
