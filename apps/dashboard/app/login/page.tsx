"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { 
  Shield, ShoppingCart, CheckCircle, 
  Building, User, ArrowRight, Sparkles,
  Database, PlusCircle, Users, Zap,
  Briefcase, Palette, Globe, Lock,
  CreditCard, Settings, Bell, Star,
  TrendingUp, BarChart, Smartphone,
  Calendar, Target, ShieldCheck
} from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"SUPER_ADMIN" | "ADMIN" | "USER" | "NEW_ACCOUNT">("NEW_ACCOUNT")
  const [showDemoInfo, setShowDemoInfo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const demoCredentials = {
    SUPER_ADMIN: {
      email: "superadmin@hybridpos.pk",
      password: "demo123",
      name: "Super Admin",
      icon: <Shield className="h-6 w-6" />,
      color: "from-purple-500 to-indigo-600",
      gradient: "bg-gradient-to-br from-purple-500 to-indigo-600",
      lightColor: "bg-purple-100",
      textColor: "text-purple-700",
      redirect: "/super-admin",
      features: ["System Monitoring", "All Organizations", "User Management", "Database Access"]
    },
    ADMIN: {
      email: "admin@hybridpos.pk", 
      password: "demo123",
      name: "Store Admin",
      icon: <Building className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
      lightColor: "bg-blue-100",
      textColor: "text-blue-700",
      redirect: "/admin",
      features: ["Store Management", "Inventory Control", "Staff Management", "Sales Analytics"]
    },
    USER: {
      email: "user@hybridpos.pk",
      password: "demo123",
      name: "Staff User",
      icon: <User className="h-6 w-6" />,
      color: "from-emerald-500 to-green-500",
      gradient: "bg-gradient-to-br from-emerald-500 to-green-500",
      lightColor: "bg-emerald-100",
      textColor: "text-emerald-700",
      redirect: "/user",
      features: ["Point of Sale", "Customer Service", "Basic Operations", "Shift Management"]
    },
    NEW_ACCOUNT: {
      email: "",
      password: "",
      name: "Create New Account",
      icon: <PlusCircle className="h-6 w-6" />,
      color: "from-amber-500 to-orange-500",
      gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
      lightColor: "bg-amber-100",
      textColor: "text-amber-700",
      redirect: "/auth/signup",
      features: ["14-Day Free Trial", "Custom Setup", "Team Onboarding", "Priority Support"]
    }
  }

  const handleLogin = async (role: "SUPER_ADMIN" | "ADMIN" | "USER") => {
    if (role === "NEW_ACCOUNT") {
      router.push("/auth/signup")
      return
    }

    setIsLoading(true)
    setSelectedRole(role)
    setShowDemoInfo(true)
    setError(null)

    const credentials = demoCredentials[role]

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
        callbackUrl: credentials.redirect
      })

      if (result?.error) {
        setError(`Authentication failed: ${result.error}`)
      } else if (result?.ok && !result.error) {
        setTimeout(() => {
          window.location.href = credentials.redirect
        }, 500)
      }
    } catch (err: any) {
      setError(`Network error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-[3px] border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading beautiful interface...</p>
        </div>
      </div>
    )
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl blur opacity-30"></div>
              <div className="relative p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                HybridPOS
              </h1>
              <p className="text-sm text-gray-600">Complete Business Management</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live Database</span>
              <Database className="h-4 w-4 text-blue-500" />
            </div>
            <button 
              onClick={() => router.push('/contact')}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Hero & Features */}
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 border border-blue-200 mb-4">
                  <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm font-semibold text-blue-600">TRUSTED BY 10,000+ BUSINESSES</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Run Your Business
                  <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    Smarter, Not Harder
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mt-4 max-w-2xl">
                  Everything you need to manage your business in one beautiful dashboard. 
                  From inventory to analytics, we've got you covered.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="text-2xl font-bold text-gray-900">30+</div>
                  <div className="text-sm text-gray-600">Integrations</div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Zap className="h-5 w-5" />, title: "Lightning Fast", desc: "Real-time updates" },
                { icon: <Lock className="h-5 w-5" />, title: "Bank-Level Security", desc: "256-bit encryption" },
                { icon: <BarChart className="h-5 w-5" />, title: "Smart Analytics", desc: "AI-powered insights" },
                { icon: <Smartphone className="h-5 w-5" />, title: "Mobile First", desc: "Works on all devices" },
                { icon: <Calendar className="h-5 w-5" />, title: "Auto Scheduling", desc: "Smart automation" },
                { icon: <Target className="h-5 w-5" />, title: "Goal Tracking", desc: "Achieve targets" }
              ].map((feature, idx) => (
                <div 
                  key={idx}
                  className="group bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-lg cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                      <div className="text-blue-600">{feature.icon}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{feature.title}</div>
                      <div className="text-sm text-gray-600">{feature.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Login Cards */}
          <div className="space-y-6">
            {/* Demo Accounts Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Try Demo Accounts</h2>
                  <p className="text-gray-600">Experience full functionality instantly</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-20"></div>
                  <div className="relative px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                    <span className="text-sm font-semibold text-white">FREE</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {(["SUPER_ADMIN", "ADMIN", "USER"] as const).map((role) => {
                  const cred = demoCredentials[role]
                  return (
                    <div
                      key={role}
                      onMouseEnter={() => setHoveredRole(role)}
                      onMouseLeave={() => setHoveredRole(null)}
                      onClick={() => handleLogin(role)}
                      className={`group relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                        selectedRole === role
                          ? `${cred.color} border-transparent`
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {/* Hover Gradient Overlay */}
                      {hoveredRole === role && selectedRole !== role && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white rounded-xl opacity-50"></div>
                      )}

                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl transition-all duration-300 ${
                            selectedRole === role
                              ? 'bg-white/20 backdrop-blur-sm'
                              : `${cred.lightColor} group-hover:scale-110`
                          }`}>
                            <div className={selectedRole === role ? 'text-white' : cred.textColor}>
                              {cred.icon}
                            </div>
                          </div>
                          <div>
                            <h3 className={`font-bold text-lg ${
                              selectedRole === role ? 'text-white' : 'text-gray-900'
                            }`}>
                              {cred.name}
                            </h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {cred.features.map((feature, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    selectedRole === role
                                      ? 'bg-white/30 text-white/90'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className={`transition-all duration-300 ${
                          selectedRole === role ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          {selectedRole === role && isLoading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                          ) : (
                            <div className={`p-2 rounded-lg ${
                              selectedRole === role
                                ? 'bg-white/20'
                                : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-cyan-500'
                            }`}>
                              <ArrowRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                                selectedRole === role ? 'text-white' : 'text-gray-600 group-hover:text-white'
                              }`} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-shake">
                  <div className="flex items-center">
                    <ShieldCheck className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {showDemoInfo && !error && selectedRole !== "NEW_ACCOUNT" && (
                <div className="mt-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="animate-pulse">
                        <Database className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-700">
                          Connecting to PostgreSQL database...
                        </p>
                        <p className="text-blue-600 text-sm mt-1">
                          Authenticating as {demoCredentials[selectedRole].name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Create Account Card */}
            <div className="relative overflow-hidden group">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 animate-gradient-x"></div>
              
              {/* Content */}
              <div 
                onClick={() => router.push('/auth/signup')}
                className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-amber-200 p-8 shadow-xl cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Start Your Journey
                    </h2>
                    <p className="text-gray-600 max-w-md">
                      Join thousands of businesses already transforming their operations with HybridPOS
                    </p>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full blur opacity-30"></div>
                    <div className="relative p-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full">
                      <PlusCircle className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: <TrendingUp className="h-5 w-5" />, text: "Increase Revenue" },
                    { icon: <Users className="h-5 w-5" />, text: "Manage Team" },
                    { icon: <BarChart className="h-5 w-5" />, text: "Smart Analytics" },
                    { icon: <CreditCard className="h-5 w-5" />, text: "Secure Payments" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                      <div className="p-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg">
                        <div className="text-white">{item.icon}</div>
                      </div>
                      <span className="font-medium text-gray-900">{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                      <span className="font-semibold text-gray-900">4.9/5</span>
                      <span className="text-gray-600 text-sm">Rating</span>
                    </div>
                    <div className="h-6 w-px bg-gray-300"></div>
                    <div>
                      <span className="text-sm text-gray-600">Free for</span>
                      <span className="font-bold text-gray-900 ml-1">14 days</span>
                    </div>
                  </div>
                  
                  <button className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <span>Get Started Free</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials & Stats */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Trusted by Industry Leaders
            </h3>
            <p className="text-gray-600">Join businesses of all sizes that trust us with their operations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "TechCorp Inc.", role: "CEO", text: "Increased efficiency by 40%", color: "bg-blue-100" },
              { name: "RetailChain", role: "Operations Head", text: "Best inventory management", color: "bg-emerald-100" },
              { name: "PharmaPlus", role: "Manager", text: "Perfect for healthcare", color: "bg-purple-100" }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:border-blue-200 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${testimonial.color} flex items-center justify-center`}>
                    <User className="h-6 w-6 text-gray-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <Database className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-gray-900">PostgreSQL Powered</span>
              </div>
              <p className="text-sm text-gray-600">
                Secure, scalable, and reliable database infrastructure
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Privacy Policy
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Terms of Service
              </button>
              <button className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Help Center
              </button>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} HybridPOS. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}