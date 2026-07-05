"use client"

import { Share2, Check } from "lucide-react"
import { useState } from "react"

export function ShareButton({ title, text, url }: { title: string, text: string, url: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    // Make absolute URL if necessary
    const shareUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      // Fallback to copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    }
  }

  return (
    <button 
      onClick={handleShare}
      className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
      title="Share Product"
    >
      {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
    </button>
  )
}
