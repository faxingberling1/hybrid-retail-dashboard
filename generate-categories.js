const fs = require('fs');
const path = require('path');

const categories = {
  'fresh-produce': { bg: 'bg-gradient-to-r from-emerald-500 to-emerald-700', text: 'text-white', pText: 'text-emerald-50', linkBg: 'bg-white text-emerald-700 hover:bg-emerald-50', accentBorder: 'hover:border-emerald-500', accentHoverBg: 'hover:bg-emerald-50', title: 'Farm Fresh to Your Table', desc: 'Crisp vegetables, juicy fruits, and fresh herbs hand-picked daily for the best quality.' },
  'meat-seafood': { bg: 'bg-gradient-to-r from-rose-600 to-rose-800', text: 'text-white', pText: 'text-rose-50', linkBg: 'bg-white text-rose-700 hover:bg-rose-50', accentBorder: 'hover:border-rose-600', accentHoverBg: 'hover:bg-rose-50', title: 'Premium Cuts & Fresh Catch', desc: 'From succulent steaks to fresh Atlantic salmon. Sourced from the finest local and international suppliers.' },
  'dairy-eggs': { bg: 'bg-gradient-to-r from-blue-400 to-cyan-600', text: 'text-white', pText: 'text-blue-50', linkBg: 'bg-white text-blue-700 hover:bg-blue-50', accentBorder: 'hover:border-blue-500', accentHoverBg: 'hover:bg-blue-50', title: 'Wholesome Dairy & Fresh Eggs', desc: 'Start your day right with farm-fresh milk, artisan cheeses, and rich creamy butter.' },
  'bakery': { bg: 'bg-gradient-to-r from-amber-500 to-orange-600', text: 'text-white', pText: 'text-amber-50', linkBg: 'bg-white text-amber-700 hover:bg-amber-50', accentBorder: 'hover:border-amber-500', accentHoverBg: 'hover:bg-amber-50', title: 'Freshly Baked Goodness', desc: 'Warm artisan bread, decadent pastries, and sweet treats baked fresh every morning.' },
  'frozen-foods': { bg: 'bg-gradient-to-r from-cyan-500 to-blue-600', text: 'text-white', pText: 'text-cyan-50', linkBg: 'bg-white text-cyan-700 hover:bg-cyan-50', accentBorder: 'hover:border-cyan-500', accentHoverBg: 'hover:bg-cyan-50', title: 'Convenient & Delicious', desc: 'Stock up your freezer with ready meals, premium frozen veggies, and sweet frozen desserts.' },
  'baby-care': { bg: 'bg-[#ffc000]', text: 'text-slate-900', pText: 'text-slate-800', linkBg: 'bg-slate-900 text-white hover:bg-slate-800', accentBorder: 'hover:border-[#ffc000]', accentHoverBg: 'hover:bg-[#ffc000]/10', title: 'Everything for Your Little One', desc: 'From organic baby food to the softest diapers. Shop our curated selection of premium baby care.' },
  'grocery': { bg: 'bg-gradient-to-r from-violet-500 to-purple-700', text: 'text-white', pText: 'text-violet-50', linkBg: 'bg-white text-violet-700 hover:bg-violet-50', accentBorder: 'hover:border-violet-500', accentHoverBg: 'hover:bg-violet-50', title: 'Your Everyday Essentials', desc: 'Stock up your kitchen with quality ingredients, organic products, and imported grocery items.' },
  'snacks-confectionery': { bg: 'bg-gradient-to-r from-pink-500 to-rose-500', text: 'text-white', pText: 'text-pink-50', linkBg: 'bg-white text-pink-700 hover:bg-pink-50', accentBorder: 'hover:border-pink-500', accentHoverBg: 'hover:bg-pink-50', title: 'Cravings Satisfied', desc: 'Crunchy chips, premium chocolates, and savory snacks for movie nights and quick bites.' },
  'beverages': { bg: 'bg-gradient-to-r from-sky-400 to-indigo-500', text: 'text-white', pText: 'text-sky-50', linkBg: 'bg-white text-indigo-700 hover:bg-sky-50', accentBorder: 'hover:border-indigo-500', accentHoverBg: 'hover:bg-indigo-50', title: 'Quench Your Thirst', desc: 'Refreshing juices, energizing coffee, soft drinks, and premium hydration options.' },
  'pantry-staples': { bg: 'bg-gradient-to-r from-orange-400 to-amber-600', text: 'text-white', pText: 'text-orange-50', linkBg: 'bg-white text-orange-700 hover:bg-orange-50', accentBorder: 'hover:border-orange-500', accentHoverBg: 'hover:bg-orange-50', title: 'The Heart of Your Kitchen', desc: 'Premium rice, pulses, imported oils, and aromatic spices to perfect your recipes.' },
  'breakfast-cereals': { bg: 'bg-gradient-to-r from-yellow-400 to-amber-500', text: 'text-slate-900', pText: 'text-slate-800', linkBg: 'bg-slate-900 text-white hover:bg-slate-800', accentBorder: 'hover:border-amber-500', accentHoverBg: 'hover:bg-amber-50', title: 'A Brighter Morning', desc: 'Healthy oats, crunchy granola, and sweet pancake mixes to kickstart your day.' },
  'personal-care': { bg: 'bg-gradient-to-r from-teal-400 to-emerald-500', text: 'text-white', pText: 'text-teal-50', linkBg: 'bg-white text-teal-700 hover:bg-teal-50', accentBorder: 'hover:border-teal-500', accentHoverBg: 'hover:bg-teal-50', title: 'Self-Care Starts Here', desc: 'Premium skincare, hair care, and grooming essentials for your daily routine.' },
  'health-pharmacy': { bg: 'bg-gradient-to-r from-red-500 to-rose-600', text: 'text-white', pText: 'text-red-50', linkBg: 'bg-white text-red-700 hover:bg-red-50', accentBorder: 'hover:border-red-500', accentHoverBg: 'hover:bg-red-50', title: 'Wellness & Health', desc: 'Vitamins, supplements, and over-the-counter pharmacy essentials you can trust.' },
  'household-essentials': { bg: 'bg-gradient-to-r from-slate-500 to-gray-700', text: 'text-white', pText: 'text-slate-50', linkBg: 'bg-white text-slate-700 hover:bg-slate-50', accentBorder: 'hover:border-slate-500', accentHoverBg: 'hover:bg-slate-50', title: 'For a Better Home', desc: 'Paper towels, trash bags, and everyday household products for smooth running.' },
  'cleaning-laundry': { bg: 'bg-gradient-to-r from-blue-300 to-indigo-500', text: 'text-white', pText: 'text-blue-50', linkBg: 'bg-white text-indigo-700 hover:bg-blue-50', accentBorder: 'hover:border-indigo-500', accentHoverBg: 'hover:bg-indigo-50', title: 'Sparkling Clean', desc: 'Tough stain removers, fresh detergents, and powerful surface cleaners.' },
  'pet-supplies': { bg: 'bg-gradient-to-r from-amber-700 to-orange-800', text: 'text-white', pText: 'text-amber-50', linkBg: 'bg-white text-amber-800 hover:bg-amber-50', accentBorder: 'hover:border-amber-700', accentHoverBg: 'hover:bg-amber-50', title: 'For Your Furry Friends', desc: 'Nutritious pet food, fun toys, and grooming essentials for happy pets.' },
  'flowers-gifts': { bg: 'bg-gradient-to-r from-fuchsia-500 to-pink-600', text: 'text-white', pText: 'text-fuchsia-50', linkBg: 'bg-white text-fuchsia-700 hover:bg-fuchsia-50', accentBorder: 'hover:border-fuchsia-500', accentHoverBg: 'hover:bg-fuchsia-50', title: 'Say It With Love', desc: 'Beautiful fresh bouquets, elegant gift baskets, and sweet surprises.' },
  'electronics-accessories': { bg: 'bg-gradient-to-r from-gray-800 to-slate-900', text: 'text-white', pText: 'text-gray-300', linkBg: 'bg-white text-gray-900 hover:bg-gray-100', accentBorder: 'hover:border-gray-800', accentHoverBg: 'hover:bg-gray-100', title: 'Tech & Gadgets', desc: 'Essential charging cables, batteries, and smart home accessories.' },
  'stationery-office-supplies': { bg: 'bg-gradient-to-r from-yellow-500 to-yellow-600', text: 'text-slate-900', pText: 'text-slate-800', linkBg: 'bg-slate-900 text-white hover:bg-slate-800', accentBorder: 'hover:border-yellow-500', accentHoverBg: 'hover:bg-yellow-50', title: 'Create & Organize', desc: 'Premium notebooks, pens, and office essentials to keep you productive.' },
  'home-kitchen': { bg: 'bg-gradient-to-r from-stone-500 to-stone-700', text: 'text-white', pText: 'text-stone-50', linkBg: 'bg-white text-stone-700 hover:bg-stone-50', accentBorder: 'hover:border-stone-500', accentHoverBg: 'hover:bg-stone-50', title: 'Elevate Your Space', desc: 'Quality cookware, storage containers, and elegant dining essentials.' },
  'ready-to-eat-meals': { bg: 'bg-gradient-to-r from-red-400 to-rose-600', text: 'text-white', pText: 'text-red-50', linkBg: 'bg-white text-red-700 hover:bg-red-50', accentBorder: 'hover:border-red-500', accentHoverBg: 'hover:bg-red-50', title: 'Delicious & Instant', desc: 'Chef-prepared meals, hot deli items, and quick microwave dinners.' },
  'restaurants': { bg: 'bg-gradient-to-r from-orange-500 to-red-600', text: 'text-white', pText: 'text-orange-50', linkBg: 'bg-white text-orange-700 hover:bg-orange-50', accentBorder: 'hover:border-orange-500', accentHoverBg: 'hover:bg-orange-50', title: 'Hot From The Grill', desc: 'Order fresh meals from our partnered restaurants delivered straight to you.' },
  'desserts-ice-cream': { bg: 'bg-gradient-to-r from-pink-300 to-rose-400', text: 'text-slate-900', pText: 'text-slate-800', linkBg: 'bg-slate-900 text-white hover:bg-slate-800', accentBorder: 'hover:border-pink-400', accentHoverBg: 'hover:bg-pink-50', title: 'Sweet Indulgence', desc: 'Premium gelato, rich cakes, and decadent frozen desserts to treat yourself.' },
  'convenience-store': { bg: 'bg-gradient-to-r from-teal-500 to-cyan-600', text: 'text-white', pText: 'text-teal-50', linkBg: 'bg-white text-teal-700 hover:bg-teal-50', accentBorder: 'hover:border-teal-500', accentHoverBg: 'hover:bg-teal-50', title: 'Quick & Easy', desc: 'Last-minute essentials, quick bites, and on-the-go items available 24/7.' },
  'organic-healthy-foods': { bg: 'bg-gradient-to-r from-lime-500 to-green-600', text: 'text-white', pText: 'text-lime-50', linkBg: 'bg-white text-lime-700 hover:bg-lime-50', accentBorder: 'hover:border-lime-500', accentHoverBg: 'hover:bg-lime-50', title: 'Nourish Your Body', desc: 'Certified organic produce, gluten-free snacks, and superfoods for a healthy lifestyle.' },
  'tobacco': { bg: 'bg-gradient-to-r from-stone-700 to-neutral-900', text: 'text-white', pText: 'text-stone-300', linkBg: 'bg-white text-stone-900 hover:bg-stone-100', accentBorder: 'hover:border-stone-700', accentHoverBg: 'hover:bg-stone-100', title: 'Tobacco Products', desc: 'Premium cigars, cigarettes, and smoking accessories.' },
};

