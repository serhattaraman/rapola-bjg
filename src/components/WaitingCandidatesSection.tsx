
import React from 'react';
import { Candidate, formatDate, getDaysRemaining } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WaitingCandidatesSectionProps {
  candidates: Candidate[];
}

const WaitingCandidatesSection: React.FC<WaitingCandidatesSectionProps> = ({ candidates }) => {
  const waitingCandidates = candidates.filter(candidate => candidate.status === 'waiting');
  
  if (waitingCandidates.length === 0) {
    return null;
  }
  
  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center text-amber-800">
          <Clock className="h-5 w-5 mr-2 text-amber-600" />
          Bekleme Modunda Adaylar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {waitingCandidates.map(candidate => {
            const daysRemaining = getDaysRemaining(candidate.returnDate);
            
            return (
              <Link 
                key={candidate.id} 
                to={`/candidate/${candidate.id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100 hover:shadow-sm transition-all">
                  <div className="flex items-center">
                    <User className="h-10 w-10 p-2 bg-amber-100 text-amber-800 rounded-full mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {candidate.firstName} {candidate.lastName}
                      </h4>
                      <p className="text-sm text-gray-500">{candidate.stage}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center text-sm text-amber-700">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Dönüş: {candidate.returnDate ? formatDate(candidate.returnDate) : 'Belirlenmedi'}</span>
                    </div>
                    
                    <div className="flex items-center text-xs mt-1 font-medium">
                      <Clock className="h-3 w-3 mr-1" />
                      {daysRemaining > 0 
                        ? <span className="text-amber-700">{daysRemaining} gün kaldı</span>
                        : <span className="text-red-600">Dönüş zamanı geldi</span>
                      }
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WaitingCandidatesSection;
