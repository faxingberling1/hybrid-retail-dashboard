"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Save, Plus, Trash2, Edit, Eye, EyeOff,
    Calendar, Tag, X, Check, Search,
    Settings, Globe, BarChart3, Image as ImageIcon,
    ChevronRight, Layout, Type, Clock, Star,
    MoreVertical, ArrowLeft, ExternalLink, Send, FileText,
    Bold, Italic, List, Heading1, Heading2, Link as LinkIcon,
    Underline, Strikethrough, Quote, Code
} from "lucide-react";
import { useRouter } from "next/navigation";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    category: string;
    author: string;
    published: boolean;
    publishedAt?: string;
    featured: boolean;
    tags: string[];
    readingTime?: number;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    createdAt: string;
    updatedAt: string;
}

export default function BlogCMS() {
    const router = useRouter();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeFilter, setActiveFilter] = useState<"all" | "published" | "draft" | "featured">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [editorTab, setEditorTab] = useState<"content" | "seo" | "settings">("content");
    const [tagInput, setTagInput] = useState("");

    // Refs for Advanced Media & Typography
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // Safety Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
    const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        let filtered = posts;
        if (activeFilter === "published") {
            filtered = filtered.filter(post => post.published);
        } else if (activeFilter === "draft") {
            filtered = filtered.filter(post => !post.published);
        } else if (activeFilter === "featured") {
            filtered = filtered.filter(post => post.featured);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.excerpt?.toLowerCase().includes(query) ||
                post.category.toLowerCase().includes(query)
            );
        }
        setFilteredPosts(filtered);
    }, [posts, activeFilter, searchQuery]);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/blog");
            if (!res.ok) throw new Error(`Failed to fetch posts: ${res.statusText}`);
            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setEditingPost({
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            category: "General",
            published: false,
            featured: false,
            tags: [],
            metaTitle: "",
            metaDescription: "",
            keywords: "",
        });
        setEditorTab("content");
        setIsEditorOpen(true);
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setEditorTab("content");
        setIsEditorOpen(true);
    };

    const confirmDelete = (post: BlogPost) => {
        setPostToDelete(post);
        setDeleteConfirmationInput("");
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!postToDelete || deleteConfirmationInput !== "delete-blog") return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/blog/${postToDelete.id}`, { method: "DELETE" });
            if (res.ok) {
                await fetchPosts();
                setIsDeleteModalOpen(false);
                setPostToDelete(null);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSave = async () => {
        if (!editingPost?.title || !editingPost?.content) {
            alert("Title and content are required");
            return;
        }

        setIsSaving(true);
        try {
            const url = editingPost.id ? `/api/blog/${editingPost.id}` : "/api/blog";
            const method = editingPost.id ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editingPost),
            });

            if (res.ok) {
                await fetchPosts();
                setIsEditorOpen(false);
                setEditingPost(null);
            } else {
                const error = await res.json();
                alert(error.error || "Failed to save post");
            }
        } catch (error) {
            console.error("Error saving post:", error);
            alert("Failed to save post");
        } finally {
            setIsSaving(false);
        }
    };

    const togglePublish = async (post: BlogPost) => {
        try {
            const res = await fetch(`/api/blog/${post.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...post, published: !post.published }),
            });
            if (res.ok) await fetchPosts();
        } catch (error) {
            console.error("Error toggling publish status:", error);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const addTag = () => {
        if (tagInput.trim() && editingPost && !editingPost.tags?.includes(tagInput.trim())) {
            setEditingPost({
                ...editingPost,
                tags: [...(editingPost.tags || []), tagInput.trim()]
            });
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        if (editingPost) {
            setEditingPost({
                ...editingPost,
                tags: editingPost.tags?.filter(t => t !== tag)
            });
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const { url } = await res.json();
                setEditingPost(prev => prev ? { ...prev, coverImage: url } : null);
            } else {
                alert("Failed to upload image");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image");
        }
    };

    const applyStyle = (style: "bold" | "italic" | "h1" | "h2" | "list" | "quote" | "code" | "underline" | "strike") => {
        if (!textAreaRef.current || !editingPost) return;

        const textarea = textAreaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = editingPost.content || "";
        const selectedText = text.substring(start, end);

        let styledText = "";
        let cursorOffset = 0;

        switch (style) {
            case "bold": styledText = `**${selectedText || "bold text"}**`; cursorOffset = 2; break;
            case "italic": styledText = `*${selectedText || "italic text"}*`; cursorOffset = 1; break;
            case "h1": styledText = `\n# ${selectedText || "Heading 1"}`; cursorOffset = 2; break;
            case "h2": styledText = `\n## ${selectedText || "Heading 2"}`; cursorOffset = 3; break;
            case "list": styledText = `\n- ${selectedText || "list item"}`; cursorOffset = 2; break;
            case "quote": styledText = `\n> ${selectedText || "quote"}`; cursorOffset = 2; break;
            case "code": styledText = `\`${selectedText || "code"}\``; cursorOffset = 1; break;
            case "underline": styledText = `<u>${selectedText || "underlined text"}</u>`; cursorOffset = 3; break;
            case "strike": styledText = `~~${selectedText || "strikethrough text"}~~`; cursorOffset = 2; break;
        }

        const newContent = text.substring(0, start) + styledText + text.substring(end);
        setEditingPost({ ...editingPost, content: newContent });

        // Restore focus and cursor position (delayed to allow state update)
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = selectedText ? start + styledText.length : start + cursorOffset;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="relative">
                    <div className="h-12 w-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
            {/* Ultra Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        <BarChart3 className="h-3 w-3" />
                        CMS Engine v2.0
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                        Editorial <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 font-black">Studio</span>
                    </h1>
                    <p className="text-gray-500 max-w-lg text-lg">
                        Manage your enterprise blog content with state-of-the-art SEO tools and real-time publishing controls.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCreateNew}
                        className="group relative px-8 py-4 bg-gray-900 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-gray-900/20 hover:shadow-black/30 transition-all hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center gap-3">
                            <Plus className="h-6 w-6 stroke-[3px]" />
                            Craft New Post
                        </span>
                    </button>
                </div>
            </div>

            {/* Smart Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Volume", value: posts.length, icon: Layout, color: "blue" },
                    { label: "Active Live", value: posts.filter(p => p.published).length, icon: Globe, color: "green" },
                    { label: "In Curation", value: posts.filter(p => !p.published).length, icon: Edit, color: "orange" },
                    { label: "Featured Post", value: posts.filter(p => p.featured).length, icon: Star, color: "purple" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{stat.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Advanced Filters Bar */}
            <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-gray-200 shadow-xl flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    {[
                        { id: "all", label: "All Content" },
                        { id: "published", label: "Published" },
                        { id: "draft", label: "Curation" },
                        { id: "featured", label: "Featured" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveFilter(tab.id as any)}
                            className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeFilter === tab.id
                                ? "bg-white text-gray-900 shadow-sm ring-1 ring-gray-100"
                                : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Scan archives by title, tags or content..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium text-gray-700"
                    />
                </div>
            </div>

            {/* Dynamic Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredPosts.map((post, index) => (
                        <motion.div
                            layout
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="bg-white group rounded-[2.5rem] border border-gray-100 p-8 hover:shadow-2xl hover:shadow-purple-500/10 transition-all cursor-pointer overflow-hidden relative"
                            onClick={() => handleEdit(post)}
                        >
                            {post.featured && (
                                <div className="absolute top-0 right-0 px-6 py-2 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-3xl">
                                    Promoted Content
                                </div>
                            )}

                            <div className="flex flex-col gap-8">
                                <div className="flex gap-8">
                                    <div className="w-40 h-40 rounded-[2rem] bg-gray-50 flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden shadow-inner">
                                        {post.coverImage ? (
                                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                                                <ImageIcon className="h-10 w-10 text-gray-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <Edit className="text-white h-8 w-8" />
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${post.published ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                                                    }`}>
                                                    {post.published ? "Live Now" : "Review Required"}
                                                </span>
                                                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    {post.category}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-purple-600 transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-500 line-clamp-2 text-sm leading-relaxed">
                                                {post.excerpt || "No description provided for this editorial piece..."}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {post.tags?.slice(0, 3).map((tag, i) => (
                                                <span key={i} className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md font-bold">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-[10px] font-bold text-purple-600">
                                                {post.author.charAt(0)}
                                            </div>
                                            <span className="text-xs font-black text-gray-900">{post.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Clock className="h-3.5 w-3.5" />
                                            <span className="text-[10px] font-bold">{post.readingTime}m read</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span className="text-[10px] font-bold">{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                                            className="p-3 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all"
                                            title="View Live"
                                        >
                                            <ExternalLink className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => togglePublish(post)}
                                            className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-2xl transition-all"
                                            title={post.published ? "Draft Mode" : "Go Live"}
                                        >
                                            {post.published ? <FileText className="h-5 w-5" /> : <Send className="h-5 w-5" />}
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(post)}
                                            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                                            title="Archive"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* State-of-the-Art Fullscreen Editor */}
            <AnimatePresence>
                {isEditorOpen && editingPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-3xl z-[100] flex items-center justify-center lg:p-12"
                    >
                        <motion.div
                            initial={{ y: 100, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 100, opacity: 0, scale: 0.95 }}
                            className="bg-white w-full h-full lg:rounded-[3rem] shadow-4xl flex flex-col overflow-hidden relative border border-white/20"
                        >
                            {/* Editor Header */}
                            <div className="flex items-center justify-between px-10 py-8 border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                                <div className="flex items-center gap-6">
                                    <button
                                        onClick={() => setIsEditorOpen(false)}
                                        className="p-4 hover:bg-gray-100 rounded-3xl transition-all"
                                    >
                                        <ArrowLeft className="h-6 w-6 stroke-[3px]" />
                                    </button>
                                    <div>
                                        <div className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] mb-1">Editorial Workbench</div>
                                        <h2 className="text-3xl font-black text-gray-900 leading-tight">
                                            {editingPost.title || "Untitled Masterpiece"}
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => window.open(`/blog/preview?id=${editingPost.id || 'new'}`, '_blank')}
                                        className="px-6 py-4 border border-gray-200 text-gray-600 rounded-2xl text-sm font-black hover:bg-gray-50 transition-all flex items-center gap-2"
                                    >
                                        <Eye className="h-5 w-5" />
                                        Preview
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="group relative px-10 py-4 bg-gray-900 text-white rounded-2xl text-sm font-black shadow-2xl shadow-gray-900/30 hover:shadow-black/40 transition-all hover:-translate-y-1 disabled:opacity-50 flex items-center gap-3"
                                    >
                                        {isSaving ? (
                                            <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Save className="h-5 w-5 stroke-[2.5px]" />
                                        )}
                                        {editingPost.id ? "Apply Changes" : "Publish Masterpiece"}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-1 overflow-hidden">
                                {/* Side Control Bar */}
                                <div className="w-24 border-r border-gray-100 flex flex-col items-center py-10 gap-8 bg-gray-50/50">
                                    {[
                                        { id: "content", icon: Layout, label: "Canvas" },
                                        { id: "seo", icon: Globe, label: "SEO Orbit" },
                                        { id: "settings", icon: Settings, label: "Config" }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setEditorTab(tab.id as any)}
                                            className={`group relative p-4 rounded-3xl transition-all ${editorTab === tab.id
                                                ? "bg-white text-purple-600 shadow-xl shadow-purple-500/10 ring-1 ring-purple-100"
                                                : "text-gray-400 hover:text-gray-900 hover:bg-white"
                                                }`}
                                        >
                                            <tab.icon className="h-8 w-8 stroke-[2px]" />
                                            <div className="absolute left-full ml-6 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                                {tab.label}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Content Workbench */}
                                <div className="flex-1 overflow-y-auto bg-gray-50/20 px-12 py-12 scroll-smooth">
                                    <AnimatePresence mode="wait">
                                        {editorTab === "content" && (
                                            <motion.div
                                                key="canvas"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="max-w-4xl mx-auto space-y-12"
                                            >
                                                {/* Hero Configuration */}
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="relative group rounded-[3rem] overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 h-[400px] flex items-center justify-center cursor-pointer transition-all hover:border-purple-300 hover:bg-purple-50/30"
                                                >
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                    />
                                                    {editingPost.coverImage ? (
                                                        <img src={editingPost.coverImage} className="absolute inset-0 w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-center space-y-4">
                                                            <div className="p-6 bg-white rounded-full shadow-2xl inline-block">
                                                                <Plus className="h-10 w-10 text-purple-600 stroke-[3px]" />
                                                            </div>
                                                            <div className="text-lg font-black text-gray-900">Stage Cover Cinematic</div>
                                                            <p className="text-sm text-gray-500">Click to upload from device or paste URL below</p>
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-10 left-10 right-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                        <input
                                                            type="text"
                                                            className="flex-1 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl font-mono text-xs border border-white/50"
                                                            placeholder="Or paste Image URL Source..."
                                                            value={editingPost.coverImage || ""}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                                                        />
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                fileInputRef.current?.click();
                                                            }}
                                                            className="bg-purple-600 text-white p-4 rounded-2xl shadow-2xl hover:bg-purple-700 transition-all"
                                                        >
                                                            <ImageIcon className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <textarea
                                                        value={editingPost.title || ""}
                                                        onChange={(e) => {
                                                            const title = e.target.value;
                                                            setEditingPost({
                                                                ...editingPost,
                                                                title,
                                                                slug: editingPost.id ? editingPost.slug : generateSlug(title),
                                                                metaTitle: title
                                                            });
                                                        }}
                                                        className="w-full bg-transparent border-none text-6xl font-black text-gray-900 focus:ring-0 p-0 placeholder:text-gray-200 resize-none leading-[1.1]"
                                                        placeholder="Vibrant Headline..."
                                                        rows={2}
                                                    />
                                                    <div className="flex items-center gap-4 pb-8 border-b border-gray-100">
                                                        <div className="flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-2xl text-xs font-black">
                                                            <Clock className="h-4 w-4" />
                                                            {editingPost.readingTime || 1} Minute Read
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl text-xs font-black">
                                                            <ChevronRight className="h-4 w-4" />
                                                            {editingPost.slug || "auto-slug"}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-8">
                                                    <div className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                                                        <Type className="h-8 w-8 text-blue-600 mt-1" />
                                                        <div className="flex-1">
                                                            <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Executive Summary</div>
                                                            <textarea
                                                                value={editingPost.excerpt || ""}
                                                                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                                                                rows={2}
                                                                className="w-full bg-transparent border-none text-blue-900 font-bold text-lg focus:ring-0 p-0 placeholder:text-blue-200 resize-none"
                                                                placeholder="The spark notes of your masterpiece (SEO excerpt)..."
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Narrative Canvas</div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Pro Tip: </span>
                                                                <span className="text-[10px] font-bold text-gray-400">Toolbar styling is fully operational</span>
                                                            </div>
                                                        </div>

                                                        {/* Advanced Typography Toolbar */}
                                                        <div className="flex flex-wrap items-center gap-1 p-2 bg-white border border-gray-100 rounded-2xl shadow-sm mb-2 sticky top-0 z-20">
                                                            {[
                                                                { id: "bold", icon: Bold, label: "Bold", action: () => applyStyle("bold") },
                                                                { id: "italic", icon: Italic, label: "Italic", action: () => applyStyle("italic") },
                                                                { id: "underline", icon: Underline, label: "Underline", action: () => applyStyle("underline") },
                                                                { id: "strike", icon: Strikethrough, label: "Strikethrough", action: () => applyStyle("strike") },
                                                                { type: "separator" },
                                                                { id: "h1", icon: Heading1, label: "H1", action: () => applyStyle("h1") },
                                                                { id: "h2", icon: Heading2, label: "H2", action: () => applyStyle("h2") },
                                                                { type: "separator" },
                                                                { id: "list", icon: List, label: "List", action: () => applyStyle("list") },
                                                                { id: "quote", icon: Quote, label: "Quote", action: () => applyStyle("quote") },
                                                                { id: "code", icon: Code, label: "Code", action: () => applyStyle("code") },
                                                                { id: "link", icon: LinkIcon, label: "Link", action: () => applyStyle("bold") }, // Reusing bold for now as placeholder for link logic
                                                            ].map((tool, i) => {
                                                                if (tool.type === "separator") {
                                                                    return <div key={i} className="w-px h-6 bg-gray-100 mx-1" />;
                                                                }
                                                                const Icon = tool.icon as any;
                                                                return (
                                                                    <button
                                                                        key={tool.id}
                                                                        onClick={(tool as any).action}
                                                                        className="p-2.5 hover:bg-gray-50 rounded-xl text-gray-500 hover:text-purple-600 transition-all tooltip-trigger relative group/tool"
                                                                        title={tool.label}
                                                                    >
                                                                        <Icon className="h-4 w-4" />
                                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover/tool:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                                                            {tool.label}
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>

                                                        <textarea
                                                            ref={textAreaRef}
                                                            value={editingPost.content || ""}
                                                            onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                                                            rows={20}
                                                            className="w-full px-8 py-8 bg-white border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-purple-500/10 focus:border-purple-200 transition-all text-xl font-medium text-gray-700 leading-relaxed shadow-sm min-h-[600px]"
                                                            placeholder="Let the storytelling begin..."
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {editorTab === "seo" && (
                                            <motion.div
                                                key="seo"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="max-w-4xl mx-auto space-y-12"
                                            >
                                                <div className="space-y-4">
                                                    <h3 className="text-4xl font-black text-gray-900 tracking-tight">Search Engine <span className="text-purple-600">Optimization</span></h3>
                                                    <p className="text-gray-500 text-lg">Define how your content appears to the global discovery algorithms.</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-gray-900 uppercase tracking-widest ml-1">Meta Identity Title</label>
                                                            <input
                                                                type="text"
                                                                value={editingPost.metaTitle || ""}
                                                                onChange={(e) => setEditingPost({ ...editingPost, metaTitle: e.target.value })}
                                                                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-bold text-gray-800"
                                                                placeholder="Override automatic SEO title..."
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-gray-900 uppercase tracking-widest ml-1">Keywords Orbit</label>
                                                            <input
                                                                type="text"
                                                                value={editingPost.keywords || ""}
                                                                onChange={(e) => setEditingPost({ ...editingPost, keywords: e.target.value })}
                                                                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-mono text-xs"
                                                                placeholder="comma, separated, semantic, keys"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-black text-gray-900 uppercase tracking-widest ml-1">Universal Meta Description</label>
                                                            <textarea
                                                                value={editingPost.metaDescription || ""}
                                                                onChange={(e) => setEditingPost({ ...editingPost, metaDescription: e.target.value })}
                                                                rows={5}
                                                                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all font-medium text-gray-700 resize-none"
                                                                placeholder="Maximum Impact for Search Result Snippets (160 characters suggested)..."
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Google Search Preview */}
                                                <div className="bg-gray-100 p-8 rounded-[3rem] space-y-4">
                                                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Algorithm Simulation Preview</div>
                                                    <div className="bg-white p-8 rounded-[2rem] shadow-xl max-w-2xl border border-white">
                                                        <div className="text-[10px] text-gray-500 mb-1">hybridpos.pk &gt; blog &gt; {editingPost.slug || "slug"}</div>
                                                        <div className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer mb-2">
                                                            {editingPost.metaTitle || editingPost.title || "Search Result Title Preview"}
                                                        </div>
                                                        <div className="text-sm text-[#4d5156] leading-relaxed">
                                                            <span className="text-gray-400">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} — </span>
                                                            {editingPost.metaDescription || editingPost.excerpt || "Description appearing in search results... Craft a compelling summary to drive higher engagement."}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {editorTab === "settings" && (
                                            <motion.div
                                                key="settings"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="max-w-4xl mx-auto space-y-12"
                                            >
                                                <div className="space-y-4">
                                                    <h3 className="text-4xl font-black text-gray-900 tracking-tight">Post <span className="text-indigo-600">Dynamics</span></h3>
                                                    <p className="text-gray-500 text-lg">Configure categorization, lifecycle events, and global status.</p>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                    <div className="col-span-2 space-y-8">
                                                        <div className="space-y-4">
                                                            <label className="text-xs font-black text-gray-900 uppercase tracking-widest ml-1 flex items-center gap-2">
                                                                <Tag className="h-3 w-3" />
                                                                Semantic Tags
                                                            </label>
                                                            <div className="flex flex-wrap gap-3 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[120px]">
                                                                {editingPost.tags?.map((tag, i) => (
                                                                    <div key={i} className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-2xl text-xs font-black group">
                                                                        {tag}
                                                                        <button onClick={() => removeTag(tag)} className="group-hover:text-red-400 transition-colors">
                                                                            <X className="h-3.5 w-3.5" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                <input
                                                                    type="text"
                                                                    value={tagInput}
                                                                    onChange={(e) => setTagInput(e.target.value)}
                                                                    onKeyDown={(e) => e.key === "Enter" && addTag()}
                                                                    placeholder="+ Add Tag..."
                                                                    className="border-none focus:ring-0 text-sm font-bold bg-transparent flex-1"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <label className="text-xs font-black text-gray-900 uppercase tracking-widest ml-1">Classification Area</label>
                                                            <div className="grid grid-cols-3 gap-3">
                                                                {["Engineering", "Product", "News", "Tutorial", "Enterprise", "Retail"].map((cat) => (
                                                                    <button
                                                                        key={cat}
                                                                        onClick={() => setEditingPost({ ...editingPost, category: cat })}
                                                                        className={`px-4 py-3 rounded-2xl text-xs font-black border transition-all ${editingPost.category === cat
                                                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/20"
                                                                            : "bg-white text-gray-500 border-gray-100 hover:border-indigo-200"
                                                                            }`}
                                                                    >
                                                                        {cat}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6">
                                                        <div className={`p-6 rounded-[2.5rem] border-2 transition-all ${editingPost.published ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="text-xs font-black uppercase tracking-widest text-gray-500">Live Status</div>
                                                                <div className={`h-2.5 w-2.5 rounded-full ${editingPost.published ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-gray-300'}`} />
                                                            </div>
                                                            <button
                                                                onClick={() => setEditingPost({ ...editingPost, published: !editingPost.published })}
                                                                className={`w-full py-4 rounded-2xl text-sm font-black transition-all ${editingPost.published
                                                                    ? "bg-white text-emerald-600 shadow-sm"
                                                                    : "bg-gray-900 text-white shadow-xl"
                                                                    }`}
                                                            >
                                                                {editingPost.published ? "Take Down" : "Push Live"}
                                                            </button>
                                                        </div>

                                                        <div className={`p-6 rounded-[2.5rem] border-2 transition-all ${editingPost.featured ? 'bg-purple-50 border-purple-100' : 'bg-gray-50 border-gray-100'}`}>
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="text-xs font-black uppercase tracking-widest text-gray-500">Promoted Status</div>
                                                                {editingPost.featured && <Star className="h-4 w-4 text-purple-600 fill-purple-600" />}
                                                            </div>
                                                            <button
                                                                onClick={() => setEditingPost({ ...editingPost, featured: !editingPost.featured })}
                                                                className={`w-full py-4 rounded-2xl text-sm font-black transition-all ${editingPost.featured
                                                                    ? "bg-white text-purple-600 shadow-sm"
                                                                    : "bg-gray-900 text-white shadow-xl"
                                                                    }`}
                                                            >
                                                                {editingPost.featured ? "Un-feature" : "Promote Post"}
                                                            </button>
                                                        </div>

                                                        <div className="p-6 rounded-[2.5rem] bg-indigo-50 border-2 border-indigo-100 space-y-4">
                                                            <div className="text-xs font-black uppercase tracking-widest text-indigo-600">Timestamp Registry</div>
                                                            <div className="space-y-2">
                                                                <div className="text-[10px] text-indigo-400 font-bold uppercase">Created On</div>
                                                                <div className="text-sm font-black text-indigo-900">{editingPost.createdAt ? new Date(editingPost.createdAt).toLocaleDateString() : 'Now'}</div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="text-[10px] text-indigo-400 font-bold uppercase">Last Synthesis</div>
                                                                <div className="text-sm font-black text-indigo-900">{editingPost.updatedAt ? new Date(editingPost.updatedAt).toLocaleTimeString() : 'Pending'}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Secure Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && postToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white max-w-md w-full rounded-[2.5rem] p-10 shadow-4xl border border-gray-100"
                        >
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-600 mb-2">
                                    <Trash2 className="h-10 w-10 stroke-[2.5px]" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-900">Secure Deletion</h3>
                                    <p className="text-gray-500 text-sm">
                                        You are about to permanently delete <span className="font-bold text-gray-900">"{postToDelete.title}"</span>. This action cannot be undone.
                                    </p>
                                </div>

                                <div className="w-full space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left block ml-1">
                                            Type <span className="text-red-600">delete-blog</span> to confirm
                                        </label>
                                        <input
                                            type="text"
                                            value={deleteConfirmationInput}
                                            onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                                            placeholder="Enter confirmation text..."
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-red-500 focus:bg-white rounded-2xl transition-all font-mono text-sm text-center"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleDelete}
                                            disabled={deleteConfirmationInput !== "delete-blog" || isDeleting}
                                            className="w-full py-4 bg-red-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-red-600/20 hover:bg-red-700 disabled:opacity-30 disabled:grayscale transition-all flex items-center justify-center gap-2"
                                        >
                                            {isDeleting ? (
                                                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                "Confirm Permanent Deletion"
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsDeleteModalOpen(false);
                                                setPostToDelete(null);
                                            }}
                                            className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl text-sm font-black hover:bg-gray-200 transition-all"
                                        >
                                            Cancel & Retain Post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
