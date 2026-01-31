import { prisma } from '@/lib/db';
import { formatTime, getCategoryIcon, getCategoryLabel, getDayLabel } from '@/lib/utils';
import Link from 'next/link';
import { Plus, Bell, Clock } from 'lucide-react';
import { ReminderToggle } from '@/components/ReminderToggle';
import { DeleteReminderButton } from '@/components/DeleteReminderButton';

async function getReminders() {
  return prisma.reminder.findMany({
    orderBy: [{ isActive: 'desc' }, { time: 'asc' }],
  });
}

export default async function RemindersPage() {
  const reminders = await getReminders();

  const activeReminders = reminders.filter(r => r.isActive);
  const inactiveReminders = reminders.filter(r => !r.isActive);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-800">Reminders</h1>
          <p className="text-secondary-500 mt-1">
            Stay on top of your daily tasks
          </p>
        </div>
        <Link href="/reminders/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Reminder
        </Link>
      </div>

      {reminders.length === 0 ? (
        <div className="card text-center py-16">
          <Bell className="w-16 h-16 text-primary-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-secondary-700">No Reminders Yet</h2>
          <p className="text-secondary-500 mt-2 mb-6 max-w-md mx-auto">
            Set up reminders for medication, feeding schedules, self-care, or
            any other tasks you want to remember.
          </p>
          <Link href="/reminders/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create your first reminder
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Reminders */}
          {activeReminders.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-secondary-600 mb-4">
                Active Reminders ({activeReminders.length})
              </h2>
              <div className="space-y-3">
                {activeReminders.map((reminder) => {
                  const days = JSON.parse(reminder.days) as string[];
                  return (
                    <div key={reminder.id} className="card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">
                            {getCategoryIcon(reminder.category)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-secondary-800">
                              {reminder.title}
                            </h3>
                            {reminder.description && (
                              <p className="text-sm text-secondary-500">{reminder.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1 text-sm text-secondary-500">
                                <Clock className="w-4 h-4" />
                                {formatTime(reminder.time)}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-calm-100 text-calm-700">
                                {getCategoryLabel(reminder.category)}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {days.includes('daily') ? (
                                <span className="text-xs px-2 py-0.5 rounded bg-secondary-100 text-secondary-600">
                                  Every day
                                </span>
                              ) : (
                                days.map((day) => (
                                  <span
                                    key={day}
                                    className="text-xs px-2 py-0.5 rounded bg-secondary-100 text-secondary-600"
                                  >
                                    {getDayLabel(day).substring(0, 3)}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <ReminderToggle id={reminder.id} isActive={reminder.isActive} />
                          <Link
                            href={`/reminders/${reminder.id}/edit`}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Edit
                          </Link>
                          <DeleteReminderButton id={reminder.id} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Inactive Reminders */}
          {inactiveReminders.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-secondary-400 mb-4">
                Paused Reminders ({inactiveReminders.length})
              </h2>
              <div className="space-y-3 opacity-60">
                {inactiveReminders.map((reminder) => {
                  const days = JSON.parse(reminder.days) as string[];
                  return (
                    <div key={reminder.id} className="card bg-secondary-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-secondary-200 rounded-xl flex items-center justify-center text-2xl grayscale">
                            {getCategoryIcon(reminder.category)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-secondary-600">
                              {reminder.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-secondary-400">
                                {formatTime(reminder.time)}
                              </span>
                              <span className="text-xs text-secondary-400">
                                {days.includes('daily')
                                  ? 'Every day'
                                  : days.map((d) => getDayLabel(d).substring(0, 3)).join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <ReminderToggle id={reminder.id} isActive={reminder.isActive} />
                          <DeleteReminderButton id={reminder.id} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
