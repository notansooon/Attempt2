import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const reminders = await prisma.reminder.findMany({
      orderBy: [{ isActive: 'desc' }, { time: 'asc' }],
    });
    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Failed to fetch reminders:', error);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, time, days } = body;

    const reminder = await prisma.reminder.create({
      data: {
        title,
        description,
        category: category || 'other',
        time,
        days: JSON.stringify(days || ['daily']),
      },
    });

    return NextResponse.json(reminder, { status: 201 });
  } catch (error) {
    console.error('Failed to create reminder:', error);
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
  }
}
