"use client"

import { useState, useEffect } from "react"
import {
    Users, UserPlus, Shield, Key,
    Mail, Phone, Clock, Search,
    Filter, MoreVertical, BadgeCheck,
    CheckCircle2, AlertCircle, Ban, ArrowUpRight,
    Loader2, MailQuestion
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { InviteMemberModal } from "@/components/dashboard/invite-member-modal"
import { PermissionsEditor } from "@/components/dashboard/permissions-editor"
import { DeleteConfirmationModal } from "@/components/dashboard/delete-confirmation-modal"
import { toast } from "sonner"

export default function AdminStaffPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [staff, setStaff] = useState<any[]>([])
    const [invitations, setInvitations] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false)
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string, type: 'staff' | 'invite' }>({
        isOpen: false,
        id: "",
        type: 'staff'
    })
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        fetchStaff()
    }, [])

    const fetchStaff = async () => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/admin/staff")
            const data = await response.json()
            if (data.error) throw new Error(data.error)
            setStaff(data.users || [])
            setInvitations(data.invitations || [])
        } catch (error: any) {
            toast.error(`Error: ${error.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    const handleRevoke = (id: string, type: 'staff' | 'invite') => {
        setDeleteModal({ isOpen: true, id, type })
    }

    const confirmRevoke = async () => {
        const { id, type } = deleteModal
        setIsDeleting(true)
        try {
            const response = await fetch(`/api/admin/staff?id=${id}&type=${type}`, {
                method: "DELETE"
            })

            if (!response.ok) throw new Error("Delete failed")

            toast.success(`${type === 'staff' ? 'Member' : 'Invitation'} deleted`)
            setDeleteModal({ ...deleteModal, isOpen: false })
            fetchStaff()
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsDeleting(false)
        }
    }

    const metrics = [
        { title: "Total Members", value: staff.length, sub: "All roles", color: "blue" },
        { title: "Active Members", value: staff.filter(s => s.is_active).length, sub: "Currently online", color: "emerald" },
        { title: "Avg. Performance", value: "4.7", sub: "Rating score", color: "amber" },
        { title: "Pending Invites", value: invitations.length, sub: "Waiting for reply", color: "indigo" }
    ]

    const filteredStaff = staff.filter(member =>
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-8">
            <InviteMemberModal
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                onSuccess={fetchStaff}
            />
            <PermissionsEditor
                isOpen={isPermissionsOpen}
                onClose={() => setIsPermissionsOpen(false)}
            />
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={confirmRevoke}
                isLoading={isDeleting}
                title={`Delete ${deleteModal.type === 'staff' ? 'Member' : 'Invitation'}`}
                description={`Are you sure you want to remove this ${deleteModal.type === 'staff' ? 'staff member' : 'pending invitation'}? This action cannot be undone.`}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Staff Members</h1>
                    <p className="text-gray-500 font-medium text-sm tracking-tight">Manage your team and their access levels</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPermissionsOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-2xl text-[11px] uppercase tracking-widest font-black shadow-sm hover:bg-gray-50 transition-all"
                    >
                        <Shield className="h-4 w-4" />
                        Permissions
                    </button>
                    <button
                        onClick={() => setIsInviteOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] uppercase tracking-widest font-black shadow-xl shadow-slate-900/10 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <UserPlus className="h-4 w-4" />
                        Invite Member
                    </button>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {metrics.map((m, idx) => (
                    <motion.div
                        key={m.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 transition-all hover:scale-[1.02]`}
                    >
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{m.title}</div>
                        <div className={`text-4xl font-black text-gray-900 mb-2`}>{m.value}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{m.sub}</div>
                    </motion.div>
                ))}
            </div>

            {/* Staff Grid */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden mb-12">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
                    <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-6 py-4 bg-white border-gray-100 focus:border-blue-500/50 border-2 rounded-[1.5rem] outline-none transition-all font-medium text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-3 bg-white border border-gray-100 text-gray-400 rounded-xl hover:text-gray-900 transition-colors shadow-sm">
                            <Filter className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-32 flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Loading Staff...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-x divide-y divide-gray-100">
                        {/* Invitations First */}
                        <AnimatePresence>
                            {invitations.map((invite, idx) => (
                                <motion.div
                                    key={invite.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-8 hover:bg-indigo-50/30 transition-all group relative bg-indigo-50/10"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-100 flex items-center justify-center border-4 border-white shadow-md overflow-hidden animate-pulse">
                                                    <MailQuestion className="h-6 w-6 text-indigo-400" />
                                                </div>
                                                <div className="absolute -right-1 -bottom-1 w-5 h-5 rounded-full border-4 border-white shadow-sm bg-indigo-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-gray-900 leading-tight">Pending Invitation</h3>
                                                <div className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase mt-0.5">{invite.role}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-3 text-xs font-bold text-indigo-600/60">
                                            <Mail className="h-4 w-4" />
                                            {invite.email}
                                        </div>
                                        <div className="text-[9px] font-medium text-gray-400 uppercase tracking-widest bg-white border border-gray-100 rounded-lg px-2 py-1 inline-block">
                                            Expires: {new Date(invite.expires_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex h-12 rounded-2xl bg-white border border-gray-100 p-1">
                                        <button
                                            onClick={() => toast.info("Invitation resent")}
                                            className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                        >
                                            Resend
                                        </button>
                                        <div className="w-[1px] bg-gray-100 my-2" />
                                        <button
                                            onClick={() => handleRevoke(invite.id, 'invite')}
                                            className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                        >
                                            Revoke
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Staff Members */}
                        {filteredStaff.map((member, idx) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-8 hover:bg-gray-50/50 transition-all group relative"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-gray-100 flex items-center justify-center text-2xl font-black text-gray-400 border-4 border-white shadow-md overflow-hidden">
                                                {member.name?.charAt(0) || <Users className="h-6 w-6" />}
                                            </div>
                                            <div className={`absolute -right-1 -bottom-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${member.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 leading-tight">{member.name || "User"}</h3>
                                            <div className="text-[10px] font-bold text-blue-600 tracking-wider uppercase mt-0.5">{member.role}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRevoke(member.id, 'staff')}
                                        className="p-2 text-gray-300 hover:text-rose-600 transition-colors"
                                    >
                                        <Ban className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-xs font-medium text-gray-600 truncate">
                                        <Mail className="h-4 w-4 text-gray-300" />
                                        {member.email}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                                        <Clock className="h-4 w-4 text-gray-300" />
                                        Joined: {new Date(member.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="flex h-12 rounded-2xl bg-gray-50 p-1">
                                    <button className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                                        <BadgeCheck className="h-4 w-4" />
                                        Log
                                    </button>
                                    <div className="w-[1px] bg-gray-200 my-2" />
                                    <button className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                                        <Key className="h-4 w-4" />
                                        Access
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
