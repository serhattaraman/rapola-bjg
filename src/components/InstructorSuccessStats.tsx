
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartBar } from 'lucide-react';

type InstructorSuccessProps = {
  data: Record<string, { instructor: string; rate: number; candidateCount: number }>;
  level: string;
};

export const InstructorSuccessStats = ({ data, level }: InstructorSuccessProps) => {
  const chartData = Object.entries(data)
    .map(([instructor, stats]) => ({
      instructor,
      successRate: Math.round(stats.rate),
      candidateCount: stats.candidateCount
    }))
    .sort((a, b) => b.successRate - a.successRate); // Sort by success rate descending

  const getBarColor = (rate: number) => {
    if (rate >= 85) return '#2ecc71'; // Green
    if (rate >= 60) return '#f1c40f'; // Yellow
    if (rate >= 40) return '#f97316'; // Orange
    return '#ea384c'; // Red
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBar className="h-5 w-5 text-primary" />
          {level} Seviyesi Eğitmen Başarı Oranları
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="instructor" />
              <YAxis />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const color = getBarColor(data.successRate);
                    return (
                      <div className="bg-white p-2 border rounded-lg shadow-lg">
                        <p className="font-medium">{data.instructor}</p>
                        <p className="text-sm" style={{ color }}>Başarı: {data.successRate}%</p>
                        <p className="text-sm text-gray-500">
                          {data.candidateCount} öğrenci
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="successRate" 
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.successRate)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
