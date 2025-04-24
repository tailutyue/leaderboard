import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cafes = await prisma.cafe.findMany({
      orderBy: {
        cupsRecycled: 'desc'
      }
    });

    return NextResponse.json(cafes);
  } catch (error) {
    console.error('Error fetching cafes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cafes' },
      { status: 500 }
    );
  }
} 