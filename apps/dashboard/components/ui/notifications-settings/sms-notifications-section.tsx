import { Smartphone } from 'lucide-react';
import SectionHeader from '../settings/section-header';
import ToggleSwitch from '../settings/toggle-switch';

interface SmsNotifications {
  alerts: boolean;
  otp: boolean;
}

interface SmsNotificationsSectionProps {
  smsNotifications: SmsNotifications;
  onSmsNotificationsChange: (notifications: SmsNotifications) => void;
}

export default function SmsNotificationsSection({
  smsNotifications,
  onSmsNotificationsChange
}: SmsNotificationsSectionProps) {
  const handleToggle = (key: keyof SmsNotifications) => {
    onSmsNotificationsChange({
      ...smsNotifications,
      [key]: !smsNotifications[key]
    });
  };

  const notificationDescriptions = {
    alerts: 'Critical alerts via SMS',
    otp: 'One-time passwords for authentication'
  };

  return (
    <div>
      <SectionHeader
        title="SMS Notifications"
        description="Manage text message notifications"
        icon={<Smartphone className="h-5 w-5" />}
      />

      <div className="space-y-3">
        {(Object.keys(smsNotifications) as Array<keyof SmsNotifications>).map((key) => (
          <ToggleSwitch
            key={key}
            label={key.toUpperCase() + ' Notifications'}
            description={notificationDescriptions[key]}
            enabled={smsNotifications[key]}
            onChange={() => handleToggle(key)}
          />
        ))}
      </div>
    </div>
  );
}