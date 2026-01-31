import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateInsights } from '@/lib/ai-analyzer';
import { sendReminderNotification, sendInsightNotification } from '@/lib/sms';

// This endpoint can be called by a cron service (e.g., Vercel Cron, external cron)
// to check reminders and generate insights periodically

export async function GET(request: NextRequest) {
  // Verify cron secret if provided
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await prisma.settings.findFirst();
    const results: string[] = [];

    // Check reminders
    if (settings?.notificationsEnabled && settings?.phoneNumber) {
      const now = new Date();
      const currentTime = now.toTimeString().substring(0, 5);
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

      const reminders = await prisma.reminder.findMany({
        where: {
          isActive: true,
          time: currentTime,
        },
      });

      for (const reminder of reminders) {
        const days = JSON.parse(reminder.days) as string[];

        if (days.includes('daily') || days.includes(currentDay)) {
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
              results.push(`Sent reminder: ${reminder.title}`);
            }
          }
        }
      }
    }

    // Check if we should generate insights (daily at 8 PM)
    const now = new Date();
    const hour = now.getHours();

    if (hour === 20 && settings?.analysisFrequency !== 'manual') {
      // Check if we haven't generated insights today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const recentInsight = await prisma.aiInsight.findFirst({
        where: {
          createdAt: { gte: today },
        },
      });

      if (!recentInsight) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const entries = await prisma.journalEntry.findMany({
          where: { date: { gte: sevenDaysAgo } },
          orderBy: { date: 'asc' },
        });

        if (entries.length > 0) {
          const insights = await generateInsights(entries);

          for (const insight of insights) {
            await prisma.aiInsight.create({
              data: {
                type: insight.type,
                severity: insight.severity,
                title: insight.title,
                content: insight.content,
                suggestions: JSON.stringify(insight.suggestions),
                periodStart: sevenDaysAgo,
                periodEnd: now,
              },
            });
          }

          results.push(`Generated ${insights.length} insights`);

          // Send notification for concerning insights
          if (settings?.notificationsEnabled && settings?.phoneNumber) {
            const concerningInsight = insights.find(
              (i) => i.severity === 'concern' || i.severity === 'warning'
            );

            if (concerningInsight) {
              await sendInsightNotification(
                settings.phoneNumber,
                concerningInsight.title,
                concerningInsight.content.substring(0, 160)
              );
              results.push('Sent insight notification');
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
