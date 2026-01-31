import { prisma } from '@/lib/db';
import { SettingsForm } from '@/components/SettingsForm';
import { isSMSConfigured } from '@/lib/sms';

async function getSettings() {
  let settings = await prisma.settings.findFirst();

  if (!settings) {
    settings = await prisma.settings.create({
      data: {},
    });
  }

  return settings;
}

export default async function SettingsPage() {
  const settings = await getSettings();
  const smsConfigured = isSMSConfigured();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-800">Settings</h1>
        <p className="text-secondary-500 mt-1">
          Customize your experience
        </p>
      </div>

      <SettingsForm
        initialSettings={{
          id: settings.id,
          phoneNumber: settings.phoneNumber || '',
          notificationsEnabled: settings.notificationsEnabled,
          analysisFrequency: settings.analysisFrequency,
        }}
        smsConfigured={smsConfigured}
      />

      {/* API Keys Info */}
      <div className="card bg-secondary-50 border-secondary-200">
        <h2 className="font-semibold text-secondary-800 mb-4">Configuration Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-secondary-600">OpenAI API</span>
            <span className={`text-sm px-3 py-1 rounded-full ${
              process.env.OPENAI_API_KEY
                ? 'bg-calm-100 text-calm-700'
                : 'bg-secondary-200 text-secondary-600'
            }`}>
              {process.env.OPENAI_API_KEY ? 'Configured' : 'Not configured'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary-600">SMS Notifications (Twilio)</span>
            <span className={`text-sm px-3 py-1 rounded-full ${
              smsConfigured
                ? 'bg-calm-100 text-calm-700'
                : 'bg-secondary-200 text-secondary-600'
            }`}>
              {smsConfigured ? 'Configured' : 'Not configured'}
            </span>
          </div>
        </div>
        <p className="text-sm text-secondary-500 mt-4">
          Configure API keys in your .env file to enable AI insights and SMS notifications.
        </p>
      </div>

      {/* Support Resources */}
      <div className="card bg-gradient-to-br from-primary-50 to-calm-50 border-0">
        <h2 className="font-semibold text-secondary-800 mb-4">Need Support?</h2>
        <p className="text-secondary-600 mb-4">
          If you're struggling, please reach out to professional support resources:
        </p>
        <ul className="space-y-2 text-secondary-600 text-sm">
          <li>Postpartum Support International: 1-800-944-4773</li>
          <li>National Suicide Prevention Lifeline: 988</li>
          <li>Crisis Text Line: Text HOME to 741741</li>
        </ul>
        <p className="text-sm text-secondary-500 mt-4">
          This app is not a replacement for professional medical care.
        </p>
      </div>
    </div>
  );
}
