"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Plus, Trash2, X, Image as ImageIcon, ArrowUp, ArrowDown, Upload, Info } from "lucide-react"

export function BannerManager({ orgId }: { orgId: string }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [storefrontConfig, setStorefrontConfig] = useState<any>(null)
  
  // Local state for the banner form
  const [banners, setBanners] = useState<any[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({ image_url: "", title: "", subtitle: "", link: "" })
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const res = await fetch(`/api/super-admin/storefront/${orgId}`)
      if (res.ok) {
        const data = await res.json()
        setStorefrontConfig(data)
        
        // Parse theme_config if it's a string, or just use it if it's an object
        let themeConfig = data.theme_config || {}
        if (typeof themeConfig === 'string') {
          try { themeConfig = JSON.parse(themeConfig) } catch (e) {}
        }
        
        setBanners(themeConfig.heroBanners || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const saveBanners = async (updatedBanners: any[]) => {
    setSaving(true)
    try {
      let themeConfig = storefrontConfig?.theme_config || {}
      if (typeof themeConfig === 'string') {
        try { themeConfig = JSON.parse(themeConfig) } catch (e) { themeConfig = {} }
      }
      
      themeConfig.heroBanners = updatedBanners

      const res = await fetch(`/api/super-admin/storefront/${orgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subdomain: storefrontConfig?.subdomain,
          theme_config: themeConfig 
        })
      })

      if (res.ok) {
        setBanners(updatedBanners)
        setIsAdding(false)
        setFormData({ image_url: "", title: "", subtitle: "", link: "" })
        fetchConfig() // Refresh to get latest state
      } else {
        const err = await res.json()
        alert(err.error || "Failed to save banners")
      }
    } catch (error) {
      console.error(error)
      alert("Error saving banners")
    } finally {
      setSaving(false)
    }
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.image_url) return alert("Image URL is required")
    
    const newBanner = {
      id: Math.random().toString(36).substring(7),
      ...formData
    }
    
    saveBanners([...banners, newBanner])
  }

  const moveBanner = (index: number, direction: 'up' | 'down') => {
    const newBanners = [...banners]
    if (direction === 'up' && index > 0) {
      const temp = newBanners[index - 1]
      newBanners[index - 1] = newBanners[index]
      newBanners[index] = temp
      saveBanners(newBanners)
    } else if (direction === 'down' && index < newBanners.length - 1) {
      const temp = newBanners[index + 1]
      newBanners[index + 1] = newBanners[index]
      newBanners[index] = temp
      saveBanners(newBanners)
    }
  }

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return
    saveBanners(banners.filter(b => b.id !== id))
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

  if (!storefrontConfig) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">No Storefront Configured</h3>
        <p className="text-sm text-slate-500 mt-2">Please configure a subdomain for this organization first in the organization settings before managing banners.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Hero Banners</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          disabled={saving}
          className={`flex items-center px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-colors ${
            isAdding 
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          } disabled:opacity-50`}
        >
          {isAdding ? (
            <><X className="h-4 w-4 mr-2" /> Cancel</>
          ) : (
            <><Plus className="h-4 w-4 mr-2" /> Add Banner</>
          )}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                  Image URL
                  <div className="group relative ml-2">
                    <Info className="h-4 w-4 text-slate-300 hover:text-indigo-500 cursor-pointer" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Upload an image or paste a URL. Recommended size: 1920x1080px. Supported formats: JPG, PNG, WEBP.
                      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                </label>
              </div>
              <div className="flex space-x-2">
                <input 
                  required 
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
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl flex items-center transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  {uploadingImage ? "" : "Upload"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Link URL (Optional)</label>
              <input 
                type="text" 
                placeholder="/products/something"
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm"
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Headline (Optional)</label>
              <input 
                type="text" 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Subtitle (Optional)</label>
              <input 
                type="text" 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm"
                value={formData.subtitle}
                onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
              />
            </div>
          </div>
          
          <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Banner"}
          </button>
        </form>
      )}

      {banners.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {banners.map((banner: any, index: number) => (
            <div key={banner.id || index} className="relative group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 aspect-video bg-slate-100 dark:bg-slate-800 flex-shrink-0 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={banner.image_url} alt={banner.title || 'Banner'} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 flex flex-col justify-center flex-grow">
                {banner.title && <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{banner.title}</h4>}
                {banner.subtitle && <p className="text-sm text-slate-500 mb-4">{banner.subtitle}</p>}
                {banner.link && (
                  <div className="text-xs font-bold text-indigo-500 mt-auto">Link: {banner.link}</div>
                )}
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                <div className="flex flex-col space-y-1 bg-white dark:bg-slate-800 rounded-lg p-1 shadow-lg border border-slate-100 dark:border-slate-700">
                  <button 
                    onClick={() => moveBanner(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => moveBanner(index, 'down')}
                    disabled={index === banners.length - 1}
                    className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                <button 
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 h-fit bg-rose-500 text-white rounded-lg shadow-lg hover:bg-rose-600 transition-colors"
                  title="Delete Banner"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-sm text-slate-500 font-bold mb-4">No banners configured yet.</p>
          <button 
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
          >
            Add your first banner
          </button>
        </div>
      )}
    </div>
  )
}
