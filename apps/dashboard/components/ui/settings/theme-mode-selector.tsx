import { LucideIcon } from 'lucide-react';

interface ThemeMode {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface ThemeModeSelectorProps {
  label: string;
  selectedMode: string;
  onChange: (mode: string) => void;
  modes: ThemeMode[];
  className?: string;
}

export default function ThemeModeSelector({
  label,
  selectedMode,
  onChange,
  modes,
  className = ""
}: ThemeModeSelectorProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-4">
        {label}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange(mode.id)}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedMode === mode.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="h-5 w-5 mb-2" />
              <div className="font-medium">{mode.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}