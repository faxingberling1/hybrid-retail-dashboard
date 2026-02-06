
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Shield, UserPlus, ArrowRight, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface InviteMemberModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function InviteMemberModal({ isOpen, onClose, onSuccess }: InviteMemberModalProps) {
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("CASHIER")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const roles = [
        { id: "ADMIN", name: "Administrator", desc: "Full organization control" },
        { id: "MANAGER", name: "Manager", desc: "Operational management" },
        { id: "CASHIER", name: "Cashier", desc: "Sales & inventory access" },
        { id: "INVENTORY", name: "Stock Officer", desc: "Warehouse & stock logic" }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            toast.error("Email is required.")
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch("/api/admin/staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, role })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to send invitation")
            }

            setIsSuccess(true)
            toast.success("Invitation sent successfully.")
            setTimeout(() => {
                onSuccess()
                handleClose()
            }, 2000)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleClose = () => {
        setEmail("")
        setRole("CASHIER")
        setIsSuccess(false)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-[0_32px_120px_rgba(0,0,0,0.1)] overflow-hidden"
                    >
                        <div className="p-10">
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 rounded-2xl">
                                        <UserPlus className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Invite Member</h2>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Team Growth</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X className="h-5 w-5 text-gray-400" />
                                </button>
                            </div>

                            {isSuccess ? (
                                <div className="py-12 text-center space-y-6">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full animate-bounce">
                                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900">Invitation Sent!</h3>
                                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                        An invitation link has been sent to <b>{email}</b>.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-gray-400">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="member@example.com"
                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500/50 border-2 rounded-2xl outline-none transition-all font-medium text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-gray-400">Assign Role</label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {roles.map((r) => (
                                                <button
                                                    key={r.id}
                                                    type="button"
                                                    onClick={() => setRole(r.id)}
                                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${role === r.id
                                                        ? "bg-blue-50 border-blue-200"
                                                        : "bg-white border-gray-100 hover:border-gray-200"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2 rounded-xl ${role === r.id ? "bg-white" : "bg-gray-50"}`}>
                                                            <Shield className={`h-4 w-4 ${role === r.id ? "text-blue-600" : "text-gray-400"}`} />
                                                        </div>
                                                        <div>
                                                            <div className={`text-sm font-black ${role === r.id ? "text-blue-900" : "text-gray-900"}`}>{r.name}</div>
                                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{r.desc}</div>
                                                        </div>
                                                    </div>
                                                    {role === r.id && (
                                                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <CheckCircle2 className="h-3 w-3 text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-slate-900/10 flex items-center justify-center group hover:scale-[1.01] transition-all disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Send Invitation
                                                <ArrowRight className="h-4 w-4 ml-3 transform group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
