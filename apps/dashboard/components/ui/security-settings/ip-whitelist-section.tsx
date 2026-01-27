import { Network, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface IpWhitelistSectionProps {
  ipWhitelist: string[];
  onAddIp: () => void;
  onRemoveIp: (ip: string) => void;
}

export default function IpWhitelistSection({
  ipWhitelist,
  onAddIp,
  onRemoveIp
}: IpWhitelistSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">IP Whitelist</h3>
          <p className="text-sm text-gray-600">Restrict access to specific IP addresses</p>
        </div>
        <button
          onClick={onAddIp}
          className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add IP
        </button>
      </div>

      <div className="space-y-2">
        {ipWhitelist.map((ip, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Network className="h-4 w-4 text-gray-400 mr-3" />
              <span className="font-mono text-sm">{ip}</span>
            </div>
            <button
              onClick={() => onRemoveIp(ip)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {ipWhitelist.length === 0 && (
          <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
            No IP addresses whitelisted. Click "Add IP" to add one.
          </div>
        )}
      </div>
    </div>
  );
}