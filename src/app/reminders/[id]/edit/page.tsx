'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { getCategoryIcon, getCategoryLabel } from '@/lib/utils';

const categories = ['medication', 'feeding', 'selfcare', 'appointment', 'other'];
const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

interface Props {
  params: { id: string };
}

export default function EditReminder({ params }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    time: '09:00',
    days: ['daily'] as string[],
  });

  useEffect(() => {
    async function fetchReminder() {
      try {
        const response = await fetch(`/api/reminders/${params.id}`);
        if (response.ok) {
          const reminder = await response.json();
          setFormData({
            title: reminder.title,
            description: reminder.description || '',
            category: reminder.category,
            time: reminder.time,
            days: JSON.parse(reminder.days),
          });
        }
      } catch (error) {
        console.error('Failed to fetch reminder:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReminder();
  }, [params.id]);

  const handleDayToggle = (day: string) => {
    if (day === 'daily') {
      setFormData({ ...formData, days: ['daily'] });
    } else {
      const newDays = formData.days.includes('daily')
        ? [day]
        : formData.days.includes(day)
        ? formData.days.filter((d) => d !== day)
        : [...formData.days, day];

      setFormData({
        ...formData,
        days: newDays.length === 0 ? ['daily'] : newDays,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/reminders/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/reminders');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update reminder:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-secondary-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/reminders"
          className="w-10 h-10 rounded-full bg-white border border-primary-100 flex items-center justify-center hover:bg-primary-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-secondary-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Edit Reminder</h1>
          <p className="text-secondary-500">Update your reminder settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="card">
          <label className="label">Reminder Title</label>
          <input
            type="text"
            className="input"
            placeholder="e.g., Take prenatal vitamins"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        {/* Description */}
        <div className="card">
          <label className="label">Description (optional)</label>
          <textarea
            className="textarea"
            placeholder="Additional details..."
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Category */}
        <div className="card">
          <label className="label">Category</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFormData({ ...formData, category })}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  formData.category === category
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 hover:border-primary-200'
                }`}
              >
                <span className="text-2xl block mb-1">{getCategoryIcon(category)}</span>
                <span className="text-sm text-secondary-700">{getCategoryLabel(category)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div className="card">
          <label className="label">Time</label>
          <input
            type="time"
            className="input"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            required
          />
        </div>

        {/* Days */}
        <div className="card">
          <label className="label">Repeat on</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleDayToggle('daily')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                formData.days.includes('daily')
                  ? 'bg-primary-500 text-white'
                  : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
              }`}
            >
              Every Day
            </button>
            {daysOfWeek.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.days.includes(day) && !formData.days.includes('daily')
                    ? 'bg-primary-500 text-white'
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                }`}
              >
                {day.charAt(0).toUpperCase() + day.slice(1, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/reminders" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || !formData.title.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
