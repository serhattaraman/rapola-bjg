import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, MessageSquare, PlusCircle, Phone, User, Clock, Calendar, Check, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { mockCandidates, formatDate, getStatusLabel } from '@/lib/mock-data';
import StatusBadge from '@/components/StatusBadge';
import { QRCodeSVG } from 'qrcode.react';
import ProcessStageIcon from '@/components/ProcessStageIcon';
import { Button } from '@/components/ui/button';
import UpdateStageDialog from '@/components/UpdateStageDialog';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ExamStatsBadge from '@/components/ExamStatsBadge';

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(() => {
    // Find the candidate with the matching ID
    const foundCandidate = mockCandidates.find(c => c.id === id);
    console.log(`Looking for candidate with ID: ${id}`);
    console.log(`Found candidate:`, foundCandidate);
    return foundCandidate || null;
  });

  const [isUpdateStageDialogOpen, setIsUpdateStageDialogOpen] = useState(false);
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
  const [isWaitingDialogOpen, setIsWaitingDialogOpen] = useState(false);
  const [isClassConfirmDialogOpen, setIsClassConfirmDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [waitingDate, setWaitingDate] = useState<Date | undefined>(
    candidate?.returnDate ? new Date(candidate.returnDate) : undefined
  );
  const [classConfirmation, setClassConfirmation] = useState<'pending' | 'confirmed'>(
    candidate?.classConfirmation || 'pending'
  );
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [rejectionNote, setRejectionNote] = useState<string>('');
  
  if (!candidate) {
    return (
      <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Aday bulunamadı</h2>
          <p className="text-gray-500 mb-4">Aradığınız ID: {id}</p>
          <div className="space-y-4">
            <Link to="/candidates" className="btn btn-primary block">
              Tüm Adaylar Sayfasına Git
            </Link>
            <Button onClick={() => navigate(-1)} variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Önceki Sayfaya Dön
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const phoneNumber = candidate.phone || "05XXXXXXXXX";
  const phoneUrl = `tel:${phoneNumber.replace(/\s/g, '')}`;

  const handleUpdateStage = (newStage: string) => {
    // In a real app, this would update the API
    // For now, we'll update the local state
    setCandidate(prev => {
      if (!prev) return null;
      
      // Add a new timeline entry for the stage change
      const newTimelineEntry = {
        id: `timeline-${Date.now()}`,
        date: new Date(),
        title: newStage,
        description: `Aşama "${prev.stage}" konumundan "${newStage}" konumuna güncellendi.`,
        staff: 'Mevcut Kullanıcı' // In a real app, this would be the current user's name
      };
      
      // If new stage is "Sınıf Yerleştirme", set class confirmation to pending
      const updatedClassConfirmation = newStage === "Sınıf Yerleştirme" ? 'pending' : prev.classConfirmation;
      
      return {
        ...prev,
        stage: newStage,
        classConfirmation: updatedClassConfirmation,
        timeline: [newTimelineEntry, ...prev.timeline]
      };
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast({
        title: "Not eklenemedi",
        description: "Lütfen bir not giriniz",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would update the API
    // For now, we'll update the local state
    setCandidate(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        notes: [newNote, ...prev.notes]
      };
    });

    // Reset form and close dialog
    setNewNote('');
    setIsAddNoteDialogOpen(false);
    
    toast({
      title: "Not eklendi",
      description: "Not başarıyla eklendi",
    });
  };

  const toggleWaitingMode = () => {
    if (candidate.status !== 'waiting') {
      // If not in waiting mode, open the dialog to set return date
      setWaitingDate(new Date());
      setIsWaitingDialogOpen(true);
    } else {
      // If already in waiting mode, remove from waiting
      updateWaitingStatus(false, undefined);
    }
  };

  const updateWaitingStatus = (isWaiting: boolean, returnDate?: Date) => {
    setCandidate(prev => {
      if (!prev) return null;
      
      const newStatus = isWaiting ? 'waiting' : 'inProgress';
      
      // Add a new timeline entry for the status change
      const newTimelineEntry = {
        id: `timeline-${Date.now()}`,
        date: new Date(),
        title: 'Durum Değişikliği',
        description: `Durum "${getStatusLabel(prev.status)}" konumundan "${getStatusLabel(newStatus)}" konumuna güncellendi.${isWaiting ? ' Dönüş tarihi: ' + formatDate(returnDate) : ''}`,
        staff: 'Mevcut Kullanıcı' // In a real app, this would be the current user's name
      };
      
      toast({
        title: "Durum güncellendi",
        description: `Aday durumu ${getStatusLabel(newStatus)} olarak güncellendi.${isWaiting ? ' Dönüş tarihi: ' + formatDate(returnDate) : ''}`,
      });
      
      return {
        ...prev,
        status: newStatus,
        returnDate: isWaiting ? returnDate : undefined,
        timeline: [newTimelineEntry, ...prev.timeline]
      };
    });
    
    setIsWaitingDialogOpen(false);
  };

  const toggleClassConfirmation = () => {
    setIsClassConfirmDialogOpen(true);
  };

  const updateClassConfirmation = (confirmed: boolean) => {
    setCandidate(prev => {
      if (!prev) return null;
      
      const newConfirmation = confirmed ? 'confirmed' : 'pending';
      
      // Add a new timeline entry for the confirmation change
      const newTimelineEntry = {
        id: `timeline-${Date.now()}`,
        date: new Date(),
        title: 'Sınıf Onayı',
        description: `Sınıf yerleştirme ${confirmed ? 'onaylandı' : 'beklemede'}.`,
        staff: 'Mevcut Kullanıcı' // In a real app, this would be the current user's name
      };
      
      toast({
        title: "Sınıf onayı güncellendi",
        description: `Sınıf yerleştirme ${confirmed ? 'onaylandı' : 'beklemede'}.`,
      });
      
      return {
        ...prev,
        classConfirmation: newConfirmation,
        timeline: [newTimelineEntry, ...prev.timeline]
      };
    });
    
    setIsClassConfirmDialogOpen(false);
  };

  const openRejectDialog = () => {
    setRejectionReason('');
    setRejectionNote('');
    setIsRejectDialogOpen(true);
  };

  const handleRejectCandidate = () => {
    if (!rejectionReason) {
      toast({
        title: "Red işlemi gerçekleştirilemedi",
        description: "Lütfen bir red nedeni seçiniz",
        variant: "destructive"
      });
      return;
    }

    setCandidate(prev => {
      if (!prev) return null;

      // Add a new timeline entry for rejection
      const newTimelineEntry = {
        id: `timeline-${Date.now()}`,
        date: new Date(),
        title: 'Aday Reddedildi',
        description: `Red nedeni: ${rejectionReason}${rejectionNote ? ' - Not: ' + rejectionNote : ''}`,
        staff: 'Mevcut Kullanıcı'
      };
      
      toast({
        title: "Aday reddedildi",
        description: `Aday başarıyla reddedildi. Neden: ${rejectionReason}`,
      });
      
      return {
        ...prev,
        status: 'rejected',
        rejectionReason,
        rejectionNote: rejectionNote || '',
        timeline: [newTimelineEntry, ...prev.timeline]
      };
    });
    
    setIsRejectDialogOpen(false);
  };

  const isInClassPlacementStage = candidate.stage === "Sınıf Yerleştirme";

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </button>
        </div>

        {/* Candidate Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 animate-scale-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {candidate.firstName} {candidate.lastName}
              </h1>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-gray-500">
                <span>{candidate.position}</span>
                <span className="hidden sm:inline">•</span>
                <span>{candidate.email}</span>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  <a href={phoneUrl} className="hover:text-primary transition-colors">{phoneNumber}</a>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center gap-4">
              <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="text-xs text-center text-gray-500 mb-1">Aramak için tara</div>
                <QRCodeSVG value={phoneUrl} size={80} />
              </div>
              <StatusBadge status={candidate.status} className="text-base px-4 py-1.5" />
            </div>
          </div>
          
          {/* Add Exam Statistics */}
          <div className="mt-4">
            <ExamStatsBadge examResults={candidate.examResults} className="justify-start" />
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            <Button variant="outline" className="inline-flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Düzenle
            </Button>
            <Button 
              variant="outline" 
              className={`inline-flex items-center ${candidate.status === 'waiting' ? 'text-amber-600 hover:text-amber-700' : 'text-blue-600 hover:text-blue-700'}`}
              onClick={toggleWaitingMode}
            >
              <Clock className="mr-2 h-4 w-4" />
              {candidate.status === 'waiting' ? 'Bekleme Modundan Çıkar' : 'Bekleme Moduna Al'}
            </Button>
            {isInClassPlacementStage && (
              <Button 
                variant="outline" 
                className={`inline-flex items-center ${candidate.classConfirmation === 'confirmed' ? 'text-green-600 hover:text-green-700' : 'text-amber-600 hover:text-amber-700'}`}
                onClick={toggleClassConfirmation}
              >
                {candidate.classConfirmation === 'confirmed' ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Sınıf Onaylandı
                  </>
                ) : (
                  <>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Sınıf Onayı Bekliyor
                  </>
                )}
              </Button>
            )}
            <Button 
              variant="outline" 
              className="inline-flex items-center text-red-600 hover:text-red-700"
              onClick={openRejectDialog}
              disabled={candidate.status === 'rejected'}
            >
              <XCircle className="mr-2 h-4 w-4" />
              {candidate.status === 'rejected' ? 'Reddedildi' : 'Reddet'}
            </Button>
            <Button variant="outline" className="inline-flex items-center text-red-600 hover:text-red-700">
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </Button>
          </div>
          
          {/* Rejection reason display */}
          {candidate.status === 'rejected' && candidate.rejectionReason && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center text-red-700 font-medium">
                <XCircle className="h-4 w-4 mr-2" />
                Red Nedeni: {candidate.rejectionReason}
              </div>
              {candidate.rejectionNote && (
                <div className="mt-1 text-sm text-red-600">{candidate.rejectionNote}</div>
              )}
            </div>
          )}
        </div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Language Proficiency Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
              <h2 className="text-lg font-semibold mb-4">Dil Bilgisi ve Sınav Bilgileri</h2>
              
              <div className="space-y-4">
                {/* Language Level */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Dil Seviyesi</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.examResults && candidate.examResults.length > 0 ? (
                      candidate.examResults
                        .sort((a, b) => {
                          // Sort by level priority: A1, A2, B1, B2
                          const levels = {A1: 1, A2: 2, B1: 3, B2: 4};
                          return levels[a.level as keyof typeof levels] - levels[b.level as keyof typeof levels];
                        })
                        .map(exam => (
                          <div 
                            key={exam.level} 
                            className={cn(
                              "px-3 py-2 rounded-lg flex flex-col items-center", 
                              exam.passed 
                                ? "bg-green-50 border border-green-200 text-green-800" 
                                : "bg-red-50 border border-red-200 text-red-800"
                            )}
                          >
                            <span className="text-lg font-bold">{exam.level}</span>
                            <span className="text-xs mt-1">
                              {exam.score !== undefined && `${exam.score}%`}
                            </span>
                            <span className="text-xs mt-1">
                              {exam.date && formatDate(exam.date)}
                            </span>
                            <span className="text-xs font-medium mt-1">
                              {exam.passed ? 'Geçti' : 'Kaldı'}
                            </span>
                          </div>
                        ))
                    ) : (
                      <div className="text-sm text-gray-500">Henüz sınav kaydı bulunmuyor</div>
                    )}
                  </div>
                </div>
                
                {/* Exam History */}
                {candidate.examResults && candidate.examResults.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Sınav Geçmişi</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seviye</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skor</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eğitmen</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {candidate.examResults.map((exam, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{exam.level}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {exam.date ? formatDate(exam.date) : '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {exam.score !== undefined ? `${exam.score}%` : '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {exam.instructor || candidate.responsiblePerson || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={cn(
                                  "px-2 py-1 text-xs rounded-full", 
                                  exam.passed 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-red-100 text-red-800"
                                )}>
                                  {exam.passed ? 'Geçti' : 'Kaldı'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Aday Süreci</h2>
                <div className="text-sm text-gray-500">
                  Başvuru: {formatDate(candidate.appliedAt)}
                </div>
              </div>
              
              {/* Timeline */}
              <div className="mt-8">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {candidate.timeline.map((event, eventIdx) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {eventIdx !== candidate.timeline.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <ProcessStageIcon stage={event.title} className="h-4 w-4 text-primary" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                              {event.staff && (
                                <div className="mt-1 flex items-center text-xs text-gray-500">
                                  <User className="h-3 w-3 mr-1" />
                                  <span>Sorumlu: {event.staff}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="ghost" className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Yeni Adım Ekle
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Current Stage */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
              <div className="flex items-center gap-2 mb-4">
                <ProcessStageIcon stage={candidate.stage} className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Mevcut Aşama</h2>
              </div>
              
              {candidate.status === 'waiting' && (
                <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-700">
                    <Clock className="h-5 w-5" />
                    <p className="text-sm font-medium">Bu aday şu anda bekleme modunda</p>
                  </div>
                  <p className="mt-1 text-xs text-amber-600">
                    Bekleme modundaki adaylar aktif işleme tabi tutulmaz. İşleme devam etmek için bekleme modundan çıkarın.
                  </p>
                  {candidate.returnDate && (
                    <div className="mt-2 flex items-center text-amber-700 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Dönüş tarihi: {formatDate(candidate.returnDate)}</span>
                    </div>
                  )}
                </div>
              )}
              
              {candidate.status === 'rejected' && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">Bu aday reddedildi</p>
                  </div>
                  <p className="mt-1 text-xs text-red-600">
                    Reddedilmiş adaylar için işlem yapılamaz. İşleme devam etmek için adayın durumunu değiştirin.
                  </p>
                </div>
              )}
              
              {isInClassPlacementStage && candidate.classConfirmation === 'pending' && (
                <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 text-amber-700">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">Sınıf yerleştirme onayı bekleniyor</p>
                  </div>
                  <p className="mt-1 text-xs text-amber-600">
                    Adayın sınıf yerleştirmesi henüz onaylanmadı. İşleme devam etmek için sınıf onayını tamamlayın.
                  </p>
                </div>
              )}
              
              {isInClassPlacementStage && candidate.classConfirmation === 'confirmed' && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">Sınıf yerleştirme onaylandı</p>
                  </div>
                  <p className="mt-1 text-xs text-green-600">
                    Adayın sınıf yerleştirmesi onaylandı ve bir sonraki aşamaya geçilebilir.
                  </p>
                </div>
              )}
              
              <div className={`bg-primary/5 p-4 rounded-lg border border-primary/20 ${candidate.status === 'waiting' || candidate.status === 'rejected' ? 'opacity-50' : ''}`}>
                <div className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <ProcessStageIcon stage={candidate.stage} className="h-5 w-5 text-primary" />
                  {candidate.stage}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    Aday şu anda <strong>{candidate.stage}</strong> aşamasında ve durumu <strong>{getStatusLabel(candidate.status)}</strong>.
                  </p>
                  <p className="mt-2 flex items-center gap-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>Sorumlu: <strong className="text-primary">{candidate.responsiblePerson || 'İK Uzmanı'}</strong></span>
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={() => setIsUpdateStageDialogOpen(true)}
                  disabled={candidate.status === 'waiting' || candidate.status === 'rejected'}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Aşama Güncelle
                </Button>
                {candidate.status === 'waiting' && (
                  <p className="mt-2 text-xs text-center text-gray-500">
                    Aşama güncellemek için önce bekleme modundan çıkarın
                  </p>
                )}
                {candidate.status === 'rejected' && (
                  <p className="mt-2 text-xs text-center text-gray-500">
                    Reddedilmiş adayların aşaması güncellenemez
                  </p>
                )}
              </div>
            </div>
            
            {/* Notes */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Notlar</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsAddNoteDialogOpen(true)}
                  className="text-primary hover:text-primary/80 h-8 w-8"
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-3">
                {candidate.notes && candidate.notes.length > 0 ? (
                  candidate.notes.map((note, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-start">
                        <MessageSquare className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                        <div className="text-sm">{note}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-sm p-3 text-center">Henüz not eklenmemiş</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Stage Dialog */}
      <UpdateStageDialog
        isOpen={isUpdateStageDialogOpen}
        onClose={() => setIsUpdateStageDialogOpen(false)}
        currentStage={candidate.stage}
        candidateId={candidate.id}
        onUpdateStage={handleUpdateStage}
      />

      {/* Add Note Dialog */}
      <Dialog open={isAddNoteDialogOpen} onOpenChange={setIsAddNoteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Not Ekle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea 
              placeholder="Not yazın..." 
              className="min-h-32"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsAddNoteDialogOpen(false)}>
              İptal
            </Button>
            <Button type="button" onClick={handleAddNote}>
              Not Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Waiting Mode Dialog with Date Picker */}
      <Dialog open={isWaitingDialogOpen} onOpenChange={setIsWaitingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bekleme Moduna Al</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Dönüş Tarihi Seçin</label>
              <div className="flex flex-col items-center">
                <CalendarComponent
                  mode="single"
                  selected={waitingDate}
                  onSelect={setWaitingDate}
                  className="border rounded-md"
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </div>
            </div>
            <div className="text-sm text-center text-gray-500">
              {waitingDate ? (
                <span>Seçilen dönüş tarihi: {format(waitingDate, "dd.MM.yyyy")}</span>
              ) : (
                <span>Lütfen bir dönüş tarihi seçin</span>
              )}
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setIsWaitingDialogOpen(false)}>
              İptal
            </Button>
            <Button 
              type="button" 
              onClick={() => updateWaitingStatus(true, waitingDate)}
              disabled={!waitingDate}
            >
              Bekleme Moduna Al
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Class Confirmation Dialog */}
      <Dialog open={isClassConfirmDialogOpen} onOpenChange={setIsClassConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sınıf Yerleştirme Onayı</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Aday: {candidate.firstName} {candidate.lastName}</span>
                  <span className="text-xs text-gray-500">Aşama: {candidate.stage}</span>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-800">
                <p className="text-sm">
