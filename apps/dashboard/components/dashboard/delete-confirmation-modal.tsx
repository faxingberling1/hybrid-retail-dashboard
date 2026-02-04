
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X, Trash2 } from "lucide-react"

interface DeleteConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    isLoading?: boolean
}

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    isLoading = false
}: DeleteConfirmationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_32px_120px_rgba(0,0,0,0.2)] overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-rose-50 rounded-2xl">
                                    <AlertTriangle className="h-6 w-6 text-rose-500" />
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-3 mb-10">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    {description}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-600/20 flex items-center justify-center group hover:bg-rose-700 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Confirm Delete
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-100 hover:text-gray-900 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
