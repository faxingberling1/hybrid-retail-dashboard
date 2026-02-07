import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/blog - Fetch all blog posts
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const publishedOnly = searchParams.get("published") === "true";

        const where = publishedOnly ? { published: true } : {};

        const posts = await prisma.blogPost.findMany({
            where,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog posts" },
            { status: 500 }
        );
    }
}

// POST /api/blog - Create new blog post
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is super admin
        const userRole = session.user.role?.toUpperCase();
        if (userRole !== "SUPER_ADMIN" && userRole !== "SUPERADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const {
            title, slug, excerpt, content, coverImage,
            category, published, featured, tags,
            metaTitle, metaDescription, keywords
        } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: "Title and content are required" },
                { status: 400 }
            );
        }

        // Generate slug if not provided
        const finalSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        // Simple reading time calculation (avg 200 words per minute)
        const words = content.trim().split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(words / 200));

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug: finalSlug,
                excerpt,
                content,
                coverImage,
                category: category || "General",
                author: session.user.name || session.user.email || "Admin",
                authorId: session.user.id,
                published: published || false,
                publishedAt: published ? new Date() : null,
                featured: featured || false,
                tags: tags || [],
                readingTime,
                metaTitle,
                metaDescription,
                keywords,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error: any) {
        console.error("Error creating blog post:", error);

        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "A post with this slug already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create blog post" },
            { status: 500 }
        );
    }
}
