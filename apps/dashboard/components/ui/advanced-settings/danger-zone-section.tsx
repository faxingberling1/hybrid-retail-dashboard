import { AlertTriangle, Trash2, RefreshCw, Archive, Lock } from 'lucide-react';
import SectionHeader from '../settings/section-header';

export interface DangerZoneAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant: 'danger' | 'warning' | 'info';
  confirmationText?: string;
}

interface DangerZoneSectionProps {
  actions: DangerZoneAction[];
  className?: string;
}

export default function DangerZoneSection({
  actions,
  className = ''
}: DangerZoneSectionProps) {
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case 'danger':
        return 'border-red-200 bg-red-50 hover:bg-red-100 text-red-900';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-900';
      case 'info':
        return 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900';
      default:
        return 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-900';
    }
  };

  const getVariantIconColor = (variant: string) => {
    switch (variant) {
      case 'danger': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const handleActionClick = (action: DangerZoneAction) => {
    if (action.confirmationText) {
      if (confirm(action.confirmationText)) {
        action.onClick();
      }
    } else {
      action.onClick();
    }
  };

  return (
    <div className={className}>
      <SectionHeader
        title="Danger Zone"
        description="Irreversible actions"
        icon={<AlertTriangle className="h-5 w-5" />}
      />

      <div className="space-y-4">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className={`w-full p-4 border rounded-lg text-left transition-colors ${getVariantStyles(action.variant)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`mr-3 ${getVariantIconColor(action.variant)}`}>
                  {action.icon}
                </div>
                <div>
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm mt-1">{action.description}</div>
                </div>
              </div>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <div className="text-sm font-medium text-red-900">Important Notice</div>
        </div>
        <p className="text-sm text-red-700 mt-1">
          Actions in this section cannot be undone. Make sure you have proper backups and understand the consequences before proceeding.
        </p>
      </div>
    </div>
  );
}