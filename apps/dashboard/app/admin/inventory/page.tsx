"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Package, Search, Filter, ArrowUpDown, MoreVertical, AlertCircle, Tag, Box, Plus, Download, History, TrendingUp, BarChart3, ArrowRight, CheckCircle2, Clock, LayoutGrid, List, Layers, Warehouse, RefreshCw, X, Trash2
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export default function AdminInventoryPage() {
    const queryClient = useQueryClient()
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [newCategoryName, setNewCategoryName] = useState("")
    const [isAddingCategory, setIsAddingCategory] = useState(false)

    // Fetch Categories
    const { data: categoriesData = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: () => fetch('/api/inventory/categories').then(async res => {
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to fetch categories')
            return Array.isArray(data) ? data : []
        })
    })

    const categoryList = ["All", ...categoriesData.map((c: any) => c.name)]

    // Fetch Products
    const { data: products = [], isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: () => fetch('/api/inventory').then(async res => {
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to fetch products')
            return Array.isArray(data) ? data : []
        })
    })

    useEffect(() => {
        if (products.length > 0) {
            console.log("📦 Admin Inventory loaded products:", products)
        }
        if (error) {
            console.error("❌ Admin Inventory fetch error:", error)
        }
    }, [products, error])

    // Mutations
    const addProductMutation = useMutation({
        mutationFn: (newProduct: any) => fetch('/api/inventory', {
            method: 'POST',
            body: JSON.stringify(newProduct)
        }).then(res => res.json()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            setIsAddModalOpen(false)
            toast.success("Product registered successfully")
        },
        onError: (err: any) => toast.error(`Failed to register product: ${err.message}`)
    })

    const updateProductMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => fetch(`/api/inventory/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        }).then(res => res.json()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            setEditingProduct(null)
            toast.success("Product updated successfully")
        },
        onError: (err: any) => toast.error(`Failed to update product: ${err.message}`)
    })

    const deleteProductMutation = useMutation({
        mutationFn: (id: string) => fetch(`/api/inventory/${id}`, {
            method: 'DELETE'
        }).then(async res => {
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to delete product')
            return data
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            setEditingProduct(null)
            toast.success("Product deleted successfully")
        },
        onError: (err: any) => toast.error(`Delete failed: ${err.message}`)
    })

    const addCategoryMutation = useMutation({
        mutationFn: (name: string) => fetch('/api/inventory/categories', {
            method: 'POST',
            body: JSON.stringify({ name })
        }).then(res => res.json()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] })
            setIsAddingCategory(false)
            setNewCategoryName("")
            toast.success("Category added")
        }
    })

    const filteredInventory = useMemo(() => {
        return products.map((item: any) => {
            let status = 'in-stock'
            if (item.stock <= 0) status = 'out-of-stock'
            else if (item.stock <= 15) status = 'low-stock'

            const date = new Date(item.updated_at || item.created_at)
            const lastUpdate = date.toLocaleDateString()

            return {
                ...item,
                status,
                lastUpdate
            }
        }).filter((item: any) => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()))
            const matchesCategory = selectedCategory === "All" || (item.category && item.category.name === selectedCategory)
            return matchesSearch && matchesCategory
        })
    }, [searchQuery, selectedCategory, products])

    const stats = useMemo(() => {
        const totalItems = products.length
        const lowStock = products.filter((p: any) => p.stock > 0 && p.stock <= 15).length
        const outOfStock = products.filter((p: any) => p.stock <= 0).length
        const stockValue = products.reduce((acc: number, p: any) => acc + (Number(p.price) * p.stock), 0)

        return [
            { label: "Total Items", value: totalItems.toLocaleString(), icon: Layers, color: "blue" },
            { label: "Low Stock", value: lowStock.toString(), icon: AlertCircle, color: "orange" },
            { label: "Out of Stock", value: outOfStock.toString(), icon: Warehouse, color: "red" },
            { label: "Stock Value", value: `₨ ${(stockValue / 1000).toFixed(1)}k`, icon: TrendingUp, color: "green" },
        ]
    }, [products])

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
            {/* Header & Main Actions */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-2xl shadow-blue-500/20 ring-1 ring-white/20">
                        <Package className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Admin Inventory Hub</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Inventory Management</h1>
                        <p className="text-gray-500 font-medium">Global stock oversight and product registration</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <Download className="h-5 w-5 text-gray-400" />
                        Export Data
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Product
                    </button>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        {...({
                            key: stat.label,
                            initial: { opacity: 0, y: 20 },
                            animate: { opacity: 1, y: 0 },
                            transition: { delay: i * 0.1 },
                            className: "bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group"
                        } as any)}
                    >
                        <div className="absolute right-0 top-0 w-24 h-24 bg-gray-50 rounded-full blur-3xl group-hover:bg-blue-50 transition-colors duration-500"></div>
                        <div className="relative flex items-center gap-5">
                            <div className={`p-4 rounded-2xl ${stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                stat.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                                    stat.color === 'red' ? 'bg-red-50 text-red-600' :
                                        'bg-green-50 text-green-600'
                                }`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white/60 backdrop-blur-xl border border-gray-200/50 p-4 rounded-[2rem] shadow-sm flex flex-col lg:flex-row items-center gap-4">
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by product name, SKU or barcode..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
                    {categoryList.map((cat: any) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCategory === cat
                                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                                : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 border-l border-gray-200 pl-4 ml-auto hidden lg:flex">
                    <button
                        onClick={() => setViewMode('table')}
                        className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <List className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </button>
                    <div className="h-8 w-px bg-gray-200 mx-2"></div>
                    <button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-50 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all"
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Sync Stock
                    </button>
                </div>
            </div>

            {/* Content View */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <RefreshCw className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-4" />
                        <p className="text-gray-500 font-bold">Initalizing Inventory...</p>
                    </div>
                ) : viewMode === 'table' ? (
                    <motion.div
                        {...({
                            key: "table",
                            initial: { opacity: 0, x: -20 },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: 20 },
                            className: "bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden"
                        } as any)}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Product Analysis</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Stock Metrics</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Demand</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Unit Price</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredInventory.map((item: any, idx: number) => (
                                        <motion.tr
                                            {...({
                                                key: item.id,
                                                initial: { opacity: 0 },
                                                animate: { opacity: 1 },
                                                transition: { delay: idx * 0.05 },
                                                className: "group hover:bg-blue-50/30 transition-all duration-300"
                                            } as any)}
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-5">
                                                    <div className="relative">
                                                        <div className="h-12 w-12 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-500 shadow-sm border border-transparent group-hover:border-blue-100">
                                                            <Box className="h-6 w-6 text-gray-400 group-hover:text-blue-600" />
                                                        </div>
                                                        <div className={`absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white ${item.status === 'in-stock' ? 'bg-green-500' :
                                                            item.status === 'low-stock' ? 'bg-orange-500' : 'bg-red-500'
                                                            }`}></div>
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.name}</p>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.sku}</span>
                                                            <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                                                            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                                <Clock className="h-3 w-3" /> {item.lastUpdate}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-xs font-black text-gray-600 uppercase tracking-widest px-3 py-1.5 bg-gray-100 rounded-lg">
                                                    {item.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center justify-between min-w-[120px]">
                                                        <span className={`text-sm font-black ${item.stock <= 15 ? 'text-orange-600 animate-pulse' : 'text-gray-900'
                                                            }`}>{item.stock} Units</span>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Limit 100</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ${item.stock <= 5 ? 'bg-red-500' :
                                                                item.stock <= 20 ? 'bg-orange-500' : 'bg-green-500'
                                                                }`}
                                                            style={{ width: `${Math.min(100, (item.stock / 100) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={`flex items-center gap-1.5 ${item.demand === 'Top' ? 'text-rose-600' :
                                                    item.demand === 'High' ? 'text-blue-600' : 'text-gray-400'
                                                    }`}>
                                                    <TrendingUp className="h-4 w-4" />
                                                    <span className="text-xs font-black uppercase tracking-widest">{item.demand || 'Normal'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right font-black text-gray-900 tracking-widest">
                                                ₨ {item.price.toLocaleString()}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-blue-100 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 duration-300">
                                                        <History className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingProduct(item)}
                                                        className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 duration-300 delay-75"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        {...({
                            key: "grid",
                            initial: { opacity: 0, x: 20 },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: -20 },
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        } as any)}
                    >
                        {filteredInventory.map((item: any, idx: number) => (
                            <motion.div
                                {...({
                                    key: item.id,
                                    layout: true,
                                    className: "bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden"
                                } as any)}
                            >
                                <div className="absolute right-0 top-0 h-40 w-40 bg-gray-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-blue-50 transition-colors duration-500"></div>
                                <div className="relative">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-16 w-16 bg-gray-900 rounded-[2rem] flex items-center justify-center shadow-lg shadow-gray-900/20 group-hover:scale-110 transition-transform duration-500 ring-4 ring-white">
                                            <Box className="h-7 w-7 text-white" />
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-transparent ${item.status === 'in-stock' ? 'bg-green-100 text-green-700' :
                                            item.status === 'low-stock' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {item.status.replace('-', ' ')}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-1 group-hover:text-blue-600 transition-colors uppercase leading-tight">{item.name}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">{item.sku || 'NO SKU'} • {item.category?.name || 'Uncategorized'}</p>

                                    <div className="space-y-4 pt-6 border-t border-gray-100">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Stock</p>
                                                <p className={`text-2xl font-black ${item.stock <= 15 ? 'text-orange-600' : 'text-gray-900'}`}>{item.stock}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                                                <p className="text-2xl font-black text-gray-900">₨ {item.price}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setEditingProduct(item)}
                                            className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all shadow-sm"
                                        >
                                            View Details / Edit
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add New Product Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            {...({
                                initial: { opacity: 0 },
                                animate: { opacity: 1 },
                                exit: { opacity: 0 },
                                onClick: () => setIsAddModalOpen(false),
                                className: "absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                            } as any)}
                        />
                        <motion.div
                            {...({
                                initial: { scale: 0.9, opacity: 0, y: 20 },
                                animate: { scale: 1, opacity: 1, y: 0 },
                                exit: { scale: 0.9, opacity: 0, y: 20 },
                                onClick: (e: any) => e.stopPropagation(),
                                className: "relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                            } as any)}
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 bg-blue-600 rounded-3xl shadow-lg ring-1 ring-black/5">
                                            <Plus className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Register New Product</h2>
                                            <p className="text-gray-500 font-medium">Add a new item to the active inventory</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>

                                <form className="space-y-10" onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const data = {
                                        name: formData.get('name'),
                                        sku: formData.get('sku'),
                                        category_id: formData.get('category_id'),
                                        price: formData.get('price'),
                                        cost: formData.get('cost'),
                                        stock: formData.get('stock'),
                                        unit: formData.get('unit'),
                                        description: formData.get('description'),
                                    };
                                    addProductMutation.mutate(data);
                                }}>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <Tag className="h-4 w-4" />
                                            </div>
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Product Information</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Product Display Name</label>
                                                <input type="text" name="name" required placeholder="e.g. Organic Almond Milk" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">SKU / Barcode</label>
                                                <input type="text" name="sku" placeholder="e.g. BEV-008" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Category</label>
                                                    {!isAddingCategory ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsAddingCategory(true)}
                                                            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 underline underline-offset-4"
                                                        >
                                                            + Custom
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsAddingCategory(false)}
                                                            className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                                {isAddingCategory ? (
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="New Name..."
                                                            className="flex-1 px-5 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-blue-300"
                                                            value={newCategoryName}
                                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (newCategoryName) {
                                                                    addCategoryMutation.mutate(newCategoryName)
                                                                }
                                                            }}
                                                            className="px-5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200"
                                                            disabled={addCategoryMutation.isPending}
                                                        >
                                                            {addCategoryMutation.isPending ? '...' : 'Add'}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="relative group">
                                                        <select name="category_id" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900 appearance-none cursor-pointer">
                                                            <option value="">Select Category</option>
                                                            {categoriesData.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                        </select>
                                                        <Box className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-focus-within:text-blue-500" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                                <TrendingUp className="h-4 w-4" />
                                            </div>
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Inventory & Pricing</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Initial Stock</label>
                                                <div className="relative">
                                                    <input type="number" name="stock" placeholder="0" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900" />
                                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Units</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Cost (₨)</label>
                                                <input type="text" name="cost" placeholder="0.00" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Price (₨)</label>
                                                <input type="text" name="price" required placeholder="0.00" className="w-full px-6 py-4 bg-blue-50/30 border border-blue-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black text-blue-900" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="flex-1 py-5 bg-gray-100 text-gray-600 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-sm"
                                        >
                                            Discard Entry
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={addProductMutation.isPending}
                                            className="flex-[2] py-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {addProductMutation.isPending ? 'Registering...' : 'Complete Registration'} <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Product Modal */}
            <AnimatePresence>
                {editingProduct && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            {...({
                                initial: { opacity: 0 },
                                animate: { opacity: 1 },
                                exit: { opacity: 0 },
                                onClick: () => setEditingProduct(null),
                                className: "absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                            } as any)}
                        />
                        <motion.div
                            {...({
                                initial: { scale: 0.9, opacity: 0, y: 20 },
                                animate: { scale: 1, opacity: 1, y: 0 },
                                exit: { scale: 0.9, opacity: 0, y: 20 },
                                onClick: (e: any) => e.stopPropagation(),
                                className: "relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
                            } as any)}
                        >
                            <div className="p-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 bg-blue-600 rounded-3xl shadow-lg ring-1 ring-black/5">
                                            <History className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Edit Product</h2>
                                            <p className="text-gray-500 font-medium">Update item details and stock levels</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setEditingProduct(null)}
                                        className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all"
                                    >
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>

                                <form className="space-y-10" onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const data = {
                                        name: formData.get('name'),
                                        sku: formData.get('sku'),
                                        category_id: formData.get('category_id'),
                                        price: formData.get('price'),
                                        cost: formData.get('cost'),
                                        stock: formData.get('stock'),
                                        unit: formData.get('unit'),
                                        description: formData.get('description'),
                                    };
                                    updateProductMutation.mutate({ id: editingProduct.id, data });
                                }}>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <Tag className="h-4 w-4" />
                                            </div>
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Product Information</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Product Display Name</label>
                                                <input type="text" name="name" defaultValue={editingProduct.name} required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">SKU / Barcode ID</label>
                                                <input type="text" name="sku" defaultValue={editingProduct.sku} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Category</label>
                                                <div className="relative group">
                                                    <select name="category_id" defaultValue={editingProduct.category_id} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900 appearance-none cursor-pointer">
                                                        <option value="">Select Category</option>
                                                        {categoriesData.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                    </select>
                                                    <Box className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-focus-within:text-blue-500" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                                <TrendingUp className="h-4 w-4" />
                                            </div>
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">Inventory & Pricing</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Stock Level</label>
                                                <div className="relative">
                                                    <input type="number" name="stock" defaultValue={editingProduct.stock} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900" />
                                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Units</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Cost (₨)</label>
                                                <input type="text" name="cost" defaultValue={editingProduct.cost || ""} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Price (₨)</label>
                                                <input type="text" name="price" defaultValue={editingProduct.price} required className="w-full px-6 py-4 bg-blue-50/30 border border-blue-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-black text-blue-900" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete "${editingProduct.name}"? This action is permanent.`)) {
                                                    deleteProductMutation.mutate(editingProduct.id)
                                                }
                                            }}
                                            className="px-8 py-5 bg-red-50 text-red-600 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={updateProductMutation.isPending}
                                            className="flex-1 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-gray-200/50 flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {updateProductMutation.isPending ? 'Updating...' : 'Save Changes'} <CheckCircle2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Reorder Alerts */}
            <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8 group">
                <div className="absolute right-0 top-0 h-64 w-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="relative flex items-center gap-6">
                    <div className="p-5 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 ring-1 ring-white/20">
                        <AlertCircle className="h-8 w-8 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight mb-2 uppercase italic">Stock Alert System</h2>
                        <p className="text-white/60 font-medium max-w-md">Global stock monitoring initialized. You will receive alerts for critically low inventory levels.</p>
                    </div>
                </div>
                <button className="relative px-8 py-5 bg-white text-gray-900 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3">
                    Store Overview <ArrowRight className="h-5 w-5" />
                </button>
            </div>
        </div>
    )
}
