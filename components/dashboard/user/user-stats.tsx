import { motion } from "framer-motion"
import { TrendingUp, DollarSign, ShoppingCart, Users, CreditCard } from "lucide-react"

interface Stat {
    title: string
    value: string
    change: string
    icon: JSX.Element
}

interface UserStatsProps {
    stats: Stat[]
}

export function UserStats({ stats }: UserStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-blue-100 text-blue-600`}>
                                {stat.icon}
                            </div>
                            <div className="flex items-center text-green-600">
                                <TrendingUp className="h-4 w-4 mr-1" />
                                <span className="text-sm font-medium">{stat.change}</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                        <p className="text-gray-600 text-sm">{stat.title}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
