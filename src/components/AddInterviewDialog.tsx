import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { JobPlacement } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

interface AddInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (interview: JobPlacement) => void;
}

// Turkish cities data
const turkishCities = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "İçel", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

// Sample districts for major cities (in a real app, this would be fetched based on selected city)
const sampleDistricts: { [key: string]: string[] } = {
  "İstanbul": ["Kadıköy", "Beşiktaş", "Şişli", "Beyoğlu", "Fatih", "Üsküdar", "Bakırköy", "Zeytinburnu", "Maltepe", "Ataşehir"],
  "Ankara": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Sincan", "Etimesgut", "Altındağ", "Pursaklar", "Gölbaşı", "Polatlı"],
  "İzmir": ["Konak", "Bornova", "Karşıyaka", "Buca", "Çiğli", "Gaziemir", "Balçova", "Narlıdere", "Bayraklı", "Karabağlar"]
};

const AddInterviewDialog: React.FC<AddInterviewDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(undefined);
  const [interviewers, setInterviewers] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [interviewResult, setInterviewResult] = useState<'passed' | 'failed' | 'pending'>('pending');
  const { toast } = useToast();

  const resetForm = () => {
    setCompanyName('');
    setCity('');
    setDistrict('');
    setNeighborhood('');
    setAddress('');
    setPosition('');
    setDepartment('');
    setInterviewDate(undefined);
    setInterviewers('');
    setInterviewNotes('');
    setInterviewResult('pending');
  };

  const handleSubmit = () => {
    if (!companyName.trim() || !city || !district || !position.trim() || !interviewDate) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen zorunlu alanları doldurun",
        variant: "destructive"
      });
      return;
    }

    const fullAddress = `${neighborhood ? neighborhood + ', ' : ''}${district}, ${city}${address ? ', ' + address : ''}`;

    const newInterview: JobPlacement = {
      id: Date.now().toString(),
      companyName: companyName.trim(),
      companyAddress: fullAddress,
      position: position.trim(),
      department: department.trim() || undefined,
      startDate: new Date(), // For interview records, this represents the record date
      contractType: 'interview' as any, // Special type for interview records
      interviewDetails: {
        interviewDate,
        interviewers: interviewers.split(',').map(name => name.trim()).filter(name => name),
        interviewNotes: interviewNotes.trim() || undefined,
        interviewResult
      },
      placementDate: new Date(),
      placedBy: 'Mevcut Kullanıcı',
      isActive: interviewResult === 'passed'
    };

    onSuccess(newInterview);
    resetForm();
    onOpenChange(false);
    
    toast({
      title: "Mülakat kaydı eklendi",
      description: `${companyName} şirketi için mülakat kaydı başarıyla eklendi`,
    });
  };

  const getInterviewResultLabel = (result: string) => {
    switch (result) {
      case 'passed': return 'Olumlu';
      case 'failed': return 'Olumsuz';
      case 'pending': return 'Beklemede';
      default: return result;
    }
  };

  const availableDistricts = city ? (sampleDistricts[city] || []) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mülakat Kaydı Ekle</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Şirket Bilgileri</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="companyName">Şirket Adı *</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Şirket adını girin"
                />
              </div>
              
              {/* Address Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>İl *</Label>
                  <Select value={city} onValueChange={(value) => {
                    setCity(value);
                    setDistrict(''); // Reset district when city changes
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="İl seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {turkishCities.map((cityName) => (
                        <SelectItem key={cityName} value={cityName}>
                          {cityName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>İlçe *</Label>
                  <Select value={district} onValueChange={setDistrict} disabled={!city}>
                    <SelectTrigger>
                      <SelectValue placeholder="İlçe seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDistricts.map((districtName) => (
                        <SelectItem key={districtName} value={districtName}>
                          {districtName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="neighborhood">Mahalle</Label>
                  <Input
                    id="neighborhood"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Mahalle adını girin"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Detay Adres</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Cadde, sokak, bina no"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Position Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Pozisyon Bilgileri</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="position">Pozisyon *</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="İş pozisyonunu girin"
                />
              </div>
              <div>
                <Label htmlFor="department">Departman</Label>
                <Input
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Departman bilgisini girin"
                />
              </div>
            </div>
          </div>

          {/* Interview Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Mülakat Bilgileri</h3>
            <div className="grid gap-4">
              <div>
                <Label>Mülakat Tarihi *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !interviewDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {interviewDate ? format(interviewDate, "dd/MM/yyyy") : "Mülakat tarihi seçin"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={interviewDate}
                      onSelect={setInterviewDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="interviewers">Mülakatçılar</Label>
                <Input
                  id="interviewers"
                  value={interviewers}
                  onChange={(e) => setInterviewers(e.target.value)}
                  placeholder="Mülakatçı isimlerini virgülle ayırarak girin"
                />
              </div>
              <div>
                <Label>Mülakat Sonucu</Label>
                <Select value={interviewResult} onValueChange={(value: 'passed' | 'failed' | 'pending') => setInterviewResult(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Beklemede</SelectItem>
                    <SelectItem value="passed">Olumlu</SelectItem>
                    <SelectItem value="failed">Olumsuz</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="interviewNotes">Mülakat Notları</Label>
                <Textarea
                  id="interviewNotes"
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="Mülakat ile ilgili notları girin"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          <Button onClick={handleSubmit}>
            Mülakat Kaydı Ekle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddInterviewDialog;