"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Plus, Trash2, Upload, X, FileUp, Info } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false, loading: () => <div className="h-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" /> })
import "react-quill/dist/quill.snow.css"

export function ProductManager({ orgId }: { orgId: string }) {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({ name: "", slug: "", price: "", category_id: "", description: "", image_url: "" })
  const [isImporting, setIsImporting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`/api/super-admin/storefronts/${orgId}/products`),
        fetch(`/api/super-admin/storefronts/${orgId}/categories`)
      ])
      if (prodRes.ok) setProducts(await prodRes.json())
      if (catRes.ok) setCategories(await catRes.json())
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/super-admin/storefronts/${orgId}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setIsAdding(false)
        setFormData({ name: "", slug: "", price: "", category_id: "", description: "", image_url: "" })
        fetchData()
      } else {
        const error = await res.json()
        alert(error.error || "Failed to create product")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`/api/super-admin/storefronts/${orgId}/products/import`, {
        method: "POST",
        body: formData
      })
      
      const data = await res.json()
      
      if (res.ok) {
        alert(`Successfully imported ${data.imported} products. Failed: ${data.failed}`)
        fetchData()
      } else {
        alert(data.error || "Failed to import products")
      }
    } catch (error) {
      console.error("Import error:", error)
      alert("An error occurred during import")
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    try {
      const res = await fetch(`/api/super-admin/storefronts/${orgId}/products/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      setLoading(true)
      const res = await fetch(`/api/super-admin/storefronts/${orgId}/products/import`, {
        method: "POST",
        body: formData
      })
      const data = await res.json()
      if (res.ok) {
        alert(`Successfully imported ${data.imported} products. Failed: ${data.failed}.`)
        fetchData()
      } else {
        alert(data.error || "Failed to import CSV")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred during import.")
    } finally {
      setLoading(false)
      // Reset input
      if (e.target) e.target.value = ''
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const uploadData = new FormData()
    uploadData.append('file', file)

    try {
      setUploadingImage(true)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      })
      const data = await res.json()
      if (res.ok) {
        setFormData({ ...formData, image_url: data.url })
      } else {
        alert(data.error || "Failed to upload image")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred during upload")
    } finally {
      setUploadingImage(false)
      if (e.target) e.target.value = ''
    }
  }

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-500" /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Storefront Products</h3>
        <div className="flex space-x-2">
          <div className="flex items-center space-x-2">
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="flex items-center px-4 py-2 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {isImporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileUp className="h-4 w-4 mr-2" />}
              {isImporting ? "Importing..." : "Import CSV"}
            </button>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className={`flex items-center px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
                isAdding 
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {isAdding ? (
                <><X className="h-4 w-4 mr-2" /> Cancel</>
              ) : (
                <><Plus className="h-4 w-4 mr-2" /> Add Product</>
              )}
            </button>
          </div>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Name</label>
              <input 
                required 
                type="text" 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Slug</label>
              <input 
                required 
                type="text" 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm"
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Price (PKR)</label>
              <input 
                required 
                type="number" 
                step="0.01"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Category</label>
              <select 
                required
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm"
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              >
                <option value="">Select a category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                  Image URL
                  <div className="group relative ml-2">
                    <Info className="h-4 w-4 text-slate-300 hover:text-indigo-500 cursor-pointer" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Upload an image or paste a URL. Recommended size: 800x800px. Supported formats: JPG, PNG, WEBP.
                      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                </label>
              </div>
              <div className="flex space-x-2">
                <input 
                  type="url"
                  placeholder="https://..."
                  className="flex-grow bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                />
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp" 
                  className="hidden" 
                  ref={imageInputRef} 
                  onChange={handleImageUpload} 
                />
                <button 
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl flex items-center transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  {uploadingImage ? "" : "Upload"}
                </button>
              </div>
            </div>
          </div>
          <div className="react-quill-container bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest p-4 pb-0 mb-2">Description</label>
            <ReactQuill 
              theme="snow"
              value={formData.description}
              onChange={(val) => setFormData({...formData, description: val})}
              className="text-sm border-none"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl">Save Product</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Name</th>
              <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Price</th>
              <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                <td className="py-3 px-4 font-bold text-sm text-slate-900 dark:text-white">{prod.name}</td>
                <td className="py-3 px-4 text-sm text-slate-500">PKR {prod.price}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${prod.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {prod.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button onClick={() => handleDelete(prod.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-slate-500 font-bold">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
