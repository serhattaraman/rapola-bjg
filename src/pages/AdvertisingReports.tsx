
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data - replace with real data later
const data = [
  { name: 'Google Reklam', value: 400 },
  { name: 'Instagram', value: 300 },
  { name: 'X', value: 200 },
  { name: 'LinkedIn', value: 278 },
  { name: 'YouTube', value: 189 },
  { name: 'TikTok', value: 239 },
  { name: 'Sitemiz', value: 349 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const AdvertisingReports = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Reklam Raporları</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pasta Grafiği */}
        <Card>
          <CardHeader>
            <CardTitle>Başvuru Kaynakları Dağılımı</CardTitle>
            <CardDescription>
              Farklı platformlardan gelen başvuruların dağılımı
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Grafiği */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Bazlı Başvurular</CardTitle>
            <CardDescription>
              Her platformdan gelen başvuru sayıları
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    name="Başvuru Sayısı"
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* İstatistik Kartları */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <CardTitle className="text-lg mb-2">En Çok Başvuru</CardTitle>
              <div className="text-2xl font-bold text-primary">
                {data.reduce((max, current) => 
                  current.value > max.value ? current : max
                ).name}
              </div>
              <p className="text-muted-foreground">
                {data.reduce((max, current) => 
                  current.value > max.value ? current : max
                ).value} başvuru
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <CardTitle className="text-lg mb-2">Toplam Başvuru</CardTitle>
              <div className="text-2xl font-bold text-primary">
                {data.reduce((sum, current) => sum + current.value, 0)}
              </div>
              <p className="text-muted-foreground">tüm kaynaklardan</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <CardTitle className="text-lg mb-2">Ortalama Başvuru</CardTitle>
              <div className="text-2xl font-bold text-primary">
                {Math.round(data.reduce((sum, current) => 
                  sum + current.value, 0) / data.length)}
              </div>
              <p className="text-muted-foreground">kaynak başına</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvertisingReports;
