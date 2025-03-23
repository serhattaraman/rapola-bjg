
import React from 'react';
import { 
  FileCheck, 
  BookOpen, 
  PhoneCall, 
  UserCheck, 
  ClipboardList, 
  Database, 
  Users, 
  FileText, // Replaced Passport with FileText
  Award, 
  LucideIcon 
} from 'lucide-react';

type StageType = string;

interface ProcessStageIconProps {
  stage: StageType;
  size?: number;
  className?: string;
}

// Bu nesne, .NET MVC'de C# sınıfına kolaylıkla dönüştürülebilir
export const stageIconMapping = {
  "Başvuru Alındı": "FileCheck",
  "Telefon Görüşmesi": "PhoneCall",
  "İK Görüşmesi": "UserCheck",
  "Evrak Toplama": "ClipboardList",
  "Sisteme Evrak Girişi": "Database",
  "Sınıf Yerleştirme": "Users",
  "Denklik Süreci": "BookOpen",
  "Vize Süreci": "FileText",
  "Sertifika Süreci": "Award",
};

const ProcessStageIcon: React.FC<ProcessStageIconProps> = ({ 
  stage, 
  size = 18, 
  className = "" 
}) => {
  
  const getIcon = (): LucideIcon => {
    // Map stages to specific icons
    switch(stage) {
      case "Başvuru Alındı":
        return FileCheck;
      case "Telefon Görüşmesi":
        return PhoneCall;
      case "İK Görüşmesi":
        return UserCheck;
      case "Evrak Toplama":
        return ClipboardList;
      case "Sisteme Evrak Girişi":
        return Database;
      case "Sınıf Yerleştirme":
        return Users;
      case "Denklik Süreci":
        return BookOpen;
      case "Vize Süreci":
        return FileText; // Changed from Passport to FileText
      case "Sertifika Süreci":
        return Award;
      default:
        return FileCheck;
    }
  };

  const Icon = getIcon();
  
  return <Icon size={size} className={`process-stage-icon ${className}`} />;
};

export default ProcessStageIcon;
