import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock } from "lucide-react";
import { SubProcess } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

interface SubProcessCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStage: string;
  subProcesses: SubProcess[];
  completedSubProcesses: string[];
  onSubProcessComplete: (subProcessId: string, notes?: string) => void;
}

const SubProcessCompletionDialog: React.FC<SubProcessCompletionDialogProps> = ({
  open,
  onOpenChange,
  currentStage,
  subProcesses,
  completedSubProcesses,
  onSubProcessComplete
}) => {
  const [selectedSubProcessId, setSelectedSubProcessId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const { toast } = useToast();

  const resetForm = () => {
    setSelectedSubProcessId('');
    setNotes('');
  };

  const handleSubmit = () => {
    if (!selectedSubProcessId) {
      toast({
        title: "Ara süreç seçiniz",
        description: "Lütfen tamamlamak istediğiniz ara süreci seçin",
        variant: "destructive"
      });
      return;
    }

    // Check if already completed
    if (completedSubProcesses.includes(selectedSubProcessId)) {
      toast({
        title: "Ara süreç zaten tamamlanmış",
        description: "Bu ara süreç daha önce tamamlanmış",
        variant: "destructive"
      });
      return;
    }

    onSubProcessComplete(selectedSubProcessId, notes.trim() || undefined);
    resetForm();
    onOpenChange(false);
  };

  const availableSubProcesses = subProcesses.filter(sp => !completedSubProcesses.includes(sp.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ara Süreç Tamamla - {currentStage}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {availableSubProcesses.length > 0 ? (
            <>
              <div>
                <Label className="text-base font-medium">Tamamlanacak Ara Süreç</Label>
                <RadioGroup 
                  value={selectedSubProcessId} 
                  onValueChange={setSelectedSubProcessId}
                  className="mt-3 space-y-3"
                >
                  {availableSubProcesses.map((subProcess) => (
                    <div key={subProcess.id} className="flex items-start space-x-3">
                      <RadioGroupItem value={subProcess.id} id={subProcess.id} className="mt-1" />
                      <div className="space-y-1 flex-1">
                        <Label htmlFor={subProcess.id} className="text-sm font-medium cursor-pointer">
                          {subProcess.name}
                        </Label>
                        {subProcess.description && (
                          <p className="text-xs text-gray-600">{subProcess.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="notes" className="text-base font-medium">Tamamlama Notları (İsteğe Bağlı)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ara süreç tamamlama ile ilgili notlarınızı yazın..."
                  className="mt-2"
                  rows={3}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tüm Ara Süreçler Tamamlandı!</h3>
              <p className="text-sm text-gray-600">
                Bu aşamanın tüm ara süreçleri başarıyla tamamlanmış.
              </p>
            </div>
          )}

          {/* Show completed sub-processes */}
          {completedSubProcesses.length > 0 && (
            <div className="border-t pt-4">
              <Label className="text-sm font-medium text-gray-700">Tamamlanan Ara Süreçler:</Label>
              <div className="mt-2 space-y-2">
                {subProcesses
                  .filter(sp => completedSubProcesses.includes(sp.id))
                  .map((subProcess) => (
                    <div key={subProcess.id} className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span>{subProcess.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            İptal
          </Button>
          {availableSubProcesses.length > 0 && (
            <Button onClick={handleSubmit}>
              Ara Süreç Tamamla
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubProcessCompletionDialog;