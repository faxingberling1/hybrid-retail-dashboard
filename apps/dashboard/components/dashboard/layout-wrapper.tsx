"use client"

import { ReactNode } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Sidebar } from "./sidebar"
import { DashboardHeader } from "./header"

interface LayoutWrapperProps {
  children: ReactNode
  requiredRole?: string | string[]
}

export function LayoutWrapper({ children, requiredRole }: LayoutWrapperProps) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    redirect("/login")
  }

  const userRole = session.user?.role as string

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    if (!roles.includes(userRole)) {
      redirect("/unauthorized")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={userRole} />
      <div className="lg:pl-64 flex flex-col flex-1">
        <DashboardHeader />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}