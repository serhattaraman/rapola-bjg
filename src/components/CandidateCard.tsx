import React from 'react';
import { Link } from 'react-router-dom';
import { Candidate, formatDate, calculateDurationInDays, formatDuration } from '@/lib/mock-data';
import StatusBadge from './StatusBadge';
import { Phone, User, Calendar, CheckCircle, AlertCircle, Clock, XCircle, Users, ArrowDown, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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
    responsiblePerson?: string;
    stageTimeline?: any[];
    group?: string;
  };
}

// Progress stages with sub-processes
export const progressStages = [
  "Başvuru Alındı", 
  "Telefon Görüşmesi", 
  "Zoom Daveti",
  "İK Görüşmesi", 
  "Evrak Toplama", 
  "Sisteme Evrak Girişi", 
  "Sınıf Yerleştirme", 
  "Denklik Süreci", 
  "Vize Süreci", 
  "Sertifika Süreci"
];

// Sub-processes for each main stage
export const stageSubProcesses: { [key: string]: string[] } = {
  "Zoom Daveti": ["Zooma Katıldı", "Zoom Sonucu Değerlendirme"],
  "İK Görüşmesi": ["Mülakat Tamamlandı", "Değerlendirme"],
  "Evrak Toplama": ["Belgeler Toplandı", "Kontrol Edildi"],
  "Vize Süreci": ["Başvuru Yapıldı", "Sonuç Bekleniyor"]
};

// Calculate progress - Helper function made standalone for easier portability
export const calculateProgress = (currentStage: string): number => {
  const currentStageIndex = progressStages.findIndex(stage => stage === currentStage);
  // If stage is not found in our predefined list, return 0
  if (currentStageIndex === -1) return 0;
  // Calculate percentage based on current stage index (adding 1 because arrays are 0-indexed)
  return Math.round(Math.max(0, Math.min(100, ((currentStageIndex + 1) / progressStages.length) * 100)));
};

// Helper function to find a stage in the timeline
const findStageInTimeline = (stageTimeline: any[], stageName: string) => {
  if (!stageTimeline) return null;
  return stageTimeline.find(item => item.stage === stageName);
};

