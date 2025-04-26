import React from 'react';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ProfessionDistributionChart from '@/components/ProfessionDistributionChart';

// Platform application data
const platformData = [
  { name: 'Google Ads', value: 45 },
  { name: 'Instagram', value: 30 },
  { name: 'X', value: 15 },
  { name: 'LinkedIn', value: 25 },
  { name: 'YouTube', value: 20 },
  { name: 'TikTok', value: 35 },
  { name: 'Website', value: 28 }
];

// Status data per platform
const statusData = [
  { 
    name: 'Google Ads',
    ongoing: 25,
    discontinued: 12,
    notSuitable: 8
  },
  { 
    name: 'Instagram',
    ongoing: 15,
    discontinued: 8,
    notSuitable: 7
  },
  { 
    name: 'X',
    ongoing: 8,
    discontinued: 4,
    notSuitable: 3
  },
  { 
    name: 'LinkedIn',
    ongoing: 15,
    discontinued: 6,
    notSuitable: 4
  },
  { 
    name: 'YouTube',
    ongoing: 10,
    discontinued: 7,
    notSuitable: 3
  },
  { 
    name: 'TikTok',
    ongoing: 20,
    discontinued: 10,
    notSuitable: 5
  },
  { 
    name: 'Website',
    ongoing: 16,
    discontinued: 8,
    notSuitable: 4
  }
];

const COLORS = ['#9b87f5', '#0EA5E9', '#F97316', '#D946EF', '#8884d8', '#82ca9d', '#ffc658'];

const chartConfig = {
  google: { color: '#9b87f5' },
  instagram: { color: '#0EA5E9' },
  x: { color: '#F97316' },
  linkedin: { color: '#D946EF' },
  youtube: { color: '#8884d8' },
  tiktok: { color: '#82ca9d' },
  website: { color: '#ffc658' },
  ongoing: { color: '#4ade80' },
  discontinued: { color: '#f87171' },
  notSuitable: { color: '#fbbf24' }
};

const AdvertisingReports = () => {
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Reklam Raporları</h1>
          <p className="text-gray-500 mt-1">Platformlara göre başvuru istatistikleri</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pasta Grafiği */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Kaynaklara Göre Başvuru Dağılımı</h2>
            <div className="h-[400px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </Card>

          {/* Çubuk Grafiği */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Platformlara Göre Başvuru Sayıları</h2>
            <div className="h-[400px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" name="Başvuru Sayısı" fill="#8884d8">
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </Card>
        </div>

        {/* Platform Bazlı Başvuru Durumları */}
        <Card className="p-6 mb-12"> {/* Increased bottom margin to prevent overlap */}
          <h2 className="text-xl font-semibold mb-4">Platform Bazlı Başvuru Durumları</h2>
          <div className="h-[550px] w-full"> {/* Increased height for better spacing */}
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={statusData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 120 }} /* Further increased bottom margin */
                  barSize={28} /* Adjusted bar size */
                  barGap={5} /* Increased gap between bars */
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.6} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={120} /* Increased height for angled labels */
                    interval={0}
                    tick={{fontSize: 12}}
                    tickMargin={15} /* Increased space between labels and axis */
                  />
                  <YAxis 
                    axisLine={true}
                    tickLine={true}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    cursor={{fill: 'transparent'}}
                    wrapperStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px', 
                      padding: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={40} /* Increased legend height */
                    wrapperStyle={{ paddingBottom: '20px' }} /* Added more padding */
                    iconSize={14}
                    iconType="circle"
                  />
                  <Bar 
                    dataKey="ongoing" 
                    name="Devam Eden" 
                    stackId="a" 
                    fill="#4ade80" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={45}
                  />
                  <Bar 
                    dataKey="discontinued" 
                    name="Vazgeçen" 
                    stackId="a" 
                    fill="#f87171" 
                    radius={[0, 0, 0, 0]}
                    maxBarSize={45}
                  />
                  <Bar 
                    dataKey="notSuitable" 
                    name="Uygun Değil" 
                    stackId="a" 
                    fill="#fbbf24" 
                    radius={[0, 0, 4, 4]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>

        {/* New Profession Distribution Chart */}
        <ProfessionDistributionChart />

        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Toplam Başvuru</h3>
            <p className="text-3xl font-bold text-primary">
              {platformData.reduce((acc, curr) => acc + curr.value, 0)}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">En Çok Başvuru</h3>
            <p className="text-3xl font-bold text-primary">
              {platformData.reduce((max, curr) => curr.value > max ? curr.value : max, 0)}
            </p>
            <p className="text-sm text-gray-500">
              {platformData.reduce((max, curr) => curr.value > max.value ? curr : max).name}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Ortalama Başvuru</h3>
            <p className="text-3xl font-bold text-primary">
              {Math.round(platformData.reduce((acc, curr) => acc + curr.value, 0) / platformData.length)}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Aktif Kaynaklar</h3>
            <p className="text-3xl font-bold text-primary">{platformData.length}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvertisingReports;
