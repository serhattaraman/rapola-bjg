import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, MessageSquare, PlusCircle, Phone, User, Clock, Calendar, Check, CheckCircle, AlertCircle, XCircle, Award, FileText, Building2, MapPin, Briefcase } from 'lucide-react';
import { mockCandidates, formatDate, getStatusLabel, JobPlacement } from '@/lib/mock-data';
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
import AddJobPlacementDialog from '@/components/AddJobPlacementDialog';
import AddInterviewDialog from '@/components/AddInterviewDialog';
import { getProcessStagesFromStorage } from '@/lib/process-data';

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
  const [isAddJobPlacementDialogOpen, setIsAddJobPlacementDialogOpen] = useState(false);
  const [isAddInterviewDialogOpen, setIsAddInterviewDialogOpen] = useState(false);
  const processStages = getProcessStagesFromStorage();
  
  if (!candidate) {
    return (
      <div className="min-h-screen bg-[#f9fafb] pb-10 px-4 sm:px-6 flex items-center justify-center">
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

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mailtoLink = `mailto:${candidate.email}?subject=Rapola%20-%20Başvurunuz%20Hakkında&body=Merhaba%20${candidate.firstName}%20${candidate.lastName},%0D%0A%0D%0A`;
    window.location.href = mailtoLink;
  };

  const handleUpdateStage = (newStage: string) => {
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

  const generateCertificate = (exam: any) => {
    const certificateData = {
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      birthDate: candidate.birthDate || "___.___.______",
      birthPlace: candidate.birthPlace || "________________",
      listeningScore: exam.listeningScore || "0",
      readingScore: exam.readingScore || "0",
      writingScore: exam.writingScore || "0",
      speakingScore: exam.speakingScore || "0",
      totalScore: exam.score || "0",
      grade: exam.grade || "Bestanden",
      examDate: formatDate(exam.date),
    };

    // Read the template and replace placeholders
    fetch('/src/components/GermanCertificateTemplate.html')
      .then(response => response.text())
      .then(template => {
        let certificateHtml = template;
        
        // Replace all placeholders with actual data
        Object.entries(certificateData).forEach(([key, value]) => {
          certificateHtml = certificateHtml.replace(new RegExp(`{{${key}}}`, 'g'), value.toString());
        });

        // Create and download the file
        const blob = new Blob([certificateHtml], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${candidate.firstName}_${candidate.lastName}_A1_Zertifikat.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Sertifika oluşturuldu",
          description: "Sertifika başarıyla indirildi.",
        });
      });
  };

  const handleAddJobPlacement = (jobPlacement: JobPlacement) => {
    setCandidate(prev => {
      if (!prev) return null;
      
      // Add new job placement to the candidate
      const updatedJobPlacements = prev.jobPlacements ? [...prev.jobPlacements, jobPlacement] : [jobPlacement];
      
      // Add timeline entry for job placement
      const newTimelineEntry = {
        id: `timeline-${Date.now()}`,
        date: new Date(),
        title: 'İş Yerleştirme',
        description: `${jobPlacement.companyName} şirketine ${jobPlacement.position} pozisyonunda yerleştirildi.`,
        staff: jobPlacement.placedBy
      };
      
      return {
        ...prev,
        jobPlacements: updatedJobPlacements,
        timeline: [newTimelineEntry, ...prev.timeline]
      };
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
    <div className="min-h-screen bg-[#f9fafb] pb-10 px-4 sm:px-6 animate-fade-in">
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
                <span>
                  <a 
                    href={`mailto:${candidate.email}`}
                    className="hover:text-primary transition-colors"
                    onClick={handleEmailClick}
                  >
                    {candidate.email}
                  </a>
                </span>
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
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Dil Yeterlilik Seviyesi</h2>
              </div>
              
              {candidate.examResults && candidate.examResults.length > 0 ? (
                <div className="space-y-4">
                  {candidate.examResults.map((exam, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${exam.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-medium ${exam.passed ? 'text-green-900' : 'text-red-900'}`}>
                            {exam.level} Seviyesi
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${exam.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {exam.passed ? 'Geçti' : 'Kaldı'}
                          </span>
                        </div>
                        <span className={`font-bold ${exam.passed ? 'text-green-700' : 'text-red-700'}`}>
                          {exam.score}/100
                        </span>
                      </div>
                      
                      {exam.date && (
                        <div className={`text-sm ${exam.passed ? 'text-green-600' : 'text-red-600'}`}>
                          Sınav Tarihi: {formatDate(exam.date)}
                        </div>
                      )}
                      
                      {exam.passed && exam.level === 'A1' && (
                        <div className="mt-3">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => generateCertificate(exam)}
                            className="text-green-600 hover:text-green-700 border-green-300"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Sertifika İndir
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-8">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p>Henüz sınav sonucu kaydedilmemiş</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Zaman Çizelgesi</h2>
              </div>
              <div className="space-y-4">
                {candidate.timeline && candidate.timeline.length > 0 ? (
                  candidate.timeline.map((event, index) => (
                    <div key={event.id} className="border-l-2 border-gray-200 pl-4 pb-4 last:pb-0">
                      <div className="flex items-start">
                        <div className="-ml-6 mt-1.5 w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">{event.title}</h3>
                            <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                          {event.staff && (
                            <div className="text-xs text-gray-500 mt-1">
                              👤 {event.staff}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p>Henüz zaman çizelgesi kaydı bulunmuyor</p>
                  </div>
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

          {/* Right Column */}
          <div className="space-y-6">
            {/* Process Management */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
              <div className="flex items-center gap-2 mb-4">
                <ProcessStageIcon stage={candidate.stage} className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Aday Süreci</h2>
              </div>
              
              {candidate.status === 'rejected' && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 text-red-700">
                    <XCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">Aday reddedildi</p>
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
              
              {/* Process Stage Display */}
              <div className={`bg-primary/5 p-4 rounded-lg border border-primary/20 ${candidate.status === 'waiting' || candidate.status === 'rejected' ? 'opacity-50' : ''}`}>
                <div className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <ProcessStageIcon stage={candidate.stage} className="h-5 w-5 text-primary" />
                  {candidate.stage}
                  <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">3/5</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    Aday şu anda <strong>{candidate.stage}</strong> aşamasında ve durumu <strong>{getStatusLabel(candidate.status)}</strong>.
                  </p>
                </div>
                
                {/* Sub-processes */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Ara Süreçler:</h4>
                  <div className="space-y-2">
                    {(() => {
                      const currentStage = processStages.find(stage => stage.name === candidate.stage);
                      if (!currentStage?.subProcesses) return null;
                      
                      return currentStage.subProcesses.map((subProcess) => {
                        const isCompleted = Math.random() > 0.5; // Mock completion status
                        const completedDate = isCompleted ? new Date() : null;
                        const completedBy = isCompleted ? 'Ahmet Yılmaz' : null;
                        
                        return (
                          <div key={subProcess.id} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                {isCompleted ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Clock className="h-4 w-4 text-amber-500" />
                                )}
                                <span className="font-medium">{subProcess.name}</span>
                              </span>
                              <span className={`text-sm px-2 py-1 rounded ${
                                isCompleted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {isCompleted ? 'Tamamlandı' : 'Beklemede'}
                              </span>
                            </div>
                            {subProcess.description && (
                              <p className="text-sm text-gray-600 mt-1">{subProcess.description}</p>
                            )}
                            {isCompleted && completedDate && completedBy && (
                              <div className="mt-2 text-xs text-gray-500 flex gap-4">
                                <span>📅 {formatDate(completedDate)}</span>
                                <span>👤 {completedBy}</span>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
                
                {/* Action buttons for process management */}
                <div className="mt-4 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={candidate.status === 'waiting' || candidate.status === 'rejected'}
                  >
                    Süreç Tamamla
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled={candidate.status === 'waiting' || candidate.status === 'rejected'}
                  >
                    Süreç Ata
                  </Button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                <Button 
                  className="w-full" 
                  variant="default"
                  disabled={candidate.status === 'waiting' || candidate.status === 'rejected'}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Süreç Tamamla
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  disabled={candidate.status === 'waiting' || candidate.status === 'rejected'}
                >
                  <User className="mr-2 h-4 w-4" />
                  Süreç Ata
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setIsUpdateStageDialogOpen(true)}
                  disabled={candidate.status === 'waiting' || candidate.status === 'rejected'}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Aşama Güncelle
                </Button>
                {candidate.status === 'waiting' && (
                  <p className="mt-2 text-xs text-center text-gray-500">
                    İşlem yapmak için önce bekleme modundan çıkarın
                  </p>
                )}
                {candidate.status === 'rejected' && (
                  <p className="mt-2 text-xs text-center text-gray-500">
                    Reddedilmiş adaylar için işlem yapılamaz
                  </p>
                )}
              </div>
              
              {/* Job Placement Section */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h3 className="text-md font-semibold">İşe Yerleştirme ve Mülakatlar</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsAddInterviewDialogOpen(true)}
                      className="text-blue-600 hover:text-blue-700"
                      disabled={candidate.status === 'rejected'}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Mülakat
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsAddJobPlacementDialogOpen(true)}
                      className="text-green-600 hover:text-green-700"
                      disabled={candidate.status === 'rejected'}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      İş Yerleştirme
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {candidate.jobPlacements && candidate.jobPlacements.length > 0 ? (
                    candidate.jobPlacements.map((job, index) => {
                      const isInterview = job.contractType === 'interview';
                      const cardColor = isInterview 
                        ? (job.interviewDetails?.interviewResult === 'passed' ? 'bg-green-50 border-green-200' : 
                           job.interviewDetails?.interviewResult === 'failed' ? 'bg-red-50 border-red-200' : 
                           'bg-yellow-50 border-yellow-200')
                        : 'bg-blue-50 border-blue-200';
                      const iconColor = isInterview 
                        ? (job.interviewDetails?.interviewResult === 'passed' ? 'text-green-600' : 
                           job.interviewDetails?.interviewResult === 'failed' ? 'text-red-600' : 
                           'text-yellow-600')
                        : 'text-blue-600';
                      
                      return (
                        <div key={job.id} className={`p-3 rounded-lg border ${cardColor}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Building2 className={`h-4 w-4 ${iconColor}`} />
                                <h4 className={`font-medium text-sm ${iconColor.replace('text-', 'text-').replace('-600', '-900')}`}>
                                  {job.companyName}
                                </h4>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  isInterview ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {isInterview ? 'Mülakat' : 'İş Yerleştirme'}
                                </span>
                              </div>
                              <div className={`space-y-1 text-xs ${iconColor.replace('text-', 'text-').replace('-600', '-800')}`}>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Pozisyon:</span>
                                  <span>{job.position}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3" />
                                  <span className="truncate">{job.companyAddress}</span>
                                </div>
                                {job.interviewDetails && (
                                  <div className="flex items-center gap-1">
                                    <span>Sonuç:</span>
                                    <span className={cn(
                                      "px-1 py-0.5 rounded text-xs",
                                      job.interviewDetails.interviewResult === 'passed' 
                                        ? "bg-green-100 text-green-800" 
                                        : job.interviewDetails.interviewResult === 'failed'
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    )}>
                                      {job.interviewDetails.interviewResult === 'passed' ? 'Olumlu' : 
                                       job.interviewDetails.interviewResult === 'failed' ? 'Olumsuz' : 'Beklemede'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4">
                      <Briefcase className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm mb-3">Henüz mülakat veya iş yerleştirme kaydı bulunmuyor</p>
                    </div>
                  )}
                </div>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Not Ekle</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="note">Not</Label>
            <Textarea
              id="note"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Adayla ilgili notunuzu buraya yazın..."
              className="mt-2"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddNoteDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleAddNote}>
              Not Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Waiting Dialog */}
      <Dialog open={isWaitingDialogOpen} onOpenChange={setIsWaitingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adayı Bekleme Moduna Al</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Dönüş Tarihi</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-2",
                    !waitingDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {waitingDate ? format(waitingDate, "dd/MM/yyyy") : "Dönüş tarihi seçin"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={waitingDate}
                  onSelect={setWaitingDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWaitingDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={() => updateWaitingStatus(true, waitingDate)}>
              Bekleme Moduna Al
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Class Confirmation Dialog */}
      <Dialog open={isClassConfirmDialogOpen} onOpenChange={setIsClassConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sınıf Yerleştirme Onayı</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Sınıf yerleştirme durumu</Label>
            <RadioGroup 
              value={classConfirmation} 
              onValueChange={(value: 'pending' | 'confirmed') => setClassConfirmation(value)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending">Beklemede</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="confirmed" id="confirmed" />
                <Label htmlFor="confirmed">Onaylandı</Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClassConfirmDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={() => updateClassConfirmation(classConfirmation === 'confirmed')}>
              Güncelle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Adayı Reddet</AlertDialogTitle>
            <AlertDialogDescription>
              Bu adayı reddetmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Red Nedeni *</Label>
            <RadioGroup 
              value={rejectionReason} 
              onValueChange={setRejectionReason}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Gerekli Belgeler Eksik" id="documents" />
                <Label htmlFor="documents">Gerekli Belgeler Eksik</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Dil Seviyesi Yetersiz" id="language" />
                <Label htmlFor="language">Dil Seviyesi Yetersiz</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yaş Sınırı" id="age" />
                <Label htmlFor="age">Yaş Sınırı</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Sağlık Raporu Uygun Değil" id="health" />
                <Label htmlFor="health">Sağlık Raporu Uygun Değil</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Diğer" id="other" />
                <Label htmlFor="other">Diğer</Label>
              </div>
            </RadioGroup>
            
            <Label className="mt-4 block">Ek Not</Label>
            <Textarea
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="Red nedeniyle ilgili ek açıklama..."
              className="mt-2"
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleRejectCandidate} className="bg-red-600 hover:bg-red-700">
              Adayı Reddet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Job Placement Dialog */}
      <AddJobPlacementDialog
        open={isAddJobPlacementDialogOpen}
        onOpenChange={setIsAddJobPlacementDialogOpen}
        onSuccess={handleAddJobPlacement}
      />

      {/* Add Interview Dialog */}
      <AddInterviewDialog
        open={isAddInterviewDialogOpen}
        onOpenChange={setIsAddInterviewDialogOpen}
        onSuccess={handleAddJobPlacement}
      />
    </div>
  );
};

export default CandidateDetails;