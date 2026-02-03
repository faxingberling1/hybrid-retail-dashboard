// app/auth/signup/steps/industry-selection.tsx
'use client'

import { 
  Pill, 
  ShoppingBag, 
  GraduationCap, 
  Stethoscope,
  Home,
  Utensils,
  Car,
  Building2,
  Factory,
  Coffee
} from 'lucide-react'

const INDUSTRIES = [
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    description: 'Manage medications, prescriptions, and patient records',
    icon: Pill,
    color: 'bg-blue-100 text-blue-600 border-blue-200',
    features: ['Prescription Management', 'Inventory Tracking', 'Patient Records']
  },
  {
    id: 'fashion',
    name: 'Fashion & Retail',
    description: 'Track inventory, manage orders, and analyze fashion trends',
    icon: ShoppingBag,
    color: 'bg-pink-100 text-pink-600 border-pink-200',
    features: ['Inventory Management', 'Order Processing', 'Trend Analysis']
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Cafe',
    description: 'Menu management, table reservations, and order processing',
    icon: Utensils,
    color: 'bg-amber-100 text-amber-600 border-amber-200',
    features: ['Menu Management', 'Table Reservations', 'Order Processing']
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Patient management, appointments, and medical records',
    icon: Stethoscope,
    color: 'bg-red-100 text-red-600 border-red-200',
    features: ['Patient Records', 'Appointment Scheduling', 'Billing']
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Manage students, courses, and educational resources',
    icon: GraduationCap,
    color: 'bg-green-100 text-green-600 border-green-200',
    features: ['Student Management', 'Course Scheduling', 'Resource Library']
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    description: 'Property management, listings, and client relationships',
    icon: Home,
    color: 'bg-purple-100 text-purple-600 border-purple-200',
    features: ['Property Listings', 'Client CRM', 'Document Management']
  },
  {
    id: 'automotive',
    name: 'Automotive',
    description: 'Vehicle inventory, service management, and customer tracking',
    icon: Car,
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    features: ['Vehicle Inventory', 'Service Records', 'Customer Tracking']
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Production planning, quality control, and supply chain',
    icon: Factory,
    color: 'bg-indigo-100 text-indigo-600 border-indigo-200',
    features: ['Production Planning', 'Quality Control', 'Supply Chain']
  },
  {
    id: 'cafe',
    name: 'Coffee Shop',
    description: 'Point of sale, inventory, and customer loyalty programs',
    icon: Coffee,
    color: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    features: ['Point of Sale', 'Inventory', 'Loyalty Programs']
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'General business operations, HR, and project management',
    icon: Building2,
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    features: ['HR Management', 'Project Tracking', 'Document Collaboration']
  }
]

export default function IndustrySelection({ formData, updateFormData }: any) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Select Your Industry</h2>
        <p className="text-gray-600">
          Choose your industry to get customized features and workflows for your business.
          Don't worry, you can always change this later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INDUSTRIES.map((industry) => {
          const Icon = industry.icon
          const isSelected = formData.industry === industry.id
          
          return (
            <button
              key={industry.id}
              type="button"
              onClick={() => updateFormData({ industry: industry.id })}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg ${industry.color} ${isSelected ? 'ring-2 ring-blue-200' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{industry.name}</h3>
                    {isSelected && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{industry.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {industry.features.map(feature => (
                      <span
                        key={feature}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {formData.industry && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <div className="p-1.5 bg-blue-100 rounded mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">
                {INDUSTRIES.find(i => i.id === formData.industry)?.name} selected
              </p>
              <p className="text-sm text-blue-700 mt-1">
                You'll get customized features for your industry including: {
                  INDUSTRIES.find(i => i.id === formData.industry)?.features.join(', ')
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}