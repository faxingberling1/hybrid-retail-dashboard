"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  ShoppingCart, 
  Building, 
  Users, 
  BarChart,
  Shield,
  Zap,
  CreditCard,
  Printer,
  Smartphone,
  Database,
  Headphones,
  Globe,
  ArrowRight,
  HelpCircle
} from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      subtitle: "SME Package",
      description: "Perfect for single store operations",
      monthlyPrice: "Rs. 3,000",
      yearlyPrice: "Rs. 30,000",
      yearlySavings: "Save Rs. 6,000",
      features: [
        { text: "Single branch/store", included: true },
        { text: "2 POS terminals", included: true },
        { text: "Basic inventory management", included: true },
        { text: "Sales reports & analytics", included: true },
        { text: "Customer management", included: true },
        { text: "Barcode scanning", included: true },
        { text: "Receipt printing", included: true },
        { text: "Email support", included: true },
        { text: "Multi-branch support", included: false },
        { text: "Purchase orders", included: false },
        { text: "Advanced analytics", included: false },
        { text: "API access", included: false }
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "blue",
      icon: ShoppingCart
    },
    {
      id: "professional",
      name: "Professional",
      subtitle: "Franchise Package",
      description: "Ideal for multi-store retail chains",
      monthlyPrice: "Rs. 6,500",
      yearlyPrice: "Rs. 65,000",
      yearlySavings: "Save Rs. 13,000",
      features: [
        { text: "Up to 5 branches", included: true },
        { text: "10 POS terminals", included: true },
        { text: "Purchase orders & supplier management", included: true },
        { text: "Barcode label printing", included: true },
        { text: "Manager roles & permissions", included: true },
        { text: "Advanced inventory tracking", included: true },
        { text: "Sales analytics dashboard", included: true },
        { text: "Priority email & phone support", included: true },
        { text: "API access (basic)", included: true },
        { text: "Custom reports", included: true },
        { text: "Central catalog management", included: false },
        { text: "Distributor integration", included: false }
      ],
      cta: "Get Started",
      popular: true,
      color: "purple",
      icon: Building
    },
    {
      id: "enterprise",
      name: "Enterprise",
      subtitle: "Custom Solutions",
      description: "For large retail networks & franchises",
      monthlyPrice: "From Rs. 20,000",
      yearlyPrice: "From Rs. 200,000",
      yearlySavings: "Save 20%",
      features: [
        { text: "Unlimited branches & franchises", included: true },
        { text: "Central catalog management", included: true },
        { text: "Distributor integration portal", included: true },
        { text: "Full API access", included: true },
        { text: "Custom BI dashboards", included: true },
        { text: "Dedicated account manager", included: true },
        { text: "24/7 priority support", included: true },
        { text: "White-label option", included: true },
        { text: "Custom integrations", included: true },
        { text: "On-site training (optional)", included: true },
        { text: "Advanced security features", included: true },
        { text: "SLA guarantees", included: true }
      ],
      cta: "Contact Sales",
      popular: false,
      color: "indigo",
      icon: Users
    }
  ];

  const addons = [
    {
      name: "Extra Devices",
      description: "Additional POS terminals",
      monthlyPrice: "Rs. 1,500",
      yearlyPrice: "Rs. 15,000",
      per: "per device/month",
      icon: Smartphone,
      popular: true
    },
    {
      name: "SMS Receipts",
      description: "Send digital receipts via SMS",
      monthlyPrice: "Rs. 1,000",
      yearlyPrice: "Rs. 10,000",
      per: "per month",
      icon: Printer,
      popular: false
    },
    {
      name: "Online BI Reports",
      description: "Advanced business intelligence",
      monthlyPrice: "Rs. 3,000",
      yearlyPrice: "Rs. 30,000",
      per: "per month",
      icon: BarChart,
      popular: true
    },
    {
      name: "On-site Training",
      description: "In-person training sessions",
      price: "Rs. 10,000",
      per: "one-time",
      icon: Headphones,
      popular: false
    },
    {
      name: "Hardware Bundle",
      description: "POS printer, scanner, tablet",
      price: "Rs. 60,000+",
      per: "one-time",
      icon: CreditCard,
      popular: true
    }
  ];

  const hardwareBundles = [
    {
      name: "Basic Bundle",
      price: "Rs. 60,000",
      devices: ["Thermal Printer", "Barcode Scanner", "Tablet Stand"],
      bestFor: "Small shops & startups"
    },
    {
      name: "Professional Bundle",
      price: "Rs. 90,000",
      devices: ["2x Thermal Printers", "Wireless Scanner", "iPad + Stand", "Cash Drawer"],
      bestFor: "Medium retail stores",
      popular: true
    },
    {
      name: "Enterprise Bundle",
      price: "Rs. 120,000+",
      devices: ["Multiple Printers", "Advanced Scanners", "Complete POS Station", "Customer Display"],
      bestFor: "Large retail chains"
    }
  ];

  const faqs = [
    {
      question: "Is there a setup fee?",
      answer: "No, there are no setup fees for any of our plans. You only pay the monthly subscription fee."
    },
    {
      question: "Can I switch plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect in your next billing cycle."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept JazzCash, Easypaisa, bank transfers, and credit/debit cards for Pakistani customers."
    },
    {
      question: "Is there a contract or long-term commitment?",
      answer: "No, all plans are month-to-month. You can cancel anytime without penalties."
    },
    {
      question: "Do you offer discounts for annual payments?",
      answer: "Yes, save up to 20% when you pay annually instead of monthly."
    },
    {
      question: "What happens after the free trial?",
      answer: "After 14 days, you'll be prompted to choose a paid plan. No charges until the trial ends."
    }
  ];

  const includedInAll = [
    { text: "14-day free trial", icon: Zap },
    { text: "No setup fees", icon: CreditCard },
    { text: "Cancel anytime", icon: X },
    { text: "99.9% uptime", icon: Shield },
    { text: "Security updates", icon: Shield },
    { text: "Email support", icon: Headphones }
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
              Simple, Transparent
              <span className="text-blue-600 block">Pricing for Pakistan</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Choose the perfect plan for your retail business. All plans include 14-day free trial with no credit card required.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white rounded-full p-1 shadow-lg mb-10">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  billingCycle === "yearly"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Yearly Billing
                <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Included in All Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Included in All Plans
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {includedInAll.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-4 text-center border border-gray-200"
              >
                <item.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        <section className="mb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${
                  plan.popular ? "md:-translate-y-4" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div
                  className={`h-full rounded-2xl border-2 ${
                    plan.popular
                      ? "border-purple-500 shadow-2xl"
                      : "border-gray-200 shadow-xl"
                  } bg-white overflow-hidden`}
                >
                  {/* Plan Header */}
                  <div className="p-8 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold ${
                          plan.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                          plan.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {plan.subtitle}
                        </span>
                      </div>
                      <plan.icon className={`h-10 w-10 ${
                        plan.color === 'blue' ? 'text-blue-600' :
                        plan.color === 'purple' ? 'text-purple-600' :
                        'text-indigo-600'
                      }`} />
                    </div>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900">
                          {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                        </span>
                        <span className="text-gray-600 ml-2">
                          {billingCycle === "monthly" ? "/month" : "/year"}
                        </span>
                      </div>
                      {billingCycle === "yearly" && plan.yearlySavings && (
                        <p className="text-green-600 font-semibold text-sm mt-1">
                          {plan.yearlySavings}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Plan Features */}
                  <div className="p-8">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={feature.included ? "text-gray-700" : "text-gray-400"}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                          : plan.id === "enterprise"
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                      } shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                    >
                      {plan.cta}
                    </button>

                    <p className="text-center text-gray-500 text-sm mt-4">
                      {plan.id === "enterprise" 
                        ? "Custom pricing based on requirements" 
                        : "14-day free trial • No credit card required"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Add-on Services */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Add-on Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhance your plan with these optional services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {addons.map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white rounded-xl border-2 ${
                  addon.popular ? "border-blue-500" : "border-gray-200"
                } p-6 hover:shadow-lg transition-all`}
              >
                {addon.popular && (
                  <span className="absolute -top-2 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                    Popular
                  </span>
                )}
                <addon.icon className="h-10 w-10 text-blue-600 mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">{addon.name}</h4>
                <p className="text-gray-600 text-sm mb-4">{addon.description}</p>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {billingCycle === "monthly" && addon.monthlyPrice ? addon.monthlyPrice : addon.price}
                  </span>
                  <span className="text-gray-600 text-sm ml-1">{addon.per}</span>
                </div>
                <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                  Add to Plan
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Hardware Bundles */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hardware Bundles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete POS hardware solutions for Pakistani businesses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {hardwareBundles.map((bundle, index) => (
              <motion.div
                key={bundle.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-2xl border-2 ${
                  bundle.popular ? "border-blue-500 shadow-xl" : "border-gray-200 shadow-lg"
                } p-8`}
              >
                {bundle.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Best Value
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{bundle.name}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-6">{bundle.price}</div>
                <p className="text-gray-600 mb-6">Includes:</p>
                <ul className="space-y-3 mb-8">
                  {bundle.devices.map((device, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      {device}
                    </li>
                  ))}
                </ul>
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">Best for: {bundle.bestFor}</p>
                  <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                    Configure Bundle
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to common questions about our pricing and plans
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start">
                  <HelpCircle className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Plan Comparison
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Detailed comparison of all plan features
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-6 font-semibold text-gray-900">Features</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Starter</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Professional</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ["Monthly Price", "Rs. 3,000", "Rs. 6,500", "Custom"],
                    ["Yearly Price (Save 20%)", "Rs. 30,000", "Rs. 65,000", "Custom"],
                    ["Branches", "1", "Up to 5", "Unlimited"],
                    ["POS Terminals", "2", "10", "Unlimited"],
                    ["Inventory Management", "Basic", "Advanced", "Enterprise"],
                    ["Multi-store Sync", "❌", "✅", "✅"],
                    ["Purchase Orders", "❌", "✅", "✅"],
                    ["Barcode Labels", "❌", "✅", "✅"],
                    ["API Access", "❌", "Basic", "Full"],
                    ["Custom Reports", "❌", "✅", "✅"],
                    ["Dedicated Support", "Email", "Priority", "24/7"],
                    ["SLA Guarantee", "❌", "❌", "✅"]
                  ].map(([feature, starter, pro, enterprise], index) => (
                    <tr key={feature} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-4 font-medium text-gray-900">{feature}</td>
                      <td className="p-4 text-center">{starter}</td>
                      <td className="p-4 text-center">{pro}</td>
                      <td className="p-4 text-center">{enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of Pakistani retailers who trust HybridPOS to power their business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/signup"
                className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center shadow-2xl"
              >
                Start 14-Day Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/demo"
                className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center"
              >
                <Smartphone className="h-5 w-5 mr-2" />
                Schedule Live Demo
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center text-white">
                <Shield className="h-5 w-5 mr-2" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center justify-center text-white">
                <Globe className="h-5 w-5 mr-2" />
                <span>Made for Pakistan</span>
              </div>
              <div className="flex items-center justify-center text-white">
                <Database className="h-5 w-5 mr-2" />
                <span>99.9% uptime</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}