// @ts-nocheck
import {
    Table,
    ChevronRight,
    ChevronDown,
    Eye,
    Key,
    Database as DatabaseIcon,
    Copy,
    RefreshCw,
    Search,
    Filter,
    Users,
    AlertCircle,
    FileText,
    Activity,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TablesTabProps {
    tables: any[];
    expandedTables: Set<string>;
    toggleTableExpand: (tableName: string) => void;
    loadTableData: (tableName: string, page?: number) => void;
    isLoadingTableData: boolean;
    selectedTable: string | null;
    tableData: any[];
    tablePagination: any;
    copyToClipboard: (text: string) => void;
}

export default function TablesTab({
    tables,
    expandedTables,
    toggleTableExpand,
    loadTableData,
    isLoadingTableData,
    selectedTable,
    tableData,
    tablePagination,
    copyToClipboard
}: TablesTabProps) {
    const getTableIcon = (tableName: string) => {
        const name = tableName.toLowerCase();
        if (name.includes('user')) return <Users className="w-4 h-4" />;
        if (name.includes('notification')) return <AlertCircle className="w-4 h-4" />;
        if (name.includes('log')) return <FileText className="w-4 h-4" />;
        if (name.includes('transaction')) return <Activity className="w-4 h-4" />;
        return <Table className="w-4 h-4" />;
    };

    const getTableColor = (tableName: string) => {
        const name = tableName.toLowerCase();
        if (name.includes('user')) return 'from-blue-500 to-indigo-600';
        if (name.includes('notification')) return 'from-amber-500 to-orange-600';
        if (name.includes('log')) return 'from-gray-500 to-gray-600';
        if (name.includes('transaction')) return 'from-emerald-500 to-teal-600';
        return 'from-indigo-600 to-purple-700';
    };

    return (
        <div className="space-y-8">
            {/* Table Explorer Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Table List (Left Side) */}
                <div className="xl:col-span-1 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div>
                            <h3 className="text-xl font-black text-gray-900">Schema Explorer</h3>
                            <p className="text-sm font-medium text-gray-500">{tables.length} Total Entities</p>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                        {tables.map((table, index) => (
                            <motion.div
                                key={table.tableName}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${selectedTable === table.tableName
                                        ? 'bg-gradient-to-br from-indigo-50 to-white border-indigo-200 shadow-md ring-1 ring-indigo-100'
                                        : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-lg hover:-translate-y-0.5'
                                    }`}
                                onClick={() => toggleTableExpand(table.tableName)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${getTableColor(table.tableName)} text-white shadow-lg shadow-gray-200 transition-transform group-hover:scale-110`}>
                                            {getTableIcon(table.tableName)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{table.tableName}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{table.rowCount.toLocaleString()} Rows</span>
                                                <div className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{table.size}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                loadTableData(table.tableName);
                                            }}
                                            className={`p-2 rounded-lg transition-colors ${selectedTable === table.tableName
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                                                }`}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedTables.has(table.tableName) && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                                                        {table.columns.length} Cols
                                                    </span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-widest border border-purple-100">
                                                        {table.indexes.length} Idx
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {table.columns.slice(0, 4).map(col => (
                                                        <div key={col.columnName} className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                                            <div className={`w-1 h-1 rounded-full ${col.isPrimaryKey ? 'bg-amber-400' : 'bg-gray-300'}`} />
                                                            <span className="truncate">{col.columnName}</span>
                                                        </div>
                                                    ))}
                                                    {table.columns.length > 4 && (
                                                        <div className="text-[10px] font-bold text-indigo-500 italic">
                                                            +{table.columns.length - 4} more...
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Data Viewer (Right Side / Expandable) */}
                <div className="xl:col-span-2 space-y-6">
                    <AnimatePresence mode="wait">
                        {selectedTable ? (
                            <motion.div
                                key={selectedTable}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden flex flex-col h-full min-h-[600px]"
                            >
                                {/* Viewer Header */}
                                <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-gray-50/50 to-white">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${getTableColor(selectedTable)} text-white shadow-lg`}>
                                                {getTableIcon(selectedTable)}
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedTable}</h2>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Live Instance</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tablePagination.total.toLocaleString()} Records</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => loadTableData(selectedTable, tablePagination.page)}
                                                disabled={isLoadingTableData}
                                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                                            >
                                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingTableData ? 'animate-spin' : ''}`} />
                                                Refresh
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>

                                {/* Data Table */}
                                <div className="flex-1 overflow-x-auto relative">
                                    {isLoadingTableData && (
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                                <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">Syncing Records...</span>
                                            </div>
                                        </div>
                                    )}

                                    {tableData.length > 0 ? (
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50/50">
                                                    {Object.keys(tableData[0]).map((key) => (
                                                        <th key={key} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                                            <div className="flex items-center gap-2">
                                                                <span>{key}</span>
                                                                <button
                                                                    onClick={() => copyToClipboard(key)}
                                                                    className="p-1 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <Copy className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData.map((row, rowIndex) => (
                                                    <motion.tr
                                                        key={rowIndex}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: rowIndex * 0.02 }}
                                                        className="group hover:bg-indigo-50/30 transition-colors"
                                                    >
                                                        {Object.entries(row).map(([key, value], cellIndex) => (
                                                            <td key={cellIndex} className="px-6 py-4 text-sm border-b border-gray-50">
                                                                <div className="max-w-[200px] truncate font-medium text-gray-700">
                                                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                                </div>
                                                            </td>
                                                        ))}
                                                    </motion.tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                                            <DatabaseIcon className="w-16 h-16 mb-4 opacity-20" />
                                            <p className="text-xl font-black italic">No records found for this entity</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination Footer */}
                                <div className="p-6 border-t border-gray-50 bg-gray-50/30">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            Page <span className="text-indigo-600">{tablePagination.page}</span> of {tablePagination.totalPages}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                whileHover={{ x: -2 }}
                                                onClick={() => loadTableData(selectedTable, tablePagination.page - 1)}
                                                disabled={tablePagination.page <= 1 || isLoadingTableData}
                                                className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-white disabled:opacity-20 transition-all shadow-sm"
                                            >
                                                <ArrowLeft className="w-4 h-4" />
                                            </motion.button>

                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: Math.min(5, tablePagination.totalPages) }).map((_, i) => {
                                                    const pageNum = i + 1;
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => loadTableData(selectedTable, pageNum)}
                                                            className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${tablePagination.page === pageNum
                                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                                                    : 'text-gray-500 hover:bg-white hover:shadow-sm'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <motion.button
                                                whileHover={{ x: 2 }}
                                                onClick={() => loadTableData(selectedTable, tablePagination.page + 1)}
                                                disabled={tablePagination.page >= tablePagination.totalPages || isLoadingTableData}
                                                className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-white disabled:opacity-20 transition-all shadow-sm"
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-full min-h-[600px] border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50"
                            >
                                <div className="p-8 rounded-full bg-white shadow-xl mb-6">
                                    <DatabaseIcon className="w-12 h-12 text-indigo-500" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight text-center">Select an entity to explore</h3>
                                <p className="text-sm font-medium text-gray-500 mt-2 max-w-[280px] text-center">
                                    Gain deep insights into your database structure and live records with a single click.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
