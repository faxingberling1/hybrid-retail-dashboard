// apps/dashboard/app/super-admin/database/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Database as DatabaseIcon,
  Zap,
  RefreshCw,
  BarChart3,
  Table,
  Search,
  ShieldCheck,
  TrendingUp,
  Info,
  Layers,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Users,
  AlertCircle,
  FileText,
  Activity,
  HardDrive,
  Clock,
  Cpu,
  Filter,
  ChevronDown,
  ChevronRight,
  Eye,
  Key,
  Copy,
  Shield,
  Play,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Specialized UI Components
import DashboardTab from '@/components/ui/database/dashboard-tab';
import TablesTab from '@/components/ui/database/tables-tab';
import QueryTab from '@/components/ui/database/query-tab';
import HealthTab from '@/components/ui/database/health-tab';
import AnalyticsTab from '@/components/ui/database/analytics-tab';

// Dynamically import charts to avoid SSR issues
const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => mod.Line), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => mod.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });

interface TableInfo {
  tableName: string;
  rowCount: number;
  size: string;
  columns: ColumnInfo[];
  indexes: IndexInfo[];
}

interface ColumnInfo {
  columnName: string;
  dataType: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  isUnique: boolean;
  defaultValue: string | null;
}

interface IndexInfo {
  indexName: string;
  indexDefinition: string;
  isUnique: boolean;
}

interface DatabaseStats {
  totalTables: number;
  totalRows: number;
  totalSize: string;
  activeConnections: number;
  lastBackup: Date | null;
  uptime: string;
}

interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

interface QueryResult {
  success: boolean;
  data?: any[];
  error?: string;
  executionTime?: string;
  affectedRows?: number;
  columns?: string[];
  isSelect?: boolean;
  message?: string;
}

interface PerformanceMetric {
  timestamp: string;
  queryTime: number;
  connections: number;
  memoryUsage: number;
}

interface TableSize {
  name: string;
  size: number;
  rowCount: number;
}

