import { Mail, Bell, Smartphone, Tablet, Monitor, Globe } from 'lucide-react';

interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'push' | 'sms' | 'web' | 'mobile';
  status: 'active' | 'inactive' | 'error';
  description: string;
  icon: React.ReactNode;
}

interface NotificationChannelsSectionProps {
  channels: NotificationChannel[];
  onChannelToggle: (channelId: string) => void;
}

export default function NotificationChannelsSection({
  channels,
  onChannelToggle
}: NotificationChannelsSectionProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-5 w-5" />;
      case 'push': return <Bell className="h-5 w-5" />;
      case 'sms': return <Smartphone className="h-5 w-5" />;
      case 'web': return <Globe className="h-5 w-5" />;
      case 'mobile': return <Tablet className="h-5 w-5" />;
      default: return <Monitor className="h-5 w-5" />;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Notification Channels</h3>
          <p className="text-sm text-gray-600">Manage active notification delivery methods</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center mr-3 ${
                  channel.status === 'active' ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  {getIcon(channel.type)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{channel.name}</div>
                  <div className="text-xs text-gray-500">{channel.type}</div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(channel.status)}`}>
                {channel.status.toUpperCase()}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{channel.description}</p>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => onChannelToggle(channel.id)}
                className={`text-sm font-medium px-3 py-1 rounded ${
                  channel.status === 'active'
                    ? 'text-red-700 bg-red-50 hover:bg-red-100'
                    : 'text-green-700 bg-green-50 hover:bg-green-100'
                }`}
              >
                {channel.status === 'active' ? 'Disable' : 'Enable'}
              </button>
              <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}