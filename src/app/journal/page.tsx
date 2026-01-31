import { prisma } from '@/lib/db';
import { formatDate, getMoodEmoji, getMoodLabel, getAnxietyLabel, getEnergyLabel } from '@/lib/utils';
import Link from 'next/link';
import { Plus, BookOpen } from 'lucide-react';

async function getJournalEntries() {
  return prisma.journalEntry.findMany({
    orderBy: { date: 'desc' },
  });
}

export default async function JournalPage() {
  const entries = await getJournalEntries();

  // Group entries by month
  const entriesByMonth = entries.reduce((acc, entry) => {
    const monthKey = new Date(entry.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">Journal</h1>
          <p className="text-secondary-500 mt-1">
            Track your thoughts and feelings
          </p>
        </div>
        <Link href="/journal/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Entry
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="card text-center py-16">
          <BookOpen className="w-16 h-16 text-primary-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-700">
            Start Your Journal
          </h2>
          <p className="text-secondary-500 mt-2 mb-6 max-w-md mx-auto">
            Writing about your experiences can help process emotions and track patterns
            over time. Your AI companion will analyze entries to provide helpful insights.
          </p>
          <Link href="/journal/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Write your first entry
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(entriesByMonth).map(([month, monthEntries]) => (
            <div key={month}>
              <h2 className="text-lg font-semibold text-secondary-600 mb-4">{month}</h2>
              <div className="space-y-4">
                {monthEntries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/journal/${entry.id}`}
                    className="card block hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{getMoodEmoji(entry.mood)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="font-semibold text-secondary-800 truncate">
                            {entry.title || formatDate(entry.date)}
                          </h3>
                          <span className="text-sm text-secondary-500 whitespace-nowrap">
                            {formatDate(entry.date).split(',')[0]}
                          </span>
                        </div>
                        <p className="text-secondary-600 mt-1 line-clamp-2">
                          {entry.content}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-700">
                            Mood: {getMoodLabel(entry.mood)}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-calm-100 text-calm-700">
                            Energy: {getEnergyLabel(entry.energy)}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-secondary-100 text-secondary-700">
                            Anxiety: {getAnxietyLabel(entry.anxiety)}
                          </span>
                          {entry.sleep && (
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                              Sleep: {entry.sleep}h
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
