import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const insights = await prisma.insights.findFirst({
      orderBy: {
        id: 'desc'
      }
    });

    if (!insights) {
      return NextResponse.json({
        cupsRecycled: 0,
        co2Saved: 0,
        wasteDiverted: 0
      });
    }

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights' },
      { status: 500 }
    );
  }
} 