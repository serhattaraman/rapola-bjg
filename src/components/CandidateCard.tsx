
import React from 'react';
import { Link } from 'react-router-dom';
import { Candidate } from '@/lib/mock-data';
import StatusBadge from './StatusBadge';
import { formatDate } from '@/lib/mock-data';
import { Phone, User } from 'lucide-react';
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
  return Math.max(0, Math.min(100, ((currentStageIndex + 1) / progressStages.length) * 100));
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const progressPercentage = calculateProgress(candidate.stage);
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
              <User className="h-4 w-4 text-primary mr-2" />
              {candidate.firstName} {candidate.lastName}
            </h3>
            <p className="flex items-center text-sm text-gray-500 mt-1 candidate-details">
              {candidate.position}
              <span className="mx-2 separator">•</span>
              <Phone className="w-3 h-3 mr-1" />
              {candidate.phone || "05XXXXXXXXX"}
            </p>
          </div>
          <StatusBadge status={candidate.status} />
        </div>
        
        <div className="mt-5 candidate-progress">
          <div className="flex justify-between items-center mb-2 progress-header">
            <div className="text-sm font-medium responsible-person">Sorumlu: <span className="text-primary">İK Uzmanı</span></div>
            <div className="text-sm text-primary flex items-center current-stage">
              <ProcessStageIcon stage={candidate.stage} className="mr-1 text-primary" size={14} />
              {candidate.stage}
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2 candidate-progress-bar" />
          
          <div className="grid grid-cols-9 gap-1 mt-3 progress-stages">
            {progressStages.map((stage, index) => {
              const isCompleted = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;
              return (
                <div key={index} className="flex flex-col items-center stage-item">
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
