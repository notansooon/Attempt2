import { prisma } from '@/lib/db';
import { formatDate, getMoodEmoji, getMoodLabel, getEnergyLabel, getAnxietyLabel } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Brain } from 'lucide-react';
import { DeleteEntryButton } from '@/components/DeleteEntryButton';

interface Props {
  params: { id: string };
}

async function getEntry(id: string) {
  return prisma.journalEntry.findUnique({
    where: { id },
  });
}

export default async function JournalEntryPage({ params }: Props) {
  const entry = await getEntry(params.id);

  if (!entry) {
    notFound();
  }

  const aiAnalysis = entry.aiAnalysis ? JSON.parse(entry.aiAnalysis) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/journal"
            className="w-10 h-10 rounded-full bg-white border border-primary-100 flex items-center justify-center hover:bg-primary-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-secondary-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-secondary-800">
              {entry.title || formatDate(entry.date)}
            </h1>
            <p className="text-secondary-500">{formatDate(entry.date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/journal/${entry.id}/edit`}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
          <DeleteEntryButton id={entry.id} />
        </div>
      </div>

      {/* Mood & Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-4xl mb-2">{getMoodEmoji(entry.mood)}</p>
          <p className="text-sm text-secondary-500">Mood</p>
          <p className="font-medium text-secondary-700">{getMoodLabel(entry.mood)}</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl mb-2">⚡</p>
          <p className="text-sm text-secondary-500">Energy</p>
          <p className="font-medium text-secondary-700">{getEnergyLabel(entry.energy)}</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl mb-2">💭</p>
          <p className="text-sm text-secondary-500">Anxiety</p>
          <p className="font-medium text-secondary-700">{getAnxietyLabel(entry.anxiety)}</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl mb-2">😴</p>
          <p className="text-sm text-secondary-500">Sleep</p>
          <p className="font-medium text-secondary-700">
            {entry.sleep ? `${entry.sleep}h` : 'Not recorded'}
          </p>
        </div>
      </div>

      {/* Journal Content */}
      <div className="card">
        <h2 className="font-semibold text-secondary-800 mb-4">Journal Entry</h2>
        <div className="prose prose-secondary max-w-none">
          <p className="text-secondary-700 whitespace-pre-wrap">{entry.content}</p>
        </div>
        {entry.notes && (
          <div className="mt-6 pt-6 border-t border-primary-100">
            <h3 className="text-sm font-medium text-secondary-500 mb-2">Additional Notes</h3>
            <p className="text-secondary-600">{entry.notes}</p>
          </div>
        )}
      </div>

      {/* AI Analysis */}
      {aiAnalysis && (
        <div className="card bg-gradient-to-br from-calm-50 to-primary-50 border-0">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-calm-600" />
            <h2 className="font-semibold text-secondary-800">AI Reflection</h2>
          </div>
          <p className="text-secondary-700">{aiAnalysis}</p>
        </div>
      )}
    </div>
  );
}
