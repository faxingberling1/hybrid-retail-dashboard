// components/dashboard/DashboardContent.tsx
"use client";

import { UserRole } from "@/types";

interface DashboardContentProps {
  userRole: UserRole;
}

export default function DashboardContent({ userRole }: DashboardContentProps) {
  // Super Admin sees everything
  if (userRole === "SUPER_ADMIN") {
    return (
      <div>
        <SuperAdminStats />
        <AllOrganizationsTable />
        <SystemHealthMonitor />
        <BillingOverview />
      </div>
    );
  }
  
  // Admin sees organization-level data
  if (userRole === "ADMIN") {
    return (
      <div>
        <StoreStats />
        <SalesChart />
        <InventoryAlerts />
        <EmployeePerformance />
      </div>
    );
  }
  
  // Staff sees limited data
  return (
    <div>
      <TodaySales />
      <QuickActions />
      <RecentTransactions />
    </div>
  );
}