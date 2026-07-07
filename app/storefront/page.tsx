import { db, queryAll } from "@/lib/db"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ShoppingBag, Zap, Award } from "lucide-react"
import { HeroCarousel } from "@/components/storefront/hero-carousel"
import { FlashDealsTimer } from "@/components/storefront/flash-deals-timer"
import { AddToCartButton } from "@/components/storefront/add-to-cart-button"
import { ProductCard } from "@/components/storefront/product-card"

export const revalidate = 60 // revalidate every minute

export default async function StorefrontShopPage() {
  // Fetch all categories and organize them
  const allCategories = await queryAll(
    'SELECT * FROM storefront_categories WHERE is_active = true ORDER BY name ASC'
  )

  // Separate parents and children
  const parentCategories = allCategories.filter((c: any) => c.parent_id === null)
  const childCategories = allCategories.filter((c: any) => c.parent_id !== null)

  // Fetch all active products
  const allProducts = await queryAll(
    'SELECT * FROM storefront_products WHERE is_active = true ORDER BY created_at DESC'
  )

  // Organize for the homepage display
  const sections = parentCategories.map((parent: any) => {
    const children = childCategories.filter((child: any) => child.parent_id === parent.id)
    const childIds = children.map((c: any) => c.id)
    const products = allProducts.filter((p: any) => childIds.includes(p.category_id) || p.category_id === parent.id)
    return {
      ...parent,
      children,
      products
    }
  }).filter((s: any) => s.products.length > 0)

  // Fetch some top products for "Flash Deals" from Featured Brands
  const flashDeals = await queryAll(
    `SELECT * FROM storefront_products 
     WHERE is_active = true 
       AND compare_at_price IS NOT NULL 
       AND (
         name ILIKE '%K&N%' OR 
         name ILIKE '%Dawn%' OR 
         name ILIKE '%Sabroso%' OR 
         name ILIKE '%Nestl%' OR 
         name ILIKE '%National%'
       )
     ORDER BY created_at DESC 
     LIMIT 4`
  )

  // Fetch "Trending Now" products
  const trendingProducts = await queryAll(
    'SELECT * FROM storefront_products WHERE is_active = true ORDER BY created_at ASC LIMIT 8'
  )

  // Mock Brands
  const topBrands = [
    { name: "K&N's", logo: "/brands/kns.png", slug: "kns" },
    { name: "Dawn Foods", logo: "/brands/dawn.png", slug: "dawn" },
    { name: "Sabroso", logo: "/brands/sabroso.png", slug: "sabroso" },
    { name: "Nestle", logo: "/brands/nestle.png", slug: "nestle" },
    { name: "National", logo: "/brands/national.png", slug: "national" }
  ]

  // High-quality category images mapping
  const categoryImages: Record<string, string> = {
    'fresh-produce': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
    'meat-seafood': 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=600&q=80',
    'dairy-eggs': 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
    'bakery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    'frozen-foods': 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=80',
    'baby-care': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80',
    'grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    'snacks-confectionery': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    'beverages': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    'pantry-staples': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    'breakfast-cereals': 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&w=600&q=80',
    'personal-care': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80',
    'health-pharmacy': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80',
    'household-essentials': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
    'cleaning-laundry': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80',
    'pet-supplies': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80',
    'flowers-gifts': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
    'electronics-accessories': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
    'stationery-office-supplies': 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=600&q=80',
    'home-kitchen': 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
    'ready-to-eat-meals': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    'restaurants': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    'desserts-ice-cream': 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
    'convenience-store': 'https://images.unsplash.com/photo-1601598851547-4302969d0614?auto=format&fit=crop&w=600&q=80',
    'organic-healthy-foods': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    'tobacco': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
  };

  const getCategoryImage = (slug: string) => {
    return categoryImages[slug] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
  }

  return (
    <main className="pb-24 pt-4 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-lg md:max-w-4xl lg:max-w-6xl">
        
        {/* Dynamic Hero Carousel */}
        <HeroCarousel />

        {/* Section: Top Brands (Horizontal Scroll) */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" /> Featured Brands
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {topBrands.map((brand, idx) => (
              <Link 
                key={idx} 
                href={`/storefront/brands/${brand.slug}`}
                className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-3 hover:shadow-md hover:border-indigo-200 transition-all group"
              >
                <div className="relative w-12 h-12 md:w-16 md:h-16 mb-2 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                  <Image src={brand.logo} alt={brand.name} fill unoptimized className="object-contain" />
                </div>
                <span className="text-[10px] md:text-xs font-bold text-gray-600 group-hover:text-indigo-600">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section: Flash Deals */}
        {flashDeals.length > 0 && (
          <div className="mb-12 bg-white p-4 md:p-6 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-rose-500/20">
                  <Zap className="w-5 h-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Flash Deals</h2>
              </div>
              <FlashDealsTimer hours={3} />
            </div>

            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {flashDeals.map((product: any) => (
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
        )}

        {/* Section: Trending Now */}
        {trendingProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Trending Now
              </h2>
              <Link href="/storefront/products" className="text-sm font-bold text-indigo-500 hover:text-indigo-600 flex items-center px-4 py-2 bg-indigo-50 rounded-full transition-colors">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="flex overflow-x-auto pb-6 gap-4 md:gap-6 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {trendingProducts.map((product: any) => (
                <div key={product.id} className="w-[180px] md:w-[220px] flex-shrink-0 h-full">
                  <ProductCard 
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      compareAtPrice: product.compare_at_price,
                      imageUrl: product.image_url
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Category Sections (Premium Image Cards) */}
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-6">Explore Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {parentCategories.map((parent: any) => (
              <Link 
                key={parent.id} 
                href={`/storefront/${parent.slug}`} 
                className="group relative rounded-3xl overflow-hidden aspect-square block shadow-sm hover:shadow-xl transition-all"
              >
                <Image 
                  src={getCategoryImage(parent.slug)} 
                  alt={parent.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-5">
                  <h3 className="text-white font-bold text-sm md:text-base leading-tight">
                    {parent.name.replace(/[^\w\s&,-]/g, '')}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Dynamic Category Product Rows */}
        {sections.map((section: any, idx: number) => (
          <div key={`section-${section.id}`} className="mb-12">
            
            {/* Promotional Banner 1 (After 1st category) */}
            {idx === 1 && (
              <div className="mb-12 rounded-3xl overflow-hidden relative bg-gradient-to-r from-emerald-500 to-teal-600 p-8 md:p-12 text-white shadow-xl">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 max-w-lg">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">Limited Time</span>
                  <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">Fresh Organic Produce Delivered Daily</h3>
                  <p className="text-lg text-emerald-50 mb-6 font-medium">Get 20% off your first order of organic vegetables and fruits. Use code FRESH20.</p>
                  <Link href="/storefront/organic-healthy-foods" className="inline-block bg-white text-emerald-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    Shop Organic
                  </Link>
                </div>
              </div>
            )}

            {/* Promotional Banner 2 (After 3rd category) */}
            {idx === 3 && (
              <div className="mb-12 rounded-3xl overflow-hidden relative bg-gradient-to-r from-indigo-500 to-violet-600 p-8 md:p-12 text-white shadow-xl">
                <div className="absolute left-0 bottom-0 w-64 h-64 bg-black/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                <div className="relative z-10 max-w-lg ml-auto text-left md:text-right">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">Member Exclusive</span>
                  <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">Earn Double Reward Points</h3>
                  <p className="text-lg text-indigo-100 mb-6 font-medium">Sign up for our Hybrid Rewards program today and get double points on all pantry staples.</p>
                  <button className="inline-block bg-white text-indigo-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    Join Now
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                {section.name.replace(/[^\w\s&,-]/g, '')}
              </h2>
              <Link href={`/storefront/${section.slug}`} className="text-sm font-bold text-indigo-500 hover:text-indigo-600 flex items-center px-4 py-2 bg-indigo-50 rounded-full transition-colors">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="flex overflow-x-auto pb-6 gap-4 md:gap-6 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {section.products.slice(0, 8).map((product: any) => (
                <div key={product.id} className="w-[180px] md:w-[220px] flex-shrink-0 h-full">
                  <ProductCard 
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      compareAtPrice: product.compare_at_price,
                      imageUrl: product.image_url
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </main>
  )
}
