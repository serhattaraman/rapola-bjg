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

interface AddJobPlacementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (jobPlacement: JobPlacement) => void;
}

const AddJobPlacementDialog: React.FC<AddJobPlacementDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [contractType, setContractType] = useState<string>('');
  const [interviewDate, setInterviewDate] = useState<Date | undefined>(undefined);
  const [interviewers, setInterviewers] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const { toast } = useToast();

  const resetForm = () => {
    setCompanyName('');
    setCompanyAddress('');
    setPosition('');
    setDepartment('');
    setStartDate(undefined);
    setSalary('');
    setCurrency('EUR');
    setContractType('');
    setInterviewDate(undefined);
    setInterviewers('');
    setInterviewNotes('');
  };

  const handleSubmit = () => {
    if (!companyName.trim() || !companyAddress.trim() || !position.trim() || !contractType || !startDate) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen zorunlu alanları doldurun",
        variant: "destructive"
      });
      return;
    }

    const newJobPlacement: JobPlacement = {
      id: Date.now().toString(),
      companyName: companyName.trim(),
      companyAddress: companyAddress.trim(),
      position: position.trim(),
      department: department.trim() || undefined,
      startDate,
      salary: salary ? parseFloat(salary) : undefined,
      currency,
      contractType: contractType as JobPlacement['contractType'],
      interviewDetails: interviewDate ? {
        interviewDate,
        interviewers: interviewers.split(',').map(name => name.trim()).filter(name => name),
        interviewNotes: interviewNotes.trim() || undefined,
        interviewResult: 'passed'
      } : undefined,
      placementDate: new Date(),
      placedBy: 'Mevcut Kullanıcı', // In real app, this would be current user
      isActive: true
    };

    onSuccess(newJobPlacement);
    resetForm();
    onOpenChange(false);
    
    toast({
      title: "İş yerleştirme eklendi",
      description: `${companyName} şirketine yerleştirme başarıyla eklendi`,
    });
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case 'fullTime': return 'Tam Zamanlı';
      case 'partTime': return 'Yarı Zamanlı';
      case 'contract': return 'Sözleşmeli';
      case 'internship': return 'Staj';
      default: return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni İş Yerleştirme Ekle</DialogTitle>
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
              <div>
                <Label htmlFor="companyAddress">Şirket Adresi *</Label>
                <Textarea
                  id="companyAddress"
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="Tam adres bilgisini girin"
                  rows={2}
                />
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Çalışma Türü *</Label>
                  <Select value={contractType} onValueChange={setContractType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Çalışma türünü seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fullTime">Tam Zamanlı</SelectItem>
                      <SelectItem value="partTime">Yarı Zamanlı</SelectItem>
                      <SelectItem value="contract">Sözleşmeli</SelectItem>
                      <SelectItem value="internship">Staj</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>İşe Başlama Tarihi *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yyyy") : "Tarih seçin"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Maaş Bilgileri</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary">Maaş</Label>
                <Input
                  id="salary"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="Maaş miktarını girin"
                />
              </div>
              <div>
                <Label>Para Birimi</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="TRY">TRY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Interview Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Mülakat Bilgileri</h3>
            <div className="grid gap-4">
              <div>
                <Label>Mülakat Tarihi</Label>
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
            İş Yerleştirme Ekle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddJobPlacementDialog;