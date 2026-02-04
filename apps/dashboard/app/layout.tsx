import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import GlobalMaintenanceBanner from '@/components/dashboard/global-maintenance-banner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HybridPOS Dashboard',
  description: 'Enterprise Retail Management System',
}

// Use any to bypass type checking temporarily
export default function RootLayout({
  children,
}: {
  children: any
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <GlobalMaintenanceBanner />
          {children}
        </Providers>
      </body>
    </html>
  )
}