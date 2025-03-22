
import React from 'react';
import { cn } from '@/lib/utils';
import { CandidateStatus } from '@/lib/mock-data';
import { getStatusLabel } from '@/lib/mock-data';

interface StatusBadgeProps {
  status: CandidateStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inProgress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
        getStatusStyles(),
        className
      )}
    >
      <span className={`w-2 h-2 rounded-full mr-2 bg-${status === 'pending' ? 'yellow' : status === 'inProgress' ? 'blue' : status === 'completed' ? 'green' : 'red'}-500`}></span>
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
