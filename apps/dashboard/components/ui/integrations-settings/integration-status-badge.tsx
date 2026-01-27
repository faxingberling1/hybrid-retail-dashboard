interface IntegrationStatusBadgeProps {
  status: 'active' | 'inactive' | 'error';
  size?: 'sm' | 'md' | 'lg';
}

export default function IntegrationStatusBadge({ 
  status, 
  size = 'md' 
}: IntegrationStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          dot: 'bg-green-500'
        };
      case 'inactive':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          dot: 'bg-gray-500'
        };
      case 'error':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          dot: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          dot: 'bg-gray-500'
        };
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]} ${config.bg} ${config.text} font-medium rounded-full`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}