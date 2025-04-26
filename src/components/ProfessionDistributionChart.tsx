
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const professionData = [
  {
    platform: 'Google Ads',
    developer: 25,
    teacher: 15,
    doctor: 10,
    engineer: 20,
    lawyer: 8
  },
  {
    platform: 'Instagram',
    developer: 18,
    teacher: 12,
    doctor: 8,
    engineer: 15,
    lawyer: 10
  },
  {
    platform: 'X',
    developer: 12,
    teacher: 8,
    doctor: 5,
    engineer: 10,
    lawyer: 6
  },
  {
    platform: 'LinkedIn',
    developer: 30,
    teacher: 10,
    doctor: 12,
    engineer: 25,
    lawyer: 15
  },
  {
    platform: 'YouTube',
    developer: 15,
    teacher: 20,
    doctor: 8,
    engineer: 12,
    lawyer: 5
  },
  {
    platform: 'TikTok',
    developer: 10,
    teacher: 25,
    doctor: 15,
    engineer: 8,
    lawyer: 12
  },
  {
    platform: 'Website',
    developer: 22,
    teacher: 18,
    doctor: 20,
    engineer: 16,
    lawyer: 14
  }
];

const colors = {
  developer: '#9b87f5',
  teacher: '#0EA5E9',
  doctor: '#F97316',
  engineer: '#D946EF',
  lawyer: '#82ca9d'
};

const ProfessionDistributionChart = () => {
  return (
    <Card className="p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Platformlara Göre Meslek Dağılımı</h2>
      <div className="h-[500px]">
        <ChartContainer
          config={{
            developer: { color: colors.developer },
            teacher: { color: colors.teacher },
            doctor: { color: colors.doctor },
            engineer: { color: colors.engineer },
            lawyer: { color: colors.lawyer }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={professionData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="platform"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar
                dataKey="developer"
                name="Yazılımcı"
                fill={colors.developer}
                stackId="a"
              />
              <Bar
                dataKey="teacher"
                name="Öğretmen"
                fill={colors.teacher}
                stackId="a"
              />
              <Bar
                dataKey="doctor"
                name="Doktor"
                fill={colors.doctor}
                stackId="a"
              />
              <Bar
                dataKey="engineer"
                name="Mühendis"
                fill={colors.engineer}
                stackId="a"
              />
              <Bar
                dataKey="lawyer"
                name="Avukat"
                fill={colors.lawyer}
                stackId="a"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
};

export default ProfessionDistributionChart;
