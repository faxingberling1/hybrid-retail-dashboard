import { useState } from "react"
import { motion } from "framer-motion"
import { Save, Store, Link as LinkIcon, Palette, Image as ImageIcon } from "lucide-react"

export function StorefrontSettings({ data, onSave, isSaving }: any) {
  const [formData, setFormData] = useState({
    theme_config: data?.theme_config || {
      primaryColor: "#ffc000",
      secondaryColor: "#000000",
      logoUrl: "",
      bannerUrl: ""
    },
    subdomain: data?.subdomain || ""
  })

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      theme_config: {
        ...prev.theme_config,
        [field]: value
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ storefront: formData })
  }

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Storefront Identity</h3>
            <p className="text-sm text-gray-500">Configure your public storefront branding</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-gray-400" />
                Store Subdomain
              </label>
              <div className="flex items-center">
                <input 
                  type="text" 
                  value={formData.subdomain}
                  readOnly
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-l-xl text-gray-900 font-medium focus:outline-none"
                  placeholder="your-store"
                />
                <span className="px-4 py-3 bg-gray-100 border-y border-r border-gray-200 rounded-r-xl text-gray-500 font-medium font-mono text-sm">
                  .hybridpos.com
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-1">Contact support to change your subdomain.</p>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Palette className="h-4 w-4 text-gray-400" />
                Primary Brand Color
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={formData.theme_config.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="h-12 w-12 rounded-xl cursor-pointer border-0 p-0"
                />
                <input 
                  type="text" 
                  value={formData.theme_config.primaryColor}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Palette className="h-4 w-4 text-gray-400" />
                Secondary Color
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="color" 
                  value={formData.theme_config.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="h-12 w-12 rounded-xl cursor-pointer border-0 p-0"
                />
                <input 
                  type="text" 
                  value={formData.theme_config.secondaryColor}
                  onChange={(e) => handleChange('secondaryColor', e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-gray-400" />
                Store Logo URL
              </label>
              <input 
                type="text" 
                value={formData.theme_config.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {formData.theme_config.logoUrl && (
                 <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center h-24">
                   <img src={formData.theme_config.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                 </div>
              )}
            </div>

             <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-gray-400" />
                Hero Banner URL
              </label>
              <input 
                type="text" 
                value={formData.theme_config.bannerUrl}
                onChange={(e) => handleChange('bannerUrl', e.target.value)}
                placeholder="https://example.com/banner.jpg"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
               {formData.theme_config.bannerUrl && (
                 <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center h-24 overflow-hidden relative">
                   <img src={formData.theme_config.bannerUrl} alt="Banner Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                 </div>
              )}
            </div>
          </div>

        </div>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            {isSaving ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </motion.form>
  )
}
