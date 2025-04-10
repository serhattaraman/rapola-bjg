import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  subValue?: string;
  change?: number;
  changeLabel?: string;
  tooltip?: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  bgColor = 'bg-white',
  textColor,
  subValue,
  change,
  changeLabel,
  tooltip,
  description
}) => {
  const bgColorClass = bgColor || 'bg-white';
  const textColorClass = textColor || 'text-gray-700';
  
  return (
    <Card className={`shadow-sm border border-gray-100 ${bgColorClass} animate-scale-in`}>
      <Card className="p-5 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-semibold ${textColorClass}`}>{title}</h3>
          {icon && <span className="text-gray-500">{icon}</span>}
        </div>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {subValue && <div className="text-sm text-gray-500">{subValue}</div>}
        {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
        {change && (
          <div className="flex items-center text-sm">
            <span className={change > 0 ? "text-green-600" : "text-red-600"}>
              {change > 0 ? "+" : ""}
              {change}%
            </span>
            <span className="text-gray-500 ml-1">{changeLabel}</span>
          </div>
        )}
      </Card>
    </Card>
  );
};

export default StatCard;
