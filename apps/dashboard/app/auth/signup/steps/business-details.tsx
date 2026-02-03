// app/auth/signup/steps/business-details.tsx
'use client'

import { useState } from 'react'
import { Building2, Users, MapPin, Clock } from 'lucide-react'

const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Partnership',
  'LLC',
  'Corporation',
  'Non-Profit',
  'Other'
]

const EMPLOYEE_RANGES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+'
]

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'India',
  'Germany',
  'France',
  'Japan',
  'China',
  'Other'
]

const TIMEZONES = [
  'UTC',
  'EST (UTC-5)',
  'CST (UTC-6)',
  'PST (UTC-8)',
  'GMT (UTC+0)',
  'CET (UTC+1)',
  'IST (UTC+5:30)',
  'AEST (UTC+10)'
]

export default function BusinessDetails({ formData, updateFormData }: any) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors }
    
    if (!value.trim()) {
      newErrors[field] = 'This field is required'
    } else {
      delete newErrors[field]
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Business Details</h2>
        <p className="text-gray-600">
          Tell us about your business. This information helps us customize your dashboard.
        </p>
      </div>

      <div className="space-y-6">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-gray-500" />
              Business Name *
            </div>
          </label>
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => {
              updateFormData({ businessName: e.target.value })
              validateField('businessName', e.target.value)
            }}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.businessName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your business name"
          />
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type *
            </label>
            <select
              value={formData.businessType}
              onChange={(e) => {
                updateFormData({ businessType: e.target.value })
                validateField('businessType', e.target.value)
              }}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.businessType ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select business type</option>
              {BUSINESS_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.businessType && (
              <p className="mt-1 text-sm text-red-600">{errors.businessType}</p>
            )}
          </div>

          {/* Employee Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                Employee Count
              </div>
            </label>
            <select
              value={formData.employees}
              onChange={(e) => updateFormData({ employees: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {EMPLOYEE_RANGES.map(range => (
                <option key={range} value={range}>{range} employees</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                Country *
              </div>
            </label>
            <select
              value={formData.country}
              onChange={(e) => {
                updateFormData({ country: e.target.value })
                validateField('country', e.target.value)
              }}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.country ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select country</option>
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-500" />
                Timezone
              </div>
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => updateFormData({ timezone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Industry Info (if selected in previous step) */}
      {formData.industry && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <div className="p-1.5 bg-blue-100 rounded mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">
                Your {formData.industry.charAt(0).toUpperCase() + formData.industry.slice(1)} Dashboard
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Based on your industry selection, we'll customize features like inventory management, 
                customer relations, and reporting specifically for your business type.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}