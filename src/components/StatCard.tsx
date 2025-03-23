
import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

// .NET MVC örnek model sınıfı:
/*
public class StatViewModel
{
    public string Title { get; set; }
    public string Value { get; set; }
    public string IconClass { get; set; }
    public StatChangeViewModel Change { get; set; }
    public string CssClass { get; set; }
}

public class StatChangeViewModel
{
    public int Value { get; set; }
    public bool IsPositive { get; set; }
}
*/

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  className 
}) => {
  return (
    <div className={cn(
      'bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 stat-card',
      className
    )}>
      <div className="flex items-start justify-between stat-card-inner">
        <div className="stat-content">
          <p className="text-sm font-medium text-gray-500 stat-title">{title}</p>
          <h3 className="text-2xl font-bold mt-1 stat-value">{value}</h3>
          
          {change && (
            <div className="flex items-center mt-2 stat-change">
              <span className={cn(
                'text-xs font-medium stat-change-value',
                change.isPositive ? 'text-green-600 positive' : 'text-red-600 negative'
              )}>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1 stat-change-label">son haftaya göre</span>
            </div>
          )}
        </div>
        
        <div className="p-3 rounded-lg bg-primary/10 text-primary stat-icon">
          {icon}
        </div>
      </div>
    </div>
  );
};

// .NET MVC'de Razor Partial View olarak kullanılabilir:
/*
@model StatViewModel

<div class="stat-card @Model.CssClass">
  <div class="stat-card-inner">
    <div class="stat-content">
      <p class="stat-title">@Model.Title</p>
      <h3 class="stat-value">@Model.Value</h3>
      
      @if (Model.Change != null)
      {
        <div class="stat-change">
          <span class="stat-change-value @(Model.Change.IsPositive ? "positive" : "negative")">
            @(Model.Change.IsPositive ? "+" : "")@Model.Change.Value%
          </span>
          <span class="stat-change-label">son haftaya göre</span>
        </div>
      }
    </div>
    
    <div class="stat-icon @Model.IconClass"></div>
  </div>
</div>
*/

export default StatCard;
