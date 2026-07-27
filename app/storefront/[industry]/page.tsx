import { db, queryAll } from "@/lib/db"
import { getStorefrontOrg } from "@/lib/storefront-utils"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronRight, CheckCircle2, Shield, Zap, TrendingUp, Sparkles, Star, ShoppingBag, Award } from "lucide-react"
import { HeroCarousel } from "@/components/storefront/hero-carousel"
import { FlashDealsTimer } from "@/components/storefront/flash-deals-timer"
import { PromoBanner } from "@/components/storefront/promo-banner"
import { RecentlyViewed } from "@/components/storefront/recently-viewed"
import { AddToCartButton } from "@/components/storefront/add-to-cart-button"
import { ProductCard } from "@/components/storefront/product-card"
import { ProductRowSkeleton } from "@/components/storefront/product-row-skeleton"
import { Suspense } from "react"
import { cookies } from "next/headers"

export const revalidate = 0 // Disable caching so cookie changes apply instantly

// Mock Brands
const topBrandsData: Record<string, any[]> = {
  grocery: [
    { name: "K&N's", logo: "/brands/kns.png", slug: "kns" },
    { name: "Dawn Foods", logo: "/brands/dawn.png", slug: "dawn" },
    { name: "Sabroso", logo: "/brands/sabroso.png", slug: "sabroso" },
    { name: "Nestle", logo: "/brands/nestle.png", slug: "nestle" },
    { name: "National", logo: "/brands/national.png", slug: "national" }
  ],
  electronics: [
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", slug: "apple" },
    { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg", slug: "samsung" },
    { name: "Sony", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg", slug: "sony" },
    { name: "LG", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/LG_logo_%282015%29.svg", slug: "lg" },
    { name: "Asus", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg", slug: "asus" }
  ],
  pharmacy: [
    { name: "Bayer", logo: "https://upload.wikimedia.org/wikipedia/commons/d/dd/Bayer_Logo.svg", slug: "bayer" },
    { name: "Pfizer", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Pfizer_%282021%29.svg", slug: "pfizer" },
    { name: "Johnson & Johnson", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Johnson_%26_Johnson_logo.svg", slug: "jnj" },
    { name: "GSK", logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/GSK_logo_2022.svg", slug: "gsk" },
    { name: "Abbott", logo: "https://upload.wikimedia.org/wikipedia/commons/0/07/Abbott_Laboratories_logo.svg", slug: "abbott" }
  ],
  fashion: [
    { name: "Zara", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg", slug: "zara" },
    { name: "H&M", logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg", slug: "hm" },
    { name: "Nike", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg", slug: "nike" },
    { name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg", slug: "adidas" },
    { name: "Gucci", logo: "https://upload.wikimedia.org/wikipedia/commons/7/79/1960s_Gucci_Logo.svg", slug: "gucci" }
  ],
  restaurant: [
    { name: "McDonald's", logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg", slug: "mcdonalds" },
    { name: "Starbucks", logo: "https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg", slug: "starbucks" },
    { name: "KFC", logo: "https://upload.wikimedia.org/wikipedia/en/b/bf/KFC_logo.svg", slug: "kfc" },
    { name: "Subway", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Subway_2016_logo.svg", slug: "subway" },
    { name: "Domino's", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Domino%27s_pizza_logo.svg", slug: "dominos" }
  ]
}

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

async function FlashDeals({ industry }: { industry: string }) {

  if (industry === 'electronics') {
    const mockFlashDeals = [
      { id: 'e1', name: 'iPhone 15 Pro Max', price: 999.00, compare_at_price: 1199.00, image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80' },
      { id: 'e2', name: 'MacBook Air M3', price: 1099.00, compare_at_price: 1299.00, image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80' },
      { id: 'e3', name: 'Sony WH-1000XM5', price: 298.00, compare_at_price: 399.00, image_url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80' },
      { id: 'e4', name: 'PlayStation 5 Console', price: 449.00, compare_at_price: 499.00, image_url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80' }
    ]
    return (
      <div className="mb-12 bg-white p-4 md:p-6 rounded-3xl border border-indigo-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="text-[32px] leading-none drop-shadow-sm relative origin-bottom">
                ⏰
                <span className="absolute -top-1 -right-2 text-sm animate-pulse">✨</span>
              </div>
              <div>
                <h2 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c8115c] to-[#e63946] text-xl md:text-2xl leading-tight tracking-tight drop-shadow-sm">Save 25%</h2>
                <p className="text-[12px] font-bold text-gray-500 tracking-tight mt-0 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8115c] animate-pulse"></span>
                  Tech Flash Deals
                </p>
              </div>
            </div>
          <FlashDealsTimer hours={12} />
        </div>
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {mockFlashDeals.map((product: any) => (
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
  }

  if (industry === 'pharmacy') {
    const mockFlashDeals = [
      { id: 'ph1', name: 'Premium Whey Protein Isolate', price: 45.00, compare_at_price: 65.00, image_url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80' },
      { id: 'ph2', name: 'Advanced First Aid Kit', price: 29.99, compare_at_price: 49.99, image_url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&q=80' },
      { id: 'ph3', name: 'Digital Blood Pressure Monitor', price: 39.50, compare_at_price: 59.99, image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&q=80' },
      { id: 'ph4', name: 'Organic Multivitamin Gummies', price: 18.99, compare_at_price: 25.00, image_url: 'https://images.unsplash.com/photo-1584308666744-24d5e4a87265?w=600&q=80' }
    ]
    return (
      <div className="mb-12 bg-white p-4 md:p-6 rounded-3xl border border-teal-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="text-[32px] leading-none drop-shadow-sm relative origin-bottom">
                ⏰
                <span className="absolute -top-1 -right-2 text-sm animate-pulse">✨</span>
              </div>
              <div>
                <h2 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c8115c] to-[#e63946] text-xl md:text-2xl leading-tight tracking-tight drop-shadow-sm">Save 25%</h2>
                <p className="text-[12px] font-bold text-gray-500 tracking-tight mt-0 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8115c] animate-pulse"></span>
                  Health Flash Deals
                </p>
              </div>
            </div>
          </div>
          <FlashDealsTimer hours={8} />
        </div>
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {mockFlashDeals.map((product: any) => (
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
  }

  if (industry === 'fashion') {
    const mockFlashDeals = [
      { id: 'f1', name: 'Premium Leather Jacket', price: 129.99, compare_at_price: 250.00, image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80' },
      { id: 'f2', name: 'Designer Sneakers', price: 89.99, compare_at_price: 150.00, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80' },
      { id: 'f3', name: 'Classic Aviator Sunglasses', price: 45.00, compare_at_price: 85.00, image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80' },
      { id: 'f4', name: 'Silk Blend Scarf', price: 24.99, compare_at_price: 40.00, image_url: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=600&q=80' }
    ]
    return (
      <div className="mb-12 bg-white p-4 md:p-6 rounded-3xl border border-fuchsia-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-fuchsia-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="text-[32px] leading-none drop-shadow-sm relative origin-bottom">
                ⏰
                <span className="absolute -top-1 -right-2 text-sm animate-pulse">✨</span>
              </div>
              <div>
                <h2 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c8115c] to-[#e63946] text-xl md:text-2xl leading-tight tracking-tight drop-shadow-sm">Save 25%</h2>
                <p className="text-[12px] font-bold text-gray-500 tracking-tight mt-0 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8115c] animate-pulse"></span>
                  Style Steals
                </p>
              </div>
            </div>
          </div>
          <FlashDealsTimer hours={5} />
        </div>
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {mockFlashDeals.map((product: any) => (
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
  }

  if (industry === 'restaurant') {
    const mockFlashDeals = [
      { id: 'r1', name: 'Family Pizza Combo', price: 24.99, compare_at_price: 35.00, image_url: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=600&q=80' },
      { id: 'r2', name: 'Double Cheese Burger Meal', price: 12.99, compare_at_price: 18.50, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80' },
      { id: 'r3', name: 'Spicy Wings (12 pcs)', price: 9.99, compare_at_price: 15.00, image_url: 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?w=600&q=80' },
      { id: 'r4', name: 'Chocolate Lava Cake', price: 5.50, compare_at_price: 8.00, image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80' }
    ]
    return (
      <div className="mb-12 bg-white p-4 md:p-6 rounded-3xl border border-orange-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="text-[32px] leading-none drop-shadow-sm relative origin-bottom">
                ⏰
                <span className="absolute -top-1 -right-2 text-sm animate-pulse">✨</span>
              </div>
              <div>
                <h2 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c8115c] to-[#e63946] text-xl md:text-2xl leading-tight tracking-tight drop-shadow-sm">Save 25%</h2>
                <p className="text-[12px] font-bold text-gray-500 tracking-tight mt-0 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c8115c] animate-pulse"></span>
                  Today's Specials
                </p>
              </div>
            </div>
          </div>
          <FlashDealsTimer hours={4} />
        </div>
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {mockFlashDeals.map((product: any) => (
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
  }

  const orgStorefront = await getStorefrontOrg();
  const orgId = orgStorefront?.organization_id;
  
  const flashDeals = await queryAll(
    `SELECT * FROM storefront_products 
     WHERE is_active = true 
       ${orgId ? 'AND organization_id = $1' : 'AND organization_id IS NULL'}
       AND compare_at_price IS NOT NULL 
       AND (
         name ILIKE '%K&N%' OR 
         name ILIKE '%Dawn%' OR 
         name ILIKE '%Sabroso%' OR 
         name ILIKE '%Nestl%' OR 
         name ILIKE '%National%'
       )
     ORDER BY created_at DESC 
     LIMIT 4`,
    orgId ? [orgId] : []
  )

  if (flashDeals.length === 0) return null;

  return (
    <div className="mb-12 bg-white p-4 md:p-6 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden">
      <div className="absolute right-0 top-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="text-[32px] leading-none drop-shadow-sm relative origin-bottom">
              ⏰
              <span className="absolute -top-1 -right-2 text-sm animate-pulse">✨</span>
            </div>
            <div>
              <h2 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#c8115c] to-[#e63946] text-xl md:text-2xl leading-tight tracking-tight drop-shadow-sm">Save 25%</h2>
              <p className="text-[12px] font-bold text-gray-500 tracking-tight mt-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c8115c] animate-pulse"></span>
                Flash Deals
              </p>
            </div>
          </div>
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
  )
}

async function TrendingNow({ industry }: { industry: string }) {

  let trendingProducts = []

  if (industry === 'electronics') {
    trendingProducts = [
      { id: 't1', name: 'Apple Watch Series 9', price: 399.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&q=80' },
      { id: 't2', name: 'Samsung Galaxy S24 Ultra', price: 1199.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80' },
      { id: 't3', name: 'LG C3 OLED 4K TV', price: 1299.00, compare_at_price: 1499.00, image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80' },
      { id: 't4', name: 'iPad Pro 12.9"', price: 1099.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80' },
      { id: 't5', name: 'Nintendo Switch OLED', price: 349.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?w=600&q=80' }
    ]
  } else if (industry === 'pharmacy') {
    trendingProducts = [
      { id: 'ph_t1', name: 'Infrared Forehead Thermometer', price: 25.99, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&q=80' },
      { id: 'ph_t2', name: 'Vitamin C 1000mg with Zinc', price: 14.50, compare_at_price: 19.99, image_url: 'https://images.unsplash.com/photo-1550572017-edb799011707?w=600&q=80' },
      { id: 'ph_t3', name: 'Advanced Hand Sanitizer Gel', price: 8.99, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600&q=80' },
      { id: 'ph_t4', name: 'Premium Fish Oil Omega-3', price: 22.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1577401239170-89794098935c?w=600&q=80' },
      { id: 'ph_t5', name: 'Collagen Peptides Powder', price: 27.50, compare_at_price: 35.00, image_url: 'https://images.unsplash.com/photo-1594918731174-88f28fc77ff7?w=600&q=80' }
    ]
  } else if (industry === 'fashion') {
    trendingProducts = [
      { id: 'f_t1', name: 'Oversized Cotton Tee', price: 29.99, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80' },
      { id: 'f_t2', name: 'High-Waist Denim Jeans', price: 59.50, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1542272604-780c8d52a5ce?w=600&q=80' },
      { id: 'f_t3', name: 'Minimalist Gold Watch', price: 110.00, compare_at_price: 150.00, image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80' },
      { id: 'f_t4', name: 'Canvas Tote Bag', price: 18.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1597633244018-b21908d169c9?w=600&q=80' },
      { id: 'f_t5', name: 'Chunky Knit Sweater', price: 45.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80' }
    ]
  } else if (industry === 'restaurant') {
    trendingProducts = [
      { id: 'r_t1', name: 'Signature Truffle Pasta', price: 18.50, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80' },
      { id: 'r_t2', name: 'Avocado Toast & Eggs', price: 14.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80' },
      { id: 'r_t3', name: 'Classic Caesar Salad', price: 12.50, compare_at_price: 15.00, image_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600&q=80' },
      { id: 'r_t4', name: 'Iced Caramel Macchiato', price: 4.50, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&q=80' },
      { id: 'r_t5', name: 'Grilled Salmon Bowl', price: 22.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80' }
    ]
  } else {
    const orgStorefront = await getStorefrontOrg();
    const orgId = orgStorefront?.organization_id;

    trendingProducts = await queryAll(
      `SELECT * FROM storefront_products WHERE is_active = true ${orgId ? 'AND organization_id = $1' : 'AND organization_id IS NULL'} ORDER BY created_at ASC LIMIT 8`,
      orgId ? [orgId] : []
    )
  }

  if (trendingProducts.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          Trending Now
        </h2>
        <Link href={`/storefront/${industry}/products`} className="text-sm font-bold text-indigo-500 hover:text-indigo-600 flex items-center px-4 py-2 bg-indigo-50 rounded-full transition-colors">
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
  )
}

async function DiscoverCategories({ industry }: { industry: string }) {

  if (industry === 'electronics') {
    const parentCategories = [
      { id: 'c1', name: 'Smartphones', slug: 'smartphones', image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80' },
      { id: 'c2', name: 'Laptops', slug: 'laptops', image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80' },
      { id: 'c3', name: 'Audio', slug: 'audio', image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80' },
      { id: 'c4', name: 'Gaming', slug: 'gaming', image_url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&q=80' },
      { id: 'c5', name: 'Wearables', slug: 'wearables', image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80' }
    ]
    
    const sections = [
      {
        id: 's1', name: 'Smartphones & Accessories', slug: 'smartphones', image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&q=80',
        products: [
          { id: 'p1', name: 'iPhone 14', price: 799.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80' },
          { id: 'p2', name: 'Samsung S23', price: 699.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80' },
          { id: 'p3', name: 'Google Pixel 8', price: 699.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=600&q=80' },
          { id: 'p4', name: 'AirPods Pro 2', price: 249.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80' }
        ]
      },
      {
        id: 's2', name: 'Premium Laptops', slug: 'laptops', image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&q=80',
        products: [
          { id: 'p5', name: 'MacBook Pro 14"', price: 1999.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80' },
          { id: 'p6', name: 'Dell XPS 13', price: 1299.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80' },
          { id: 'p7', name: 'Asus ROG Zephyrus', price: 1599.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&q=80' }
        ]
      }
    ]
    
    return (
      <>
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-6">Explore Electronics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {parentCategories.map((parent: any) => (
              <Link 
                key={parent.id} 
                href={`/storefront/${industry}/categories/${parent.slug}`} 
                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                  <Image 
                    src={parent.image_url} 
                    alt={parent.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 md:p-5 flex items-center justify-between bg-white relative z-10 flex-grow">
                  <h3 className="text-slate-900 font-bold text-sm md:text-base leading-tight group-hover:text-indigo-600 transition-colors pr-2">
                    {parent.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {sections.map((section: any, idx: number) => (
          <div key={`section-${section.id}`} className="mb-12">
            
            {idx === 0 && (
              <div className="mb-12 rounded-3xl overflow-hidden relative bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-12 text-white shadow-xl">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 max-w-lg">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">New Arrival</span>
                  <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">Upgrade Your Tech Stack Today</h3>
                  <p className="text-lg text-blue-50 mb-6 font-medium">Get 10% off the latest smart devices and laptops with code TECH10.</p>
                  <Link href={`/storefront/${industry}/laptops`} className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    Shop Now
                  </Link>
                </div>
              </div>
            )}

            <div className="relative w-full h-32 md:h-40 rounded-3xl overflow-hidden mb-6 shadow-sm flex items-center p-6 md:p-10 group">
              <Image 
                src={section.image_url}
                alt={section.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              
              <div className="relative z-10 flex w-full items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-1">
                    {section.name}
                  </h2>
                  <p className="text-white/80 text-sm md:text-base font-medium hidden md:block">Explore our premium selection</p>
                </div>
                
                <Link href={`/storefront/${industry}/categories/${section.slug}`} className="text-sm font-bold text-slate-900 bg-white hover:bg-indigo-50 flex items-center px-5 py-2.5 rounded-full transition-colors shadow-lg group/btn">
                  View All <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="flex overflow-x-auto pb-6 gap-4 md:gap-6 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {section.products.map((product: any) => (
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
      </>
    )
  }

  if (industry === 'pharmacy') {
    const parentCategories = [
      { id: 'c1', name: 'Vitamins', slug: 'vitamins', image_url: 'https://images.unsplash.com/photo-1550572017-edb799011707?w=600&q=80' },
      { id: 'c2', name: 'Over the Counter', slug: 'otc', image_url: 'https://images.unsplash.com/photo-1584308666744-24d5e4a87265?w=600&q=80' },
      { id: 'c3', name: 'First Aid', slug: 'first-aid', image_url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&q=80' },
      { id: 'c4', name: 'Medical Devices', slug: 'devices', image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&q=80' },
      { id: 'c5', name: 'Personal Care', slug: 'personal-care', image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80' }
    ]
    
    const sections = [
      {
        id: 's1', name: 'Vitamins & Supplements', slug: 'vitamins', image_url: 'https://images.unsplash.com/photo-1550572017-edb799011707?w=1000&q=80',
        products: [
          { id: 'p1', name: 'Centrum Adults Multivitamin', price: 15.99, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1584308666744-24d5e4a87265?w=600&q=80' },
          { id: 'p2', name: 'Nature Made Fish Oil', price: 12.50, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1577401239170-89794098935c?w=600&q=80' },
          { id: 'p3', name: 'Emergen-C 1000mg', price: 9.99, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1550572017-edb799011707?w=600&q=80' },
          { id: 'p4', name: 'Vital Proteins Collagen', price: 27.00, compare_at_price: 32.00, image_url: 'https://images.unsplash.com/photo-1594918731174-88f28fc77ff7?w=600&q=80' }
        ]
      },
      {
        id: 's2', name: 'Home Medical Devices', slug: 'devices', image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=1000&q=80',
        products: [
          { id: 'p5', name: 'Omron BP Monitor', price: 49.99, compare_at_price: 59.99, image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&q=80' },
          { id: 'p6', name: 'Braun ThermoScan', price: 35.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&q=80' },
          { id: 'p7', name: 'Fingertip Pulse Oximeter', price: 19.99, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1599422314077-f4dfdaa4cd09?w=600&q=80' }
        ]
      }
    ]
    
    return (
      <>
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-6">Health & Wellness</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {parentCategories.map((parent: any) => (
              <Link 
                key={parent.id} 
                href={`/storefront/${industry}/categories/${parent.slug}`} 
                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-teal-100 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                  <Image 
                    src={parent.image_url} 
                    alt={parent.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 md:p-5 flex items-center justify-between bg-white relative z-10 flex-grow">
                  <h3 className="text-slate-900 font-bold text-sm md:text-base leading-tight group-hover:text-teal-600 transition-colors pr-2">
                    {parent.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {sections.map((section: any, idx: number) => (
          <div key={`section-${section.id}`} className="mb-12">
            
            {idx === 0 && (
              <div className="mb-12 rounded-3xl overflow-hidden relative bg-gradient-to-r from-teal-500 to-emerald-600 p-8 md:p-12 text-white shadow-xl">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 max-w-lg">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">Health First</span>
                  <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">Boost Your Immunity Naturally</h3>
                  <p className="text-lg text-teal-50 mb-6 font-medium">Enjoy 15% off on all immunity-boosting vitamins and supplements with code HEALTH15.</p>
                  <Link href={`/storefront/${industry}/vitamins`} className="inline-block bg-white text-teal-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    Shop Vitamins
                  </Link>
                </div>
              </div>
            )}

            <div className="relative w-full h-32 md:h-40 rounded-3xl overflow-hidden mb-6 shadow-sm flex items-center p-6 md:p-10 group">
              <Image 
                src={section.image_url}
                alt={section.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              
              <div className="relative z-10 flex w-full items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-1">
                    {section.name}
                  </h2>
                  <p className="text-white/80 text-sm md:text-base font-medium hidden md:block">Top rated products for your health</p>
                </div>
                
                <Link href={`/storefront/${industry}/categories/${section.slug}`} className="text-sm font-bold text-slate-900 bg-white hover:bg-teal-50 flex items-center px-5 py-2.5 rounded-full transition-colors shadow-lg group/btn">
                  View All <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="flex overflow-x-auto pb-6 gap-4 md:gap-6 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {section.products.map((product: any) => (
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
      </>
    )
  }

  if (industry === 'fashion') {
    const parentCategories = [
      { id: 'fc1', name: 'Women', slug: 'women', image_url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80' },
      { id: 'fc2', name: 'Men', slug: 'men', image_url: 'https://images.unsplash.com/photo-1490578474895-699bc4e3f444?w=600&q=80' },
      { id: 'fc3', name: 'Shoes', slug: 'shoes', image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80' },
      { id: 'fc4', name: 'Accessories', slug: 'accessories', image_url: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=600&q=80' },
      { id: 'fc5', name: 'Activewear', slug: 'activewear', image_url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80' }
    ]
    
    const sections = [
      {
        id: 'fs1', name: 'Summer Collection', slug: 'summer', image_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1000&q=80',
        products: [
          { id: 'fp1', name: 'Floral Maxi Dress', price: 65.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1572804013309-82a89b4f0b2a?w=600&q=80' },
          { id: 'fp2', name: 'Linen Blend Shorts', price: 34.99, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80' },
          { id: 'fp3', name: 'Woven Straw Hat', price: 22.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600&q=80' },
          { id: 'fp4', name: 'Strappy Sandals', price: 45.00, compare_at_price: 55.00, image_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80' }
        ]
      },
      {
        id: 'fs2', name: 'Streetwear Essentials', slug: 'streetwear', image_url: 'https://images.unsplash.com/photo-1511511450040-677116ff389e?w=1000&q=80',
        products: [
          { id: 'fp5', name: 'Graphic Hoodie', price: 55.00, compare_at_price: 70.00, image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80' },
          { id: 'fp6', name: 'Cargo Pants', price: 68.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1624378441864-6da7c47f4e1c?w=600&q=80' },
          { id: 'fp7', name: 'Retro High-Tops', price: 120.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80' }
        ]
      }
    ]
    
    return (
      <>
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-6">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {parentCategories.map((parent: any) => (
              <Link 
                key={parent.id} 
                href={`/storefront/${industry}/categories/${parent.slug}`} 
                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-pink-100 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                  <Image 
                    src={parent.image_url} 
                    alt={parent.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 md:p-5 flex items-center justify-between bg-white relative z-10 flex-grow">
                  <h3 className="text-slate-900 font-bold text-sm md:text-base leading-tight group-hover:text-pink-600 transition-colors pr-2">
                    {parent.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {sections.map((section: any, idx: number) => (
          <div key={`section-${section.id}`} className="mb-12">
            
            {idx === 0 && (
              <div className="mb-12 rounded-3xl overflow-hidden relative bg-gradient-to-r from-pink-500 to-rose-600 p-8 md:p-12 text-white shadow-xl">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 max-w-lg">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">New Season</span>
                  <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">Elevate Your Everyday Style</h3>
                  <p className="text-lg text-pink-50 mb-6 font-medium">Discover our new arrivals and get 15% off your first purchase with code STYLE15.</p>
                  <Link href={`/storefront/${industry}/new-arrivals`} className="inline-block bg-white text-pink-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    Shop New Arrivals
                  </Link>
                </div>
              </div>
            )}

            <div className="relative w-full h-32 md:h-40 rounded-3xl overflow-hidden mb-6 shadow-sm flex items-center p-6 md:p-10 group">
              <Image 
                src={section.image_url}
                alt={section.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              
              <div className="relative z-10 flex w-full items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-1">
                    {section.name}
                  </h2>
                  <p className="text-white/80 text-sm md:text-base font-medium hidden md:block">Curated styles for you</p>
                </div>
                
                <Link href={`/storefront/${industry}/categories/${section.slug}`} className="text-sm font-bold text-slate-900 bg-white hover:bg-pink-50 flex items-center px-5 py-2.5 rounded-full transition-colors shadow-lg group/btn">
                  View All <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="flex overflow-x-auto pb-6 gap-4 md:gap-6 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {section.products.map((product: any) => (
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
      </>
    )
  }

  if (industry === 'restaurant') {
    const parentCategories = [
      { id: 'rc1', name: 'Starters', slug: 'starters', image_url: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80' },
      { id: 'rc2', name: 'Mains', slug: 'mains', image_url: 'https://images.unsplash.com/photo-1544025162-8111142154ea?w=600&q=80' },
      { id: 'rc3', name: 'Desserts', slug: 'desserts', image_url: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?w=600&q=80' },
      { id: 'rc4', name: 'Beverages', slug: 'beverages', image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80' },
      { id: 'rc5', name: 'Combos', slug: 'combos', image_url: 'https://images.unsplash.com/photo-1594212691516-2484eb3b1c60?w=600&q=80' }
    ]
    
    const sections = [
      {
        id: 'rs1', name: 'Popular Mains', slug: 'mains', image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&q=80',
        products: [
          { id: 'rp1', name: 'Margherita Pizza', price: 14.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80' },
          { id: 'rp2', name: 'Spicy Chicken Burger', price: 11.50, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1615486171448-4ff285a214d9?w=600&q=80' },
          { id: 'rp3', name: 'Ribeye Steak', price: 35.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80' },
          { id: 'rp4', name: 'Vegetarian Lasagna', price: 16.00, compare_at_price: 18.00, image_url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&q=80' }
        ]
      },
      {
        id: 'rs2', name: 'Sweet Treats', slug: 'desserts', image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1000&q=80',
        products: [
          { id: 'rp5', name: 'New York Cheesecake', price: 6.50, compare_at_price: 8.00, image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80' },
          { id: 'rp6', name: 'Tiramisu', price: 7.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600&q=80' },
          { id: 'rp7', name: 'Gelato Scoop', price: 4.00, compare_at_price: null, image_url: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?w=600&q=80' }
        ]
      }
    ]
    
    return (
      <>
        <div className="mb-12">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-6">Explore Our Menu</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {parentCategories.map((parent: any) => (
              <Link 
                key={parent.id} 
                href={`/storefront/${industry}/categories/${parent.slug}`} 
                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-amber-100 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                  <Image 
                    src={parent.image_url} 
                    alt={parent.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 md:p-5 flex items-center justify-between bg-white relative z-10 flex-grow">
                  <h3 className="text-slate-900 font-bold text-sm md:text-base leading-tight group-hover:text-amber-600 transition-colors pr-2">
                    {parent.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {sections.map((section: any, idx: number) => (
          <div key={`section-${section.id}`} className="mb-12">
            
            {idx === 0 && (
              <div className="mb-12 rounded-3xl overflow-hidden relative bg-gradient-to-r from-amber-500 to-orange-600 p-8 md:p-12 text-white shadow-xl">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 max-w-lg">
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">Chef's Special</span>
                  <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">Taste the authentic flavors</h3>
                  <p className="text-lg text-amber-50 mb-6 font-medium">Enjoy 20% off your first online order with us. Use code YUMMY20 at checkout.</p>
                  <Link href={`/storefront/${industry}/combos`} className="inline-block bg-white text-amber-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                    Order Now
                  </Link>
                </div>
              </div>
            )}

            <div className="relative w-full h-32 md:h-40 rounded-3xl overflow-hidden mb-6 shadow-sm flex items-center p-6 md:p-10 group">
              <Image 
                src={section.image_url}
                alt={section.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
              
              <div className="relative z-10 flex w-full items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-1">
                    {section.name}
                  </h2>
                  <p className="text-white/80 text-sm md:text-base font-medium hidden md:block">Handpicked deliciousness</p>
                </div>
                
                <Link href={`/storefront/${industry}/categories/${section.slug}`} className="text-sm font-bold text-slate-900 bg-white hover:bg-amber-50 flex items-center px-5 py-2.5 rounded-full transition-colors shadow-lg group/btn">
                  View Menu <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="flex overflow-x-auto pb-6 gap-4 md:gap-6 custom-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              {section.products.map((product: any) => (
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
      </>
    )
  }

  // Grocery fallback
  const orgStorefront = await getStorefrontOrg();
  const orgId = orgStorefront?.organization_id;

  const allCategories = await queryAll(
    `SELECT * FROM storefront_categories WHERE is_active = true ${orgId ? 'AND organization_id = $1' : 'AND organization_id IS NULL'} ORDER BY name ASC`,
    orgId ? [orgId] : []
  )

  const parentCategories = allCategories.filter((c: any) => c.parent_id === null)
  const childCategories = allCategories.filter((c: any) => c.parent_id !== null)

  const allProducts = await queryAll(
    `SELECT * FROM storefront_products WHERE is_active = true ${orgId ? 'AND organization_id = $1' : 'AND organization_id IS NULL'} ORDER BY created_at DESC`,
    orgId ? [orgId] : []
  )

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

  return (
    <>
      <div className="mb-12">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-6">Explore Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {parentCategories.map((parent: any) => (
            <Link 
              key={parent.id} 
              href={`/storefront/${industry}/categories/${parent.slug}`} 
              className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50">
                <Image 
                  src={parent.image_url || getCategoryImage(parent.slug)} 
                  alt={parent.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-4 md:p-5 flex items-center justify-between bg-white relative z-10 flex-grow">
                <h3 className="text-slate-900 font-bold text-sm md:text-base leading-tight group-hover:text-indigo-600 transition-colors pr-2">
                  {parent.name.replace(/[^\w\s&,-]/g, '')}
                </h3>
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {sections.map((section: any, idx: number) => (
        <div key={`section-${section.id}`} className="mb-12">
          
          {idx === 1 && (
            <div className="mb-12 rounded-3xl overflow-hidden relative bg-gradient-to-r from-emerald-500 to-teal-600 p-8 md:p-12 text-white shadow-xl">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10 max-w-lg">
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">Limited Time</span>
                <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">Fresh Organic Produce Delivered Daily</h3>
                <p className="text-lg text-emerald-50 mb-6 font-medium">Get 20% off your first order of organic vegetables and fruits. Use code FRESH20.</p>
                <Link href={`/storefront/${industry}/organic-healthy-foods`} className="inline-block bg-white text-emerald-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                  Shop Organic
                </Link>
              </div>
            </div>
          )}

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

          <div className="relative w-full h-32 md:h-40 rounded-3xl overflow-hidden mb-6 shadow-sm flex items-center p-6 md:p-10 group">
            <Image 
              src={section.image_url || getCategoryImage(section.slug)}
              alt={section.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            
            <div className="relative z-10 flex w-full items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-1">
                  {section.name.replace(/[^\w\s&,-]/g, '')}
                </h2>
                <p className="text-white/80 text-sm md:text-base font-medium hidden md:block">Explore our premium selection</p>
              </div>
              
              <Link href={`/storefront/${industry}/categories/${section.slug}`} className="text-sm font-bold text-slate-900 bg-white hover:bg-indigo-50 flex items-center px-5 py-2.5 rounded-full transition-colors shadow-lg group/btn">
                View All <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
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
    </>
  )
}


export default async function StorefrontShopPage({ params }: { params: Promise<{ industry: string }> }) {
  const resolvedParams = await params;
  const industry = resolvedParams.industry;



  const currentBrands = topBrandsData[industry] || topBrandsData.grocery

  const orgStorefront = await getStorefrontOrg();
  let heroBanners: any[] = [];
  
  if (orgStorefront?.theme_config) {
    let themeConfig = orgStorefront.theme_config;
    if (typeof themeConfig === 'string') {
      try { themeConfig = JSON.parse(themeConfig); } catch (e) {}
    }
    heroBanners = themeConfig.heroBanners || [];
  }

  // Override hero banners for electronics demo if using default banners
  if (industry === 'electronics' ) {
    heroBanners = [
      {
        id: '1',
        title: 'The Future of Tech is Here',
        subtitle: 'Discover the latest innovations in smart devices and computing.',
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
        ctaText: 'Shop Electronics',
        ctaLink: '/storefront/${industry}/categories/'
      },
      {
        id: '2',
        title: 'Upgrade Your Home Office',
        subtitle: 'Premium laptops and accessories for maximum productivity.',
        imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80',
        ctaText: 'Explore Laptops',
        ctaLink: '/storefront/${industry}/categories/'
      }
    ]
  }

  // Override hero banners for pharmacy demo if using default banners
  if (industry === 'pharmacy' ) {
    heroBanners = [
      {
        id: 'ph1',
        title: 'Your Health, Delivered',
        subtitle: 'Get essential medicines, vitamins, and healthcare products directly to your door.',
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5e4a87265?auto=format&fit=crop&w=1200&q=80',
        ctaText: 'Shop Health Essentials',
        ctaLink: '/storefront/${industry}/categories/'
      },
      {
        id: 'ph2',
        title: 'Professional Care at Home',
        subtitle: 'High-quality medical devices and monitoring equipment for your family.',
        imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=1200&q=80',
        ctaText: 'Explore Devices',
        ctaLink: '/storefront/${industry}/categories/'
      }
    ]
  }

  // Override hero banners for fashion demo if using default banners
  if (industry === 'fashion' ) {
    heroBanners = [
      {
        id: 'f_h1',
        title: 'Fall/Winter 2024 Collection',
        subtitle: 'Embrace the new season with our latest styles and exclusive designs.',
        imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80',
        ctaText: 'Explore Collection',
        ctaLink: '/storefront/${industry}/categories/'
      },
      {
        id: 'f_h2',
        title: 'Must-Have Accessories',
        subtitle: 'Complete your look with our curated selection of bags, watches, and jewelry.',
        imageUrl: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&w=1200&q=80',
        ctaText: 'Shop Accessories',
        ctaLink: '/storefront/${industry}/categories/'
      }
    ]
  }

  // Override hero banners for restaurant demo if using default banners
  if (industry === 'restaurant' ) {
    heroBanners = [
      {
        id: 'r_h1',
        title: 'Craving Something Delicious?',
        subtitle: 'Order fresh, hot, and tasty meals delivered right to your door in minutes.',
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
        ctaText: 'Order Now',
        ctaLink: '/storefront/${industry}/categories/'
      },
      {
        id: 'r_h2',
        title: 'Reserve a Table',
        subtitle: 'Experience our award-winning ambiance and chef-curated dining experience.',
        imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        ctaText: 'Book Table',
        ctaLink: '/storefront/${industry}/categories/'
      }
    ]
  }

  return (
    <main className="pb-24 pt-4 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-lg md:max-w-4xl lg:max-w-6xl">
        
        {/* Dynamic Hero Carousel */}
        <HeroCarousel banners={heroBanners} />

        {/* Section: Top Brands (Horizontal Scroll) */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-500" /> Featured Brands
            </h2>
          </div>
          <div className="relative overflow-x-auto w-full group -mx-4 md:mx-0 flex custom-scrollbar pb-2">
            <div className="flex gap-4 whitespace-nowrap py-2 px-4 md:px-0 w-max">
              {currentBrands.map((brand, idx) => (
                <Link 
                  key={idx} 
                  href={`/storefront/${industry}/brands/${brand.slug}`}
                  className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-3 hover:shadow-md hover:border-indigo-200 transition-all"
                >
                  <div className="relative w-12 h-12 md:w-16 md:h-16 mb-2 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all flex items-center justify-center">
                    <Image src={brand.logo} alt={brand.name} fill unoptimized className="object-contain" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-gray-600">{brand.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Section: Flash Deals */}
        <Suspense fallback={
          <div className="mb-12 bg-white p-4 md:p-6 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse"></div><div className="w-32 h-6 bg-slate-200 rounded animate-pulse"></div></div>
             <ProductRowSkeleton count={4} />
          </div>
        }>
          {/* @ts-expect-error Async Server Component */}
          <FlashDeals industry={industry} />
        </Suspense>

        {/* Promo Banner Section */}
        <PromoBanner />

        {/* Section: Trending Now */}
        <Suspense fallback={
          <div className="mb-12">
            <div className="w-48 h-6 bg-slate-200 rounded mb-6 animate-pulse"></div>
            <ProductRowSkeleton count={5} />
          </div>
        }>
          {/* @ts-expect-error Async Server Component */}
          <TrendingNow industry={industry} />
        </Suspense>

        {/* Recently Viewed Section */}
        <RecentlyViewed />

        {/* Section: Discover By Category */}
        <Suspense fallback={
          <div className="mb-12">
            <div className="w-48 h-6 bg-slate-200 rounded mb-6 animate-pulse"></div>
            <ProductRowSkeleton count={5} />
          </div>
        }>
          {/* @ts-expect-error Async Server Component */}
          <DiscoverCategories industry={industry} />
        </Suspense>

      </div>
    </main>
  )
}
