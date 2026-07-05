import prisma from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft, ShoppingBag, Heart, ArrowRight } from "lucide-react"
import { WishlistButton } from "@/components/storefront/wishlist-button"
import { AddToCartButton } from "@/components/storefront/add-to-cart-button"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic';

export default async function CategoryLandingPage() {
  const slug = "electronics-accessories";
  const theme = {
  "bg": "bg-gradient-to-r from-gray-800 to-slate-900",
  "text": "text-white",
  "pText": "text-gray-300",
  "linkBg": "bg-white text-gray-900 hover:bg-gray-100",
  "accentBorder": "hover:border-gray-800",
  "accentHoverBg": "hover:bg-gray-100",
  "title": "Tech & Gadgets",
  "desc": "Essential charging cables, batteries, and smart home accessories."
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
                  <div key={product.id} className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all flex flex-col h-full border border-gray-100 group relative">
                    <Link href={`/storefront/products/${product.id}`} className="relative aspect-square w-full mb-3 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 block">
                      {product.image_url ? (
                        <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-gray-300" /></div>
                      )}
                      {product.compare_at_price && (
                        <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-md z-10 shadow-sm animate-pulse">
                          Sale
                        </div>
                      )}
                    </Link>
                    <div className="absolute top-5 right-5 z-20">
                      <WishlistButton product={{ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url }} />
                    </div>
                    <div className="flex flex-col flex-1 mt-2">
                      <Link href={`/storefront/products/${product.id}`} className="text-xs md:text-sm font-bold text-gray-800 leading-tight line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                      </Link>
                      <div className="mt-auto flex items-end justify-between">
                        <div>
                          {product.compare_at_price && (
                            <div className="text-[10px] md:text-xs text-gray-400 line-through font-bold">
                              Rs. {parseFloat(product.compare_at_price).toFixed(0)}
                            </div>
                          )}
                          <div className="text-sm md:text-base font-black text-rose-500">
                            Rs. {parseFloat(product.price).toFixed(0)}
                          </div>
                        </div>
                        <AddToCartButton product={{...product, price: Number(product.price)}} variant="icon" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
