import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
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
        const { status, response } = body;

        const existingRequest = await prisma.featureRequest.findUnique({
            where: { id },
        });

        if (!existingRequest) {
            return NextResponse.json({ error: "Feature request not found" }, { status: 404 });
        }

        const updatedRequest = await prisma.featureRequest.update({
            where: { id },
            data: {
                status,
                response,
            },
        });

        // Simulating email
        if (response) {
            console.log(`[SIMULATED EMAIL] To: ${existingRequest.email} | Content: ${response}`);
        }

        return NextResponse.json(updatedRequest);
    } catch (error) {
        console.error("Error updating feature request:", error);
        return NextResponse.json(
            { error: "Failed to update feature request" },
            { status: 500 }
        );
    }
}
