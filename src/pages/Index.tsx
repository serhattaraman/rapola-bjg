
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserPlus, CheckCircle, XCircle, Clock, Briefcase, GraduationCap, Stethoscope, Wrench, Car } from 'lucide-react';
import StatCard from '@/components/StatCard';
import CandidateCard from '@/components/CandidateCard';
import { getStatusCount, getRecentApplications, getApplicationTrend, getStageDistribution, mockCandidates, getProfessionDistribution, getAgeDistribution } from '@/lib/mock-data';
import { Link } from 'react-router-dom';
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

const COLORS = ['#3498db', '#f1c40f', '#2ecc71', '#e74c3c'];
const PROFESSION_COLORS = ['#3498db', '#9b59b6', '#e74c3c'];
const AGE_COLORS = ['#2ecc71', '#f39c12'];

// .NET MVC'de bu sayfa Home/Index.cshtml olarak dönüştürülebilir
const Index = () => {
  const statusCounts = getStatusCount();
  const recentApplications = getRecentApplications();
  const applicationTrend = getApplicationTrend();
  const stageDistribution = getStageDistribution();
  const professionStats = getProfessionDistribution();
  const ageStats = getAgeDistribution();

  // Meslek ikonlarını belirleme fonksiyonu
  const getProfessionIcon = (profession: string) => {
    switch (profession) {
      case 'Hemşirelik':
        return <Stethoscope className="mr-2 h-5 w-5" />;
      case 'Mekatronik':
        return <Wrench className="mr-2 h-5 w-5" />;
      case 'Otomotiv':
        return <Car className="mr-2 h-5 w-5" />;
      default:
        return <GraduationCap className="mr-2 h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in dashboard-page">
      <div className="max-w-7xl mx-auto dashboard-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 dashboard-header">
          <div className="dashboard-title">
            <h1 className="text-3xl font-bold">Genel Bakış</h1>
            <p className="text-gray-500 mt-1">Aday takip sistemi istatistikleri ve son başvurular</p>
          </div>
          <div className="mt-4 md:mt-0 dashboard-actions">
            <Link 
              to="/add-candidate" 
              className="inline-flex items-center btn-primary add-candidate-btn"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Yeni Aday Ekle
              {/* .NET MVC'de:
                <a href="@Url.Action("Create", "Candidate")" class="btn-primary add-candidate-btn">
                  <i class="icon-user-plus"></i>
                  Yeni Aday Ekle
                </a>
              */}
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 animate-slide-in stats-container">
          <StatCard 
            title="Toplam Aday" 
            value={statusCounts.total}
            icon={<Users className="h-6 w-6" />}
            change={{ value: 12, isPositive: true }}
            className="stat-total"
          />
          <StatCard 
            title="Bekleyen Adaylar" 
            value={statusCounts.pending}
            icon={<Clock className="h-6 w-6" />}
            change={{ value: 5, isPositive: true }}
            className="stat-pending"
          />
          <StatCard 
            title="İşlemdeki Adaylar" 
            value={statusCounts.inProgress}
            icon={<UserPlus className="h-6 w-6" />}
            change={{ value: 8, isPositive: true }}
            className="stat-inProgress"
          />
          <StatCard 
            title="Tamamlanan Adaylar" 
            value={statusCounts.completed}
            icon={<CheckCircle className="h-6 w-6" />}
            change={{ value: 3, isPositive: true }}
            className="stat-completed"
          />
          <StatCard 
            title="Bekleme Modundaki Adaylar" 
            value={statusCounts.waiting}
            icon={<Clock className="h-6 w-6 text-amber-500" />}
            change={{ value: 1, isPositive: true }}
            className="bg-amber-50 border-amber-200"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 charts-container">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
            <h2 className="text-lg font-semibold mb-4">Son 7 Gün Başvuru Trendi</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={applicationTrend}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Bar 
                    dataKey="count" 
                    name="Başvuru Sayısı"
                    fill="#3498db" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
            <h2 className="text-lg font-semibold mb-4">Aday Durumu Dağılımı</h2>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Beklemede', value: statusCounts.pending },
                      { name: 'İşlemde', value: statusCounts.inProgress },
                      { name: 'Tamamlandı', value: statusCounts.completed },
                      { name: 'Reddedildi', value: statusCounts.rejected }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {[
                      { name: 'Beklemede', value: statusCounts.pending },
                      { name: 'İşlemde', value: statusCounts.inProgress },
                      { name: 'Tamamlandı', value: statusCounts.completed },
                      { name: 'Reddedildi', value: statusCounts.rejected }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Meslek İstatistikleri */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in mb-8">
          <div className="flex items-center mb-4">
            <GraduationCap className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-lg font-semibold">Meslek Dağılımı</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80">
              <ChartContainer config={{}} className="h-full">
                <BarChart 
                  data={professionStats} 
                  layout="vertical" 
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    name="Toplam Aday" 
                    fill="#9b87f5" 
                    radius={[0, 4, 4, 0]} 
                  />
                </BarChart>
              </ChartContainer>
            </div>
            
            <div className="h-80">
              <ChartContainer config={{}} className="h-full">
                <PieChart>
                  <Pie
                    data={professionStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {professionStats.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={PROFESSION_COLORS[index % PROFESSION_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </div>
          
          {/* Meslek ve Yaş Grupları */}
          <div className="mt-8">
            <h3 className="text-md font-semibold mb-4">Meslek ve Yaş Dağılımı</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {professionStats.map((profession, index) => (
                <div key={profession.name} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-3">
                    {getProfessionIcon(profession.name)}
                    <h4 className="font-medium">{profession.name}</h4>
                  </div>
                  
                  <div className="h-48">
                    <ChartContainer config={{}} className="h-full">
                      <BarChart
                        data={[
                          { name: "42 yaş altı", value: profession.under42 },
                          { name: "42 yaş ve üstü", value: profession.over42 }
                        ]}
                        layout="vertical"
                        margin={{ top: 5, right: 5, left: 50, bottom: 5 }}
                      >
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={80} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar 
                          dataKey="value" 
                          name="Aday Sayısı" 
                          fill={PROFESSION_COLORS[index % PROFESSION_COLORS.length]}
                          radius={[0, 4, 4, 0]} 
                        />
                      </BarChart>
                    </ChartContainer>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">42 yaş altı:</span>
                      <span className="font-medium">{profession.under42} kişi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">42 yaş ve üstü:</span>
                      <span className="font-medium">{profession.over42} kişi</span>
                    </div>
                    <div className="flex justify-between col-span-2">
                      <span className="text-gray-600">Toplam:</span>
                      <span className="font-medium">{profession.count} kişi</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Yaş İstatistikleri */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in mb-8">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-lg font-semibold">Yaş Dağılımı</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <ChartContainer config={{}} className="h-full">
                <BarChart 
                  data={ageStats} 
                  layout="vertical" 
                  margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="value" 
                    name="Aday Sayısı" 
                    fill="#3498db" 
                    radius={[0, 4, 4, 0]} 
                  />
                </BarChart>
              </ChartContainer>
            </div>
            
            <div className="h-64">
              <ChartContainer config={{}} className="h-full">
                <PieChart>
                  <Pie
                    data={ageStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {ageStats.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={AGE_COLORS[index % AGE_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </div>
          </div>
        </div>

        {/* Recent Applications - Improved layout */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in recent-applications">
          <div className="flex justify-between items-center mb-6 recent-applications-header">
            <h2 className="text-lg font-semibold">Son Başvurular</h2>
            <Link to="/candidates" className="text-primary hover:text-primary/80 text-sm font-medium view-all-link">
              Tümünü Gör →
              {/* .NET MVC'de:
                <a href="@Url.Action("Index", "Candidate")" class="view-all-link">Tümünü Gör →</a>
              */}
            </Link>
          </div>
          
          {/* Updated layout with maximum 3 cards and more spacing */}
          <div className="grid grid-cols-1 gap-6 recent-applications-grid">
            {recentApplications.slice(0, 3).map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
            {/* .NET MVC'de:
              @foreach (var candidate in Model.RecentApplications.Take(3)) {
                <partial name="_CandidateCard" model="candidate" />
              }
            */}
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in mt-8">
          <h2 className="text-lg font-semibold mb-4">Hakkında</h2>
          <div className="text-gray-600">
            <p className="mb-2">Bu aday takip sistemi Serhat Taraman tarafından geliştirilmiştir.</p>
            <p className="mb-2">Sistem, aday yönetimi, süreç takibi ve detaylı raporlama özellikleri sunarak insan kaynakları süreçlerini kolaylaştırmayı amaçlamaktadır.</p>
            <p>Sürüm: 1.0.0 | Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
