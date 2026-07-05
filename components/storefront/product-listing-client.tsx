"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { Filter, Search, ShoppingBag, ArrowRight, ArrowDownUp, X } from "lucide-react"
import { BackButton } from "@/components/storefront/back-button"
import { WishlistButton } from "@/components/storefront/wishlist-button"

interface Product {
  id: string
  name: string
  price: number
  compare_at_price: number | null
  image_url: string | null
  category: { 
    name: string
    slug: string
    parent_id: string | null
  }
  created_at: Date
}

export function ProductListingClient({ 
  initialProducts, 
  categories, 
  initialCategory,
  initialSearch
}: { 
  initialProducts: Product[]
  categories: any[]
  initialCategory: string | undefined
  initialSearch: string | undefined
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearch || "")
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory)
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts]

    // Category Filter
    if (selectedCategory) {
      const selectedCatData = categories.find(c => c.slug === selectedCategory)
      if (selectedCatData) {
        if (selectedCatData.parent_id === null) {
          // It's a Main Category, show its products AND its children's products
          result = result.filter(p => 
            p.category.slug === selectedCategory || 
            p.category.parent_id === selectedCatData.id
          )
        } else {
          // It's a Sub Category, show only its products
          result = result.filter(p => p.category.slug === selectedCategory)
        }
      }
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.name.toLowerCase().includes(q)
      )
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price
      if (sortBy === "price_desc") return b.price - a.price
      // newest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return result
  }, [initialProducts, searchQuery, selectedCategory, sortBy, categories])

  const { pillsToDisplay, parentCategory, isMainCategory } = useMemo(() => {
    if (!selectedCategory) {
      // Show main categories
      return {
        pillsToDisplay: categories.filter(c => c.parent_id === null),
        parentCategory: null,
        isMainCategory: false
      }
    }

    const currentCat = categories.find(c => c.slug === selectedCategory)
    if (!currentCat) {
      return {
        pillsToDisplay: categories.filter(c => c.parent_id === null),
        parentCategory: null,
        isMainCategory: false
      }
    }

    if (currentCat.parent_id === null) {
      // It's a main category. Show its children.
      const children = categories.filter(c => c.parent_id === currentCat.id)
      return {
        pillsToDisplay: children.length > 0 ? children : categories.filter(c => c.parent_id === null),
        parentCategory: currentCat,
        isMainCategory: true
      }
    } else {
      // It's a sub category. Show its siblings.
      const parent = categories.find(c => c.id === currentCat.parent_id)
      return {
        pillsToDisplay: categories.filter(c => c.parent_id === currentCat.parent_id),
        parentCategory: parent,
        isMainCategory: false
      }
    }
  }, [categories, selectedCategory])

  return (
    <div className="pt-8 pb-32">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="w-full md:w-auto">
            <div className="mb-4">
              <BackButton label="Back to Store" fallbackHref="/storefront" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {selectedCategory ? `Category: ${categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}` : 'All Products'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Showing {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..." 
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-3 rounded-2xl border shadow-sm flex items-center justify-center transition-colors ${isFilterOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {isFilterOpen && (
          <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-6 animate-in slide-in-from-top-4 fade-in">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Sort By</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "newest", label: "Newest Arrivals" },
                  { id: "price_asc", label: "Price: Low to High" },
                  { id: "price_desc", label: "Price: High to Low" }
                ].map(option => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${sortBy === option.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categories Pill Navigation */}
        {pillsToDisplay.length > 0 && (
          <div className="flex overflow-x-auto pb-4 mb-8 gap-3 no-scrollbar">
            <button 
              onClick={() => {
                if (isMainCategory) {
                  setSelectedCategory(undefined) // Go to Root
                } else if (parentCategory) {
                  setSelectedCategory(parentCategory.slug) // Go to Parent
                } else {
                  setSelectedCategory(undefined)
                }
              }}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                (!selectedCategory || (isMainCategory && selectedCategory === parentCategory?.slug)) 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              {parentCategory ? `All ${parentCategory.name}` : 'All Categories'}
            </button>
            {pillsToDisplay.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all ${selectedCategory === cat.slug ? 'bg-[#ffc000] text-gray-900 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#ffc000]'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredAndSortedProducts.map(product => (
              <Link 
                key={product.id} 
                href={`/storefront/products/${product.id}`}
                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800 flex flex-col relative"
              >
                <div className="aspect-[4/5] relative bg-slate-100 dark:bg-slate-700 overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12 text-slate-400 opacity-50" />
                    </div>
                  )}
                  {product.compare_at_price && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-rose-500 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-md">
                      Sale
                    </div>
                  )}
                </div>
                <div className="absolute top-4 right-4 z-20">
                  <WishlistButton product={{ id: product.id, name: product.name, price: Number(product.price), image_url: product.image_url }} />
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="text-xs font-bold text-indigo-500 mb-2 uppercase tracking-widest">{product.category.name}</div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-500 transition-colors">{product.name}</h3>
                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                      {product.compare_at_price && (
                        <span className="text-sm text-slate-400 line-through">Rs. {Number(product.compare_at_price).toLocaleString()}</span>
                      )}
                      <span className="text-xl font-black text-slate-900 dark:text-white">Rs. {Number(product.price).toLocaleString()}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-[#ffc000] group-hover:text-gray-900 transition-colors shadow-sm">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <ShoppingBag className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-6" />
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No products found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">We couldn&apos;t find any products matching your search or filters.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory(undefined); setSortBy("newest"); }}
              className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold shadow-md hover:shadow-xl transition-all inline-block"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
