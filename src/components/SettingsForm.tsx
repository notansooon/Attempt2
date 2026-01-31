'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Phone, Bell, Brain } from 'lucide-react';

interface Props {
  initialSettings: {
    id: string;
    phoneNumber: string;
    notificationsEnabled: boolean;
    analysisFrequency: string;
  };
  smsConfigured: boolean;
}

export function SettingsForm({ initialSettings, smsConfigured }: Props) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState(initialSettings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notifications */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold text-secondary-800">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-700">Enable SMS Notifications</p>
              <p className="text-sm text-secondary-500">
                Receive reminder notifications via text message
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, notificationsEnabled: !formData.notificationsEnabled })
              }
              className={`relative w-12 h-6 rounded-full transition-colors ${
                formData.notificationsEnabled ? 'bg-primary-500' : 'bg-secondary-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  formData.notificationsEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {formData.notificationsEnabled && (
            <div>
              <label className="label flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                className="input"
                placeholder="+1 (555) 123-4567"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
              {!smsConfigured && (
                <p className="text-sm text-yellow-600 mt-2">
                  SMS is not configured. Add Twilio credentials to .env to enable.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-5 h-5 text-calm-600" />
          <h2 className="font-semibold text-secondary-800">AI Analysis</h2>
        </div>

        <div>
          <label className="label">Analysis Frequency</label>
          <select
            className="input"
            value={formData.analysisFrequency}
            onChange={(e) => setFormData({ ...formData, analysisFrequency: e.target.value })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="manual">Manual only</option>
          </select>
          <p className="text-sm text-secondary-500 mt-2">
            How often the AI should automatically analyze your journal entries
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4">
        {saved && (
          <span className="text-calm-600 text-sm">Settings saved successfully!</span>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}
