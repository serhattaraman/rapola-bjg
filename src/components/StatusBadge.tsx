import React from 'react';
import { cn } from '@/lib/utils';
import { CandidateStatus } from '@/lib/mock-data';
import { getStatusLabel } from '@/lib/mock-data';

interface StatusBadgeProps {
  status: CandidateStatus;
  className?: string;
}

// Bu nesneler .NET MVC'de C# sınıflarına kolaylıkla dönüştürülebilir
export const statusClasses = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 status-pending',
  inProgress: 'bg-blue-100 text-blue-800 border-blue-200 status-inProgress',
  completed: 'bg-green-100 text-green-800 border-green-200 status-completed',
  rejected: 'bg-red-100 text-red-800 border-red-200 status-rejected',
  default: 'bg-gray-100 text-gray-800 border-gray-200 status-default',
};

export const statusButtonClasses = {
  pending: 'bg-yellow-500 text-white status-pending-button',
  inProgress: 'bg-blue-500 text-white status-inProgress-button',
  completed: 'bg-green-500 text-white status-completed-button',
  rejected: 'bg-red-500 text-white status-rejected-button',
  default: 'bg-gray-500 text-white status-default-button',
};

// .NET MVC'de kullanılabilecek statü etiketleri
export const statusLocalizedLabels = {
  pending: 'Beklet',
  inProgress: 'İşlemde',
  completed: 'Onayla',
  rejected: 'Reddet',
  default: 'Durum',
};

// StatusBadge component - .NET MVC'de Partial View olarak kullanılabilir
const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'pending':
        return statusClasses.pending;
      case 'inProgress':
        return statusClasses.inProgress;
      case 'completed':
        return statusClasses.completed;
      case 'rejected':
        return statusClasses.rejected;
      default:
        return statusClasses.default;
    }
  };
  
  const getButtonStyles = () => {
    switch (status) {
      case 'pending':
        return statusButtonClasses.pending;
      case 'inProgress':
        return statusButtonClasses.inProgress;
      case 'completed':
        return statusButtonClasses.completed;
      case 'rejected':
        return statusButtonClasses.rejected;
      default:
        return statusButtonClasses.default;
    }
  };
  
  // For the detailed design, let's apply different styles based on status
  if (status === 'rejected') {
    return (
      <span 
        className={cn(
          'inline-flex items-center px-4 py-1 rounded-full text-sm font-medium status-badge status-badge-rejected',
          getButtonStyles(),
          className
        )}
      >
        {statusLocalizedLabels.rejected}
        {/* .NET MVC'de: <span class="status-badge status-badge-rejected @Model.StatusClassName">@Model.StatusLabel</span> */}
      </span>
    );
  }
  
  if (status === 'completed') {
    return (
      <span 
        className={cn(
          'inline-flex items-center px-4 py-1 rounded-full text-sm font-medium status-badge status-badge-completed',
          getButtonStyles(),
          className
        )}
      >
        {statusLocalizedLabels.completed}
        {/* .NET MVC'de form-post için button olarak kullanılabilir:
          <form method="post" action="@Url.Action("ChangeStatus", "Candidate")">
            <input type="hidden" name="candidateId" value="@Model.Id" />
            <input type="hidden" name="newStatus" value="completed" />
            <button type="submit" class="status-badge status-badge-completed">@StatusLocalizer.Completed</button>
          </form>
        */}
      </span>
    );
  }
  
  if (status === 'pending') {
    return (
      <span 
        className={cn(
          'inline-flex items-center px-4 py-1 rounded-full text-sm font-medium status-badge status-badge-pending',
          getButtonStyles(),
          className
        )}
      >
        {statusLocalizedLabels.pending}
      </span>
    );
  }
  
  // Default badge for other statuses
  return (
    <span 
      className={cn(
        'inline-flex items-center px-4 py-1 rounded-full text-sm font-medium border status-badge status-badge-default',
        getStatusStyles(),
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
