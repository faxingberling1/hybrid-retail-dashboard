
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Shield, Lock, Save, Loader2, Check, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface PermissionsEditorProps {
    isOpen: boolean
    onClose: () => void
}

const MODULES = [
    { id: "dashboard", name: "Dashboard", desc: "Main metrics & personalized stats" },
    { id: "inventory", name: "Inventory", desc: "Products, stock & categories" },
    { id: "sales", name: "Sales", desc: "Transactions & daily reports" },
    { id: "customers", name: "Customers", desc: "CRM & interaction logs" },
    { id: "staff", name: "Staff", desc: "Member Roles & Permissions" },
    { id: "settings", name: "Settings", desc: "Store & system configuration" }
]

const ACTIONS = [
    { id: "read", name: "Read", color: "blue" },
    { id: "write", name: "Write", color: "emerald" },
    { id: "delete", name: "Delete", color: "rose" },
    { id: "export", name: "Export", color: "amber" }
]

const ROLES = ["ADMIN", "MANAGER", "CASHIER", "INVENTORY"]

export function PermissionsEditor({ isOpen, onClose }: PermissionsEditorProps) {
    const [selectedRole, setSelectedRole] = useState("CASHIER")
    const [permissions, setPermissions] = useState<Record<string, string[]>>({})
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            fetchPermissions()
        }
    }, [isOpen])

    const fetchPermissions = async () => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/admin/staff/roles")
            const data = await response.json()

            const roleData = data.roles.find((r: any) => r.role_name === selectedRole)
            if (roleData) {
                setPermissions(typeof roleData.permissions === 'string' ? JSON.parse(roleData.permissions) : roleData.permissions)
            } else {
                setPermissions({})
            }
        } catch (error) {
            toast.error("Could not load permissions.")
        } finally {
            setIsLoading(false)
        }
    }

    // Refetch when role changes
    useEffect(() => {
        if (isOpen) {
            fetchPermissions()
        }
    }, [selectedRole])

    const togglePermission = (moduleId: string, actionId: string) => {
        setPermissions(prev => {
            const modulePerms = prev[moduleId] || []
            const newPerms = modulePerms.includes(actionId)
                ? modulePerms.filter(p => p !== actionId)
                : [...modulePerms, actionId]

            return { ...prev, [moduleId]: newPerms }
        })
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const response = await fetch("/api/admin/staff/roles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ roleName: selectedRole, permissions })
            })

            if (!response.ok) throw new Error("Failed to save permissions")

            toast.success("Permissions saved successfully.")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        className="relative w-full max-w-4xl bg-white sm:rounded-[3rem] shadow-[0_32px_120px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="p-8 pb-4 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 rounded-2xl">
                                    <Lock className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Access Control</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Permissions Settings</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8">
                            <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
                                {ROLES.map(role => (
                                    <button
                                        key={role}
                                        onClick={() => setSelectedRole(role)}
                                        className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${selectedRole === role
                                            ? "bg-slate-900 text-white shadow-lg"
                                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                            }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>

                            {isLoading ? (
                                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {MODULES.map(module => (
                                        <div key={module.id} className="group p-6 rounded-[2rem] border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all">
                                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                                <div className="max-w-xs">
                                                    <h4 className="font-black text-gray-900 mb-1">{module.name}</h4>
                                                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider leading-relaxed">{module.desc}</p>
                                                </div>

                                                <div className="flex flex-wrap gap-3">
                                                    {ACTIONS.map(action => {
                                                        const isSelected = permissions[module.id]?.includes(action.id)
                                                        return (
                                                            <button
                                                                key={action.id}
                                                                onClick={() => togglePermission(module.id, action.id)}
                                                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isSelected
                                                                    ? `bg-${action.color}-50 text-${action.color}-600 border-${action.color}-200 border`
                                                                    : "bg-white border-gray-100 border text-gray-300 hover:border-gray-200"
                                                                    }`}
                                                            >
                                                                {isSelected ? <Check className="h-3 w-3" /> : <Shield className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                                                {action.id}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-8 pt-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-3 text-amber-500">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">You have unsaved changes</span>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Changes
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
