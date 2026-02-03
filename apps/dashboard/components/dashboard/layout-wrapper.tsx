"use client"

import { ReactNode } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

// Import all different headers and sidebars as named exports
import { SuperAdminSidebar } from "./super-admin-sidebar"
import { AdminSidebar } from "./admin-sidebar"
import { UserSidebar } from "./user-sidebar"

import { SuperAdminHeader } from "./super-admin-header"
import { AdminHeader } from "./admin-header"
import { UserHeader } from "./user-header"

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

  // Select the appropriate sidebar and header based on role
  const getSidebarComponent = () => {
    switch(userRole) {
      case 'SUPER_ADMIN':
        return <SuperAdminSidebar />
      case 'ADMIN':
        return <AdminSidebar />
      case 'USER':
        return <UserSidebar />
      default:
        return <UserSidebar /> // fallback
    }
  }

  const getHeaderComponent = () => {
    switch(userRole) {
      case 'SUPER_ADMIN':
        return <SuperAdminHeader />
      case 'ADMIN':
        return <AdminHeader />
      case 'USER':
        return <UserHeader />
      default:
        return <UserHeader /> // fallback
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {getSidebarComponent()}
      <div className="lg:pl-64 flex flex-col flex-1">
        {getHeaderComponent()}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}