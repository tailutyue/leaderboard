import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as xlsx from 'xlsx';
import { promises as fs } from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface ExcelRow {
  name: string;
  location: string;
  cupsRecycled: number;
  co2Saved: number;
  wasteDiverted: number;
}

// Authentication middleware
const authenticateRequest = (req: Request) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return false;
  
  const token = authHeader.split(' ')[1];
  if (!token) return false;
  
  return token === process.env.API_SECRET_KEY;
};

export async function POST(req: Request) {
  try {
    // Check authentication
    if (!authenticateRequest(req)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Save file temporarily
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempFilePath = path.join(process.cwd(), 'temp', file.name);
    await fs.writeFile(tempFilePath, buffer);

    // Read Excel file
    const workbook = xlsx.readFile(tempFilePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json<ExcelRow>(worksheet);

    // Process data
    await prisma.$transaction(async (tx) => {
      // Clear existing data
      await tx.cafe.deleteMany();
      await tx.insights.deleteMany();

      // Insert new cafe data
      for (const row of data) {
        await tx.cafe.create({
          data: {
            name: row.name,
            location: row.location,
            cupsRecycled: row.cupsRecycled,
            recyclingRate: 0, // Default value
            trend: 0, // Default value
            website: '', // Default value
            wasteReduction: 0, // Default value
            compostProduced: 0, // Default value
            contaminationRate: 0, // Default value
            rank: 0, // Default value
          },
        });
      }

      // Calculate and store insights
      const totalCups = data.reduce((sum, row) => sum + row.cupsRecycled, 0);
      const totalCo2 = data.reduce((sum, row) => sum + row.co2Saved, 0);
      const totalWaste = data.reduce((sum, row) => sum + row.wasteDiverted, 0);

      await tx.insights.create({
        data: {
          cupsRecycled: totalCups,
          co2Saved: totalCo2,
          wasteDiverted: totalWaste,
        },
      });
    });

    // Clean up
    await fs.unlink(tempFilePath);

    return NextResponse.json({ message: 'Data uploaded successfully' });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Error processing file' },
      { status: 500 }
    );
  }
} 