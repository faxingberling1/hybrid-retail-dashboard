import SelectField from '../settings/select-field';

interface SessionSectionProps {
  sessionTimeout: number;
  passwordExpiry: number;
  onSessionTimeoutChange: (timeout: number) => void;
  onPasswordExpiryChange: (expiry: number) => void;
  sessionTimeouts: { value: number; label: string }[];
  passwordExpiryOptions: { value: number; label: string }[];
}

export default function SessionSection({
  sessionTimeout,
  passwordExpiry,
  onSessionTimeoutChange,
  onPasswordExpiryChange,
  sessionTimeouts,
  passwordExpiryOptions
}: SessionSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h3>
      <div className="space-y-6">
        <SelectField
          label="Session Timeout"
          name="sessionTimeout"
          value={sessionTimeout.toString()}
          onChange={(value) => onSessionTimeoutChange(Number(value))}
          options={sessionTimeouts.map(opt => ({ value: opt.value.toString(), label: opt.label }))}
        />
        <p className="text-xs text-gray-500 -mt-4">
          Automatically log out after period of inactivity
        </p>

        <SelectField
          label="Password Expiry"
          name="passwordExpiry"
          value={passwordExpiry.toString()}
          onChange={(value) => onPasswordExpiryChange(Number(value))}
          options={passwordExpiryOptions.map(opt => ({ value: opt.value.toString(), label: opt.label }))}
        />
        <p className="text-xs text-gray-500 -mt-4">
          Require password change after specified days
        </p>
      </div>
    </div>
  );
}