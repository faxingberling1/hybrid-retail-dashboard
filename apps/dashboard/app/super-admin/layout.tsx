"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { SuperAdminSidebar } from "@/components/dashboard/super-admin-sidebar"
import { SuperAdminHeader } from "@/components/dashboard/super-admin-header"

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔍 Super Admin Layout - Session status:", status)

    if (status === "loading") {
      return
    }

    if (status === "unauthenticated" || !session) {
      console.log("❌ Super Admin Layout - No session, redirecting to login")
      router.push("/login")
      return
    }

    if (status === "authenticated" && session.user) {
      console.log("✅ Super Admin Layout - User authenticated:", session.user.email)

      if (session.user.role !== "SUPER_ADMIN") {
        console.log("⛔ Super Admin Layout - Wrong role, redirecting")
        router.push("/unauthorized")
      } else {
        console.log("✅ Super Admin Layout - Role verified")
        setLoading(false)
      }
    }
  }, [session, status, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading platform dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || !session) {
    return null
  }

  if (session.user?.role !== "SUPER_ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <SuperAdminHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}