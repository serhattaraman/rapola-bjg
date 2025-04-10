
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
  change?: number | { value: number; isPositive: boolean };
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
  
  // Handle change which can be either a simple number or an object with value and isPositive
  const renderChange = () => {
    if (!change) return null;
    
    let changeValue: number;
    let isPositive: boolean;
    
    if (typeof change === 'number') {
      changeValue = change;
      isPositive = change > 0;
    } else {
      changeValue = change.value;
      isPositive = change.isPositive;
    }
    
    return (
      <div className="flex items-center text-sm">
        <span className={isPositive ? "text-green-600" : "text-red-600"}>
          {isPositive ? "+" : ""}
          {changeValue}%
        </span>
        <span className="text-gray-500 ml-1">{changeLabel}</span>
      </div>
    );
  };
  
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
        {renderChange()}
      </Card>
    </Card>
  );
};

export default StatCard;
