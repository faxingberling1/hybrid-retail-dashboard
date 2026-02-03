// app/auth/signup/steps/confirmation.tsx
'use client'

import { CheckCircle, Shield, FileText, Bell } from 'lucide-react'

export default function Confirmation({ formData, updateFormData }: any) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Review & Create Account</h2>
        <p className="text-gray-600">
          Review your information and agree to our terms to create your account.
        </p>
      </div>

      <div className="space-y-6">
        {/* Summary Card */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 mb-4">Account Summary</h3>
          
          <div className="space-y-4">
            {/* Business Info */}
            <div className="pb-4 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Business Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Business Name</div>
                  <div className="font-medium text-gray-900">{formData.businessName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Industry</div>
                  <div className="font-medium text-gray-900 capitalize">{formData.industry}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Business Type</div>
                  <div className="font-medium text-gray-900">{formData.businessType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Location</div>
                  <div className="font-medium text-gray-900">{formData.country}</div>
                </div>
              </div>
            </div>

            {/* Admin Info */}
            <div className="pb-4 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Administrator</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="font-medium text-gray-900">{formData.adminName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium text-gray-900">{formData.adminEmail}</div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            {formData.userEmails.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Team Members ({formData.userEmails.length})
                </h4>
                <div className="space-y-2">
                  {formData.userEmails.map((email: string, index: number) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium text-gray-900">{email}</span>
                      <span className="text-gray-600 ml-2">
                        ({formData.userRoles[index]})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              checked={formData.termsAccepted}
              onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                Privacy Policy
              </a>
              . I understand that my data will be processed according to these policies.
            </label>
          </div>

          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="marketing"
              checked={formData.marketingEmails}
              onChange={(e) => updateFormData({ marketingEmails: e.target.checked })}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="marketing" className="text-sm text-gray-700">
              I want to receive occasional emails about new features, tips, and best practices.
              I can unsubscribe at any time.
            </label>
          </div>
        </div>

        {/* Security & Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-800">Secure & Private</h4>
            </div>
            <p className="text-sm text-blue-700">
              Your data is encrypted and stored securely in GDPR-compliant servers.
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-800">14-Day Free Trial</h4>
            </div>
            <p className="text-sm text-green-700">
              No credit card required. Start with all features included.
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center mb-2">
              <Bell className="w-5 h-5 text-purple-600 mr-2" />
              <h4 className="font-medium text-purple-800">24/7 Support</h4>
            </div>
            <p className="text-sm text-purple-700">
              Get help anytime via chat, email, or phone during your trial.
            </p>
          </div>
        </div>

        {/* Error message for terms */}
        {!formData.termsAccepted && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              Please accept the Terms of Service to create your account.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}