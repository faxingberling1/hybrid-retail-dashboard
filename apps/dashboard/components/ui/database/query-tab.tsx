// @ts-nocheck
import {
    Search,
    Play,
    XCircle,
    Copy,
    Shield,
    CheckCircle2,
    Clock,
    Activity,
    Zap,
    Box,
    Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QueryTabProps {
    customQuery: string;
    setCustomQuery: (query: string) => void;
    executeCustomQuery: () => void;
    isExecutingQuery: boolean;
    queryResult: any;
    setQueryResult: (result: any) => void;
    copyToClipboard: (text: string) => void;
}

export default function QueryTab({
    customQuery,
    setCustomQuery,
    executeCustomQuery,
    isExecutingQuery,
    queryResult,
    setQueryResult,
    copyToClipboard
}: QueryTabProps) {
    return (
        <div className="space-y-8">
            {/* Query Editor Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
                <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-slate-900 rounded-2xl text-white shadow-xl">
                            <Terminal className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">SQL Console</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Read / Write Access</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Standard PostgreSQL 18.1</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setCustomQuery('');
                                setQueryResult(null);
                            }}
                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            title="Flush Console"
                        >
                            <XCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[21px] blur opacity-10 group-focus-within:opacity-20 transition-opacity" />
                        <textarea
                            value={customQuery}
                            onChange={(e) => setCustomQuery(e.target.value)}
                            placeholder="-- Write your SQL query here
SELECT * FROM users ORDER BY created_at DESC LIMIT 5;"
                            className="relative w-full min-h-[250px] p-6 bg-slate-950 text-indigo-100 font-mono text-sm border-none rounded-2xl focus:ring-0 transition-all placeholder:text-slate-600 leading-relaxed shadow-inner"
                        />

                        <div className="absolute bottom-6 right-6 flex items-center gap-3">
                            <div className="px-4 py-2 bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-800 flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <Shield className="w-3.5 h-3.5" />
                                    Secure Sandbox
                                </div>
                                <div className="w-px h-3 bg-slate-700" />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={executeCustomQuery}
                                    disabled={isExecutingQuery || !customQuery.trim()}
                                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                    <Play className={`w-3.5 h-3.5 fill-current ${isExecutingQuery ? 'animate-pulse' : ''}`} />
                                    {isExecutingQuery ? 'Executing...' : 'Run Query'}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Results Section */}
            <AnimatePresence>
                {queryResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                    >
                        {/* Result Stats */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${queryResult.success ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {queryResult.success ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 uppercase tracking-tight">
                                        {queryResult.success ? 'Query Successful' : 'Execution Failed'}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {queryResult.executionTime || '0ms'}</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                        <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {queryResult.affectedRows || 0} Affected</span>
                                    </div>
                                </div>
                            </div>
                            {queryResult.success && queryResult.data && queryResult.data.length > 0 && (
                                <div className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 shadow-sm shadow-indigo-500/5">
                                    {queryResult.data.length} Rows Returned
                                </div>
                            )}
                        </div>

                        {/* Result Content */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                            {queryResult.error ? (
                                <div className="p-12 text-center max-w-lg mx-auto">
                                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Zap className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 mb-2">PostgreSQL Exception</h4>
                                    <p className="font-mono text-sm text-red-600 leading-relaxed bg-red-50/50 p-4 rounded-xl border border-red-100">
                                        {queryResult.error}
                                    </p>
                                </div>
                            ) : queryResult.data && queryResult.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50/50">
                                                {Object.keys(queryResult.data[0]).map((key) => (
                                                    <th key={key} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                                        {key}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {queryResult.data.map((row, rowIndex) => (
                                                <tr key={rowIndex} className="group hover:bg-slate-50 transition-colors">
                                                    {Object.values(row).map((value, cellIndex) => (
                                                        <td key={cellIndex} className="px-6 py-4 text-sm font-medium text-gray-700 border-b border-gray-50">
                                                            <div className="max-w-[250px] truncate">
                                                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                            </div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-12 text-center max-w-lg mx-auto">
                                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-black text-gray-900 mb-2">Executed Successfully</h4>
                                    <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                        The command was completed but returned no data. {queryResult.message}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
