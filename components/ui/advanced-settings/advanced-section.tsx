import DataManagementSection from './data-management-section';
import ApiAccessSection from './api-access-section';
import SystemInformationSection from './system-information-section';
import LogsSection from './logs-section';
import DebugToolsSection from './debug-tools-section';
import DangerZoneSection from './danger-zone-section';
import { LogEntry } from './logs-section';
import { DebugTool } from './debug-tools-section';
import { DangerZoneAction } from './danger-zone-section';

interface AdvancedSectionProps {
  // Data Management
  autoBackup: boolean;
  onAutoBackupChange: (enabled: boolean) => void;
  nextBackup: string;
  onExportData: () => void;
  onImportData: () => void;

  // API Access
  apiToken: string;
  onGenerateToken: () => void;
  apiUsage: {
    requestsToday: number;
    requestsLimit: number;
    resetTime: string;
  };

  // System Information
  systemInfo: {
    dashboardVersion: string;
    apiVersion: string;
    databaseVersion: string;
    lastUpdated: string;
    systemUptime: string;
    serverLocation: string;
  };

  // Logs
  logs: LogEntry[];
  onSearchLogs: (query: string) => void;
  onDownloadLogs: () => void;
  onClearLogs: () => void;

  // Debug Tools
  debugTools: DebugTool[];

  // Danger Zone
  dangerZoneActions: DangerZoneAction[];

  className?: string;
}

export default function AdvancedSection({
  autoBackup,
  onAutoBackupChange,
  nextBackup,
  onExportData,
  onImportData,
  apiToken,
  onGenerateToken,
  apiUsage,
  systemInfo,
  logs,
  onSearchLogs,
  onDownloadLogs,
  onClearLogs,
  debugTools,
  dangerZoneActions,
  className = ''
}: AdvancedSectionProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      <DataManagementSection
        autoBackup={autoBackup}
        onAutoBackupChange={onAutoBackupChange}
        nextBackup={nextBackup}
        onExportData={onExportData}
        onImportData={onImportData}
      />

      <ApiAccessSection
        apiToken={apiToken}
        onGenerateToken={onGenerateToken}
        usage={apiUsage}
      />

      <SystemInformationSection
        systemInfo={systemInfo}
      />

      <LogsSection
        logs={logs}
        onSearch={onSearchLogs}
        onDownloadLogs={onDownloadLogs}
        onClearLogs={onClearLogs}
      />

      <DebugToolsSection
        tools={debugTools}
      />

      <DangerZoneSection
        actions={dangerZoneActions}
      />
    </div>
  );
}