
import React from 'react';
import { CandidateStatus } from '@/lib/mock-data';

interface StatusBadgeProps {
  status: CandidateStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
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

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass} ${className}`}>
      {badgeText}
    </span>
  );
};

export default StatusBadge;
