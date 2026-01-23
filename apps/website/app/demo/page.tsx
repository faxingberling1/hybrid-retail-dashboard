"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, Video, CheckCircle, ArrowRight, Play, Shield, Zap, BarChart } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Live Product Walkthrough",
    description: "See HybridPOS in action with real-time demonstration",
  },
  {
    icon: Users,
    title: "One-on-One Consultation",
    description: "Personalized session with our retail experts",
  },
  {
    icon: BarChart,
    title: "Business Analysis",
    description: "Get insights tailored to your retail operations",
  },
  {
    icon: Shield,
    title: "No Sales Pressure",
    description: "Educational session focused on your needs",
  },
];

const demoOptions = [
  {
    id: "quick",
    title: "Quick Overview",
    duration: "15 min",
    description: "Basic features and pricing",
    bestFor: "Small businesses",
  },
  {
    id: "standard",
    title: "Standard Demo",
    duration: "30 min",
    description: "Detailed walkthrough + Q&A",
    bestFor: "Most retailers",
    popular: true,
  },
  {
    id: "enterprise",
    title: "Enterprise Consultation",
    duration: "60 min",
    description: "Deep dive + customization options",
    bestFor: "Multi-store chains",
  },
];

export default function DemoPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    storeCount: "",
    demoType: "standard",
    date: "",
    time: "",
    requirements: "",
  });

  const industries = [
    "Fashion & Apparel",
    "Electronics",
    "Supermarket/Grocery",
    "Pharmacy",
    "Restaurant/Cafe",
    "Wholesale/Distributor",
    "Other",
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log("Form submitted:", formData);
    setStep(4); // Move to success step
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              See HybridPOS in Action
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Book a personalized demo and discover how HybridPOS can transform your retail business.
              No commitment required.
            </p>
            
            <div className="inline-flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-medium">15-60 minute sessions</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Flexible scheduling</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium">One-on-one consultation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Progress Steps */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-2">
                  {[1, 2, 3].map((stepNum) => (
                    <div key={stepNum} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {stepNum}
                      </div>
                      {stepNum < 3 && (
                        <div className={`w-24 h-1 mx-4 ${
                          step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Your Details</span>
                  <span>Demo Preferences</span>
                  <span>Confirmation</span>
                </div>
              </div>

              {/* Step 1: Contact Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Tell us about yourself
                  </h2>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="John Ahmed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+92 300 1234567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Your Retail Store"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry *
                      </label>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select your industry</option>
                        {industries.map((industry) => (
                          <option key={industry} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Stores/Branches
                      </label>
                      <select
                        name="storeCount"
                        value={formData.storeCount}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select number of stores</option>
                        <option value="1">1 store</option>
                        <option value="2-5">2-5 stores</option>
                        <option value="6-10">6-10 stores</option>
                        <option value="10+">More than 10 stores</option>
                      </select>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center"
                      >
                        Continue
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Demo Preferences */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Choose your demo preferences
                  </h2>
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Demo Type
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {demoOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                            formData.demoType === option.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          } ${option.popular ? 'ring-2 ring-blue-200' : ''}`}
                        >
                          <input
                            type="radio"
                            name="demoType"
                            value={option.id}
                            checked={formData.demoType === option.id}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          {option.popular && (
                            <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                              Most Popular
                            </span>
                          )}
                          <div className="text-center">
                            <h4 className="font-semibold text-gray-900">{option.title}</h4>
                            <div className="text-2xl font-bold text-blue-600 my-2">{option.duration}</div>
                            <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                            <p className="text-xs text-gray-500">Best for: {option.bestFor}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select time slot</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time} PKT
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Any specific requirements or questions?
                    </label>
                    <textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us what you'd like to focus on during the demo..."
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center"
                    >
                      Review & Schedule
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review & Confirm */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Review your demo request
                  </h2>
                  
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="font-semibold text-gray-900 mb-4">Demo Details</h3>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">{formData.name || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{formData.email || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{formData.phone || "Not provided"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Company</p>
                          <p className="font-medium">{formData.company || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Demo Type</p>
                            <p className="font-medium">
                              {demoOptions.find(d => d.id === formData.demoType)?.title || "Standard Demo"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="font-medium">{formData.date || "Not selected"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Time</p>
                            <p className="font-medium">{formData.time || "Not selected"}</p>
                          </div>
                        </div>
                      </div>

                      {formData.requirements && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-gray-600">Special Requirements</p>
                          <p className="font-medium">{formData.requirements}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start mb-6">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                      I agree to receive the demo confirmation and follow-up emails. I understand that I can unsubscribe at any time.
                    </label>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Schedule Demo
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Demo Scheduled Successfully!
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We've sent a confirmation email to {formData.email} with your demo details and calendar invite.
                  </p>
                  <div className="bg-blue-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
                    <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
                    <ul className="text-left space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Check your email for the calendar invite
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Add the meeting to your calendar
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Test your video conferencing setup
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        Prepare any questions you have
                      </li>
                    </ul>
                  </div>
                  <div className="space-x-4">
                    <a
                      href="/"
                      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                    >
                      Return to Homepage
                    </a>
                    <a
                      href="/contact"
                      className="inline-block border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50"
                    >
                      Contact Support
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="space-y-8">
            {/* Demo Features */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What to Expect in Your Demo
              </h3>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <feature.icon className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{feature.title}</p>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Demo Video */}
            <div className="bg-gray-900 rounded-2xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Quick Preview
                </h3>
                <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-blue-600 ml-1" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Watch a 2-minute overview of HybridPOS features
                </p>
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Need Help Scheduling?
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Email us at:</p>
                  <a href="mailto:demo@hybridpos.pk" className="text-blue-600 font-medium hover:underline">
                    demo@hybridpos.pk
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Call us at:</p>
                  <a href="tel:+923001234567" className="text-blue-600 font-medium hover:underline">
                    +92 300 123 4567
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available:</p>
                  <p className="font-medium">Mon-Fri, 9AM-6PM PKT</p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-gray-900">100% Risk-Free</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <Zap className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                  No credit card required
                </li>
                <li className="flex items-center">
                  <Zap className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                  No obligation to purchase
                </li>
                <li className="flex items-center">
                  <Zap className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                  Cancel anytime
                </li>
                <li className="flex items-center">
                  <Zap className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
                  All data kept private
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 pb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "What do I need to prepare for the demo?",
                a: "Just have your questions ready! We recommend thinking about your current pain points and what you'd like to achieve with a new POS system.",
              },
              {
                q: "Can I invite my team members?",
                a: "Absolutely! You can invite up to 5 team members to join the demo session.",
              },
              {
                q: "What if I need to reschedule?",
                a: "No problem! You can reschedule up to 2 hours before your scheduled demo time.",
              },
              {
                q: "Will I get a recording of the demo?",
                a: "Yes, we'll send you a recording of the demo session along with any materials discussed.",
              },
              {
                q: "Do you offer on-site demos?",
                a: "Yes, we offer on-site demos for enterprise clients in major Pakistani cities.",
              },
              {
                q: "How soon can I start using HybridPOS after the demo?",
                a: "You can start your 14-day free trial immediately after the demo if you choose to proceed.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}