import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addProcessStage, SubProcess } from '@/lib/process-data';
import LogoPicker from './LogoPicker';

interface AddProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddProcessDialog = ({ open, onOpenChange, onSuccess }: AddProcessDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [subProcesses, setSubProcesses] = useState<{name: string; description: string}[]>([
    { name: '', description: '' }
  ]);
  const { toast } = useToast();

  const addSubProcess = () => {
    setSubProcesses([...subProcesses, { name: '', description: '' }]);
  };

  const removeSubProcess = (index: number) => {
    setSubProcesses(subProcesses.filter((_, i) => i !== index));
  };

  const updateSubProcess = (index: number, field: 'name' | 'description', value: string) => {
    const updated = [...subProcesses];
    updated[index] = { ...updated[index], [field]: value };
    setSubProcesses(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Hata",
        description: "Süreç adı gereklidir.",
        variant: "destructive",
      });
      return;
    }

    const validSubProcesses = subProcesses.filter(sp => sp.name.trim());
    
    if (validSubProcesses.length === 0) {
      toast({
        title: "Hata",
        description: "En az bir alt süreç gereklidir.",
        variant: "destructive",
      });
      return;
    }

    addProcessStage({
      name: name.trim(),
      description: description.trim(),
      logo: logo.trim() || undefined,
      subProcesses: validSubProcesses.map((sp, index) => ({
        id: `temp-${Date.now()}-${index}`,
        name: sp.name,
        description: sp.description,
        order: index + 1,
        stageId: 'temp'
      }))
    });

    toast({
      title: "Başarılı",
      description: "Yeni süreç eklendi.",
    });

    // Reset form
    setName('');
    setDescription('');
    setLogo('');
    setSubProcesses([{ name: '', description: '' }]);
    
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Süreç Ekle</DialogTitle>
          <DialogDescription>
            Yeni bir ana süreç ve alt süreçlerini tanımlayın
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Süreç Adı *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Telefon Görüşmesi"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Süreç hakkında kısa açıklama"
              rows={2}
            />
          </div>

          <LogoPicker
            value={logo}
            onChange={setLogo}
            label="Logo"
          />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Alt Süreçler *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSubProcess}>
                <Plus className="mr-2 h-4 w-4" />
                Alt Süreç Ekle
              </Button>
            </div>
            
            <div className="space-y-3">
              {subProcesses.map((subProcess, index) => (
                <div key={index} className="flex gap-2 p-3 border rounded-md">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Alt süreç adı"
                      value={subProcess.name}
                      onChange={(e) => updateSubProcess(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Açıklama (opsiyonel)"
                      value={subProcess.description}
                      onChange={(e) => updateSubProcess(index, 'description', e.target.value)}
                    />
                  </div>
                  {subProcesses.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubProcess(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit">Süreç Ekle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProcessDialog;