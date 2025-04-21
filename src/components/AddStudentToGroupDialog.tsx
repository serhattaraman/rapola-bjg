
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { mockCandidates } from "@/lib/mock-data";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Users, Search } from "lucide-react";

interface AddStudentToGroupDialogProps {
  groupId: string;
  onStudentsAdd: (studentIds: string[]) => void;
}

export function AddStudentToGroupDialog({ groupId, onStudentsAdd }: AddStudentToGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Get students not in this group
  const availableStudents = mockCandidates.filter(c => c.group !== groupId);
  
  // Filter students based on search query
  const filteredStudents = availableStudents.filter(student => 
    `${student.firstName} ${student.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedStudents.length === 0) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen en az bir öğrenci seçin.",
      });
      return;
    }

    onStudentsAdd(selectedStudents);
    setOpen(false);
    setSelectedStudents([]);
    setSearchQuery("");

    toast({
      title: "Başarılı",
      description: "Seçilen öğrenciler gruba eklendi.",
    });
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(current => 
      current.includes(studentId) 
        ? current.filter(id => id !== studentId)
        : [...current, studentId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#9b87f5] hover:bg-[#7E69AB]">
          <Users className="mr-2" />
          Öğrenci Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Gruba Öğrenci Ekle</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Öğrenci ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded">
                  <Checkbox
                    id={student.id}
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => handleStudentToggle(student.id)}
                  />
                  <label
                    htmlFor={student.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {student.firstName} {student.lastName}
                  </label>
                </div>
              ))}
              {filteredStudents.length === 0 && (
                <p className="text-center text-sm text-gray-500 py-4">
                  {searchQuery ? 'Aranan öğrenci bulunamadı.' : 'Eklenebilecek öğrenci bulunamadı.'}
                </p>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button type="submit">Ekle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
