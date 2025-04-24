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
    console.log('Starting file upload process...');
    
    // Check authentication
    if (!authenticateRequest(req)) {
      console.log('Authentication failed');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log('No file provided');
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log('File received:', file.name);

    // Check file type
    if (!file.name.endsWith('.xlsx')) {
      console.log('Invalid file type');
      return NextResponse.json(
        { error: 'Only Excel (.xlsx) files are allowed' },
        { status: 400 }
      );
    }

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    try {
      await fs.mkdir(tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }

    // Save file temporarily with a unique name
    const uniqueFilename = `upload-${Date.now()}-${file.name}`;
    const tempFilePath = path.join(tempDir, uniqueFilename);
    
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tempFilePath, buffer);
    console.log('File saved temporarily:', tempFilePath);

    try {
      // Read Excel file
      const workbook = xlsx.readFile(tempFilePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json<ExcelRow>(worksheet);
      console.log('Excel data parsed:', data);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid Excel data format');
      }

      // Process data
      await prisma.$transaction(async (tx) => {
        console.log('Starting database transaction...');
        
        // Clear existing data
        const deletedCafes = await tx.cafe.deleteMany();
        console.log('Deleted existing cafes:', deletedCafes.count);
        
        const deletedInsights = await tx.insights.deleteMany();
        console.log('Deleted existing insights:', deletedInsights.count);

        // Insert new cafe data
        console.log('Inserting new cafe data...');
        for (const row of data) {
          const cafe = await tx.cafe.create({
            data: {
              name: row.name,
              location: row.location,
              cupsRecycled: row.cupsRecycled,
              recyclingRate: 0,
              trend: 0,
              website: '',
              wasteReduction: 0,
              compostProduced: 0,
              contaminationRate: 0,
              rank: 0,
            },
          });
          console.log('Created cafe:', cafe.name);
        }

        // Calculate and store insights
        const totalCups = data.reduce((sum, row) => sum + row.cupsRecycled, 0);
        const totalCo2 = data.reduce((sum, row) => sum + row.co2Saved, 0);
        const totalWaste = data.reduce((sum, row) => sum + row.wasteDiverted, 0);

        console.log('Calculated totals:', { totalCups, totalCo2, totalWaste });

        const insights = await tx.insights.create({
          data: {
            cupsRecycled: totalCups,
            co2Saved: totalCo2,
            wasteDiverted: totalWaste,
          },
        });
        console.log('Created insights:', insights);
      });

      console.log('Database transaction completed successfully');

      return NextResponse.json({ 
        message: 'Data uploaded successfully',
        rowsProcessed: data.length
      });
    } finally {
      // Clean up temp file
      try {
        await fs.unlink(tempFilePath);
        console.log('Temporary file deleted');
      } catch (error) {
        console.error('Error deleting temp file:', error);
      }
    }
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Error processing file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 