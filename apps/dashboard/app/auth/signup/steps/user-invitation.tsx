// app/auth/signup/steps/user-invitation.tsx
'use client'

import { useState } from 'react'
import { Users, Mail, X, Plus, UserCheck } from 'lucide-react'

const ROLES = [
  { value: 'MANAGER', label: 'Manager', description: 'Can manage staff and operations' },
  { value: 'USER', label: 'Staff', description: 'Basic access for daily operations' },
  { value: 'VIEWER', label: 'Viewer', description: 'Read-only access to reports' },
  { value: 'ACCOUNTANT', label: 'Accountant', description: 'Financial reporting and billing' },
]

export default function UserInvitation({ formData, updateFormData }: any) {
  const [emailInput, setEmailInput] = useState('')
  const [selectedRole, setSelectedRole] = useState('USER')
  const [emailError, setEmailError] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const addUser = () => {
    if (!emailInput.trim()) {
      setEmailError('Email is required')
      return
    }

    if (!validateEmail(emailInput)) {
      setEmailError('Please enter a valid email address')
      return
    }

    // Check if email already exists
    if (formData.userEmails.includes(emailInput)) {
      setEmailError('This email has already been added')
      return
    }

    updateFormData({
      userEmails: [...formData.userEmails, emailInput],
      userRoles: [...formData.userRoles, selectedRole]
    })
    
    setEmailInput('')
    setEmailError('')
  }

  const removeUser = (index: number) => {
    const newEmails = [...formData.userEmails]
    const newRoles = [...formData.userRoles]
    
    newEmails.splice(index, 1)
    newRoles.splice(index, 1)
    
    updateFormData({
      userEmails: newEmails,
      userRoles: newRoles
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addUser()
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Invite Your Team</h2>
        <p className="text-gray-600">
          Invite team members to join your dashboard. You can skip this step and add team members later.
        </p>
      </div>

      <div className="space-y-6">
        {/* Add User Form */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-3">Add Team Member</h3>
          
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  Email Address
                </div>
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value)
                    setEmailError('')
                  }}
                  onKeyPress={handleKeyPress}
                  className={`flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    emailError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="team.member@yourbusiness.com"
                />
                <button
                  type="button"
                  onClick={addUser}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </button>
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {ROLES.map(role => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      selectedRole === role.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{role.label}</div>
                    <div className="text-xs text-gray-600 mt-1">{role.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Invited Users List */}
        {formData.userEmails.length > 0 ? (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Team Members ({formData.userEmails.length})
            </h3>
            <div className="space-y-3">
              {formData.userEmails.map((email: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded">
                      <UserCheck className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{email}</div>
                      <div className="text-sm text-gray-600">
                        {ROLES.find(r => r.value === formData.userRoles[index])?.label || 'User'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeUser(index)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No team members added yet</p>
            <p className="text-sm text-gray-500 mt-1">
              You can add team members now or invite them later from your dashboard.
            </p>
          </div>
        )}

        {/* Skip Option */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <div className="p-1.5 bg-gray-100 rounded mr-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Optional Step</p>
              <p className="text-sm text-gray-700 mt-1">
                You can skip adding team members now and invite them later from your dashboard settings.
                Team members will receive email invitations to join your business account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}