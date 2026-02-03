// app/auth/signup/steps/admin-setup.tsx
'use client'

import { useState } from 'react'
import { User, Mail, Lock, Phone, Eye, EyeOff, Check, X } from 'lucide-react'
import { validatePasswordStrength } from '@/lib/auth-utils'

export default function AdminSetup({ formData, updateFormData }: any) {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ isValid: false, errors: [] as string[] })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors }
    
    if (!value.trim()) {
      newErrors[field] = 'This field is required'
    } else {
      // Email validation
      if (field === 'adminEmail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[field] = 'Please enter a valid email address'
      } else {
        delete newErrors[field]
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePasswordChange = (password: string) => {
    updateFormData({ adminPassword: password })
    const strength = validatePasswordStrength(password)
    setPasswordStrength(strength)
    validateField('adminPassword', password)
  }

  const getPasswordStrengthColor = () => {
    if (!formData.adminPassword) return 'bg-gray-200'
    if (formData.adminPassword.length < 4) return 'bg-red-500'
    if (formData.adminPassword.length < 8) return 'bg-yellow-500'
    if (passwordStrength.isValid) return 'bg-green-500'
    return 'bg-orange-500'
  }

  const getPasswordStrengthText = () => {
    if (!formData.adminPassword) return 'Enter a password'
    if (formData.adminPassword.length < 4) return 'Very Weak'
    if (formData.adminPassword.length < 8) return 'Weak'
    if (passwordStrength.isValid) return 'Strong'
    return 'Medium'
  }

  const passwordRequirements = [
    {
      text: 'At least 8 characters',
      met: formData.adminPassword?.length >= 8
    },
    {
      text: 'Contains uppercase letter',
      met: /[A-Z]/.test(formData.adminPassword || '')
    },
    {
      text: 'Contains lowercase letter',
      met: /[a-z]/.test(formData.adminPassword || '')
    },
    {
      text: 'Contains number (0-9)',
      met: /[0-9]/.test(formData.adminPassword || '')
    },
    {
      text: 'Contains special character',
      met: /[^A-Za-z0-9]/.test(formData.adminPassword || '')
    }
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Admin Account</h2>
        <p className="text-gray-600">
          This will be your main account to manage {formData.businessName || 'your business'} dashboard.
          You'll use these credentials to sign in.
        </p>
      </div>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              Full Name *
            </div>
          </label>
          <input
            type="text"
            value={formData.adminName}
            onChange={(e) => {
              updateFormData({ adminName: e.target.value })
              validateField('adminName', e.target.value)
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.adminName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.adminName && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <X className="w-4 h-4 mr-1" />
              {errors.adminName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-500" />
              Email Address *
            </div>
          </label>
          <input
            type="email"
            value={formData.adminEmail}
            onChange={(e) => {
              updateFormData({ adminEmail: e.target.value })
              validateField('adminEmail', e.target.value)
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.adminEmail ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="you@yourbusiness.com"
          />
          {errors.adminEmail && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <X className="w-4 h-4 mr-1" />
              {errors.adminEmail}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            This will be your username for logging in
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2 text-gray-500" />
                Password *
              </div>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.adminPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10 ${
                  errors.adminPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password strength indicator */}
            {formData.adminPassword && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Password strength:</span>
                  <span className={`text-sm font-semibold ${
                    passwordStrength.isValid ? 'text-green-600' : 
                    formData.adminPassword.length >= 8 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                  <div 
                    className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ 
                      width: `${Math.min(
                        (formData.adminPassword.length / 12) * 100, 
                        passwordStrength.isValid ? 100 : 85
                      )}%` 
                    }}
                  />
                </div>
                
                {/* Password requirements checklist */}
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Password must contain:</p>
                  <ul className="space-y-1.5">
                    {passwordRequirements.map((req, index) => (
                      <li 
                        key={index} 
                        className={`text-sm flex items-center ${req.met ? 'text-green-600' : 'text-gray-500'}`}
                      >
                        {req.met ? (
                          <Check className="w-4 h-4 mr-2 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 mr-2 flex-shrink-0 rounded-full border border-gray-300" />
                        )}
                        {req.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {errors.adminPassword && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <X className="w-4 h-4 mr-1" />
                {errors.adminPassword}
              </p>
            )}
          </div>

          {/* Phone (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                Phone Number (Optional)
              </div>
            </label>
            <input
              type="tel"
              value={formData.adminPhone}
              onChange={(e) => updateFormData({ adminPhone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="+1 (555) 123-4567"
            />
            <p className="mt-2 text-sm text-gray-500">
              For account recovery and important notifications
            </p>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Security Tips
          </h4>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start">
              <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              Use a unique password that you don't use elsewhere
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              Consider using a password manager to generate and store passwords
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              Enable two-factor authentication after setup for extra security
            </li>
            <li className="flex items-start">
              <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              Never share your password with anyone, including team members
            </li>
          </ul>
        </div>

        {/* Industry Info */}
        {formData.industry && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-5">
            <div className="flex items-start">
              <div className="p-2 bg-white rounded-lg mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">
                  {formData.industry.charAt(0).toUpperCase() + formData.industry.slice(1)} Admin Dashboard
                </h4>
                <p className="text-blue-700 text-sm">
                  As an administrator for your {formData.industry} business, you'll have access to:
                  inventory management, staff scheduling, customer analytics, and financial reports.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Validation Summary */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-700 mb-3">Account Setup Status</h4>
          <div className="space-y-3">
            {[
              { 
                label: 'Full name', 
                valid: !!formData.adminName.trim(),
                value: formData.adminName || 'Not provided'
              },
              { 
                label: 'Email address', 
                valid: !!formData.adminEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail),
                value: formData.adminEmail || 'Not provided'
              },
              { 
                label: 'Password strength', 
                valid: passwordStrength.isValid,
                value: passwordStrength.isValid ? 'Strong' : 'Needs improvement'
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${item.valid ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className={`text-sm font-medium ${item.valid ? 'text-green-600' : 'text-gray-500'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}