'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface Props {
  id: string;
}

export function DeleteEntryButton({ id }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.push('/journal');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-secondary-600">Delete?</span>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Yes'}
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          className="px-3 py-2 bg-secondary-100 text-secondary-700 text-sm rounded-lg hover:bg-secondary-200"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="p-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
