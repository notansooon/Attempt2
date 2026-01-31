'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  id: string;
  isActive: boolean;
}

export function ReminderToggle({ id, isActive }: Props) {
  const router = useRouter();
  const [active, setActive] = useState(isActive);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    const newState = !active;
    setActive(newState);

    try {
      await fetch(`/api/reminders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newState }),
      });
      router.refresh();
    } catch (error) {
      setActive(!newState); // Revert on error
      console.error('Failed to toggle reminder:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        active ? 'bg-primary-500' : 'bg-secondary-300'
      } ${isUpdating ? 'opacity-50' : ''}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
          active ? 'left-7' : 'left-1'
        }`}
      />
    </button>
  );
}
