"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Calendar, Tag, ArrowLeft, User } from "lucide-react";
import Link from "next/link";

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
    createdAt: string;
}

export default function BlogPostPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            fetchPost();
        }
    }, [slug]);

    const fetchPost = async () => {
        try {
            // Fetch all published posts and find by slug
            const res = await fetch("/api/blog?published=true");
            if (!res.ok) {
                throw new Error("Failed to fetch post");
            }
            const posts = await res.json();
            const foundPost = Array.isArray(posts)
                ? posts.find((p: BlogPost) => p.slug === slug)
                : null;

            if (!foundPost) {
                setError("Post not found");
            } else {
                setPost(foundPost);
            }
        } catch (err) {
            console.error("Error fetching post:", err);
            setError("Failed to load post");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
                <SiteHeader />
                <div className="flex items-center justify-center h-screen">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
                <SiteHeader />
                <div className="flex flex-col items-center justify-center h-screen px-6">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
                        {error || "Post Not Found"}
                    </h1>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:gap-3 transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-blue-500/10 dark:selection:bg-blue-500/20 transition-colors duration-500">
            <SiteHeader />

            <main className="pt-32 pb-32 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all mb-8 hover:gap-3"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>

                    {/* Article Header */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                <span className="font-bold uppercase tracking-wider">{post.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{post.author}</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        {post.excerpt && (
                            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Cover Image */}
                        {post.coverImage && (
                            <div className="relative h-96 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {post.content}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-12 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                    Published on {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </div>
                                <Link
                                    href="/blog"
                                    className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400 hover:gap-3 transition-all"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    More Articles
                                </Link>
                            </div>
                        </div>
                    </motion.article>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
