"use client"

import React, { useState } from 'react'
import { X, Mail, Lock, User as UserIcon } from 'lucide-react'
import { useUIStore } from '@/lib/store/ui-store'
import { useAuthStore } from '@/lib/store/auth-store'
import { toast } from 'sonner'

export function AuthModal({ organizationId }: { organizationId: string }) {
  const { isAuthModalOpen, setAuthModalOpen } = useUIStore()
  const { setUser, setOrders } = useAuthStore()
  
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const endpoint = isLogin ? '/api/storefront/auth/login' : '/api/storefront/auth/register'
      const body = isLogin 
        ? { email, password, organization_id: organizationId }
        : { name, email, password, organization_id: organizationId }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      setUser(data.customer)
      
      // If logging in, also fetch latest orders
      if (isLogin) {
        const meRes = await fetch('/api/storefront/auth/me')
        if (meRes.ok) {
          const meData = await meRes.json()
          if (meData.orders) {
            setOrders(meData.orders)
          }
        }
      }

      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!')
      setAuthModalOpen(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity backdrop-blur-sm"
        onClick={() => setAuthModalOpen(false)}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden">
        <div className="relative p-6 md:p-8">
          <button 
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              {isLogin 
                ? 'Enter your details to access your account' 
                : 'Sign up to start shopping and earning points'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ffc000] focus:border-[#ffc000] outline-none transition-all"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ffc000] focus:border-[#ffc000] outline-none transition-all"
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                {isLogin && (
                  <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot?</a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ffc000] focus:border-[#ffc000] outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-colors mt-2 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="font-bold text-indigo-600 hover:text-indigo-700"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
