"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Plus, Search, Filter, MessageSquare,
    Send, Clock, CheckCircle, AlertCircle,
    ChevronRight, ArrowLeft, Paperclip,
    MoreVertical, LifeBuoy, X
} from "lucide-react"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { useNotification } from "@/lib/hooks/use-notification"
import { Smile } from "lucide-react"

const EMOJIS = ["😊", "👍", "👋", "🚀", "💡", "🛠️", "⚠️", "✅", "🙌", "🙏", "🔥", "✨"]

interface Ticket {
    id: string
    subject: string
    description: string
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    category: string
    created_at: string
    updated_at: string
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
        email?: string
    }
}

export default function UserSupportPage() {
    const { data: session } = useSession()
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
    const [replies, setReplies] = useState<Reply[]>([])
    const [newReply, setNewReply] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const { notifications, refresh: refreshNotifications } = useNotification()

    // Form state
    const [subject, setSubject] = useState("")
    const [category, setCategory] = useState("TECHNICAL")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("MEDIUM")

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        try {
            const res = await fetch('/api/tickets')
            const data = await res.json()
            if (Array.isArray(data)) {
                setTickets(data)
            } else {
                console.error("Tickets response is not an array:", data)
                setTickets([])
            }
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
            if (data && data.id) {
                setSelectedTicket(data)
                setReplies(data.replies || [])

                // Mark related notifications as read
                const supportNotifications = notifications.filter(n =>
                    !n.read &&
                    n.metadata?.ticket_id === id
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
            } else {
                toast.error("Ticket not found")
            }
        } catch (error) {
            toast.error("Failed to load ticket details")
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
                // Re-fetch ticket to get updated status
                fetchTicketDetails(selectedTicket.id)
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

    const filteredTickets = (Array.isArray(tickets) ? tickets : []).filter(t =>
        t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.includes(searchQuery)
    )

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/20">
            {/* Knowledge Base / Header Section */}
            <div className="mb-10">
                <div className="bg-gradient-to-br from-green-900 via-emerald-900 to-green-950 rounded-[40px] p-8 lg:p-12 relative overflow-hidden shadow-2xl shadow-green-900/10">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
                    <div className="relative z-10">
                        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 flex items-center gap-4">
                            How can we help?
                            <div className="px-4 py-1.5 bg-green-500/20 rounded-full border border-green-400/30 text-xs font-black uppercase tracking-[0.2em] text-green-400">Support Hub</div>
                        </h1>
                        <p className="text-green-100/70 text-lg max-w-2xl font-medium leading-relaxed mb-8">
                            Search our knowledge base for instant answers or reach out to our specialist team for dedicated platform assistance.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { title: 'Documentation', desc: 'Step-by-step POS guides', icon: <ChevronRight className="h-4 w-4" /> },
                                { title: 'Video Tutorials', desc: 'Master the dashboard', icon: <ChevronRight className="h-4 w-4" /> },
                                { title: 'System Status', desc: 'Platform operational', icon: <CheckCircle className="h-4 w-4 text-green-400" /> },
                            ].map((box, i) => (
                                <div key={i} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-all cursor-pointer group">
                                    <h3 className="text-white font-black text-sm uppercase tracking-widest mb-1 flex items-center justify-between">
                                        {box.title}
                                        {box.icon}
                                    </h3>
                                    <p className="text-green-100/40 text-xs font-medium uppercase tracking-tight">{box.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4 px-2">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Inquiries</h2>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mt-1">Manage and track your support signals</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center px-8 py-4 bg-green-600 text-white rounded-[24px] font-black uppercase tracking-widest text-[11px] hover:bg-green-700 transition-all shadow-xl shadow-green-900/10 active:scale-95 group"
                    >
                        <Plus className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                        Initiate New Ticket
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Ticket List */}
                <div className={`lg:col-span-4 ${selectedTicket ? 'hidden lg:block' : 'block'}`}>
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col h-[600px]">
                        <div className="p-6 border-b border-gray-50 bg-white">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Find a conversation..."
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-green-600/5 transition-all font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-y-auto flex-1 divide-y divide-gray-50/50 custom-scrollbar">
                            {loading ? (
                                <div className="p-12 text-center h-full flex flex-col items-center justify-center">
                                    <div className="relative h-12 w-12">
                                        <div className="absolute inset-0 border-4 border-green-100 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <p className="text-gray-400 text-[10px] font-black mt-6 uppercase tracking-[0.2em]">Synchronizing...</p>
                                </div>
                            ) : filteredTickets.length === 0 ? (
                                <div className="p-12 text-center h-full flex flex-col items-center justify-center">
                                    <div className="h-20 w-20 bg-gray-50 rounded-[32px] flex items-center justify-center mb-6">
                                        <MessageSquare className="h-10 w-10 text-gray-200" />
                                    </div>
                                    <h3 className="font-black text-gray-900 uppercase text-xs tracking-[0.2em]">Silent Airwaves</h3>
                                    <p className="text-xs text-gray-400 mt-2 font-medium px-8 leading-relaxed">Your support requests will appear here once initiated.</p>
                                </div>
                            ) : (
                                filteredTickets.map((ticket) => {
                                    const isUnread = notifications.some(n => !n.read && n.metadata?.ticket_id === ticket.id);
                                    return (
                                        <button
                                            key={ticket.id}
                                            onClick={() => fetchTicketDetails(ticket.id)}
                                            className={`w-full p-6 text-left hover:bg-gray-50/50 transition-all group relative border-l-[6px] ${selectedTicket?.id === ticket.id ? 'bg-green-50/30 border-green-600 scale-[0.98] rounded-2xl' : 'border-transparent'} ${isUnread ? 'bg-blue-50/20' : ''}`}
                                        >
                                            {isUnread && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">New Message</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-start mb-3">
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(ticket.status || 'OPEN')}`}>
                                                    {ticket.status || 'OPEN'}
                                                </span>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                                                    {formatDistanceToNow(new Date(ticket.updated_at), { addSuffix: false })} ago
                                                </span>
                                            </div>
                                            <h3 className="font-black text-gray-900 group-hover:text-green-700 transition-colors line-clamp-1 uppercase tracking-tight text-sm mb-3 pr-20">{ticket.subject}</h3>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                    <Clock className="h-3 w-3 mr-1.5 opacity-50" />
                                                    {ticket.category.replace('_', ' ')}
                                                </div>
                                                <div className={`flex items-center text-[10px] font-black uppercase tracking-widest ${getPriorityColor(ticket.priority)}`}>
                                                    <div className="h-1.5 w-1.5 rounded-full bg-current mr-1.5 animate-pulse"></div>
                                                    {ticket.priority}
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Ticket Detail / Conversation */}
                <div className={`lg:col-span-8 ${selectedTicket ? 'block' : 'hidden lg:block'}`}>
                    <div className="h-[600px] bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col">
                        {!selectedTicket ? (
                            <div className="h-full flex items-center justify-center p-12 text-center bg-gray-50/5 overflow-hidden relative">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-50/20 via-transparent to-transparent pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="h-32 w-32 bg-white rounded-[48px] shadow-2xl flex items-center justify-center mx-auto mb-10 transform -rotate-12 border border-gray-50">
                                        <LifeBuoy className="h-16 w-16 text-green-600 animate-pulse" />
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic mb-4">Select Signal</h2>
                                    <p className="text-gray-400 max-w-xs mx-auto font-black uppercase tracking-[0.3em] text-[10px] border-t border-gray-100 pt-4">Expert team on standby</p>
                                </div>
                            </div>
                        ) : (
                            <motion.div
                                key="ticket-detail-content"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col h-full"
                                {...({} as any)}
                            >
                                {/* Active Header */}
                                <div className="p-6 lg:p-8 border-b border-gray-50 bg-white">
                                    <div className="flex items-center gap-6">
                                        <button
                                            onClick={() => setSelectedTicket(null)}
                                            className="lg:hidden p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors"
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </button>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-2">
                                                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{selectedTicket.subject}</h2>
                                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] ${getStatusColor(selectedTicket.status || 'OPEN')}`}>
                                                    {selectedTicket.status || 'OPEN'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="text-[10px] text-gray-400 font-black tracking-[0.1em] uppercase opacity-60">Signature: {selectedTicket.id?.split('-')[0].toUpperCase() || 'N/A'}</p>
                                                <div className="h-1 w-1 bg-gray-200 rounded-full"></div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${getPriorityColor(selectedTicket.priority)}`}>
                                                    {selectedTicket.priority} Priority Tier
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Stream */}
                                <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-10 bg-gray-50/10 custom-scrollbar">
                                    {/* Subject Initiation */}
                                    <div className="flex gap-5">
                                        <div className="h-12 w-12 shrink-0 rounded-[20px] bg-green-900 flex items-center justify-center text-white font-black shadow-xl border-2 border-white">
                                            {((session?.user as any)?.name || (session?.user as any)?.email || 'U')[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 max-w-[85%]">
                                            <div className="bg-white p-7 rounded-[32px] rounded-tl-none shadow-sm border border-gray-100 relative">
                                                <div className="absolute -top-3 left-4 px-3 py-1 bg-gray-900 text-white rounded-lg text-[8px] font-black uppercase tracking-[0.2em]">Inquiry Initiation</div>
                                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm font-medium">{selectedTicket.description}</p>
                                            </div>
                                            <span className="text-[9px] text-gray-300 mt-3 ml-2 block font-black uppercase tracking-[0.2em]">Signal Origin • {formatDistanceToNow(new Date(selectedTicket.created_at), { addSuffix: true })}</span>
                                        </div>
                                    </div>

                                    {/* Response Stream */}
                                    {replies.map((reply) => (
                                        <div key={reply.id} className={`flex gap-5 ${reply.user_id === session?.user?.id ? '' : 'flex-row-reverse'}`}>
                                            <div className={`h-12 w-12 shrink-0 rounded-[20px] flex items-center justify-center text-white font-black shadow-xl border-2 border-white ${reply.user_id === session?.user?.id ? 'bg-green-600 shadow-green-100' : 'bg-gradient-to-br from-green-900 to-green-950 shadow-gray-200'}`}>
                                                {(reply.user?.name || reply.user?.email || 'U')[0].toUpperCase()}
                                            </div>
                                            <div className={`flex-1 max-w-[85%] ${reply.user_id === session?.user?.id ? '' : 'text-right'}`}>
                                                <div className={`p-7 rounded-[32px] shadow-sm border transition-all ${reply.user_id === session?.user?.id ? 'bg-white border-gray-100 rounded-tl-none' : 'bg-gray-900 border-gray-800 rounded-tr-none text-left'}`}>
                                                    {reply.user_id !== session?.user?.id && (
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="px-2 py-1 bg-green-500 rounded-md text-[8px] font-black text-white uppercase tracking-[0.2em]">Official Response</div>
                                                            <div className="h-1 w-1 bg-green-800 rounded-full"></div>
                                                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest leading-none">{reply.user.name}</span>
                                                        </div>
                                                    )}
                                                    <p className={`text-sm leading-relaxed font-medium ${reply.user_id !== session?.user?.id ? 'text-green-50' : 'text-gray-800'}`}>{reply.message}</p>
                                                </div>
                                                <span className="text-[9px] text-gray-300 mt-3 block font-black uppercase tracking-[0.2em] px-2">
                                                    {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Response Uplink */}
                                {selectedTicket.status !== 'CLOSED' && (
                                    <div className="p-6 lg:p-8 border-t border-gray-50 bg-white">
                                        <div className="relative group">
                                            <textarea
                                                placeholder="Transmit clarification..."
                                                className="w-full p-6 pr-24 bg-gray-50 border-none rounded-[32px] text-sm focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all resize-none min-h-[120px] font-medium"
                                                value={newReply}
                                                onChange={(e) => setNewReply(e.target.value)}
                                            />
                                            <div className="bottom-5 right-5 flex items-center gap-2">
                                                <div className="relative">
                                                    <AnimatePresence>
                                                        {showEmojiPicker && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                className="absolute bottom-full right-0 mb-4 p-3 bg-white rounded-2xl shadow-2xl border border-gray-100 flex gap-2 z-50 overflow-hidden min-w-[300px] flex-wrap justify-center backdrop-blur-xl bg-white/90"
                                                                {...({} as any)}
                                                            >
                                                                {EMOJIS.map(emoji => (
                                                                    <button
                                                                        key={emoji}
                                                                        onClick={() => {
                                                                            setNewReply(prev => prev + emoji)
                                                                            setShowEmojiPicker(false)
                                                                        }}
                                                                        className="p-2 hover:bg-gray-100 rounded-xl transition-all text-xl hover:scale-125 active:scale-95"
                                                                    >
                                                                        {emoji}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                    <button
                                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                        className={`p-4 rounded-2xl transition-all shadow-sm hover:shadow-md ${showEmojiPicker ? 'bg-green-600 text-white shadow-green-500/20' : 'bg-white border border-gray-100 text-gray-400 hover:text-green-600'}`}
                                                    >
                                                        <Smile className="h-5 w-5" />
                                                    </button>
                                                </div>
                                                <button className="p-4 bg-white border border-gray-100 text-gray-400 hover:text-green-600 rounded-2xl transition-all shadow-sm hover:shadow-md">
                                                    <Paperclip className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={handleSendReply}
                                                    disabled={!newReply.trim()}
                                                    className="p-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all shadow-2xl shadow-green-900/20 disabled:opacity-50 disabled:shadow-none active:scale-95"
                                                >
                                                    <Send className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Ticket Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-xl">
                        <motion.div
                            key="create-ticket-modal-inner"
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden border border-white/20"
                            {...({} as any)}
                        >
                            <div className="px-10 py-8 bg-gradient-to-r from-green-900 to-emerald-900 text-white flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-black tracking-tight uppercase italic flex items-center gap-3">
                                        <LifeBuoy className="h-7 w-7 text-green-400" />
                                        Support Request
                                    </h2>
                                    <p className="text-green-100/40 text-[9px] font-black uppercase tracking-[0.3em] mt-2">Protocol: High Integrity Assistance</p>
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
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all text-gray-900 font-bold"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Classification</label>
                                        <select
                                            className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all text-gray-900 font-bold appearance-none cursor-pointer"
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
                                    <div className="flex bg-gray-50 border-none rounded-2xl p-1.5 gap-1.5">
                                        {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setPriority(p)}
                                                className={`flex-1 py-3 rounded-xl text-[9px] font-black transition-all uppercase tracking-widest ${priority === p ? 'bg-white shadow-xl shadow-gray-200/50 text-gray-900 scale-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 scale-95 opacity-60'}`}
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
                                        className="w-full px-6 py-5 bg-gray-50 border-none rounded-3xl focus:outline-none focus:ring-4 focus:ring-green-600/5 focus:bg-white transition-all text-gray-800 leading-relaxed font-medium resize-none"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-5 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-gray-100 hover:text-gray-600 transition-all active:scale-95"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-5 bg-green-600 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-green-700 transition-all shadow-2xl shadow-green-900/10 active:scale-95 flex items-center justify-center gap-3"
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
        </div >
    )
}
