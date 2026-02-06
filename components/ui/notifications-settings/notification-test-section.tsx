import { Send, Bell, Mail, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface NotificationTestSectionProps {
  onTestNotification: (type: 'email' | 'push' | 'sms') => void;
}

export default function NotificationTestSection({ onTestNotification }: NotificationTestSectionProps) {
  const [testMessage, setTestMessage] = useState('This is a test notification');
  const [isTesting, setIsTesting] = useState(false);
  const [lastTest, setLastTest] = useState<{type: string; time: string} | null>(null);

  const handleTest = (type: 'email' | 'push' | 'sms') => {
    setIsTesting(true);
    onTestNotification(type);
    
    // Simulate API call
    setTimeout(() => {
      setIsTesting(false);
      setLastTest({
        type: type.charAt(0).toUpperCase() + type.slice(1),
        time: new Date().toLocaleTimeString()
      });
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} test notification sent!`);
    }, 1000);
  };

  return (
    <div className="p-6 border border-purple-200 bg-purple-50 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-purple-900">Test Notifications</h3>
          <p className="text-sm text-purple-700">Send test notifications to verify your settings</p>
        </div>
        <Send className="h-5 w-5 text-purple-600" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-purple-700 mb-2">
          Test Message
        </label>
        <input
          type="text"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter test message..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <button
          onClick={() => handleTest('email')}
          disabled={isTesting}
          className="flex items-center justify-center px-4 py-3 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
        >
          <Mail className="h-4 w-4 mr-2" />
          Test Email
        </button>
        <button
          onClick={() => handleTest('push')}
          disabled={isTesting}
          className="flex items-center justify-center px-4 py-3 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
        >
          <Bell className="h-4 w-4 mr-2" />
          Test Push
        </button>
        <button
          onClick={() => handleTest('sms')}
          disabled={isTesting}
          className="flex items-center justify-center px-4 py-3 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
        >
          <Smartphone className="h-4 w-4 mr-2" />
          Test SMS
        </button>
      </div>

      {lastTest && (
        <div className="p-3 bg-white border border-purple-200 rounded-lg">
          <div className="text-sm text-purple-800">
            <span className="font-medium">Last test:</span> {lastTest.type} notification sent at {lastTest.time}
          </div>
        </div>
      )}

      {isTesting && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center text-sm text-purple-700">
            <div className="h-3 w-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            Sending test notification...
          </div>
        </div>
      )}
    </div>
  );
}