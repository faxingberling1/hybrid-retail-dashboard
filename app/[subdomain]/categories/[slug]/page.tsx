import prisma from "@/lib/prisma"
import Link from "next/link"
import { ProductCard } from "@/components/storefront/product-card"
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic';

export default async function CategoryLandingPage({ params }: { params: Promise<{ subdomain: string, slug: string }> }) {
  const resolvedParams = await params;
  const orgStorefront = await getStorefrontOrg(); const industry = orgStorefront?.industry || 'pharmacy';
  const slug = resolvedParams.slug;
  

  // Generic theme that adapts based on the industry
  const theme = {
    bg: "bg-gradient-to-r from-blue-600 to-indigo-700",
    text: "text-white",
    pText: "text-blue-50",
    linkBg: "bg-white text-blue-700 hover:bg-blue-50",
    accentBorder: "hover:border-blue-500",
    accentHoverBg: "hover:bg-blue-50",
  };

  if (industry === 'restaurant') {
    theme.bg = "bg-gradient-to-r from-amber-500 to-orange-600";
    theme.pText = "text-amber-50";
    theme.linkBg = "bg-white text-amber-700 hover:bg-amber-50";
    theme.accentBorder = "hover:border-amber-500";
    theme.accentHoverBg = "hover:bg-amber-50";
  } else if (industry === 'grocery') {
    theme.bg = "bg-gradient-to-r from-emerald-500 to-teal-600";
    theme.pText = "text-emerald-50";
    theme.linkBg = "bg-white text-emerald-700 hover:bg-emerald-50";
    theme.accentBorder = "hover:border-emerald-500";
    theme.accentHoverBg = "hover:bg-emerald-50";
  } else if (industry === 'fashion') {
    theme.bg = "bg-gradient-to-r from-pink-500 to-rose-600";
    theme.pText = "text-pink-50";
    theme.linkBg = "bg-white text-pink-700 hover:bg-pink-50";
    theme.accentBorder = "hover:border-pink-500";
    theme.accentHoverBg = "hover:bg-pink-50";
  }

  // Fetch Main Category
  let category: any = null;
  let products: any[] = [];
  
  if (industry !== 'grocery') {
    const { getMockCategory, getMockProducts } = await import("@/lib/storefront-mock-data");
    category = getMockCategory(industry, slug);
    if (category) {
      products = getMockProducts(industry, category.id);
      // Remap the subcategory ID for the mock
      products.forEach((p: any) => { p.category_id = category.id + '_sub' });
    }
  } else {
    category = await prisma.storefrontCategory.findFirst({
      where: { slug },
      include: { children: true }
    })
    if (category) {
      const subCategoryIds = category.children.map((c: any) => c.id)
      products = await prisma.storefrontProduct.findMany({
        where: { category_id: { in: subCategoryIds }, is_active: true },
        include: { category: true }
      })
    }
  }

  if (!category) {
    return notFound()
  }

  // Group products by subcategory
  const productsBySubCategory: Record<string, any[]> = {}
  category.children.forEach((subCat: any) => {
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
              href={`/storefront/${industry}`} 
              className={`inline-flex items-center text-sm font-bold text-white hover:text-white/90 bg-black/20 hover:bg-black/30 backdrop-blur-md px-4 py-2 rounded-full transition-colors w-fit mb-6`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Store
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              {category.name}
            </h1>
            <p className={`text-lg md:text-xl font-medium ${theme.pText} mb-8 max-w-xl`}>
              Explore our curated selection of premium {category.name.toLowerCase()} products, delivered right to your door.
            </p>
            <Link 
              href={`/storefront/${industry}/products?category=${category.slug}`} 
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
              {category.children.map((subCat: any) => (
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
        {category.children.map((subCat: any) => {
          const catProducts = productsBySubCategory[subCat.name] || []
          
          if (catProducts.length === 0) return null; // Don't show empty sections

          return (
            <div key={subCat.id} id={subCat.slug} className="scroll-mt-[140px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  {subCat.name}
                </h2>
                <Link 
                  href={`/storefront/${industry}/products?category=${subCat.slug}`} 
                  className="text-sm font-bold text-indigo-500 hover:text-indigo-600 flex items-center transition-colors"
                >
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {catProducts.map((product: any) => (
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
