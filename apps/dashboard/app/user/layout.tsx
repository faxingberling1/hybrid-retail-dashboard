"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { UserSidebar } from "@/components/dashboard/user-sidebar"
import { UserHeader } from "@/components/dashboard/user-header"

export default function UserLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔍 User Layout - Session status:", status)

    if (status === "loading") {
      return
    }

    if (status === "unauthenticated" || !session) {
      console.log("❌ User Layout - No session, redirecting to login")
      router.push("/login")
      return
    }

    if (status === "authenticated" && session.user) {
      console.log("✅ User Layout - User authenticated:", session.user.email)

      if (session.user.role !== "USER") {
        console.log("⛔ User Layout - Wrong role, redirecting")
        router.push("/unauthorized")
      } else {
        console.log("✅ User Layout - Role verified")
        setLoading(false)
      }
    }
  }, [session, status, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading POS system...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || !session) {
    return null
  }

  if (session.user?.role !== "USER") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <UserSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <UserHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}