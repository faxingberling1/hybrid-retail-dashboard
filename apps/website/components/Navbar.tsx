"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, Phone, MessageSquare, FileText } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Features", href: "/features", icon: null },
    { name: "Pricing", href: "/pricing", icon: null },
    { name: "Industries", href: "/industries", icon: null },
    { name: "Demo", href: "/demo", icon: <MessageSquare className="h-4 w-4 mr-1" /> },
    { name: "Contact", href: "/contact", icon: <Phone className="h-4 w-4 mr-1" /> },
    { name: "Blog", href: "/blog", icon: <FileText className="h-4 w-4 mr-1" /> },
  ];

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with Home Link */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-blue-600 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 leading-tight">HybridPOS</span>
              <span className="text-xs text-blue-600 font-medium">Retail Management System</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                Sign In
              </Link>
              <Link href="/signup" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                Start Free Trial
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t">
              <Link
                href="/login"
                className="block px-3 py-3 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block bg-blue-600 text-white px-3 py-3 rounded-lg font-semibold hover:bg-blue-700 text-center shadow-sm"
                onClick={() => setIsOpen(false)}
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;