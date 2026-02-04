"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔍 Admin Layout - Session status:", status)

    if (status === "loading") {
      return
    }

    if (status === "unauthenticated" || !session) {
      console.log("❌ Admin Layout - No session, redirecting to login")
      router.push("/login")
      return
    }

    if (status === "authenticated" && session.user) {
      console.log("✅ Admin Layout - User authenticated:", session.user.email)

      const allowedRoles = ["ADMIN", "SUPER_ADMIN", "SUPERADMIN"]
      const userRole = session.user.role?.toUpperCase()

      if (!allowedRoles.includes(userRole)) {
        console.log("⛔ Admin Layout - Forbidden role:", userRole)
        router.push("/unauthorized")
      } else {
        console.log("✅ Admin Layout - Role verified:", userRole)
        setLoading(false)
      }
    }
  }, [session, status, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading store dashboard...</p>
        </div>
      </div>
    )
  }

  const userRole = session?.user?.role?.toUpperCase()
  const isAllowed = ["ADMIN", "SUPER_ADMIN", "SUPERADMIN"].includes(userRole || "")

  if (!isAllowed) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}