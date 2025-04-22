
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartBar } from 'lucide-react';

type InstructorSuccessProps = {
  data: Record<string, { instructor: string; rate: number; candidateCount: number }>;
  level: string;
};

export const InstructorSuccessStats = ({ data, level }: InstructorSuccessProps) => {
  const chartData = Object.entries(data).map(([instructor, stats]) => ({
    instructor,
    successRate: Math.round(stats.rate),
    candidateCount: stats.candidateCount
  }));

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
                    return (
                      <div className="bg-white p-2 border rounded-lg shadow-lg">
                        <p className="font-medium">{payload[0].payload.instructor}</p>
                        <p className="text-sm">Başarı: {payload[0].value}%</p>
                        <p className="text-sm text-gray-500">
                          {payload[0].payload.candidateCount} öğrenci
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="successRate" 
                fill="#8b5cf6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
