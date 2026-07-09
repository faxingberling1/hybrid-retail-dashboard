"use client"

import { useState, useEffect } from "react"
import { Save, Loader2, Globe, Palette, Image as ImageIcon } from "lucide-react"

interface StorefrontConfigFormProps {
  organizationId: string
  initialSubdomain: string
}

export function StorefrontConfigForm({ organizationId, initialSubdomain }: StorefrontConfigFormProps) {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    subdomain: initialSubdomain || "",
    theme_config: {
      primaryColor: "#4f46e5",
      logoUrl: "",
      bannerUrl: "",
    }
  })

  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch(`/api/super-admin/storefront/${organizationId}`)
        if (res.ok) {
          const data = await res.json()
          setFormData({
            subdomain: data.subdomain || initialSubdomain || "",
            theme_config: data.theme_config || { primaryColor: "#4f46e5", logoUrl: "", bannerUrl: "" }
          })
        }
      } catch (error) {
        console.error("Error fetching storefront config", error)
      } finally {
        setFetching(false)
      }
    }
    fetchConfig()
  }, [organizationId, initialSubdomain])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`/api/super-admin/storefront/${organizationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || "Failed to update storefront")
      } else {
        alert("Storefront configured successfully!")
      }
    } catch (error) {
      console.error(error)
      alert("Error updating storefront")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Storefront Settings</h3>
        
        <div className="space-y-6">
          {/* Subdomain */}
          <div>
            <label className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
              <Globe className="h-4 w-4 mr-2" /> Subdomain
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                required
                className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.subdomain}
                onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                placeholder="my-store"
              />
              <span className="text-sm font-bold text-slate-400">.hybridpos.pk</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">The unique URL identifier for this organization's storefront.</p>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Theme Configuration */}
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center">
            <Palette className="h-4 w-4 mr-2 text-indigo-500" /> Theme Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Primary Color</label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  className="h-10 w-10 rounded cursor-pointer border-0 p-0"
                  value={formData.theme_config.primaryColor}
                  onChange={(e) => setFormData({
                    ...formData,
                    theme_config: { ...formData.theme_config, primaryColor: e.target.value }
                  })}
                />
                <input
                  type="text"
                  className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-slate-900 dark:text-white uppercase"
                  value={formData.theme_config.primaryColor}
                  onChange={(e) => setFormData({
                    ...formData,
                    theme_config: { ...formData.theme_config, primaryColor: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  <ImageIcon className="h-4 w-4 mr-2" /> Logo URL
                </label>
                <input
                  type="url"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.theme_config.logoUrl || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    theme_config: { ...formData.theme_config, logoUrl: e.target.value }
                  })}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                  <ImageIcon className="h-4 w-4 mr-2" /> Banner URL
                </label>
                <input
                  type="url"
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={formData.theme_config.bannerUrl || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    theme_config: { ...formData.theme_config, bannerUrl: e.target.value }
                  })}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Configuration
          </button>
        </div>
      </div>
    </form>
  )
}
