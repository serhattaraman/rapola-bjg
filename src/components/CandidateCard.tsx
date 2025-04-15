import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Phone, User } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate } from '@/lib/mock-data';
import { findCandidateById } from '@/utils/candidate-helpers';
import ProcessStageIcon from './ProcessStageIcon';

interface CandidateCardProps {
  candidate: {
    id: string | number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    location?: string;
    appliedAt: Date | string;
    status: string;
    stage: string;
    responsiblePerson?: string;
    examResults?: Array<{
      level: string;
      score?: number;
      passed: boolean;
      date?: Date | string;
    }>;
  };
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  // Ensure the candidate exists in our mock data
  const validCandidate = findCandidateById(candidate.id) || candidate;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">
            {validCandidate.firstName} {validCandidate.lastName}
          </h3>
          <StatusBadge status={validCandidate.status} />
        </div>
        
        <p className="text-gray-600 mb-4">{validCandidate.position}</p>
        
        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>{validCandidate.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            <span>{validCandidate.phone}</span>
          </div>
          {validCandidate.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{validCandidate.location}</span>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Başvuru: {formatDate(validCandidate.appliedAt)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-primary">
            <ProcessStageIcon stage={validCandidate.stage} className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">{validCandidate.stage}</span>
          </div>
          {validCandidate.responsiblePerson && (
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>{validCandidate.responsiblePerson}</span>
            </div>
          )}
        </div>
        
        {/* Exam results summary */}
        {validCandidate.examResults && validCandidate.examResults.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {validCandidate.examResults.map((exam, index) => (
                <span 
                  key={index}
                  className={`text-xs px-2 py-1 rounded-full ${
                    exam.passed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {exam.level} {exam.score !== undefined && `(${exam.score}%)`}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <Link 
          to={`/candidate/${validCandidate.id}`} 
          className="block w-full text-center py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors"
        >
          Detayları Görüntüle
        </Link>
      </div>
    </div>
  );
};

export default CandidateCard;
