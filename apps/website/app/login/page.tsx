"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, EyeOff, ShoppingCart, CheckCircle, ArrowRight, Shield, User, 
  Building, Users, CreditCard, Package, BarChart, Globe, Lock, 
  ChevronRight, ChevronLeft, Sparkles, Store, Smartphone, TrendingUp,
  Clock, Zap
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"SUPER_ADMIN" | "ADMIN" | "USER">("SUPER_ADMIN");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Demo credentials for different roles
  const demoCredentials = {
    SUPER_ADMIN: {
      email: "superadmin@hybridpos.pk",
      password: "demo123",
      name: "Super Admin",
      icon: <Shield className="h-5 w-5" />,
      color: "from-purple-500 to-indigo-500"
    },
    ADMIN: {
      email: "admin@hybridpos.pk", 
      password: "demo123",
      name: "Store Admin",
      icon: <Building className="h-5 w-5" />,
      color: "from-blue-500 to-cyan-500"
    },
    USER: {
      email: "user@hybridpos.pk",
      password: "demo123",
      name: "Staff User",
      icon: <User className="h-5 w-5" />,
      color: "from-emerald-500 to-green-500"
    }
  };

  // Slides for the right panel
  const slides = [
    {
      title: "Complete Retail Management",
      description: "End-to-end solution for inventory, sales, and customer management",
      icon: <ShoppingCart className="h-12 w-12" />,
      gradient: "from-blue-500 to-purple-500",
      features: ["Multi-store support", "Real-time inventory", "Customer CRM"],
      stats: [
        { value: "500+", label: "Retailers" },
        { value: "99.9%", label: "Uptime" }
      ]
    },
    {
      title: "Pakistan Payment Integration",
      description: "Native support for JazzCash, Easypaisa, and major card networks",
      icon: <CreditCard className="h-12 w-12" />,
      gradient: "from-green-500 to-emerald-500",
      features: ["JazzCash API", "Easypaisa", "Card payments"],
      stats: [
        { value: "10K+", label: "Transactions" },
        { value: "24/7", label: "Support" }
      ]
    },
    {
      title: "Advanced Analytics",
      description: "Real-time insights and business intelligence dashboards",
      icon: <BarChart className="h-12 w-12" />,
      gradient: "from-orange-500 to-red-500",
      features: ["Sales analytics", "Trend forecasting", "Inventory insights"],
      stats: [
        { value: "50+", label: "Reports" },
        { value: "Real-time", label: "Updates" }
      ]
    },
    {
      title: "Multi-Tenant Architecture",
      description: "Manage multiple organizations with complete data isolation",
      icon: <Globe className="h-12 w-12" />,
      gradient: "from-indigo-500 to-purple-500",
      features: ["Role-based access", "Data isolation", "Centralized control"],
      stats: [
        { value: "100%", label: "Secure" },
        { value: "GDPR", label: "Compliant" }
      ]
    }
  ];

  // Features list
  const features = [
    { icon: <Store className="h-4 w-4" />, text: "Multi-store Management" },
    { icon: <Smartphone className="h-4 w-4" />, text: "Mobile POS" },
    { icon: <TrendingUp className="h-4 w-4" />, text: "Sales Analytics" },
    { icon: <Clock className="h-4 w-4" />, text: "Real-time Sync" },
    { icon: <Shield className="h-4 w-4" />, text: "Bank-level Security" },
    { icon: <Zap className="h-4 w-4" />, text: "Fast Checkout" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isAnimating, slides.length]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if credentials match any demo role
    const selectedDemo = demoCredentials[selectedRole];
    if (email === selectedDemo.email && password === selectedDemo.password) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("demoMode", "true");
      localStorage.setItem("userRole", selectedRole);
      localStorage.setItem("userName", selectedDemo.name);
      
      setShowDemoInfo(true);
      setTimeout(() => {
        setIsLoading(false);
        switch(selectedRole) {
          case "SUPER_ADMIN":
            router.push("/super-admin");
            break;
          case "ADMIN":
            router.push("/admin");
            break;
          case "USER":
            router.push("/user");
            break;
        }
      }, 1000);
      return;
    }

    setError("Invalid credentials. Please use demo credentials.");
    setIsLoading(false);
  };

  const handleDemoLogin = (role: "SUPER_ADMIN" | "ADMIN" | "USER") => {
    setSelectedRole(role);
    const credentials = demoCredentials[role];
    setEmail(credentials.email);
    setPassword(credentials.password);
    setShowDemoInfo(true);
    
    setTimeout(() => {
      setShowDemoInfo(false);
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Login Form */}
        <div className="lg:w-2/5 w-full p-6 md:p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            {/* Welcome Header */}
            <div className="mb-8 text-center lg:text-left">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center lg:justify-start space-x-2 mb-4"
              >
                <Sparkles className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-600">Enterprise Retail Solution</span>
              </motion.div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Welcome to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  HybridPOS
                </span>
              </h1>
              <p className="text-gray-600">
                Experience our platform with different demo roles
              </p>
            </div>

            {/* Features Grid */}
            <div className="mb-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <div className="text-blue-500">
                      {feature.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-700">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Select Demo Role</h2>
                <p className="text-sm text-gray-600">Try different user experiences</p>
              </div>

              {/* Role Selection */}
              <div className="space-y-3 mb-8">
                {Object.entries(demoCredentials).map(([role, creds]) => (
                  <motion.button
                    key={role}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleDemoLogin(role as "SUPER_ADMIN" | "ADMIN" | "USER")}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedRole === role 
                        ? 'border-transparent bg-gradient-to-r shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    } ${selectedRole === role ? creds.color : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2.5 rounded-lg ${
                          selectedRole === role 
                            ? 'bg-white/20' 
                            : 'bg-gray-100'
                        }`}>
                          <div className={selectedRole === role ? 'text-white' : 'text-gray-600'}>
                            {creds.icon}
                          </div>
                        </div>
                        <div className="text-left">
                          <h3 className={`font-semibold ${
                            selectedRole === role ? 'text-white' : 'text-gray-900'
                          }`}>
                            {creds.name}
                          </h3>
                          <p className={`text-sm ${
                            selectedRole === role ? 'text-white/90' : 'text-gray-600'
                          }`}>
                            {creds.email}
                          </p>
                        </div>
                      </div>
                      {selectedRole === role && (
                        <ChevronRight className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter demo email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-all duration-200"
                        placeholder="Enter demo password (demo123)"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showDemoInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                        <p className="text-blue-700 text-sm">
                          Logging in as <span className="font-semibold">{demoCredentials[selectedRole].name}</span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-4 px-6 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${demoCredentials[selectedRole].color}`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    `Continue as ${demoCredentials[selectedRole].name}`
                  )}
                </motion.button>

                <div className="pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    All demo accounts use password: <span className="font-mono">demo123</span>
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Slider Info Panel */}
        <div className="lg:w-3/5 w-full hidden lg:block relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/5" />
          
          <div className="relative h-full flex items-center justify-center p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${slides[currentSlide].gradient} mb-8`}>
                  {slides[currentSlide].icon}
                </div>
                
                <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {slides[currentSlide].title}
                </h2>
                
                <p className="text-lg text-gray-600 mb-8">
                  {slides[currentSlide].description}
                </p>

                {/* Features List */}
                <div className="mb-10">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">KEY FEATURES</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {slides[currentSlide].features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6">
                  {slides[currentSlide].stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="text-center"
                    >
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Navigation */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
              <button
                onClick={prevSlide}
                className="p-2 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-full hover:bg-white transition-colors shadow-sm"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              
              <div className="flex items-center space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextSlide}
                className="p-2 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-full hover:bg-white transition-colors shadow-sm"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDemoLogin("SUPER_ADMIN")}
              className="absolute top-12 right-12 bg-white border border-gray-300 rounded-xl px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow"
            >
              Try Live Demo
              <ArrowRight className="inline-block ml-2 h-4 w-4" />
            </motion.button>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>

        {/* Mobile View - Simplified Info */}
        <div className="lg:hidden w-full p-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Why Choose HybridPOS</h3>
              <div className="flex space-x-1">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentSlide ? 'bg-blue-500' : 'bg-blue-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-sm text-gray-700">Multi-store inventory sync</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-sm text-gray-700">Pakistan payment gateways</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-sm text-gray-700">Real-time analytics dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}