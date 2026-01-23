"use client";

import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart, 
  CreditCard, 
  Printer,
  CloudOff,
  Shield,
  Smartphone,
  Building,
  Truck,
  FileText,
  Bell,
  Settings,
  Zap,
  CheckCircle,
  ArrowRight,
  Smartphone as Mobile,
  Database,
  Lock
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: ShoppingCart,
      title: "Web & Tablet POS",
      description: "Responsive point of sale that works on any device with full offline capability",
      features: [
        "Touch-optimized interface",
        "Quick product search & barcode scan",
        "Split bills & discounts",
        "Customer display support",
        "Multiple payment methods"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Package,
      title: "Smart Inventory Management",
      description: "Real-time stock tracking across all branches and warehouses",
      features: [
        "Low stock alerts",
        "Batch & expiry tracking",
        "Multi-location transfers",
        "Purchase order management",
        "Supplier management"
      ],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Multi-Store & Franchise Control",
      description: "Manage multiple locations, franchises, and distributors from one dashboard",
      features: [
        "Centralized catalog management",
        "Role-based permissions",
        "Franchise performance tracking",
        "Inter-branch transfers",
        "Consolidated reporting"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: BarChart,
      title: "Advanced Analytics & Reporting",
      description: "Comprehensive business intelligence and actionable insights",
      features: [
        "Sales performance dashboards",
        "Inventory turnover analysis",
        "Customer behavior insights",
        "Profit margin tracking",
        "Custom report builder"
      ],
      color: "from-orange-500 to-orange-600"
    }
  ];

  const paymentFeatures = [
    {
      icon: CreditCard,
      title: "Pakistan Payment Integration",
      description: "Seamless integration with local payment gateways",
      details: [
        "JazzCash Business",
        "Easypaisa Business",
        "Credit/Debit cards",
        "Cash management",
        "Digital wallet support"
      ]
    },
    {
      icon: Printer,
      title: "Multi-Printer Routing",
      description: "Print to kitchen, bar, or multiple printers simultaneously",
      details: [
        "ESC/POS thermal printers",
        "Network & Bluetooth printing",
        "Custom receipt templates",
        "Print queue management",
        "Local print bridge"
      ]
    },
    {
      icon: CloudOff,
      title: "Offline Mode",
      description: "Continue operations during internet outages with auto-sync",
      details: [
        "Local data storage",
        "Auto-sync when online",
        "Conflict resolution",
        "Queue management",
        "Data integrity checks"
      ]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security and compliance features",
      details: [
        "Role-based access control",
        "Audit trail logging",
        "Data encryption",
        "GDPR compliance",
        "Regular security updates"
      ]
    }
  ];

  const industrySolutions = [
    {
      icon: Building,
      title: "Retail Chains",
      description: "Multi-store management with centralized control",
      features: ["Central pricing", "Cross-store inventory", "Consolidated reporting"]
    },
    {
      icon: Smartphone,
      title: "Electronics Stores",
      description: "Serial number tracking and warranty management",
      features: ["IMEI tracking", "Warranty database", "Accessory bundling"]
    },
    {
      icon: ShoppingCart,
      title: "Fashion & Apparel",
      description: "Size/color variants and seasonal collections",
      features: ["Matrix inventory", "Season tracking", "Size charts"]
    },
    {
      icon: Truck,
      title: "Wholesale & Distributors",
      description: "B2B ordering and credit management",
      features: ["Credit terms", "Bulk pricing", "Distributor portal"]
    }
  ];

  const hardwareCompatibility = [
    { name: "Thermal Printers", icon: Printer, compatible: true },
    { name: "Barcode Scanners", icon: Package, compatible: true },
    { name: "Cash Drawers", icon: CreditCard, compatible: true },
    { name: "Customer Displays", icon: Smartphone, compatible: true },
    { name: "Tablets & iPads", icon: Mobile, compatible: true },
    { name: "Android Devices", icon: Smartphone, compatible: true }
  ];

  const featuresList = [
    {
      category: "Sales & Transactions",
      items: [
        "Quick sale processing",
        "Multiple payment methods",
        "Split billing",
        "Discounts & promotions",
        "Loyalty programs",
        "Receipt customization",
        "Sales returns & refunds",
        "Gift cards"
      ]
    },
    {
      category: "Inventory Management",
      items: [
        "Real-time stock tracking",
        "Barcode generation",
        "Batch management",
        "Expiry date tracking",
        "Auto reordering",
        "Stock transfers",
        "Supplier management",
        "Inventory valuation"
      ]
    },
    {
      category: "Customer Management",
      items: [
        "Customer database",
        "Purchase history",
        "Loyalty points",
        "Credit management",
        "SMS/Email marketing",
        "Customer feedback",
        "Membership programs",
        "Birthday discounts"
      ]
    },
    {
      category: "Business Intelligence",
      items: [
        "Sales analytics",
        "Inventory reports",
        "Customer insights",
        "Profit analysis",
        "Staff performance",
        "Trend forecasting",
        "Custom dashboards",
        "Export to Excel"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="text-blue-600 block">Run Your Retail Business</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              HybridPOS is packed with features designed specifically for Pakistani retailers, 
              franchises, and distributors. Manage every aspect of your business from one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demo"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
              >
                <Smartphone className="h-5 w-5 mr-2" />
                Book a Live Demo
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/pricing"
                className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
              >
                View Pricing Plans
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Main Features Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Core Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools designed to streamline your retail operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-xl p-8 h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Payment & Hardware Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Payment & Hardware Integration
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for the Pakistani market with local integrations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paymentFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <feature.icon className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 mt-1.5 flex-shrink-0"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Industry Solutions */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industry-Specific Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored features for different retail sectors in Pakistan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industrySolutions.map((solution, index) => (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <solution.icon className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{solution.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{solution.description}</p>
                <div className="space-y-2">
                  {solution.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Hardware Compatibility */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hardware Compatibility
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Works with all standard retail hardware
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {hardwareCompatibility.map((device, index) => (
                <motion.div
                  key={device.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <device.icon className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">{device.name}</h4>
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Compatible
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Comprehensive Features List */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Feature List
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your retail business effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuresList.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-gray-200 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">
                  {category.category}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-10 text-white">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Technical Specifications
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Built with modern technology for reliability and scalability
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Database className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Cloud Infrastructure</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>AWS Cloud Hosting</li>
                  <li>99.9% Uptime SLA</li>
                  <li>Daily Backups</li>
                  <li>Auto-scaling</li>
                </ul>
              </div>

              <div className="text-center">
                <Lock className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Security & Compliance</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>Bank-level Encryption</li>
                  <li>Two-Factor Authentication</li>
                  <li>GDPR Compliance</li>
                  <li>Regular Audits</li>
                </ul>
              </div>

              <div className="text-center">
                <Zap className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Performance</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>Sub-second Response Time</li>
                  <li>Unlimited Transactions</li>
                  <li>Real-time Sync</li>
                  <li>24/7 Monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Transform Your Retail Business?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Join thousands of retailers across Pakistan who trust HybridPOS to power their operations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center justify-center"
              >
                Start 14-Day Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/demo"
                className="bg-white text-blue-600 border-2 border-blue-600 px-10 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 inline-flex items-center justify-center"
              >
                <Smartphone className="h-5 w-5 mr-2" />
                Schedule Live Demo
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {[
                { label: "No credit card required", icon: CreditCard },
                { label: "Cancel anytime", icon: Settings },
                { label: "Free onboarding", icon: Users },
                { label: "24/7 support", icon: Bell }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-center space-x-2 text-gray-600">
                  <item.icon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}