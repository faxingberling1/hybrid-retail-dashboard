"use client"

import { Palette, Sun, Moon, Monitor, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import SectionHeader from '../settings/section-header'
import ColorSelector from '../settings/color-selector'
import SelectField from '../settings/select-field'
import ToggleSwitch from '../settings/toggle-switch'
import ThemeModeSelector from '../settings/theme-mode-selector'
import { useSettingsStore } from '@/lib/store/settings-store'
import { ValidationUtils } from '@/lib/utils/validation'

const themeModes = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor }
];

const primaryColors = [
  { id: 'purple', value: '#4F46E5', name: 'Purple' },
  { id: 'blue', value: '#3B82F6', name: 'Blue' },
  { id: 'green', value: '#10B981', name: 'Green' },
  { id: 'orange', value: '#F59E0B', name: 'Orange' },
  { id: 'red', value: '#EF4444', name: 'Red' },
  { id: 'pink', value: '#EC4899', name: 'Pink' },
  { id: 'indigo', value: '#6366F1', name: 'Indigo' },
  { id: 'teal', value: '#14B8A6', name: 'Teal' },
  { id: 'cyan', value: '#06B6D4', name: 'Cyan' },
  { id: 'amber', value: '#F59E0B', name: 'Amber' },
  { id: 'rose', value: '#F43F5E', name: 'Rose' },
  { id: 'custom', value: '#custom', name: 'Custom...' }
];

const fontSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' }
];

const densityOptions = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' }
];

interface ThemeSectionProps {
  onThemeChange?: (theme: any) => void
}

