import { prisma } from '@/lib/db';
import { formatDate, getMoodEmoji, isToday } from '@/lib/utils';
import Link from 'next/link';
import {
  BookOpen,
  Bell,
  Brain,
  TrendingUp,
  Calendar,
  Moon
} from 'lucide-react';

async function getRecentData() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [recentEntries, todayEntry, activeReminders, latestInsights] = await Promise.all([
    prisma.journalEntry.findMany({
      where: { date: { gte: sevenDaysAgo } },
      orderBy: { date: 'desc' },
      take: 7,
    }),
    prisma.journalEntry.findFirst({
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
    prisma.reminder.findMany({
      where: { isActive: true },
      take: 5,
    }),
    prisma.aiInsight.findMany({
      where: { dismissed: false },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  const averageMood = recentEntries.length > 0
    ? recentEntries.reduce((sum, e) => sum + e.mood, 0) / recentEntries.length
    : 0;

  const averageSleep = recentEntries.filter(e => e.sleep).length > 0
    ? recentEntries.filter(e => e.sleep).reduce((sum, e) => sum + (e.sleep || 0), 0) /
      recentEntries.filter(e => e.sleep).length
    : 0;

  return {
    recentEntries,
    todayEntry,
    activeReminders,
    latestInsights,
    stats: {
      averageMood: averageMood.toFixed(1),
      averageSleep: averageSleep.toFixed(1),
      entriesThisWeek: recentEntries.length,
    },
  };
}

export default async function Dashboard() {
  const { recentEntries, todayEntry, activeReminders, latestInsights, stats } =
    await getRecentData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-800">
          Welcome back
        </h1>
        <p className="text-secondary-500 mt-1">
          {formatDate(new Date())}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/journal/new" className="card hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-800">
                {todayEntry ? 'Edit Today\'s Entry' : 'Write Today\'s Entry'}
              </h3>
              <p className="text-sm text-secondary-500">
                How are you feeling?
              </p>
            </div>
          </div>
        </Link>

        <Link href="/reminders" className="card hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-calm-100 rounded-xl flex items-center justify-center group-hover:bg-calm-200 transition-colors">
              <Bell className="w-6 h-6 text-calm-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-800">Reminders</h3>
              <p className="text-sm text-secondary-500">
                {activeReminders.length} active
              </p>
            </div>
          </div>
        </Link>

        <Link href="/insights" className="card hover:shadow-md transition-shadow group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
              <Brain className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-800">AI Insights</h3>
              <p className="text-sm text-secondary-500">
                {latestInsights.length} new
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <span className="text-sm text-secondary-500">Avg Mood (7 days)</span>
          </div>
          <p className="text-2xl font-bold text-secondary-800">
            {stats.averageMood}/5 {getMoodEmoji(Math.round(Number(stats.averageMood)))}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Moon className="w-5 h-5 text-calm-500" />
            <span className="text-sm text-secondary-500">Avg Sleep (7 days)</span>
          </div>
          <p className="text-2xl font-bold text-secondary-800">
            {stats.averageSleep} hrs
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-secondary-500" />
            <span className="text-sm text-secondary-500">Entries this week</span>
          </div>
          <p className="text-2xl font-bold text-secondary-800">
            {stats.entriesThisWeek}
          </p>
        </div>
      </div>

      {/* Recent Insights */}
      {latestInsights.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">Recent Insights</h2>
          <div className="space-y-4">
            {latestInsights.map((insight) => (
              <div
                key={insight.id}
                className={`insight-card insight-${insight.severity}`}
              >
                <h3 className="font-semibold text-secondary-800">{insight.title}</h3>
                <p className="text-secondary-600 mt-1">{insight.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Journal Entries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary-800">Recent Entries</h2>
          <Link href="/journal" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </Link>
        </div>

        {recentEntries.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="w-12 h-12 text-primary-300 mx-auto mb-4" />
            <h3 className="font-semibold text-secondary-700">No entries yet</h3>
            <p className="text-secondary-500 mt-1 mb-4">
              Start journaling to track your postpartum journey
            </p>
            <Link href="/journal/new" className="btn-primary inline-block">
              Write your first entry
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEntries.slice(0, 5).map((entry) => (
              <Link
                key={entry.id}
                href={`/journal/${entry.id}`}
                className="card block hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    <div>
                      <p className="font-medium text-secondary-800">
                        {entry.title || formatDate(entry.date)}
                      </p>
                      <p className="text-sm text-secondary-500 line-clamp-1">
                        {entry.content.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    isToday(entry.date)
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-secondary-100 text-secondary-600'
                  }`}>
                    {isToday(entry.date) ? 'Today' : formatDate(entry.date).split(',')[0]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
