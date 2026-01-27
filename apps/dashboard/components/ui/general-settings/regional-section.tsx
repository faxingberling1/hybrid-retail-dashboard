"use client"

import { Globe, Languages, Calendar, Clock } from 'lucide-react'
import SectionHeader from '../settings/section-header'
import SelectField from '../settings/select-field'
import ToggleSwitch from '../settings/toggle-switch'
import { useSettingsStore } from '@/lib/store/settings-store'

const languageOptions = [
  { value: 'en-US', label: 'English (United States)' },
  { value: 'en-GB', label: 'English (United Kingdom)' },
  { value: 'ur', label: 'Urdu (اردو)' },
  { value: 'ar', label: 'Arabic (العربية)' },
  { value: 'es', label: 'Spanish (Español)' },
  { value: 'fr', label: 'French (Français)' },
  { value: 'de', label: 'German (Deutsch)' },
  { value: 'zh', label: 'Chinese (中文)' },
  { value: 'hi', label: 'Hindi (हिन्दी)' }
];

const currencyOptions = [
  { value: 'PKR', label: 'Pakistani Rupee (₨)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'AED', label: 'UAE Dirham (د.إ)' },
  { value: 'SAR', label: 'Saudi Riyal (ر.س)' },
  { value: 'INR', label: 'Indian Rupee (₹)' },
  { value: 'CNY', label: 'Chinese Yuan (¥)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' }
];

const timezoneOptions = [
  { value: 'Asia/Karachi', label: 'Asia/Karachi (UTC+5)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (UTC+4)' },
  { value: 'Asia/Riyadh', label: 'Asia/Riyadh (UTC+3)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (UTC+5:30)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (UTC+8)' },
  { value: 'America/New_York', label: 'America/New_York (UTC-5)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (UTC-8)' },
  { value: 'Europe/London', label: 'Europe/London (UTC+0)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (UTC+1)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (UTC+10)' }
];

const dateFormatOptions = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2023)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2023)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2023-12-31)' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY (31 Dec 2023)' },
  { value: 'MMMM DD, YYYY', label: 'MMMM DD, YYYY (December 31, 2023)' }
];

const timeFormatOptions = [
  { value: '12h', label: '12-hour (2:30 PM)' },
  { value: '24h', label: '24-hour (14:30)' }
];

const firstDayOfWeekOptions = [
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '6', label: 'Saturday' }
];

