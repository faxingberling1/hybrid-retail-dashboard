"use client"

import { useSession } from "next-auth/react"

export function DashboardFooter() {
    const { data: session } = useSession()

    return (
        <footer className="text-center text-sm text-gray-500 py-8 border-t border-gray-100 mt-12">
            <div className="max-w-7xl mx-auto px-4">
                <p>Store Admin Dashboard • Last updated: {new Date().toLocaleTimeString()}</p>
                <p className="mt-1">
                    Store: <span className="font-semibold">{session?.organizationName || "TechGadget Store"}</span> •
                    Location: <span className="font-medium">Karachi, Pakistan</span>
                </p>
                <p className="text-[10px] mt-4 uppercase tracking-[0.2em] opacity-40">
                    HybridPOS v1.0.4 • Core Node: Karachi (KHI-01)
                </p>
            </div>
        </footer>
    )
}
