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

import { germanStates, getCitiesByState, getDistrictsByCity, getNeighborhoodsByDistrict } from '@/data/german-locations';

const AddInterviewDialog: React.FC<AddInterviewDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [companyName, setCompanyName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [village, setVillage] = useState('');
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
    setState('');
    setCity('');
    setDistrict('');
    setNeighborhood('');
    setVillage('');
    setAddress('');
    setPosition('');
    setDepartment('');
    setInterviewDate(undefined);
    setInterviewers('');
    setInterviewNotes('');
    setInterviewResult('pending');
  };

  const handleSubmit = () => {
    if (!companyName.trim() || !state || !city || !position.trim() || !interviewDate) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen zorunlu alanları doldurun",
        variant: "destructive"
      });
      return;
    }

    const fullAddress = `${village ? village + ', ' : ''}${neighborhood ? neighborhood + ', ' : ''}${district ? district + ', ' : ''}${city}, ${state}${address ? ', ' + address : ''}`;

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

  const availableCities = state ? getCitiesByState(state) : [];
  const availableDistricts = city ? getDistrictsByCity(city) : [];
  const availableNeighborhoods = district ? getNeighborhoodsByDistrict(district) : [];

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
                  <Label>Eyalet *</Label>
                  <Select value={state} onValueChange={(value) => {
                    setState(value);
                    setCity('');
                    setDistrict('');
                    setNeighborhood('');
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Eyalet seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {germanStates.map((stateName) => (
                        <SelectItem key={stateName} value={stateName}>
                          {stateName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Şehir *</Label>
                  <Select value={city} onValueChange={(value) => {
                    setCity(value);
                    setDistrict('');
                    setNeighborhood('');
                  }} disabled={!state}>
                    <SelectTrigger>
                      <SelectValue placeholder="Şehir seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((cityName) => (
                        <SelectItem key={cityName} value={cityName}>
                          {cityName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>İlçe/Bölge</Label>
                  <Select value={district} onValueChange={(value) => {
                    setDistrict(value);
                    setNeighborhood('');
                  }} disabled={!city}>
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
                <div>
                  <Label>Mahalle/Semt</Label>
                  <Select value={neighborhood} onValueChange={setNeighborhood} disabled={!district}>
                    <SelectTrigger>
                      <SelectValue placeholder="Mahalle seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableNeighborhoods.map((neighborhoodName) => (
                        <SelectItem key={neighborhoodName} value={neighborhoodName}>
                          {neighborhoodName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="village">Köy/Kasaba</Label>
                  <Input
                    id="village"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Köy veya kasaba adı"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Detay Adres</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Sokak, cadde, bina no"
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