
import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  subValue?: string; // Added subValue property
  description?: string; // Added description property
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  className,
  subValue,
  description,
}) => {
  return (
    <div
      className={cn(
        "bg-white p-6 rounded-lg shadow-sm border border-gray-100",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {subValue && (
          <p className="ml-2 text-sm font-medium text-gray-600">{subValue}</p>
        )}
      </div>
      {change && (
        <div
          className={`mt-2 flex items-center text-xs font-medium ${
            change.isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {change.isPositive ? (
            <ArrowUp className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 mr-1" />
          )}
          <span>
            {change.value}% {change.isPositive ? "artış" : "azalış"}
          </span>
        </div>
      )}
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
};

export default StatCard;
