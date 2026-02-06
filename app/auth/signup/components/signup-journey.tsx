// app/auth/signup/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import IndustrySelection from '../steps/industry-selection'
import BusinessDetails from '../steps/business-details'
import AdminSetup from '../steps/admin-setup'
import UserInvitation from '../steps/user-invitation'
import Confirmation from '../steps/confirmation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'

const STEPS = [
  { id: 'industry', title: 'Industry', component: IndustrySelection },
  { id: 'business', title: 'Business Details', component: BusinessDetails },
  { id: 'admin', title: 'Admin Setup', component: AdminSetup },
  { id: 'users', title: 'Invite Team', component: UserInvitation },
  { id: 'confirm', title: 'Confirmation', component: Confirmation },
]

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    industry: '',
    businessName: '',
    businessType: '',
    employees: '1-10',
    country: '',
    timezone: '',
    adminEmail: '',
    adminPassword: '',
    adminName: '',
    adminPhone: '',
    userEmails: [] as string[],
    userRoles: [] as string[],
    termsAccepted: false,
    marketingEmails: false,
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const CurrentStepComponent = STEPS[currentStep].component
  const isLastStep = currentStep === STEPS.length - 1
  const isFirstStep = currentStep === 0

  const updateFormData = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fill in all required fields')
      return
    }

    if (isLastStep) {
      await handleSubmit()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        return !!formData.industry
      case 1:
        return !!(formData.businessName && formData.businessType && formData.country)
      case 2:
        return !!(formData.adminEmail && formData.adminPassword && formData.adminName)
      case 3:
        return true // User invitation is optional
      case 4:
        return formData.termsAccepted
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Account created successfully!')

        // Automatically sign in the user
        const signInResult = await signIn('credentials', {
          email: formData.adminEmail,
          password: formData.adminPassword,
          redirect: false,
        })

        if (signInResult && !signInResult.error) {
          setTimeout(() => {
            router.push(`/onboarding/${data.organizationId}`)
          }, 1000)
        } else {
          // If auto-signin fails, redirect to login
          router.push('/login?message=account-created')
        }
      } else {
        toast.error(data.error || 'Failed to create account')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && currentStep === STEPS.length - 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Creating Your Account</h2>
          <p className="text-gray-600">Setting up your business dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Business Account
          </h1>
          <p className="text-gray-600">
            Join thousands of businesses using HybridPOS to manage their operations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${index < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : index === currentStep
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                    }`}
                >
                  {index < currentStep ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 w-16 md:w-24 ${index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            {STEPS.map(step => (
              <span key={step.id} className="text-center w-24">
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-8">
            <CurrentStepComponent
              formData={formData}
              updateFormData={updateFormData}
            />
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-between">
            <button
              onClick={handleBack}
              disabled={isFirstStep || loading}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={loading}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : isLastStep ? (
                'Create Account'
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Your data is secured with 256-bit SSL encryption and stored in GDPR-compliant servers.</p>
          <p className="mt-1">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}