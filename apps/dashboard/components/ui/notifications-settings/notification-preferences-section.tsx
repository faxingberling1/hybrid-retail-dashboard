import { Volume2, Clock } from 'lucide-react';
import SelectField from '../settings/select-field';

interface NotificationPreferences {
  quietHoursStart: string;
  quietHoursEnd: string;
  notificationSound: string;
}

interface NotificationPreferencesSectionProps {
  preferences: NotificationPreferences;
  onPreferencesChange: (preferences: NotificationPreferences) => void;
}

const soundOptions = [
  { value: 'default', label: 'Default' },
  { value: 'chime', label: 'Chime' },
  { value: 'bell', label: 'Bell' },
  { value: 'none', label: 'None' }
];

export default function NotificationPreferencesSection({
  preferences,
  onPreferencesChange
}: NotificationPreferencesSectionProps) {
  const handleChange = (field: keyof NotificationPreferences, value: string) => {
    onPreferencesChange({
      ...preferences,
      [field]: value
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
          <p className="text-sm text-gray-600">Customize how and when you receive notifications</p>
        </div>
        <div className="flex space-x-2">
          <Clock className="h-5 w-5 text-gray-400" />
          <Volume2 className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quiet Hours
          </label>
          <div className="flex space-x-2">
            <input
              type="time"
              value={preferences.quietHoursStart}
              onChange={(e) => handleChange('quietHoursStart', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <input
              type="time"
              value={preferences.quietHoursEnd}
              onChange={(e) => handleChange('quietHoursEnd', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">No notifications during these hours</p>
        </div>

        <div>
          <SelectField
            label="Notification Sound"
            name="notificationSound"
            value={preferences.notificationSound}
            onChange={(value) => handleChange('notificationSound', value)}
            options={soundOptions}
          />
        </div>
      </div>
    </div>
  );
}