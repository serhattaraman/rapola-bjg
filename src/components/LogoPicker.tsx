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
  Search,
  Edit,
  Download,
  Upload,
  Share,
  Eye,
  Lock,
  Unlock,
  Key,
  Folder,
  File,
  Bell,
  Flag,
  Trophy,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Activity,
  Zap,
  Shield,
  Bookmark,
  Plus,
  CheckSquare,
  AlertCircle,
  Info,
  MessageSquare,
  Headphones,
  Monitor,
  Smartphone,
  Printer,
  FileImage,
  FileVideo,
  Archive,
  Send,
  Inbox,
  LucideIcon
} from 'lucide-react';

interface LogoPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const availableIcons: { name: string; Icon: LucideIcon; label: string }[] = [
  // Başvuru ve Belgeler
  { name: 'file-check', Icon: FileCheck, label: 'Dosya Onay' },
  { name: 'file-text', Icon: FileText, label: 'Belge' },
  { name: 'clipboard-list', Icon: ClipboardList, label: 'Liste' },
  { name: 'folder', Icon: Folder, label: 'Klasör' },
  { name: 'file', Icon: File, label: 'Dosya' },
  { name: 'file-image', Icon: FileImage, label: 'Resim Dosyası' },
  { name: 'file-video', Icon: FileVideo, label: 'Video Dosyası' },
  { name: 'archive', Icon: Archive, label: 'Arşiv' },
  { name: 'download', Icon: Download, label: 'İndir' },
  { name: 'upload', Icon: Upload, label: 'Yükle' },

  // İletişim ve Görüşme
  { name: 'phone', Icon: PhoneCall, label: 'Telefon' },
  { name: 'mail', Icon: Mail, label: 'Mail' },
  { name: 'message-square', Icon: MessageSquare, label: 'Mesaj' },
  { name: 'headphones', Icon: Headphones, label: 'Kulaklık' },
  { name: 'send', Icon: Send, label: 'Gönder' },
  { name: 'inbox', Icon: Inbox, label: 'Gelen Kutusu' },

  // İnsan Kaynakları ve Kullanıcılar
  { name: 'user-check', Icon: UserCheck, label: 'Kullanıcı Onay' },
  { name: 'user', Icon: User, label: 'Kullanıcı' },
  { name: 'users', Icon: Users, label: 'Kullanıcılar' },

  // Onay ve Değerlendirme
  { name: 'check-circle', Icon: CheckCircle, label: 'Onay' },
  { name: 'check-square', Icon: CheckSquare, label: 'Kontrol' },
  { name: 'award', Icon: Award, label: 'Ödül' },
  { name: 'trophy', Icon: Trophy, label: 'Başarı' },
  { name: 'star', Icon: Star, label: 'Yıldız' },
  { name: 'flag', Icon: Flag, label: 'Bayrak' },

  // Zaman ve Planlama
  { name: 'clock', Icon: Clock, label: 'Zaman' },
  { name: 'calendar', Icon: Calendar, label: 'Takvim' },

  // İş ve Kurum
  { name: 'building', Icon: Building, label: 'Kurum' },
  { name: 'briefcase', Icon: Briefcase, label: 'İş' },

  // Eğitim ve Öğretim
  { name: 'graduation-cap', Icon: GraduationCap, label: 'Mezuniyet' },
  { name: 'book-open', Icon: BookOpen, label: 'Eğitim' },

  // Sistem ve Teknoloji
  { name: 'database', Icon: Database, label: 'Veri Tabanı' },
  { name: 'settings', Icon: Settings, label: 'Ayarlar' },
  { name: 'monitor', Icon: Monitor, label: 'Sistem' },
  { name: 'smartphone', Icon: Smartphone, label: 'Mobil' },
  { name: 'printer', Icon: Printer, label: 'Yazıcı' },

  // Güvenlik ve Erişim
  { name: 'shield', Icon: Shield, label: 'Güvenlik' },
  { name: 'lock', Icon: Lock, label: 'Kilitle' },
  { name: 'unlock', Icon: Unlock, label: 'Aç' },
  { name: 'key', Icon: Key, label: 'Anahtar' },
  { name: 'eye', Icon: Eye, label: 'Görüntüle' },

  // Süreç Yönetimi
  { name: 'target', Icon: Target, label: 'Hedef' },
  { name: 'activity', Icon: Activity, label: 'Aktivite' },
  { name: 'trending-up', Icon: TrendingUp, label: 'İlerleme' },
  { name: 'trending-down', Icon: TrendingDown, label: 'Gerileme' },
  { name: 'bar-chart', Icon: BarChart, label: 'Grafik' },
  { name: 'pie-chart', Icon: PieChart, label: 'İstatistik' },

  // Genel İşlemler
  { name: 'search', Icon: Search, label: 'Arama' },
  { name: 'edit', Icon: Edit, label: 'Düzenle' },
  { name: 'share', Icon: Share, label: 'Paylaş' },
  { name: 'bookmark', Icon: Bookmark, label: 'İşaretle' },
  { name: 'plus', Icon: Plus, label: 'Ekle' },
  { name: 'bell', Icon: Bell, label: 'Bildirim' },
  { name: 'zap', Icon: Zap, label: 'Hızlı İşlem' },
  { name: 'globe', Icon: Globe, label: 'Global' },

  // Uyarı ve Bilgi
  { name: 'alert-circle', Icon: AlertCircle, label: 'Uyarı' },
  { name: 'info', Icon: Info, label: 'Bilgi' },
];

const LogoPicker: React.FC<LogoPickerProps> = ({ value, onChange, label = "Logo Seçin" }) => {
  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="grid grid-cols-4 gap-2 p-3 border rounded-md max-h-64 overflow-y-auto">
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