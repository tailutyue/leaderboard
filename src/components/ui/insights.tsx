'use client';

interface InsightsProps {
  data: {
    cupsRecycled: number;
    co2Saved: number;
    wasteDiverted: number;
  };
}

export function Insights({ data }: InsightsProps) {
  return (
    <div className="px-4 md:px-6 py-6 md:py-8">
      <h1 className="text-[#1B4332] text-[24px] md:text-[32px] font-semibold leading-tight mb-2 text-center">
        Program Insights
      </h1>
      <p className="text-[#4B5563] text-[13px] md:text-[15px] mb-6 md:mb-8 text-center">
        Detailed analysis of the cup recycling program performance
      </p>

      <div className="bg-white rounded-lg border border-gray-100 p-4 mb-6">
        <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Weekly Recycling Trend</h2>
        <div className="bg-[#FFFDF5] rounded-lg p-8 flex items-center justify-center min-h-[300px]">
          <p className="text-gray-500">Chart visualization would appear here</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-4">
        <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Environmental Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#FFFDF5] rounded-lg p-6 text-center">
            <p className="text-[32px] font-semibold text-[#1B4332]">{data.cupsRecycled.toLocaleString()}</p>
            <p className="text-[14px] text-gray-600">Cups Recycled</p>
          </div>
          <div className="bg-[#FFFDF5] rounded-lg p-6 text-center">
            <p className="text-[32px] font-semibold text-[#1B4332]">{data.co2Saved}</p>
            <p className="text-[14px] text-gray-600">kg CO₂ Saved</p>
          </div>
          <div className="bg-[#FFFDF5] rounded-lg p-6 text-center">
            <p className="text-[32px] font-semibold text-[#1B4332]">{data.wasteDiverted}</p>
            <p className="text-[14px] text-gray-600">kg Waste Diverted</p>
          </div>
        </div>
      </div>
    </div>
  );
} 