
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, PieChart, Pie
} from 'recharts';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, Clock, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Süreç adımları
const PROCESS_STAGES = [
  'Başvuru Alındı',
  'Telefon Görüşmesi',
  'İK Görüşmesi',
  'Evrak Toplama',
  'Sisteme Evrak Girişi',
  'Sınıf Yerleştirme',
  'Denklik Süreci',
  'Vize Süreci',
  'Sertifika Süreci'
];

// Renk paleti
const COLORS = ['#3498db', '#9b87f5', '#e74c3c', '#2ecc71', '#f39c12', '#1abc9c', '#d35400', '#8e44ad', '#16a085'];

// Mock veri üretimi için yardımcı fonksiyon 
const generateMockData = () => {
  // Kullanıcı listesi
  const users = [
    { id: 1, name: 'Ahmet Yılmaz', role: 'İK Uzmanı' },
    { id: 2, name: 'Ayşe Demir', role: 'Evrak Sorumlusu' },
    { id: 3, name: 'Mehmet Kaya', role: 'Vize Uzmanı' }
  ];

  // Her kullanıcı için süreç bazlı istatistikler oluştur
  return users.map(user => {
    // Her süreç için günlük, haftalık ve aylık istatistikler
    const processStats = PROCESS_STAGES.map(process => {
      // Rastgele veriler oluştur
      const daily = Math.floor(Math.random() * 10);
      const weekly = daily + Math.floor(Math.random() * 20);
      const monthly = weekly + Math.floor(Math.random() * 50);
      
      return {
        process,
        daily,
        weekly, 
        monthly,
        percentage: Math.round((monthly / 100) * 100) // Aylık yüzde hesabı
      };
    });

    return {
      ...user,
      processStats,
      // Toplam işlem sayıları
      totals: {
        daily: processStats.reduce((sum, stat) => sum + stat.daily, 0),
        weekly: processStats.reduce((sum, stat) => sum + stat.weekly, 0),
        monthly: processStats.reduce((sum, stat) => sum + stat.monthly, 0)
      }
    };
  });
};

// Zaman aralığına göre veri formatını yeniden şekillendiren yardımcı fonksiyon
const formatDataByPeriod = (userData: any[], period: string) => {
  // Her bir süreç için tüm kullanıcıların toplamlarını hesapla
  const processData = PROCESS_STAGES.map(process => {
    const totalCount = userData.reduce((sum, user) => {
      const processStat = user.processStats.find((stat: any) => stat.process === process);
      return sum + (processStat ? processStat[period] : 0);
    }, 0);
    
    return {
      name: process,
      value: totalCount
    };
  });
  
  return processData;
};

// Kullanıcı bazlı veri formatını oluşturan yardımcı fonksiyon
const formatDataByUser = (userData: any[], period: string) => {
  return userData.map(user => ({
    name: user.name,
    value: user.totals[period]
  }));
};