/*
.NET MVC için Razor view ve model sınıfları:

@model CandidateCardViewModel

<a href="@Url.Action("Details", "Candidate", new { id = Model.Id })" class="candidate-card">
  <div class="candidate-card-inner">
    <div class="candidate-card-header">
      <div class="candidate-info">
        <h3 class="candidate-name">
          <i class="candidate-icon icon-user"></i>
          @Model.FirstName @Model.LastName
        </h3>
        <p class="candidate-details">
          <span class="candidate-position">@Model.Position</span>
          <span class="separator">•</span>
          <i class="phone-icon icon-phone"></i>
          <span class="candidate-phone">@(string.IsNullOrEmpty(Model.Phone) ? "05XXXXXXXXX" : Model.Phone)</span>
        </p>
      </div>
      <partial name="_StatusBadge" model="new StatusBadgeViewModel { StatusKey = Model.Status, CandidateId = Model.Id }" />
    </div>
    
    <div class="candidate-progress">
      <div class="progress-header">
        <div class="responsible-person">Sorumlu: <span>İK Uzmanı</span></div>
        <div class="current-stage">
          <i class="stage-icon-@Model.StageKey"></i>
          <span class="current-stage-text">@Model.Stage</span>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-value" style="width: @Model.ProgressPercentage%"></div>
      </div>
      
      <div class="progress-stages">
        @for (int i = 0; i < Model.AllStages.Count(); i++)
        {
          var stage = Model.AllStages.ElementAt(i);
          var stageKey = stage.Replace(" ", "").ToLowerInvariant();
          var isCompleted = i <= Model.CurrentStageIndex;
          var isCurrent = i == Model.CurrentStageIndex;
          var stateClass = isCurrent ? "current" : (isCompleted ? "completed" : "pending");
          
          <div class="stage-item stage-@(i+1) @stateClass">
            <div class="stage-icon @stateClass">
              <i class="icon-@stageKey"></i>
            </div>
            <span class="stage-label @stateClass">@stage</span>
          </div>
        }
      </div>
    </div>
  </div>
</a>


public class CandidateCardViewModel
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Position { get; set; }
    public string Phone { get; set; }
    public string Status { get; set; }
    public string Stage { get; set; }
    public string StageKey => Stage.Replace(" ", "").ToLowerInvariant();
    public int ProgressPercentage => CalculateProgress(Stage);
    public int CurrentStageIndex => Array.FindIndex(AllStages.ToArray(), s => s == Stage);
    public IEnumerable<string> AllStages { get; set; } = new List<string> {
        "Başvuru Alındı", "Telefon Görüşmesi", "İK Görüşmesi", "Evrak Toplama", 
        "Sisteme Evrak Girişi", "Sınıf Yerleştirme", "Denklik Süreci", 
        "Vize Süreci", "Sertifika Süreci"
    };
    
    private int CalculateProgress(string currentStage)
    {
        int currentStageIndex = Array.FindIndex(AllStages.ToArray(), s => s == currentStage);
        return Math.Max(0, Math.Min(100, ((currentStageIndex + 1) / (double)AllStages.Count()) * 100));
    }
}
*/

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  // Get the candidate's name
  const candidateName = candidate.name || 
    (candidate.firstName && candidate.lastName ? 
      `${candidate.firstName} ${candidate.lastName}` : 'İsimsiz Aday');

  // Calculate progress percentage based on current stage
  const progressPercentage = candidate.stage ? calculateProgress(candidate.stage) : 0;
  // Find index of current stage in the progress stages array
  const currentStageIndex = candidate.stage ? progressStages.findIndex(stage => stage === candidate.stage) : -1;
  
  // Check if candidate is in class placement stage
  const isInClassPlacementStage = candidate.stage === "Sınıf Yerleştirme";
  
  return (
    <Link 
      to={`/candidate/${candidate.id}`}
      className="block candidate-card"
    >
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 candidate-card-inner">
        <div className="flex justify-between items-start mb-2 candidate-card-header">
          <div className="candidate-info">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center candidate-name">
              <User className="h-4 w-4 text-primary mr-2 candidate-icon" />
              {candidateName}
            </h3>
            <p className="flex items-center text-sm text-gray-500 mt-1 candidate-details">
              <span className="candidate-position">{candidate.position}</span>
              <span className="mx-2 separator">•</span>
              <Phone className="w-3 h-3 mr-1 phone-icon" />
              <span className="candidate-phone">{candidate.phone || "05XXXXXXXXX"}</span>
            </p>
            
            {/* Display group information if available */}
            {candidate.group && (
              <p className="flex items-center text-xs text-blue-600 mt-1">
                <Users className="w-3 h-3 mr-1" />
                <span>Grup: {candidate.group}</span>
              </p>
            )}
            
            {/* Display return date if in waiting mode */}
            {candidate.status === 'waiting' && candidate.returnDate && (
              <p className="flex items-center text-xs text-amber-700 mt-1">
                <Calendar className="w-3 h-3 mr-1" />
                <span>Dönüş Tarihi: {formatDate(candidate.returnDate)}</span>
              </p>
            )}
            
            {/* Display rejection reason if candidate is rejected */}
            {candidate.status === 'rejected' && candidate.rejectionReason && (
              <p className="flex items-center text-xs text-red-600 mt-1">
                <XCircle className="w-3 h-3 mr-1" />
                <span>Red Nedeni: {candidate.rejectionReason}</span>
              </p>
            )}
            
            {/* Display class confirmation status if in class placement stage */}
            {isInClassPlacementStage && (
              <p className="flex items-center text-xs mt-1">
                {candidate.classConfirmation === 'confirmed' ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Sınıf Onaylandı
                  </span>
                ) : (
                  <span className="flex items-center text-amber-600">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Sınıf Onayı Bekliyor
                  </span>
                )}
              </p>
            )}
          </div>
          <StatusBadge 
            status={candidate.status} 
            returnDate={candidate.returnDate}
            showRemainingDays={true}
          />
        </div>
        
        {/* Only show progress if we have stage information */}
        {candidate.stage && (
          <div className="mt-5 candidate-progress">
            <div className="flex justify-between items-center mb-2 progress-header">
              <div className="text-sm font-medium responsible-person">Sorumlu: <span className="text-primary">{candidate.responsiblePerson || 'İK Uzmanı'}</span></div>
              <div className="text-sm text-primary flex items-center current-stage">
                <ProcessStageIcon stage={candidate.stage} className="mr-1 text-primary" size={14} />
                <span className="current-stage-text">{candidate.stage}</span>
                
                {/* Display current stage date */}
                {candidate.stageTimeline && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({formatDate(findStageInTimeline(candidate.stageTimeline, candidate.stage)?.date)})
                  </span>
                )}
              </div>
            </div>
            
            {/* Progress bar with percentage */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">İlerleme</span>
                <span className="text-sm font-semibold text-primary">%{progressPercentage}</span>
              </div>
              <Progress value={progressPercentage} className="h-2 candidate-progress-bar" />
            </div>
            
            <div className="grid grid-cols-10 gap-1 mt-3 progress-stages">
              {progressStages.map((stage, index) => {
                // A stage is completed if its index is less than or equal to the current stage index
                const isCompleted = index <= currentStageIndex;
                // A stage is current if its index matches the current stage index
                const isCurrent = index === currentStageIndex;
                
                // Get stage information from timeline
                const stageInfo = candidate.stageTimeline ? findStageInTimeline(candidate.stageTimeline, stage) : null;
                const stageDate = stageInfo?.date;
                const stageCompletionDate = stageInfo?.completedOn;
                let stageDuration = 0;
                
                // Calculate duration if we have both start and completion dates
                if (stageDate && stageCompletionDate) {
                  stageDuration = calculateDurationInDays(stageDate, stageCompletionDate);
                } else if (stageDate && isCurrent) {
                  // For current stage, calculate duration from start date to now
                  stageDuration = calculateDurationInDays(stageDate, new Date());
                }
                
                // Check if this stage has sub-processes
                const subProcesses = stageSubProcesses[stage] || [];
                const hasSubProcesses = subProcesses.length > 0;
                
                // Tooltip content for stage date and duration info
                const tooltipContent = stageInfo ? (
                  <div className="text-xs">
                    <div><strong>Başlangıç:</strong> {formatDate(stageInfo.date)}</div>
                    {stageInfo.completedOn && (
                      <div><strong>Bitiş:</strong> {formatDate(stageInfo.completedOn)}</div>
                    )}
                    {stageDuration > 0 && (
                      <div><strong>Süre:</strong> {formatDuration(stageDuration)}</div>
                    )}
                  </div>
                ) : null;
                
                return (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`flex flex-col items-center relative stage-item stage-${index + 1} ${
                          isCurrent ? 'current' : isCompleted ? 'completed' : 'pending'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs mb-1 stage-icon relative
                            ${isCurrent ? 'bg-primary text-white current' : 
                              isCompleted ? 'bg-primary/20 text-primary completed' : 'bg-gray-100 text-gray-400 pending'}`}>
                            <ProcessStageIcon stage={progressStages[index]} size={14} />
                            {hasSubProcesses && (
                              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full text-[8px] flex items-center justify-center ${
                                isCompleted ? 'bg-green-500 text-white' : isCurrent ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-600'
                              }`}>
                                {subProcesses.length}
                              </div>
                            )}
                          </div>
                          <span className={`text-[9px] text-center leading-tight stage-label ${isCurrent ? 'text-primary font-medium current' : 
                            isCompleted ? 'text-gray-700 completed' : 'text-gray-400 pending'}`}>
                            {stage}
                          </span>
                          
                          {/* Sub-processes for this stage */}
                          {stageSubProcesses[stage] && (
                            <div className="mt-1 space-y-0.5 relative">
                              {stageSubProcesses[stage].map((subProcess, subIndex) => {
                                const isSubProcessCompleted = isCompleted || (isCurrent && subIndex === 0);
                                const isLastSubProcess = subIndex === stageSubProcesses[stage].length - 1;
                                
                                return (
                                  <div key={subIndex} className="relative flex items-center justify-center">
                                    {/* Vertical line - show for all except last if completed, or show for current process */}
                                    {(!isLastSubProcess || isSubProcessCompleted) && (
                                      <div className={`absolute left-1/2 top-2 w-px h-4 transform -translate-x-1/2 ${
                                        isSubProcessCompleted ? 'bg-primary' : 'bg-gray-300'
                                      }`}></div>
                                    )}
                                    
                                    {/* Sub-process text with indicator */}
                                    <div className="flex items-center">
                                      {/* Status indicator */}
                                      <div className={`w-2 h-2 rounded-full mr-1 ${
                                        isSubProcessCompleted ? 'bg-primary' : 'bg-gray-300'
                                      }`}></div>
                                      
                                      <div className={`text-[7px] text-center leading-tight ${
                                        isCurrent ? 'text-primary/70' : isCompleted ? 'text-gray-500' : 'text-gray-300'
                                      }`}>
                                        {subProcess}
                                      </div>
                                      
                                      {/* Arrow or check indicator */}
                                      {isSubProcessCompleted ? (
                                        <Check className="w-2 h-2 ml-1 text-primary" />
                                      ) : isCurrent && subIndex === 0 ? (
                                        <ArrowDown className="w-2 h-2 ml-1 text-yellow-500" />
                                      ) : null}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {stageInfo && (
                            <span className={`text-[7px] mt-1 flex items-center ${
                              isCurrent ? 'text-primary' : isCompleted ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              <Clock className="w-2 h-2 mr-0.5" />
                              {stageDuration > 0 ? `${stageDuration} gün` : "Bugün"}
                            </span>
                          )}
                        </div>
                      </TooltipTrigger>
                      {tooltipContent && (
                        <TooltipContent>
                          {tooltipContent}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CandidateCard;
