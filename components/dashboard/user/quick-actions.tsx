import { ShoppingCart, Scan, Package, Users, BarChart3, Receipt } from "lucide-react"

export function QuickActions() {
    const quickActions = [
        { id: 1, label: 'New Sale', icon: <ShoppingCart className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600' },
        { id: 2, label: 'Scan Product', icon: <Scan className="h-5 w-5" />, color: 'bg-green-100 text-green-600' },
        { id: 3, label: 'View Inventory', icon: <Package className="h-5 w-5" />, color: 'bg-purple-100 text-purple-600' },
        { id: 4, label: 'Customer Lookup', icon: <Users className="h-5 w-5" />, color: 'bg-orange-100 text-orange-600' },
        { id: 5, label: 'Daily Report', icon: <BarChart3 className="h-5 w-5" />, color: 'bg-red-100 text-red-600' },
        { id: 6, label: 'Print Receipt', icon: <Receipt className="h-5 w-5" />, color: 'bg-indigo-100 text-indigo-600' },
    ]

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                    <button
                        key={action.id}
                        className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                    >
                        <div className={`p-3 rounded-lg ${action.color} mb-2`}>
                            {action.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