const UserReports: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  
  // Mock veri üretimi
  const userData = generateMockData();
  
  // Seçilen zaman aralığına göre etiket
  const periodLabel = {
    daily: 'Günlük',
    weekly: 'Haftalık',
    monthly: 'Aylık'
  };
  
  // Süreç bazlı toplam veri
  const processData = formatDataByPeriod(userData, timeFrame);
  
  // Kullanıcı bazlı toplam veri
  const userTotalData = formatDataByUser(userData, timeFrame);

  // Seçilen kullanıcının süreç bazlı verileri
  const selectedUserData = selectedUser
    ? userData.find(user => user.id === selectedUser)?.processStats.map(stat => ({
        name: stat.process,
        value: stat[timeFrame]
      }))
    : [];

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Başlık ve Filtreler */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Kullanıcı Raporları</h1>
            <p className="text-gray-500 mt-1">
              Kullanıcıların süreç bazlı işlem istatistikleri
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0">
            {/* Zaman Aralığı Seçimi */}
            <Select
              value={timeFrame}
              onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setTimeFrame(value)}
            >
              <SelectTrigger className="w-[180px]">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Zaman Aralığı" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Günlük</SelectItem>
                <SelectItem value="weekly">Haftalık</SelectItem>
                <SelectItem value="monthly">Aylık</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Kullanıcı Filtresi */}
            <Select
              value={selectedUser?.toString() || ""}
              onValueChange={(value) => setSelectedUser(value ? parseInt(value, 10) : null)}
            >
              <SelectTrigger className="w-[180px]">
                <Users className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tüm Kullanıcılar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Kullanıcılar</SelectItem>
                {userData.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Süreç Filtresi */}
            <Select
              value={selectedProcess || ""}
              onValueChange={(value) => setSelectedProcess(value || null)}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tüm Süreçler" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Süreçler</SelectItem>
                {PROCESS_STAGES.map((process) => (
                  <SelectItem key={process} value={process}>
                    {process}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* İstatistik Sekmeleri */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="processes">Süreç Bazlı İstatistikler</TabsTrigger>
            <TabsTrigger value="users">Kullanıcı Bazlı İstatistikler</TabsTrigger>
          </TabsList>

          {/* Genel Bakış Sekmesi */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Süreç Dağılımı Grafiği */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Süreç Bazlı İşlem Dağılımı
                  </CardTitle>
                  <CardDescription>
                    {periodLabel[timeFrame]} işlem sayılarının süreçlere göre dağılımı
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={processData}
                        margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end"
                          height={80} 
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          name="İşlem Sayısı"
                          fill="#9b87f5"
                          radius={[4, 4, 0, 0]}
                        >
                          {processData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Kullanıcı Bazlı İşlem Dağılımı */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Kullanıcı Bazlı İşlem Dağılımı
                  </CardTitle>
                  <CardDescription>
                    {periodLabel[timeFrame]} işlem sayılarının kullanıcılara göre dağılımı
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userTotalData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {userTotalData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} işlem`, 'İşlem Sayısı']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Özet Tablo */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Özet İşlem Tablosu
                </CardTitle>
                <CardDescription>
                  {periodLabel[timeFrame]} dönemde tüm kullanıcıların işlem sayıları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kullanıcı</TableHead>
                        <TableHead>Pozisyon</TableHead>
                        {PROCESS_STAGES.map(stage => (
                          <TableHead key={stage}>{stage}</TableHead>
                        ))}
                        <TableHead>Toplam</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userData.map(user => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.role}</TableCell>
                          {PROCESS_STAGES.map(stage => {
                            const stageStat = user.processStats.find((stat: any) => stat.process === stage);
                            return (
                              <TableCell key={`${user.id}-${stage}`}>
                                {stageStat ? stageStat[timeFrame] : 0}
                              </TableCell>
                            );
                          })}
                          <TableCell className="font-bold">{user.totals[timeFrame]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Süreç Bazlı İstatistikler Sekmesi */}
          <TabsContent value="processes">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PROCESS_STAGES.map((process, index) => {
                // Her süreç için kullanıcı bazlı veri
                const processUserData = userData.map(user => {
                  const processStat = user.processStats.find((stat: any) => stat.process === process);
                  return {
                    name: user.name,
                    value: processStat ? processStat[timeFrame] : 0
                  };
                });
                
                return (
                  <Card key={process}>
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">
                        {process}
                      </CardTitle>
                      <CardDescription>
                        {periodLabel[timeFrame]} işlem sayıları
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={processUserData}
                            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                          >
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 12 }}
                              interval={0}
                              angle={-45}
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar 
                              dataKey="value" 
                              name="İşlem Sayısı" 
                              fill={COLORS[index % COLORS.length]} 
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        {processUserData.map((data) => (
                          <div key={data.name} className="flex justify-between text-sm">
                            <span>{data.name}:</span>
                            <span className="font-medium">{data.value} işlem</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Kullanıcı Bazlı İstatistikler Sekmesi */}
          <TabsContent value="users">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {userData.map((user, index) => (
                <Card key={user.id}>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {user.name}
                    </CardTitle>
                    <CardDescription>
                      {user.role} - {periodLabel[timeFrame]} işlem sayıları
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={user.processStats.map((stat: any) => ({
                            name: stat.process,
                            value: stat[timeFrame]
                          }))}
                          margin={{ top: 10, right: 10, left: 10, bottom: 60 }}
                        >
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 10 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis />
                          <Tooltip />
                          <Bar 
                            dataKey="value" 
                            name="İşlem Sayısı" 
                            fill={COLORS[index % COLORS.length]} 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between col-span-2 text-base font-medium border-t pt-2 mt-2">
                        <span>Toplam İşlem:</span>
                        <span>{user.totals[timeFrame]}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserReports;
