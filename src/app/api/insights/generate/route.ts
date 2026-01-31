import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateInsights } from '@/lib/ai-analyzer';

export async function POST() {
  try {
    // Get entries from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const entries = await prisma.journalEntry.findMany({
      where: {
        date: { gte: sevenDaysAgo },
      },
      orderBy: { date: 'asc' },
    });

    if (entries.length === 0) {
      return NextResponse.json({ message: 'No entries to analyze' }, { status: 200 });
    }

    const insights = await generateInsights(entries);

    if (insights.length === 0) {
      return NextResponse.json({ message: 'No insights generated' }, { status: 200 });
    }

    // Save insights to database
    const now = new Date();
    const periodStart = sevenDaysAgo;
    const periodEnd = now;

    const createdInsights = await Promise.all(
      insights.map((insight) =>
        prisma.aiInsight.create({
          data: {
            type: insight.type,
            severity: insight.severity,
            title: insight.title,
            content: insight.content,
            suggestions: JSON.stringify(insight.suggestions),
            periodStart,
            periodEnd,
          },
        })
      )
    );

    return NextResponse.json({
      message: `Generated ${createdInsights.length} insights`,
      insights: createdInsights,
    });
  } catch (error) {
    console.error('Failed to generate insights:', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}
