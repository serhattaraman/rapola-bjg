import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getProcessStagesFromStorage } from "@/lib/process-data";

interface AssignProcessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (stageId: string, assignedStaff: string) => void;
  currentStage?: string;
}

export function AssignProcessDialog({ isOpen, onClose, onAssign, currentStage }: AssignProcessDialogProps) {
  const [selectedStageId, setSelectedStageId] = useState<string>("");
  const [assignedStaff, setAssignedStaff] = useState<string>("");
  const processStages = getProcessStagesFromStorage();

  // Sample staff members - in a real app, this would come from a user management system
  const staffMembers = [
    "Ahmet Yılmaz",
    "Ayşe Demir", 
    "Mehmet Kaya",
    "Fatma Özkan",
    "Ali Şahin",
    "Zeynep Arslan"
  ];

  const handleAssign = () => {
    if (!selectedStageId || !assignedStaff) return;
    
    onAssign(selectedStageId, assignedStaff);
    onClose();
    setSelectedStageId("");
    setAssignedStaff("");
  };

  const handleClose = () => {
    onClose();
    setSelectedStageId("");
    setAssignedStaff("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Süreç Ata</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="stage">Aşama Seç</Label>
            <Select value={selectedStageId} onValueChange={setSelectedStageId}>
              <SelectTrigger>
                <SelectValue placeholder="Bir aşama seçin" />
              </SelectTrigger>
              <SelectContent>
                {processStages.map((stage) => (
                  <SelectItem 
                    key={stage.id} 
                    value={stage.id}
                    disabled={stage.name === currentStage}
                  >
                    {stage.name}
                    {stage.name === currentStage && " (Mevcut)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="staff">Atanan Kişi</Label>
            <Select value={assignedStaff} onValueChange={setAssignedStaff}>
              <SelectTrigger>
                <SelectValue placeholder="Bir kişi seçin" />
              </SelectTrigger>
              <SelectContent>
                {staffMembers.map((staff) => (
                  <SelectItem key={staff} value={staff}>
                    {staff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            İptal
          </Button>
          <Button onClick={handleAssign} disabled={!selectedStageId || !assignedStaff}>
            Ata
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}