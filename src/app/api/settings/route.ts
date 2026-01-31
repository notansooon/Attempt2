import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      settings = await prisma.settings.create({
        data: {},
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, phoneNumber, notificationsEnabled, analysisFrequency } = body;

    let settings;

    if (id) {
      settings = await prisma.settings.update({
        where: { id },
        data: {
          phoneNumber,
          notificationsEnabled,
          analysisFrequency,
        },
      });
    } else {
      // Create if doesn't exist
      settings = await prisma.settings.create({
        data: {
          phoneNumber,
          notificationsEnabled,
          analysisFrequency,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
