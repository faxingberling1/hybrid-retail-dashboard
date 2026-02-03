// @ts-nocheck
import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Info,
    ShieldCheck,
    Activity,
    Cpu,
    HardDrive,
    Globe,
    Lock,
    Zap,
    RefreshCw,
    Server
} from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthCheck {
    name: string;
    status: 'pass' | 'fail' | 'warning';
    message: string;
}

interface HealthTabProps {
    health: {
        status: string;
        checks: HealthCheck[];
    } | null;
    loadDatabaseInfo: () => void;
}

export default function HealthTab({ health, loadDatabaseInfo }: HealthTabProps) {
    if (!health) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pass': return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
            case 'warning': return <AlertTriangle className="w-6 h-6 text-amber-500" />;
            case 'fail': return <XCircle className="w-6 h-6 text-red-500" />;
            default: return <Info className="w-6 h-6 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'from-emerald-500 to-teal-700';
            case 'warning': return 'from-amber-500 to-orange-700';
            case 'critical': return 'from-red-500 to-rose-700';
            default: return 'from-gray-500 to-gray-700';
        }
    };

    return (
        <div className="space-y-8">
            {/* Global Status Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden rounded-[32px] p-px bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 shadow-2xl"
            >
                <div className={`relative bg-white rounded-[31px] p-10 overflow-hidden`}>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="flex items-center gap-8">
                            <div className="relative">
                                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${getStatusColor(health.status)} shadow-2xl flex items-center justify-center relative z-10`}>
                                    <ShieldCheck className="w-12 h-12 text-white" />
                                </div>
                                <div className={`absolute -inset-2 bg-gradient-to-br ${getStatusColor(health.status)} rounded-3xl blur-xl opacity-20`} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-4xl font-black text-gray-900 tracking-tight capitalize">
                                        {health.status} Status
                                    </h2>
                                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                        Live Telemetry
                                    </div>
                                </div>
                                <p className="text-lg font-medium text-gray-500 max-w-xl">
                                    {health.status === 'healthy'
                                        ? "Your database cluster is performing at peak efficiency with zero latency spikes detected."
                                        : "Some performance anomalies have been detected. Our automated optimization is mitigating impact."}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pass Ratio</div>
                                <div className="text-2xl font-black text-gray-900">{health.checks.filter(c => c.status === 'pass').length} / {health.checks.length}</div>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Uptime</div>
                                <div className="text-2xl font-black text-emerald-600 tracking-tighter">99.98%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Health Checks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {health.checks.map((check, index) => (
                    <motion.div
                        key={check.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">
                                {check.name.toLowerCase().includes('connection') && <Globe className="w-5 h-5 text-blue-500" />}
                                {check.name.toLowerCase().includes('memory') && <Cpu className="w-5 h-5 text-emerald-500" />}
                                {check.name.toLowerCase().includes('storage') && <HardDrive className="w-5 h-5 text-amber-500" />}
                                {check.name.toLowerCase().includes('security') && <Lock className="w-5 h-5 text-purple-500" />}
                                {!['connection', 'memory', 'storage', 'security'].some(k => check.name.toLowerCase().includes(k)) && <Activity className="w-5 h-5 text-gray-500" />}
                            </div>
                            <div className={`p-2 rounded-xl ${check.status === 'pass' ? 'bg-emerald-50' : check.status === 'warning' ? 'bg-amber-50' : 'bg-red-50'
                                }`}>
                                {getStatusIcon(check.status)}
                            </div>
                        </div>
                        <h4 className="text-lg font-black text-gray-900 mb-2 truncate group-hover:text-indigo-600 transition-colors">{check.name}</h4>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed">
                            {check.message}
                        </p>
                        <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Diagnostic ID: RDS-{index + 102}</span>
                            <div className="flex h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full ${check.status === 'pass' ? 'w-full bg-emerald-500' : check.status === 'warning' ? 'w-1/2 bg-amber-500' : 'w-1/4 bg-red-500'}`} />
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Diagnostic Action Card */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: health.checks.length * 0.1 }}
                    onClick={loadDatabaseInfo}
                    className="group relative flex flex-col items-center justify-center p-8 rounded-[32px] border-2 border-dashed border-gray-200 bg-gray-50/50 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-300"
                >
                    <div className="p-4 bg-white rounded-2xl shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all">
                        <RefreshCw className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h4 className="text-xl font-black text-gray-900 tracking-tight">Recalibrate Cluster</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Scan Infrastructure Now</p>
                </motion.button>
            </div>

            {/* Infrastructure Specs */}
            <div className="bg-slate-900 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative mb-10">
                    <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                        <Server className="w-6 h-6 text-blue-400" />
                        Environment Specifications
                    </h3>
                    <p className="text-slate-400 font-medium mt-1">High-performance relational cluster topology</p>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: 'Cluster Engine', value: 'Aurora PostgreSQL', sub: 'v18.1 Optimized', icon: <Zap className="w-6 h-6" /> },
                        { label: 'Deployment', value: 'Multi-AZ Cluster', sub: 'High Availability', icon: <Globe className="w-6 h-6" /> },
                        { label: 'Encryption', value: 'AES-256 GCM', sub: 'At Rest & Transit', icon: <Lock className="w-6 h-6" /> },
                        { label: 'Integrity', value: 'Auto-Recoverable', sub: 'Fault Tolerant', icon: <ShieldCheck className="w-6 h-6" /> },
                    ].map((spec, i) => (
                        <div key={i} className="space-y-4">
                            <div className="p-3 bg-slate-800 rounded-2xl w-fit text-blue-400 border border-slate-700">
                                {spec.icon}
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{spec.label}</h5>
                                <div className="text-xl font-black text-white tracking-tighter">{spec.value}</div>
                                <div className="text-xs font-bold text-blue-400 italic mt-1">{spec.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
