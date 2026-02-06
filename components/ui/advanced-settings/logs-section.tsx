import { FileText, Search, Filter, Download } from 'lucide-react';
import SectionHeader from '../settings/section-header';
import { useState } from 'react';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
  user?: string;
}

interface LogsSectionProps {
  logs: LogEntry[];
  onSearch: (query: string) => void;
  onDownloadLogs: () => void;
  onClearLogs: () => void;
  className?: string;
}

export default function LogsSection({
  logs,
  onSearch,
  onDownloadLogs,
  onClearLogs,
  className = ''
}: LogsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;

    return matchesSearch && matchesLevel;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'info': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <div className={className}>
      <SectionHeader
        title="System Logs"
        description="View and manage system activity logs"
        icon={<FileText className="h-5 w-5" />}
      />

      <div className="space-y-4">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>

            <button
              onClick={onDownloadLogs}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>

            <button
              onClick={onClearLogs}
              className="px-4 py-2 text-sm font-medium text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-900">
              Log Entries ({filteredLogs.length})
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {paginatedLogs.length > 0 ? (
              paginatedLogs.map((log) => (
                <div key={log.id} className="px-4 py-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span>{getLevelIcon(log.level)}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getLevelColor(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">{log.timestamp}</span>
                        {log.user && (
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                            {log.user}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-900">{log.message}</div>
                      <div className="text-xs text-gray-500 mt-1">Source: {log.source}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <div>No logs found</div>
                <div className="text-sm mt-1">Try adjusting your search or filters</div>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded-lg ${currentPage === pageNum
                          ? 'bg-purple-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Log Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-800 font-medium mb-1">Total Logs</div>
            <div className="text-2xl font-bold text-blue-900">{logs.length}</div>
          </div>
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
            <div className="text-sm text-green-800 font-medium mb-1">Info Logs</div>
            <div className="text-2xl font-bold text-green-900">
              {logs.filter(l => l.level === 'info').length}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg">
            <div className="text-sm text-red-800 font-medium mb-1">Error Logs</div>
            <div className="text-2xl font-bold text-red-900">
              {logs.filter(l => l.level === 'error').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}