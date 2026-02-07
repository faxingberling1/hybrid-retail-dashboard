"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Calendar, Tag, ArrowRight } from "lucide-react";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    category: string;
    author: string;
    publishedAt: string;
    featured: boolean;
    readingTime?: number;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    const featuredPosts = posts.filter(post => post.featured);
    const regularPosts = posts.filter(post => !post.featured);

    useEffect(() => {
        fetchPosts();

        // Auto-refresh every 30 seconds for real-time sync
        const interval = setInterval(() => {
            fetchPosts();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch("/api/blog?published=true");
            const data = await res.json();
            setPosts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching blog posts:", error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-blue-500/10 dark:selection:bg-blue-500/20 transition-colors duration-500">
            <SiteHeader />

            <main className="pt-48 pb-32 px-6">
                <div className="max-w-7xl mx-auto text-center mb-32 space-y-8">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-400 dark:text-slate-400 shadow-sm backdrop-blur-sm"
                    >
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-600 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">The Editorial Hub</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-7xl md:text-9xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85]"
                    >
                        Terminal <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 font-black">Insights</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
                    >
                        Deep technical analysis, product updates, and the future of retail infrastructure.
                    </motion.p>
                </div>

                {loading ? (
                    <div className="max-w-7xl mx-auto text-center py-20">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                        <p className="mt-4 text-slate-500">Synchronizing Archives...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="max-w-7xl mx-auto text-center py-20">
                        <p className="text-slate-500 text-lg">Our editors are currently crafting new pieces. Check back shortly.</p>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto space-y-32">
                        {/* Spotlight Section (Featured) */}
                        {featuredPosts.length > 0 && (
                            <section className="space-y-12">
                                <div className="flex items-end justify-between border-b border-slate-100 dark:border-white/5 pb-8">
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Selected Curations</div>
                                        <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Editorial <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Spotlight</span></h2>
                                    </div>
                                    <p className="text-sm text-slate-500 max-w-xs text-right italic font-medium">
                                        Hand-picked analysis from our engineering and product leadership.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-12">
                                    {featuredPosts.map((post, i) => (
                                        <motion.article
                                            key={post.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="group relative flex flex-col lg:flex-row gap-12 bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden hover:shadow-4xl transition-all duration-700 border border-slate-100 dark:border-white/5"
                                        >
                                            <div className="w-full lg:w-3/5 h-[500px] relative overflow-hidden">
                                                {post.coverImage ? (
                                                    <img
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-purple-500/10 to-indigo-500/10 flex items-center justify-center">
                                                        <span className="text-9xl font-black text-slate-100 dark:text-white/5">{post.title.charAt(0)}</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-8 left-8">
                                                    <span className="px-6 py-2 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl">
                                                        Editor's Choice
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="w-full lg:w-2/5 p-12 lg:p-16 flex flex-col justify-center space-y-8">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4 text-xs font-black text-purple-600 uppercase tracking-widest">
                                                        <span>{post.category}</span>
                                                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                                                        <span className="text-slate-400">{post.readingTime || 5} Min Read</span>
                                                    </div>
                                                    <h3 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] group-hover:text-purple-600 transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-4">
                                                        {post.excerpt || post.content.substring(0, 250) + "..."}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-black text-xs">
                                                            {post.author.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-black text-slate-900 dark:text-white">{post.author}</div>
                                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                                {new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        className="h-12 w-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center group/btn hover:bg-purple-600 dark:hover:bg-purple-400 transition-all shadow-xl"
                                                    >
                                                        <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.article>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Archive grid */}
                        <section className="space-y-12">
                            <div className="flex items-end justify-between border-b border-slate-100 dark:border-white/5 pb-8">
                                <div className="space-y-4">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comprehensive Archives</div>
                                    <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Latest <span className="text-slate-400 italic">Dispatches</span></h2>
                                </div>
                                <div className="hidden md:flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-1 rounded-2xl border border-slate-100 dark:border-white/5">
                                    <button className="px-6 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-xs font-black shadow-sm ring-1 ring-slate-100 dark:ring-white/10 transition-all">All Pieces</button>
                                    <button className="px-6 py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all text-xs font-black">Technical</button>
                                    <button className="px-6 py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all text-xs font-black">Infrastructure</button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                                {regularPosts.map((post, i) => (
                                    <motion.article
                                        key={post.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
                                    >
                                        <Link href={`/blog/${post.slug}`} className="relative h-64 overflow-hidden block">
                                            {post.coverImage ? (
                                                <img
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-white/5 group-hover:bg-slate-100 dark:group-hover:bg-white/10 transition-colors">
                                                    <span className="text-7xl font-black text-slate-100 dark:text-white/5">{post.title.charAt(0)}</span>
                                                </div>
                                            )}
                                            <div className="absolute top-6 left-6 flex gap-2">
                                                <span className="px-4 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm">
                                                    {post.category}
                                                </span>
                                            </div>
                                        </Link>

                                        <div className="p-10 flex flex-col flex-1">
                                            <div className="space-y-4 mb-8 flex-1">
                                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                                    <span className="h-1 w-1 rounded-full bg-slate-200" />
                                                    <span>{post.readingTime || 3}m read</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                                                    {post.title}
                                                </h3>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                                                    {post.excerpt || post.content.substring(0, 150) + "..."}
                                                </p>
                                            </div>

                                            <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-black text-slate-500">
                                                        {post.author.charAt(0)}
                                                    </div>
                                                    <span className="text-[11px] font-black text-slate-900 dark:text-white">{post.author}</span>
                                                </div>
                                                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </main>

            <SiteFooter />
        </div>
    );
}
