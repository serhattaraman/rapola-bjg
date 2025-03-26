
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProcessStageIcon from '@/components/ProcessStageIcon';
import { stageIconMapping } from '@/components/ProcessStageIcon';
import { toast } from '@/components/ui/use-toast';

interface UpdateStageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: string;
  candidateId: string;
  onUpdateStage: (newStage: string) => void;
}

const UpdateStageDialog: React.FC<UpdateStageDialogProps> = ({
  isOpen,
  onClose,
  currentStage,
  candidateId,
  onUpdateStage
}) => {
  const [selectedStage, setSelectedStage] = React.useState(currentStage);

  // Reset selected stage when dialog opens
  React.useEffect(() => {
    setSelectedStage(currentStage);
  }, [currentStage, isOpen]);

  const handleUpdateStage = () => {
    // In a real app, this would make an API call
    onUpdateStage(selectedStage);
    toast({
      title: "Aşama güncellendi",
      description: `Aday aşaması "${selectedStage}" olarak güncellendi.`,
    });
    onClose();
  };

  // Get all available stages from the stageIconMapping
  const availableStages = Object.keys(stageIconMapping);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aday Aşamasını Güncelle</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="stage-select" className="text-sm font-medium">
              Mevcut Aşama
            </label>
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-md border border-primary/20">
              <ProcessStageIcon stage={currentStage} className="h-5 w-5 text-primary" />
              <span className="font-medium">{currentStage}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="stage-select" className="text-sm font-medium">
              Yeni Aşama Seçin
            </label>
            <Select
              value={selectedStage}
              onValueChange={setSelectedStage}
            >
              <SelectTrigger>
                <SelectValue placeholder="Aşama seçin" />
              </SelectTrigger>
              <SelectContent>
                {availableStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    <div className="flex items-center gap-2">
                      <ProcessStageIcon stage={stage} className="h-4 w-4" />
                      <span>{stage}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button onClick={handleUpdateStage}>
            Aşamayı Güncelle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStageDialog;
