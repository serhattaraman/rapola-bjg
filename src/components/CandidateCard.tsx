import React from 'react';
import { Link } from 'react-router-dom';
import { Candidate, formatDate, CandidateProcessProgress, ProcessStatus, JobPlacement } from '@/lib/mock-data';
import { getProcessStagesFromStorage } from '@/lib/process-data';
import StatusBadge from './StatusBadge';
import { Phone, User, Calendar, Building2, MapPin } from 'lucide-react';
import ProcessStageIcon from './ProcessStageIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CandidateCardProps {
  candidate: {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    position: string;
    phone?: string;
    appliedAt: Date | string;
    status: 'pending' | 'inProgress' | 'completed' | 'rejected' | 'waiting';
    stage?: string;
    processDays?: number;
    returnDate?: Date | string;
    rejectionReason?: string;
    classConfirmation?: 'pending' | 'confirmed';
    stageTimeline?: any[];
    group?: string;
    processProgress?: CandidateProcessProgress[];
    jobPlacements?: JobPlacement[];
  };
}

const getProcessStatusColor = (status: ProcessStatus): string => {
  switch (status) {
    case 'notStarted':
      return 'bg-gray-300 text-gray-700';
    case 'inProgress':
      return 'bg-yellow-500 text-white';
    case 'blocked':
      return 'bg-red-500 text-white';
    case 'completed':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-300 text-gray-700';
  }
};

const CandidateCard = ({ candidate }: CandidateCardProps) => {
  const candidateName = candidate.name || `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim();
  const processStages = getProcessStagesFromStorage();
  
  // Calculate process start and end dates with duration
  const getProcessDuration = () => {
    // Start date is the application date
    const startDate = new Date(candidate.appliedAt);
    
    // End date calculation based on status
    let endDate: Date | null = null;
    let totalDays = 0;
    
    if (candidate.status === 'completed') {
      // For completed candidates, end date is when they completed the process
      // In a real app, this would come from the timeline or final stage completion
      endDate = new Date(startDate.getTime() + (Math.random() * 90 + 30) * 24 * 60 * 60 * 1000); // 30-120 days
    } else if (candidate.status === 'rejected') {
      // For rejected candidates, end date is when they were rejected
      endDate = new Date(startDate.getTime() + (Math.random() * 60 + 10) * 24 * 60 * 60 * 1000); // 10-70 days
    } else {
      // For active candidates, calculate days from start until now
      endDate = new Date();
    }
    
    if (endDate) {
      totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    
    return {
      startDate,
      endDate,
      totalDays
    };
  };
  
  const processDuration = getProcessDuration();
  
  // Mock process progress - in real app this would come from candidate data
  const mockProcessProgress: CandidateProcessProgress[] = processStages.map((stage, index) => {
    const isCurrentStage = candidate.stage === stage.name;
    const isCompletedStage = processStages.findIndex(s => s.name === candidate.stage) > index;
    
    let status: ProcessStatus = 'notStarted';
    let completedSubProcesses: string[] = [];
    
    if (isCompletedStage) {
      status = 'completed';
      completedSubProcesses = stage.subProcesses.map(sp => sp.id);
    } else if (isCurrentStage) {
      if (candidate.status === 'rejected') {
        status = 'blocked';
      } else {
        status = 'inProgress';
        // Simulate some completed sub-processes
        completedSubProcesses = stage.subProcesses.slice(0, Math.floor(stage.subProcesses.length / 2)).map(sp => sp.id);
      }
    }

    return {
      stageId: stage.id,
      status,
      completedSubProcesses,
      subProcessProgress: [], // Add empty array for sub-process progress
      startDate: isCurrentStage || isCompletedStage ? new Date() : undefined,
      completedDate: isCompletedStage ? new Date() : undefined,
      canStart: true
    };
  });

  return (
    <TooltipProvider>
      <Link to={`/candidate/${candidate.id}`} className="block">
        <div className="bg-card text-card-foreground p-6 rounded-lg border hover:shadow-md transition-shadow cursor-pointer">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">{candidateName}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{candidate.position}</span>
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(candidate.appliedAt)}</span>
                </div>
              </div>
              {/* Process Duration Info */}
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Başlama: {formatDate(processDuration.startDate)}</span>
                  {candidate.status === 'completed' || candidate.status === 'rejected' ? (
                    <>
                      <span>Bitiş: {formatDate(processDuration.endDate!)}</span>
                      <span className="font-medium text-primary">
                        Süre: {processDuration.totalDays} gün
                      </span>
                    </>
                  ) : (
                    <span className="font-medium text-orange-600 dark:text-orange-400">
                      Devam ediyor: {processDuration.totalDays} gün
                    </span>
                  )}
                </div>
              </div>
              {candidate.group && (
                <div className="text-sm text-muted-foreground mb-2">
                  Grup: {candidate.group}
                </div>
              )}
            </div>
            <StatusBadge 
              status={candidate.status} 
              returnDate={candidate.returnDate}
              showRemainingDays={candidate.status === 'waiting'}
            />
          </div>

          {/* Process Stages */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {processStages.map((stage, stageIndex) => {
                const progress = mockProcessProgress.find(p => p.stageId === stage.id);
                const completedCount = progress?.completedSubProcesses.length || 0;
                const totalCount = stage.subProcesses.length;
                
                return (
                  <Tooltip key={stage.id}>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center gap-1">
                        {/* Stage Icon */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium relative ${
                          getProcessStatusColor(progress?.status || 'notStarted')
                        }`}>
                          <ProcessStageIcon stage={stage.name} size={16} />
                          
                          {/* Sub-process count badge */}
                          {totalCount > 0 && (
                            <div className="absolute -top-1 -right-1 bg-white border border-gray-300 text-gray-700 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {completedCount}/{totalCount}
                            </div>
                          )}
                        </div>
                        
                        {/* Stage Name */}
                        <div className="text-xs text-center max-w-20 leading-tight">
                          {stage.name}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-center">
                        <div className="font-medium">{stage.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {completedCount}/{totalCount} tamamlandı
                        </div>
                        {stage.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {stage.description}
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Additional Information */}
          {candidate.status === 'rejected' && candidate.rejectionReason && (
            <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-700 dark:text-red-300">
                Ret Nedeni: {candidate.rejectionReason}
              </p>
            </div>
          )}

          {candidate.status === 'waiting' && candidate.returnDate && (
            <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Dönüş Tarihi: {formatDate(candidate.returnDate)}
              </p>
            </div>
          )}

          {candidate.stage === 'Sınıf Yerleştirme' && candidate.classConfirmation && (
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Sınıf Onayı: {candidate.classConfirmation === 'confirmed' ? 'Onaylandı' : 'Beklemede'}
              </p>
            </div>
          )}

          {/* Job Placement Information */}
          {candidate.status === 'completed' && candidate.jobPlacements && candidate.jobPlacements.length > 0 && (
            <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              {candidate.jobPlacements.filter(job => job.isActive).map((job) => (
                <div key={job.id} className="text-sm text-green-700 dark:text-green-300">
                  <div className="flex items-center gap-1 mb-1">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{job.companyName}</span>
                    <span>• {job.position}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <MapPin className="h-3 w-3" />
                    <span>{job.companyAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Link>
    </TooltipProvider>
  );
};

export default CandidateCard;