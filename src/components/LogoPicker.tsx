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
  Camera,
  Heart,
  Home,
  Shield,
  Zap,
  Bookmark,
  Search,
  Plus,
  Minus,
  Edit,
  Trash,
  Download,
  Upload,
  Share,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  Folder,
  File,
  Image,
  Video,
  Music,
  Map,
  MapPin,
  Car,
  Plane,
  Train,
  Bike,
  Truck,
  Ship,
  Rocket,
  Coffee,
  Pizza,
  Apple,
  Smartphone,
  Laptop,
  Monitor,
  Printer,
  Wifi,
  Bluetooth,
  Battery,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  Thermometer,
  Wind,
  Compass,
  Navigation,
  Flag,
  Gift,
  Trophy,
  Medal,
  Crown,
  Diamond,
  Gem,
  Coins,
  CreditCard,
  Banknote,
  Calculator,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Activity,
  Zap as Lightning,
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
  { name: 'camera', Icon: Camera, label: 'Kamera' },
  { name: 'heart', Icon: Heart, label: 'Kalp' },
  { name: 'home', Icon: Home, label: 'Ev' },
  { name: 'shield', Icon: Shield, label: 'Kalkan' },
  { name: 'zap', Icon: Zap, label: 'Şimşek' },
  { name: 'bookmark', Icon: Bookmark, label: 'Yer İmi' },
  { name: 'search', Icon: Search, label: 'Arama' },
  { name: 'plus', Icon: Plus, label: 'Artı' },
  { name: 'minus', Icon: Minus, label: 'Eksi' },
  { name: 'edit', Icon: Edit, label: 'Düzenle' },
  { name: 'trash', Icon: Trash, label: 'Sil' },
  { name: 'download', Icon: Download, label: 'İndir' },
  { name: 'upload', Icon: Upload, label: 'Yükle' },
  { name: 'share', Icon: Share, label: 'Paylaş' },
  { name: 'copy', Icon: Copy, label: 'Kopyala' },
  { name: 'eye', Icon: Eye, label: 'Gör' },
  { name: 'eye-off', Icon: EyeOff, label: 'Gizle' },
  { name: 'lock', Icon: Lock, label: 'Kilitle' },
  { name: 'unlock', Icon: Unlock, label: 'Aç' },
  { name: 'key', Icon: Key, label: 'Anahtar' },
  { name: 'folder', Icon: Folder, label: 'Klasör' },
  { name: 'file', Icon: File, label: 'Dosya' },
  { name: 'image', Icon: Image, label: 'Resim' },
  { name: 'video', Icon: Video, label: 'Video' },
  { name: 'music', Icon: Music, label: 'Müzik' },
  { name: 'map', Icon: Map, label: 'Harita' },
  { name: 'map-pin', Icon: MapPin, label: 'Konum' },
  { name: 'car', Icon: Car, label: 'Araba' },
  { name: 'plane', Icon: Plane, label: 'Uçak' },
  { name: 'train', Icon: Train, label: 'Tren' },
  { name: 'bike', Icon: Bike, label: 'Bisiklet' },
  { name: 'truck', Icon: Truck, label: 'Kamyon' },
  { name: 'ship', Icon: Ship, label: 'Gemi' },
  { name: 'rocket', Icon: Rocket, label: 'Roket' },
  { name: 'coffee', Icon: Coffee, label: 'Kahve' },
  { name: 'pizza', Icon: Pizza, label: 'Pizza' },
  { name: 'apple', Icon: Apple, label: 'Elma' },
  { name: 'smartphone', Icon: Smartphone, label: 'Telefon' },
  { name: 'laptop', Icon: Laptop, label: 'Laptop' },
  { name: 'monitor', Icon: Monitor, label: 'Monitör' },
  { name: 'printer', Icon: Printer, label: 'Yazıcı' },
  { name: 'wifi', Icon: Wifi, label: 'Wifi' },
  { name: 'bluetooth', Icon: Bluetooth, label: 'Bluetooth' },
  { name: 'battery', Icon: Battery, label: 'Batarya' },
  { name: 'bell', Icon: Bell, label: 'Zil' },
  { name: 'bell-off', Icon: BellOff, label: 'Zil Kapalı' },
  { name: 'volume-2', Icon: Volume2, label: 'Ses' },
  { name: 'volume-x', Icon: VolumeX, label: 'Sessiz' },
  { name: 'play', Icon: Play, label: 'Oynat' },
  { name: 'pause', Icon: Pause, label: 'Duraklat' },
  { name: 'skip-back', Icon: SkipBack, label: 'Geri' },
  { name: 'skip-forward', Icon: SkipForward, label: 'İleri' },
  { name: 'repeat', Icon: Repeat, label: 'Tekrar' },
  { name: 'shuffle', Icon: Shuffle, label: 'Karıştır' },
  { name: 'sun', Icon: Sun, label: 'Güneş' },
  { name: 'moon', Icon: Moon, label: 'Ay' },
  { name: 'cloud', Icon: Cloud, label: 'Bulut' },
  { name: 'cloud-rain', Icon: CloudRain, label: 'Yağmur' },
  { name: 'cloud-snow', Icon: CloudSnow, label: 'Kar' },
  { name: 'thermometer', Icon: Thermometer, label: 'Termometre' },
  { name: 'wind', Icon: Wind, label: 'Rüzgar' },
  { name: 'compass', Icon: Compass, label: 'Pusula' },
  { name: 'navigation', Icon: Navigation, label: 'Navigasyon' },
  { name: 'flag', Icon: Flag, label: 'Bayrak' },
  { name: 'gift', Icon: Gift, label: 'Hediye' },
  { name: 'trophy', Icon: Trophy, label: 'Kupa' },
  { name: 'medal', Icon: Medal, label: 'Madalya' },
  { name: 'crown', Icon: Crown, label: 'Taç' },
  { name: 'diamond', Icon: Diamond, label: 'Elmas' },
  { name: 'gem', Icon: Gem, label: 'Mücevher' },
  { name: 'coins', Icon: Coins, label: 'Para' },
  { name: 'credit-card', Icon: CreditCard, label: 'Kredi Kartı' },
  { name: 'banknote', Icon: Banknote, label: 'Banknot' },
  { name: 'calculator', Icon: Calculator, label: 'Hesap Makinesi' },
  { name: 'trending-up', Icon: TrendingUp, label: 'Artış' },
  { name: 'trending-down', Icon: TrendingDown, label: 'Azalış' },
  { name: 'bar-chart', Icon: BarChart, label: 'Çubuk Grafik' },
  { name: 'pie-chart', Icon: PieChart, label: 'Pasta Grafik' },
  { name: 'activity', Icon: Activity, label: 'Aktivite' },
  { name: 'lightning', Icon: Lightning, label: 'Yıldırım' },
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