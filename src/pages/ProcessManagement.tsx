import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit2, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  getProcessStagesFromStorage, 
  deleteProcessStage, 
  deleteSubProcess,
  ProcessStage
} from '@/lib/process-data';
import AddProcessDialog from '@/components/AddProcessDialog';
import EditProcessDialog from '@/components/EditProcessDialog';
import SubProcessManager from '@/components/SubProcessManager';

const ProcessManagement = () => {
  const [stages, setStages] = useState<ProcessStage[]>(getProcessStagesFromStorage());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<ProcessStage | null>(null);
  const [managingSubProcesses, setManagingSubProcesses] = useState<ProcessStage | null>(null);
  const { toast } = useToast();

  const refreshStages = () => {
    setStages(getProcessStagesFromStorage());
  };

  const handleDeleteStage = (stageId: string) => {
    if (window.confirm('Bu süreci ve tüm alt süreçlerini silmek istediğinizden emin misiniz?')) {
      deleteProcessStage(stageId);
      refreshStages();
      toast({
        title: "Süreç silindi",
        description: "Süreç başarıyla silindi.",
      });
    }
  };

  const handleDeleteSubProcess = (stageId: string, subProcessId: string) => {
    if (window.confirm('Bu alt süreci silmek istediğinizden emin misiniz?')) {
      deleteSubProcess(stageId, subProcessId);
      refreshStages();
      toast({
        title: "Alt süreç silindi",
        description: "Alt süreç başarıyla silindi.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Süreç Yönetimi</h1>
          <p className="text-muted-foreground">Ana süreçleri ve alt süreçleri yönetin - Süreçler paralel olarak çalışabilir</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Süreç Ekle
        </Button>
      </div>

      <div className="grid gap-6">
        {stages.map((stage) => (
          <Card key={stage.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {stage.logo && (
                      <span className="text-lg">{stage.logo}</span>
                    )}
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      Paralel
                    </span>
                    {stage.name}
                  </CardTitle>
                  {stage.description && (
                    <CardDescription>{stage.description}</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setManagingSubProcesses(stage)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingStage(stage)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteStage(stage.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  Alt Süreçler ({stage.subProcesses.length})
                </h4>
                <div className="grid gap-2">
                  {stage.subProcesses.map((subProcess) => (
                    <div
                      key={subProcess.id}
                      className="flex justify-between items-center p-2 bg-muted/50 rounded-md"
                    >
                      <div>
                        <span className="text-sm font-medium">{subProcess.name}</span>
                        {subProcess.description && (
                          <p className="text-xs text-muted-foreground">{subProcess.description}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSubProcess(stage.id, subProcess.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddProcessDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={refreshStages}
      />

      {editingStage && (
        <EditProcessDialog
          stage={editingStage}
          open={!!editingStage}
          onOpenChange={() => setEditingStage(null)}
          onSuccess={refreshStages}
        />
      )}

      {managingSubProcesses && (
        <SubProcessManager
          stage={managingSubProcesses}
          open={!!managingSubProcesses}
          onOpenChange={() => setManagingSubProcesses(null)}
          onSuccess={refreshStages}
        />
      )}
    </div>
  );
};

export default ProcessManagement;