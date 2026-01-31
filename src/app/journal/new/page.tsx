'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { getMoodEmoji, getMoodLabel, getEnergyLabel, getAnxietyLabel } from '@/lib/utils';

export default function NewJournalEntry() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 3,
    energy: 3,
    anxiety: 3,
    sleep: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sleep: formData.sleep ? parseFloat(formData.sleep) : null,
        }),
      });

      if (response.ok) {
        router.push('/journal');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to save entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/journal"
          className="w-10 h-10 rounded-full bg-white border border-primary-100 flex items-center justify-center hover:bg-primary-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-secondary-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">New Journal Entry</h1>
          <p className="text-secondary-500">How are you feeling today?</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="card">
          <label className="label">Title (optional)</label>
          <input
            type="text"
            className="input"
            placeholder="Give this entry a title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        {/* Mood Selection */}
        <div className="card">
          <label className="label">How's your mood?</label>
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData({ ...formData, mood: value })}
                className={`mood-button ${formData.mood === value ? 'mood-button-selected' : ''}`}
              >
                {getMoodEmoji(value)}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-secondary-500 mt-2">
            {getMoodLabel(formData.mood)}
          </p>
        </div>

        {/* Energy & Anxiety Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <label className="label">Energy Level</label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.energy}
              onChange={(e) => setFormData({ ...formData, energy: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-secondary-500 mt-1">
              <span>Exhausted</span>
              <span className="font-medium text-secondary-700">{getEnergyLabel(formData.energy)}</span>
              <span>Energized</span>
            </div>
          </div>

          <div className="card">
            <label className="label">Anxiety Level</label>
            <input
              type="range"
              min="1"
              max="5"
              value={formData.anxiety}
              onChange={(e) => setFormData({ ...formData, anxiety: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-secondary-500 mt-1">
              <span>None</span>
              <span className="font-medium text-secondary-700">{getAnxietyLabel(formData.anxiety)}</span>
              <span>Severe</span>
            </div>
          </div>
        </div>

        {/* Sleep */}
        <div className="card">
          <label className="label">Hours of sleep last night</label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="24"
            className="input"
            placeholder="e.g., 6.5"
            value={formData.sleep}
            onChange={(e) => setFormData({ ...formData, sleep: e.target.value })}
          />
        </div>

        {/* Journal Content */}
        <div className="card">
          <label className="label">What's on your mind?</label>
          <textarea
            className="textarea min-h-[200px]"
            placeholder="Write freely about your day, your feelings, challenges, or anything else..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />
        </div>

        {/* Additional Notes */}
        <div className="card">
          <label className="label">Additional notes (optional)</label>
          <textarea
            className="textarea"
            placeholder="Any other details you want to remember..."
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link href="/journal" className="btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || !formData.content.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  );
}
