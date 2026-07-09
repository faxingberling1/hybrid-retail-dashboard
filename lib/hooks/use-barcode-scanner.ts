"use client"

import { useEffect, useRef, useCallback } from 'react'

interface UseBarcodeScannerProps {
  onScan: (barcode: string) => void
  debounceMs?: number // Max time between keystrokes to be considered a scan (default: 30ms)
  minLength?: number // Minimum length of a barcode
}

export function useBarcodeScanner({
  onScan,
  debounceMs = 30,
  minLength = 4
}: UseBarcodeScannerProps) {
  const buffer = useRef<string>('')
  const lastKeyTime = useRef<number>(Date.now())

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore key combinations
    if (e.ctrlKey || e.altKey || e.metaKey) return

    const currentTime = Date.now()
    const elapsedTime = currentTime - lastKeyTime.current
    
    // If it took too long between strokes, this is probably human typing
    // Reset buffer unless this is the very first character
    if (elapsedTime > debounceMs && buffer.current.length > 0) {
      buffer.current = ''
    }

    lastKeyTime.current = currentTime

    // Enter key generally signifies the end of a scan
    if (e.key === 'Enter') {
      if (buffer.current.length >= minLength) {
        // Only prevent default if it wasn't triggered from within an input that handles its own enters
        if (e.target instanceof HTMLElement && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault() 
        }
        onScan(buffer.current)
      }
      buffer.current = '' // Reset after scan attempt
      return
    }

    // Only accept printable characters (length 1)
    if (e.key.length === 1) {
      buffer.current += e.key
    }
  }, [onScan, debounceMs, minLength])

  useEffect(() => {
    // Attach listener globally
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
