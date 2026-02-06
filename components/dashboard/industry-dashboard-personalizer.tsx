"use client"

import React from "react"
import {
    Pill, ShoppingBag, Utensils, Stethoscope,
    GraduationCap, Home, Car, Factory,
    TrendingUp, Users, Package, AlertCircle,
    Activity, Calendar, CreditCard, ShoppingCart
} from "lucide-react"

interface IndustryDashboardPersonalizerProps {
    industry: string;
}

export default function IndustryDashboardPersonalizer({ industry }: IndustryDashboardPersonalizerProps) {
    // Normalize industry ID
    const industryId = industry?.toLowerCase() || 'fashion';

    const renderIndustryStats = () => {
        switch (industryId) {
            case 'pharmacy':
                return (
                    <>
                        <IndustryStatCard title="Prescriptions Filled" value="142" change="+12%" icon={<Pill className="h-5 w-5" />} color="bg-blue-100 text-blue-600" />
                        <IndustryStatCard title="Expiring Soon" value="28" change="-5%" icon={<AlertCircle className="h-5 w-5" />} color="bg-red-100 text-red-600" />
                        <IndustryStatCard title="Patient Visits" value="45" change="+8%" icon={<Users className="h-5 w-5" />} color="bg-green-100 text-green-600" />
                    </>
                )
            case 'fashion':
            case 'retail':
                return (
                    <>
                        <IndustryStatCard title="New Arrivals" value="84" change="+20%" icon={<ShoppingBag className="h-5 w-5" />} color="bg-pink-100 text-pink-600" />
                        <IndustryStatCard title="Total Inventory" value="1,240" change="+2%" icon={<Package className="h-5 w-5" />} color="bg-indigo-100 text-indigo-600" />
                        <IndustryStatCard title="Store Traffic" value="450" change="+15%" icon={<Activity className="h-5 w-5" />} color="bg-emerald-100 text-emerald-600" />
                    </>
                )
            case 'healthcare':
                return (
                    <>
                        <IndustryStatCard title="Appointments" value="18" change="+3" icon={<Calendar className="h-5 w-5" />} color="bg-red-100 text-red-600" />
                        <IndustryStatCard title="Active Patients" value="892" change="+12" icon={<Users className="h-5 w-5" />} color="bg-blue-100 text-blue-600" />
                        <IndustryStatCard title="Lab Results" value="34" change="Pending" icon={<Activity className="h-5 w-5" />} color="bg-amber-100 text-amber-600" />
                    </>
                )
            case 'restaurant':
                return (
                    <>
                        <IndustryStatCard title="Active Tables" value="12/20" change="60%" icon={<Utensils className="h-5 w-5" />} color="bg-orange-100 text-orange-600" />
                        <IndustryStatCard title="Avg Table Time" value="45m" change="-5m" icon={<Activity className="h-5 w-5" />} color="bg-emerald-100 text-emerald-600" />
                        <IndustryStatCard title="Online Orders" value="24" change="+18%" icon={<ShoppingCart className="h-5 w-5" />} color="bg-blue-100 text-blue-600" />
                    </>
                )
            default:
                return null;
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {renderIndustryStats()}
        </div>
    )
}

function IndustryStatCard({ title, value, change, icon, color }: any) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    {icon}
                </div>
                <div className="flex items-center text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                    {change}
                </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-1">{value}</h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{title}</p>
        </div>
    )
}
