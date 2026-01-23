"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Users,
  CheckCircle,
  Send,
  Building,
  Globe,
  Shield
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      details: "+92 300 123 4567",
      subtitle: "Available Mon-Fri, 9AM-6PM PKT",
      color: "from-blue-500 to-blue-600",
      link: "tel:+923001234567"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: "info@hybridpos.pk",
      subtitle: "We'll respond within 24 hours",
      color: "from-purple-500 to-purple-600",
      link: "mailto:info@hybridpos.pk"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Karachi, Lahore, Islamabad",
      subtitle: "Offices across Pakistan",
      color: "from-green-500 to-green-600",
      link: "#locations"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      details: "Available on website",
      subtitle: "Chat with our support team",
      color: "from-orange-500 to-orange-600",
      link: "#chat"
    }
  ];

  const departments = [
    {
      name: "Sales",
      email: "sales@hybridpos.pk",
      phone: "+92 300 123 4568",
      description: "For pricing, demos, and partnership inquiries"
    },
    {
      name: "Support",
      email: "support@hybridpos.pk",
      phone: "+92 300 123 4569",
      description: "Technical support and troubleshooting"
    },
    {
      name: "Billing",
      email: "billing@hybridpos.pk",
      phone: "+92 300 123 4570",
      description: "Billing and account management"
    },
    {
      name: "Partnerships",
      email: "partners@hybridpos.pk",
      phone: "+92 300 123 4571",
      description: "Reseller and partnership programs"
    }
  ];

  const locations = [
    {
      city: "Karachi",
      address: "Clifton, Karachi",
      phone: "+92 21 12345678",
      hours: "Mon-Fri: 9AM-6PM"
    },
    {
      city: "Lahore",
      address: "Gulberg, Lahore",
      phone: "+92 42 12345678",
      hours: "Mon-Fri: 9AM-6PM"
    },
    {
      city: "Islamabad",
      address: "F-7, Islamabad",
      phone: "+92 51 12345678",
      hours: "Mon-Fri: 9AM-6PM"
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Get in Touch with <span className="text-blue-600">HybridPOS</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              We're here to help you transform your retail business. Reach out to our team for support, 
              sales inquiries, or partnership opportunities.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.title}
              href={method.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${method.color} text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <method.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold ml-4">{method.title}</h3>
              </div>
              <p className="text-lg font-bold mb-1">{method.details}</p>
              <p className="text-white/80 text-sm">{method.subtitle}</p>
            </motion.a>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
                <p className="text-gray-600">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h3>
                  <p className="text-gray-600 mb-8">
                    Thank you for contacting HybridPOS. We'll get back to you soon.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="John Ahmed"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="+92 300 1234567"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Your Retail Store"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="">Select a subject</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Departments Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                Contact Specific Departments
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {departments.map((dept, index) => (
                  <motion.div
                    key={dept.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-gray-900 text-lg mb-2">{dept.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
                    <div className="space-y-2">
                      <a href={`mailto:${dept.email}`} className="flex items-center text-blue-600 hover:text-blue-700">
                        <Mail className="h-4 w-4 mr-2" />
                        {dept.email}
                      </a>
                      <a href={`tel:${dept.phone}`} className="flex items-center text-blue-600 hover:text-blue-700">
                        <Phone className="h-4 w-4 mr-2" />
                        {dept.phone}
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Info & Locations */}
          <div className="space-y-8">
            {/* Business Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2 text-blue-600" />
                Business Hours
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Monday - Friday</span>
                  <span className="font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Saturday</span>
                  <span className="font-semibold">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Sunday</span>
                  <span className="font-semibold">Emergency Support Only</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-blue-200">
                <div className="flex items-center text-gray-700 mb-2">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  <span>All times in Pakistan Standard Time (PKT)</span>
                </div>
              </div>
            </motion.div>

            {/* Office Locations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Our Offices
              </h3>
              <div className="space-y-6">
                {locations.map((location, index) => (
                  <div key={location.city} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <h4 className="font-semibold text-gray-900 mb-2">{location.city}</h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600 flex items-start">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                        {location.address}
                      </p>
                      <a href={`tel:${location.phone}`} className="text-blue-600 hover:text-blue-700 flex items-center">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                        {location.phone}
                      </a>
                      <p className="text-gray-600 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        {location.hours}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Why Choose Us */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-400" />
                Why Choose HybridPOS
              </h3>
              <ul className="space-y-3">
                {[
                  "24/7 Customer Support",
                  "Dedicated Account Managers",
                  "99.9% Uptime Guarantee",
                  "Bank-level Security",
                  "Regular Feature Updates",
                  "Free Onboarding & Training"
                ].map((item, index) => (
                  <li key={item} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                Quick Links
              </h3>
              <div className="space-y-3">
                <a href="/faq" className="block text-blue-600 hover:text-blue-700 hover:underline">
                  Frequently Asked Questions
                </a>
                <a href="/support" className="block text-blue-600 hover:text-blue-700 hover:underline">
                  Support Documentation
                </a>
                <a href="/demo" className="block text-blue-600 hover:text-blue-700 hover:underline">
                  Book a Demo
                </a>
                <a href="/pricing" className="block text-blue-600 hover:text-blue-700 hover:underline">
                  View Pricing
                </a>
                <a href="/blog" className="block text-blue-600 hover:text-blue-700 hover:underline">
                  Read Our Blog
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Find Us in Pakistan</h3>
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 text-center">
            <div className="aspect-video bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Pakistan Offices</h4>
                <p className="text-gray-600">Karachi • Lahore • Islamabad</p>
                <p className="text-gray-500 text-sm mt-2">Interactive map coming soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-10 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Our team is ready to help you find the perfect retail management solution for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+923001234567"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Now: +92 300 123 4567
            </a>
            <a
              href="/demo"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center justify-center"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Book Free Consultation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}