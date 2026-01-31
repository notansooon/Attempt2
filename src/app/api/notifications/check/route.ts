import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendReminderNotification } from '@/lib/sms';

export async function POST() {
  try {
    const settings = await prisma.settings.findFirst();

    if (!settings?.notificationsEnabled || !settings?.phoneNumber) {
      return NextResponse.json({ message: 'Notifications not enabled' });
    }

    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5); // HH:MM format
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    // Find reminders that should trigger now
    const reminders = await prisma.reminder.findMany({
      where: {
        isActive: true,
        time: currentTime,
      },
    });

    const notificationsSent: string[] = [];

    for (const reminder of reminders) {
      const days = JSON.parse(reminder.days) as string[];

      // Check if should trigger today
      if (days.includes('daily') || days.includes(currentDay)) {
        // Check if we already sent this notification recently (within the last hour)
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        if (!reminder.lastSentAt || reminder.lastSentAt < oneHourAgo) {
          const success = await sendReminderNotification(
            settings.phoneNumber,
            reminder.title,
            reminder.description || undefined
          );

          if (success) {
            await prisma.reminder.update({
              where: { id: reminder.id },
              data: { lastSentAt: now },
            });
            notificationsSent.push(reminder.title);
          }
        }
      }
    }

    return NextResponse.json({
      message: `Sent ${notificationsSent.length} notifications`,
      notifications: notificationsSent,
    });
  } catch (error) {
    console.error('Failed to check notifications:', error);
    return NextResponse.json({ error: 'Failed to check notifications' }, { status: 500 });
  }
}
