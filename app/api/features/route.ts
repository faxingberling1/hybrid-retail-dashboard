import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, title, description, importanceLevel } = body;

        if (!email || !title || !description || !importanceLevel) {
            return NextResponse.json(
                { error: "Email, title, description, and importance level are required" },
                { status: 400 }
            );
        }

        const featureRequest = await prisma.featureRequest.create({
            data: {
                email,
                title,
                description,
                importanceLevel,
                status: "PENDING"
            },
        });

        return NextResponse.json(featureRequest, { status: 201 });
    } catch (error) {
        console.error("Error creating feature request:", error);
        return NextResponse.json(
            { error: "Failed to submit feature request" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userRole = session.user.role?.toUpperCase();
        if (userRole !== "SUPER_ADMIN" && userRole !== "SUPERADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const requests = await prisma.featureRequest.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(requests);
    } catch (error) {
        console.error("Error fetching feature requests:", error);
        return NextResponse.json(
            { error: "Failed to fetch feature requests" },
            { status: 500 }
        );
    }
}
