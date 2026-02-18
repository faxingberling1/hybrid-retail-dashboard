"use client"

import { useState } from "react"
import { Printer, Scan, HardDrive, RefreshCw, CheckCircle2, AlertCircle, Play } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

export function HardwareConfig() {
    const [isTestingPrinter, setIsTestingPrinter] = useState(false)
    const [printerStatus, setPrinterStatus] = useState<"idle" | "connected" | "error">("idle")

    const testPrinter = async () => {
        setIsTestingPrinter(true)
        // Simulate hardware interaction
        setTimeout(() => {
            setIsTestingPrinter(false)
            setPrinterStatus("connected")
            toast.success("Test print signal sent successfully")
        }, 1500)
    }

    const hardwareItems = [
        {
            id: "printer",
            name: "Receipt Printer",
            icon: <Printer className="h-6 w-6" />,
            description: "Thermal ESC/POS Printer (USB/Network)",
            status: printerStatus,
            action: testPrinter,
            isLoading: isTestingPrinter
        },
        {
            id: "scanner",
            name: "Barcode Scanner",
            icon: <Scan className="h-6 w-6" />,
            description: "USB HID or Serial Scanner",
            status: "idle",
            action: () => toast.info("Scanner testing mode active. Please scan a code."),
            isLoading: false
        },
        {
            id: "drawer",
            name: "Cash Drawer",
            icon: <HardDrive className="h-6 w-6" />,
            description: "Connected via RJ11 to Printer",
            status: "idle",
            action: () => toast.success("Kick signal sent to drawer"),
            isLoading: false
        }
    ]

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hardwareItems.map((item) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${item.status === "connected" ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"
                                }`}>
                                {item.icon}
                            </div>
                            {item.status === "connected" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                                <RefreshCw className="h-5 w-5 text-gray-300 animate-spin-slow" />
                            )}
                        </div>
                        <h3 className="font-black text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-xs text-gray-500 font-medium mb-6">{item.description}</p>

                        <button
                            onClick={item.action}
                            disabled={item.isLoading}
                            className={`
                                w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
                                ${item.isLoading ? "bg-gray-100 text-gray-400" : "bg-gray-900 text-white hover:bg-black active:scale-95"}
                            `}
                        >
                            {item.isLoading ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                                <Play className="h-4 w-4" />
                            )}
                            Test Device
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <AlertCircle className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                        <h4 className="font-black text-amber-900 mb-1">Hardware Interface Requirements</h4>
                        <p className="text-sm text-amber-800/70 font-medium leading-relaxed">
                            To interface with physical hardware directly from the dashboard, ensure you are using a modern browser (Chrome/Edge) and have enabled WebUSB/WebSerial in your system settings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
