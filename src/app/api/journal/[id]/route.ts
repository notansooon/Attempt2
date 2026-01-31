import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { analyzeSingleEntry } from '@/lib/ai-analyzer';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const entry = await prisma.journalEntry.findUnique({
      where: { id: params.id },
    });

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Failed to fetch entry:', error);
    return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();
    const { title, content, mood, energy, anxiety, sleep, notes } = body;

    const entry = await prisma.journalEntry.update({
      where: { id: params.id },
      data: {
        title,
        content,
        mood,
        energy,
        anxiety,
        sleep,
        notes,
      },
    });

    // Re-analyze the updated entry
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

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Failed to update entry:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.journalEntry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete entry:', error);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}
