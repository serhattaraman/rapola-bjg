
import React from 'react';
import { Link } from 'react-router-dom';
import { Candidate } from '@/lib/mock-data';
import StatusBadge from './StatusBadge';
import { formatDate } from '@/lib/mock-data';
import { Phone, User, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import ProcessStageIcon from './ProcessStageIcon';

interface CandidateCardProps {
  candidate: Candidate;
}

// Progress stages - Moved out to make it easier to use in .NET MVC
export const progressStages = [
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

// Calculate progress - Helper function made standalone for easier portability
export const calculateProgress = (currentStage: string): number => {
  const currentStageIndex = progressStages.findIndex(stage => stage === currentStage);
  // If stage is not found in our predefined list, return 0
  if (currentStageIndex === -1) return 0;
  // Calculate percentage based on current stage index (adding 1 because arrays are 0-indexed)
  return Math.round(Math.max(0, Math.min(100, ((currentStageIndex + 1) / progressStages.length) * 100)));
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
  // Calculate progress percentage based on current stage
  const progressPercentage = calculateProgress(candidate.stage);
  // Find index of current stage in the progress stages array
  const currentStageIndex = progressStages.findIndex(stage => stage === candidate.stage);
  
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
              {candidate.firstName} {candidate.lastName}
            </h3>
            <p className="flex items-center text-sm text-gray-500 mt-1 candidate-details">
              <span className="candidate-position">{candidate.position}</span>
              <span className="mx-2 separator">•</span>
              <Phone className="w-3 h-3 mr-1 phone-icon" />
              <span className="candidate-phone">{candidate.phone || "05XXXXXXXXX"}</span>
            </p>
            
            {/* Display return date if in waiting mode */}
            {candidate.status === 'waiting' && candidate.returnDate && (
              <p className="flex items-center text-xs text-amber-700 mt-1">
                <Calendar className="w-3 h-3 mr-1" />
                <span>Dönüş Tarihi: {formatDate(candidate.returnDate)}</span>
              </p>
            )}
          </div>
          <StatusBadge 
            status={candidate.status} 
            returnDate={candidate.returnDate}
            showRemainingDays={true}
          />
        </div>
        
        <div className="mt-5 candidate-progress">
          <div className="flex justify-between items-center mb-2 progress-header">
            <div className="text-sm font-medium responsible-person">Sorumlu: <span className="text-primary">İK Uzmanı</span></div>
            <div className="text-sm text-primary flex items-center current-stage">
              <ProcessStageIcon stage={candidate.stage} className="mr-1 text-primary" size={14} />
              <span className="current-stage-text">{candidate.stage}</span>
            </div>
          </div>
          
          {/* Progress bar for .NET MVC - Sample code */}
          {/* 
          <div class="progress-bar">
            <div class="progress-value" style="width: @Model.ProgressPercentage%"></div>
          </div>
          */}
          
          {/* React version of the progress bar */}
          <Progress value={progressPercentage} className="h-2 mb-2 candidate-progress-bar" />
          
          <div className="grid grid-cols-9 gap-1 mt-3 progress-stages">
            {progressStages.map((stage, index) => {
              // A stage is completed if its index is less than or equal to the current stage index
              const isCompleted = index <= currentStageIndex;
              // A stage is current if its index matches the current stage index
              const isCurrent = index === currentStageIndex;
              return (
                <div key={index} className={`flex flex-col items-center stage-item stage-${index + 1} ${
                  isCurrent ? 'current' : isCompleted ? 'completed' : 'pending'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs mb-1 stage-icon
                    ${isCurrent ? 'bg-primary text-white current' : 
                      isCompleted ? 'bg-primary/20 text-primary completed' : 'bg-gray-100 text-gray-400 pending'}`}>
                    <ProcessStageIcon stage={progressStages[index]} size={14} />
                  </div>
                  <span className={`text-[9px] text-center leading-tight stage-label ${isCurrent ? 'text-primary font-medium current' : 
                    isCompleted ? 'text-gray-700 completed' : 'text-gray-400 pending'}`}>
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CandidateCard;
