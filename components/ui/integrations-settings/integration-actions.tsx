import { Copy, RefreshCw, Trash2, Settings, Eye, EyeOff } from 'lucide-react';

interface IntegrationActionsProps {
  onCopyKey: () => void;
  onRegenerateKey: () => void;
  onRemove: () => void;
  onConfigure?: () => void;
  onToggleVisibility?: () => void;
  isVisible?: boolean;
  showVisibilityToggle?: boolean;
  showConfigure?: boolean;
  className?: string;
}

export default function IntegrationActions({
  onCopyKey,
  onRegenerateKey,
  onRemove,
  onConfigure,
  onToggleVisibility,
  isVisible = false,
  showVisibilityToggle = false,
  showConfigure = false,
  className = ''
}: IntegrationActionsProps) {
  return (
    <div className={`flex justify-end space-x-3 ${className}`}>
      {showVisibilityToggle && onToggleVisibility && (
        <button
          onClick={onToggleVisibility}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
          title={isVisible ? 'Hide key' : 'Show key'}
        >
          {isVisible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {isVisible ? 'Hide' : 'Show'}
        </button>
      )}
      
      {showConfigure && onConfigure && (
        <button
          onClick={onConfigure}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
        >
          <Settings className="h-4 w-4 mr-2" />
          Configure
        </button>
      )}
      
      <button
        onClick={onRegenerateKey}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Regenerate
      </button>
      
      <button
        onClick={onCopyKey}
        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy Key
      </button>
      
      <button
        onClick={onRemove}
        className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Remove
      </button>
    </div>
  );
}