const template = (slug, theme) => `import prisma from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ChevronLeft, ShoppingBag, Heart, ArrowRight } from "lucide-react"
import { WishlistButton } from "@/components/storefront/wishlist-button"
import { AddToCartButton } from "@/components/storefront/add-to-cart-button"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic';

export default async function CategoryLandingPage() {
  const slug = "${slug}";
  const theme = ${JSON.stringify(theme, null, 2)};

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
      <div className={\`\${theme.bg} \${theme.text} pt-12 pb-16 px-4 relative overflow-hidden transition-colors duration-500\`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="max-w-2xl">
            <Link 
              href="/storefront" 
              className={\`inline-flex items-center text-sm font-bold \${slug === 'baby-care' || slug === 'breakfast-cereals' || slug === 'stationery-office-supplies' || slug === 'desserts-ice-cream' ? 'text-slate-900 hover:text-black bg-white/40 hover:bg-white/60' : 'text-white hover:text-white/90 bg-black/20 hover:bg-black/30'} backdrop-blur-md px-4 py-2 rounded-full transition-colors w-fit mb-6\`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Store
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              {theme.title || category.name}
            </h1>
            <p className={\`text-lg md:text-xl font-medium \${theme.pText} mb-8 max-w-xl\`}>
              {theme.desc || \`Explore our curated selection of premium \${category.name.toLowerCase()} products, delivered right to your door.\`}
            </p>
            <Link 
              href={\`/storefront/products?category=\${category.slug}\`} 
              className={\`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all \${theme.linkBg}\`}
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
                  href={\`#\${subCat.slug}\`}
                  className={\`whitespace-nowrap px-5 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-bold text-gray-700 \${theme.accentBorder} \${theme.accentHoverBg} transition-colors\`}
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
                  href={\`/storefront/products?category=\${subCat.slug}\`} 
                  className="text-sm font-bold text-indigo-500 hover:text-indigo-600 flex items-center transition-colors"
                >
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {catProducts.map(product => (
                  <div key={product.id} className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all flex flex-col h-full border border-gray-100 group relative">
                    <Link href={\`/storefront/products/\${product.id}\`} className="relative aspect-square w-full mb-3 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 block">
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
                      <Link href={\`/storefront/products/\${product.id}\`} className="text-xs md:text-sm font-bold text-gray-800 leading-tight line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
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
`;

const baseDir = path.join(__dirname, 'app', 'storefront');

for (const [slug, theme] of Object.entries(categories)) {
  const dir = path.join(baseDir, slug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(path.join(dir, 'page.tsx'), template(slug, theme));
  console.log('Created route for:', slug);
}
