import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/blog/[id] - Fetch single blog post
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const post = await prisma.blogPost.findUnique({
            where: { id },
        });

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return NextResponse.json(
            { error: "Failed to fetch blog post" },
            { status: 500 }
        );
    }
}

// PUT /api/blog/[id] - Update blog post
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

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

        const existingPost = await prisma.blogPost.findUnique({
            where: { id },
        });

        if (!existingPost) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        // Simple reading time calculation
        const words = content ? content.trim().split(/\s+/).length : (existingPost.content?.split(/\s+/).length || 0);
        const readingTime = Math.max(1, Math.ceil(words / 200));

        // If publishing for the first time, set publishedAt
        const publishedAt = published && !existingPost.published ? new Date() : existingPost.publishedAt;

        const post = await prisma.blogPost.update({
            where: { id },
            data: {
                title,
                slug,
                excerpt,
                content,
                coverImage,
                category,
                published,
                publishedAt,
                featured,
                tags,
                readingTime,
                metaTitle,
                metaDescription,
                keywords,
            },
        });

        return NextResponse.json(post);
    } catch (error: any) {
        console.error("Error updating blog post:", error);

        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "A post with this slug already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Failed to update blog post" },
            { status: 500 }
        );
    }
}

// DELETE /api/blog/[id] - Delete blog post
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = session.user.role?.toUpperCase();
        if (userRole !== "SUPER_ADMIN" && userRole !== "SUPERADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.blogPost.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting blog post:", error);
        return NextResponse.json(
            { error: "Failed to delete blog post" },
            { status: 500 }
        );
    }
}
