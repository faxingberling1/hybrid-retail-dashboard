"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { ReactNode, useState, createContext, useContext, useEffect } from "react"
import { Toaster } from "sonner"

type Theme = 'light' | 'dark' | 'system'

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  resolvedTheme: 'light'
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

function ThemeProvider({ 
  children, 
  defaultTheme = 'system',
  storageKey = 'dashboard-theme'
}: { 
  children: ReactNode 
  defaultTheme?: Theme
  storageKey?: string 
}) {
  const [theme, setTheme] = useState<Theme>(
    () => (typeof window !== 'undefined' ? (localStorage.getItem(storageKey) as Theme) || defaultTheme : defaultTheme)
  )

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = window.document.documentElement

    // Remove previous theme classes
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
      setResolvedTheme(systemTheme)
    } else {
      root.classList.add(theme)
      setResolvedTheme(theme)
    }
  }, [theme])

  useEffect(() => {
    // Store theme in localStorage
    localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme === 'system') {
        const root = window.document.documentElement
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        root.classList.remove('light', 'dark')
        root.classList.add(systemTheme)
        setResolvedTheme(systemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    },
    resolvedTheme
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')
  return context
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }))

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
          <Toaster 
            richColors 
            position="top-right" 
            expand={true}
            closeButton
          />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}