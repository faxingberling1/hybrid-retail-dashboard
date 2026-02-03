// apps/dashboard/app/super-admin/database/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  Table, 
  Activity, 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Server,
  HardDrive,
  Users,
  Clock,
  Search,
  FileText,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Copy,
  Play,
  Eye,
  Database as DatabaseIcon,
  Key,
  Info,
  AlertTriangle,
  XCircle,
  Filter,
  BarChart3,
  TrendingUp,
  Cpu,
  Zap,
  Globe,
  ShieldCheck,
  Layers,
  AreaChart
} from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

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
        updateLiveUptime(statsData.stats?.uptime);
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

  const updateLiveUptime = (uptimeString: string) => {
    if (!uptimeString || uptimeString === 'Unknown') return;
    
    // Parse uptime string (e.g., "2d 5h 30m" or "5h 30m" or "30m")
    const daysMatch = uptimeString.match(/(\d+)d/);
    const hoursMatch = uptimeString.match(/(\d+)h/);
    const minutesMatch = uptimeString.match(/(\d+)m/);
    
    const days = daysMatch ? parseInt(daysMatch[1]) : 0;
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
    
    // Convert everything to seconds for live updating
    const totalSeconds = days * 86400 + hours * 3600 + minutes * 60;
    
    // Update every second
    const update = () => {
      const newSeconds = totalSeconds + 1;
      const d = Math.floor(newSeconds / 86400);
      const h = Math.floor((newSeconds % 86400) / 3600);
      const m = Math.floor((newSeconds % 3600) / 60);
      const s = newSeconds % 60;
      
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
    
    update();
    const interval = setInterval(update, 1000);
    
    // Clear interval on component unmount
    return () => clearInterval(interval);
  };

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
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              autoRefresh 
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
        <div className={`p-4 rounded-xl border shadow-sm ${
          health.status === 'healthy' 
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
              className={`py-4 px-1 font-medium text-sm border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab
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

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && stats && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Tables Card */}
            <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <Table className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {stats.totalTables}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Total Tables</h3>
              <p className="text-sm text-gray-500 mt-1">Tables in the database</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <Layers className="w-3 h-3 mr-1" />
                  <span>{tables.length} accessible</span>
                </div>
              </div>
            </div>

            {/* Total Rows Card */}
            <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent">
                  {stats.totalRows.toLocaleString()}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Total Rows</h3>
              <p className="text-sm text-gray-500 mt-1">Records across all tables</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>Active growth</span>
                </div>
              </div>
            </div>

            {/* Database Size Card */}
            <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                  <HardDrive className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  {stats.totalSize}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Database Size</h3>
              <p className="text-sm text-gray-500 mt-1">Total storage used</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <DatabaseIcon className="w-3 h-3 mr-1" />
                  <span>PostgreSQL 18.1</span>
                </div>
              </div>
            </div>

            {/* Live Uptime Card */}
            <div className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl">
                  <Clock className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                  {liveUptime}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">Live Uptime</h3>
              <p className="text-sm text-gray-500 mt-1">Database uptime duration</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1"></div>
                  <span>Live updating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics Chart */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                  <p className="text-sm text-gray-600">Real-time database performance</p>
                </div>
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
              {performanceMetrics.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="timestamp" 
                        stroke="#666"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#666"
                        fontSize={12}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="queryTime" 
                        name="Query Time (ms)" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="connections" 
                        name="Connections" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <p>Collecting performance data...</p>
                </div>
              )}
            </div>

            {/* Table Size Distribution */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Table Size Distribution</h3>
                  <p className="text-sm text-gray-600">Top tables by size</p>
                </div>
                <BarChart3 className="w-6 h-6 text-purple-500" />
              </div>
              {tableSizes.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tableSizes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="size"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {tableSizes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${formatBytes(Number(value))}`, 'Size']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <p>No table size data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Active Connections */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Active Connections</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeConnections}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                  <span>Connection Pool</span>
                  <span>{stats.activeConnections}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(stats.activeConnections, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Memory Usage */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Cpu className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Memory Usage</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {performanceMetrics.length > 0 
                      ? `${Math.round(performanceMetrics[performanceMetrics.length - 1].memoryUsage)}%`
                      : '--%'
                    }
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                  <span>System Memory</span>
                  <span>{performanceMetrics.length > 0 ? `${Math.round(performanceMetrics[performanceMetrics.length - 1].memoryUsage)}%` : '--%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${performanceMetrics.length > 0 ? performanceMetrics[performanceMetrics.length - 1].memoryUsage : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Query Performance */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Avg Query Time</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {performanceMetrics.length > 0 
                      ? `${Math.round(performanceMetrics.reduce((sum, m) => sum + m.queryTime, 0) / performanceMetrics.length)}ms`
                      : '--ms'
                    }
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Last query</span>
                  <span>{performanceMetrics.length > 0 ? `${Math.round(performanceMetrics[performanceMetrics.length - 1].queryTime)}ms` : '--'}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
                  <span>Best today</span>
                  <span>{performanceMetrics.length > 0 ? `${Math.round(Math.min(...performanceMetrics.map(m => m.queryTime)))}ms` : '--'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                  <p className="text-sm text-gray-600">Latest database operations</p>
                </div>
                <Activity className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { time: '2 min ago', action: 'SELECT query executed', table: 'users', duration: '45ms' },
                  { time: '5 min ago', action: 'Table data loaded', table: 'notifications', duration: '120ms' },
                  { time: '12 min ago', action: 'Health check completed', table: 'system', duration: '15ms' },
                  { time: '30 min ago', action: 'Statistics updated', table: 'all', duration: '230ms' },
                  { time: '1 hour ago', action: 'Database backup initiated', table: 'system', duration: '2.5s' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <DatabaseIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">Table: {activity.table}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{activity.time}</p>
                      <p className="text-xs text-gray-500">Duration: {activity.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tables Tab */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          {/* Table List */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Database Tables</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {tables.length} tables found. Click on a table to expand and view its structure
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center px-3 py-1 bg-gray-100 rounded-lg">
                    <Filter className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">
                      {tables.reduce((sum, table) => sum + table.rowCount, 0).toLocaleString()} total rows
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {tables.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Table className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No tables found in the database</p>
              </div>
            ) : (
              <div className="divide-y">
                {tables.map((table) => (
                  <div key={table.tableName} className="p-6 hover:bg-gray-50 transition-colors">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleTableExpand(table.tableName)}
                    >
                      <div className="flex items-center space-x-3">
                        {expandedTables.has(table.tableName) ? (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        )}
                        <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                          {getTableIcon(table.tableName)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{table.tableName}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                              {table.rowCount.toLocaleString()} rows
                            </span>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                              {table.size}
                            </span>
                            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                              {table.columns.length} columns
                            </span>
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full">
                              {table.indexes.length} indexes
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            loadTableData(table.tableName);
                          }}
                          disabled={isLoadingTableData && selectedTable === table.tableName}
                          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {isLoadingTableData && selectedTable === table.tableName ? 'Loading...' : 'View Data'}
                        </button>
                      </div>
                    </div>

                    {expandedTables.has(table.tableName) && (
                      <div className="mt-6 pl-14 space-y-6">
                        {/* Columns */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 flex items-center">
                              <Key className="w-5 h-5 mr-2 text-blue-500" />
                              Columns ({table.columns.length})
                            </h4>
                            <span className="text-sm text-gray-500">Click to copy values</span>
                          </div>
                          <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl border overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="min-w-full">
                                <thead>
                                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nullable</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Constraints</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Default</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {table.columns.map((column) => (
                                    <tr key={column.columnName} className="hover:bg-gray-50 transition-colors">
                                      <td className="px-4 py-3">
                                        <div className="flex items-center group">
                                          <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {column.columnName}
                                          </span>
                                          <button
                                            onClick={() => copyToClipboard(column.columnName)}
                                            className="ml-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Copy column name"
                                          >
                                            <Copy className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className="inline-block px-2 py-1 text-xs font-mono font-medium bg-gray-100 text-gray-800 rounded">
                                          {column.dataType}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                                          column.isNullable 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                          {column.isNullable ? 'Yes' : 'No'}
                                        </span>
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                          {column.isPrimaryKey && (
                                            <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-lg">
                                              Primary Key
                                            </span>
                                          )}
                                          {column.isUnique && !column.isPrimaryKey && (
                                            <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-lg">
                                              Unique
                                            </span>
                                          )}
                                          {!column.isPrimaryKey && !column.isUnique && (
                                            <span className="px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-lg">
                                              None
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">
                                        {column.defaultValue ? (
                                          <div className="flex items-center group">
                                            <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded truncate max-w-[150px]">
                                              {column.defaultValue}
                                            </code>
                                            <button
                                              onClick={() => copyToClipboard(column.defaultValue!)}
                                              className="ml-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                              title="Copy default value"
                                            >
                                              <Copy className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ) : (
                                          <span className="text-gray-400">-</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>

                        {/* Indexes */}
                        {table.indexes.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <DatabaseIcon className="w-5 h-5 mr-2 text-purple-500" />
                              Indexes ({table.indexes.length})
                            </h4>
                            <div className="space-y-3">
                              {table.indexes.map((index) => (
                                <div key={index.indexName} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border hover:shadow-md transition-shadow">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                      <span className="font-semibold text-gray-900">{index.indexName}</span>
                                      {index.isUnique && (
                                        <span className="ml-3 px-3 py-0.5 text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full">
                                          Unique
                                        </span>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => copyToClipboard(index.indexDefinition)}
                                      className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                                    >
                                      <Copy className="w-3 h-3 mr-1" />
                                      Copy
                                    </button>
                                  </div>
                                  <pre className="text-sm text-gray-600 font-mono bg-gray-50 p-3 rounded-lg overflow-x-auto">
                                    {index.indexDefinition}
                                  </pre>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Table Data Viewer */}
          {selectedTable && tableData.length > 0 && (
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-blue-500" />
                      Data: {selectedTable}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isLoadingTableData ? 'Loading data...' : `Showing ${tableData.length} rows`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => loadTableData(selectedTable, 1)}
                      disabled={isLoadingTableData}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors flex items-center"
                    >
                      <RefreshCw className={`w-4 h-4 mr-1 ${isLoadingTableData ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              {/* Table Data */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      {Object.keys(tableData[0]).map((key) => (
                        <th
                          key={key}
                          className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          <div className="flex items-center">
                            {key}
                            <button
                              onClick={() => copyToClipboard(key)}
                              className="ml-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 hover:opacity-100 transition-opacity"
                              title="Copy column name"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tableData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                        {Object.entries(row).map(([key, value], cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4">
                            <div className="group relative">
                              <span className="text-sm text-gray-900 truncate block max-w-xs">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                              <button
                                onClick={() => copyToClipboard(typeof value === 'object' ? JSON.stringify(value) : String(value))}
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 transition-opacity rounded"
                                title="Copy value"
                              >
                                <Copy className="w-4 h-4 text-blue-600" />
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {tablePagination.totalPages > 1 && (
                <div className="p-6 border-t">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Showing page {tablePagination.page} of {tablePagination.totalPages} • {tablePagination.total.toLocaleString()} total rows
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => loadTableData(selectedTable!, tablePagination.page - 1)}
                        disabled={tablePagination.page <= 1 || isLoadingTableData}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </button>
                      <div className="flex items-center space-x-1">
                        {(() => {
                          const maxPages = Math.min(5, tablePagination.totalPages);
                          const pageNumbers = [];
                          for (let i = 1; i <= maxPages; i++) {
                            pageNumbers.push(i);
                          }
                          return pageNumbers.map(pageNum => (
                            <button
                              key={pageNum}
                              onClick={() => loadTableData(selectedTable!, pageNum)}
                              className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                                tablePagination.page === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ));
                        })()}
                        {tablePagination.totalPages > 5 && (
                          <>
                            <span className="px-2">...</span>
                            <button
                              onClick={() => loadTableData(selectedTable!, tablePagination.totalPages)}
                              className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                                tablePagination.page === tablePagination.totalPages
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {tablePagination.totalPages}
                            </button>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => loadTableData(selectedTable!, tablePagination.page + 1)}
                        disabled={tablePagination.page >= tablePagination.totalPages || isLoadingTableData}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Query Tab */}
      {activeTab === 'query' && (
        <div className="space-y-6">
          {/* Query Editor */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">SQL Query Editor</h2>
                  <p className="text-sm text-gray-600 mt-1">Execute custom SQL queries against your database</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <span className="text-sm font-medium text-green-700">Read & Write Access</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    SQL Query
                    <span className="ml-2 text-xs font-normal text-gray-500">(SELECT, INSERT, UPDATE, DELETE allowed)</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="SELECT * FROM users LIMIT 10;"
                    />
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => {
                          setCustomQuery('');
                          setQueryResult(null);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Clear query"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(customQuery)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy query"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-gray-400" />
                      Dangerous operations are blocked for safety
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setCustomQuery('');
                        setQueryResult(null);
                      }}
                      className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear
                    </button>
                    <button
                      onClick={executeCustomQuery}
                      disabled={isExecutingQuery || !customQuery.trim()}
                      className="flex items-center px-8 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                    >
                      <Play className={`w-4 h-4 mr-2 ${isExecutingQuery ? 'animate-pulse' : ''}`} />
                      {isExecutingQuery ? 'Executing...' : 'Execute Query'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Query Results */}
          {queryResult && (
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h2 className="text-lg font-semibold text-gray-900">Query Results</h2>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        queryResult.success 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' 
                          : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800'
                      }`}>
                        {queryResult.success ? 'SUCCESS' : 'FAILED'}
                      </div>
                    </div>
                    {queryResult.executionTime && (
                      <p className="text-sm text-gray-600 mt-1">
                        Executed in {queryResult.executionTime} • {queryResult.affectedRows || 0} rows affected
                      </p>
                    )}
                  </div>
                  {queryResult.success && queryResult.data && queryResult.data.length > 0 && (
                    <div className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                      <span className="text-sm font-medium text-blue-700">{queryResult.data.length} rows returned</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {queryResult.error ? (
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-4">
                    <div className="flex">
                      <XCircle className="w-5 h-5 text-red-500 mr-3" />
                      <div>
                        <h3 className="text-sm font-semibold text-red-800">Error Executing Query</h3>
                        <div className="mt-2">
                          <p className="text-sm text-red-700">{queryResult.error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : queryResult.data && queryResult.data.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          {queryResult.columns?.map((key) => (
                            <th
                              key={key}
                              className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                            >
                              <div className="flex items-center justify-between">
                                {key}
                                <button
                                  onClick={() => copyToClipboard(key)}
                                  className="p-1 text-gray-400 hover:text-gray-600 opacity-0 hover:opacity-100 transition-opacity"
                                  title="Copy column name"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {queryResult.data.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors">
                            {queryResult.columns?.map((key, cellIndex) => (
                              <td key={cellIndex} className="px-6 py-4">
                                <div className="group relative">
                                  <span className="text-sm text-gray-900 truncate block max-w-xs">
                                    {typeof row[key] === 'object' 
                                      ? JSON.stringify(row[key]) 
                                      : String(row[key] || 'NULL')}
                                  </span>
                                  <button
                                    onClick={() => copyToClipboard(typeof row[key] === 'object' ? JSON.stringify(row[key]) : String(row[key] || ''))}
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 transition-opacity rounded"
                                    title="Copy value"
                                  >
                                    <Copy className="w-4 h-4 text-blue-600" />
                                  </button>
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : queryResult.success ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Query Executed Successfully</h3>
                    <p className="text-gray-600">
                      {queryResult.message || 'No data returned from query.'}
                    </p>
                    {queryResult.affectedRows !== undefined && (
                      <p className="mt-2 text-sm text-gray-500">
                        {queryResult.affectedRows} rows were affected.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Example Queries */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Example Queries</h2>
                  <p className="text-sm text-gray-600 mt-1">Try these example queries to get started</p>
                </div>
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'List all users',
                    description: 'Get all users with their roles and creation dates',
                    query: "SELECT id, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 10;",
                    icon: <Users className="w-5 h-5 text-blue-500" />
                  },
                  {
                    title: 'Recent notifications',
                    description: 'View the latest notifications in the system',
                    query: "SELECT id, user_id, title, type, read, created_at FROM notifications ORDER BY created_at DESC LIMIT 10;",
                    icon: <AlertCircle className="w-5 h-5 text-purple-500" />
                  },
                  {
                    title: 'Table sizes',
                    description: 'Check the size of each table in the database',
                    query: "SELECT tablename, pg_size_pretty(pg_total_relation_size(tablename)) as size FROM pg_tables WHERE schemaname = 'public' ORDER BY size DESC;",
                    icon: <DatabaseIcon className="w-5 h-5 text-green-500" />
                  },
                  {
                    title: 'Database info',
                    description: 'Get current database information and status',
                    query: "SELECT version(), current_database(), current_user, now() as current_time;",
                    icon: <Info className="w-5 h-5 text-orange-500" />
                  }
                ].map((example, index) => (
                  <div 
                    key={index} 
                    className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setCustomQuery(example.query);
                      setActiveTab('query');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm border">
                          {example.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {example.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">{example.description}</p>
                        </div>
                      </div>
                      <div className="p-2 text-gray-400 group-hover:text-blue-500 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                    <pre className="text-sm text-gray-600 bg-white p-3 rounded-lg border overflow-x-auto mt-3 group-hover:border-blue-200 transition-colors">
                      {example.query}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Tab */}
      {activeTab === 'health' && health && (
        <div className="space-y-6">
          {/* Health Checks */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Health Checks</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Current database health status and diagnostic information
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  health.status === 'healthy' 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' 
                    : health.status === 'warning'
                    ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800'
                    : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800'
                }`}>
                  {health.status.toUpperCase()}
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {health.checks.map((check, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-sm ${
                      check.status === 'pass' 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300' 
                        : check.status === 'warning'
                        ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 hover:border-yellow-300'
                        : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm border">
                        {getHealthIcon(check.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{check.name}</h3>
                        <p className="text-sm text-gray-600">{check.message}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      check.status === 'pass' 
                        ? 'bg-green-100 text-green-800' 
                        : check.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {check.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recommendations</h2>
                  <p className="text-sm text-gray-600 mt-1">Suggested actions based on current health status</p>
                </div>
                <ShieldCheck className="w-6 h-6 text-gray-400" />
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {health.status === 'critical' && (
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-5">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <XCircle className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-red-800">Immediate Action Required</h3>
                        <p className="mt-2 text-red-700">
                          The database is experiencing critical issues. Immediate attention is required to restore functionality.
                        </p>
                        <ul className="mt-3 space-y-2">
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-red-700">Check database connection settings and credentials</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-red-700">Verify PostgreSQL service is running on the server</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-red-700">Review error logs for specific failure details</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-red-700">Consider restarting the database service if safe</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {health.status === 'warning' && (
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-5">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-yellow-500" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-yellow-800">Recommended Actions</h3>
                        <p className="mt-2 text-yellow-700">
                          The database is functioning but showing warning signs. Proactive measures are recommended.
                        </p>
                        <ul className="mt-3 space-y-2">
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-yellow-700">Monitor database locks and long-running queries regularly</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-yellow-700">Consider optimizing slow queries identified in logs</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-yellow-700">Review connection pool settings and adjust if necessary</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-yellow-500 rounded-full mr-2"></div>
                            <span className="text-yellow-700">Schedule regular database maintenance and index rebuilding</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {health.status === 'healthy' && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-green-800">Database is Healthy</h3>
                        <p className="mt-2 text-green-700">
                          All systems are operating normally. Continue with regular monitoring and maintenance.
                        </p>
                        <ul className="mt-3 space-y-2">
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-green-700">All health checks are passing and systems are functioning properly</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-green-700">Connection pool is operating within normal parameters</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-green-700">No significant locks or blocking issues detected</span>
                          </li>
                          <li className="flex items-start">
                            <div className="flex-shrink-0 w-2 h-2 mt-1.5 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-green-700">Continue regular monitoring and scheduled maintenance</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preventive Maintenance Tips */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm border">
                      <Shield className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-blue-800">Preventive Maintenance</h3>
                      <p className="mt-1 text-blue-700 text-sm">
                        Regular maintenance tasks to keep your database running optimally:
                      </p>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-blue-700">Weekly index maintenance</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-blue-700">Monthly statistics update</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-blue-700">Quarterly vacuum operations</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-blue-700">Regular backup verification</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Database Growth Chart */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Database Growth Trends</h2>
                  <p className="text-sm text-gray-600 mt-1">Historical growth patterns and projections</p>
                </div>
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#666"
                      fontSize={12}
                      tickMargin={10}
                    />
                    <YAxis 
                      stroke="#666"
                      fontSize={12}
                      label={{ 
                        value: 'Query Time (ms)', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' }
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        padding: '12px'
                      }}
                      formatter={(value: any) => [`${value} ms`, 'Query Time']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="queryTime" 
                      name="Query Time" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Tables by Size */}
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Top Tables by Size</h2>
                    <p className="text-sm text-gray-600 mt-1">Largest tables in the database</p>
                  </div>
                  <HardDrive className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <div className="p-6">
                {tableSizes.length > 0 ? (
                  <div className="space-y-4">
                    {tableSizes.slice(0, 8).map((table, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-purple-200">
                            <span className="text-sm font-semibold text-purple-600">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{table.name}</h3>
                            <p className="text-sm text-gray-500">{table.rowCount.toLocaleString()} rows</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatBytes(table.size)}</p>
                          <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"
                              style={{ 
                                width: `${(table.size / Math.max(...tableSizes.map(t => t.size))) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <HardDrive className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No table size data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl border shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Performance Metrics</h2>
                    <p className="text-sm text-gray-600 mt-1">Recent performance statistics</p>
                  </div>
                  <Activity className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Average Query Time</span>
                      <span className="font-semibold text-gray-900">
                        {performanceMetrics.length > 0 
                          ? `${Math.round(performanceMetrics.reduce((sum, m) => sum + m.queryTime, 0) / performanceMetrics.length)}ms`
                          : '--ms'
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                        style={{ 
                          width: performanceMetrics.length > 0 
                            ? `${Math.min((performanceMetrics.reduce((sum, m) => sum + m.queryTime, 0) / performanceMetrics.length) / 2, 100)}%`
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                      <span className="font-semibold text-gray-900">
                        {performanceMetrics.length > 0 
                          ? `${Math.round(performanceMetrics[performanceMetrics.length - 1].memoryUsage)}%`
                          : '--%'
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                        style={{ 
                          width: performanceMetrics.length > 0 
                            ? `${performanceMetrics[performanceMetrics.length - 1].memoryUsage}%`
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Active Connections</span>
                      <span className="font-semibold text-gray-900">{stats?.activeConnections || 0}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                        style={{ width: `${Math.min((stats?.activeConnections || 0) * 10, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <span className="text-gray-600">Status: {health?.status ? getStatusText(health.status) : 'Unknown'}</span>
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