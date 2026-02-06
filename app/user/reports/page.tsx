"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    BarChart3,
    Download,
    Calendar,
    PieChart,
    ArrowRight,
    ChevronRight,
    FileText,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Users,
    Activity,
    Clock,
    ArrowUpRight,
    DownloadCloud,
    Printer,
    Mail,
    Filter,
    Layers,
    LayoutGrid,
    List,
    Percent,
    ShoppingCart,
    MapPin,
    ArrowDownRight,
    RefreshCw,
    Search,
    ChevronDown,
    CheckCircle2,
    AlertCircle,
    Package
} from "lucide-react"

import ReportGeneratorModal from "@/components/dashboard/reports/ReportGeneratorModal"
import ReportKpiSection from "@/components/dashboard/reports/ReportKpiSection"
import ReportAnalyticsChart from "@/components/dashboard/reports/ReportAnalyticsChart"

export default function UserReportsPage() {
    const [timeRange, setTimeRange] = useState("Last 7 Days")
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
    const [searchQuery, setSearchQuery] = useState("")
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)
    const [reportsHistory, setReportsHistory] = useState([
        { id: "REP-001", name: "Daily Sales Audit", date: "Feb 03, 2024", type: "Sales", status: "Ready", size: "1.2 MB" },
        { id: "REP-002", name: "Inventory Valuation", date: "Feb 02, 2024", type: "Inventory", status: "Ready", size: "2.4 MB" },
        { id: "REP-003", name: "Tax Summary Q1", date: "Feb 01, 2024", type: "Finance", status: "Processing", size: "--" },
        { id: "REP-004", name: "Staff Performance", date: "Jan 31, 2024", type: "HR", status: "Ready", size: "850 KB" },
        { id: "REP-005", name: "Customer Demographics", date: "Jan 30, 2024", type: "Marketing", status: "Error", size: "--" },
    ])

    const kpis = [
        { label: "Total Revenue", value: "₨ 1,280,450", trend: "+12.5%", trendingUp: true, icon: DollarSign, color: "emerald", chart: [40, 35, 55, 45, 70, 65, 80] },
        { label: "Total Orders", value: "1,420", trend: "+8.2%", trendingUp: true, icon: ShoppingCart, color: "blue", chart: [30, 45, 40, 60, 55, 70, 65] },
        { label: "Avg. Transaction", value: "₨ 902", trend: "-2.4%", trendingUp: false, icon: Activity, color: "amber", chart: [70, 65, 60, 65, 55, 50, 45] },
        { label: "Returning Customers", value: "64%", trend: "+5.1%", trendingUp: true, icon: Users, color: "indigo", chart: [20, 30, 45, 40, 55, 65, 75] },
    ]

    const filteredReports = useMemo(() => {
        return reportsHistory.filter(report =>
            report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.id.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [searchQuery, reportsHistory])

    const handleNewReport = (report: any) => {
        setReportsHistory([report, ...reportsHistory])
    }

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 pb-12">
            {/* Enhanced Header */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-gradient-to-br from-rose-600 to-orange-500 rounded-[2.5rem] shadow-2xl shadow-rose-500/20 ring-1 ring-white/20 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 group-hover:scale-150 transition-transform duration-700 rounded-full blur-2xl -translate-x-10 -translate-y-10"></div>
                        <BarChart3 className="h-10 w-10 text-white relative z-10" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-rose-100 italic">Advanced Analytics</span>
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-gray-400">LIVE FEED</span>
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Reports & Insights</h1>
                        <p className="text-gray-500 font-medium text-lg mt-1">Unlock data-driven growth with real-time performance tracking</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="appearance-none pl-12 pr-10 py-4 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 hover:border-rose-300 focus:outline-none focus:ring-4 focus:ring-rose-500/10 transition-all cursor-pointer shadow-sm"
                        >
                            <option>Today</option>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>Custom Range</option>
                        </select>
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <button
                        onClick={() => setIsGeneratorOpen(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-900/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <DownloadCloud className="h-5 w-5" />
                        Generate Master Report
                    </button>

                    <button className="p-4 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm">
                        <RefreshCw className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* KPI Performance Strip */}
            <ReportKpiSection kpis={kpis} />

            {/* Main Insights & Report History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Analytics */}
                <ReportAnalyticsChart />

                {/* Report Generation Center */}
                <div className="space-y-8">
                    <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-blue-50/30"></div>
                        <div className="relative">
                            <div className="p-5 bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-500/20 inline-flex mb-8">
                                <FileText className="h-8 w-8" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">Export Hub</h2>
                            <p className="text-gray-500 font-medium mb-10 leading-relaxed">Direct connection to high-fidelity documentation generators.</p>

                            <div className="space-y-4">
                                {[
                                    { label: "Inventory Audit", count: "14 Items Alert", color: "indigo", icon: Layers },
                                    { label: "Tax & Compliance", count: "FBR Ready", color: "amber", icon: Percent },
                                    { label: "Customer Reach", count: "892 Contacts", color: "rose", icon: Users },
                                ].map((item, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setIsGeneratorOpen(true)}
                                        className="w-full flex items-center justify-between p-6 bg-white border border-gray-100/50 hover:border-indigo-200 rounded-3xl group/btn hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`p-3 bg-${item.color === 'indigo' ? 'indigo' : item.color === 'amber' ? 'amber' : 'rose'}-50 text-${item.color === 'indigo' ? 'indigo' : item.color === 'amber' ? 'amber' : 'rose'}-600 rounded-2xl group-hover/btn:scale-110 transition-transform`}>
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-black text-gray-900 leading-none mb-1">{item.label}</p>
                                                <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{item.count}</p>
                                            </div>
                                        </div>
                                        <ArrowUpRight className="h-5 w-5 text-gray-300 group-hover/btn:text-indigo-600 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Secondary Analytics */}
                    <div className="bg-gradient-to-br from-orange-500 to-rose-600 p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden text-white group">
                        <div className="absolute right-4 top-4 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                            <PieChart className="h-40 w-40" />
                        </div>
                        <div className="relative">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 mb-6 italic">Visual Intelligence</h3>
                            <p className="text-2xl font-black tracking-tighter mb-3 leading-tight italic">Unlock Deep Category Analytics</p>
                            <p className="text-white/60 text-sm font-medium mb-8 leading-relaxed italic">Visualize movement by brand, vendor, and SKU performance tags.</p>
                            <button className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white group/link italic">
                                Preview Pro Features <ChevronRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Generated Reports History */}
            <div className="bg-white/60 backdrop-blur-xl border border-gray-100 rounded-[3.5rem] overflow-hidden shadow-sm shadow-gray-200/50">
                <div className="p-10 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Recent Operations</h2>
                        <p className="text-gray-500 font-medium text-sm mt-1">Audit trail of exported and generated data files</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Filter report ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl w-[300px] focus:outline-none focus:ring-4 focus:ring-rose-500/10 transition-all font-bold"
                            />
                        </div>
                        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <LayoutGrid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`p-3 rounded-xl transition-all ${viewMode === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {viewMode === 'table' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-50">
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Report Instance</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Generated</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReports.map((report) => (
                                        <tr key={report.id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 group-hover:text-rose-600 transition-colors">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 leading-none mb-1 uppercase tracking-tight italic">{report.name}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 tracking-widest">{report.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-bold text-gray-600">{report.type}</td>
                                            <td className="px-6 py-6 text-sm font-medium text-gray-500">{report.date}</td>
                                            <td className="px-6 py-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${report.status === 'Ready' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    report.status === 'Processing' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                        'bg-rose-50 text-rose-600 border border-rose-100'
                                                    }`}>
                                                    {report.status === 'Ready' && <CheckCircle2 className="h-3 w-3" />}
                                                    {report.status === 'Processing' && <RefreshCw className="h-3 w-3 animate-spin" />}
                                                    {report.status === 'Error' && <AlertCircle className="h-3 w-3" />}
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                <button className={`p-4 rounded-2xl transition-all ${report.status === 'Ready' ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/10 hover:scale-110' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                                    }`}>
                                                    <Download className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredReports.map((report) => (
                                <div key={report.id} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-2xl hover:shadow-gray-200/50 transition-all group relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="p-4 bg-gray-50 rounded-[1.5rem] text-gray-400 group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                                            <FileText className="h-8 w-8" />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">
                                            {report.size}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tighter mb-2 uppercase italic">{report.name}</h3>
                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400 mb-8">
                                        <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg text-[10px] tracking-widest">{report.type}</span>
                                        <span>•</span>
                                        <span>{report.date}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${report.status === 'Ready' ? 'text-emerald-600' :
                                            report.status === 'Processing' ? 'text-amber-600' :
                                                'text-rose-600'
                                            }`}>
                                            {report.status === 'Ready' && <CheckCircle2 className="h-3.5 w-3.5" />}
                                            {report.status}
                                        </span>
                                        <button className={`flex-1 py-4 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${report.status === 'Ready' ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20 hover:scale-[1.05]' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                            }`}>
                                            <Download className="h-4 w-4" /> Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Audit Legend */}
                <div className="px-10 py-8 bg-gray-50 flex items-center justify-between border-t border-gray-100">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Auto-Archive: 8h 12m</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-gray-400" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Storage: 85% Free</span>
                        </div>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 tracking-tighter uppercase underline decoration-rose-500/30 underline-offset-4 cursor-pointer hover:text-rose-600 transition-colors">Access Enterprise Audit Logs</p>
                </div>
            </div>

            <ReportGeneratorModal
                isOpen={isGeneratorOpen}
                onClose={() => setIsGeneratorOpen(false)}
                onComplete={handleNewReport}
            />
        </div>
    )
}
