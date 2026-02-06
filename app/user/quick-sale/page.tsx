"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    QrCode,
    Search,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    Zap,
    RefreshCw,
    Package
} from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export default function QuickSalePage() {
    const queryClient = useQueryClient()
    const [cart, setCart] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    // Fetch live products
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => fetch('/api/inventory').then(async res => {
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to fetch products')
            return Array.isArray(data) ? data : []
        })
    })

    // Checkout Mutation
    const checkoutMutation = useMutation({
        mutationFn: (saleData: any) => fetch('/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saleData)
        }).then(async res => {
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Payment failed')
            return data
        }),
        onSuccess: () => {
            toast.success("Transaction Completed Successfully!")
            setCart([])
            queryClient.invalidateQueries({ queryKey: ['products'] })
        },
        onError: (err: any) => {
            toast.error(`Checkout Error: ${err.message}`)
        }
    })

    const filteredItems = useMemo(() => {
        if (!Array.isArray(products)) return []
        return products.filter((item: any) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    }, [products, searchQuery])

    const addToCart = (product: any) => {
        if (product.stock <= 0) {
            toast.error(`Cannot add ${product.name} - Out of Stock`)
            return
        }

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) {
                if (existing.qty >= product.stock) {
                    toast.error(`Only ${product.stock} units available`)
                    return prev
                }
                return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
            }
            return [...prev, { ...product, qty: 1 }]
        })
    }

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId))
    }

    const updateQty = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const product = products.find((p: any) => p.id === productId)
                const newQty = Math.max(0, item.qty + delta)
                if (newQty > product?.stock) {
                    toast.error(`Only ${product.stock} units available`)
                    return item
                }
                return { ...item, qty: newQty }
            }
            return item
        }).filter(item => item.qty > 0))
    }

    const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0)
    const tax = subtotal * 0.17
    const total = subtotal + tax

    const handleCheckout = () => {
        if (cart.length === 0) return

        checkoutMutation.mutate({
            items: cart,
            totalAmount: total,
            paymentMethod: 'CASH',
            description: 'Quick Sale Transaction'
        })
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl shadow-2xl shadow-green-500/20 ring-1 ring-white/20">
                        <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Turbo Checkout</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Quick Sale</h1>
                        <p className="text-gray-500 font-medium font-inter">Instant transaction processing with live inventory sync</p>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-xl border border-gray-200/50 p-2 rounded-2xl flex items-center gap-2">
                    <button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
                        className="p-3 text-gray-400 hover:text-green-600 rounded-xl transition-all"
                    >
                        <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="h-6 w-px bg-gray-200 m-1"></div>
                    <div className="px-4 py-2 bg-green-50 rounded-xl">
                        <span className="text-xs font-black text-green-700 uppercase tracking-widest flex items-center gap-2">
                            <Package className="h-3 w-3" />
                            {products.length} Items Live
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Product Selection */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Type product name or scan barcode..."
                            className="w-full pl-14 pr-24 py-6 bg-white border-2 border-transparent rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all font-bold text-gray-900 shadow-xl shadow-gray-200/40 text-lg placeholder:text-gray-300 placeholder:font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-gray-50 border border-gray-100 p-2 rounded-2xl">
                            <QrCode className="h-6 w-6 text-gray-400" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pr-2 border-l border-gray-200 ml-2 pl-2">Scanner Ready</span>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="py-20 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <RefreshCw className="h-10 w-10 text-green-500 animate-spin mx-auto mb-4" />
                            <p className="text-gray-500 font-bold">Connecting to Inventory...</p>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="py-20 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
                            <Package className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold">No products found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredItems.map((item: any) => (
                                <motion.button
                                    key={item.id}
                                    whileHover={{ scale: 1.02, translateY: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => addToCart(item)}
                                    className={`p-6 bg-white border-2 rounded-[2.5rem] text-left transition-all group relative overflow-hidden ${item.stock <= 0 ? 'opacity-60 grayscale border-gray-100' : 'border-transparent hover:border-green-200 shadow-lg shadow-gray-200/20 hover:shadow-2xl hover:shadow-green-500/10'
                                        }`}
                                    disabled={item.stock <= 0}
                                >
                                    <div className="absolute right-0 top-0 h-32 w-32 bg-gray-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-green-50 transition-colors duration-500"></div>
                                    <div className="relative flex flex-col h-full justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-50 px-3 py-1.5 rounded-xl">{item.category?.name || 'Uncategorized'}</span>
                                                <div className={`p-2.5 rounded-xl transition-colors ${item.stock <= 5 ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400 group-hover:bg-green-50 group-hover:text-green-600'}`}>
                                                    <Plus className="h-5 w-5" />
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-green-700 transition-colors">{item.name}</h3>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className={`h-1.5 w-1.5 rounded-full ${item.stock <= 5 ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.stock} in stock</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</span>
                                            <p className="text-xl font-black text-gray-900 group-hover:scale-110 transition-transform origin-right tracking-tight">₨ {Number(item.price).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Cart Summary */}
                <div className="lg:col-span-4 sticky top-8">
                    <div className="bg-white border-2 border-gray-100 rounded-[3rem] shadow-2xl shadow-gray-300/30 flex flex-col h-[calc(100vh-160px)] overflow-hidden">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                    <ShoppingCart className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="font-black text-gray-900 uppercase tracking-widest text-sm">Active Order</h2>
                                    <p className="text-xs font-bold text-gray-400 tracking-wide mt-0.5">Terminal #01</p>
                                </div>
                            </div>
                            <div className="bg-green-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg shadow-green-500/20 uppercase tracking-widest">
                                {cart.length} Row{cart.length !== 1 ? 's' : ''}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6">
                            <AnimatePresence mode="popLayout">
                                {cart.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-40 py-20"
                                    >
                                        <div className="p-6 bg-gray-100 rounded-full">
                                            <ShoppingCart className="h-12 w-12 text-gray-400" />
                                        </div>
                                        <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">Awaiting Selections...</p>
                                    </motion.div>
                                ) : (
                                    cart.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="flex gap-5 p-4 rounded-3xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-200"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{item.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">₨ {Number(item.price).toLocaleString()}</span>
                                                    <span className="text-[10px] font-bold text-gray-400">×</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.qty} {item.unit || 'Unit'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => updateQty(item.id, -1)}
                                                    className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <button
                                                    onClick={() => updateQty(item.id, 1)}
                                                    className="p-1.5 hover:bg-green-50 hover:text-green-600 rounded-xl transition-all"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <div className="text-right flex flex-col justify-center min-w-[80px]">
                                                <p className="text-sm font-black text-gray-900 tracking-tight">₨ {(Number(item.price) * item.qty).toLocaleString()}</p>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="p-8 bg-gray-50/80 backdrop-blur-md border-t border-gray-100">
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Subtotal</span>
                                    <span className="font-bold text-gray-900 tracking-tight">₨ {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center px-4">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Sales Tax (17%)</span>
                                    <span className="font-bold text-gray-900 tracking-tight">₨ {tax.toLocaleString()}</span>
                                </div>
                                <div className="pt-4 mt-2 border-t border-gray-200 flex justify-between items-center px-4">
                                    <span className="font-black text-gray-900 uppercase tracking-[0.2em] text-xs">Grand Total</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-green-600 tracking-tighter">₨ {total.toLocaleString()}</span>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">Digital Payment Enabled</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={cart.length === 0 || checkoutMutation.isPending}
                                className="w-full py-6 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
                            >
                                {checkoutMutation.isPending ? (
                                    <>
                                        <RefreshCw className="h-5 w-5 animate-spin" />
                                        Processing Order...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="h-5 w-5" />
                                        Finalize Transaction
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
