"use client"

import { useState, useEffect } from "react"
import { Timer } from "lucide-react"

export function FlashDealsTimer({ hours = 4 }: { hours?: number }) {
  const [timeLeft, setTimeLeft] = useState(hours * 60 * 60)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0')
  const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0')
  const s = (timeLeft % 60).toString().padStart(2, '0')

  return (
    <div className="flex items-center gap-2 bg-rose-100 text-rose-600 px-3 py-1.5 rounded-full font-black text-xs md:text-sm shadow-sm border border-rose-200 animate-pulse">
      <Timer className="w-4 h-4" />
      <span>Ends in: {h}:{m}:{s}</span>
    </div>
  )
}
