"use client"

import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-4">
        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
          Please contact your system administrator if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </button>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  )
}