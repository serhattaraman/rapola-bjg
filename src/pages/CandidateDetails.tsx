import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, User, Clock, Calendar, CheckCircle, AlertCircle, XCircle, UserCheck, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  mockCandidates, 
  formatDate, 
  getStatusLabel,
  CandidateProcessProgress,
  ProcessStatus
} from '@/lib/mock-data';
import { getProcessStagesFromStorage } from '@/lib/process-data';
import StatusBadge from '@/components/StatusBadge';
import ProcessStageIcon from '@/components/ProcessStageIcon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CandidateDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [selectedSubProcess, setSelectedSubProcess] = useState<string>('');
  
  const candidate = mockCandidates.find(c => c.id === id);
  const processStages = getProcessStagesFromStorage();

  const getProcessStatusColor = (status: ProcessStatus): string => {
    switch (status) {
      case 'notStarted':
        return 'bg-gray-300 text-gray-700';
      case 'inProgress':
        return 'bg-yellow-500 text-white';
      case 'blocked':
        return 'bg-red-500 text-white';
      case 'completed':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  // Mock process progress - in real app this would come from candidate data
  const mockProcessProgress: CandidateProcessProgress[] = processStages.map((stage, index) => {
    const isCurrentStage = candidate?.stage === stage.name;
    const isCompletedStage = processStages.findIndex(s => s.name === candidate?.stage) > index;
    
    let status: ProcessStatus = 'notStarted';
    let completedSubProcesses: string[] = [];
    
    if (isCompletedStage) {
      status = 'completed';
      completedSubProcesses = stage.subProcesses.map(sp => sp.id);
    } else if (isCurrentStage) {
      if (candidate?.status === 'rejected') {
        status = 'blocked';
      } else {
        status = 'inProgress';
        // Simulate some completed sub-processes
        completedSubProcesses = stage.subProcesses.slice(0, Math.floor(stage.subProcesses.length / 2)).map(sp => sp.id);
      }
    }

    return {
      stageId: stage.id,
      status,
      completedSubProcesses,
      startDate: isCurrentStage || isCompletedStage ? new Date() : undefined,
      completedDate: isCompletedStage ? new Date() : undefined,
    };
  });

  const handleAssignProcess = () => {
    if (!selectedStage) {
      toast({
        title: "Hata",
        description: "Lütfen bir süreç seçin.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Süreç Atandı",
      description: `${processStages.find(s => s.id === selectedStage)?.name} süreci adaya atandı.`,
    });
    setAssignDialogOpen(false);
    setSelectedStage('');
  };

  const handleCompleteProcess = () => {
    if (!selectedStage) {
      toast({
        title: "Hata", 
        description: "Lütfen bir süreç seçin.",
        variant: "destructive",
      });
      return;
    }

    const stageName = processStages.find(s => s.id === selectedStage)?.name;
    let message = `${stageName} süreci tamamlandı.`;
    
    if (selectedSubProcess) {
      const subProcessName = processStages
        .find(s => s.id === selectedStage)
        ?.subProcesses.find(sp => sp.id === selectedSubProcess)?.name;
      message = `${stageName} sürecinin ${subProcessName} alt süreci tamamlandı.`;
    }

    toast({
      title: "Süreç Tamamlandı",
      description: message,
    });
    setCompleteDialogOpen(false);
    setSelectedStage('');
    setSelectedSubProcess('');
  };

  if (!candidate) {
    return (
      <div className="min-h-screen bg-[#f9fafb] pb-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Aday bulunamadı</h2>
          <p className="text-gray-500 mb-4">Aradığınız ID: {id}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Geri Dön
          </button>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button 
              onClick={() => setAssignDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Süreç Ata
            </Button>
            <Button 
              onClick={() => setCompleteDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Süreç Tamamla
            </Button>
          </div>

          {/* Candidate Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">
                    {candidate.firstName} {candidate.lastName}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {candidate.position}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {candidate.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(candidate.appliedAt)}
                      </span>
                    </div>
                  </CardDescription>
                </div>
                <StatusBadge 
                  status={candidate.status} 
                  returnDate={candidate.returnDate}
                  showRemainingDays={candidate.status === 'waiting'}
                />
              </div>
            </CardHeader>
            <CardContent>
              {/* Process Progress Section */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-4">Süreç Durumu</h3>
                <TooltipProvider>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {processStages.map((stage) => {
                      const progress = mockProcessProgress.find(p => p.stageId === stage.id);
                      const completedCount = progress?.completedSubProcesses.length || 0;
                      const totalCount = stage.subProcesses.length;
                      
                      return (
                        <Tooltip key={stage.id}>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                              {/* Stage Icon */}
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium relative ${
                                getProcessStatusColor(progress?.status || 'notStarted')
                              }`}>
                                <ProcessStageIcon stage={stage.name} size={20} />
                                
                                {/* Sub-process count badge */}
                                {totalCount > 0 && (
                                  <div className="absolute -top-1 -right-1 bg-white border border-gray-300 text-gray-700 text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                    {completedCount}/{totalCount}
                                  </div>
                                )}
                              </div>
                              
                              {/* Stage Name */}
                              <div className="text-xs text-center font-medium">
                                {stage.name}
                              </div>
                              
                              {/* Status indicator */}
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                progress?.status === 'completed' ? 'bg-green-100 text-green-800' :
                                progress?.status === 'inProgress' ? 'bg-yellow-100 text-yellow-800' :
                                progress?.status === 'blocked' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {progress?.status === 'completed' ? 'Tamamlandı' :
                                 progress?.status === 'inProgress' ? 'Devam Ediyor' :
                                 progress?.status === 'blocked' ? 'Engellendi' :
                                 'Başlamadı'}
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-center">
                              <div className="font-medium">{stage.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {completedCount}/{totalCount} alt süreç tamamlandı
                              </div>
                              {stage.description && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {stage.description}
                                </div>
                              )}
                              {/* Sub-processes list */}
                              {stage.subProcesses.length > 0 && (
                                <div className="mt-2 text-xs">
                                  <div className="font-medium mb-1">Alt Süreçler:</div>
                                  {stage.subProcesses.map((subProcess) => (
                                    <div key={subProcess.id} className={`flex items-center gap-1 ${
                                      progress?.completedSubProcesses.includes(subProcess.id) 
                                        ? 'text-green-600' 
                                        : 'text-gray-500'
                                    }`}>
                                      {progress?.completedSubProcesses.includes(subProcess.id) ? (
                                        <CheckCircle className="w-3 h-3" />
                                      ) : (
                                        <Clock className="w-3 h-3" />
                                      )}
                                      <span>{subProcess.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details">Aday Detayları</TabsTrigger>
              <TabsTrigger value="timeline">Süreç Geçmişi</TabsTrigger>
              <TabsTrigger value="notes">Notlar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Kişisel Bilgiler</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Ad Soyad</label>
                    <p className="text-sm">{candidate.firstName} {candidate.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">E-posta</label>
                    <p className="text-sm">{candidate.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Telefon</label>
                    <p className="text-sm">{candidate.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Pozisyon</label>
                    <p className="text-sm">{candidate.position}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Yaş</label>
                    <p className="text-sm">{candidate.age}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Deneyim</label>
                    <p className="text-sm">{candidate.experienceYears} yıl</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Süreç Geçmişi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidate.timeline?.map((event, index) => (
                      <div key={event.id} className="flex gap-3 p-3 border rounded-lg">
                        <ProcessStageIcon stage={event.title} size={16} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{event.title}</h4>
                            <span className="text-xs text-gray-500">{formatDate(event.date)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">Henüz süreç geçmişi bulunmuyor</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notlar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {candidate.notes?.map((note, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{note}</p>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">Henüz not eklenmemiş</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Assign Process Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Süreç Ata</DialogTitle>
            <DialogDescription>
              Bu adaya hangi süreci atamak istiyorsunuz?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Süreç Seçin</label>
              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger>
                  <SelectValue placeholder="Bir süreç seçin" />
                </SelectTrigger>
                <SelectContent>
                  {processStages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleAssignProcess}>Süreç Ata</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Process Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Süreç Tamamla</DialogTitle>
            <DialogDescription>
              Hangi süreci veya alt süreci tamamlamak istiyorsunuz?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Ana Süreç</label>
              <Select value={selectedStage} onValueChange={(value) => {
                setSelectedStage(value);
                setSelectedSubProcess(''); // Reset sub-process when stage changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Bir süreç seçin" />
                </SelectTrigger>
                <SelectContent>
                  {processStages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedStage && (
              <div>
                <label className="text-sm font-medium">Alt Süreç (Opsiyonel)</label>
                <Select value={selectedSubProcess} onValueChange={setSelectedSubProcess}>
                  <SelectTrigger>
                    <SelectValue placeholder="Alt süreç seçin (tümü için boş bırakın)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tüm Süreç</SelectItem>
                    {processStages
                      .find(s => s.id === selectedStage)
                      ?.subProcesses.map((subProcess) => (
                        <SelectItem key={subProcess.id} value={subProcess.id}>
                          {subProcess.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleCompleteProcess}>Tamamla</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidateDetails;