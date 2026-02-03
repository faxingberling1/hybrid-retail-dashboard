import { Filter, Receipt } from "lucide-react"

export function RecentTransactions() {
    const recentTransactions = [
        { id: 'TXN-001', customer: 'Ali Ahmed', amount: '₨ 12,500', items: 3, time: '10:30 AM', status: 'completed' },
        { id: 'TXN-002', customer: 'Sara Khan', amount: '₨ 8,750', items: 2, time: '11:15 AM', status: 'completed' },
        { id: 'TXN-003', customer: 'Usman Malik', amount: '₨ 25,000', items: 5, time: '12:45 PM', status: 'pending' },
        { id: 'TXN-004', customer: 'Fatima Raza', amount: '₨ 6,200', items: 1, time: '01:30 PM', status: 'completed' },
        { id: 'TXN-005', customer: 'Bilal Hussain', amount: '₨ 15,800', items: 4, time: '02:15 PM', status: 'completed' },
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                    <p className="text-sm text-gray-600">Today's sales transactions</p>
                </div>
                <Filter className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-3">
                {recentTransactions.map((txn, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                        <div className="flex items-center">
                            <div className="h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                                <Receipt className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">{txn.id} - {txn.customer}</div>
                                <div className="text-sm text-gray-600">{txn.items} items • {txn.time}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-gray-900">{txn.amount}</div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${txn.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                {txn.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
