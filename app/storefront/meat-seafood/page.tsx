import prisma from "@/lib/prisma"
import Link from "next/link"
import { ProductCard } from "@/components/storefront/product-card"
import Image from "next/image"
import { ChevronRight, ChevronLeft, ShoppingBag, Heart, ArrowRight } from "lucide-react"
import { WishlistButton } from "@/components/storefront/wishlist-button"
import { AddToCartButton } from "@/components/storefront/add-to-cart-button"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic';

export default async function CategoryLandingPage() {
  const slug = "meat-seafood";
  const theme = {
  "bg": "bg-gradient-to-r from-rose-600 to-rose-800",
  "text": "text-white",
  "pText": "text-rose-50",
  "linkBg": "bg-white text-rose-700 hover:bg-rose-50",
  "accentBorder": "hover:border-rose-600",
  "accentHoverBg": "hover:bg-rose-50",
  "title": "Premium Cuts & Fresh Catch",
  "desc": "From succulent steaks to fresh Atlantic salmon. Sourced from the finest local and international suppliers."
};

  // Fetch Main Category
  const category = await prisma.storefrontCategory.findFirst({
    where: { slug },
    include: {
      children: true
    }
  })

  if (!category) {
    return notFound()
  }

  // Fetch all products for these subcategories
  const subCategoryIds = category.children.map(c => c.id)
  
  const products = await prisma.storefrontProduct.findMany({
    where: {
      category_id: { in: subCategoryIds },
      is_active: true
    },
    include: {
      category: true
    }
  })

  // Group products by subcategory
  const productsBySubCategory: Record<string, any[]> = {}
  category.children.forEach(subCat => {
    productsBySubCategory[subCat.name] = products.filter(p => p.category_id === subCat.id)
  })

  return (
    <main className="bg-gray-50 min-h-screen pb-24">
      {/* Dynamic Hero Banner */}
      <div className={`${theme.bg} ${theme.text} pt-12 pb-16 px-4 relative overflow-hidden transition-colors duration-500`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="max-w-2xl">
            <Link 
              href="/storefront" 
              className={`inline-flex items-center text-sm font-bold ${slug === 'baby-care' || slug === 'breakfast-cereals' || slug === 'stationery-office-supplies' || slug === 'desserts-ice-cream' ? 'text-slate-900 hover:text-black bg-white/40 hover:bg-white/60' : 'text-white hover:text-white/90 bg-black/20 hover:bg-black/30'} backdrop-blur-md px-4 py-2 rounded-full transition-colors w-fit mb-6`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Store
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              {theme.title || category.name}
            </h1>
            <p className={`text-lg md:text-xl font-medium ${theme.pText} mb-8 max-w-xl`}>
              {theme.desc || `Explore our curated selection of premium ${category.name.toLowerCase()} products, delivered right to your door.`}
            </p>
            <Link 
              href={`/storefront/products?category=${category.slug}`} 
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all ${theme.linkBg}`}
            >
              Shop All {category.name} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Navigation Pills */}
      {category.children.length > 0 && (
        <div className="bg-white border-b border-gray-200 sticky top-[64px] z-30 shadow-sm">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex overflow-x-auto py-4 gap-3 no-scrollbar items-center">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap pr-2">Jump To:</span>
              {category.children.map(subCat => (
                <a 
                  key={subCat.id}
                  href={`#${subCat.slug}`}
                  className={`whitespace-nowrap px-5 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-bold text-gray-700 ${theme.accentBorder} ${theme.accentHoverBg} transition-colors`}
                >
                  {subCat.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-6xl pt-12 space-y-16">
        {category.children.map(subCat => {
          const catProducts = productsBySubCategory[subCat.name] || []
          
          if (catProducts.length === 0) return null; // Don't show empty sections

          return (
            <div key={subCat.id} id={subCat.slug} className="scroll-mt-[140px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  {subCat.name}
                </h2>
                <Link 
                  href={`/storefront/products?category=${subCat.slug}`} 
                  className="text-sm font-bold text-indigo-500 hover:text-indigo-600 flex items-center transition-colors"
                >
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {catProducts.map(product => (
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
          )
        })}
      </div>
    </main>
  )
}
