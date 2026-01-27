import { Users, Database, Cpu, Zap, TrendingUp, TrendingDown } from 'lucide-react';

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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Usage Metrics</h3>
          <p className="text-sm text-gray-600">Monitor your resource consumption</p>
        </div>
        <div className="text-sm text-gray-500">
          Billing period: Jan 1 - Jan 31
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const usagePercentage = (metric.current / metric.limit) * 100;
          const getProgressColor = (percentage: number) => {
            if (percentage > 90) return 'bg-red-500';
            if (percentage > 75) return 'bg-yellow-500';
            return 'bg-green-500';
          };

          return (
            <div key={metric.name} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    {getMetricIcon(metric.name)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{metric.name}</div>
                    <div className="text-sm text-gray-600">
                      {metric.current} / {metric.limit} {metric.unit}
                    </div>
                  </div>
                </div>
                {getTrendIcon(metric.trend)}
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Usage</span>
                  <span>{usagePercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(usagePercentage)}`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-gray-500">
                {metric.current >= metric.limit 
                  ? 'Limit reached. Consider upgrading.'
                  : `${metric.limit - metric.current} ${metric.unit} remaining`
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}   