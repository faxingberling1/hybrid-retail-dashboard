"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus, Search, Filter, MessageSquare,
    Send, Clock, CheckCircle, AlertCircle,
    ChevronRight, ArrowLeft, Paperclip,
    MoreVertical, Shield, X, BarChart3,
    Calendar, User as UserIcon, Building2,
    Smile, RefreshCw, Layers, Zap,
    MousePointer2, Terminal, Info,
    Hash, Lock, Unlock, Download,
    CheckCircle2, AlertTriangle, Eye, LifeBuoy
} from "lucide-react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { formatDistanceToNow, isSameDay, format } from "date-fns"
import { toast } from "sonner"
import { useNotification } from "@/lib/hooks/use-notification"

const EMOJIS = ["😊", "👍", "👋", "🚀", "💡", "🛠️", "⚠️", "✅", "🙌", "🙏", "🔥", "✨", "💯", "🎯", "🌟", "💻"]

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

export default function AdminSupportPage() {
    const { data: session } = useSession()
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [replies, setReplies] = useState<Reply[]>([])
    const [newReply, setNewReply] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const { notifications, refresh: refreshNotifications } = useNotification()
    const searchParams = useSearchParams()
    const ticketIdParam = searchParams.get('ticketId')
    const chatEndRef = useRef<HTMLDivElement>(null)

    // Form state for new ticket
    const [subject, setSubject] = useState("")
    const [category, setCategory] = useState("TECHNICAL")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("MEDIUM")

    useEffect(() => {
        fetchTickets()
    }, [])

    useEffect(() => {
        if (ticketIdParam && tickets.length > 0) {
            const ticket = tickets.find(t => t.id === ticketIdParam)
            if (ticket) {
                fetchTicketDetails(ticketIdParam)
            }
        }
    }, [ticketIdParam, tickets.length])

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [replies])

    const fetchTickets = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/tickets')
            const data = await res.json()
            if (Array.isArray(data)) {
                setTickets(data)
            } else {
                setTickets([])
            }
        } catch (error) {
            toast.error("Failed to lead intelligence stream")
        } finally {
            setLoading(false)
        }
    }

    const fetchTicketDetails = async (id: string) => {
        try {
            const res = await fetch(`/api/tickets/${id}`)
            const data = await res.json()
            if (data && data.id) {
                setSelectedTicket(data)
                setReplies(data.replies || [])

                // Mark notifications as read
                const supportNotifications = notifications.filter(n =>
                    !n.read && n.metadata?.ticket_id === id
                )

                if (supportNotifications.length > 0) {
                    await Promise.all(supportNotifications.map(n =>
                        fetch('/api/notifications/read', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ notificationId: n.id })
                        })
                    ))
                    refreshNotifications()
                }
            }
        } catch (error) {
            toast.error("Communication failure")
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
                toast.success(`Protocol updated: ${newStatus}`)
                fetchTickets()
                if (selectedTicket?.id === id) {
                    setSelectedTicket({ ...selectedTicket, status: newStatus as any })
                }
            }
        } catch (error) {
            toast.error("Status update error")
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
                toast.success(`Priority Tier adjusted: ${newPriority}`)
                fetchTickets()
                if (selectedTicket?.id === id) {
                    setSelectedTicket({ ...selectedTicket, priority: newPriority as any })
                }
            }
        } catch (error) {
            toast.error("Priority tier failure")
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
                if (selectedTicket.status === 'OPEN') {
                    setSelectedTicket({ ...selectedTicket, status: 'IN_PROGRESS' })
                    fetchTickets()
                }
            }
        } catch (error) {
            toast.error("Transmission failed")
        }
    }

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, description, priority, category })
            })

            if (res.ok) {
                toast.success("Ticket created successfully")
                setIsCreating(false)
                setSubject("")
                setDescription("")
                fetchTickets()
            } else {
                toast.error("Failed to create ticket")
            }
        } catch (error) {
            toast.error("An error occurred")
        }
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'OPEN': return 'text-sky-500 bg-sky-500/10 border-sky-500/20'
            case 'IN_PROGRESS': return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
            case 'RESOLVED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
            case 'CLOSED': return 'text-slate-500 bg-slate-500/10 border-slate-500/20'
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20'
        }
    }

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'text-rose-500 bg-rose-500/10 border-rose-500/20'
            case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
            case 'MEDIUM': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
            case 'LOW': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
            default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20'
        }
    }

    const filteredTickets = (Array.isArray(tickets) ? tickets : []).filter(t => {
        const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.id.includes(searchQuery)
        const currentStatus = t.status || 'OPEN'
        const matchesStatus = statusFilter === 'ALL' || currentStatus === statusFilter
        return matchesSearch && matchesStatus
    })

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => (t.status || 'OPEN') === 'OPEN').length,
        inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolvedToday: tickets.filter(t => t.status === 'RESOLVED' && t.updated_at && isSameDay(new Date(t.updated_at), new Date())).length,
        urgencyRate: tickets.filter(t => t.priority === 'URGENT' && t.status !== 'RESOLVED').length
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 p-6 lg:p-10">
            <div className="max-w-[1700px] mx-auto space-y-8">

                {/* Visual Header Intelligence */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-indigo-500">
                            <Shield className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Organization Hub • {session?.user?.organizationName || 'Staff Support'}</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                            Support <span className="text-grad italic">Console</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">Managing organization integrity and staff assistance signals.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Active', value: stats.open + stats.inProgress, icon: <AlertCircle className="w-4 h-4 text-rose-500" />, color: 'rose' },
                                { label: 'Total', value: stats.total, icon: <Layers className="w-4 h-4 text-indigo-500" />, color: 'indigo' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-premium flex items-center gap-4 group hover:border-indigo-500/50 transition-all cursor-default min-w-[150px]">
                                    <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 group-hover:scale-110 transition-transform`}>
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{stat.label}</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/10 active:scale-95 group"
                        >
                            <Plus className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                            New Request
                        </button>
                    </div>
                </div>

                {/* Main Control Interface */}
                <div className="flex flex-col xl:flex-row gap-8 h-auto xl:h-[850px] items-stretch">

                    {/* Left Pane: Registry Stream */}
                    <div className={`w-full xl:w-[420px] shrink-0 flex flex-col gap-4 ${selectedTicket ? 'hidden xl:flex' : 'flex'}`}>
                        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-premium overflow-hidden flex flex-col h-full">
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 space-y-6">
                                <div className="relative group">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Query Staff or Protocol..."
                                        className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                                    {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setStatusFilter(status)}
                                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black tracking-[0.15em] uppercase transition-all whitespace-nowrap border-2 ${statusFilter === status ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800 hover:border-slate-200'}`}
                                        >
                                            {status.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                                        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Syncing...</span>
                                    </div>
                                ) : filteredTickets.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full py-32 text-center opacity-50">
                                        <Terminal className="w-12 h-12 mb-4 text-slate-300" />
                                        <p className="font-black text-[10px] uppercase tracking-widest">No Active Nodes</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1 p-2">
                                        {filteredTickets.map((ticket) => {
                                            const isUnread = notifications.some(n => !n.read && n.metadata?.ticket_id === ticket.id);
                                            const isActive = selectedTicket?.id === ticket.id;
                                            return (
                                                <motion.button
                                                    layout
                                                    key={ticket.id}
                                                    onClick={() => fetchTicketDetails(ticket.id)}
                                                    className={`w-full p-6 text-left rounded-[1.8rem] transition-all relative group flex flex-col gap-4 border-2 ${isActive ? 'bg-white dark:bg-slate-800 border-indigo-500/50 shadow-xl' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getStatusStyles(ticket.status || 'OPEN')}`}>
                                                                {ticket.status || 'OPEN'}
                                                            </span>
                                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getPriorityStyles(ticket.priority || 'MEDIUM')}`}>
                                                                {ticket.priority}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                                                {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: false })}
                                                            </span>
                                                            {isUnread && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h3 className={`font-black uppercase tracking-tight text-sm line-clamp-1 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-100'}`}>
                                                            {ticket.subject}
                                                        </h3>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-[7px] font-black text-white border border-white dark:border-slate-700">
                                                                {(ticket.user?.name || 'U')[0].toUpperCase()}
                                                            </div>
                                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest truncate">
                                                                {ticket.user?.name || 'Unknown'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{ticket.category}</span>
                                                        <ChevronRight className={`w-4 h-4 text-slate-300 transition-all ${isActive ? 'translate-x-1 text-indigo-500' : 'group-hover:translate-x-1'}`} />
                                                    </div>
                                                </motion.button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Middle Pane: Communication Stream */}
                    <div className={`flex-1 flex flex-col gap-4 h-[700px] xl:h-auto ${selectedTicket ? 'flex' : 'hidden xl:flex'}`}>
                        <div className="flex-1 bg-white dark:bg-slate-900/40 backdrop-blur-2xl rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-premium overflow-hidden flex flex-col relative group/chat">

                            {!selectedTicket ? (
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50/30 dark:bg-slate-900/10">
                                    <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-10 transform -rotate-12 border border-slate-100 dark:border-slate-700 group-hover:rotate-0 transition-all duration-700">
                                        <LifeBuoy className="w-14 h-14 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase mb-2">Awaiting Stream</h2>
                                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.5em] border-t border-slate-200 dark:border-slate-800 pt-6 mt-4">Official Organization Support Node</p>
                                </div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedTicket.id}
                                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                        className="flex flex-col h-full"
                                    >
                                        {/* Dynamic Chat Header */}
                                        <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 transition-all">
                                            <div className="flex items-center gap-6">
                                                <button
                                                    onClick={() => setSelectedTicket(null)}
                                                    className="xl:hidden p-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-2xl transition-all"
                                                >
                                                    <ArrowLeft className="w-5 h-5" />
                                                </button>
                                                <div className="space-y-1">
                                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{selectedTicket.subject}</h2>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest border ${getStatusStyles(selectedTicket.status)}`}>
                                                            {selectedTicket.status}
                                                        </span>
                                                        <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">NODE-{selectedTicket.id.slice(0, 8)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message Stream */}
                                        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/20">

                                            {/* Initial Ticket Message */}
                                            <div className="flex justify-center py-4">
                                                <div className="px-6 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-full text-[9px] font-black uppercase tracking-[0.4em] shadow-xl shadow-slate-900/20 border border-slate-700">
                                                    Transmission Started • {format(new Date(selectedTicket.created_at), 'HH:mm:ss')}
                                                </div>
                                            </div>

                                            <div className="flex gap-6 max-w-[90%]">
                                                <div className="w-14 h-14 shrink-0 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-2xl border-4 border-white dark:border-slate-800 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                                                    {(selectedTicket.user?.name || '?')[0].toUpperCase()}
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] rounded-tl-none shadow-premium border border-slate-100 dark:border-slate-700/50 relative">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{selectedTicket.user?.name}</span>
                                                        </div>
                                                        <p className="text-slate-800 dark:text-slate-100 text-base font-medium leading-relaxed">
                                                            {selectedTicket.description}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3 px-2">
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{formatDistanceToNow(new Date(selectedTicket.created_at), { addSuffix: true })}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Reply Threads */}
                                            {replies.map((reply) => {
                                                const isSelf = reply.user_id === session?.user?.id;
                                                return (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: isSelf ? 20 : -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        key={reply.id}
                                                        className={`flex gap-6 ${isSelf ? 'flex-row-reverse self-end ml-auto' : ''} max-w-[90%]`}
                                                    >
                                                        <div className={`w-14 h-14 shrink-0 rounded-[2rem] flex items-center justify-center font-black text-xl shadow-2xl border-4 border-white dark:border-slate-800 z-10 ${isSelf ? 'bg-slate-900 text-white ring-8 ring-indigo-500/5' : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white ring-8 ring-slate-100 dark:ring-slate-800/10'}`}>
                                                            {(reply.user?.name || 'U')[0].toUpperCase()}
                                                        </div>
                                                        <div className={`space-y-3 ${isSelf ? 'text-right' : ''}`}>
                                                            <div className={`p-8 rounded-[2.5rem] shadow-premium border transition-all ${isSelf ? 'bg-indigo-600 border-indigo-500 rounded-tr-none text-white' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 rounded-tl-none text-slate-800 dark:text-slate-100'}`}>
                                                                <div className="flex items-center gap-2 mb-2 opacity-80">
                                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{reply.user?.name}</span>
                                                                    {reply.user_id !== session?.user?.id && reply.user.role === 'SUPER_ADMIN' && (
                                                                        <span className="bg-green-500 text-white px-1.5 py-0.5 rounded text-[7px] font-black uppercase">Official Support</span>
                                                                    )}
                                                                </div>
                                                                <p className="text-base font-medium leading-relaxed">{reply.message}</p>
                                                            </div>
                                                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                                                                {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                )
                                            })}
                                            <div ref={chatEndRef} />
                                        </div>

                                        {/* Input Buffer */}
                                        <div className="p-10 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                                            <div className="relative group">
                                                <textarea
                                                    placeholder="Transmit response directive..."
                                                    className="w-full p-8 pr-52 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] text-base focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all resize-none min-h-[160px] font-medium shadow-premium placeholder:opacity-40"
                                                    value={newReply}
                                                    onChange={(e) => setNewReply(e.target.value)}
                                                />
                                                <div className="absolute bottom-6 right-6 flex items-center gap-4">
                                                    <div className="relative">
                                                        <AnimatePresence>
                                                            {showEmojiPicker && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                                    className="absolute bottom-full right-0 mb-6 p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-4 gap-2 z-50 backdrop-blur-3xl"
                                                                >
                                                                    {EMOJIS.map(emoji => (
                                                                        <button
                                                                            key={emoji}
                                                                            onClick={() => {
                                                                                setNewReply(prev => prev + emoji)
                                                                                setShowEmojiPicker(false)
                                                                            }}
                                                                            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-2xl hover:scale-125"
                                                                        >
                                                                            {emoji}
                                                                        </button>
                                                                    ))}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                        <button
                                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                            className={`p-5 rounded-2xl transition-all ${showEmojiPicker ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-400 hover:text-indigo-500'}`}
                                                        >
                                                            <Smile className="w-6 h-6" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={handleSendReply}
                                                        disabled={!newReply.trim()}
                                                        className="px-8 py-5 grad-indigo text-white rounded-2xl font-black uppercase tracking-[0.25em] text-[10px] shadow-2xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex items-center gap-4"
                                                    >
                                                        Transmit
                                                        <Send className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </div>
                    </div>

                    {/* Right Pane: Intel & Controls */}
                    <AnimatePresence>
                        {selectedTicket && (
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 40 }}
                                className="w-full xl:w-[420px] shrink-0 flex flex-col gap-6"
                            >
                                <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group/proto flex-shrink-0">
                                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 blur-[100px] pointer-events-none group-hover/proto:bg-indigo-500/30 transition-all duration-1000" />

                                    <div className="flex items-center gap-3 mb-10">
                                        <div className="p-3 bg-indigo-500/10 rounded-2xl">
                                            <Terminal className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-400">Action Protocol</h3>
                                    </div>

                                    <div className="space-y-8 relative z-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block px-2">Operational Status</label>
                                            <select
                                                className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-2xl py-5 px-6 text-xs font-black uppercase tracking-widest focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                                                value={selectedTicket.status}
                                                onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                                            >
                                                <option value="OPEN">Mark Active</option>
                                                <option value="IN_PROGRESS">Commencing Processing</option>
                                                <option value="RESOLVED">Verified Resolution</option>
                                                <option value="CLOSED">Secure Termination</option>
                                            </select>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block px-2">Integrity Tier</label>
                                            <select
                                                className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-2xl py-5 px-6 text-xs font-black uppercase tracking-widest focus:ring-8 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                                                value={selectedTicket.priority}
                                                onChange={(e) => handleUpdatePriority(selectedTicket.id, e.target.value)}
                                            >
                                                <option value="URGENT">T1: CRITICAL URGENCY</option>
                                                <option value="HIGH">T2: HIGH PRIORITY</option>
                                                <option value="MEDIUM">T3: STANDARD OPS</option>
                                                <option value="LOW">T4: LOW SEVERITY</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-premium flex flex-col">
                                    <div className="space-y-12">
                                        <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                                            <Info className="w-5 h-5 text-indigo-500" />
                                            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Staff Meta-Data</h3>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="flex items-center gap-5 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center border-2 border-white dark:border-slate-700">
                                                    <UserIcon className="w-8 h-8 text-indigo-500" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedTicket.user?.name}</p>
                                                    <p className="text-[11px] text-slate-400 font-bold">{selectedTicket.user?.email}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6">
                                                {[
                                                    { icon: <Zap />, label: 'Category', val: selectedTicket.category.replace('_', ' ') },
                                                    { icon: <Calendar />, label: 'Logged At', val: format(new Date(selectedTicket.created_at), 'MMM dd, yyyy HH:mm') },
                                                    { icon: <Hash />, label: 'Registry ID', val: selectedTicket.id.slice(0, 16).toUpperCase() },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex gap-5 items-center">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800">
                                                            {React.cloneElement(item.icon as React.ReactElement, { className: 'w-4 h-4' })}
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-0.5">{item.label}</p>
                                                            <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{item.val}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Create Ticket Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden border border-white/20"
                        >
                            <div className="px-10 py-8 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight uppercase italic flex items-center gap-3">
                                        <LifeBuoy className="h-7 w-7 text-indigo-400" />
                                        Support Request
                                    </h2>
                                    <p className="text-indigo-100/40 text-[9px] font-black uppercase tracking-[0.3em] mt-2">Protocol: Official Platform Assistance</p>
                                </div>
                                <button
                                    onClick={() => setIsCreating(false)}
                                    className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors border border-white/10"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateTicket} className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Primary Subject</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Descriptive summary"
                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white dark:focus:bg-slate-700 transition-all text-gray-900 dark:text-white font-bold"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Classification</label>
                                        <select
                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white dark:focus:bg-slate-700 transition-all text-gray-900 dark:text-white font-bold appearance-none cursor-pointer"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        >
                                            <option value="TECHNICAL">Technical Core</option>
                                            <option value="BILLING">Billing & Ledger</option>
                                            <option value="GENERAL">General Stream</option>
                                            <option value="FEATURE_REQUEST">Feature Architecture</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Priority Protocol</label>
                                    <div className="flex bg-gray-50 dark:bg-slate-800 border-none rounded-2xl p-1.5 gap-1.5">
                                        {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setPriority(p)}
                                                className={`flex-1 py-3 rounded-xl text-[9px] font-black transition-all uppercase tracking-widest ${priority === p ? 'bg-white dark:bg-slate-700 shadow-xl text-gray-900 dark:text-white scale-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 scale-95 opacity-60'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Detailed Log</label>
                                    <textarea
                                        required
                                        placeholder="Full signal description..."
                                        rows={5}
                                        className="w-full px-6 py-5 bg-gray-50 dark:bg-slate-800 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:bg-white dark:focus:bg-slate-700 transition-all text-gray-800 dark:text-gray-100 leading-relaxed font-medium resize-none"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-5 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 py-5 bg-gray-50 dark:bg-slate-800 text-gray-400 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-600 transition-all active:scale-95"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-900/10 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        Transmit Request
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .text-grad {
                    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .grad-indigo {
                    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                }
                .shadow-premium {
                    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.05),
                                0 0 0 1px rgba(0, 0, 0, 0.01);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.05);
                    border-radius: 20px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.05);
                }
            `}</style>
        </div>
    )
}
