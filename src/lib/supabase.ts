import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Cafe = {
  id: number;
  name: string;
  location: string;
  recyclingRate: number;
  cupsRecycled: number;
  trend: number;
  website: string;
  wasteReduction: number;
  compostProduced: number;
  contaminationRate: number;
  rank: number;
};

export type HistoricalData = {
  id: number;
  totalCafes: number;
  cafesChange: number;
  totalCups: number;
  cupsChange: number;
  averageRate: number;
  rateChange: number;
  topPerformer: string;
  topPerformerRate: number;
  date: string;
};

export type Insights = {
  id: number;
  cupsRecycled: number;
  co2Saved: number;
  wasteDiverted: number;
  date: string;
}; 