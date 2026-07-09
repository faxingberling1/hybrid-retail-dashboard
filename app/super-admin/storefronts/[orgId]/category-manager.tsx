"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Plus, Edit, Trash2, X, Upload, Info } from "lucide-react"

export function CategoryManager({ orgId }: { orgId: string }) {
  const [categories, setCategories] = useState<any[]>([])
  const [posCategories, setPosCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", image_url: "" })
  const [uploadingImage, setUploadingImage] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/super-admin/storefronts/${orgId}/categories`)
      if (res.ok) {
        const data = await res.json()
        // Determine if data is the new format or old format (fallback)
        if (data.storefrontCategories) {
          const parents = data.storefrontCategories.filter((c: any) => !c.parent_id)
          setCategories(parents)
          setPosCategories(data.posCategories || [])
        } else {
          const parents = data.filter((c: any) => !c.parent_id)
          setCategories(parents)
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/super-admin/storefronts/${orgId}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setIsAdding(false)
        setFormData({ name: "", slug: "", description: "", image_url: "" })
        fetchCategories()
      } else {
        const error = await res.json()
        alert(error.error || "Failed to create category")
      }
    } catch (error) {
      console.error(error)
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    try {
      const res = await fetch(`/api/super-admin/storefronts/${orgId}/categories/${id}`, {
        method: "DELETE"
      })
      if (res.ok) {
        fetchCategories()
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-500" /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Storefront Categories</h3>
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
            <><Plus className="h-4 w-4 mr-2" /> Add Category</>
          )}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
          {posCategories.length > 0 && (
            <div className="mb-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Suggestions from POS</label>
              <div className="flex flex-wrap gap-2">
                {posCategories.map((posCat) => (
                  <button
                    type="button"
                    key={posCat.id}
                    onClick={() => setFormData({...formData, name: posCat.name, slug: posCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')})}
                    className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    + {posCat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                Image URL
                <div className="group relative ml-2">
                  <Info className="h-4 w-4 text-slate-300 hover:text-indigo-500 cursor-pointer" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Upload an image or paste a URL. Recommended size: 600x600px. Supported formats: JPG, PNG, WEBP.
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
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Description</label>
            <textarea 
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl">Save Category</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Image</th>
              <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Name</th>
              <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Slug</th>
              <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="py-3 px-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20">
                <td className="py-3 px-4">
                  {cat.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cat.image_url} alt={cat.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-xs">No img</div>
                  )}
                </td>
                <td className="py-3 px-4 font-bold text-sm text-slate-900 dark:text-white">{cat.name}</td>
                <td className="py-3 px-4 text-sm text-slate-500">{cat.slug}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${cat.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button onClick={() => handleDelete(cat.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-slate-500 font-bold">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
