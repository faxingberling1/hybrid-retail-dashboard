import Link from "next/link"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { ArrowLeft, ShoppingBag, Check, Star, Truck, ShieldCheck, RefreshCw } from "lucide-react"
import { AddToCartButton } from "@/components/storefront/add-to-cart-button"
import { BackButton } from "@/components/storefront/back-button"
import { ShareButton } from "@/components/storefront/share-button"
import { WishlistButton } from "@/components/storefront/wishlist-button"
import ReactMarkdown from "react-markdown"

export default async function ProductDetailsPage({
  params
}: {
  params: { id: string }
}) {
  const { id } = await params;

  let product: any = null;
  let relatedProducts: any[] = [];
  try {
    product = await prisma.storefrontProduct.findUnique({
      where: { id },
      include: {
        category: true
      }
    });

    if (product) {
      relatedProducts = await prisma.storefrontProduct.findMany({
        where: {
          category_id: product.category_id,
          id: { not: product.id },
          is_active: true
        },
        take: 4,
        include: {
          category: true
        }
      });
    }
  } catch (error) {
    // Invalid UUID or db error
    console.error("Error fetching product", error);
  }

  if (!product || !product.is_active) {
    notFound();
  }

  return (
    <div className="pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb & Back */}
          <div className="mb-8">
            <BackButton label="Back to Products" fallbackHref="/storefront/products" />
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Product Image Gallery */}
            <div className="space-y-6">
              <div className="aspect-square relative bg-white dark:bg-slate-800 rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                    <ShoppingBag className="w-24 h-24 text-slate-300 dark:text-slate-700" />
                  </div>
                )}
                {product.compare_at_price && (
                  <div className="absolute top-8 right-8 px-4 py-2 bg-rose-500 text-white text-sm font-black rounded-full uppercase tracking-widest shadow-xl">
                    Sale
                  </div>
                )}
              </div>
              
              {/* Optional: Additional Images thumbnails */}
              {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button key={idx} className="aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-indigo-500 transition-colors bg-white dark:bg-slate-800">
                      <img src={img} alt={`${product?.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-2">
                <Link 
                  href={`/storefront/products?category=${product.category.slug}`}
                  className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  {product.category.name}
                </Link>
              </div>
              
              <div className="flex justify-between items-start gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2">
                  <WishlistButton product={{ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url }} />
                  <ShareButton title={product.name} text={product.description || `Check out ${product.name}`} url={`/storefront/products/${product.id}`} />
                </div>
              </div>
              
              {/* Reviews placeholder */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex text-amber-400">
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current" />
                  <Star className="w-5 h-5 fill-current opacity-30" />
                </div>
                <span className="text-sm font-bold text-slate-500">(128 reviews)</span>
              </div>

              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                  Rs. {Number(product.price).toLocaleString()}
                </span>
                {product.compare_at_price && (
                  <span className="text-2xl font-bold text-slate-400 line-through mb-1">
                    Rs. {Number(product.compare_at_price).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none mb-10 text-lg text-slate-600 dark:text-slate-300">
                {product.description ? (
                  <ReactMarkdown>{product.description}</ReactMarkdown>
                ) : (
                  <p>No description available for this product.</p>
                )}
              </div>

              {/* Add to Cart */}
              <div className="mb-12 space-y-4">
                {product.stock > 0 ? (
                  <div className="flex items-center text-emerald-500 font-bold mb-4 gap-2">
                    <Check className="w-5 h-5" /> In Stock ({product.stock} available)
                  </div>
                ) : (
                  <div className="text-rose-500 font-bold mb-4">Out of Stock</div>
                )}
                
                <div className="flex gap-4">
                  <AddToCartButton 
                    product={{
                      id: product.id,
                      name: product.name,
                      price: Number(product.price),
                      image_url: product.image_url,
                      stock: product.stock
                    }} 
                    variant="full" 
                  />
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm">Free Delivery</h4>
                  <p className="text-xs text-slate-500">On orders over Rs. 2000</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm">Secure Payment</h4>
                  <p className="text-xs text-slate-500">100% secure checkout</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm">Easy Returns</h4>
                  <p className="text-xs text-slate-500">7-day return policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-24 pt-16 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                  You Might Also Like
                </h2>
                <Link 
                  href={`/storefront/products?category=${product.category.slug}`}
                  className="text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors hidden sm:block"
                >
                  View More in {product.category.name} &rarr;
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map(related => (
                  <Link 
                    key={related.id} 
                    href={`/storefront/products/${related.id}`}
                    className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800 flex flex-col"
                  >
                    <div className="aspect-square relative bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      {related.image_url ? (
                        <img 
                          src={related.image_url} 
                          alt={related.name}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-slate-400 opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 z-20">
                        <WishlistButton product={{ id: related.id, name: related.name, price: Number(related.price), image_url: related.image_url }} />
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-500 transition-colors line-clamp-2">{related.name}</h3>
                      <div className="mt-auto flex flex-col pt-2">
                        <span className="text-lg font-black text-slate-900 dark:text-white mb-2 block">Rs. {Number(related.price).toLocaleString()}</span>
                        <div onClick={(e) => e.preventDefault()}>
                          <AddToCartButton 
                            product={{
                              id: related.id, 
                              name: related.name, 
                              price: related.price, 
                              image_url: related.image_url ?? null
                            }} 
                            variant="card" 
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-8 text-center sm:hidden">
                <Link 
                  href={`/storefront/products?category=${product.category.slug}`}
                  className="text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  View More in {product.category.name} &rarr;
                </Link>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
