import { BellRing } from 'lucide-react';
import SectionHeader from '../settings/section-header';
import ToggleSwitch from '../settings/toggle-switch';

interface PushNotifications {
  transactions: boolean;
  alerts: boolean;
  updates: boolean;
}

interface PushNotificationsSectionProps {
  pushNotifications: PushNotifications;
  onPushNotificationsChange: (notifications: PushNotifications) => void;
}

export default function PushNotificationsSection({
  pushNotifications,
  onPushNotificationsChange
}: PushNotificationsSectionProps) {
  const handleToggle = (key: keyof PushNotifications) => {
    onPushNotificationsChange({
      ...pushNotifications,
      [key]: !pushNotifications[key]
    });
  };

  const notificationDescriptions = {
    transactions: 'Real-time transaction notifications',
    alerts: 'Important system alerts',
    updates: 'App updates and announcements'
  };

  return (
    <div>
      <SectionHeader
        title="Push Notifications"
        description="Control push notifications on your devices"
        icon={<BellRing className="h-5 w-5" />}
      />

      <div className="space-y-3">
        {(Object.keys(pushNotifications) as Array<keyof PushNotifications>).map((key) => (
          <ToggleSwitch
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            description={notificationDescriptions[key]}
            enabled={pushNotifications[key]}
            onChange={() => handleToggle(key)}
          />
        ))}
      </div>
    </div>
  );
}