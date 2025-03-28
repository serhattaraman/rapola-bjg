import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserPlus, CheckCircle, XCircle, Clock } from 'lucide-react';
import StatCard from '@/components/StatCard';
import CandidateCard from '@/components/CandidateCard';
import WaitingCandidatesSection from '@/components/WaitingCandidatesSection';
import { getStatusCount, getRecentApplications, getApplicationTrend, getStageDistribution, mockCandidates } from '@/lib/mock-data';
import { Link } from 'react-router-dom';

const COLORS = ['#3498db', '#f1c40f', '#2ecc71', '#e74c3c'];

// .NET MVC'de bu sayfa Home/Index.cshtml olarak dönüştürülebilir
const Index = () => {
  const statusCounts = getStatusCount();
  const recentApplications = getRecentApplications();
  const applicationTrend = getApplicationTrend();
  const stageDistribution = getStageDistribution();

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

        {/* Waiting Candidates Section */}
        <div className="mb-8 animate-fade-in">
          <WaitingCandidatesSection candidates={mockCandidates} />
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

        {/* Recent Applications */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 recent-applications-grid">
            {recentApplications.map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
            {/* .NET MVC'de:
              @foreach (var candidate in Model.RecentApplications) {
                <partial name="_CandidateCard" model="candidate" />
              }
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