export default function RegionalSection() {
  const { regional, updateRegional, isLoading } = useSettingsStore()

  // Format example based on current settings
  const formatExample = () => {
    const now = new Date()
    let formattedDate = ''
    let formattedTime = ''

    // Format date based on selected format
    switch (regional.dateFormat) {
      case 'DD/MM/YYYY':
        formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
        break
      case 'MM/DD/YYYY':
        formattedDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()}`
        break
      case 'YYYY-MM-DD':
        formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
        break
      case 'DD MMM YYYY':
        const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        formattedDate = `${now.getDate()} ${monthsShort[now.getMonth()]} ${now.getFullYear()}`
        break
      case 'MMMM DD, YYYY':
        const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        formattedDate = `${monthsFull[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`
        break
    }

    // Format time based on selected format
    if (regional.timeFormat === '12h') {
      let hours = now.getHours()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      hours = hours ? hours : 12
      formattedTime = `${hours}:${now.getMinutes().toString().padStart(2, '0')} ${ampm}`
    } else {
      formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    }

    return `${formattedDate} ${formattedTime}`
  }

  // Handle language change
  const handleLanguageChange = (value: string) => {
    updateRegional({ language: value })
    // In a real app, you might want to reload translations here
  }

  // Handle currency change
  const handleCurrencyChange = (value: string) => {
    updateRegional({ currency: value })
    // Update currency formatting throughout the app
  }

  // Handle timezone change
  const handleTimezoneChange = (value: string) => {
    updateRegional({ timezone: value })
    // Update all date/time displays in the app
  }

  // Handle date format change
  const handleDateFormatChange = (value: string) => {
    updateRegional({ dateFormat: value })
  }

  // Handle time format change
  const handleTimeFormatChange = (value: string) => {
    updateRegional({ timeFormat: value as '12h' | '24h' })
  }

  // Handle first day of week change
  const handleFirstDayOfWeekChange = (value: string) => {
    updateRegional({ firstDayOfWeek: parseInt(value) })
    // Update calendar displays
  }

  // Detect user's locale settings
  const detectLocaleSettings = () => {
    if (confirm('Detect settings from your browser/device?')) {
      const browserLanguage = navigator.language
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      
      // Find matching language option
      const matchedLanguage = languageOptions.find(
        opt => opt.value === browserLanguage || opt.value.startsWith(browserLanguage.split('-')[0])
      )
      
      // Find matching timezone
      const matchedTimezone = timezoneOptions.find(
        opt => opt.value === timezone || opt.label.includes(timezone.split('/')[1] || '')
      )
      
      updateRegional({
        language: matchedLanguage?.value || 'en-US',
        timezone: matchedTimezone?.value || 'Asia/Karachi',
        // You could also detect other settings like time format based on locale
      })
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Regional Settings"
        description="Language, currency, timezone, and formatting preferences"
        icon={<Globe className="h-5 w-5" />}
      />

      <div className="space-y-6">
        {/* Auto-detect button */}
        <div className="flex justify-end">
          <button
            onClick={detectLocaleSettings}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors flex items-center"
          >
            <Globe className="h-4 w-4 mr-2" />
            Detect from Browser
          </button>
        </div>

        {/* Language and Currency */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label={
              <div className="flex items-center">
                <Languages className="h-4 w-4 mr-2 text-gray-400" />
                Language
              </div>
            }
            name="language"
            value={regional.language}
            onChange={handleLanguageChange}
            options={languageOptions}
            disabled={isLoading}
          />

          <SelectField
            label="Currency"
            name="currency"
            value={regional.currency}
            onChange={handleCurrencyChange}
            options={currencyOptions}
            disabled={isLoading}
          />
        </div>

        {/* Timezone */}
        <SelectField
          label={
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              Timezone
            </div>
          }
          name="timezone"
          value={regional.timezone}
          onChange={handleTimezoneChange}
          options={timezoneOptions}
          disabled={isLoading}
        />

        {/* Date and Time Formatting */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-400" />
            Date & Time Formatting
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Date Format"
              name="dateFormat"
              value={regional.dateFormat}
              onChange={handleDateFormatChange}
              options={dateFormatOptions}
              disabled={isLoading}
            />

            <SelectField
              label="Time Format"
              name="timeFormat"
              value={regional.timeFormat}
              onChange={handleTimeFormatChange}
              options={timeFormatOptions}
              disabled={isLoading}
            />
          </div>

          <SelectField
            label="First Day of Week"
            name="firstDayOfWeek"
            value={regional.firstDayOfWeek.toString()}
            onChange={handleFirstDayOfWeekChange}
            options={firstDayOfWeekOptions}
            disabled={isLoading}
          />
        </div>

        {/* Format Preview */}
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h5 className="font-medium text-gray-900 mb-2">Format Preview</h5>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Format:</span>
              <span className="font-medium">{formatExample()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Timezone:</span>
              <span className="font-medium">{regional.timezone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Currency:</span>
              <span className="font-medium">
                {currencyOptions.find(c => c.value === regional.currency)?.label || regional.currency}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Language:</span>
              <span className="font-medium">
                {languageOptions.find(l => l.value === regional.language)?.label || regional.language}
              </span>
            </div>
          </div>
        </div>

        {/* Number Formatting */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Number Formatting</h4>
          <div className="space-y-3">
            <ToggleSwitch
              label="Thousands Separator"
              description="Use comma as thousands separator (1,000 vs 1000)"
              enabled={true}
              onChange={() => {}}
              disabled={isLoading}
            />
            
            <ToggleSwitch
              label="Decimal Places"
              description="Always show 2 decimal places for currency"
              enabled={true}
              onChange={() => {}}
              disabled={isLoading}
            />
            
            <ToggleSwitch
              label="Currency Symbol Position"
              description="Show currency symbol before amount ($100 vs 100$)"
              enabled={true}
              onChange={() => {}}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Regional Notes */}
        <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <Globe className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-blue-900">Regional Settings Note</div>
              <p className="text-sm text-blue-700 mt-1">
                Changing these settings affects how dates, times, and currencies are displayed throughout the application.
                Some changes may require a page refresh to take full effect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}