import { useState, useEffect } from "react";
import { BarChart, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import { format, subDays, startOfWeek, startOfMonth, subWeeks, subMonths } from "date-fns";
import { tr } from "date-fns/locale";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatCard from "@/components/StatCard";
import { Users, CalendarDays, Calendar, BarChart as BarChartIcon, Clock, Timer, Hourglass } from "lucide-react";

// Sahte veri üretmek için kullanılacak yardımcı fonksiyon
function generateMockData(users, stages, timeframes) {
  const data = [];
  
  users.forEach(user => {
    stages.forEach(stage => {
      timeframes.forEach(({ name, days }) => {
        // Her kullanıcı için her aşama ve zaman dilimi için rastgele değerler üretelim
        const count = Math.floor(Math.random() * 50) + 1;
        data.push({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          stage,
          timeframe: name,
          count,
          date: format(subDays(new Date(), days), 'yyyy-MM-dd')
        });
      });
    });
  });
  
  return data;
}

// Süreç aşamaları
const stages = [
  "Başvuru Alındı",
  "Telefon Görüşmesi",
  "İK Görüşmesi",
  "Evrak Toplama",
  "Sisteme Evrak Girişi",
  "Sınıf Yerleştirme",
  "Denklik Süreci", 
  "Vize Süreci",
  "Sertifika Süreci"
];

// Renk paleti
const COLORS = [
  '#8E9196', '#9b87f5', '#7E69AB', '#6E59A5', '#1A1F2C', 
  '#D6BCFA', '#F1F0FB', '#33C3F0', '#1EAEDB'
];

const timeframes = [
  { name: "Günlük", days: 1 },
  { name: "Haftalık", days: 7 },
  { name: "Aylık", days: 30 }
];

const UserReports = () => {
  const [selectedStage, setSelectedStage] = useState(stages[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState("Günlük");
  const [selectedUser, setSelectedUser] = useState("all");
  const [reportData, setReportData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kullanıcıları ve rapor verilerini yükle
  useEffect(() => {
    // Gerçek API bağlantısı olmadığı için mock veri kullanıyoruz
    const mockUsers = [
      { id: "1", name: "Ahmet Yılmaz", role: "admin" },
      { id: "2", name: "Mehmet Demir", role: "manager" },
      { id: "3", name: "Ayşe Kaya", role: "staff" },
      { id: "4", name: "Zeynep Aktaş", role: "staff" }
    ];

    const mockReportData = generateMockData(mockUsers, stages, [
      { name: "Günlük", days: 1 },
      { name: "Haftalık", days: 7 },
      { name: "Aylık", days: 30 }
    ]);

    setUsers(mockUsers);
    setReportData(mockReportData);
    setLoading(false);
  }, []);

  // Özet istatistikler için verileri hesapla
  const calculateSummaryStats = () => {
    if (reportData.length === 0) return { 
      total: 0, 
      daily: 0, 
      weekly: 0, 
      monthly: 0, 
      averageTimePerCandidate: 0,
      longestProcess: { name: "-", days: 0 },
      shortestProcess: { name: "-", days: 0 }
    };

    const total = reportData.reduce((sum, item) => sum + item.count, 0);
    
    const dailyData = reportData.filter(item => item.timeframe === "Günlük");
    const weeklyData = reportData.filter(item => item.timeframe === "Haftalık");
    const monthlyData = reportData.filter(item => item.timeframe === "Aylık");
    
    const dailySum = dailyData.reduce((sum, item) => sum + item.count, 0);
    const weeklySum = weeklyData.reduce((sum, item) => sum + item.count, 0);
    const monthlySum = monthlyData.reduce((sum, item) => sum + item.count, 0);

    // Calculate average time per candidate (random value between 5-20 days)
    const averageTimePerCandidate = Math.floor(Math.random() * 15) + 5;
    
    // Generate process duration data for longest and shortest process
    const processDurations = stages.map(stage => ({
      name: stage,
      days: Math.floor(Math.random() * 30) + 1  // Random duration between 1-30 days
    }));
    
    // Find longest and shortest process
    const longestProcess = processDurations.reduce((max, process) => 
      process.days > max.days ? process : max, { name: "", days: 0 });
    
    const shortestProcess = processDurations.reduce((min, process) => 
      (min.days === 0 || process.days < min.days) ? process : min, { name: "", days: Infinity });
    
    return { 
      total, 
      daily: dailySum, 
      weekly: weeklySum, 
      monthly: monthlySum,
      averageTimePerCandidate,
      longestProcess,
      shortestProcess: { ...shortestProcess, days: shortestProcess.days !== Infinity ? shortestProcess.days : 0 }
    };
  };

  const summaryStats = calculateSummaryStats();

  // Filtreli verileri oluştur
  const getFilteredData = () => {
    let filtered = reportData;

    // Seçili zaman dilimine göre filtrele
    filtered = filtered.filter(item => item.timeframe === selectedTimeframe);
    
    // Seçili aşamaya göre filtrele
    if (selectedStage !== "all") {
      filtered = filtered.filter(item => item.stage === selectedStage);
    }
    
    // Seçili kullanıcıya göre filtrele
    if (selectedUser !== "all") {
      filtered = filtered.filter(item => item.userId === selectedUser);
    }

    return filtered;
  };

  // Grafik verisini oluştur
  const getChartData = () => {
    const filtered = getFilteredData();
    
    // Aşamalara göre grupla
    const groupedByStage = {};
    filtered.forEach(item => {
      if (!groupedByStage[item.stage]) {
        groupedByStage[item.stage] = 0;
      }
      groupedByStage[item.stage] += item.count;
    });

    return Object.keys(groupedByStage).map(stage => ({
      name: stage,
      value: groupedByStage[stage]
    }));
  };

  // Kullanıcılara göre verileri grupla
  const getUserStatsForTable = () => {
    const filtered = getFilteredData();
    
    // Kullanıcı ve aşamalara göre grupla
    const groupedData = {};
    
    filtered.forEach(item => {
      if (!groupedData[item.userId]) {
        groupedData[item.userId] = {
          userName: item.userName,
          userRole: item.userRole,
          stages: {}
        };
      }
      
      if (!groupedData[item.userId].stages[item.stage]) {
        groupedData[item.userId].stages[item.stage] = 0;
      }
      
      groupedData[item.userId].stages[item.stage] += item.count;
    });
    
    // Tablo için uygun formata dönüştür
    return Object.keys(groupedData).map(userId => {
      const userData = groupedData[userId];
      const result = {
        userName: userData.userName,
        userRole: userData.userRole
      };
      
      // Her aşama için değerleri ekle
      stages.forEach(stage => {
        result[stage] = userData.stages[stage] || 0;
      });
      
      // Toplam değeri hesapla
      result.total = stages.reduce((sum, stage) => sum + (userData.stages[stage] || 0), 0);
      
      return result;
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Kullanıcı Raporları</h1>
      
      {/* Özet İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Toplam İşlem"
          value={summaryStats.total}
          icon={<BarChartIcon size={24} />}
        />
        <StatCard 
          title="Günlük İşlem"
          value={summaryStats.daily}
          icon={<CalendarDays size={24} />}
          change={{ value: 5, isPositive: true }}
        />
        <StatCard 
          title="Haftalık İşlem"
          value={summaryStats.weekly}
          icon={<Calendar size={24} />}
          change={{ value: 10, isPositive: true }}
        />
        <StatCard 
          title="Aylık İşlem"
          value={summaryStats.monthly}
          icon={<Users size={24} />}
          change={{ value: 2, isPositive: false }}
        />
      </div>
      
      {/* Yeni Eklenen Süreç İstatistikleri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Aday Başına Ortalama Süre"
          value={`${summaryStats.averageTimePerCandidate} gün`}
          icon={<Clock size={24} />}
          description="Her aday için harcanan ortalama süre"
        />
        <StatCard 
          title="En Uzun Süren Aşama"
          value={`${summaryStats.longestProcess.name}`}
          subValue={`${summaryStats.longestProcess.days} gün`}
          icon={<Hourglass size={24} />}
          description="En çok zaman alan süreç aşaması"
        />
        <StatCard 
          title="En Kısa Süren Aşama"
          value={`${summaryStats.shortestProcess.name}`}
          subValue={`${summaryStats.shortestProcess.days} gün`}
          icon={<Timer size={24} />}
          description="En hızlı tamamlanan süreç aşaması"
        />
      </div>
      
      {/* Filtreler */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Rapor Filtreleri</CardTitle>
          <CardDescription>
            İstediğiniz parametrelere göre rapor verilerini filtreleyin
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Zaman Dilimi</label>
            <Select
              value={selectedTimeframe}
              onValueChange={setSelectedTimeframe}
            >
              <SelectTrigger>
                <SelectValue placeholder="Zaman Dilimi Seçin" />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map((timeframe) => (
                  <SelectItem key={timeframe.name} value={timeframe.name}>
                    {timeframe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Süreç Aşaması</label>
            <Select
              value={selectedStage}
              onValueChange={setSelectedStage}
            >
              <SelectTrigger>
                <SelectValue placeholder="Aşama Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Kullanıcı</label>
            <Select
              value={selectedUser}
              onValueChange={setSelectedUser}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kullanıcı Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Grafikler ve Tablolar */}
      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="chart">Grafik</TabsTrigger>
          <TabsTrigger value="table">Tablo</TabsTrigger>
          <TabsTrigger value="summary">Özet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Süreç Aşamalarına Göre İşlem Dağılımı</CardTitle>
              <CardDescription>
                {selectedTimeframe} bazında her aşamadaki işlem sayıları
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} İşlem`, 'İşlem Sayısı']} />
                    <Legend />
                    <Bar dataKey="value" name="İşlem Sayısı" fill="#9b87f5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {getChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} İşlem`, 'İşlem Sayısı']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcıların İşlem Detayları</CardTitle>
              <CardDescription>
                Her kullanıcının {selectedTimeframe.toLowerCase()} gerçekleştirdiği işlemlerin aşamalara göre dağılımı
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kullanıcı</TableHead>
                      {stages.map((stage) => (
                        <TableHead key={stage}>{stage}</TableHead>
                      ))}
                      <TableHead>Toplam</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getUserStatsForTable().map((userData, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {userData.userName}
                          <span className="block text-xs text-gray-500">
                            {userData.userRole === 'admin' && 'Admin'}
                            {userData.userRole === 'manager' && 'Yönetici'}
                            {userData.userRole === 'staff' && 'Personel'}
                          </span>
                        </TableCell>
                        {stages.map((stage) => (
                          <TableCell key={stage}>{userData[stage]}</TableCell>
                        ))}
                        <TableCell className="font-bold">{userData.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Özet İstatistikler</CardTitle>
              <CardDescription>
                Seçilen filtrelere göre oluşturulan özet veriler
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stages.map(stage => ({
                      name: stage,
                      günlük: Math.floor(Math.random() * 30) + 1,
                      haftalık: Math.floor(Math.random() * 100) + 30,
                      aylık: Math.floor(Math.random() * 200) + 100
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="günlük" stroke="#9b87f5" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="haftalık" stroke="#7E69AB" />
                    <Line type="monotone" dataKey="aylık" stroke="#33C3F0" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-xl font-bold">En Aktif Kullanıcı</div>
                      <div className="text-lg">{users[0]?.name || "Veri yok"}</div>
                      <div className="text-sm text-gray-500">{Math.floor(Math.random() * 100) + 50} işlem</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-xl font-bold">En Yoğun Süreç</div>
                      <div className="text-lg">Evrak Toplama</div>
                      <div className="text-sm text-gray-500">{Math.floor(Math.random() * 100) + 80} işlem</div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle>Genel İstatistikler</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Toplam İşlem:</span>
                        <span className="font-bold">{summaryStats.total}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Ortalama Günlük İşlem:</span>
                        <span className="font-bold">{Math.round(summaryStats.daily / users.length)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Ortalama Haftalık İşlem:</span>
                        <span className="font-bold">{Math.round(summaryStats.weekly / users.length)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Ortalama Aylık İşlem:</span>
                        <span className="font-bold">{Math.round(summaryStats.monthly / users.length)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Aday Başına Ortalama Süre:</span>
                        <span className="font-bold">{summaryStats.averageTimePerCandidate} gün</span>
                      </li>
                      <li className="flex justify-between">
                        <span>En Uzun Süren Aşama:</span>
                        <span className="font-bold">{summaryStats.longestProcess.name} ({summaryStats.longestProcess.days} gün)</span>
                      </li>
                      <li className="flex justify-between">
                        <span>En Kısa Süren Aşama:</span>
                        <span className="font-bold">{summaryStats.shortestProcess.name} ({summaryStats.shortestProcess.days} gün)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserReports;
