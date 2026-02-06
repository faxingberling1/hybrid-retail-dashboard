import { Mail } from 'lucide-react';
import SectionHeader from '../settings/section-header';
import ToggleSwitch from '../settings/toggle-switch';

interface EmailNotifications {
  marketing: boolean;
  security: boolean;
  updates: boolean;
  reports: boolean;
}

interface EmailNotificationsSectionProps {
  emailNotifications: EmailNotifications;
  onEmailNotificationsChange: (notifications: EmailNotifications) => void;
}

export default function EmailNotificationsSection({
  emailNotifications,
  onEmailNotificationsChange
}: EmailNotificationsSectionProps) {
  const handleToggle = (key: keyof EmailNotifications) => {
    onEmailNotificationsChange({
      ...emailNotifications,
      [key]: !emailNotifications[key]
    });
  };

  const notificationDescriptions = {
    marketing: 'Product updates and promotional offers',
    security: 'Security alerts and login notifications',
    updates: 'System updates and maintenance notices',
    reports: 'Weekly and monthly reports'
  };

  return (
    <div>
      <SectionHeader
        title="Email Notifications"
        description="Manage what emails you receive"
        icon={<Mail className="h-5 w-5" />}
      />

      <div className="space-y-3">
        {(Object.keys(emailNotifications) as Array<keyof EmailNotifications>).map((key) => (
          <ToggleSwitch
            key={key}
            label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            description={notificationDescriptions[key]}
            enabled={emailNotifications[key]}
            onChange={() => handleToggle(key)}
          />
        ))}
      </div>
    </div>
  );
}