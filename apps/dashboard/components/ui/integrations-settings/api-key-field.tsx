import { Eye, EyeOff, Copy, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface ApiKeyFieldProps {
  label: string;
  value: string;
  onRegenerate?: () => void;
  onCopy?: () => void;
  className?: string;
  showRegenerate?: boolean;
}

export default function ApiKeyField({
  label,
  value,
  onRegenerate,
  onCopy,
  className = '',
  showRegenerate = true
}: ApiKeyFieldProps) {
  const [showKey, setShowKey] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    if (onCopy) onCopy();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex">
        <input
          type={showKey ? 'text' : 'password'}
          value={value}
          readOnly
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm bg-gray-50 font-mono"
        />
        <div className="flex border border-l-0 border-gray-300 rounded-r-lg divide-x divide-gray-300">
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
            title={showKey ? 'Hide key' : 'Show key'}
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </button>
          {showRegenerate && onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors"
              title="Regenerate key"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Keep this key secure. Do not share it publicly.
      </p>
    </div>
  );
}