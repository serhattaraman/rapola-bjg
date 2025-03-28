
import React from 'react';
import { CandidateStatus, getDaysRemaining } from '@/lib/mock-data';
import { Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: CandidateStatus;
  className?: string;
  returnDate?: Date;
  showRemainingDays?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className, 
  returnDate,
  showRemainingDays = false
}) => {
  let badgeText: string;
  let badgeClass: string;

  switch (status) {
    case 'pending':
      badgeText = 'Beklemede';
      badgeClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'inProgress':
      badgeText = 'İşlemde';
      badgeClass = 'bg-blue-100 text-blue-800';
      break;
    case 'completed':
      badgeText = 'Tamamlandı';
      badgeClass = 'bg-green-100 text-green-800';
      break;
    case 'rejected':
      badgeText = 'Reddedildi';
      badgeClass = 'bg-red-100 text-red-800';
      break;
    case 'waiting':
      badgeText = 'Bekleme Modu';
      badgeClass = 'bg-amber-100 text-amber-800';
      break;
    default:
      badgeText = 'Bilinmiyor';
      badgeClass = 'bg-gray-100 text-gray-800';
      break;
  }

  // If in waiting mode and we should show remaining days
  if (status === 'waiting' && showRemainingDays && returnDate) {
    const daysRemaining = getDaysRemaining(returnDate);
    
    return (
      <div className="flex flex-col">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass} ${className}`}>
          {badgeText}
        </span>
        <span className="flex items-center text-xs mt-1 text-amber-700">
          <Clock className="h-3 w-3 mr-1" />
          {daysRemaining > 0 
            ? `${daysRemaining} gün kaldı` 
            : "Dönüş zamanı geldi"}
        </span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass} ${className}`}>
      {badgeText}
    </span>
  );
};

export default StatusBadge;
