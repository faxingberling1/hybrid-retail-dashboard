import { Cpu, Database, Server, Clock, Calendar, HardDrive } from 'lucide-react';
import SectionHeader from '../settings/section-header';

interface SystemInfo {
  dashboardVersion: string;
  apiVersion: string;
  databaseVersion: string;
  lastUpdated: string;
  systemUptime: string;
  serverLocation: string;
}

interface SystemInformationSectionProps {
  systemInfo: SystemInfo;
  className?: string;
}

export default function SystemInformationSection({
  systemInfo,
  className = ''
}: SystemInformationSectionProps) {
  return (
    <div className={className}>
      <SectionHeader
        title="System Information"
        description="Technical details and system specifications"
        icon={<Cpu className="h-5 w-5" />}
      />

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center mr-3">
                <Server className="h-4 w-4 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Dashboard Version</span>
            </div>
            <span className="text-sm font-medium">{systemInfo.dashboardVersion}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                <Server className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">API Version</span>
            </div>
            <span className="text-sm font-medium">{systemInfo.apiVersion}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center mr-3">
                <Database className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Database Version</span>
            </div>
            <span className="text-sm font-medium">{systemInfo.databaseVersion}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="h-4 w-4 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-600">Last Updated</span>
            </div>
            <span className="text-sm font-medium">{systemInfo.lastUpdated}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center mr-3">
                <Clock className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="text-sm text-gray-600">System Uptime</span>
            </div>
            <span className="text-sm font-medium">{systemInfo.systemUptime}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-pink-100 to-pink-200 rounded-lg flex items-center justify-center mr-3">
                <HardDrive className="h-4 w-4 text-pink-600" />
              </div>
              <span className="text-sm text-gray-600">Server Location</span>
            </div>
            <span className="text-sm font-medium">{systemInfo.serverLocation}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
          <div className="text-xs text-green-800 font-medium mb-1">Environment</div>
          <div className="text-sm font-medium">Production</div>
        </div>
        <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
          <div className="text-xs text-blue-800 font-medium mb-1">SSL/TLS</div>
          <div className="text-sm font-medium">Enabled</div>
        </div>
        <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg">
          <div className="text-xs text-purple-800 font-medium mb-1">CDN</div>
          <div className="text-sm font-medium">Active</div>
        </div>
      </div>
    </div>
  );
}