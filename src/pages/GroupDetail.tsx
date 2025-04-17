
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Users, FileChart, UserCheck, FileClock, FileX } from 'lucide-react';
import { mockCandidates } from '@/lib/mock-data';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import ExamStatsBadge from '@/components/ExamStatsBadge';

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Get all candidates in this group
  const groupCandidates = useMemo(() => {
    return mockCandidates.filter(candidate => candidate.group === id);
  }, [id]);
  
  // If no candidates in group, show error
  if (groupCandidates.length === 0) {
    return (
      <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <Link to="/groups" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Tüm Gruplar
            </Link>
          </div>
          
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Grup Bulunamadı</h1>
            <p className="text-gray-500">
              "{id}" kodlu grup bulunamadı veya bu grupta hiç öğrenci yok.
            </p>
            <Button asChild className="mt-6">
              <Link to="/groups">Tüm Gruplara Dön</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate group statistics
  const groupStats = useMemo(() => {
    const level = id?.split('-')[0]; // e.g., A1, B2
    
    let instructor = groupCandidates[0].responsiblePerson || 'Atanmamış';
    
    // Exam stats
    const examStats = {
      passed: 0,
      failed: 0,
      notTaken: 0
    };
    
    groupCandidates.forEach(candidate => {
      const levelExam = candidate.examResults?.find(e => e.level === level);
      if (levelExam) {
        if (levelExam.passed) {
          examStats.passed++;
        } else {
          examStats.failed++;
        }
      } else {
        examStats.notTaken++;
      }
    });
    
    return {
      name: id,
      level,
      instructor,
      candidateCount: groupCandidates.length,
      examStats
    };
  }, [groupCandidates, id]);

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link to="/groups" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Tüm Gruplar
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Group Info Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${
                    groupStats.level.startsWith('A1') ? 'bg-green-500' :
                    groupStats.level.startsWith('A2') ? 'bg-blue-500' :
                    groupStats.level.startsWith('B1') ? 'bg-violet-500' : 'bg-amber-500'
                  }`}></span>
                  <CardTitle>{groupStats.name}</CardTitle>
                </div>
                <CardDescription>
                  Grup Detayları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Öğrenci Sayısı</p>
                      <p className="font-medium">{groupStats.candidateCount} kişi</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Eğitmen</p>
                      <p className="font-medium">{groupStats.instructor}</p>
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <p className="text-sm text-gray-500 mb-2 flex items-center">
                      <FileChart className="h-4 w-4 mr-2" />
                      Sınav Durumu
                    </p>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                          <span className="text-sm">Geçen</span>
                        </div>
                        <span className="text-sm font-medium">{groupStats.examStats.passed} kişi</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                          <span className="text-sm">Kalan</span>
                        </div>
                        <span className="text-sm font-medium">{groupStats.examStats.failed} kişi</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-gray-300 rounded-full"></span>
                          <span className="text-sm">Girmemiş</span>
                        </div>
                        <span className="text-sm font-medium">{groupStats.examStats.notTaken} kişi</span>
                      </div>
                      
                      <div className="pt-2">
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Başarı Oranı</span>
                          <span>{groupStats.candidateCount > 0 
                            ? Math.round((groupStats.examStats.passed / (groupStats.examStats.passed + groupStats.examStats.failed)) * 100) || 0
                            : 0}%</span>
                        </div>
                        <Progress 
                          value={groupStats.candidateCount > 0 
                            ? (groupStats.examStats.passed / Math.max(1, groupStats.examStats.passed + groupStats.examStats.failed)) * 100 
                            : 0}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Student List */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Öğrenciler
                </CardTitle>
                <CardDescription>
                  Bu grupta toplam {groupStats.candidateCount} öğrenci bulunuyor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ad Soyad</TableHead>
                        <TableHead>Sınav Durumu</TableHead>
                        <TableHead className="hidden md:table-cell">Son Güncelleme</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupCandidates.map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell>
                            <Link to={`/candidate/${candidate.id}`} className="font-medium hover:underline">
                              {candidate.firstName} {candidate.lastName}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <ExamStatsBadge examResults={candidate.examResults} />
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-gray-500">
                            {format(new Date(candidate.updatedAt || candidate.appliedAt), 'dd.MM.yyyy')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