export default function ThemeSection({ onThemeChange }: ThemeSectionProps) {
  const { theme, updateTheme, errors, setError, isLoading } = useSettingsStore()
  const [showCustomColor, setShowCustomColor] = useState(false)
  const [customColor, setCustomColor] = useState('#4F46E5')
  const [previewMode, setPreviewMode] = useState(false)

  // Apply theme changes immediately for preview
  useEffect(() => {
    if (previewMode) {
      applyThemeToDocument()
    }
  }, [theme, previewMode])

  // Handle theme mode change
  const handleModeChange = (mode: string) => {
    updateTheme({ mode: mode as any })
    applyThemeMode(mode as any)
  }

  // Handle color change
  const handleColorChange = (color: string) => {
    if (color === '#custom') {
      setShowCustomColor(true)
      return
    }

    if (!ValidationUtils.isValidHexColor(color)) {
      setError('primaryColor', 'Invalid color format')
      return
    }

    updateTheme({ primaryColor: color })
    applyPrimaryColor(color)
  }

  // Handle custom color change
  const handleCustomColorChange = (color: string) => {
    if (!ValidationUtils.isValidHexColor(color)) {
      setError('primaryColor', 'Invalid color format')
      return
    }

    setCustomColor(color)
    updateTheme({ primaryColor: color })
    applyPrimaryColor(color)
  }

  // Handle font size change
  const handleFontSizeChange = (size: string) => {
    updateTheme({ fontSize: size as any })
    applyFontSize(size)
  }

  // Handle density change
  const handleDensityChange = (density: string) => {
    updateTheme({ density: density as any })
    applyDensity(density)
  }

  // Handle animations toggle
  const handleAnimationsToggle = (enabled: boolean) => {
    updateTheme({ animations: enabled })
    applyAnimations(enabled)
  }

  // Apply theme to document
  const applyThemeToDocument = () => {
    applyThemeMode(theme.mode)
    applyPrimaryColor(theme.primaryColor)
    applyFontSize(theme.fontSize)
    applyDensity(theme.density)
    applyAnimations(theme.animations)
  }

  // Apply theme mode
  const applyThemeMode = (mode: 'light' | 'dark' | 'system') => {
    const root = document.documentElement
    
    if (mode === 'dark') {
      root.classList.add('dark')
    } else if (mode === 'light') {
      root.classList.remove('dark')
    } else {
      // System mode - check prefers-color-scheme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }
  }

  // Apply primary color
  const applyPrimaryColor = (color: string) => {
    const root = document.documentElement
    root.style.setProperty('--primary-color', color)
    
    // Also update shades for Tailwind compatibility
    const shades = generateColorShades(color)
    Object.entries(shades).forEach(([shade, value]) => {
      root.style.setProperty(`--color-primary-${shade}`, value)
    })
  }

  // Generate color shades from base color
  const generateColorShades = (baseColor: string): Record<string, string> => {
    // Simple shade generation (in a real app, use a proper color library)
    return {
      '50': lightenColor(baseColor, 0.9),
      '100': lightenColor(baseColor, 0.8),
      '200': lightenColor(baseColor, 0.6),
      '300': lightenColor(baseColor, 0.4),
      '400': lightenColor(baseColor, 0.2),
      '500': baseColor,
      '600': darkenColor(baseColor, 0.2),
      '700': darkenColor(baseColor, 0.4),
      '800': darkenColor(baseColor, 0.6),
      '900': darkenColor(baseColor, 0.8)
    }
  }

  // Helper function to lighten color
  const lightenColor = (color: string, amount: number): string => {
    // Simple implementation - in production use a color library
    return color // Placeholder
  }

  // Helper function to darken color
  const darkenColor = (color: string, amount: number): string => {
    // Simple implementation - in production use a color library
    return color // Placeholder
  }

  // Apply font size
  const applyFontSize = (size: string) => {
    const root = document.documentElement
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    }
    root.style.setProperty('--font-size-base', sizes[size as keyof typeof sizes] || '16px')
  }

  // Apply density
  const applyDensity = (density: string) => {
    const root = document.documentElement
    const densities = {
      compact: '0.75rem',
      comfortable: '1rem'
    }
    root.style.setProperty('--spacing-unit', densities[density as keyof typeof densities] || '1rem')
  }

  // Apply animations
  const applyAnimations = (enabled: boolean) => {
    const root = document.documentElement
    if (enabled) {
      root.style.setProperty('--animation-duration', '0.3s')
      root.style.setProperty('--animation-timing', 'ease-in-out')
    } else {
      root.style.setProperty('--animation-duration', '0s')
      root.style.setProperty('--animation-timing', 'linear')
    }
  }

  // Reset to system defaults
  const handleReset = () => {
    const defaultTheme = {
      mode: 'system' as const,
      primaryColor: '#4F46E5',
      fontSize: 'medium' as const,
      density: 'comfortable' as const,
      animations: true
    }
    updateTheme(defaultTheme)
    applyThemeToDocument()
  }

  // Preview theme changes
  const handlePreview = () => {
    setPreviewMode(!previewMode)
    if (!previewMode) {
      applyThemeToDocument()
    } else {
      // Store current theme to restore later
      localStorage.setItem('theme-preview', JSON.stringify(theme))
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Theme & Appearance"
        description="Customize the look and feel of your dashboard"
        icon={<Palette className="h-5 w-5" />}
      />

      <div className="space-y-6">
        {/* Preview Mode Toggle */}
        <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div>
            <div className="font-medium text-gray-900">Preview Mode</div>
            <div className="text-sm text-gray-600">
              See changes in real-time without saving
            </div>
          </div>
          <button
            onClick={handlePreview}
            className={`px-4 py-2 rounded-lg font-medium flex items-center ${
              previewMode
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-white text-purple-600 border border-purple-300 hover:bg-purple-50'
            }`}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Exit Preview' : 'Preview Changes'}
          </button>
        </div>

        {/* Theme Mode */}
        <ThemeModeSelector
          label="Theme Mode"
          selectedMode={theme.mode}
          onChange={handleModeChange}
          modes={themeModes}
          disabled={isLoading}
        />

        {/* Primary Color */}
        <div>
          <ColorSelector
            label="Primary Color"
            selectedColor={theme.primaryColor}
            onChange={handleColorChange}
            colors={primaryColors}
            disabled={isLoading}
          />
          
          {showCustomColor && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="h-10 w-20 cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  placeholder="#4F46E5"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                />
                <button
                  onClick={() => setShowCustomColor(false)}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
              {errors.primaryColor && (
                <p className="mt-1 text-sm text-red-600">{errors.primaryColor}</p>
              )}
            </div>
          )}
        </div>

        {/* Font Size & Density */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Font Size"
            name="fontSize"
            value={theme.fontSize}
            onChange={handleFontSizeChange}
            options={fontSizeOptions}
            disabled={isLoading}
          />

          <SelectField
            label="Density"
            name="density"
            value={theme.density}
            onChange={handleDensityChange}
            options={densityOptions}
            disabled={isLoading}
          />
        </div>

        {/* Animations */}
        <ToggleSwitch
          label="Animations"
          description="Enable smooth transitions and animations throughout the app"
          enabled={theme.animations}
          onChange={handleAnimationsToggle}
          disabled={isLoading}
        />

        {/* Theme Preview */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Theme Preview</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div 
                className="h-8 w-8 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <div className="flex-1">
                <div className="h-2 rounded-full bg-gray-200" style={{ width: '80%' }} />
              </div>
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Sample
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="h-20 rounded-lg border flex items-center justify-center"
                  style={{
                    backgroundColor: i === 2 ? theme.primaryColor : 'transparent',
                    borderColor: i === 2 ? theme.primaryColor : '#e5e7eb'
                  }}
                >
                  <span className={i === 2 ? 'text-white' : 'text-gray-600'}>
                    Card {i}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-end">
          <button
            onClick={handleReset}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  )
}