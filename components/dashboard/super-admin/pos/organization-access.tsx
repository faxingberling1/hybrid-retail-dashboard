"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Building2, Shield, ShieldAlert, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function OrganizationAccess() {
    const [organizations, setOrganizations] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isUpdating, setIsUpdating] = useState<string | null>(null)

    const fetchAccess = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/super-admin/pos/access")
            if (res.ok) {
                const data = await res.json()
                setOrganizations(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            toast.error("Failed to load organization access")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAccess()
    }, [])

    const toggleAccess = async (orgId: string, currentStatus: boolean) => {
        setIsUpdating(orgId)
        try {
            const res = await fetch("/api/super-admin/pos/access", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ organizationId: orgId, posEnabled: !currentStatus })
            })
            if (res.ok) {
                toast.success(`POS access ${!currentStatus ? 'granted' : 'revoked'} successfully`)
                fetchAccess()
            }
        } catch (error) {
            toast.error("Failed to update access")
        } finally {
            setIsUpdating(null)
        }
    }

    const filteredOrgs = organizations.filter(org =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 mb-8">
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search organizations to manage POS access..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-8 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-48 bg-white rounded-[2.5rem] border border-gray-100 animate-pulse" />
                    ))
                ) : filteredOrgs.length === 0 ? (
                    <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-gray-100 text-center">
                        <Building2 className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                        <h4 className="font-black text-gray-400 uppercase tracking-widest">No Organizations Found</h4>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filteredOrgs.map((org) => {
                            const settings = typeof org.settings === 'string' ? JSON.parse(org.settings) : (org.settings || {})
                            const isEnabled = settings.pos_enabled === true

                            return (
                                <motion.div
                                    key={org.id}
                                    layout
                                    className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 relative overflow-hidden group"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                            <Building2 className="h-7 w-7 text-gray-400 group-hover:text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-black text-gray-900 truncate leading-none mb-1">{org.name}</h3>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{org.status}</span>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-2xl flex items-center justify-between mb-8 ${isEnabled ? 'bg-green-50' : 'bg-rose-50'}`}>
                                        <div className="flex items-center gap-2">
                                            {isEnabled ? (
                                                <Shield className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <ShieldAlert className="h-4 w-4 text-rose-600" />
                                            )}
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isEnabled ? 'text-green-700' : 'text-rose-700'}`}>
                                                {isEnabled ? 'POS Authorized' : 'Access Restricted'}
                                            </span>
                                        </div>
                                        {isEnabled ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-rose-500" />
                                        )}
                                    </div>

                                    <button
                                        onClick={() => toggleAccess(org.id, isEnabled)}
                                        disabled={isUpdating === org.id}
                                        className={`
                                            w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3
                                            ${isEnabled
                                                ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white'
                                                : 'bg-gray-900 text-white hover:bg-black'}
                                            disabled:opacity-50
                                        `}
                                    >
                                        {isUpdating === org.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            isEnabled ? <ShieldAlert className="h-4 w-4" /> : <Shield className="h-4 w-4" />
                                        )}
                                        {isEnabled ? 'Revoke Access' : 'Grant POS Access'}
                                    </button>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}
