import { 
  ShieldCheck, Network, Key, Fingerprint,
  CheckCircle, X
} from 'lucide-react';
import SectionHeader from '../settings/section-header';
import ToggleSwitch from '../settings/toggle-switch';
import SelectField from '../settings/select-field';
import InputField from '../settings/input-field';

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  ipWhitelist: string[];
  loginNotifications: boolean;
  failedLoginLockout: boolean;
  maxLoginAttempts: number;
}

interface SecuritySectionProps {
  security: SecuritySettings;
  onSecurityChange: (security: SecuritySettings) => void;
  onAddIpAddress: () => void;
  onRemoveIpAddress: (ip: string) => void;
  sessionTimeouts: { value: number; label: string }[];
  passwordExpiryOptions: { value: number; label: string }[];
}

export default function SecuritySection({
  security,
  onSecurityChange,
  onAddIpAddress,
  onRemoveIpAddress,
  sessionTimeouts,
  passwordExpiryOptions
}: SecuritySectionProps) {
  const handleChange = (field: keyof SecuritySettings, value: any) => {
    onSecurityChange({ ...security, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Two-Factor Authentication */}
      <div>
        <SectionHeader
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
          icon={<ShieldCheck className="h-5 w-5" />}
        />

        <div className="space-y-4">
          <ToggleSwitch
            label="Enable 2FA"
            description="Require a verification code when signing in"
            enabled={security.twoFactorAuth}
            onChange={(value) => handleChange('twoFactorAuth', value)}
          />

          {security.twoFactorAuth && (
            <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">2FA is enabled</span>
              </div>
              <p className="text-sm text-green-700 mt-2">
                You'll need to enter a verification code from your authenticator app when signing in.
              </p>
              <button className="mt-3 text-sm font-medium text-green-700 hover:text-green-800">
                Manage authenticator apps →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Session Management */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h3>
        <div className="space-y-6">
          <SelectField
            label="Session Timeout"
            name="sessionTimeout"
            value={security.sessionTimeout.toString()}
            onChange={(value) => handleChange('sessionTimeout', Number(value))}
            options={sessionTimeouts.map(opt => ({ value: opt.value.toString(), label: opt.label }))}
          />

          <SelectField
            label="Password Expiry"
            name="passwordExpiry"
            value={security.passwordExpiry.toString()}
            onChange={(value) => handleChange('passwordExpiry', Number(value))}
            options={passwordExpiryOptions.map(opt => ({ value: opt.value.toString(), label: opt.label }))}
          />
        </div>
      </div>

      {/* IP Whitelist */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">IP Whitelist</h3>
            <p className="text-sm text-gray-600">Restrict access to specific IP addresses</p>
          </div>
          <button
            onClick={onAddIpAddress}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add IP
          </button>
        </div>

        <div className="space-y-2">
          {security.ipWhitelist.map((ip, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Network className="h-4 w-4 text-gray-400 mr-3" />
                <span className="font-mono text-sm">{ip}</span>
              </div>
              <button
                onClick={() => onRemoveIpAddress(ip)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          {security.ipWhitelist.length === 0 && (
            <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
              No IP addresses whitelisted. Click "Add IP" to add one.
            </div>
          )}
        </div>
      </div>

      {/* Login Security */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Security</h3>
        <div className="space-y-4">
          <ToggleSwitch
            label="Login Notifications"
            description="Get notified when someone logs into your account"
            enabled={security.loginNotifications}
            onChange={(value) => handleChange('loginNotifications', value)}
          />

          <ToggleSwitch
            label="Failed Login Lockout"
            description="Temporarily lock account after failed attempts"
            enabled={security.failedLoginLockout}
            onChange={(value) => handleChange('failedLoginLockout', value)}
          />

          {security.failedLoginLockout && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Login Attempts
              </label>
              <input
                type="number"
                value={security.maxLoginAttempts}
                onChange={(e) => handleChange('maxLoginAttempts', Number(e.target.value))}
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>

      {/* Password Management */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg text-left hover:border-purple-300 transition-colors">
            <Key className="h-5 w-5 text-purple-600 mb-2" />
            <div className="font-medium text-gray-900">Change Password</div>
            <div className="text-sm text-gray-600 mt-1">Update your account password</div>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg text-left hover:border-purple-300 transition-colors">
            <Fingerprint className="h-5 w-5 text-purple-600 mb-2" />
            <div className="font-medium text-gray-900">Biometric Login</div>
            <div className="text-sm text-gray-600 mt-1">Set up fingerprint or face ID</div>
          </button>
        </div>
      </div>
    </div>
  );
}