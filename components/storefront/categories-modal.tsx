"use client"

import { useState } from "react"
import Link from "next/link"
import { useUIStore } from "@/lib/store/ui-store"
import { X, ChevronDown, ChevronRight, Grid } from "lucide-react"

export function CategoriesModal({ categories = [] }: { categories: any[] }) {
  const { isCategoriesOpen, setCategoriesOpen } = useUIStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const parents = categories.filter(c => !c.parent_id)

  const toggleExpand = (id: string) => {
    if (expandedId === id) setExpandedId(null)
    else setExpandedId(id)
  }

  return (
    <>
      {/* Modal Above Navbar */}
      <div 
        className={`fixed bottom-[90px] left-4 right-4 w-auto max-h-[75vh] h-auto bg-gray-50 rounded-[32px] z-[45] transform transition-all duration-300 ease-out shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex flex-col md:hidden ${
          isCategoriesOpen ? "translate-y-0 opacity-100 scale-100 pointer-events-auto" : "translate-y-8 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between p-6 bg-white rounded-t-[32px] border-b border-gray-100 shrink-0 shadow-sm relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 p-2.5 rounded-2xl">
              <Grid className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">Categories</h2>
              <p className="text-xs font-medium text-gray-500 leading-none">Shop by departments</p>
            </div>
          </div>
          <button 
            onClick={() => setCategoriesOpen(false)}
            className="p-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-colors"
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-safe">
          <div className="space-y-3">
            {parents.map(parent => {
              const children = categories.filter(c => c.parent_id === parent.id)
              const hasChildren = children.length > 0
              const isExpanded = expandedId === parent.id

              return (
                <div key={parent.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all">
                  <div 
                    onClick={() => hasChildren ? toggleExpand(parent.id) : null}
                    className={`flex items-center p-4 gap-4 ${hasChildren ? 'cursor-pointer' : ''}`}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden relative shadow-inner">
                      {parent.image_url ? (
                        <img src={parent.image_url} alt={parent.name} className="w-full h-full object-cover" />
                      ) : (
                        <Grid className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    
                    <div className="flex-1 pr-2">
                      {hasChildren ? (
                        <span className="font-bold text-gray-900 text-[16px] block leading-tight">{parent.name}</span>
                      ) : (
                        <Link 
                          href={`/storefront/category/${parent.slug}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="font-bold text-gray-900 text-[16px] block leading-tight"
                        >
                          {parent.name}
                        </Link>
                      )}
                      {hasChildren && <span className="text-[13px] text-gray-400 font-medium mt-0.5 block">{children.length} subcategories</span>}
                    </div>

                    {hasChildren && (
                      <div className={`p-2.5 rounded-2xl transition-colors ${isExpanded ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'}`}>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 stroke-[2.5] ${isExpanded ? '-rotate-180' : ''}`} />
                      </div>
                    )}
                  </div>

                  {/* Accordion Content */}
                  {hasChildren && (
                    <div 
                      className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                      <div className="overflow-hidden">
                        <div className="p-3 pt-0 border-t border-gray-50 bg-gray-50/30">
                          <Link
                            href={`/storefront/category/${parent.slug}`}
                            onClick={() => setCategoriesOpen(false)}
                            className="flex items-center justify-between p-3 my-1 rounded-2xl hover:bg-white hover:shadow-sm transition-all group"
                          >
                            <span className="font-bold text-indigo-600 text-[14px]">View All in {parent.name}</span>
                            <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                              <ChevronRight className="w-3.5 h-3.5 text-indigo-600 stroke-[3]" />
                            </div>
                          </Link>
                          {children.map(child => (
                            <Link
                              key={child.id}
                              href={`/storefront/category/${child.slug}`}
                              onClick={() => setCategoriesOpen(false)}
                              className="flex items-center justify-between p-3 my-1 rounded-2xl hover:bg-white hover:shadow-sm transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                {child.image_url ? (
                                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-inner">
                                    <img src={child.image_url} alt={child.name} className="w-full h-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-gray-300 ml-3" />
                                )}
                                <span className="font-bold text-gray-700 text-[14px] group-hover:text-gray-900 transition-colors">{child.name}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
