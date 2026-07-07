"use client"

import React, { useState, useEffect } from "react"
import { X, MapPin, Plus, Edit3, Trash2, Home, Briefcase, Navigation, CheckCircle2 } from "lucide-react"
import { useLocationStore, Address } from "@/lib/store/location-store"
import { useUIStore } from "@/lib/store/ui-store"

export function AddressModal() {
  const { isAddressModalOpen, setAddressModalOpen } = useUIStore()
  const { addresses, selectedAddressId, address, isLoading, error, addAddress, updateAddress, removeAddress, selectAddress, fetchLocation } = useLocationStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    label: "Home",
    street: "",
    city: "",
    phone: ""
  })

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAddressModalOpen) {
        handleClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isAddressModalOpen])

  // Prevent body scroll when open
  useEffect(() => {
    if (isAddressModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isAddressModalOpen])

  if (!isAddressModalOpen) return null

  const handleClose = () => {
    setAddressModalOpen(false)
    setIsEditing(false)
    setEditingId(null)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.street || !formData.city || !formData.phone) return

    if (editingId) {
      updateAddress(editingId, formData)
    } else {
      addAddress(formData)
    }
    setIsEditing(false)
    setEditingId(null)
  }

  const handleEdit = (addr: Address) => {
    setFormData({
      label: addr.label,
      street: addr.street,
      city: addr.city,
      phone: addr.phone
    })
    setEditingId(addr.id)
    setIsEditing(true)
  }

  const handleAddNew = () => {
    setFormData({
      label: "Home",
      street: "",
      city: "",
      phone: ""
    })
    setEditingId(null)
    setIsEditing(true)
  }

  const handleUseCurrentLocation = async () => {
    await fetchLocation()
    const { address: fetchedAddress } = useLocationStore.getState()
    if (fetchedAddress && fetchedAddress !== 'Location Unavailable') {
      const parts = fetchedAddress.split(',').map(s => s.trim())
      setFormData({
        label: "Home",
        street: parts[0] || fetchedAddress,
        city: parts.length > 1 ? parts[1] : "",
        phone: ""
      })
      setEditingId(null)
      setIsEditing(true)
    }
  }

  const getLabelIcon = (label: string) => {
    if (label.toLowerCase() === "work") return <Briefcase className="w-5 h-5" />
    if (label.toLowerCase() === "home") return <Home className="w-5 h-5" />
    return <MapPin className="w-5 h-5" />
  }

  const mapQuery = (formData.street + " " + formData.city).trim() || "Pakistan"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            {isEditing ? (editingId ? "Edit Address" : "Add New Address") : "Select Delivery Address"}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 -mr-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* Map Preview */}
              <div className="w-full h-36 bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200 shadow-inner">
                <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  loading="lazy" 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Label</label>
                <div className="flex gap-2">
                  {["Home", "Work", "Other"].map(l => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setFormData({...formData, label: l})}
                      className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
                        formData.label === l 
                          ? "bg-slate-900 text-white" 
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Street Address</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. House L-52, Block 3"
                  value={formData.street} 
                  onChange={e => setFormData({...formData, street: e.target.value})} 
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">City</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Karachi"
                    value={formData.city} 
                    onChange={e => setFormData({...formData, city: e.target.value})} 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Phone</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 0300 1234567"
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none" 
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-bold shadow-md shadow-rose-500/30 hover:bg-rose-600 transition-all flex items-center gap-2"
                >
                  Save Address
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              
              {/* Current Location Option */}
              <button 
                onClick={handleUseCurrentLocation}
                className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl p-4 flex items-center gap-4 transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-blue-900 mb-0.5">Use Current Location</p>
                  <p className="text-sm text-blue-700/70">{isLoading ? "Locating you..." : (address && address !== 'Location Unavailable' ? address : "Find my nearest location")}</p>
                </div>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or choose saved</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              {/* Saved Addresses List */}
              <div className="space-y-3">
                {addresses.length === 0 && (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    No saved addresses yet.
                  </div>
                )}
                
                {addresses.map(addr => {
                  const isSelected = selectedAddressId === addr.id
                  return (
                    <div 
                      key={addr.id} 
                      className={`relative rounded-2xl border-2 transition-all p-4 flex gap-4 cursor-pointer overflow-hidden ${
                        isSelected 
                          ? "border-emerald-500 bg-emerald-50/30" 
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        selectAddress(addr.id)
                        handleClose()
                      }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {getLabelIcon(addr.label)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`font-bold ${isSelected ? "text-emerald-900" : "text-gray-900"}`}>{addr.label}</p>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{addr.street}</p>
                        <p className="text-sm text-gray-500">{addr.city} • {addr.phone}</p>
                      </div>

                      {/* Actions - Edit / Delete */}
                      <div className="flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => handleEdit(addr)}
                          className="p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => removeAddress(addr.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add New Button */}
              <button 
                onClick={handleAddNew}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 transition-colors"
              >
                <Plus className="w-5 h-5" /> Add New Address
              </button>

            </div>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  )
}
