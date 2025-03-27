
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Edit, Trash2, Calendar, FileText, MessageSquare, PlusCircle, Phone } from 'lucide-react';
import { mockCandidates, formatDate, getStatusLabel } from '@/lib/mock-data';
import StatusBadge from '@/components/StatusBadge';
import { QRCodeSVG } from 'qrcode.react';
import ProcessStageIcon from '@/components/ProcessStageIcon';
import { Button } from '@/components/ui/button';
import UpdateStageDialog from '@/components/UpdateStageDialog';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(() => 
    mockCandidates.find(c => c.id === id) || null
  );
  const [isUpdateStageDialogOpen, setIsUpdateStageDialogOpen] = useState(false);
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  
  if (!candidate) {
    return (
      <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Aday bulunamadı</h2>
          <Link to="/candidates" className="btn-primary">
            Adaylara Dön
          </Link>
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
        description: `Aşama "${prev.stage}" konumundan "${newStage}" konumuna güncellendi.`
      };
      
      return {
        ...prev,
        stage: newStage,
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
          
          <div className="flex flex-wrap gap-2 mt-6">
            <Button variant="outline" className="inline-flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Düzenle
            </Button>
            <Button variant="outline" className="inline-flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Rapor İndir
            </Button>
            <Button variant="outline" className="inline-flex items-center text-red-600 hover:text-red-700">
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </Button>
          </div>
        </div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
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
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <div className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <ProcessStageIcon stage={candidate.stage} className="h-5 w-5 text-primary" />
                  {candidate.stage}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    Aday şu anda <strong>{candidate.stage}</strong> aşamasında ve durumu <strong>{getStatusLabel(candidate.status)}</strong>.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={() => setIsUpdateStageDialogOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Aşama Güncelle
                </Button>
              </div>
            </div>
            
            {/* Documents */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Belgeler</h2>
                </div>
                <button className="text-primary hover:text-primary/80 text-sm font-medium">
                  <PlusCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {candidate.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium">{doc.name}</div>
                        <div className="text-xs text-gray-500">{formatDate(doc.dateUploaded)}</div>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-primary">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
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
    </div>
  );
};

export default CandidateDetails;
