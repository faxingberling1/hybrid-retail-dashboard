import { Database, Download, Upload, Calendar } from 'lucide-react';
import SectionHeader from '../settings/section-header';
import ToggleSwitch from '../settings/toggle-switch';

interface DataManagementSectionProps {
  autoBackup: boolean;
  onAutoBackupChange: (enabled: boolean) => void;
  nextBackup: string;
  onExportData: () => void;
  onImportData: () => void;
  className?: string;
}

export default function DataManagementSection({
  autoBackup,
  onAutoBackupChange,
  nextBackup,
  onExportData,
  onImportData,
  className = ''
}: DataManagementSectionProps) {
  return (
    <div className={className}>
      <SectionHeader
        title="Data Management"
        description="Manage your data and backups"
        icon={<Database className="h-5 w-5" />}
      />

      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Auto Backup</div>
              <div className="text-sm text-gray-600">Daily automatic backups</div>
            </div>
            <button
              onClick={() => onAutoBackupChange(!autoBackup)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoBackup ? 'bg-purple-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center mt-4 text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            Next backup: {nextBackup}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={onExportData}
            className="p-4 border border-gray-200 rounded-lg text-left hover:border-purple-300 transition-colors group"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-green-100 to-green-200 rounded-lg flex items-center justify-center mr-3">
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Export Data</div>
                <div className="text-sm text-gray-600 mt-1">Download all your data</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Export includes: User data, settings, logs, and configurations
            </div>
          </button>

          <button
            onClick={onImportData}
            className="p-4 border border-gray-200 rounded-lg text-left hover:border-purple-300 transition-colors group"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-3">
                <Upload className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Import Data</div>
                <div className="text-sm text-gray-600 mt-1">Upload data from backup</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Supports: JSON files, CSV exports, and system backups
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}