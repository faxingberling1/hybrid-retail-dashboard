"use client"

import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

interface BillingStatsProps {
  totalRevenue: string
  pendingPayments: string
  overduePayments: string
  monthlyGrowth: number
}

export function BillingStats({ 
  totalRevenue, 
  pendingPayments, 
  overduePayments, 
  monthlyGrowth 
}: BillingStatsProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Billing Overview</h3>
          <p className="text-purple-200 text-sm">This month's financial summary</p>
        </div>
        <DollarSign className="h-8 w-8 text-purple-200" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-purple-200">Total Revenue</div>
            <div className="text-2xl font-bold">{totalRevenue}</div>
          </div>
          <div className="flex items-center text-green-300">
            {monthlyGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="text-sm font-medium">{Math.abs(monthlyGrowth)}%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs text-purple-200 mb-1">Pending</div>
            <div className="text-sm font-semibold">{pendingPayments}</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-xs text-purple-200 mb-1">Overdue</div>
            <div className="text-sm font-semibold">{overduePayments}</div>
          </div>
        </div>
      </div>
      
      <Link 
        href="/super-admin/billing"
        className="mt-6 block w-full py-2 text-center text-sm font-medium bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
      >
        View Billing Details
      </Link>
    </div>
  )
}