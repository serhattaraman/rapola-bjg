
import React, { useMemo } from 'react';
import StatCard from '@/components/StatCard';
import { mockCandidates } from '@/lib/mock-data';
import { User, Briefcase, CheckCircle, AlertTriangle, Clock, Hourglass, Watch } from 'lucide-react';

const UserReports = () => {
  // Calculate user statistics based on mockCandidates
  const userStatistics = useMemo(() => calculateUserStatistics(), []);

  // Function to calculate user statistics
  function calculateUserStatistics() {
    // Group candidates by responsible person
    const userStats = mockCandidates.reduce((stats, candidate) => {
      const responsiblePerson = candidate.responsiblePerson || 'Atanmamış';
      
      if (!stats[responsiblePerson]) {
        stats[responsiblePerson] = {
          userName: responsiblePerson,
          userRole: responsiblePerson === 'Ayşe Demir' ? 'İK Uzmanı' : 
                   (responsiblePerson === 'Mehmet Yılmaz' ? 'İK Yöneticisi' : 'Genel'),
          total: 0,
          candidates: [],
          stages: {},
          statuses: {},
          averageTimePerCandidate: 0,
          totalDays: 0,
          longestProcess: { stage: '', days: 0 },
          shortestProcess: { stage: '', days: Number.MAX_SAFE_INTEGER }
        };
      }
      
      // Increment total and add candidate to the list
      stats[responsiblePerson].total += 1;
      stats[responsiblePerson].candidates.push(candidate);
      
      // Calculate total days spent on candidates
      if (candidate.stageTimeline && candidate.stageTimeline.length > 0) {
        const firstStageDate = new Date(candidate.stageTimeline[0].date);
        const lastActivityDate = candidate.lastUpdatedAt;
        const daysDiff = Math.ceil((lastActivityDate.getTime() - firstStageDate.getTime()) / (1000 * 60 * 60 * 24));
        stats[responsiblePerson].totalDays += daysDiff > 0 ? daysDiff : 0;
        
        // Calculate process time for each stage
        if (candidate.stageTimeline.length > 1) {
          for (let i = 0; i < candidate.stageTimeline.length - 1; i++) {
            const currentStage = candidate.stageTimeline[i];
            const nextStage = candidate.stageTimeline[i + 1];
            
            if (currentStage.completedOn) {
              const stageDays = Math.ceil(
                (currentStage.completedOn.getTime() - currentStage.date.getTime()) / (1000 * 60 * 60 * 24)
              );
              
              if (stageDays > 0) {
                // Check if longest process
                if (stageDays > stats[responsiblePerson].longestProcess.days) {
                  stats[responsiblePerson].longestProcess = { 
                    stage: currentStage.stage, 
                    days: stageDays 
                  };
                }
                
                // Check if shortest process
                if (stageDays < stats[responsiblePerson].shortestProcess.days) {
                  stats[responsiblePerson].shortestProcess = { 
                    stage: currentStage.stage, 
                    days: stageDays 
                  };
                }
              }
            }
          }
        }
      }
      
      // Count stages and statuses
      if (!stats[responsiblePerson].stages[candidate.stage]) {
        stats[responsiblePerson].stages[candidate.stage] = 1;
      } else {
        stats[responsiblePerson].stages[candidate.stage] += 1;
      }
      
      if (!stats[responsiblePerson].statuses[candidate.status]) {
        stats[responsiblePerson].statuses[candidate.status] = 1;
      } else {
        stats[responsiblePerson].statuses[candidate.status] += 1;
      }
      
      return stats;
    }, {} as Record<string, any>);
    
    // Calculate average time per candidate for each user
    Object.keys(userStats).forEach(user => {
      const totalCandidates = userStats[user].candidates.length;
      const totalDays = userStats[user].totalDays;
      userStats[user].averageTimePerCandidate = totalCandidates > 0 
        ? Math.round(totalDays / totalCandidates * 10) / 10 
        : 0;
        
      // If no shortest process was found, use a default value
      if (userStats[user].shortestProcess.days === Number.MAX_SAFE_INTEGER) {
        userStats[user].shortestProcess = { stage: 'Veri Yok', days: 0 };
      }
    });
    
    return Object.values(userStats);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Kullanıcı Raporları</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userStatistics.map((user: any) => (
          <div key={user.userName} className="space-y-4">
            {/* Main user stat card */}
            <StatCard
              title={user.userName}
              description={user.userRole}
              value={user.total}
              icon={<User className="h-5 w-5 text-white" />}
              bgColor="bg-blue-500"
              textColor="text-white"
              subValue={`${user.averageTimePerCandidate} gün`}
              changeLabel="Ortalama Süre"
            />
            
            {/* New stat cards for process times */}
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                title="En Uzun Süreç"
                value={`${user.longestProcess.days} gün`}
                description={user.longestProcess.stage}
                icon={<Hourglass className="h-5 w-5" />}
              />
              
              <StatCard
                title="En Kısa Süreç"
                value={`${user.shortestProcess.days} gün`}
                description={user.shortestProcess.stage}
                icon={<Watch className="h-5 w-5" />}
              />
            </div>
            
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Aşamalar</h2>
              {Object.entries(user.stages).map(([stage, count]: [string, number]) => (
                <div key={stage} className="flex items-center justify-between py-1 border-b border-gray-200">
                  <span>{stage}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Durumlar</h2>
              {Object.entries(user.statuses).map(([status, count]: [string, number]) => (
                <div key={status} className="flex items-center justify-between py-1 border-b border-gray-200">
                  <span>{status}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReports;
