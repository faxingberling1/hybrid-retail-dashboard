"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { ShoppingCart, Users, Receipt, DollarSign, CreditCard } from "lucide-react"

// Components
import { UserStats } from "@/components/dashboard/user/user-stats"
import { QuickActions } from "@/components/dashboard/user/quick-actions"
import { CalculatorWidget } from "@/components/dashboard/user/calculator-widget"
import { POSInterface } from "@/components/dashboard/user/pos-interface"
import { RecentTransactions } from "@/components/dashboard/user/recent-transactions"
import { UserDashboardHeader } from "@/components/dashboard/user/dashboard-header"

export default function UserPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('pos')

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated" && session?.user) {
      if (session.user.role !== "USER") {
        router.push("/unauthorized")
      }
    }
  }, [session, status, router])

  const todayStats = [
    { title: "Today's Sales", value: "₨ 42,500", change: "+18%", icon: <DollarSign className="h-5 w-5" /> },
    { title: "Transactions", value: "24", change: "+12%", icon: <ShoppingCart className="h-5 w-5" /> },
    { title: "Customers", value: "18", change: "+8%", icon: <Users className="h-5 w-5" /> },
    { title: "Avg. Ticket", value: "₨ 1,770", change: "+5%", icon: <CreditCard className="h-5 w-5" /> },
  ]

  const tabs = [
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'customers', label: 'Customers', icon: Users },
  ]

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
    router.refresh()
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading user dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated" || !session) {
    return null
  }

  if (session.user?.role !== "USER") {
    return null // already handled in useEffect, preventing flash
  }

  return (
    <div className="min-h-screen bg-white space-y-6 p-4 md:p-6">
      {/* Header */}
      <UserDashboardHeader
        user={session.user}
        isLoading={isLoading}
        onSync={() => setIsLoading(true)}
        onLogout={handleLogout}
      />

      {/* Today's Stats */}
      <UserStats stats={todayStats} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions />
          <CalculatorWidget />
        </div>

        {/* Right Column - POS Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-2" />
                        {tab.label}
                      </div>
                    </button>
                  )
                })}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'pos' && <POSInterface />}
              {activeTab === 'transactions' && <RecentTransactions />}
              {activeTab === 'customers' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Customer Management</h2>
                  <p className="text-gray-500">Customer management module coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 py-4">
        <p>POS System • Terminal #01 • Staff: {session.user?.name}</p>
        <p className="mt-1">Shift started: 9:00 AM • Status: <span className="text-green-600 font-medium">Active</span></p>
      </div>
    </div>
  )
}
