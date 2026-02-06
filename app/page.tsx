// app/page.tsx - UPDATED VERSION
'use client'; // Add this for better hydration

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'hsl(var(--background))'
      }}>
        <div style={{ textAlign: 'center', color: 'hsl(var(--foreground))' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)'
      }}>
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4"
          style={{ color: 'hsl(var(--foreground))' }}>
          Hybrid Retail Dashboard
        </h1>
        <p className="text-lg mb-8"
          style={{ color: 'hsl(var(--muted-foreground))' }}>
          Welcome to your retail management system
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 rounded-lg transition-colors"
          style={{
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(var(--primary) / 0.9)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(var(--primary))';
          }}
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}