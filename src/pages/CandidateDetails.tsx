
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockCandidates } from '@/lib/mock-data';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarRange, Mail, Phone, MapPin, Briefcase, BadgeInfo } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const CandidateDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(mockCandidates.find(c => c.id === id));
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(candidate?.firstName || '');
  const [lastName, setLastName] = useState(candidate?.lastName || '');
  const [email, setEmail] = useState(candidate?.email || '');
  const [phone, setPhone] = useState(candidate?.phone || '');
  // Since address is not in the Candidate type, we'll store it separately
  const [address, setAddress] = useState('');
  const [position, setPosition] = useState(candidate?.position || '');
  // Ensure notes is always an array
  const [notes, setNotes] = useState<string[]>(['']);
  const [appliedAt, setAppliedAt] = useState<Date | undefined>(candidate?.appliedAt ? new Date(candidate.appliedAt) : undefined);

  useEffect(() => {
    if (id) {
      const foundCandidate = mockCandidates.find(c => c.id === id);
      if (foundCandidate) {
        setCandidate(foundCandidate);
        setFirstName(foundCandidate.firstName);
        setLastName(foundCandidate.lastName);
        setEmail(foundCandidate.email);
        setPhone(foundCandidate.phone);
        // For address, use an empty string if it doesn't exist
        setAddress('');
        setPosition(foundCandidate.position);
        // Ensure notes is treated as an array
        setNotes(foundCandidate.notes || []);
        setAppliedAt(foundCandidate.appliedAt ? new Date(foundCandidate.appliedAt) : undefined);
      } else {
        toast({
          title: "Aday Bulunamadı",
          description: "Aradığınız aday bulunamadı.",
          variant: "destructive",
        });
        navigate('/candidates');
      }
    }
  }, [id, navigate]);

  const formatDate = (date: Date | string): string => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelClick = () => {
    setEditMode(false);
    if (candidate) {
      setFirstName(candidate.firstName);
      setLastName(candidate.lastName);
      setEmail(candidate.email);
      setPhone(candidate.phone);
      // Reset address to empty string
      setAddress('');
      setPosition(candidate.position);
      // Ensure notes is treated as an array
      setNotes(candidate.notes || []);
      setAppliedAt(candidate.appliedAt ? new Date(candidate.appliedAt) : undefined);
    }
  };

  const handleSaveClick = () => {
    if (!candidate) return;

    // Update the candidate in the mock data
    const updatedCandidate = {
      ...candidate,
      firstName,
      lastName,
      email,
      phone,
      position,
      notes,
      appliedAt: appliedAt ? appliedAt.toISOString() : new Date().toISOString(),
    };

    // Find the index of the candidate in the mockCandidates array
    const candidateIndex = mockCandidates.findIndex(c => c.id === candidate.id);

    if (candidateIndex !== -1) {
      // Replace the old candidate with the updated candidate
      mockCandidates[candidateIndex] = updatedCandidate;

      // Update the state with the updated candidate
      setCandidate(updatedCandidate);
      setEditMode(false);

      toast({
        title: "Aday Güncellendi",
        description: "Aday bilgileri başarıyla güncellendi.",
      });
    } else {
      toast({
        title: "Aday Güncellenemedi",
        description: "Aday bilgileri güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  if (!candidate) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{candidate.firstName} {candidate.lastName}</h1>
          <p className="text-gray-500">{candidate.position}</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Contact Information */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BadgeInfo className="h-5 w-5 text-gray-500" />
              İletişim Bilgileri
            </h2>
            {editMode ? (
              <>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="firstName">Ad</Label>
                    <Input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Soyad</Label>
                    <Input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Adres</Label>
                    <Input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Pozisyon</Label>
                    <Input
                      type="text"
                      id="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="appliedAt">Başvuru Tarihi</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !appliedAt && "text-muted-foreground"
                          )}
                        >
                          <CalendarRange className="mr-2 h-4 w-4" />
                          {appliedAt ? (
                            format(appliedAt, "dd/MM/yyyy")
                          ) : (
                            <span>Tarih Seç</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={appliedAt}
                          onSelect={setAppliedAt}
                          disabled={(date) =>
                            date > new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notlar</Label>
                    <Textarea
                      id="notes"
                      value={notes.join('\n')}
                      onChange={(e) => setNotes(e.target.value.split('\n'))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="secondary" onClick={handleCancelClick}>
                    İptal
                  </Button>
                  <Button onClick={handleSaveClick}>Kaydet</Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{candidate.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{address || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span>{candidate.position}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarRange className="h-4 w-4 text-gray-500" />
                    <span>{candidate.appliedAt ? formatDate(candidate.appliedAt) : '-'}</span>
                  </div>
                  <div>
                    <p className="font-semibold">Notlar:</p>
                    <p>{candidate.notes?.join('\n') || 'Yok'}</p>
                  </div>
                </div>
                <Button className="mt-4" onClick={handleEditClick}>
                  Bilgileri Düzenle
                </Button>
              </>
            )}
          </div>

          {/* Exam History */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Sınav Geçmişi</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seviye
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sorumlu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
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
                        {candidate.responsiblePerson || '-'}
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
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
