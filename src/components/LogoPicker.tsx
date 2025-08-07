import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  FileCheck, 
  BookOpen, 
  PhoneCall, 
  UserCheck, 
  ClipboardList, 
  Database, 
  Users, 
  FileText, 
  Award, 
  CheckCircle,
  User,
  Calendar,
  Mail,
  Building,
  Briefcase,
  GraduationCap,
  Globe,
  Settings,
  Star,
  Target,
  Clock,
  LucideIcon
} from 'lucide-react';

interface LogoPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const availableIcons: { name: string; Icon: LucideIcon; label: string }[] = [
  { name: 'file-check', Icon: FileCheck, label: 'Dosya Onay' },
  { name: 'phone', Icon: PhoneCall, label: 'Telefon' },
  { name: 'user-check', Icon: UserCheck, label: 'Kullanıcı Onay' },
  { name: 'clipboard-list', Icon: ClipboardList, label: 'Liste' },
  { name: 'database', Icon: Database, label: 'Veri Tabanı' },
  { name: 'users', Icon: Users, label: 'Kullanıcılar' },
  { name: 'book-open', Icon: BookOpen, label: 'Kitap' },
  { name: 'file-text', Icon: FileText, label: 'Belge' },
  { name: 'award', Icon: Award, label: 'Ödül' },
  { name: 'check-circle', Icon: CheckCircle, label: 'Onay' },
  { name: 'user', Icon: User, label: 'Kullanıcı' },
  { name: 'calendar', Icon: Calendar, label: 'Takvim' },
  { name: 'mail', Icon: Mail, label: 'Mail' },
  { name: 'building', Icon: Building, label: 'Bina' },
  { name: 'briefcase', Icon: Briefcase, label: 'Çanta' },
  { name: 'graduation-cap', Icon: GraduationCap, label: 'Mezuniyet' },
  { name: 'globe', Icon: Globe, label: 'Dünya' },
  { name: 'settings', Icon: Settings, label: 'Ayarlar' },
  { name: 'star', Icon: Star, label: 'Yıldız' },
  { name: 'target', Icon: Target, label: 'Hedef' },
  { name: 'clock', Icon: Clock, label: 'Saat' },
];

const LogoPicker: React.FC<LogoPickerProps> = ({ value, onChange, label = "Logo Seçin" }) => {
  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="grid grid-cols-6 gap-2 p-3 border rounded-md max-h-48 overflow-y-auto">
        {availableIcons.map(({ name, Icon, label: iconLabel }) => (
          <Button
            key={name}
            type="button"
            variant={value === name ? "default" : "outline"}
            size="sm"
            className="flex flex-col items-center gap-1 h-auto p-2"
            onClick={() => onChange(name)}
            title={iconLabel}
          >
            <Icon size={16} />
            <span className="text-xs">{iconLabel}</span>
          </Button>
        ))}
      </div>
      {value && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Seçili:</span>
          {(() => {
            const selectedIcon = availableIcons.find(icon => icon.name === value);
            if (selectedIcon) {
              const { Icon } = selectedIcon;
              return (
                <>
                  <Icon size={16} />
                  <span>{selectedIcon.label}</span>
                </>
              );
            }
            return <span>{value}</span>;
          })()}
        </div>
      )}
    </div>
  );
};

export default LogoPicker;