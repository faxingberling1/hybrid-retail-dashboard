"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus, Search, Filter, MessageSquare,
    Send, Clock, CheckCircle, AlertCircle,
    ChevronRight, ArrowLeft, Paperclip,
    MoreVertical, Shield, X, BarChart3,
    Calendar, User as UserIcon, Building2
} from "lucide-react"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

interface Ticket {
    id: string
    subject: string
    description: string
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    category: string
    user_id: string
    created_at: string
    updated_at: string
    user: {
        id: string
        name: string
        email: string
    }
    _count?: {
        replies: number
    }
}

interface Reply {
    id: string
    message: string
    user_id: string
    created_at: string
    user: {
        name: string
        role: string
    }
}

export default function SuperAdminSupportPage() {
    const { data: session } = useSession()
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [replies, setReplies] = useState<Reply[]>([])
    const [newReply, setNewReply] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        try {
            const res = await fetch('/api/tickets')
            const data = await res.json()
            setTickets(data)
        } catch (error) {
            toast.error("Failed to load tickets")
        } finally {
            setLoading(false)
        }
    }

    const fetchTicketDetails = async (id: string) => {
        try {
            const res = await fetch(`/api/tickets/${id}`)
            const data = await res.json()
            setSelectedTicket(data)
            setReplies(data.replies || [])
        } catch (error) {
            toast.error("Failed to load ticket details")
        }
    }

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/tickets/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (res.ok) {
                toast.success(`Status updated to ${newStatus}`)
                fetchTickets()
                if (selectedTicket?.id === id) {
                    setSelectedTicket({ ...selectedTicket, status: newStatus as any })
                }
            }
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const handleUpdatePriority = async (id: string, newPriority: string) => {
        try {
            const res = await fetch(`/api/tickets/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priority: newPriority })
            })

            if (res.ok) {
                toast.success(`Priority updated to ${newPriority}`)
                fetchTickets()
                if (selectedTicket?.id === id) {
                    setSelectedTicket({ ...selectedTicket, priority: newPriority as any })
                }
            }
        } catch (error) {
            toast.error("Failed to update priority")
        }
    }

    const handleSendReply = async () => {
        if (!newReply.trim() || !selectedTicket) return

        try {
            const res = await fetch(`/api/tickets/${selectedTicket.id}/replies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newReply })
            })

            if (res.ok) {
                const data = await res.json()
                setReplies([...replies, data])
                setNewReply("")
                // Ticket status is auto-updated to IN_PROGRESS in API
                if (selectedTicket.status === 'OPEN') {
                    setSelectedTicket({ ...selectedTicket, status: 'IN_PROGRESS' })
                    fetchTickets()
                }
            }
        } catch (error) {
            toast.error("Failed to send reply")
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-100 text-blue-700'
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700'
            case 'RESOLVED': return 'bg-green-100 text-green-700'
            case 'CLOSED': return 'bg-gray-100 text-gray-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'text-red-600'
            case 'HIGH': return 'text-orange-600'
            case 'MEDIUM': return 'text-blue-600'
            case 'LOW': return 'text-gray-600'
            default: return 'text-gray-600'
        }
    }

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.id.includes(searchQuery)
        const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'OPEN').length,
        pending: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED').length
    }

    return (
        <div className="p-4 lg:p-8 max-w-[1600px] mx-auto min-h-screen bg-gray-50/20">
            {/* Command Center Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
                <div className="relative">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[24px] shadow-xl shadow-purple-900/20">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic flex items-center gap-3">
                                Support Command
                                <span className="px-3 py-1 bg-purple-100 text-purple-600 text-[10px] rounded-lg font-black not-italic tracking-widest border border-purple-200">SUPER ADMIN</span>
                            </h1>
                            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-1 opacity-60">High Integrity Platform Assistance • v2.0</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white px-8 py-5 rounded-[32px] border border-gray-100 shadow-xl shadow-purple-900/5 flex items-center gap-6">
                        <div className="text-right border-r border-gray-100 pr-6">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Unresolved</p>
                            <p className="text-3xl font-black text-red-600 tracking-tighter">{stats.open + stats.pending}</p>
                        </div>
                        <div className="relative">
                            <div className="h-14 w-14 rounded-full border-4 border-gray-50 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-green-500 scale-x-[0.8] origin-left transition-transform duration-1000"></div>
                                <div className="relative z-10 text-[10px] font-black text-gray-900">82%</div>
                            </div>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Resolved Today</p>
                            <p className="text-3xl font-black text-green-600 tracking-tighter">{stats.resolved}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 h-auto lg:h-[750px] items-stretch">
                {/* Left Pane: Ticket List */}
                <div className={`w-full lg:w-80 flex flex-col gap-4 h-[500px] lg:h-auto ${selectedTicket ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-purple-900/5 overflow-hidden flex flex-col h-full">
                        <div className="p-6 border-b border-gray-50 bg-white/50 backdrop-blur-sm">
                            <div className="relative group mb-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-purple-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by ID, User, or Subject..."
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-xs focus:outline-none focus:ring-4 focus:ring-purple-600/5 transition-all font-bold tracking-tight"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest uppercase transition-all whitespace-nowrap border-2 ${statusFilter === status ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
                            {loading ? (
                                <div className="p-12 text-center h-full flex flex-col items-center justify-center">
                                    <div className="relative h-12 w-12">
                                        <div className="absolute inset-0 border-4 border-purple-100 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <p className="text-gray-300 text-[10px] font-black mt-6 uppercase tracking-[0.3em]">Querying Database...</p>
                                </div>
                            ) : filteredTickets.length === 0 ? (
                                <div className="p-12 text-center h-full flex flex-col items-center justify-center">
                                    <MessageSquare className="h-10 w-10 text-gray-100 mb-4" />
                                    <h3 className="font-black text-gray-200 uppercase tracking-widest text-xs">No Signal Detected</h3>
                                </div>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <button
                                        key={ticket.id}
                                        onClick={() => fetchTicketDetails(ticket.id)}
                                        className={`w-full p-6 text-left hover:bg-gray-50/80 transition-all group relative border-l-4 ${selectedTicket?.id === ticket.id ? 'bg-purple-50/20 border-purple-600' : 'border-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                                {ticket.priority === 'URGENT' && (
                                                    <div className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse shadow-sm shadow-red-500"></div>
                                                )}
                                            </div>
                                            <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest opacity-60">
                                                {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: false })}
                                            </span>
                                        </div>
                                        <h3 className="font-black text-gray-900 truncate group-hover:text-purple-700 transition-colors uppercase tracking-tight text-sm mb-2">{ticket.subject}</h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <div className="h-5 w-5 rounded-lg bg-gray-900 flex items-center justify-center text-[9px] font-black text-white">
                                                    {(ticket.user?.name || ticket.user?.email || 'U')[0].toUpperCase()}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500">{(ticket.user?.name || ticket.user?.email || 'Unknown').split(' ')[0]}</span>
                                            </div>
                                            <ChevronRight className={`h-3 w-3 text-gray-300 transition-transform ${selectedTicket?.id === ticket.id ? 'translate-x-1 text-purple-600' : ''}`} />
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Middle Pane: Conversation */}
                <div className={`flex-1 flex flex-col gap-4 h-[600px] lg:h-auto ${selectedTicket ? 'flex' : 'hidden lg:flex'}`}>
                    <div className="flex-1 bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-purple-900/10 overflow-hidden flex flex-col border-b-[8px] border-b-purple-600/5">
                        {!selectedTicket ? (
                            <div className="h-full flex items-center justify-center p-12 text-center bg-gray-50/5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-50/30 via-transparent to-transparent"></div>
                                <div className="relative z-10">
                                    <div className="h-[120px] w-[120px] bg-white rounded-[48px] shadow-2xl flex items-center justify-center mx-auto mb-10 transform -rotate-12 border border-purple-50 group hover:rotate-0 transition-transform duration-700">
                                        <Shield className="h-16 w-16 text-purple-600 animate-pulse" />
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter italic uppercase mb-2">Initialize Communication</h2>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.4em] border-t border-gray-100 pt-4">Global Network Operations Center</p>
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                key="ticket-admin-detail-content"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col h-full bg-white"
                            >
                                {/* Header */}
                                <div className="px-8 py-6 border-b border-gray-50 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => setSelectedTicket(null)}
                                            className="lg:hidden p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </button>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{selectedTicket.subject}</h2>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black tracking-[0.2em] border ${getStatusColor(selectedTicket.status)}`}>
                                                    {selectedTicket.status}
                                                </span>
                                                <div className="h-1 w-1 bg-gray-200 rounded-full"></div>
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">ID: {selectedTicket.id.split('-')[0]}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-all border border-transparent hover:border-gray-200">
                                            <BarChart3 className="h-4 w-4" />
                                        </button>
                                        <button className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 rounded-2xl transition-all border border-transparent hover:border-red-100">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-gray-50/10 custom-scrollbar">
                                    {/* System Initiation Log */}
                                    <div className="flex justify-center">
                                        <div className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-[8px] font-black uppercase tracking-[0.3em] shadow-lg shadow-gray-900/20">
                                            Ticket Instance Created • {new Date(selectedTicket.created_at).toLocaleTimeString()}
                                        </div>
                                    </div>

                                    {/* User Original Message */}
                                    <div className="flex gap-6">
                                        <div className="h-12 w-12 shrink-0 rounded-[22px] bg-white border-2 border-gray-100 flex items-center justify-center text-gray-900 font-black shadow-lg">
                                            {(selectedTicket.user?.name || selectedTicket.user?.email || 'U')[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 max-w-[80%]">
                                            <div className="bg-white p-7 rounded-[32px] rounded-tl-none shadow-sm border border-gray-100">
                                                <p className="text-gray-800 leading-relaxed text-sm font-medium">{selectedTicket.description}</p>
                                            </div>
                                            <span className="text-[9px] text-gray-300 mt-3 ml-2 block font-black uppercase tracking-[0.2em]">User Transmission • {formatDistanceToNow(new Date(selectedTicket.created_at), { addSuffix: true })}</span>
                                        </div>
                                    </div>

                                    {/* Replies Stream */}
                                    {replies.map((reply) => (
                                        <div key={reply.id} className={`flex gap-6 ${reply.user_id === session?.user?.id ? 'flex-row-reverse' : ''}`}>
                                            <div className={`h-12 w-12 shrink-0 rounded-[22px] flex items-center justify-center text-white font-black shadow-xl border-2 border-white ${reply.user_id === session?.user?.id ? 'bg-gradient-to-br from-purple-600 to-indigo-700 ring-4 ring-purple-100 shadow-purple-900/20' : 'bg-gray-100 text-gray-900 border-gray-200 shadow-none'}`}>
                                                {(reply.user?.name || 'U')[0].toUpperCase()}
                                            </div>
                                            <div className={`flex-1 max-w-[80%] ${reply.user_id === session?.user?.id ? 'text-right' : ''}`}>
                                                <div className={`p-7 rounded-[32px] shadow-sm border transition-all ${reply.user_id === session?.user?.id ? 'bg-gray-900 border-gray-800 rounded-tr-none text-left' : 'bg-white border-gray-100 rounded-tl-none'}`}>
                                                    {reply.user_id === session?.user?.id && (
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="px-2 py-0.5 bg-purple-500 rounded text-[8px] font-black text-white uppercase tracking-[0.2em]">Official Policy</div>
                                                            <div className="h-1 w-1 bg-purple-800 rounded-full"></div>
                                                            <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest leading-none">Command Specialist</span>
                                                        </div>
                                                    )}
                                                    <p className={`text-sm leading-relaxed font-medium ${reply.user_id === session?.user?.id ? 'text-purple-50' : 'text-gray-800'}`}>{reply.message}</p>
                                                </div>
                                                <span className="text-[9px] text-gray-300 mt-3 block font-black uppercase tracking-[0.2em] px-2">
                                                    {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Input */}
                                <div className="p-8 border-t border-gray-50 bg-white shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.03)]">
                                    <div className="relative group">
                                        <textarea
                                            placeholder="Transmit official response..."
                                            className="w-full p-6 pr-44 bg-gray-50 border-none rounded-[32px] text-sm focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white transition-all resize-none min-h-[140px] font-medium placeholder:opacity-30"
                                            value={newReply}
                                            onChange={(e) => setNewReply(e.target.value)}
                                        />
                                        <div className="absolute bottom-5 right-5 flex items-center gap-4">
                                            <button className="p-4 bg-white border border-gray-100 text-gray-400 hover:text-purple-600 rounded-2xl transition-all shadow-sm hover:shadow-md">
                                                <Paperclip className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={handleSendReply}
                                                disabled={!newReply.trim()}
                                                className="px-8 py-4 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all shadow-2xl shadow-gray-950/20 disabled:opacity-50 disabled:shadow-none active:scale-95 flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px]"
                                            >
                                                Send
                                                <Send className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Right Pane: Info & Details (Command Panel) */}
                <motion.div
                    key="ticket-info-panel-content"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`w-full lg:w-80 flex-col gap-6 ${selectedTicket ? 'flex' : 'hidden'} lg:flex`}
                >
                    {/* Status & Control Section */}
                    <div className="bg-gray-900 rounded-[32px] p-8 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden flex-shrink-0">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-l from-purple-600/20 to-transparent pointer-events-none"></div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-6 flex items-center gap-2">
                            System Controls
                        </h3>

                        <div className="space-y-6 relative z-10">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block px-1">Assignment Status</label>
                                <select
                                    className="w-full bg-white/10 hover:bg-white/15 border-none rounded-2xl py-3 px-4 text-xs font-bold uppercase tracking-widest focus:ring-4 focus:ring-purple-500/20 transition-all cursor-pointer"
                                    value={selectedTicket?.status || 'OPEN'}
                                    onChange={(e) => selectedTicket && handleUpdateStatus(selectedTicket.id, e.target.value)}
                                >
                                    <option className="bg-gray-900" value="OPEN">Mark Open</option>
                                    <option className="bg-gray-900" value="IN_PROGRESS">Processing</option>
                                    <option className="bg-gray-900" value="RESOLVED">Resolved</option>
                                    <option className="bg-gray-900" value="CLOSED">Secure Close</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 block px-1">Priority Protocol</label>
                                <select
                                    className="w-full bg-white/10 hover:bg-white/15 border-none rounded-2xl py-3 px-4 text-xs font-bold uppercase tracking-widest focus:ring-4 focus:ring-purple-500/20 transition-all cursor-pointer"
                                    value={selectedTicket?.priority || 'LOW'}
                                    onChange={(e) => selectedTicket && handleUpdatePriority(selectedTicket.id, e.target.value)}
                                >
                                    <option className="bg-gray-900" value="LOW">Tier 4: Low</option>
                                    <option className="bg-gray-900" value="MEDIUM">Tier 3: Mid</option>
                                    <option className="bg-gray-900" value="HIGH">Tier 2: High</option>
                                    <option className="bg-gray-900" value="URGENT">Tier 1: Urgent</option>
                                </select>
                            </div>

                            <button className="w-full py-4 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-500 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all">
                                System Lockdown
                            </button>
                        </div>
                    </div>

                    {/* Metadata & Context Panel */}
                    <div className="flex-1 bg-white rounded-[32px] border border-gray-100 p-8 shadow-xl shadow-purple-900/5 flex flex-col">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 border-b border-gray-50 pb-4">
                            Entity Metadata
                        </h3>

                        <div className="space-y-10 flex-1 overflow-y-auto custom-scrollbar pr-2">
                            {/* User Profile Summary */}
                            <div className="flex items-center gap-4 group">
                                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                                    <UserIcon className="h-6 w-6 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{selectedTicket?.user?.name || 'Unknown User'}</p>
                                    <p className="text-[10px] text-gray-400 font-medium truncate w-32">{selectedTicket?.user?.email || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Ticket Details Grid */}
                            <div className="grid grid-cols-1 gap-8">
                                {[
                                    { icon: <Building2 className="h-4 w-4" />, label: 'Category', val: selectedTicket?.category || 'GENERAL' },
                                    { icon: <Clock className="h-4 w-4" />, label: 'Established', val: selectedTicket ? new Date(selectedTicket.created_at).toLocaleDateString() : 'N/A' },
                                    { icon: <Shield className="h-4 w-4" />, label: 'Registry ID', val: selectedTicket?.id?.split('-')[0] || 'N/A' },
                                    { icon: <BarChart3 className="h-4 w-4" />, label: 'Store Type', val: 'Retail Enterprise' },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="h-9 w-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-0.5">{item.label}</p>
                                            <p className="text-[11px] font-black text-gray-700 uppercase tracking-tight">{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Verification Badge */}
                        <div className="mt-10 p-4 bg-green-50 rounded-[20px] border border-green-100/50 flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-[9px] font-black text-green-700 uppercase tracking-[0.1em]">Identity Authenticated</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
