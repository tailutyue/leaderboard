import { CafeData } from '@/components/ui/leaderboard';

export const mockData = {
  totalCafes: 25,
  cafesChange: 3,
  totalCups: 12450,
  cupsChange: 15,
  averageRate: 78,
  rateChange: 5,
  topPerformer: "Green Bean Cafe",
  topPerformerRate: 92,
  rankings: [
    {
      rank: 1,
      name: "Green Bean Cafe",
      location: "Central",
      recyclingRate: 92,
      cupsRecycled: 2450,
      trend: 3,
      website: "https://example.com",
      wasteReduction: 245,
      compostProduced: 98,
      contaminationRate: 2.5
    },
    {
      rank: 2,
      name: "Eco Coffee House",
      location: "North",
      recyclingRate: 88,
      cupsRecycled: 2100,
      trend: 2,
      website: "https://example.com",
      wasteReduction: 210,
      compostProduced: 84,
      contaminationRate: 3.2
    },
    {
      rank: 3,
      name: "Sustainable Sips",
      location: "South",
      recyclingRate: 85,
      cupsRecycled: 1950,
      trend: 1,
      website: "https://example.com",
      wasteReduction: 195,
      compostProduced: 78,
      contaminationRate: 4.1
    }
  ] as CafeData[]
}; 