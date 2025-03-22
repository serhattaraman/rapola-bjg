
import React from 'react';
import { Link } from 'react-router-dom';
import { Candidate } from '@/lib/mock-data';
import StatusBadge from './StatusBadge';
import { formatDate } from '@/lib/mock-data';
import { Phone } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  // Calculate progress based on the candidate's stage (simplified version)
  const progressStages = ["Başvuru Alındı", "Telefon Görüşmesi", "İK Görüşmesi", "Evrak Toplama", 
                          "Sisteme Evrak Girişi", "Sınıf Yerleştirme", "Denklik Süreci", "Vize Süreci", "Sertifika Süreci"];
  
  const currentStageIndex = progressStages.findIndex(stage => stage === candidate.stage);
  const progressPercentage = Math.max(0, Math.min(100, ((currentStageIndex + 1) / progressStages.length) * 100));
  
  return (
    <Link 
      to={`/candidate/${candidate.id}`}
      className="block"
    >
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {candidate.firstName} {candidate.lastName}
            </h3>
            <p className="flex items-center text-sm text-gray-500 mt-1">
              {candidate.position}
              <span className="mx-2">•</span>
              <Phone className="w-3 h-3 mr-1" />
              {candidate.phone || "05XXXXXXXXX"}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <StatusBadge status={candidate.status} />
          <button className="px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
            Detaylar
          </button>
        </div>
        
        <div className="mt-5">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">Sorumlu: <span className="text-primary">İK Uzmanı</span></div>
            <div className="text-sm text-primary">İK Görüşmesi</div>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="grid grid-cols-9 gap-1 mt-3">
            {progressStages.map((stage, index) => {
              const isCompleted = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs mb-1
                    ${isCurrent ? 'bg-primary text-white' : 
                      isCompleted ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                    {index + 1}
                  </div>
                  <span className={`text-[9px] text-center leading-tight ${isCurrent ? 'text-primary font-medium' : 
                    isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
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
