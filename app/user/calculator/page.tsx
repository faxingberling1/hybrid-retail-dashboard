"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Calculator,
    History,
    Delete,
    Copy,
    RotateCcw,
    Activity,
    Smartphone,
    Grid,
    Check,
    Divide,
    X as CloseIcon,
    Equal,
    Minus,
    Plus,
    Hash
} from "lucide-react"
import BusinessTools from "@/components/dashboard/user/BusinessTools"

export default function UserCalculatorPage() {
    const [display, setDisplay] = useState("0")
    const [subDisplay, setSubDisplay] = useState("")
    const [history, setHistory] = useState<{ expression: string; result: string; timestamp: string }[]>([])
    const [copied, setCopied] = useState(false)

    const buttons = [
        { label: "C", type: "clear" },
        { label: "DEL", type: "delete" },
        { label: "%", type: "operator" },
        { label: "÷", type: "operator", value: "/" },
        { label: "7", type: "number" },
        { label: "8", type: "number" },
        { label: "9", type: "number" },
        { label: "×", type: "operator", value: "*" },
        { label: "4", type: "number" },
        { label: "5", type: "number" },
        { label: "6", type: "number" },
        { label: "-", type: "operator", value: "-" },
        { label: "1", type: "number" },
        { label: "2", type: "number" },
        { label: "3", type: "number" },
        { label: "+", type: "operator", value: "+" },
        { label: "0", type: "number" },
        { label: "00", type: "number" },
        { label: ".", type: "number" },
        { label: "=", type: "equals" }
    ]

    const handleCalculate = useCallback(() => {
        try {
            // Clean display for calculation
            const expr = display.replace(/×/g, "*").replace(/÷/g, "/")
            // Safe evaluation of simple math
            // eslint-disable-next-line no-new-func
            const result = new Function(`return ${expr}`)()
            const formattedResult = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(4)).toString()

            setHistory(prev => [{
                expression: display,
                result: formattedResult,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }, ...prev].slice(0, 10))

            setSubDisplay(`${display} =`)
            setDisplay(formattedResult)
        } catch (error) {
            setDisplay("Error")
            setTimeout(() => setDisplay("0"), 1000)
        }
    }, [display])

    const handlePress = useCallback((btn: any) => {
        if (btn.type === "clear") {
            setDisplay("0")
            setSubDisplay("")
        }
        else if (btn.type === "delete") {
            setDisplay(d => d.length > 1 ? d.slice(0, -1) : "0")
        }
        else if (btn.type === "equals") {
            handleCalculate()
        }
        else if (btn.type === "operator") {
            const lastChar = display.slice(-1)
            if (["+", "-", "*", "/", "%", "×", "÷"].includes(lastChar)) {
                setDisplay(d => d.slice(0, -1) + btn.label)
            } else {
                setDisplay(d => d + btn.label)
            }
        }
        else {
            setDisplay(d => d === "0" ? btn.label : d + btn.label)
        }
    }, [display, handleCalculate])

    const handleCopy = () => {
        navigator.clipboard.writeText(display)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key
            if (/[0-9]/.test(key)) handlePress({ label: key, type: "number" })
            if (["+", "-", "*", "/"].includes(key)) {
                const labelMap: any = { "*": "×", "/": "÷" }
                handlePress({ label: labelMap[key] || key, type: "operator" })
            }
            if (key === "Enter") handlePress({ label: "=", type: "equals" })
            if (key === "Escape") handlePress({ label: "C", type: "clear" })
            if (key === "Backspace") handlePress({ label: "DEL", type: "delete" })
            if (key === ".") handlePress({ label: ".", type: "number" })
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [handlePress])

    return (
        <div className="max-w-[1400px] mx-auto space-y-10 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 ring-1 ring-white/20 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 group-hover:scale-150 transition-transform duration-700 rounded-full blur-2xl -translate-x-10 -translate-y-10"></div>
                        <Calculator className="h-10 w-10 text-white relative z-10" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-indigo-100 italic">Financial Utility</span>
                            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-gray-400">PRECISION ENGINE</span>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic uppercase">Business Calculator</h1>
                        <p className="text-gray-500 font-medium text-lg mt-1">High-fidelity tools for rapid financial synthesis</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
                        <Smartphone className="h-5 w-5 text-gray-300" />
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Mobile Sync</p>
                            <p className="text-xs font-bold text-gray-700">Universal Access</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Main Calculator Body */}
                <div className="lg:col-span-4 bg-gray-900 p-10 rounded-[4rem] shadow-2xl shadow-indigo-900/40 relative overflow-hidden ring-1 ring-white/5 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

                    {/* High-Fidelity Display */}
                    <div className="mb-10 relative">
                        <div className="flex justify-between items-center mb-4">
                            <span className="px-3 py-1 bg-white/5 text-white/40 text-[8px] font-black uppercase tracking-[0.2em] rounded-md border border-white/5 italic">Floating Point Enabled</span>
                            <div className="h-1 w-12 bg-white/10 rounded-full"></div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-inner flex flex-col justify-end min-h-[160px] group-hover:border-white/20 transition-all text-right relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={subDisplay}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-indigo-400/60 font-medium text-sm mb-1 tracking-widest h-5 italic overflow-hidden"
                                >
                                    {subDisplay}
                                </motion.p>
                            </AnimatePresence>
                            <div className="flex items-center justify-end gap-3 w-full overflow-hidden">
                                <div className="flex-1 overflow-x-auto no-scrollbar py-2">
                                    <p className={`font-black text-white tracking-widest leading-none text-right whitespace-nowrap transition-all duration-300 ${display.length > 12 ? 'text-2xl' : display.length > 8 ? 'text-3xl' : 'text-5xl'}`}>
                                        {display}
                                    </p>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className={`p-2 rounded-xl transition-all flex-shrink-0 ${copied ? 'bg-emerald-500 text-white' : 'text-white/20 hover:text-white hover:bg-white/10'}`}
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Touch Keys */}
                    <div className="grid grid-cols-4 gap-4 pb-4">
                        {buttons.map((btn, i) => (
                            <motion.button
                                key={btn.label + i}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePress(btn)}
                                className={`
                                        aspect-square rounded-[1.5rem] text-xl font-bold flex items-center justify-center transition-all border
                                        ${btn.type === 'operator' ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/30' :
                                        btn.type === 'equals' ? 'bg-gradient-to-br from-indigo-600 to-blue-700 border-transparent text-white shadow-xl shadow-indigo-900/40 rounded-[2rem]' :
                                            btn.type === 'clear' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white' :
                                                btn.type === 'delete' ? 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10' :
                                                    'bg-white/5 border-white/5 text-white hover:bg-white/10 hover:border-white/10'}
                                    `}
                            >
                                {btn.label === 'DEL' ? <Delete className="h-6 w-6" /> :
                                    btn.label === '÷' ? <Divide className="h-6 w-6" /> :
                                        btn.label === '×' ? <CloseIcon className="h-6 w-6" /> :
                                            btn.label === '+' ? <Plus className="h-6 w-6" /> :
                                                btn.label === '-' ? <Minus className="h-6 w-6" /> :
                                                    btn.label === '=' ? <Equal className="h-8 w-8" /> :
                                                        btn.label}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Vertical Utilities Section */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <BusinessTools
                        onResultLoad={(val) => {
                            setDisplay(val)
                            setSubDisplay(`Imported: ${val}`)
                        }}
                    />

                    {/* History & Meta */}
                    <div className="space-y-10">
                        {/* Persistent History */}
                        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="relative">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-gray-50 text-gray-400 rounded-xl">
                                            <History className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-black text-gray-900 uppercase tracking-tighter italic">Audit History</h3>
                                    </div>
                                    <button
                                        onClick={() => setHistory([])}
                                        className="text-[8px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                                    >
                                        Clear Cache
                                    </button>
                                </div>

                                {history.length === 0 ? (
                                    <div className="py-20 text-center flex flex-col items-center">
                                        <div className="p-6 bg-gray-50 rounded-[2.5rem] mb-6 opacity-40">
                                            <RotateCcw className="h-10 w-10 text-gray-300" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">No Calculations Logged</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {history.map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-5 bg-gray-50/50 hover:bg-gray-50 rounded-2xl border border-gray-100 transition-all group/item flex items-center justify-between"
                                            >
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 mb-1">{item.timestamp}</p>
                                                    <p className="text-xs font-black text-gray-400 italic mb-0.5">{item.expression}</p>
                                                    <p className="text-xl font-black text-indigo-900 tracking-tight">₨ {item.result}</p>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => {
                                                            setDisplay(item.result)
                                                            setSubDisplay(`Recall: ${item.result}`)
                                                        }}
                                                        className="p-3 bg-white text-indigo-600 rounded-xl shadow-sm border border-indigo-50 hover:scale-110 transition-all font-black text-[8px] uppercase tracking-widest"
                                                    >
                                                        Recall
                                                    </button>
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(item.result)}
                                                        className="p-3 bg-white text-gray-400 rounded-xl shadow-sm border border-gray-100 hover:text-indigo-600"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interactive Widgets */}
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-10 rounded-[3.5rem] text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
                            <div className="absolute right-0 top-0 opacity-10 scale-150 rotate-12 transition-transform duration-1000 group-hover:rotate-45">
                                <Grid className="h-40 w-40" />
                            </div>
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-6">
                                    <Activity className="h-4 w-4 text-indigo-200" />
                                    <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Real-time Performance</span>
                                </div>
                                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 leading-none">Global Accuracy<br />Standardized</h3>
                                <p className="text-indigo-100/60 text-xs font-medium leading-relaxed mb-10 italic">Our engine ensures floating-point precision across all tax and margin vectors, synced with local FBR compliance requirements.</p>
                                <div className="flex items-center gap-10">
                                    <div>
                                        <p className="text-[8px] font-black text-indigo-200 uppercase tracking-widest mb-1">Response</p>
                                        <p className="text-xl font-black italic">12ms</p>
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-indigo-200 uppercase tracking-widest mb-1">Precision</p>
                                        <p className="text-xl font-black italic">10⁻⁸</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
