import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addSubProcess, deleteSubProcess, ProcessStage } from '@/lib/process-data';

interface SubProcessManagerProps {
  stage: ProcessStage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const SubProcessManager = ({ stage, open, onOpenChange, onSuccess }: SubProcessManagerProps) => {
  const [newSubProcessName, setNewSubProcessName] = useState('');
  const [newSubProcessDescription, setNewSubProcessDescription] = useState('');
  const { toast } = useToast();

  const handleAddSubProcess = () => {
    if (!newSubProcessName.trim()) {
      toast({
        title: "Hata",
        description: "Alt süreç adı gereklidir.",
        variant: "destructive",
      });
      return;
    }

    addSubProcess(stage.id, {
      name: newSubProcessName.trim(),
      description: newSubProcessDescription.trim(),
    });

    setNewSubProcessName('');
    setNewSubProcessDescription('');
    
    toast({
      title: "Başarılı",
      description: "Alt süreç eklendi.",
    });

    onSuccess();
  };

  const handleDeleteSubProcess = (subProcessId: string) => {
    if (window.confirm('Bu alt süreci silmek istediğinizden emin misiniz?')) {
      deleteSubProcess(stage.id, subProcessId);
      toast({
        title: "Başarılı",
        description: "Alt süreç silindi.",
      });
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{stage.name} - Alt Süreç Yönetimi</DialogTitle>
          <DialogDescription>
            Bu sürecin alt süreçlerini yönetin
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add new subprocess */}
          <div className="space-y-4 p-4 border rounded-md bg-muted/50">
            <h4 className="font-medium">Yeni Alt Süreç Ekle</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="subProcessName">Alt Süreç Adı *</Label>
                <Input
                  id="subProcessName"
                  value={newSubProcessName}
                  onChange={(e) => setNewSubProcessName(e.target.value)}
                  placeholder="Örn: Belgeler Toplandı"
                />
              </div>
              <div>
                <Label htmlFor="subProcessDescription">Açıklama</Label>
                <Input
                  id="subProcessDescription"
                  value={newSubProcessDescription}
                  onChange={(e) => setNewSubProcessDescription(e.target.value)}
                  placeholder="Opsiyonel açıklama"
                />
              </div>
              <Button onClick={handleAddSubProcess} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Alt Süreç Ekle
              </Button>
            </div>
          </div>

          {/* Existing subprocesses */}
          <div className="space-y-3">
            <h4 className="font-medium">Mevcut Alt Süreçler ({stage.subProcesses.length})</h4>
            {stage.subProcesses.length === 0 ? (
              <p className="text-muted-foreground text-sm">Henüz alt süreç eklenmemiş.</p>
            ) : (
              <div className="space-y-2">
                {stage.subProcesses.map((subProcess, index) => (
                  <div
                    key={subProcess.id}
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {index + 1}
                        </span>
                        <span className="font-medium">{subProcess.name}</span>
                      </div>
                      {subProcess.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {subProcess.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSubProcess(subProcess.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubProcessManager;
