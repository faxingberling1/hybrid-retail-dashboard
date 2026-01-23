"use client";

import { motion } from "framer-motion";
import { 
  ShoppingBag, 
  Smartphone, 
  Store, 
  Pill, 
  Coffee, 
  Truck,
  Home,
  Watch,
  BookOpen,
  Gamepad2,
  Gem,
  Utensils,
  Bike,
  Droplets,
  Wrench,
  Music,
  Flower2,
  Palette,
  Trophy,
  Baby,
  Shirt
} from "lucide-react";
import Link from "next/link";

export default function IndustriesPage() {
  const featuredIndustries = [
    {
      icon: ShoppingBag,
      title: "Fashion & Apparel",
      description: "Complete solution for clothing stores, boutiques, and fashion retailers",
      color: "from-pink-500 to-rose-500",
      features: [
        "Size & color matrix management",
        "Seasonal collection tracking",
        "Multi-store fashion sync",
        "Fashion trend reporting",
        "Inventory by size/color"
      ],
      stats: ["250+ stores", "98% satisfaction", "₹45M+ monthly sales"],
      challenges: [
        "Managing size/color variants",
        "Seasonal inventory turnover",
        "Multiple store synchronization"
      ]
    },
    {
      icon: Smartphone,
      title: "Electronics",
      description: "Advanced inventory for electronics stores with serial number tracking",
      color: "from-blue-500 to-cyan-500",
      features: [
        "Serial number & IMEI tracking",
        "Warranty management system",
        "Accessory bundling",
        "Technical specifications database",
        "Repair & service tracking"
      ],
      stats: ["180+ stores", "95% efficiency", "₹60M+ monthly sales"],
      challenges: [
        "Warranty expiration tracking",
        "Serial number management",
        "Accessory inventory"
      ]
    },
    {
      icon: Store,
      title: "Supermarkets & Grocery",
      description: "Fast checkout and perishable management for grocery stores",
      color: "from-green-500 to-emerald-500",
      features: [
        "Perishable expiry tracking",
        "Bulk weighing & pricing",
        "Fast lane checkout",
        "Promotion management",
        "Supplier ordering"
      ],
      stats: ["120+ stores", "99% accuracy", "₹80M+ monthly sales"],
      challenges: [
        "Perishable stock management",
        "Quick customer checkout",
        "Promotion tracking"
      ]
    },
    {
      icon: Pill,
      title: "Pharmacies",
      description: "Compliant solution for medical stores and pharmacy chains",
      color: "from-red-500 to-orange-500",
      features: [
        "Medicine expiry tracking",
        "Prescription management",
        "Regulatory compliance",
        "Medicine categorization",
        "Batch number tracking"
      ],
      stats: ["300+ stores", "100% compliant", "₹35M+ monthly sales"],
      challenges: [
        "Expiry date management",
        "Prescription records",
        "Regulatory compliance"
      ]
    }
  ];

  const otherIndustries = [
    {
      icon: Coffee,
      title: "Restaurants & Cafes",
      description: "Table management, kitchen printing, and menu variations",
      features: ["Table management", "Kitchen printing", "Menu variations", "Delivery integration"]
    },
    {
      icon: Truck,
      title: "Wholesale & Distributors",
      description: "B2B ordering, credit terms, and bulk pricing management",
      features: ["B2B portal", "Credit management", "Bulk orders", "Distributor network"]
    },
    {
      icon: Home,
      title: "Home & Furniture",
      description: "Large item inventory and delivery scheduling",
      features: ["Delivery scheduling", "Assembly tracking", "Showroom management", "Custom orders"]
    },
    {
      icon: Watch,
      title: "Jewelry & Watches",
      description: "High-value item tracking and certificate management",
      features: ["Certificate tracking", "Stone grading", "Valuation records", "Security features"]
    },
    {
      icon: BookOpen,
      title: "Bookstores",
      description: "ISBN tracking and author/publisher management",
      features: ["ISBN database", "Author tracking", "Publisher management", "Genre categories"]
    },
    {
      icon: Gamepad2,
      title: "Gaming & Electronics",
      description: "Game title management and console inventory",
      features: ["Game titles", "Console inventory", "Accessory bundles", "Pre-order management"]
    },
    {
      icon: Gem,
      title: "Luxury Retail",
      description: "VIP customer management and high-value inventory",
      features: ["VIP management", "Appointment booking", "High-value tracking", "Personal shopping"]
    },
    {
      icon: Utensils,
      title: "Food & Beverage",
      description: "Recipe costing and ingredient inventory",
      features: ["Recipe costing", "Ingredient tracking", "Nutrition info", "Batch cooking"]
    },
    {
      icon: Bike,
      title: "Sports & Fitness",
      description: "Equipment rental and membership management",
      features: ["Equipment rental", "Membership plans", "Class scheduling", "Inventory tracking"]
    },
    {
      icon: Droplets,
      title: "Beauty & Cosmetics",
      description: "Expiry tracking and shade matching",
      features: ["Expiry tracking", "Shade matching", "Brand management", "Loyalty programs"]
    },
    {
      icon: Wrench,
      title: "Hardware Stores",
      description: "Bulk items and tool rental management",
      features: ["Bulk items", "Tool rental", "Project tracking", "Contractor accounts"]
    },
    {
      icon: Music,
      title: "Music Stores",
      description: "Instrument inventory and rental management",
      features: ["Instrument rental", "Sheet music", "Repair tracking", "Lesson scheduling"]
    }
  ];

  const solutions = [
    {
      title: "Multi-Store Management",
      description: "Manage all your locations from one dashboard",
      benefits: ["Centralized control", "Real-time sync", "Consolidated reporting"]
    },
    {
      title: "Pakistan Payment Integration",
      description: "Local payment gateways for seamless transactions",
      benefits: ["JazzCash Business", "Easypaisa Business", "Card payments"]
    },
    {
      title: "Inventory Optimization",
      description: "Smart stock management across all locations",
      benefits: ["Auto reordering", "Stock alerts", "Demand forecasting"]
    },
    {
      title: "Business Intelligence",
      description: "Advanced analytics for better decision making",
      benefits: ["Sales analytics", "Customer insights", "Performance tracking"]
    }
  ];

  const testimonials = [
    {
      name: "Ahmed Khan",
      role: "Owner, StyleHub Fashion",
      industry: "Fashion & Apparel",
      content: "HybridPOS transformed our 5-store fashion chain. The size/color matrix feature alone saved us 20 hours per week in inventory management.",
      rating: 5
    },
    {
      name: "Sara Ahmed",
      role: "Manager, TechWorld Electronics",
      industry: "Electronics",
      content: "Serial number tracking and warranty management features are game-changers for our electronics business. Customer satisfaction increased by 40%.",
      rating: 5
    },
    {
      name: "Bilal Raza",
      role: "CEO, FreshMart Supermarket",
      industry: "Supermarket",
      content: "The perishable tracking system reduced our food waste by 35%. Fast checkout features improved customer experience significantly.",
      rating: 5
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
              Built for Every
              <span className="text-blue-600 block">Retail Business in Pakistan</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              HybridPOS is tailored for different retail sectors across Pakistan. 
              Discover how we can transform your specific business needs.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Get Industry-Specific Demo
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Featured Industries */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Industries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive solutions for major retail sectors in Pakistan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredIndustries.map((industry, index) => (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl">
                  {/* Industry Header */}
                  <div className={`bg-gradient-to-br ${industry.color} p-8 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <industry.icon className="h-12 w-12" />
                      <div className="flex space-x-2">
                        {industry.stats.map((stat, idx) => (
                          <span key={idx} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                            {stat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{industry.title}</h3>
                    <p className="text-white/90">{industry.description}</p>
                  </div>

                  {/* Industry Content */}
                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                        <ul className="space-y-2">
                          {industry.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-gray-700">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Common Challenges</h4>
                        <ul className="space-y-2">
                          {industry.challenges.map((challenge, idx) => (
                            <li key={idx} className="flex items-center text-gray-700">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                              {challenge}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <Link
                        href={`/demo?industry=${industry.title.toLowerCase().replace(/ & /g, '-')}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Get {industry.title} Solution Details
                        <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Other Industries Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              More Retail Industries We Serve
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized solutions for various retail businesses
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {otherIndustries.map((industry, index) => (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all group"
              >
                <industry.icon className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{industry.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{industry.description}</p>
                <ul className="space-y-1">
                  {industry.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2 mt-1.5 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href="/contact"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium group-hover:underline"
                  >
                    Get Custom Solution →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Unified Solutions */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Unified Solutions for All Retailers
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powerful features that work across all industries
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {solutions.map((solution, index) => (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{solution.title}</h3>
                  <p className="text-gray-600 mb-4">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories from Pakistani Retailers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how businesses in your industry are thriving with HybridPOS
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {testimonial.industry}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">5.0 rating</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Industry Comparison */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industry-Specific Features Comparison
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how HybridPOS adapts to different retail needs
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-6 font-semibold text-gray-900">Features</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Fashion & Apparel</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Electronics</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Supermarkets</th>
                    <th className="text-center p-6 font-semibold text-gray-900">Pharmacies</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ["Size/Color Matrix", "✅", "❌", "❌", "❌"],
                    ["Serial Number Tracking", "❌", "✅", "❌", "✅"],
                    ["Perishable Tracking", "❌", "❌", "✅", "✅"],
                    ["Expiry Date Management", "❌", "❌", "✅", "✅"],
                    ["Bulk Weighing", "❌", "❌", "✅", "❌"],
                    ["Warranty Management", "❌", "✅", "❌", "❌"],
                    ["Prescription Tracking", "❌", "❌", "❌", "✅"],
                    ["Seasonal Collections", "✅", "❌", "❌", "❌"],
                    ["Fast Checkout", "✅", "✅", "✅", "✅"],
                    ["Multi-store Sync", "✅", "✅", "✅", "✅"]
                  ].map(([feature, fashion, electronics, supermarket, pharmacy], index) => (
                    <tr key={feature} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-4 font-medium text-gray-900">{feature}</td>
                      <td className="p-4 text-center">{fashion}</td>
                      <td className="p-4 text-center">{electronics}</td>
                      <td className="p-4 text-center">{supermarket}</td>
                      <td className="p-4 text-center">{pharmacy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Retail Business?
            </h2>
            <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
              Get an industry-specific demo tailored to your business needs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/demo"
                className="bg-white text-blue-600 px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center shadow-2xl"
              >
                Get Industry-Specific Demo
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center"
              >
                Talk to Industry Expert
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center text-white">
                <ShoppingBag className="h-5 w-5 mr-2" />
                <span>Fashion & Apparel Experts</span>
              </div>
              <div className="flex items-center justify-center text-white">
                <Smartphone className="h-5 w-5 mr-2" />
                <span>Electronics Specialists</span>
              </div>
              <div className="flex items-center justify-center text-white">
                <Store className="h-5 w-5 mr-2" />
                <span>Supermarket Consultants</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "Can HybridPOS handle my specific industry requirements?",
                a: "Yes! We have specialized features for different industries. Contact us for a custom demo of features specific to your business type."
              },
              {
                q: "Do you provide industry-specific training?",
                a: "Absolutely. Our onboarding includes industry-specific training to ensure your team makes the most of HybridPOS features."
              },
              {
                q: "Can I customize features for my industry?",
                a: "Yes, we offer customization options for enterprise clients to tailor the system to specific industry needs."
              },
              {
                q: "How quickly can you implement for my industry?",
                a: "Most implementations take 2-4 weeks, depending on business size and requirements. We prioritize industry-specific setups."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}