'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface Props {
  id: string;
}

export function DismissInsightButton({ id }: Props) {
  const router = useRouter();
  const [isDismissing, setIsDismissing] = useState(false);

  const handleDismiss = async () => {
    setIsDismissing(true);
    try {
      await fetch(`/api/insights/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dismissed: true }),
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to dismiss insight:', error);
    } finally {
      setIsDismissing(false);
    }
  };

  return (
    <button
      onClick={handleDismiss}
      disabled={isDismissing}
      className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
      title="Dismiss"
    >
      <X className="w-4 h-4" />
    </button>
  );
}
