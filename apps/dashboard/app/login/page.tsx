"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { 
  Shield, ShoppingCart, CheckCircle, 
  Building, User, ArrowRight,
  Database
} from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"SUPER_ADMIN" | "ADMIN" | "USER">("SUPER_ADMIN")
  const [showDemoInfo, setShowDemoInfo] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const demoCredentials = {
    SUPER_ADMIN: {
      email: "superadmin@hybridpos.pk",
      password: "demo123",
      name: "Super Admin",
      icon: <Shield className="h-5 w-5" />,
      color: "from-purple-500 to-indigo-500",
      redirect: "/super-admin"
    },
    ADMIN: {
      email: "admin@hybridpos.pk", 
      password: "demo123",
      name: "Store Admin",
      icon: <Building className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500",
      redirect: "/admin"
    },
    USER: {
      email: "user@hybridpos.pk",
      password: "demo123",
      name: "Staff User",
      icon: <User className="h-5 w-5" />,
      color: "from-emerald-500 to-green-500",
      redirect: "/user"
    }
  }

  const handleLogin = async (role: "SUPER_ADMIN" | "ADMIN" | "USER") => {
    setIsLoading(true)
    setSelectedRole(role)
    setShowDemoInfo(true)
    setError(null)

    const credentials = demoCredentials[role]

    try {
      console.log("🚀 Attempting PostgreSQL login for:", credentials.email)
      console.log("🔗 Will redirect to:", credentials.redirect)
      
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      console.log("🔍 SignIn result:", result)

      if (result?.error) {
        setError("Authentication failed. Please check credentials and try again.")
        console.error("❌ Login error:", result.error)
        setIsLoading(false)
      } else if (result?.ok && !result.error) {
        console.log("✅ PostgreSQL login successful")
        console.log("🔄 Redirecting to:", credentials.redirect)
        
        // Use router.push for client-side navigation
        router.push(credentials.redirect)
        router.refresh() // Refresh to update session
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error("❌ Login exception:", err)
      setIsLoading(false)
    }
  }

  const RoleButton = ({ role, label, description }: {
    role: "SUPER_ADMIN" | "ADMIN" | "USER",
    label: string,
    description: string
  }) => (
    <button
      onClick={() => handleLogin(role)}
      disabled={isLoading}
      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'} ${
        selectedRole === role 
          ? 'border-transparent bg-gradient-to-r shadow-lg' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      } ${selectedRole === role ? demoCredentials[role].color : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-2.5 rounded-lg ${
            selectedRole === role 
              ? 'bg-white/20' 
              : 'bg-gray-100'
          }`}>
            <div className={selectedRole === role ? 'text-white' : 'text-gray-600'}>
              {demoCredentials[role].icon}
            </div>
          </div>
          <div className="text-left">
            <h3 className={`font-semibold ${
              selectedRole === role ? 'text-white' : 'text-gray-900'
            }`}>
              {label}
            </h3>
            <p className={`text-sm ${
              selectedRole === role ? 'text-white/90' : 'text-gray-600'
            }`}>
              {description}
            </p>
          </div>
        </div>
        {selectedRole === role && (
          <ArrowRight className="h-5 w-5 text-white" />
        )}
      </div>
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
              <ShoppingCart className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HybridPOS</h1>
              <p className="text-sm text-gray-600">PostgreSQL Dashboard</p>
            </div>
          </div>
          
          <div className="inline-flex items-center space-x-1 bg-blue-50 px-4 py-2 rounded-full mb-4">
            <Database className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-600">PostgreSQL Database</span>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Select Dashboard Role
          </h2>
          <p className="text-gray-600">
            Authenticated via PostgreSQL database
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <RoleButton 
              role="SUPER_ADMIN"
              label="Super Admin"
              description="Full system access, manage all organizations"
            />
            <RoleButton 
              role="ADMIN"
              label="Store Admin"
              description="Store management, inventory, staff"
            />
            <RoleButton 
              role="USER"
              label="Staff User"
              description="Point of sale, basic operations"
            />
          </div>

          {showDemoInfo && !error && (
            <div className="mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                  <div>
                    <p className="text-blue-700 text-sm font-medium">
                      Logging in as {demoCredentials[selectedRole].name}
                    </p>
                    <p className="text-blue-600 text-xs mt-1">
                      Authenticating with PostgreSQL...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demo Credentials */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">PostgreSQL Credentials</h4>
            <div className="space-y-3">
              {Object.entries(demoCredentials).map(([role, creds]) => (
                <div key={role} className="bg-gray-50 rounded-lg p-3">
                  <div className="font-medium text-gray-900 mb-1">{creds.name}</div>
                  <div className="text-sm text-gray-600">
                    <span className="font-mono">{creds.email}</span> / demo123
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Redirects to: <code className="ml-1">{creds.redirect}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Database Info */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Database Information</h4>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Database className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">PostgreSQL Connection</span>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Database:</span>
                  <code className="font-mono">hybridpos_db</code>
                </div>
                <div className="flex justify-between">
                  <span>Host:</span>
                  <code className="font-mono">localhost:5432</code>
                </div>
                <div className="flex justify-between">
                  <span>Users:</span>
                  <span className="font-medium">3 demo accounts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="mt-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600 mt-2">Querying PostgreSQL database...</p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>PostgreSQL authentication • BCrypt password hashing • Secure session management</p>
          <p className="mt-1">Connected to: hybridpos_db@localhost:5432</p>
        </div>
      </div>
    </div>
  )
}