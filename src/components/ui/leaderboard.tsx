'use client';

import { useState, useEffect, useRef } from 'react';
import { CalendarIcon, ArrowUpIcon, ArrowDownIcon, HamburgerMenuIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { Insights } from './insights';
import { Confetti } from './confetti';
import { importExcelData } from '@/utils/excelImport';
import { mockData } from '@/data/mockData';
import 'react-day-picker/dist/style.css';
import styles from './leaderboard.module.css';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Crown, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCafes, useHistoricalData, useInsights } from '@/hooks/useData';

export interface CafeData {
  id: string;
  rank: number;
  name: string;
  location: string;
  recyclingRate: number;
  cupsRecycled: number;
  trend: number;
  website: string;
  wasteReduction: number;
  compostProduced: number;
  contaminationRate: number;
}

interface LeaderboardProps {
  data?: typeof mockData;
}

export function Leaderboard() {
  const { cafes, loading: cafesLoading, error: cafesError } = useCafes();
  const { historicalData, loading: historyLoading, error: historyError } = useHistoricalData();
  const { insights, loading: insightsLoading, error: insightsError } = useInsights();
  const [timeframe, setTimeframe] = useState('week');
  const [location, setLocation] = useState('all');
  const [date, setDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Leaderboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState('rank');
  const [filterLocation, setFilterLocation] = useState('All Locations');
  const [leaderboardData, setLeaderboardData] = useState<CafeData[]>([]);

  if (cafesLoading || historyLoading || insightsLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (cafesError || historyError || insightsError) {
    return <div className="text-red-500">Error loading data</div>;
  }

  // Get the latest historical data
  const latestStats = historicalData?.[0] || {
    totalCafes: 0,
    cafesChange: 0,
    totalCups: 0,
    cupsChange: 0,
    averageRate: 0,
    rateChange: 0,
    topPerformer: 'N/A',
    topPerformerRate: 0
  };

  // Get the latest insights
  const latestInsights = insights?.[0] || {
    cupsRecycled: 0,
    co2Saved: 0,
    wasteDiverted: 0
  };

  // Fetch data function
  const fetchData = async () => {
    try {
      setLeaderboardData([]); // Clear existing data while loading
      
      // Fetch cafes
      const cafesResponse = await fetch('/api/cafes');
      if (!cafesResponse.ok) {
        throw new Error('Failed to fetch cafe data');
      }
      
      const cafesData = await cafesResponse.json();
      
      // Sort and rank cafes
      const rankedCafes = cafesData
        .sort((a: CafeData, b: CafeData) => b.cupsRecycled - a.cupsRecycled)
        .map((cafe: CafeData, index: number) => ({
          ...cafe,
          rank: index + 1
        }));

      console.log('Fetched and ranked cafes:', rankedCafes); // Debug log
      setLeaderboardData(rankedCafes);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch leaderboard data');
      setLeaderboardData([]); // Reset to empty state on error
    }
  };

  // Fetch data on component mount and after successful upload
  useEffect(() => {
    fetchData();
  }, []);

  // Get unique locations for filter from actual data
  const locations = ['All Locations', ...new Set(leaderboardData.map(cafe => cafe.location))];

  // Calculate statistics from actual data
  const stats = {
    totalCafes: leaderboardData.length,
    totalCups: leaderboardData.reduce((sum, cafe) => sum + cafe.cupsRecycled, 0),
    averageRate: leaderboardData.length > 0 
      ? (leaderboardData.reduce((sum, cafe) => sum + cafe.recyclingRate, 0) / leaderboardData.length).toFixed(1)
      : 0,
    topPerformer: leaderboardData[0]?.name || 'N/A',
    topPerformerRate: leaderboardData[0]?.recyclingRate || 0,
    cafesChange: 0, // You might want to calculate this from historical data
    cupsChange: 0,  // You might want to calculate this from historical data
    rateChange: 0   // You might want to calculate this from historical data
  };

  const formattedDate = date ? format(date, 'MMM dd, yyyy') : 'Select date';

  return (
    <div className="min-h-screen bg-[#f5f5dc] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-semibold text-[#1c5739] mb-2">
          Compostable Cup Collection Leaderboard
        </h1>
        <p className="text-[15px] text-[#1c5739]/80">
          Tracking Hong Kong's cafes making a difference through our cup recycling program.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <button className="bg-[#1c5739] text-white px-6 py-3 rounded-lg font-semibold text-[15px] hover:bg-[#1c5739]/90 transition-colors flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Join Recycling Program
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Participating Cafes */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-lg border border-[#1c5739]/10 shadow-sm">
          <h3 className="text-[14px] text-[#1c5739]/80 font-medium mb-1">Total Participating Cafes</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-[32px] font-bold text-[#1c5739]">{latestStats.totalCafes}</p>
            <span className={`text-[14px] font-medium ${latestStats.cafesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {latestStats.cafesChange >= 0 ? '+' : ''}{latestStats.cafesChange}
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-[#1c5739]/10">
            <p className="text-[13px] text-[#1c5739]/70">Monthly Growth Rate</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 h-2 bg-[#1c5739]/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1c5739] to-[#2c7d4f]"
                  style={{ width: `${Math.max(0, latestStats.cafesChange)}%` }}
                />
              </div>
              <span className="text-[13px] font-medium text-[#1c5739]">{Math.max(0, latestStats.cafesChange)}%</span>
            </div>
          </div>
        </div>

        {/* Cups Recycled This Month */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-lg border border-[#1c5739]/10 shadow-sm">
          <h3 className="text-[14px] text-[#1c5739]/80 font-medium mb-1">Cups Recycled This Month</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-[32px] font-bold text-[#1c5739]">{latestStats.totalCups.toLocaleString()}</p>
            <span className={`text-[14px] font-medium ${latestStats.cupsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {latestStats.cupsChange >= 0 ? '+' : ''}{latestStats.cupsChange}%
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-[#1c5739]/10">
            <p className="text-[13px] text-[#1c5739]/70">Monthly Target Progress</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 h-2 bg-[#1c5739]/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1c5739] to-[#2c7d4f]"
                  style={{ width: '75%' }}
                />
              </div>
              <span className="text-[13px] font-medium text-[#1c5739]">75%</span>
            </div>
          </div>
        </div>

        {/* Average Recycling Rate */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-lg border border-[#1c5739]/10 shadow-sm">
          <h3 className="text-[14px] text-[#1c5739]/80 font-medium mb-1">Average Recycling Rate</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-[32px] font-bold text-[#1c5739]">{latestStats.averageRate}%</p>
            <span className={`text-[14px] font-medium ${latestStats.rateChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {latestStats.rateChange >= 0 ? '+' : ''}{latestStats.rateChange}%
            </span>
          </div>
          <div className="mt-4 pt-4 border-t border-[#1c5739]/10">
            <p className="text-[13px] text-[#1c5739]/70">Industry Benchmark</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 h-2 bg-[#1c5739]/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1c5739] to-[#2c7d4f]"
                  style={{ width: `${latestStats.averageRate}%` }}
                />
              </div>
              <span className="text-[13px] font-medium text-[#1c5739]">{latestStats.averageRate}%</span>
            </div>
          </div>
        </div>

        {/* Top Performer */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-lg border border-[#1c5739]/10 shadow-sm">
          <h3 className="text-[14px] text-[#1c5739]/80 font-medium mb-1">Top Performer</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-[28px] font-bold text-[#1c5739] truncate">{latestStats.topPerformer}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-[#1c5739]/10">
            <p className="text-[13px] text-[#1c5739]/70">Recycling Rate</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 h-2 bg-[#1c5739]/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#1c5739] to-[#2c7d4f]"
                  style={{ width: `${latestStats.topPerformerRate}%` }}
                />
              </div>
              <span className="text-[13px] font-medium text-[#1c5739]">{latestStats.topPerformerRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-[#1c5739] mb-1">Timeframe</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full rounded-lg border border-[#1c5739]/20 px-4 py-2 text-[#1c5739]"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1c5739] mb-1">Location</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-lg border border-[#1c5739]/20 px-4 py-2 text-[#1c5739]"
          >
            <option value="all">All Locations</option>
            {Array.from(new Set(cafes.map(cafe => cafe.location))).map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cafe Rankings Table */}
      <div className="bg-white/80 backdrop-blur rounded-lg border border-[#1c5739]/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1c5739]/10">
          <h2 className="text-[20px] font-bold text-[#1c5739]">Cafe Rankings</h2>
          <p className="text-[14px] text-[#1c5739]/70 mt-1">
            Based on cup recycling rates from {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="overflow-x-auto">
          {leaderboardData.length === 0 ? (
            <div className="p-8 text-center text-[#1c5739]/70">
              No data available. Please upload cafe data to view rankings.
            </div>
          ) : (
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-[#1c5739]/10">
                  <th className="text-left p-4 text-[14px] font-semibold text-[#1c5739]">Rank</th>
                  <th className="text-left p-4 text-[14px] font-semibold text-[#1c5739]">Cafe</th>
                  <th className="text-left p-4 text-[14px] font-semibold text-[#1c5739]">Location</th>
                  <th className="text-left p-4 text-[14px] font-semibold text-[#1c5739]">Recycling Rate</th>
                  <th className="text-left p-4 text-[14px] font-semibold text-[#1c5739]">Cups Recycled</th>
                  <th className="text-left p-4 text-[14px] font-semibold text-[#1c5739]">Waste Reduction</th>
                  <th className="text-left p-4 text-[14px] font-semibold text-[#1c5739]">Compost Produced</th>
                  <th className="text-left p-4 text-[14px] font-semibold text-[#1c5739]">Contamination Rate</th>
                  <th className="text-left p-4 text-[14px] font-semibold text-[#1c5739]">Trend</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((cafe) => (
                  <tr key={cafe.id} className="border-b border-[#1c5739]/10 hover:bg-[#1c5739]/5">
                    <td className="p-4">
                      <div className="text-[15px] font-medium text-[#1c5739]">#{cafe.rank}</div>
                    </td>
                    <td className="p-4">
                      <a 
                        href={cafe.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[15px] font-medium text-[#1c5739] hover:underline"
                      >
                        {cafe.name}
                      </a>
                    </td>
                    <td className="p-4">
                      <div className="text-[15px] text-[#1c5739]/70">{cafe.location}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-[15px] font-medium text-[#1c5739]">{cafe.recyclingRate.toFixed(1)}%</div>
                    </td>
                    <td className="p-4">
                      <div className="text-[15px] font-medium text-[#1c5739]">{cafe.cupsRecycled.toLocaleString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-[15px] font-medium text-[#1c5739]">{cafe.wasteReduction.toFixed(1)} kg</div>
                    </td>
                    <td className="p-4">
                      <div className="text-[15px] font-medium text-[#1c5739]">{cafe.compostProduced.toFixed(1)} kg</div>
                    </td>
                    <td className="p-4">
                      <div className="text-[15px] font-medium text-[#1c5739]">{cafe.contaminationRate.toFixed(1)}%</div>
                    </td>
                    <td className="p-4">
                      {cafe.trend > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ↑ Up
                        </span>
                      ) : cafe.trend < 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          ↓ Down
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          − Same
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
} 