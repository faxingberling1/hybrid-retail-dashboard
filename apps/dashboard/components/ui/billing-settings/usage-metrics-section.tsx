// @ts-nocheck
import { Users, Database, Cpu, Zap, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface UsageMetric {
  name: string;
  current: number;
  limit: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

interface UsageMetricsSectionProps {
  metrics: UsageMetric[];
}

export default function UsageMetricsSection({ metrics }: UsageMetricsSectionProps) {
  const getMetricIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'users': return <Users className="h-5 w-5" />;
      case 'storage': return <Database className="h-5 w-5" />;
      case 'api requests': return <Cpu className="h-5 w-5" />;
      case 'bandwidth': return <Zap className="h-5 w-5" />;
      default: return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getMetricColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'users': return 'from-blue-500 to-indigo-600';
      case 'storage': return 'from-emerald-500 to-teal-600';
      case 'api requests': return 'from-purple-500 to-pink-600';
      case 'bandwidth': return 'from-amber-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Resource Consumption</h3>
          <p className="text-gray-500 text-sm">Real-time overview of your current usage vs. plan limits</p>
        </div>
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
          <Info className="h-3 w-3 mr-1.5" />
          Period: Jan 1 - Jan 31
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const usagePercentage = (metric.current / metric.limit) * 100;
          const isCritical = usagePercentage > 90;
          const isWarning = usagePercentage > 75;

          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${getMetricColor(metric.name)} text-white shadow-lg shadow-gray-200 transition-transform group-hover:scale-110`}>
                  {getMetricIcon(metric.name)}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-gray-900">
                    {usagePercentage.toFixed(0)}<span className="text-sm font-medium text-gray-400">%</span>
                  </div>
                  <div className={`flex items-center justify-end text-[10px] font-bold uppercase tracking-wider ${metric.trend === 'up' ? 'text-red-500' : 'text-green-500'
                    }`}>
                    {metric.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {metric.trend}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-semibold text-gray-700">{metric.name}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      {metric.current} / {metric.limit} {metric.unit}
                    </span>
                  </div>

                  {/* Modern Animated Progress Bar */}
                  <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getMetricColor(metric.name)} ${isCritical ? 'animate-pulse' : ''
                        }`}
                    />
                  </div>
                </div>

                <div className={`flex items-start p-3 rounded-xl border ${isCritical ? 'bg-red-50 border-red-100 text-red-700' :
                  isWarning ? 'bg-amber-50 border-amber-100 text-amber-700' :
                    'bg-gray-50 border-gray-100 text-gray-600'
                  }`}>
                  <div className="text-[10px] leading-relaxed font-medium">
                    {isCritical ? (
                      <span className="flex items-center font-bold">
                        <Zap className="h-3 w-3 mr-1" /> CRITICAL: Consider upgrading
                      </span>
                    ) : (
                      <span>{metric.limit - metric.current} {metric.unit} available until Feb 1</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
