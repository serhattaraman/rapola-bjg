
import React from 'react';
import { Card } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Örnek veri - bu verileri daha sonra gerçek verilerle değiştirebilirsiniz
const data = [
  { name: 'Google Ads', value: 45 },
  { name: 'Instagram', value: 30 },
  { name: 'X', value: 15 },
  { name: 'LinkedIn', value: 25 },
  { name: 'YouTube', value: 20 },
  { name: 'TikTok', value: 35 },
  { name: 'Website', value: 28 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

// Define chart config for our components
const chartConfig = {
  google: { color: '#0088FE' },
  instagram: { color: '#00C49F' },
  x: { color: '#FFBB28' },
  linkedin: { color: '#FF8042' },
  youtube: { color: '#8884d8' },
  tiktok: { color: '#82ca9d' },
  website: { color: '#ffc658' }
};

const AdvertisingReports = () => {
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Reklam Raporları</h1>
          <p className="text-gray-500 mt-1">Platformlara göre başvuru istatistikleri</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pasta Grafiği */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Kaynaklara Göre Başvuru Dağılımı</h2>
            <div className="h-[400px]">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
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
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="value" name="Başvuru Sayısı" fill="#8884d8">
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </Card>
        </div>

        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Toplam Başvuru</h3>
            <p className="text-3xl font-bold text-primary">
              {data.reduce((acc, curr) => acc + curr.value, 0)}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">En Çok Başvuru</h3>
            <p className="text-3xl font-bold text-primary">
              {data.reduce((max, curr) => curr.value > max ? curr.value : max, 0)}
            </p>
            <p className="text-sm text-gray-500">
              {data.reduce((max, curr) => curr.value > max.value ? curr : max).name}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Ortalama Başvuru</h3>
            <p className="text-3xl font-bold text-primary">
              {Math.round(data.reduce((acc, curr) => acc + curr.value, 0) / data.length)}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Aktif Kaynaklar</h3>
            <p className="text-3xl font-bold text-primary">{data.length}</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvertisingReports;

