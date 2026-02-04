
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X, Trash2, AlertCircle } from "lucide-react"

interface DeleteAccountModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isLoading?: boolean
}

export function DeleteAccountModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false
}: DeleteAccountModalProps) {
    const [confirmationText, setConfirmationText] = useState("")
    const requiredText = "Delete My Account"

    const isConfirmed = confirmationText === requiredText

    const handleClose = () => {
        setConfirmationText("")
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-rose-950/20 backdrop-blur-xl"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-white rounded-[3rem] shadow-[0_32px_120px_rgba(225,29,72,0.2)] overflow-hidden border border-rose-100"
                    >
                        <div className="p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div className="p-4 bg-rose-50 rounded-2xl">
                                    <AlertTriangle className="h-6 w-6 text-rose-600" />
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Permanent Deletion</h2>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    You are about to delete your administrator account and all associated data. This action is <b className="text-rose-600">irreversible</b> and cannot be recovered.
                                </p>
                            </div>

                            <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 mb-8">
                                <div className="flex items-center gap-3 text-rose-600 mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Verification Required</span>
                                </div>
                                <p className="text-[11px] font-bold text-gray-500 mb-4">
                                    Please type <span className="text-rose-600 font-black">"{requiredText}"</span> to proceed with the destruction protocol.
                                </p>
                                <input
                                    type="text"
                                    value={confirmationText}
                                    onChange={(e) => setConfirmationText(e.target.value)}
                                    placeholder="Type confirmation here..."
                                    className="w-full px-5 py-3 bg-white border-2 border-rose-100 focus:border-rose-500 rounded-xl outline-none transition-all font-bold text-sm text-rose-600"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={onConfirm}
                                    disabled={!isConfirmed || isLoading}
                                    className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-rose-600/20 flex items-center justify-center group hover:bg-rose-700 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4 mr-3" />
                                            Destroy Account
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleClose}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-100 hover:text-gray-900 transition-all font-bold"
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
