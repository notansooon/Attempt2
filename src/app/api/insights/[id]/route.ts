import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const body = await request.json();

    const insight = await prisma.aiInsight.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(insight);
  } catch (error) {
    console.error('Failed to update insight:', error);
    return NextResponse.json({ error: 'Failed to update insight' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await prisma.aiInsight.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete insight:', error);
    return NextResponse.json({ error: 'Failed to delete insight' }, { status: 500 });
  }
}
