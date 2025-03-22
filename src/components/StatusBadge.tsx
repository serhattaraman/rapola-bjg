
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
  
  const getButtonStyles = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'inProgress':
        return 'bg-blue-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // For the detailed design, let's apply different styles based on status
  if (status === 'rejected') {
    return (
      <span 
        className={cn(
          'inline-flex items-center px-4 py-1 rounded-full text-sm font-medium',
          getButtonStyles(),
          className
        )}
      >
        Reddet
      </span>
    );
  }
  
  if (status === 'completed') {
    return (
      <span 
        className={cn(
          'inline-flex items-center px-4 py-1 rounded-full text-sm font-medium',
          getButtonStyles(),
          className
        )}
      >
        Onayla
      </span>
    );
  }
  
  if (status === 'pending') {
    return (
      <span 
        className={cn(
          'inline-flex items-center px-4 py-1 rounded-full text-sm font-medium',
          getButtonStyles(),
          className
        )}
      >
        Beklet
      </span>
    );
  }
  
  // Default badge for other statuses
  return (
    <span 
      className={cn(
        'inline-flex items-center px-4 py-1 rounded-full text-sm font-medium border',
        getStatusStyles(),
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
