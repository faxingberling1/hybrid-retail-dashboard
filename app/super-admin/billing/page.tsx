"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, Plus, Receipt, Calendar, Building2, 
  Trash2, X, Save, CheckCircle, Clock, FileText, DollarSign,
  AlertCircle, Check, Edit2, Eye, ArrowLeft, Package, Monitor, Layers
} from "lucide-react"

type Organization = { id: string, name: string, slug: string }
type InvoiceItem = { name: string, description: string, type: 'one-time' | 'recurring', quantity: number | string, price: number | string, period_start?: string, period_end?: string }
type Invoice = { id: string, invoice_number: string, organization_id: string, organization_name?: string, amount: number, currency: string, status: string, due_date: string | null, items: InvoiceItem[], created_at: string }
type Equipment = { id: string, name: string, description: string, price: string | number, type: string, is_active: boolean }
type Addon = { id: string, name: string, description: string, price: string | number, interval: string, is_active: boolean }

export default function BillingPage() {
  const [mainTab, setMainTab] = useState<'invoices' | 'equipments' | 'addons'>('invoices')
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [addons, setAddons] = useState<Addon[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Invoice state
  const [isAddingInvoice, setIsAddingInvoice] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [filterTab, setFilterTab] = useState<'all' | 'draft' | 'paid' | 'overdue'>('all')
  const [selectedOrgId, setSelectedOrgId] = useState<string>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Catalog Modal state
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false)
  
  // Equipments/Addons Management state
  const [isAddingCatalogItem, setIsAddingCatalogItem] = useState(false)
  const [catalogFormData, setCatalogFormData] = useState({ name: '', description: '', price: '' })
  
  // Assign Addon State
  const [isAssigningAddon, setIsAssigningAddon] = useState(false)
  const [addonToAssign, setAddonToAssign] = useState('')

  const [formData, setFormData] = useState({
    organization_id: "",
    invoice_number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    due_date: "",
    notes: "",
    items: [{ name: "", description: "", type: "one-time", quantity: "", price: "", period_start: "", period_end: "" }] as InvoiceItem[]
  })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [invRes, orgRes, eqRes, addRes, subRes] = await Promise.all([
        fetch('/api/super-admin/invoices'),
        fetch('/api/super-admin/organizations'),
        fetch('/api/super-admin/equipments'),
        fetch('/api/super-admin/addons'),
        fetch('/api/super-admin/subscriptions')
      ])
      if (invRes.ok) setInvoices(await invRes.json())
      if (orgRes.ok) setOrganizations(await orgRes.json())
      if (eqRes.ok) setEquipments(await eqRes.json())
      if (addRes.ok) setAddons(await addRes.json())
      if (subRes.ok) setSubscriptions(await subRes.json())
    } catch (error) { console.error(error) } 
    finally { setLoading(false) }
  }

  // ==== INVOICE HANDLERS ====
  const handleEditDraft = (invoice: Invoice) => {
    // @ts-ignore
    const invoiceNotes = invoice.notes || ""
    setFormData({
      organization_id: invoice.organization_id,
      invoice_number: invoice.invoice_number,
      due_date: invoice.due_date ? invoice.due_date.substring(0, 10) : "",
      notes: invoiceNotes,
      items: invoice.items && invoice.items.length > 0 ? invoice.items.map(item => ({
        ...item, description: item.description || "", type: item.type || "one-time",
        quantity: item.quantity === 0 ? "" : item.quantity, price: item.price === 0 ? "" : item.price,
        period_start: item.period_start || "", period_end: item.period_end || ""
      })) : [{ name: "", description: "", type: "one-time", quantity: "", price: "", period_start: "", period_end: "" }]
    })
    setEditingId(invoice.id)
    setIsAddingInvoice(true)
    setIsPreviewing(false)
  }

  const closeEditor = () => {
    setIsAddingInvoice(false); setIsPreviewing(false); setEditingId(null)
    setFormData({
      organization_id: "", invoice_number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      due_date: "", notes: "", items: [{ name: "", description: "", type: "one-time", quantity: "", price: "", period_start: "", period_end: "" }]
    })
  }

  const handleAddItem = () => setFormData({ ...formData, items: [...formData.items, { name: "", description: "", type: "one-time", quantity: "", price: "", period_start: "", period_end: "" }] })
  const handleRemoveItem = (index: number) => setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) })
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items]; newItems[index] = { ...newItems[index], [field]: value }
    setFormData({ ...formData, items: newItems })
  }

  const addFromCatalog = (item: any, type: 'one-time'|'recurring') => {
    const newItem: InvoiceItem = { name: item.name, description: item.description || '', type, quantity: 1, price: item.price }
    // If we only have 1 blank item, replace it
    if (formData.items.length === 1 && !formData.items[0].name && formData.items[0].price === '') {
      setFormData({ ...formData, items: [newItem] })
    } else {
      setFormData({ ...formData, items: [...formData.items, newItem] })
    }
    setIsCatalogModalOpen(false)
  }

  const calculateTotal = () => formData.items.reduce((total, item) => total + ((Number(item.quantity) || 0) * (Number(item.price) || 0)), 0)

  const handleSubmitInvoice = async () => {
    if (!formData.organization_id) return alert("Please select an organization")
    try {
      setSubmitting(true)
      const res = await fetch(editingId ? `/api/super-admin/invoices/${editingId}` : '/api/super-admin/invoices', {
        method: editingId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, amount: calculateTotal() })
      })
      if (res.ok) { closeEditor(); fetchData() } 
      else { const err = await res.json(); alert(err.error || "Failed to create invoice") }
    } catch (error) { alert("An error occurred") } 
    finally { setSubmitting(false) }
  }

  const handleAction = async (url: string, method: string) => {
    try { const res = await fetch(url, { method }); if (res.ok) fetchData(); } catch (error) { console.error(error) }
  }

  const handleMarkPaid = async (id: string) => {
    if (!confirm("Mark this invoice as paid?")) return
    try {
      const res = await fetch(`/api/super-admin/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' })
      })
      if (res.ok) fetchData()
    } catch (error) {
      console.error(error)
    }
  }

  // ==== CATALOG ITEM HANDLERS (Equipments & Addons) ====
  const handleSubmitCatalogItem = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const endpoint = mainTab === 'equipments' ? '/api/super-admin/equipments' : '/api/super-admin/addons'
      const payload = mainTab === 'equipments' ? { ...catalogFormData, type: 'Hardware' } : { ...catalogFormData, interval: 'month' }
      
      const res = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (res.ok) { setIsAddingCatalogItem(false); setCatalogFormData({ name: '', description: '', price: '' }); fetchData() }
      else { const err = await res.json(); alert(err.error || "Failed to add item") }
    } catch (error) { console.error(error) } 
    finally { setSubmitting(false) }
  }

  const handleAssignAddon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addonToAssign || selectedOrgId === 'all') return
    const addon = addons.find(a => a.id === addonToAssign)
    if (!addon) return

    try {
      setSubmitting(true)
      const res = await fetch('/api/super-admin/subscriptions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organization_id: selectedOrgId, addon_id: addon.id, plan: addon.name })
      })
      if (res.ok) { setIsAssigningAddon(false); setAddonToAssign(''); fetchData() }
      else { const err = await res.json(); alert(err.error || "Failed to assign add-on") }
    } catch (error) { console.error(error) }
    finally { setSubmitting(false) }
  }

  const formatCurrency = (amount: number | string) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(Number(amount))

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
    </div>
  )

  const orgInvoices = invoices.filter(inv => selectedOrgId === 'all' ? true : inv.organization_id === selectedOrgId)
  const filteredInvoices = orgInvoices.filter(inv => filterTab === 'all' ? true : inv.status === filterTab)
  
  const totalInvoiced = orgInvoices.reduce((sum, inv) => sum + Number(inv.amount), 0)
  const outstandingBalance = orgInvoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + Number(inv.amount), 0)
  const totalPaid = orgInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + Number(inv.amount), 0)

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header & Main Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
            <Receipt className="w-8 h-8 mr-3 text-indigo-500" />
            Billing & Catalog
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Manage your invoices, equipments, and add-on subscriptions.
          </p>
        </div>
      </div>

      {!isAddingInvoice && (
        <div className="flex gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
          <button onClick={() => setMainTab('invoices')} className={`flex items-center pb-2 border-b-2 font-bold px-2 transition-colors ${mainTab === 'invoices' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <Receipt className="w-4 h-4 mr-2" /> Invoices
          </button>
          <button onClick={() => setMainTab('equipments')} className={`flex items-center pb-2 border-b-2 font-bold px-2 transition-colors ${mainTab === 'equipments' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <Monitor className="w-4 h-4 mr-2" /> Equipments
          </button>
          <button onClick={() => setMainTab('addons')} className={`flex items-center pb-2 border-b-2 font-bold px-2 transition-colors ${mainTab === 'addons' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <Layers className="w-4 h-4 mr-2" /> Add-ons
          </button>
        </div>
      )}

      {/* CATALOG MODAL FOR INVOICE BUILDER */}
      {isCatalogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-white/10">
              <h3 className="text-xl font-bold">Select from Catalog</h3>
              <button onClick={() => setIsCatalogModalOpen(false)} className="text-slate-400 hover:text-rose-500"><X /></button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-8">
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Equipments</h4>
                <div className="grid grid-cols-2 gap-4">
                  {equipments.map(eq => (
                    <button key={eq.id} onClick={() => addFromCatalog(eq, 'one-time')} className="p-4 border border-slate-200 dark:border-white/10 rounded-xl text-left hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                      <p className="font-bold text-slate-900 dark:text-white">{eq.name}</p>
                      <p className="text-sm text-slate-500 truncate">{eq.description}</p>
                      <p className="mt-2 font-bold text-indigo-600">{formatCurrency(eq.price)}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Add-ons</h4>
                <div className="grid grid-cols-2 gap-4">
                  {addons.map(ad => (
                    <button key={ad.id} onClick={() => addFromCatalog(ad, 'recurring')} className="p-4 border border-slate-200 dark:border-white/10 rounded-xl text-left hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors">
                      <p className="font-bold text-slate-900 dark:text-white">{ad.name}</p>
                      <p className="text-sm text-slate-500 truncate">{ad.description}</p>
                      <p className="mt-2 font-bold text-indigo-600">{formatCurrency(ad.price)} <span className="text-xs font-normal">/{ad.interval}</span></p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: EQUIPMENTS or ADDONS */}
      {mainTab !== 'invoices' && !isAddingInvoice && (
        <div className="bg-white dark:bg-[#0B0E17] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{mainTab === 'equipments' ? 'Equipments Catalog' : 'Add-ons Catalog'}</h2>
            {!isAddingCatalogItem && (
              <button onClick={() => setIsAddingCatalogItem(true)} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" /> Add {mainTab === 'equipments' ? 'Equipment' : 'Add-on'}
              </button>
            )}
          </div>

          {isAddingCatalogItem && (
            <form onSubmit={handleSubmitCatalogItem} className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-white/10 mb-8 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Add New Item</h3>
                <button type="button" onClick={() => setIsAddingCatalogItem(false)} className="text-slate-400 hover:text-rose-500"><X className="w-5 h-5"/></button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <input required placeholder="Name (e.g. POS Terminal)" className="px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-white/10" value={catalogFormData.name} onChange={e => setCatalogFormData({...catalogFormData, name: e.target.value})} />
                <input required type="number" placeholder="Price" className="px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-white/10" value={catalogFormData.price} onChange={e => setCatalogFormData({...catalogFormData, price: e.target.value})} />
                <input placeholder="Description (Optional)" className="px-4 py-2 rounded-lg border dark:bg-slate-800 dark:border-white/10 md:col-span-2" value={catalogFormData.description} onChange={e => setCatalogFormData({...catalogFormData, description: e.target.value})} />
              </div>
              <button type="submit" disabled={submitting} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Save Item</button>
            </form>
          )}

          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-white/10 text-xs text-slate-400 uppercase">
                <th className="py-4 px-2">Name</th>
                <th className="py-4 px-2">Description</th>
                <th className="py-4 px-2">Price</th>
                <th className="py-4 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(mainTab === 'equipments' ? equipments : addons).map((item: any) => (
                <tr key={item.id} className="border-b dark:border-white/5">
                  <td className="py-4 px-2 font-bold">{item.name}</td>
                  <td className="py-4 px-2 text-slate-500">{item.description}</td>
                  <td className="py-4 px-2 text-indigo-600 font-bold">{formatCurrency(item.price)}</td>
                  <td className="py-4 px-2 text-right">
                    <button onClick={() => { if(confirm("Delete item?")) handleAction(`/api/super-admin/${mainTab}/${item.id}`, 'DELETE') }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW: INVOICES */}
      {mainTab === 'invoices' && (
        <AnimatePresence mode="wait">
          {isAddingInvoice && !isPreviewing ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0B0E17] rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 dark:border-white/5"
            >
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100 dark:border-white/5">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{editingId ? "Edit Draft Invoice" : "New Invoice Builder"}</h2>
                <button onClick={closeEditor} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setIsPreviewing(true); }} className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Organization / Tenant</label>
                    <select required className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white" value={formData.organization_id} onChange={(e) => setFormData({...formData, organization_id: e.target.value})}>
                      <option value="">Select Organization...</option>
                      {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Invoice Number</label>
                    <input required type="text" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium" value={formData.invoice_number} onChange={(e) => setFormData({...formData, invoice_number: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Due Date</label>
                    <input type="date" className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium" value={formData.due_date} onChange={(e) => setFormData({...formData, due_date: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Line Items</label>
                    <div className="space-x-3">
                      <button type="button" onClick={() => setIsCatalogModalOpen(true)} className="text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                        <Plus className="w-4 h-4 inline mr-1"/> Add from Catalog
                      </button>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">Total: {formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {formData.items.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 space-y-4 relative group">
                        {formData.items.length > 1 && (
                          <button type="button" onClick={() => handleRemoveItem(idx)} className="absolute -right-3 -top-3 p-2 bg-white dark:bg-slate-800 text-rose-500 shadow-sm border border-slate-100 dark:border-white/5 rounded-full hover:bg-rose-50 transition-colors z-10"><Trash2 className="w-4 h-4" /></button>
                        )}
                        <div className="grid md:grid-cols-12 gap-4">
                          <div className="md:col-span-6 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Item Name</label>
                            <input required placeholder="e.g., Monthly Plan" className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm" value={item.name} onChange={(e) => handleItemChange(idx, 'name', e.target.value)} />
                          </div>
                          <div className="md:col-span-6 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                            <input placeholder="Add brief details..." className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm" value={item.description} onChange={(e) => handleItemChange(idx, 'description', e.target.value)} />
                          </div>
                          <div className="md:col-span-4 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Type</label>
                            <select className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm" value={item.type} onChange={(e) => handleItemChange(idx, 'type', e.target.value)}>
                              <option value="one-time">One-time Charge</option><option value="recurring">Recurring (Plan/Maintenance)</option>
                            </select>
                          </div>
                          <div className="md:col-span-4 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quantity</label>
                            <input required type="number" min="1" placeholder="Qty" className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm" value={item.quantity} onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)} />
                          </div>
                          <div className="md:col-span-4 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unit Price</label>
                            <input required type="number" min="0" placeholder="Price" className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm" value={item.price} onChange={(e) => handleItemChange(idx, 'price', e.target.value)} />
                          </div>
                          {item.type === 'recurring' && (
                            <div className="md:col-span-12 grid grid-cols-2 gap-4 mt-2 p-4 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Coverage Start Date</label>
                                <input type="date" className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm" value={item.period_start || ''} onChange={(e) => handleItemChange(idx, 'period_start', e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Coverage End Date</label>
                                <input type="date" className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm" value={item.period_end || ''} onChange={(e) => handleItemChange(idx, 'period_end', e.target.value)} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={handleAddItem} className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center mt-2">
                    <Plus className="w-4 h-4 mr-2" /> Add Custom Item
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Notes / Remarks</label>
                  <textarea rows={3} placeholder="Thank you for your business..." className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium resize-none" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-white/5">
                  <button type="submit" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold tracking-wide shadow-lg flex items-center">
                    <Eye className="w-5 h-5 mr-2" /> Preview Invoice
                  </button>
                </div>
              </form>
            </motion.div>
          ) : isAddingInvoice && isPreviewing ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-[#0B0E17] rounded-3xl p-6 md:p-10 shadow-xl border border-slate-100 dark:border-white/5 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100 dark:border-white/5">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Invoice Preview</h2>
                <div className="flex gap-2">
                  <button onClick={() => setIsPreviewing(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-indigo-600 bg-slate-100 rounded-lg flex items-center"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Edit</button>
                  <button onClick={closeEditor} className="p-2 text-slate-400 hover:text-rose-500 bg-rose-50 rounded-xl"><X className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-white/10">
                <div className="flex justify-between items-start mb-12">
                  <div><h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">INVOICE</h3><p className="text-sm font-bold text-slate-500">{formData.invoice_number}</p></div>
                  <div className="text-right"><p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Billed To</p><p className="text-lg font-bold text-slate-900 dark:text-white">{organizations.find(o => o.id === formData.organization_id)?.name || "Unknown Organization"}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-8 mb-10 border-b border-slate-200 dark:border-white/10 pb-8">
                  <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Issue Date</p><p className="font-bold text-slate-800 dark:text-slate-200">{new Date().toLocaleDateString()}</p></div>
                  {formData.due_date && <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Due Date</p><p className="font-bold text-slate-800 dark:text-slate-200">{new Date(formData.due_date).toLocaleDateString()}</p></div>}
                </div>
                <table className="w-full text-left mb-8">
                  <thead><tr className="border-b border-slate-200 dark:border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="py-3 px-2">Item</th><th className="py-3 px-2 text-center">Type</th><th className="py-3 px-2 text-center">Qty</th><th className="py-3 px-2 text-right">Price</th><th className="py-3 px-2 text-right">Total</th></tr></thead>
                  <tbody className="text-sm">
                    {formData.items.map((item, idx) => {
                      const q = Number(item.quantity) || 0; const p = Number(item.price) || 0
                      return (
                        <tr key={idx} className="border-b border-slate-100 dark:border-white/5">
                          <td className="py-4 px-2">
                            <p className="font-bold text-slate-900 dark:text-white">{item.name || '-'}</p>
                            {item.description && <p className="text-slate-500 text-xs mt-1">{item.description}</p>}
                            {item.type === 'recurring' && (item.period_start || item.period_end) && (
                              <p className="text-indigo-500 text-[10px] font-bold mt-2 uppercase tracking-wide">
                                Coverage: {item.period_start ? new Date(item.period_start).toLocaleDateString() : 'N/A'} - {item.period_end ? new Date(item.period_end).toLocaleDateString() : 'Ongoing'}
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-2 text-center"><span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${item.type === 'recurring' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>{item.type}</span></td>
                          <td className="py-4 px-2 text-center font-medium text-slate-700 dark:text-slate-300">{q}</td><td className="py-4 px-2 text-right font-medium text-slate-700 dark:text-slate-300">{formatCurrency(p)}</td><td className="py-4 px-2 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(q * p)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <div className="flex justify-end pt-4 border-t-2 border-slate-900 dark:border-white"><div className="w-1/3 flex justify-between items-center text-lg"><span className="font-black text-slate-900 dark:text-white">Total</span><span className="font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(calculateTotal())}</span></div></div>
                {formData.notes && <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Notes</p><p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{formData.notes}</p></div>}
              </div>
              <div className="flex justify-end pt-8 mt-4">
                <button onClick={handleSubmitInvoice} disabled={submitting} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold tracking-wide shadow-lg flex items-center">
                  {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />} {editingId ? "Save Draft" : "Confirm & Generate"}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* ORGANIZATION FILTER & SUMMARY */}
              <div className="bg-white dark:bg-[#0B0E17] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-white/5 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="w-full md:w-1/3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 block">Filter by Organization</label>
                  <select 
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={selectedOrgId}
                    onChange={(e) => setSelectedOrgId(e.target.value)}
                  >
                    <option value="all">All Organizations (Global View)</option>
                    {organizations.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                  </select>
                </div>

                {selectedOrgId !== 'all' && (
                  <div className="flex gap-6 md:gap-10 w-full md:w-2/3 justify-end">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Outstanding</p>
                      <p className="text-2xl font-black text-rose-500">{formatCurrency(outstandingBalance)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Total Paid</p>
                      <p className="text-2xl font-black text-emerald-500">{formatCurrency(totalPaid)}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Total Invoiced</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(totalInvoiced)}</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedOrgId !== 'all' && (
                <div className="bg-white dark:bg-[#0B0E17] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-white/5 space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Active Subscriptions</h3>
                    {!isAssigningAddon && (
                      <button onClick={() => setIsAssigningAddon(true)} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100"><Plus className="w-4 h-4 inline mr-1" /> Assign Add-on</button>
                    )}
                  </div>

                  {isAssigningAddon && (
                    <form onSubmit={handleAssignAddon} className="flex flex-col md:flex-row gap-4 mb-4 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl">
                      <select required value={addonToAssign} onChange={e => setAddonToAssign(e.target.value)} className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2">
                        <option value="">Select an Add-on...</option>
                        {addons.map(a => <option key={a.id} value={a.id}>{a.name} ({formatCurrency(a.price)}/{a.interval})</option>)}
                      </select>
                      <div className="flex gap-2">
                        <button type="submit" disabled={submitting} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold">Save</button>
                        <button type="button" onClick={() => setIsAssigningAddon(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"><X className="w-5 h-5" /></button>
                      </div>
                    </form>
                  )}

                  {subscriptions.filter(s => s.organization_id === selectedOrgId).length === 0 ? (
                    <p className="text-sm text-slate-500 py-4">No active subscriptions for this organization.</p>
                  ) : (
                    <table className="w-full text-left text-sm">
                      <thead><tr className="border-b border-slate-100 dark:border-white/5 text-slate-400"><th className="py-2">Add-on / Plan</th><th className="py-2">Start Date</th><th className="py-2">Status</th><th className="py-2 text-right">Price</th><th className="py-2 text-right">Actions</th></tr></thead>
                      <tbody>
                        {subscriptions.filter(s => s.organization_id === selectedOrgId).map(sub => (
                          <tr key={sub.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50/50 group">
                            <td className="py-4 font-bold text-slate-800 dark:text-white flex items-center"><Layers className="w-4 h-4 mr-2 text-indigo-500"/> {sub.plan}</td>
                            <td className="py-4 text-slate-500">{new Date(sub.current_period_start).toLocaleDateString()}</td>
                            <td className="py-4">{sub.status === 'active' ? <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Active</span> : <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{sub.status}</span>}</td>
                            <td className="py-4 text-right font-bold text-emerald-600">{formatCurrency(sub.addon_price || 0)}<span className="text-[10px] font-normal text-slate-400 ml-1">/{sub.addon_interval || 'month'}</span></td>
                            <td className="py-4 text-right">
                              <button onClick={() => { if(confirm("Cancel subscription?")) handleAction(`/api/super-admin/subscriptions/${sub.id}`, 'DELETE') }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4"/>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              <div className="bg-white dark:bg-[#0B0E17] rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-white/5 overflow-x-auto">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {['all', 'draft', 'paid', 'overdue'].map(tab => (
                      <button key={tab} onClick={() => setFilterTab(tab as any)} className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${filterTab === tab ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10'}`}>{tab}</button>
                    ))}
                  </div>
                  <button onClick={() => { 
                    setIsAddingInvoice(true); 
                    setEditingId(null);
                    setFormData({
                      organization_id: selectedOrgId === 'all' ? "" : selectedOrgId,
                      invoice_number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
                      due_date: "",
                      notes: "",
                      items: [{ name: "", description: "", type: "one-time", quantity: "", price: "", period_start: "", period_end: "" }]
                    })
                  }} className="flex items-center px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all shrink-0">
                    <Plus className="w-4 h-4 mr-2" /> Create Invoice
                  </button>
                </div>
              {filteredInvoices.length === 0 ? (
                <div className="py-20 text-center"><Receipt className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-700 mb-4" /><h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No invoices found</h3><p className="text-slate-500">Create your first invoice to get started.</p></div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead><tr className="border-b border-slate-100 dark:border-white/5"><th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Invoice</th><th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Organization</th><th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th><th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th><th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest">Due Date</th><th className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th></tr></thead>
                  <tbody>
                    {filteredInvoices.map(invoice => (
                      <tr key={invoice.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-4"><div className="flex items-center"><FileText className="w-4 h-4 text-slate-400 mr-2" /><span className="font-bold text-slate-900 dark:text-white">{invoice.invoice_number}</span></div></td>
                        <td className="py-4 px-4"><div className="flex items-center"><Building2 className="w-4 h-4 text-slate-400 mr-2" /><span className="text-slate-600 dark:text-slate-300 font-medium">{invoice.organization_name || 'Unknown'}</span></div></td>
                        <td className="py-4 px-4"><span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 px-3 py-1 rounded-lg">{formatCurrency(invoice.amount)}</span></td>
                        <td className="py-4 px-4">{invoice.status === 'paid' ? <span className="flex w-fit items-center text-xs font-bold px-2 py-1 rounded-md bg-emerald-100 text-emerald-700"><CheckCircle className="w-3 h-3 mr-1" /> Paid</span> : invoice.status === 'draft' ? <span className="flex w-fit items-center text-xs font-bold px-2 py-1 rounded-md bg-amber-100 text-amber-700"><Clock className="w-3 h-3 mr-1" /> Draft</span> : <span className="flex w-fit items-center text-xs font-bold px-2 py-1 rounded-md bg-rose-100 text-rose-700"><AlertCircle className="w-3 h-3 mr-1" /> {invoice.status}</span>}</td>
                        <td className="py-4 px-4"><div className="flex items-center text-sm text-slate-500"><Calendar className="w-4 h-4 mr-2" />{invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}</div></td>
                        <td className="py-4 px-4 text-right space-x-2">
                          {invoice.status === 'draft' && <><button title="Mark as Paid" onClick={() => handleMarkPaid(invoice.id)} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl inline-block"><Check className="w-4 h-4" /></button><button title="Edit Draft" onClick={() => handleEditDraft(invoice)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl inline-block"><Edit2 className="w-4 h-4" /></button></>}
                          <button title="Delete" onClick={() => { if(confirm("Delete draft?")) handleAction(`/api/super-admin/invoices/${invoice.id}`, 'DELETE') }} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