export default function DatabasePage() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [health, setHealth] = useState<{ status: string; checks: HealthCheck[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [customQuery, setCustomQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tables' | 'query' | 'health' | 'analytics'>('dashboard');
  const [tablePagination, setTablePagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0
  });
  const [isLoadingTableData, setIsLoadingTableData] = useState(false);
  const [isExecutingQuery, setIsExecutingQuery] = useState(false);

  // Real-time data
  const [liveUptime, setLiveUptime] = useState<string>('00:00:00');
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [tableSizes, setTableSizes] = useState<TableSize[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Fetch initial data
  useEffect(() => {
    loadDatabaseInfo();

    // Start live updates if auto-refresh is enabled
    if (autoRefresh) {
      startAutoRefresh();
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh]);

  const startAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    const interval = setInterval(() => {
      loadDatabaseInfo();
    }, 30000); // Refresh every 30 seconds

    setRefreshInterval(interval);
  };

  const loadDatabaseInfo = async () => {
    console.log('📡 Loading database info from main API...');

    try {
      // Load tables
      const tablesRes = await fetch('/api/database?action=tables');
      if (!tablesRes.ok) {
        const errorData = await tablesRes.json().catch(() => ({}));
        throw new Error(`Tables API error: ${tablesRes.status} - ${errorData.error || tablesRes.statusText}`);
      }

      const tablesData = await tablesRes.json();

      if (tablesData.success) {
        setTables(tablesData.tables || []);

        // Calculate table sizes for charts
        const sizes = (tablesData.tables || []).map((table: TableInfo) => ({
          name: table.tableName,
          size: parseFloat(table.size.replace(/[^0-9.]/g, '')) || 0,
          rowCount: table.rowCount
        }));
        setTableSizes(sizes.slice(0, 10)); // Top 10 tables
      } else {
        throw new Error(tablesData.error || 'Failed to load tables');
      }

      // Load stats
      const statsRes = await fetch('/api/database?action=stats');
      if (!statsRes.ok) {
        const errorData = await statsRes.json().catch(() => ({}));
        throw new Error(`Stats API error: ${statsRes.status} - ${errorData.error || statsRes.statusText}`);
      }

      const statsData = await statsRes.json();

      if (statsData.success) {
        setStats(statsData.stats || null);
      } else {
        throw new Error(statsData.error || 'Failed to load stats');
      }

      // Load health
      const healthRes = await fetch('/api/database?action=health');
      if (!healthRes.ok) {
        const errorData = await healthRes.json().catch(() => ({}));
        throw new Error(`Health API error: ${healthRes.status} - ${errorData.error || healthRes.statusText}`);
      }

      const healthData = await healthRes.json();

      if (healthData.success) {
        setHealth(healthData.health || null);
      } else {
        throw new Error(healthData.error || 'Failed to load health status');
      }

      // Update performance metrics
      const newMetric: PerformanceMetric = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        queryTime: Math.random() * 100 + 50, // Simulated data
        connections: statsData.stats?.activeConnections || 0,
        memoryUsage: Math.random() * 20 + 70 // Simulated data
      };

      setPerformanceMetrics(prev => {
        const updated = [...prev, newMetric].slice(-20); // Keep last 20 points
        return updated;
      });

      if (!loading) {
        toast.success('Database information refreshed');
      }

    } catch (error: any) {
      console.error('❌ Failed to load database information:', error.message);
      if (!loading) {
        toast.error(`Failed to refresh database information: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Dedicated effect for live uptime ticker
  useEffect(() => {
    if (!stats?.uptime || stats.uptime === 'Unknown') return;

    // Parse uptime string (e.g., "2d 5h 30m" or "5h 30m" or "30m")
    const daysMatch = stats.uptime.match(/(\d+)d/);
    const hoursMatch = stats.uptime.match(/(\d+)h/);
    const minutesMatch = stats.uptime.match(/(\d+)m/);

    const days = daysMatch ? parseInt(daysMatch[1]) : 0;
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

    // Convert everything to seconds for live updating
    let totalSeconds = days * 86400 + hours * 3600 + minutes * 60;

    const updateTicker = () => {
      totalSeconds += 1;
      const d = Math.floor(totalSeconds / 86400);
      const h = Math.floor((totalSeconds % 86400) / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;

      if (d > 0) {
        setLiveUptime(`${d}d ${h}h ${m}m ${s}s`);
      } else if (h > 0) {
        setLiveUptime(`${h}h ${m}m ${s}s`);
      } else if (m > 0) {
        setLiveUptime(`${m}m ${s}s`);
      } else {
        setLiveUptime(`${s}s`);
      }
    };

    updateTicker();
    const interval = setInterval(updateTicker, 1000);

    return () => clearInterval(interval);
  }, [stats?.uptime]);

  const loadTableData = async (tableName: string, page: number = 1) => {
    setIsLoadingTableData(true);
    try {
      const res = await fetch('/api/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'table_data',
          tableName,
          page,
          pageSize: tablePagination.pageSize
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setTableData(data.data);
        setSelectedTable(tableName);
        setTablePagination({
          page: data.page,
          pageSize: data.pageSize,
          total: data.total,
          totalPages: data.totalPages
        });
        toast.success(`Loaded ${data.data.length} rows from ${tableName} (Page ${data.page}/${data.totalPages})`);
      } else {
        throw new Error(data.error || 'Failed to load table data');
      }
    } catch (error: any) {
      console.error('Failed to load table data:', error);
      toast.error(`Failed to load table data: ${error.message}`);
    } finally {
      setIsLoadingTableData(false);
    }
  };

  const toggleTableExpand = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  const executeCustomQuery = async () => {
    if (!customQuery.trim()) {
      toast.error('Please enter a SQL query');
      return;
    }

    setIsExecutingQuery(true);
    try {
      const res = await fetch('/api/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'execute_query',
          query: customQuery
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setQueryResult(data);

      if (data.success) {
        toast.success(data.message || `Query executed successfully in ${data.executionTime}`);
      } else {
        toast.error(`Query failed: ${data.error}`);
      }
    } catch (error: any) {
      toast.error(`Failed to execute query: ${error.message}`);
      setQueryResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsExecutingQuery(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'Healthy';
      case 'warning': return 'Warning';
      case 'critical': return 'Critical';
      default: return 'Unknown';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'fail': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTableIcon = (tableName: string) => {
    if (tableName.includes('user')) return <Users className="w-4 h-4" />;
    if (tableName.includes('notification')) return <AlertCircle className="w-4 h-4" />;
    if (tableName.includes('log')) return <FileText className="w-4 h-4" />;
    if (tableName.includes('transaction')) return <Activity className="w-4 h-4" />;
    return <Table className="w-4 h-4" />;
  };

  const toggleAutoRefresh = () => {
    if (autoRefresh) {
      setAutoRefresh(false);
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
      toast.info('Auto-refresh disabled');
    } else {
      setAutoRefresh(true);
      startAutoRefresh();
      toast.success('Auto-refresh enabled (30s)');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const chartColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#ec4899'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading database information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <DatabaseIcon className="w-8 h-8 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Database Management</h1>
            <p className="text-gray-600">Monitor and manage your PostgreSQL database in real-time</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleAutoRefresh}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${autoRefresh
              ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
          >
            <Zap className={`w-4 h-4 mr-2 ${autoRefresh ? 'text-blue-600' : 'text-gray-500'}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>
          <button
            onClick={loadDatabaseInfo}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Health Status Banner */}
      {health && (
        <div className={`p-4 rounded-xl border shadow-sm ${health.status === 'healthy'
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
          : health.status === 'warning'
            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200'
            : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
          }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className={`w-4 h-4 rounded-full ${getStatusColor(health.status)} animate-pulse`} />
                <div className={`absolute inset-0 ${getStatusColor(health.status)} rounded-full animate-ping opacity-75`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Database Health: {getStatusText(health.status)}</h3>
                <p className="text-sm text-gray-600">
                  {health.checks.filter(c => c.status === 'pass').length} of {health.checks.length} checks passed
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">
                  {health.checks.filter(c => c.status === 'pass').length} Pass
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className="text-xs text-gray-600">
                  {health.checks.filter(c => c.status === 'warning').length} Warning
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-600">
                  {health.checks.filter(c => c.status === 'fail').length} Fail
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8 overflow-x-auto">
          {['dashboard', 'tables', 'query', 'health', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <div className="flex items-center space-x-2">
                {tab === 'dashboard' && <BarChart3 className="w-4 h-4" />}
                {tab === 'tables' && <Table className="w-4 h-4" />}
                {tab === 'query' && <Search className="w-4 h-4" />}
                {tab === 'health' && <ShieldCheck className="w-4 h-4" />}
                {tab === 'analytics' && <TrendingUp className="w-4 h-4" />}
                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'dashboard' && stats && (
            <DashboardTab
              stats={stats}
              performanceMetrics={performanceMetrics}
              tableSizes={tableSizes}
              liveUptime={liveUptime}
              formatBytes={formatBytes}
            />
          )}

          {activeTab === 'tables' && (
            <TablesTab
              tables={tables}
              expandedTables={expandedTables}
              toggleTableExpand={toggleTableExpand}
              loadTableData={loadTableData}
              isLoadingTableData={isLoadingTableData}
              selectedTable={selectedTable}
              tableData={tableData}
              tablePagination={tablePagination}
              copyToClipboard={copyToClipboard}
            />
          )}

          {activeTab === 'query' && (
            <QueryTab
              customQuery={customQuery}
              setCustomQuery={setCustomQuery}
              executeCustomQuery={executeCustomQuery}
              isExecutingQuery={isExecutingQuery}
              queryResult={queryResult}
              setQueryResult={setQueryResult}
              copyToClipboard={copyToClipboard}
            />
          )}

          {activeTab === 'health' && health && (
            <HealthTab
              health={health}
              loadDatabaseInfo={loadDatabaseInfo}
            />
          )}

          {activeTab === 'analytics' && stats && (
            <AnalyticsTab
              performanceMetrics={performanceMetrics}
              tableSizes={tableSizes}
              stats={stats}
              formatBytes={formatBytes}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Stats */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center font-medium text-gray-700">
              <DatabaseIcon className="w-4 h-4 mr-2 text-blue-500" />
              PostgreSQL 18.1 • Production
            </span>
            <span className="hidden md:inline text-gray-400">•</span>
            <span className="text-gray-600">Last refreshed: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-gray-600">Status: {health?.status || 'Unknown'}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Tables: {tables.length}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Rows: {stats?.totalRows.toLocaleString() || '0'}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Size: {stats?.totalSize || '0 bytes'}</span>
          </div>
        </div>
        {autoRefresh && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-center text-xs text-blue-600">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse mr-2"></div>
                <span>Auto-refresh enabled (30s interval)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
