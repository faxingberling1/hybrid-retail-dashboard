import { Key, Fingerprint } from 'lucide-react';

interface PasswordManagementSectionProps {
  onChangePassword: () => void;
  onBiometricSetup: () => void;
}

export default function PasswordManagementSection({
  onChangePassword,
  onBiometricSetup
}: PasswordManagementSectionProps) {
  return (
    <div className="pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Management</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={onChangePassword}
          className="p-4 border border-gray-200 rounded-lg text-left hover:border-purple-300 transition-colors"
        >
          <Key className="h-5 w-5 text-purple-600 mb-2" />
          <div className="font-medium text-gray-900">Change Password</div>
          <div className="text-sm text-gray-600 mt-1">Update your account password</div>
        </button>
        <button 
          onClick={onBiometricSetup}
          className="p-4 border border-gray-200 rounded-lg text-left hover:border-purple-300 transition-colors"
        >
          <Fingerprint className="h-5 w-5 text-purple-600 mb-2" />
          <div className="font-medium text-gray-900">Biometric Login</div>
          <div className="text-sm text-gray-600 mt-1">Set up fingerprint or face ID</div>
        </button>
      </div>
    </div>
  );
}