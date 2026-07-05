"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export function BackButton({ label = "Back", fallbackHref = "/storefront" }: { label?: string, fallbackHref?: string }) {
  const router = useRouter()

  return (
    <button 
      onClick={() => {
        if (window.history.length > 2) {
          router.back()
        } else {
          router.push(fallbackHref)
        }
      }}
      className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-500 transition-colors"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </button>
  )
}
