
import React from 'react';
import { Link } from 'react-router-dom';
import { Candidate } from '@/lib/mock-data';
import StatusBadge from './StatusBadge';
import { formatDate } from '@/lib/mock-data';

interface CandidateCardProps {
  candidate: Candidate;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  return (
    <Link 
      to={`/candidate/${candidate.id}`}
      className="block group"
    >
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group-hover:border-primary/20">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              {candidate.firstName} {candidate.lastName}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{candidate.position}</p>
          </div>
          <StatusBadge status={candidate.status} />
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <span className="text-gray-500">Aşama:</span>
            <span className="ml-2 font-medium">{candidate.stage}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <span className="text-gray-500">Başvuru:</span>
            <span className="ml-2">{formatDate(candidate.appliedAt)}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {candidate.timeline.length} eylem
            </div>
            <div className="text-xs text-gray-500">
              {candidate.documents.length} belge
            </div>
            <div className="text-sm text-primary font-medium group-hover:translate-x-1 transition-transform">
              Detaylar →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CandidateCard;
