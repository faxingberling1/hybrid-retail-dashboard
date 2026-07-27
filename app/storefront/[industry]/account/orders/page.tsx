"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OrdersRedirect() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/storefront/account?tab=orders")
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin w-8 h-8 border-4 border-[#ffc000] border-t-transparent rounded-full"></div>
    </div>
  )
}
