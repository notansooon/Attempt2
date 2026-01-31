import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function getMoodEmoji(mood: number): string {
  const emojis = ['😢', '😔', '😐', '🙂', '😊'];
  return emojis[mood - 1] || '😐';
}

export function getMoodLabel(mood: number): string {
  const labels = ['Very Low', 'Low', 'Neutral', 'Good', 'Great'];
  return labels[mood - 1] || 'Neutral';
}

export function getAnxietyLabel(anxiety: number): string {
  const labels = ['None', 'Mild', 'Moderate', 'High', 'Severe'];
  return labels[anxiety - 1] || 'Moderate';
}

export function getEnergyLabel(energy: number): string {
  const labels = ['Exhausted', 'Tired', 'Okay', 'Good', 'Energized'];
  return labels[energy - 1] || 'Okay';
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    medication: '💊',
    feeding: '🍼',
    selfcare: '💆',
    appointment: '📅',
    other: '📌',
  };
  return icons[category] || '📌';
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    medication: 'Medication',
    feeding: 'Feeding',
    selfcare: 'Self Care',
    appointment: 'Appointment',
    other: 'Other',
  };
  return labels[category] || 'Other';
}

export function getDayLabel(day: string): string {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

export function isToday(date: Date | string): boolean {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

export function daysAgo(date: Date | string): number {
  const d = new Date(date);
  const today = new Date();
  const diffTime = today.getTime() - d.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
