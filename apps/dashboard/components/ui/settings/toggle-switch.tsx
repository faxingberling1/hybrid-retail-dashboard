interface ToggleSwitchProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
}

export default function ToggleSwitch({
  label,
  description,
  enabled,
  onChange,
  className = ""
}: ToggleSwitchProps) {
  return (
    <div className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg ${className}`}>
      <div>
        <div className="font-medium text-gray-900">{label}</div>
        {description && (
          <div className="text-sm text-gray-600 mt-1">{description}</div>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-purple-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}