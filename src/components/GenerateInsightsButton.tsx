'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw } from 'lucide-react';

interface Props {
  hasEntries: boolean;
}

export function GenerateInsightsButton({ hasEntries }: Props) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await fetch('/api/insights/generate', {
        method: 'POST',
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to generate insights:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={isGenerating || !hasEntries}
      className="btn-calm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
      {isGenerating ? 'Analyzing...' : 'Generate Insights'}
    </button>
  );
}
