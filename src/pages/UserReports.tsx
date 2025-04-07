
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, PieChart, Pie, Cell
} from 'recharts';
import { Users, CalendarDays, Calendar, CalendarClock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

// Mock data - in a real implementation, this would come from an API
const PROCESS_STAGES = [
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

const COLORS = [
  '#3498db', // Blue
  '#f1c40f', // Yellow
  '#2ecc71', // Green
  '#e74c3c', // Red
  '#9b59b6', // Purple
  '#e67e22', // Orange
  '#1abc9c', // Turquoise
  '#34495e', // Navy
  '#7f8c8d'  // Gray
];

// Mock data for users
const USERS = [
  { id: 1, name: "Ahmet Yılmaz", role: "İK Uzmanı" },
  { id: 2, name: "Zeynep Kaya", role: "Evrak Sorumlusu" },
  { id: 3, name: "Mehmet Demir", role: "İK Yöneticisi" },
  { id: 4, name: "Ayşe Şahin", role: "Vize Sorumlusu" },
];

// Mock function to generate random data for a user
const generateUserStageData = (userId: number, period: string) => {
  return PROCESS_STAGES.map(stage => {
    // Generate more realistic numbers based on stage and role
    let baseCount = Math.floor(Math.random() * 10) + 1;
    
    // Adjust counts based on period
    if (period === "weekly") {
      baseCount *= 5;
    } else if (period === "monthly") {
      baseCount *= 20;
    }
    
    return {
      stage,
      count: baseCount,
      userId
    };
  });
};

// Mock function to generate data for all users
const generateAllUsersData = (period: string) => {
  const data: any[] = [];
  
  USERS.forEach(user => {
    const userData = generateUserStageData(user.id, period);
    userData.forEach(item => {
      data.push({
        ...item,
        userName: user.name,
        userRole: user.role
      });
    });
  });
  
  return data;
};

// Generate aggregated data by stage
const generateStageAggregateData = (period: string) => {
  return PROCESS_STAGES.map(stage => {
    let total = 0;
    
    USERS.forEach(user => {
      // Generate consistent random data based on user and stage
      const seed = user.id * PROCESS_STAGES.indexOf(stage);
      let baseCount = (seed % 5) + 1;
      
      if (period === "weekly") {
        baseCount *= 5;
      } else if (period === "monthly") {
        baseCount *= 20;
      }
      
      total += baseCount;
    });
    
    return {
      stage,
      totalCount: total
    };
  });
};

const UserReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const { toast } = useToast();
  
  // Generate data based on current selections
  const allUsersData = generateAllUsersData(selectedPeriod);
  const stageAggregateData = generateStageAggregateData(selectedPeriod);
  
  // Filter data for selected user if needed
  const filteredData = selectedUser === "all" 
    ? allUsersData 
    : allUsersData.filter(item => item.userId === parseInt(selectedUser));
  
  // Get data for single user summary if applicable
  const singleUserData = selectedUser !== "all"
    ? PROCESS_STAGES.map(stage => {
        const stageData = filteredData.find(item => item.stage === stage);
        return {
          stage,
          count: stageData ? stageData.count : 0
        };
      })
    : [];

  // Calculate totals for each user
  const userTotals = USERS.map(user => {
    const userData = allUsersData.filter(item => item.userId === user.id);
    const totalCount = userData.reduce((sum, item) => sum + item.count, 0);
    return {
      ...user,
      totalCount
    };
  });
  
  // Get top users with most actions
  const topUsers = [...userTotals].sort((a, b) => b.totalCount - a.totalCount).slice(0, 5);
  
  // Get period label for display
  const getPeriodLabel = () => {
    switch(selectedPeriod) {
      case "daily": return "Günlük";
      case "weekly": return "Haftalık";
      case "monthly": return "Aylık";
      default: return "";
    }
  };
  
  // Handle period change
  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    toast({
      title: "Rapor periyodu değiştirildi",
      description: `Rapor periyodu ${value === "daily" ? "günlük" : value === "weekly" ? "haftalık" : "aylık"} olarak güncellendi.`,
    });
  };
  
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Kullanıcı Raporları</h1>
            <p className="text-gray-500 mt-1">Kullanıcıların süreç başına işlem istatistikleri</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Periyot Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">
                  <div className="flex items-center">
                    <CalendarClock className="mr-2 h-4 w-4" />
                    <span>Günlük</span>
                  </div>
                </SelectItem>
                <SelectItem value="weekly">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Haftalık</span>
                  </div>
                </SelectItem>
                <SelectItem value="monthly">
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    <span>Aylık</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kullanıcı Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Tüm Kullanıcılar</span>
                  </div>
                </SelectItem>
                {USERS.map(user => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="details">Detaylı İstatistikler</TabsTrigger>
            <TabsTrigger value="comparison">Kullanıcı Karşılaştırma</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Top performing users chart */}
              <Card>
                <CardHeader>
                  <CardTitle>En Çok İşlem Yapan Kullanıcılar</CardTitle>
                  <CardDescription>{getPeriodLabel()} işlem sayıları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topUsers}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          dataKey="name" 
                          type="category"
                          width={80} 
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [`${value} işlem`, 'Toplam İşlem']}
                          labelFormatter={(name) => `${name}`}
                        />
                        <Bar 
                          dataKey="totalCount" 
                          name="İşlem Sayısı"
                          fill="#3498db" 
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Stage distribution pie chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Süreç Bazlı Dağılım</CardTitle>
                  <CardDescription>Tüm kullanıcıların süreçlere göre toplam işlem sayıları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stageAggregateData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="totalCount"
                          nameKey="stage"
                          label={({ stage, percent }) => 
                            `${stage.length > 10 ? stage.substring(0, 10) + '...' : stage} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {stageAggregateData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value} işlem`, 'Toplam İşlem']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Summary table */}
            <Card>
              <CardHeader>
                <CardTitle>{getPeriodLabel()} Özet Rapor</CardTitle>
                <CardDescription>
                  Tüm kullanıcıların süreç bazında işlem sayıları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kullanıcı</TableHead>
                        {PROCESS_STAGES.map(stage => (
                          <TableHead key={stage}>{stage}</TableHead>
                        ))}
                        <TableHead>Toplam</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {USERS.map(user => {
                        const userDataByStage = PROCESS_STAGES.map(stage => {
                          const stageData = allUsersData.find(item => 
                            item.userId === user.id && item.stage === stage
                          );
                          return stageData ? stageData.count : 0;
                        });
                        
                        const userTotal = userDataByStage.reduce((sum, count) => sum + count, 0);
                        
                        return (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            {userDataByStage.map((count, index) => (
                              <TableCell key={index}>{count}</TableCell>
                            ))}
                            <TableCell className="font-bold">{userTotal}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            {selectedUser === "all" ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {PROCESS_STAGES.map((stage, index) => (
                  <Card key={stage}>
                    <CardHeader>
                      <CardTitle>{stage}</CardTitle>
                      <CardDescription>{getPeriodLabel()} kullanıcı bazlı işlem sayıları</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={USERS.map(user => {
                              const stageData = allUsersData.find(item => 
                                item.userId === user.id && item.stage === stage
                              );
                              return {
                                name: user.name,
                                count: stageData ? stageData.count : 0,
                                role: user.role
                              };
                            })}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip labelFormatter={(name) => `${name}`} />
                            <Bar 
                              dataKey="count" 
                              name="İşlem Sayısı"
                              fill={COLORS[index % COLORS.length]} 
                              radius={[4, 4, 0, 0]} 
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {USERS.find(u => u.id === parseInt(selectedUser))?.name} - Süreç Bazlı İstatistikler
                    </CardTitle>
                    <CardDescription>
                      {getPeriodLabel()} süreç bazında işlem sayıları
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={singleUserData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="stage" />
                          <YAxis />
                          <Tooltip />
                          <Bar 
                            dataKey="count" 
                            name="İşlem Sayısı"
                            fill="#3498db" 
                            radius={[4, 4, 0, 0]} 
                          >
                            {singleUserData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium mb-4">Detaylı Tablo</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Süreç</TableHead>
                            <TableHead>İşlem Sayısı</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {singleUserData.map((item) => (
                            <TableRow key={item.stage}>
                              <TableCell>{item.stage}</TableCell>
                              <TableCell>{item.count}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell className="font-bold">Toplam</TableCell>
                            <TableCell className="font-bold">
                              {singleUserData.reduce((sum, item) => sum + item.count, 0)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Kullanıcı Karşılaştırma</CardTitle>
                <CardDescription>
                  Kullanıcıların {getPeriodLabel().toLowerCase()} toplam işlem sayılarını karşılaştır
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={PROCESS_STAGES.map(stage => {
                        const stageData: any = { stage };
                        
                        USERS.forEach(user => {
                          const userData = allUsersData.find(item => 
                            item.userId === user.id && item.stage === stage
                          );
                          
                          stageData[user.name] = userData ? userData.count : 0;
                        });
                        
                        return stageData;
                      })}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="stage" 
                        angle={-45} 
                        textAnchor="end" 
                        height={80}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {USERS.map((user, index) => (
                        <Bar 
                          key={user.id}
                          dataKey={user.name} 
                          fill={COLORS[index % COLORS.length]} 
                          radius={[4, 4, 0, 0]} 
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserReports;
