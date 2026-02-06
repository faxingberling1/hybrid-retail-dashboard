import { ShieldAlert, Clock, MapPin, UserCheck } from 'lucide-react';

interface SecurityAuditSectionProps {
  lastLogin: string;
  lastLoginIp: string;
  activeSessions: number;
  devices: Array<{ name: string; lastActive: string }>;
}

export default function SecurityAuditSection({
  lastLogin,
  lastLoginIp,
  activeSessions,
  devices
}: SecurityAuditSectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Security Audit</h3>
          <p className="text-sm text-gray-600">Monitor your account activity</p>
        </div>
        <ShieldAlert className="h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <div className="text-sm font-medium text-gray-600">Last Login</div>
          </div>
          <div className="mt-2 text-lg font-semibold text-gray-900">{lastLogin}</div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            <div className="text-sm font-medium text-gray-600">Last IP</div>
          </div>
          <div className="mt-2 font-mono text-lg font-semibold text-gray-900">{lastLoginIp}</div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <UserCheck className="h-5 w-5 text-gray-400 mr-2" />
            <div className="text-sm font-medium text-gray-600">Active Sessions</div>
          </div>
          <div className="mt-2 text-lg font-semibold text-gray-900">{activeSessions}</div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <ShieldAlert className="h-5 w-5 text-gray-400 mr-2" />
            <div className="text-sm font-medium text-gray-600">Security Score</div>
          </div>
          <div className="mt-2 text-lg font-semibold text-green-600">87/100</div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Active Devices</h4>
        <div className="space-y-2">
          {devices.map((device, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{device.name}</div>
                  <div className="text-xs text-gray-500">Last active: {device.lastActive}</div>
                </div>
              </div>
              <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                Revoke
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}