
import React from 'react';
import { ExamResult } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';

interface ExamStatsBadgeProps {
  examResults?: ExamResult[];
  className?: string;
}

const ExamStatsBadge: React.FC<ExamStatsBadgeProps> = ({ examResults, className }) => {
  if (!examResults || examResults.length === 0) {
    return (
      <div className={cn("flex items-center text-sm text-gray-500", className)}>
        <FileSpreadsheet size={16} className="mr-1" />
        <span>Sınav kaydı yok</span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {['A1', 'A2', 'B1', 'B2'].map(level => {
        const exam = examResults.find(e => e.level === level);
        
        if (!exam) {
          return (
            <span 
              key={level}
              className="px-2 py-0.5 text-xs border border-gray-200 text-gray-400 rounded"
              title="Sınav kaydı yok"
            >
              {level}: -
            </span>
          );
        }
        
        const statusColor = exam.passed 
          ? "border-green-200 bg-green-50 text-green-700" 
          : "border-red-200 bg-red-50 text-red-700";
          
        const dateStr = exam.date ? format(new Date(exam.date), 'dd.MM.yyyy') : '';
        const scoreStr = exam.score !== undefined ? `${exam.score}%` : '';
        
        return (
          <span 
            key={level}
            className={`px-2 py-0.5 text-xs border rounded ${statusColor}`}
            title={`Sınav tarihi: ${dateStr}, Skor: ${scoreStr}`}
          >
            {level}: {exam.passed ? 'Geçti' : 'Kaldı'}
          </span>
        );
      })}
    </div>
  );
};

export default ExamStatsBadge;
