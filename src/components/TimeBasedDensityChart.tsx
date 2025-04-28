
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Line,
  ComposedChart
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

// Mock data for time-based density
const hourlyData = [
  { time: "00:00", count: 8 },
  { time: "02:00", count: 4 },
  { time: "04:00", count: 2 },
  { time: "06:00", count: 5 },
  { time: "08:00", count: 15 },
  { time: "10:00", count: 30 },
  { time: "12:00", count: 25 },
  { time: "14:00", count: 28 },
  { time: "16:00", count: 32 },
  { time: "18:00", count: 20 },
  { time: "20:00", count: 12 },
  { time: "22:00", count: 10 },
];

const weekdayData = [
  { day: "Pazartesi", count: 45 },
  { day: "Salı", count: 38 },
  { day: "Çarşamba", count: 52 },
  { day: "Perşembe", count: 40 },
  { day: "Cuma", count: 35 },
  { day: "Cumartesi", count: 25 },
  { day: "Pazar", count: 20 },
];

const monthlyData = [
  { month: "Ocak", count: 120 },
  { month: "Şubat", count: 140 },
  { month: "Mart", count: 160 },
  { month: "Nisan", count: 180 },
  { month: "Mayıs", count: 200 },
  { month: "Haziran", count: 220 },
  { month: "Temmuz", count: 240 },
  { month: "Ağustos", count: 200 },
  { month: "Eylül", count: 180 },
  { month: "Ekim", count: 160 },
  { month: "Kasım", count: 140 },
  { month: "Aralık", count: 130 },
];

const TimeBasedDensityChart = () => {
  const [timeScale, setTimeScale] = useState<"hourly" | "weekday" | "monthly">("hourly");
  
  // Select the data based on the chosen time scale
  const getData = () => {
    switch (timeScale) {
      case "hourly":
        return hourlyData;
      case "weekday":
        return weekdayData;
      case "monthly":
        return monthlyData;
      default:
        return hourlyData;
    }
  };
  
  // Get the appropriate x-axis key based on the selected time scale
  const getXAxisKey = () => {
    switch (timeScale) {
      case "hourly":
        return "time";
      case "weekday":
        return "day";
      case "monthly":
        return "month";
      default:
        return "time";
    }
  };
  
  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Zaman Bazlı Başvuru Yoğunluğu</h2>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select
            value={timeScale}
            onValueChange={(value: "hourly" | "weekday" | "monthly") => setTimeScale(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Zaman Ölçeği" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Saatlik</SelectItem>
              <SelectItem value="weekday">Haftalık</SelectItem>
              <SelectItem value="monthly">Aylık</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="h-[400px] w-full overflow-x-auto">
        <ChartContainer
          config={{
            count: { color: '#9b87f5' },
            trend: { color: '#F97316' }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={getData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={getXAxisKey()} 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar
                dataKey="count"
                name="Başvuru Sayısı"
                fill="#9b87f5"
                radius={[4, 4, 0, 0]}
                barSize={timeScale === "hourly" ? 20 : 40}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="Trend"
                stroke="#F97316"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-lg font-semibold mb-2 text-primary">En Yoğun Zaman</div>
          {timeScale === "hourly" && <div className="text-xl">16:00</div>}
          {timeScale === "weekday" && <div className="text-xl">Çarşamba</div>}
          {timeScale === "monthly" && <div className="text-xl">Temmuz</div>}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-lg font-semibold mb-2 text-primary">Ortalama Başvuru</div>
          {timeScale === "hourly" && <div className="text-xl">15.9 / saat</div>}
          {timeScale === "weekday" && <div className="text-xl">36.4 / gün</div>}
          {timeScale === "monthly" && <div className="text-xl">172.5 / ay</div>}
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="text-lg font-semibold mb-2 text-primary">Toplam Başvuru</div>
          {timeScale === "hourly" && <div className="text-xl">191 başvuru</div>}
          {timeScale === "weekday" && <div className="text-xl">255 başvuru</div>}
          {timeScale === "monthly" && <div className="text-xl">2,070 başvuru</div>}
        </div>
      </div>
    </Card>
  );
};

export default TimeBasedDensityChart;
