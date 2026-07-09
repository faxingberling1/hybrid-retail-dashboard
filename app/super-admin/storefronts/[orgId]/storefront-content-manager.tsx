"use client"

import { useState, useEffect } from "react"
import { Package, ListTree, Image as ImageIcon, FolderTree, ExternalLink, X } from "lucide-react"
import { CategoryManager } from "./category-manager"
import { SubcategoryManager } from "./subcategory-manager"
import { ProductManager } from "./product-manager"
import { BannerManager } from "./banner-manager"

export function StorefrontContentManager({ orgId }: { orgId: string }) {
  const [activeTab, setActiveTab] = useState("categories")
  const [showPreview, setShowPreview] = useState(false)
  const [subdomain, setSubdomain] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")

  useEffect(() => {
    // Fetch storefront config to get subdomain
    fetch(`/api/super-admin/storefront/${orgId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.subdomain) {
          setSubdomain(data.subdomain)
          const port = window.location.port ? `:${window.location.port}` : ''
          const protocol = window.location.protocol
          setPreviewUrl(`${protocol}//${data.subdomain}.localhost${port}/storefront`)
        }
      })
      .catch(console.error)
  }, [orgId])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden relative">
      {/* Top Bar Actions */}
      <div className="absolute top-4 right-6 z-10">
        <button
          onClick={() => setShowPreview(true)}
          disabled={!subdomain}
          className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={subdomain ? "Live Preview" : "Please configure a subdomain first"}
        >
          <ExternalLink className="h-4 w-4 mr-2" /> Live Preview
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none px-6">
        {[
          { id: "categories", label: "Categories", icon: ListTree },
          { id: "subcategories", label: "Subcategories", icon: FolderTree },
          { id: "products", label: "Products", icon: Package },
          { id: "banners", label: "Banners & Sections", icon: ImageIcon },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 py-4 px-4 border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-indigo-500 text-indigo-500"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 min-h-[500px]">
        {activeTab === "categories" && <CategoryManager orgId={orgId} />}
        {activeTab === "subcategories" && <SubcategoryManager orgId={orgId} />}
        {activeTab === "products" && <ProductManager orgId={orgId} />}
        {activeTab === "banners" && <BannerManager orgId={orgId} />}
      </div>

      {/* Live Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 md:p-8">
          <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-full max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-4 text-xs font-bold text-slate-500 uppercase tracking-widest bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {previewUrl ? new URL(previewUrl).host : "Preview"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <a 
                  href={previewUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-full transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  title="Close preview"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-grow bg-slate-100 dark:bg-slate-950 relative">
              {previewUrl ? (
                <iframe 
                  src={previewUrl} 
                  className="w-full h-full border-0 bg-white dark:bg-slate-900"
                  title="Live Storefront Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  Subdomain not configured.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
