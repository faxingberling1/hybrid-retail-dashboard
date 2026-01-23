"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Package, Users, CreditCard, Printer, BarChart, CloudOff, Shield } from "lucide-react";

const features = [
  {
    icon: ShoppingCart,
    title: "Web & Tablet POS",
    description: "Responsive POS that works on any device with offline capability",
  },
  {
    icon: Package,
    title: "Smart Inventory",
    description: "Real-time stock tracking across all branches and warehouses",
  },
  {
    icon: Users,
    title: "Multi-Store Management",
    description: "Manage franchise and chain stores from a single dashboard",
  },
  {
    icon: CreditCard,
    title: "Payment Integration",
    description: "JazzCash, Easypaisa, cards, and cash payment processing",
  },
  {
    icon: Printer,
    title: "Print Routing",
    description: "Print to kitchen, bar, or multiple printers simultaneously",
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description: "Sales reports, inventory insights, and business intelligence",
  },
  {
    icon: CloudOff,
    title: "Offline Mode",
    description: "Continue operations during internet outages with auto-sync",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Role-based access control and data encryption",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Run Your Retail Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive suite of tools designed for modern retail operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card"
            >
              <div className="inline-flex p-3 bg-primary-100 rounded-lg mb-4">
                <feature.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
