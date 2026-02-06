import ToggleSwitch from '../settings/toggle-switch';
import InputField from '../settings/input-field';

interface LoginSecuritySectionProps {
  loginNotifications: boolean;
  failedLoginLockout: boolean;
  maxLoginAttempts: number;
  onLoginNotificationsChange: (enabled: boolean) => void;
  onFailedLoginLockoutChange: (enabled: boolean) => void;
  onMaxLoginAttemptsChange: (attempts: number) => void;
}

export default function LoginSecuritySection({
  loginNotifications,
  failedLoginLockout,
  maxLoginAttempts,
  onLoginNotificationsChange,
  onFailedLoginLockoutChange,
  onMaxLoginAttemptsChange
}: LoginSecuritySectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Security</h3>
      <div className="space-y-4">
        <ToggleSwitch
          label="Login Notifications"
          description="Get notified when someone logs into your account"
          enabled={loginNotifications}
          onChange={onLoginNotificationsChange}
        />

        <ToggleSwitch
          label="Failed Login Lockout"
          description="Temporarily lock account after failed attempts"
          enabled={failedLoginLockout}
          onChange={onFailedLoginLockoutChange}
        />

        {failedLoginLockout && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Login Attempts
            </label>
            <input
              type="number"
              value={maxLoginAttempts}
              onChange={(e) => onMaxLoginAttemptsChange(Number(e.target.value))}
              min="1"
              max="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}