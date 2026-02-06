"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    Percent,
    TrendingUp,
    ArrowRightLeft,
    Copy,
    Check,
    Receipt,
    Target
} from "lucide-react"

export default function BusinessTools({ onResultLoad }: { onResultLoad?: (val: string) => void }) {
    const [baseValue, setBaseValue] = useState<string>("")
    const [taxRate, setTaxRate] = useState<number>(17)
    const [copied, setCopied] = useState<string | null>(null)

    // Profit Optimizer States
    const [costPrice, setCostPrice] = useState<string>("")
    const [desiredMargin, setDesiredMargin] = useState<string>("25")
    const [idealSalePrice, setIdealSalePrice] = useState<number | null>(null)

    const gstAmount = (parseFloat(baseValue) || 0) * (taxRate / 100)
    const totalWithGst = (parseFloat(baseValue) || 0) + gstAmount

    const handleCopy = (val: string, label: string) => {
        if (!val || val === "0") return
        navigator.clipboard.writeText(val)
        setCopied(label)
        setTimeout(() => setCopied(null), 2000)
    }

    const calculateProfit = () => {
        const cp = parseFloat(costPrice)
        const margin = parseFloat(desiredMargin)
        if (isNaN(cp) || isNaN(margin)) return

        // Sale Price = Cost Price / (1 - Margin)
        // If margin is 25%, SP = CP / 0.75
        const sp = cp / (1 - (margin / 100))
        setIdealSalePrice(sp)
    }

    return (
        <div className="space-y-6">
            {/* Quick Tax Engine */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl -mr-16 -mt-16 transition-colors group-hover:bg-rose-100"></div>

                <div className="relative">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                            <Receipt className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 uppercase tracking-tighter italic">GST Engine</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">Automated Tax Synthesis</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group/input">
                            <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center pointer-events-none opacity-0 group-focus-within/input:opacity-5 transition-opacity duration-700">
                                <span className="text-[120px] font-black tracking-tighter uppercase italic select-none">GST</span>
                            </div>
                            <input
                                type="number"
                                placeholder="Base Amount (PKR)"
                                value={baseValue}
                                onChange={(e) => setBaseValue(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-2xl p-6 font-black text-gray-900 placeholder:text-gray-300 focus:ring-2 focus:ring-rose-500/20 transition-all outline-none relative z-10"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-1 z-20">
                                {[17, 18, 5].map(rate => (
                                    <button
                                        key={rate}
                                        onClick={() => setTaxRate(rate)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${taxRate === rate ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'bg-white text-gray-400 hover:text-rose-600 border border-gray-100'}`}
                                    >
                                        {rate}%
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 relative">
                            <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100/50 relative overflow-hidden group/card">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[4rem] font-black text-rose-500/5 rotate-12 pointer-events-none select-none">TAX</div>
                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1 relative z-10">GST ({taxRate}%)</p>
                                <div className="flex items-center justify-between overflow-hidden relative z-10">
                                    <span className="text-lg font-black text-rose-900 whitespace-nowrap overflow-x-auto no-scrollbar">₨ {gstAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                    <div className="flex gap-1 flex-shrink-0">
                                        {onResultLoad && (
                                            <button onClick={() => onResultLoad(gstAmount.toFixed(2))} className="p-1.5 hover:bg-white text-rose-400 rounded-lg transition-colors border border-rose-100/50" title="Load to Main Calculator">
                                                <ArrowRightLeft className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                        <button onClick={() => handleCopy(gstAmount.toFixed(2), 'gst')} className="p-1.5 hover:bg-white rounded-lg transition-colors">
                                            {copied === 'gst' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-rose-300" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 relative overflow-hidden group/card">
                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[4rem] font-black text-emerald-500/5 -rotate-12 pointer-events-none select-none">TOTAL</div>
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 relative z-10">Total Payable</p>
                                <div className="flex items-center justify-between overflow-hidden relative z-10">
                                    <span className="text-lg font-black text-emerald-900 whitespace-nowrap overflow-x-auto no-scrollbar">₨ {totalWithGst.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                                    <div className="flex gap-1 flex-shrink-0">
                                        {onResultLoad && (
                                            <button onClick={() => onResultLoad(totalWithGst.toFixed(2))} className="p-1.5 hover:bg-white text-emerald-400 rounded-lg transition-colors border border-emerald-100/50" title="Load to Main Calculator">
                                                <ArrowRightLeft className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                        <button onClick={() => handleCopy(totalWithGst.toFixed(2), 'total')} className="p-1.5 hover:bg-white rounded-lg transition-colors">
                                            {copied === 'total' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-emerald-300" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Margin Optimizer */}
            <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent pointer-events-none"></div>

                <div className="relative">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white/10 text-indigo-400 rounded-xl">
                            <Target className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-black text-white uppercase tracking-tighter italic">Profit Optimizer</h3>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-none mt-0.5">Margin & Markup Analytics</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 relative group/profit-input">
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-focus-within/profit-input:opacity-10 transition-opacity duration-700 select-none">
                                <span className="text-[4rem] font-black tracking-widest uppercase italic text-indigo-500">PROFIT</span>
                            </div>
                            <div className="space-y-1.5 relative z-10">
                                <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Cost Price</label>
                                <input
                                    type="number"
                                    placeholder="₨ 0"
                                    value={costPrice}
                                    onChange={(e) => setCostPrice(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-sm font-bold focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-1.5 relative z-10">
                                <label className="text-[8px] font-black text-white/20 uppercase tracking-widest ml-1">Margin (%)</label>
                                <input
                                    type="number"
                                    placeholder="25%"
                                    value={desiredMargin}
                                    onChange={(e) => setDesiredMargin(e.target.value)}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-sm font-bold focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {idealSalePrice !== null && (
                            <motion.div
                                {...({
                                    initial: { opacity: 0, height: 0 },
                                    animate: { opacity: 1, height: 'auto' },
                                    className: "p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex justify-between items-center"
                                } as any)}
                            >
                                <div className="overflow-hidden">
                                    <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Target Sale Price</p>
                                    <p className="text-xl font-black text-white tracking-tighter whitespace-nowrap overflow-x-auto no-scrollbar">₨ {idealSalePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="flex gap-1 flex-shrink-0 ml-2">
                                    {onResultLoad && (
                                        <button onClick={() => onResultLoad(idealSalePrice.toFixed(2))} className="p-3 bg-white/10 hover:bg-white text-indigo-400 rounded-xl transition-all" title="Load to Main Calculator">
                                            <ArrowRightLeft className="h-4 w-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleCopy(idealSalePrice.toFixed(2), 'sp')}
                                        className="p-3 bg-white/10 hover:bg-white text-indigo-400 rounded-xl transition-all"
                                    >
                                        {copied === 'sp' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        <button
                            onClick={calculateProfit}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-900/40 active:scale-95"
                        >
                            Solve for Target Price
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
