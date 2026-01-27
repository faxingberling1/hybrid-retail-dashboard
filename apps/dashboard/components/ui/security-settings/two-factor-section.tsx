import { ShieldCheck, CheckCircle } from 'lucide-react';
import SectionHeader from '../settings/section-header';
import ToggleSwitch from '../settings/toggle-switch';

interface TwoFactorSectionProps {
  twoFactorAuth: boolean;
  onTwoFactorChange: (enabled: boolean) => void;
}

export default function TwoFactorSection({ twoFactorAuth, onTwoFactorChange }: TwoFactorSectionProps) {
  return (
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
          enabled={twoFactorAuth}
          onChange={onTwoFactorChange}
        />

        {twoFactorAuth && (
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
  );
}