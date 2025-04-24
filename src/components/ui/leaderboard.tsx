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

export interface CafeData {
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

export function Leaderboard({ data = mockData }: LeaderboardProps) {
  const [timeframe, setTimeframe] = useState('week');
  const [location, setLocation] = useState('all');
  const [date, setDate] = useState<Date>();
  const [isUploading, setIsUploading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Leaderboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState('rank');
  const [filterLocation, setFilterLocation] = useState('All Locations');
  const [leaderboardData, setLeaderboardData] = useState<CafeData[]>([]);
  const [insights, setInsights] = useState<any>(null);

  // Fetch data function
  const fetchData = async () => {
    try {
      // Fetch cafes
      const cafesResponse = await fetch('/api/cafes');
      const cafesData = await cafesResponse.json();
      
      // Sort and rank cafes
      const rankedCafes = cafesData.map((cafe: CafeData, index: number) => ({
        ...cafe,
        rank: index + 1
      })).sort((a: CafeData, b: CafeData) => b.cupsRecycled - a.cupsRecycled);

      setLeaderboardData(rankedCafes);

      // Fetch insights
      const insightsResponse = await fetch('/api/insights');
      const insightsData = await insightsResponse.json();
      setInsights(insightsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch leaderboard data');
    }
  };

  // Fetch data on component mount and after successful upload
  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 3f19b896c272be18c36df8a155e31e5b8bd0ceba2c5e1f818d71eb63f9121dba'
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      console.log('Upload result:', result);
      toast.success('Data updated successfully');
      // Fetch updated data
      await fetchData();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload data');
    } finally {
      setIsUploading(false);
    }
  };

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
    <div className="min-h-screen flex flex-col bg-[#f5f5dc]">
      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 py-6 md:py-8">
        {/* Header with CTA */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-[24px] md:text-[32px] font-semibold leading-tight mb-2 text-center md:text-left text-[#1c5739]">
              Compostable Cup Collection Leaderboard
            </h1>
            <p className="text-[13px] md:text-[15px] mb-4 md:mb-0 text-center md:text-left text-[#1c5739]/80">
              Tracking Hong Kong's cafes making a difference through our cup recycling program.
            </p>
          </div>
          <div className="flex gap-4">
            <label className="bg-[#1c5739] text-white px-6 py-3 rounded-lg font-semibold text-[15px] hover:bg-[#1c5739]/90 transition-colors shadow-sm cursor-pointer">
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
              {isUploading ? 'Uploading...' : 'Upload Data'}
            </label>
            <button className="bg-[#1c5739] text-white px-6 py-3 rounded-lg font-semibold text-[15px] hover:bg-[#1c5739]/90 transition-colors shadow-sm flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Join Recycling Program
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/80 backdrop-blur p-6 rounded-lg border border-[#1c5739]/10 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-[14px] text-[#1c5739]/80 font-medium mb-1">Total Participating Cafes</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-[32px] font-bold text-[#1c5739] group-hover:scale-105 transition-transform">{stats.totalCafes}</p>
                  <span className="text-[14px] text-green-600 font-medium flex items-center">
                    +{stats.cafesChange}
                    <svg className="w-4 h-4 ml-0.5" viewBox="0 0 16 16" fill="none">
                      <path d="M8 4v8M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="p-3 bg-[#1c5739]/5 rounded-full group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[#1c5739]" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#1c5739]/10">
              <p className="text-[13px] text-[#1c5739]/70">Monthly Growth Rate</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 h-2 bg-[#1c5739]/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1c5739] to-[#2c7d4f] rounded-full transition-all duration-500"
                    style={{ width: `${stats.cafesChange}%` }}
                  />
                </div>
                <span className="text-[13px] font-medium text-[#1c5739]">{stats.cafesChange}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur p-6 rounded-lg border border-[#1c5739]/10 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-[14px] text-[#1c5739]/80 font-medium mb-1">Cups Recycled This Month</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-[32px] font-bold text-[#1c5739] group-hover:scale-105 transition-transform">{stats.totalCups.toLocaleString()}</p>
                  <span className="text-[14px] text-green-600 font-medium flex items-center">
                    +{stats.cupsChange}%
                    <svg className="w-4 h-4 ml-0.5" viewBox="0 0 16 16" fill="none">
                      <path d="M8 4v8M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="p-3 bg-[#1c5739]/5 rounded-full group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[#1c5739]" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#1c5739]/10">
              <p className="text-[13px] text-[#1c5739]/70">Monthly Target Progress</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 h-2 bg-[#1c5739]/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1c5739] to-[#2c7d4f] rounded-full transition-all duration-500"
                    style={{ width: '75%' }}
                  />
                </div>
                <span className="text-[13px] font-medium text-[#1c5739]">75%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur p-6 rounded-lg border border-[#1c5739]/10 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-[14px] text-[#1c5739]/80 font-medium mb-1">Average Recycling Rate</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-[32px] font-bold text-[#1c5739] group-hover:scale-105 transition-transform">{stats.averageRate}%</p>
                  <span className="text-[14px] text-green-600 font-medium flex items-center">
                    +{stats.rateChange}%
                    <svg className="w-4 h-4 ml-0.5" viewBox="0 0 16 16" fill="none">
                      <path d="M8 4v8M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                </div>
              </div>
              <div className="p-3 bg-[#1c5739]/5 rounded-full group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[#1c5739]" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4v16M4 12h16M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#1c5739]/10">
              <p className="text-[13px] text-[#1c5739]/70">Industry Benchmark</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 h-2 bg-[#1c5739]/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1c5739] to-[#2c7d4f] rounded-full transition-all duration-500"
                    style={{ width: `${stats.averageRate}%` }}
                  />
                </div>
                <span className="text-[13px] font-medium text-[#1c5739]">{stats.averageRate}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur p-6 rounded-lg border border-[#1c5739]/10 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-[14px] text-[#1c5739]/80 font-medium mb-1">Top Performer</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-[28px] font-bold text-[#1c5739] group-hover:scale-105 transition-transform truncate max-w-[180px]">{stats.topPerformer}</p>
                </div>
              </div>
              <div className="p-3 bg-[#1c5739]/5 rounded-full group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[#1c5739]" viewBox="0 0 24 24" fill="none">
                  <path d="M12 15l-2-2h4l-2 2zM7 8h10l2 3H5l2-3z" fill="currentColor"/>
                  <path d="M12 15V3M12 15l-2-2h4l-2 2zM7 8h10l2 3H5l2-3zM5 11h14v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[#1c5739]/10">
              <p className="text-[13px] text-[#1c5739]/70">Recycling Rate</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 h-2 bg-[#1c5739]/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1c5739] to-[#2c7d4f] rounded-full transition-all duration-500"
                    style={{ width: `${stats.topPerformerRate}%` }}
                  />
                </div>
                <span className="text-[13px] font-medium text-[#1c5739]">{stats.topPerformerRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              >
                <option value="all">All Locations</option>
                <option value="north">North Region</option>
                <option value="south">South Region</option>
                <option value="east">East Region</option>
                <option value="west">West Region</option>
              </select>
            </div>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-white/80 backdrop-blur rounded-lg border border-[#1c5739]/10 shadow-sm overflow-hidden relative mt-6">
          <div className="p-6 border-b border-[#1c5739]/10">
            <h2 className="text-[20px] font-bold text-[#1c5739]">Cafe Rankings</h2>
            <p className="text-[14px] text-[#1c5739]/70 mt-2">Based on cup recycling rates from {formattedDate}</p>
          </div>

          <div className="p-6 overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="text-[14px] text-[#1c5739]/80">
                  <th className="text-left pb-6 font-semibold">Rank</th>
                  <th className="text-left pb-6 font-semibold">Cafe</th>
                  <th className="text-left pb-6 font-semibold">Location</th>
                  <th className="text-left pb-6 font-semibold">Recycling Rate</th>
                  <th className="text-left pb-6 font-semibold">Cups Recycled</th>
                  <th className="text-left pb-6 font-semibold">Waste Reduction</th>
                  <th className="text-left pb-6 font-semibold">Compost Produced</th>
                  <th className="text-left pb-6 font-semibold">Contamination Rate</th>
                  <th className="text-left pb-6 font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((cafe) => (
                  <tr 
                    key={cafe.name}
                    className={`
                      border-t border-[#1c5739]/10 hover:bg-[#1c5739]/5 cursor-pointer transition-colors
                      ${cafe.rank <= 3 ? 'bg-[#1c5739]/[0.03]' : ''}
                    `}
                  >
                    <td className="py-5 text-[15px]">
                      {cafe.rank === 1 ? (
                        <div className="relative">
                          <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full text-white font-bold text-sm shadow-sm">
                            1
                            <span className="absolute -top-1 -right-1">👑</span>
                          </div>
                        </div>
                      ) : cafe.rank === 2 ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full text-white font-bold text-sm shadow-sm">2</div>
                      ) : cafe.rank === 3 ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-amber-600 to-amber-500 rounded-full text-white font-bold text-sm shadow-sm">3</div>
                      ) : (
                        <span className="text-[#1c5739]/80 ml-2">{cafe.rank}</span>
                      )}
                    </td>
                    <td className="py-5 text-[15px] text-[#1c5739]">
                      <div className="flex items-center gap-3">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 3.5h8c.28 0 .5.22.5.5v6a3.5 3.5 0 01-3.5 3.5h-2A3.5 3.5 0 013.5 10V4c0-.28.22-.5.5-.5z" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                        <a 
                          href={cafe.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`font-semibold hover:text-[#1c5739]/80 hover:underline transition-colors ${cafe.rank <= 3 ? 'text-[16px]' : ''}`}
                        >
                          {cafe.name}
                          <span className="inline-block ml-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
                              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </a>
                        {cafe.rank === 1 && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                            Leading the Change
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 text-[15px] text-[#1c5739]/70">{cafe.location}</td>
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-28 bg-[#1c5739]/10 rounded-full h-3 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r from-[#1c5739] to-[#2c7d4f] rounded-full h-3 ${cafe.rank <= 3 ? 'shadow-sm' : ''}`}
                            style={{ width: `${cafe.recyclingRate}%` }}
                          />
                        </div>
                        <span className="text-[15px] font-medium text-[#1c5739]">{cafe.recyclingRate}%</span>
                      </div>
                    </td>
                    <td className="py-5 text-[15px] font-medium text-[#1c5739]">{cafe.cupsRecycled.toLocaleString()}</td>
                    <td className="py-5">
                      <span className="text-[15px] font-medium text-[#1c5739]">{cafe.wasteReduction.toFixed(1)} kg</span>
                    </td>
                    <td className="py-5">
                      <span className="text-[15px] font-medium text-[#1c5739]">{cafe.compostProduced.toFixed(1)} kg</span>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-[#1c5739]/10 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${
                              cafe.contaminationRate <= 5 ? 'bg-green-500' :
                              cafe.contaminationRate <= 10 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(cafe.contaminationRate * 2, 100)}%` }}
                          />
                        </div>
                        <span className={`text-[13px] font-medium ${
                          cafe.contaminationRate <= 5 ? 'text-green-600' :
                          cafe.contaminationRate <= 10 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {cafe.contaminationRate.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-5">
                      {cafe.trend > 0 ? (
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1c5739]/10 text-[#1c5739] rounded-full text-[13px] font-medium">
                            +{cafe.trend}
                            <ArrowUp className="h-4 w-4" />
                          </span>
                          {cafe.trend >= 2 && <span className="text-xs">🔥</span>}
                        </div>
                      ) : cafe.trend < 0 ? (
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-[13px] font-medium">
                            {cafe.trend}
                            <ArrowDown className="h-4 w-4" />
                          </span>
                        </div>
                      ) : (
                        <span className="text-[14px] text-[#1c5739]/50">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 