"use client"

import { User, Upload, Camera } from 'lucide-react'
import { useState, useRef } from 'react'
import SectionHeader from '../settings/section-header'
import InputField from '../settings/input-field'
import { useSettingsStore } from '@/lib/store/settings-store'
import { ValidationUtils } from '@/lib/utils/validation'
import { SettingsService } from '@/lib/services/settings.service'

interface ProfileSectionProps {
  onAvatarChange?: (url: string) => void
}

export default function ProfileSection({ onAvatarChange }: ProfileSectionProps) {
  const {
    userProfile,
    updateUserProfile,
    errors,
    setError,
    clearErrors,
    isLoading
  } = useSettingsStore()
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({})
  
  // Handle input changes with validation
  const handleInputChange = (field: keyof typeof userProfile, value: string) => {
    // Clear any existing error for this field
    if (errors[field]) {
      setError(field, '')
    }
    
    // Validate based on field type
    let isValid = true
    let errorMessage = ''
    
    switch (field) {
      case 'name':
        const nameValidation = ValidationUtils.isValidName(value)
        isValid = nameValidation.valid
        errorMessage = nameValidation.message || ''
        break
        
      case 'email':
        if (!ValidationUtils.isValidEmail(value)) {
          isValid = false
          errorMessage = 'Please enter a valid email address'
        }
        break
        
      case 'phone':
        if (value && !ValidationUtils.isValidPhone(value)) {
          isValid = false
          errorMessage = 'Please enter a valid phone number'
        }
        break
        
      case 'bio':
        const bioValidation = ValidationUtils.isValidBio(value)
        isValid = bioValidation.valid
        errorMessage = bioValidation.message || ''
        break
    }
    
    if (!isValid) {
      setError(field, errorMessage)
    } else {
      // Update profile
      updateUserProfile({ [field]: value })
      
      // Generate new avatar if name changed
      if (field === 'name' && value.trim()) {
        const newAvatarUrl = SettingsService.generateAvatarUrl(value)
        updateUserProfile({ avatar: newAvatarUrl })
        if (onAvatarChange) {
          onAvatarChange(newAvatarUrl)
        }
      }
    }
  }
  
  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('avatar', 'Please select an image file')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('avatar', 'Image size should be less than 5MB')
      return
    }
    
    setIsUploading(true)
    setError('avatar', '')
    
    try {
      // In a real app, you would upload to your server
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        updateUserProfile({ avatar: dataUrl })
        if (onAvatarChange) {
          onAvatarChange(dataUrl)
        }
        setIsUploading(false)
        
        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
      reader.readAsDataURL(file)
      
      // Or use the service to upload to server
      // const result = await SettingsService.uploadAvatar(file, userProfile.id)
      // if (result.success && result.url) {
      //   updateUserProfile({ avatar: result.url })
      //   if (onAvatarChange) {
      //     onAvatarChange(result.url)
      //   }
      // } else {
      //   setError('avatar', result.message || 'Upload failed')
      // }
    } catch (error) {
      console.error('Avatar upload error:', error)
      setError('avatar', 'Failed to upload avatar')
    } finally {
      setIsUploading(false)
    }
  }
  
  // Handle avatar click
  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }
  
  // Get error message for a field
  const getErrorMessage = (field: string) => {
    return errors[field] || localErrors[field] || ''
  }
  
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Profile Information"
        description="Update your personal details"
        icon={<User className="h-5 w-5" />}
      />

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6">
          {/* Avatar Section */}
          <div className="mb-4 lg:mb-0 flex flex-col items-center">
            <div className="relative">
              <div 
                className="h-24 w-24 rounded-full bg-gradient-to-r from-purple-100 to-purple-200 flex items-center justify-center overflow-hidden cursor-pointer group relative"
                onClick={handleAvatarClick}
              >
                {userProfile.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <User className="h-12 w-12 text-purple-600" />
                )}
                
                {/* Upload overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                </div>
              )}
              
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="mt-3 text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center"
              >
                <Upload className="h-3 w-3 mr-1" />
                Change Photo
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={isUploading}
              />
            </div>
            
            {getErrorMessage('avatar') && (
              <p className="mt-2 text-sm text-red-600">{getErrorMessage('avatar')}</p>
            )}
          </div>
          
          {/* Form Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <InputField
                label="Full Name"
                name="name"
                value={userProfile.name}
                onChange={(value) => handleInputChange('name', value)}
                disabled={isLoading}
                className={getErrorMessage('name') ? 'border-red-300' : ''}
              />
              {getErrorMessage('name') && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage('name')}</p>
              )}
            </div>
            
            <div>
              <InputField
                label="Email Address"
                name="email"
                type="email"
                value={userProfile.email}
                onChange={(value) => handleInputChange('email', value)}
                disabled={isLoading}
                className={getErrorMessage('email') ? 'border-red-300' : ''}
              />
              {getErrorMessage('email') && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage('email')}</p>
              )}
            </div>
            
            <div>
              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                value={userProfile.phone}
                onChange={(value) => handleInputChange('phone', value)}
                disabled={isLoading}
                placeholder="+92 300 1234567"
                className={getErrorMessage('phone') ? 'border-red-300' : ''}
              />
              {getErrorMessage('phone') && (
                <p className="mt-1 text-sm text-red-600">{getErrorMessage('phone')}</p>
              )}
            </div>
            
            <div>
              <InputField
                label="Role"
                name="role"
                value={userProfile.role}
                onChange={(value) => handleInputChange('role', value)}
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">Contact admin to change role</p>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={userProfile.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                  getErrorMessage('bio') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Tell us about yourself..."
                maxLength={500}
              />
              <div className="flex justify-between mt-1">
                {getErrorMessage('bio') ? (
                  <p className="text-sm text-red-600">{getErrorMessage('bio')}</p>
                ) : (
                  <p className="text-xs text-gray-500">Brief description about yourself</p>
                )}
                <p className="text-xs text-gray-500">
                  {userProfile.bio.length}/500
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Organization Info (Read-only) */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Organization Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600">Organization</label>
              <p className="font-medium">{userProfile.organization}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">User ID</label>
              <p className="font-mono text-sm">{userProfile.id}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">Member Since</label>
              <p className="font-medium">Jan 15, 2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}