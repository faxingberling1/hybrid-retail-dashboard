"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Smartphone, Coffee, Pill, Store, Truck } from "lucide-react";

const industries = [
  {
    name: "Fashion & Apparel",
    icon: ShoppingBag,
    features: ["Size/color variants", "Seasonal collections", "Multi-store sync"],
    color: "pink",
  },
  {
    name: "Electronics",
    icon: Smartphone,
    features: ["Serial number tracking", "Warranty management", "Technical specs"],
    color: "blue",
  },
  {
    name: "Supermarkets",
    icon: Store,
    features: ["Perishable tracking", "Bulk items", "Quick checkout"],
    color: "green",
  },
  {
    name: "Pharmacies",
    icon: Pill,
    features: ["Expiry date tracking", "Prescription management", "Regulatory compliance"],
    color: "red",
  },
  {
    name: "Restaurants & Cafes",
    icon: Coffee,
    features: ["Table management", "Kitchen printing", "Menu variations"],
    color: "amber",
  },
  {
    name: "Wholesale/Distributors",
    icon: Truck,
    features: ["B2B ordering", "Credit terms", "Bulk pricing"],
    color: "indigo",
  },
];

const Industries = () => {
  return (
    <section id="industries" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built for Every Retail Sector
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tailored solutions for different retail businesses across Pakistan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-xl bg-${industry.color}-100 mr-4`}>
                  <industry.icon className={`h-6 w-6 text-${industry.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{industry.name}</h3>
              </div>
              <ul className="space-y-2">
                {industry.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t">
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Learn more →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Don't see your industry?{" "}
            <a href="/contact" className="text-blue-600 font-semibold hover:underline">
              Contact us for a custom solution
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Industries;