import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { analyzeSingleEntry } from '@/lib/ai-analyzer';

export async function GET() {
  try {
    const entries = await prisma.journalEntry.findMany({
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Failed to fetch entries:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, mood, energy, anxiety, sleep, notes } = body;

    const entry = await prisma.journalEntry.create({
      data: {
        title,
        content,
        mood: mood || 3,
        energy: energy || 3,
        anxiety: anxiety || 3,
        sleep,
        notes,
      },
    });

    // Analyze the entry in the background
    analyzeSingleEntry(entry).then(async (analysis) => {
      if (analysis) {
        await prisma.journalEntry.update({
          where: { id: entry.id },
          data: {
            aiAnalysis: JSON.stringify(analysis),
            aiAnalyzedAt: new Date(),
          },
        });
      }
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Failed to create entry:', error);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}
