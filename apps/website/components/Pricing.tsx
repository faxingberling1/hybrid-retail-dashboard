"use client";

import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";

const plans = [
  {
    name: "Starter",
    subtitle: "SME Package",
    price: "Rs. 3,000",
    period: "/month",
    features: [
      "Single branch/store",
      "POS + Inventory management",
      "Basic sales reports",
      "Customer management",
      "Barcode scanning",
      "Receipt printing",
      "Email support",
    ],
    notIncluded: [
      "Multi-branch support",
      "Purchase orders",
      "Advanced analytics",
    ],
    cta: "Start Free Trial",
    popular: false,
    color: "blue",
  },
  {
    name: "Professional",
    subtitle: "Franchise Package",
    price: "Rs. 6,500",
    period: "/month",
    features: [
      "Up to 5 branches",
      "Purchase orders & supplier management",
      "Barcode label printing",
      "Manager roles & permissions",
      "Advanced inventory tracking",
      "Sales analytics",
      "Priority email & phone support",
      "API access (basic)",
    ],
    notIncluded: [
      "Central catalog management",
      "Distributor integration",
      "Custom BI dashboards",
    ],
    cta: "Get Started",
    popular: true,
    color: "purple",
  },
  {
    name: "Enterprise",
    subtitle: "Custom Solutions",
    price: "From Rs. 20,000",
    period: "/month",
    features: [
      "Unlimited branches & franchises",
      "Central catalog management",
      "Distributor integration portal",
      "Full API access",
      "Custom BI dashboards",
      "Dedicated account manager",
      "24/7 priority support",
      "White-label option",
      "Custom integrations",
      "On-site training (optional)",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false,
    color: "indigo",
  },
];

const addons = [
  {
    name: "Extra Devices",
    price: "Rs. 1,500",
    description: "per device/month",
  },
  {
    name: "SMS Receipts",
    price: "Rs. 1,000",
    description: "per month",
  },
  {
    name: "Online BI Reports",
    price: "Rs. 3,000",
    description: "per month",
  },
  {
    name: "On-site Training",
    price: "Rs. 10,000",
    description: "one-time",
  },
  {
    name: "Hardware Bundle",
    price: "Rs. 60,000+",
    description: "POS printer, scanner, tablet",
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Designed for retailers in Pakistan. Start with Starter, grow with Professional, scale with Enterprise.
          </p>
        </div>

        {/* Main Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-white rounded-2xl p-8 relative border ${
                plan.popular
                  ? "border-purple-500 shadow-xl transform md:-translate-y-4"
                  : "border-gray-200 shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    plan.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                    plan.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                    'bg-indigo-100 text-indigo-800'
                  }`}>
                    {plan.subtitle}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{plan.subtitle}</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.notIncluded.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-500 mb-2">Not included:</p>
                  <ul className="space-y-2">
                    {plan.notIncluded.map((item) => (
                      <li key={item} className="flex items-start text-sm text-gray-600">
                        <Plus className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                  plan.popular
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : plan.name === "Enterprise"
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Add-ons Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Add-on Services
            </h3>
            <p className="text-gray-600">
              Enhance your plan with these optional services
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {addons.map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-gray-900 mb-2">{addon.name}</h4>
                <div className="mb-2">
                  <span className="text-2xl font-bold text-blue-600">{addon.price}</span>
                  <span className="text-gray-600 text-sm ml-1">{addon.description}</span>
                </div>
                <button className="w-full mt-2 py-2 px-4 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                  Add to Plan
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600">
              All plans include 14-day free trial • No setup fees • Cancel anytime
            </p>
            <p className="text-sm text-gray-500 mt-2">
              * Hardware bundles include thermal printer, barcode scanner, and tablet stand
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;