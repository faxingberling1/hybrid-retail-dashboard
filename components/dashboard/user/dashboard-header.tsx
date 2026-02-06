import { Clock, RefreshCw, LogOut } from "lucide-react"

interface UserDashboardHeaderProps {
    user: {
        name?: string | null
        email?: string | null
    }
    isLoading: boolean
    onSync: () => void
    onLogout: () => void
}

export function UserDashboardHeader({ user, isLoading, onSync, onLogout }: UserDashboardHeaderProps) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Point of Sale Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                    Welcome, <span className="font-semibold text-blue-600">{user.name || user.email}</span> •
                    Role: <span className="font-semibold text-blue-600">Staff User</span> •
                    Terminal: <span className="font-medium text-gray-700">Terminal #01</span>
                </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
                <button
                    onClick={onSync}
                    disabled={isLoading}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Syncing...
                        </>
                    ) : (
                        <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync
                        </>
                    )}
                </button>
                <button
                    onClick={onLogout}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transition-all flex items-center"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </button>
            </div>
        </div>
    )
}
