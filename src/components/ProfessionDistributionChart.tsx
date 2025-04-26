
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter } from "lucide-react";

const professionData = [
  {
    platform: 'Google Ads',
    nursing: 45,
    automotive: 25,
    electrical: 30
  },
  {
    platform: 'Instagram',
    nursing: 38,
    automotive: 22,
    electrical: 28
  },
  {
    platform: 'X',
    nursing: 25,
    automotive: 15,
    electrical: 20
  },
  {
    platform: 'LinkedIn',
    nursing: 50,
    automotive: 35,
    electrical: 40
  },
  {
    platform: 'YouTube',
    nursing: 30,
    automotive: 28,
    electrical: 25
  },
  {
    platform: 'TikTok',
    nursing: 35,
    automotive: 20,
    electrical: 15
  },
  {
    platform: 'Website',
    nursing: 42,
    automotive: 32,
    electrical: 35
  }
];

const colors = {
  nursing: '#F97316',    // Bright Orange
  automotive: '#0EA5E9', // Ocean Blue
  electrical: '#9b87f5'  // Primary Purple
};

const professions = [
  { id: 'nursing', name: 'Hemşirelik' },
  { id: 'automotive', name: 'Otomotiv' },
  { id: 'electrical', name: 'Elektrik' }
];

const ProfessionDistributionChart = () => {
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>(['nursing', 'automotive', 'electrical']);

  const filteredData = professionData.map(item => {
    const filteredItem: any = { platform: item.platform };
    selectedProfessions.forEach(profession => {
      filteredItem[profession] = item[profession];
    });
    return filteredItem;
  });

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Platformlara Göre Meslek Dağılımı</h2>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <ToggleGroup 
            type="multiple" 
            value={selectedProfessions}
            onValueChange={(value) => {
              if (value.length > 0) setSelectedProfessions(value);
            }}
          >
            {professions.map(profession => (
              <ToggleGroupItem 
                key={profession.id} 
                value={profession.id}
                aria-label={profession.name}
                className="px-3 py-2"
              >
                {profession.name}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
      <div className="h-[600px] w-full overflow-x-auto">
        <ChartContainer
          config={{
            nursing: { color: colors.nursing },
            automotive: { color: colors.automotive },
            electrical: { color: colors.electrical }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="platform"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              {selectedProfessions.includes('nursing') && (
                <Bar
                  dataKey="nursing"
                  name="Hemşirelik"
                  fill={colors.nursing}
                  stackId="a"
                  maxBarSize={50}
                />
              )}
              {selectedProfessions.includes('automotive') && (
                <Bar
                  dataKey="automotive"
                  name="Otomotiv"
                  fill={colors.automotive}
                  stackId="a"
                  maxBarSize={50}
                />
              )}
              {selectedProfessions.includes('electrical') && (
                <Bar
                  dataKey="electrical"
                  name="Elektrik"
                  fill={colors.electrical}
                  stackId="a"
                  maxBarSize={50}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </Card>
  );
};

export default ProfessionDistributionChart;
