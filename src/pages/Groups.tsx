import React, { useState, useMemo } from 'react';
import { ChevronRight, Search, BarChart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { mockCandidates } from '@/lib/mock-data';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';
import StatCard from "@/components/StatCard";
import { useToast } from "@/hooks/use-toast"; // Bildirim sistemi eklendi
import { AddGroupDialog } from "@/components/AddGroupDialog";
import { InstructorSuccessStats } from '@/components/InstructorSuccessStats';

// Group types
type Group = {
  id: string;
  name: string;
  level: string;
  candidateCount: number;
  instructor: string;
  examStats: {
    passed: number;
    failed: number;
    notTaken: number;
  };
};

const Groups = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const { toast } = useToast(); // Bildirim sistemi hook'u

  // Gruplar ve istatistikler
  const groups = useMemo(() => {
    const groupMap = new Map<string, Group>();

    mockCandidates.forEach(candidate => {
      if (!candidate.group) return;

      const groupId = candidate.group;
      const level = groupId.split('-')[0]; // e.g., A1, B2

      if (!groupMap.has(groupId)) {
        groupMap.set(groupId, {
          id: groupId,
          name: groupId,
          level,
          candidateCount: 1,
          instructor: candidate.responsiblePerson || 'Atanmamış',
          examStats: {
            passed: 0,
            failed: 0,
            notTaken: 0
          }
        });
      } else {
        const group = groupMap.get(groupId)!;
        group.candidateCount++;
      }

      // Update exam stats
      const group = groupMap.get(groupId)!;
      const levelExam = candidate.examResults?.find(e => e.level === level);

      if (levelExam) {
        if (levelExam.passed) {
          group.examStats.passed++;
        } else {
          group.examStats.failed++;
        }
      } else {
        group.examStats.notTaken++;
      }
    });

    return Array.from(groupMap.values());
  }, []);

  // Tüm seviyeler
  const levels = useMemo(() => {
    return [...new Set(groups.map(g => g.level))].sort();
  }, [groups]);

  // Eğitmenler (Atanmamış da dahil)
  const instructors = useMemo(
    () =>
      Array.from(
        new Set(groups.map(group => group.instructor || "Atanmamış"))
      ).sort(),
    [groups]
  );

  // Eğitmen başına toplam başarı oranı
  const instructorSuccessStats = useMemo(() => {
    // { instructor: { total: number, passed: number } }
    const stats: Record<string, { total: number; passed: number }> = {};
    groups.forEach(group => {
      if (!group.instructor) return;
      if (!stats[group.instructor]) stats[group.instructor] = { total: 0, passed: 0 };
      stats[group.instructor].total += group.candidateCount;
      stats[group.instructor].passed += group.examStats.passed;
    });
    // Başarı oranını yüzde olarak hesapla
    const ratio: Record<string, number> = {};
    for (const [instructor, s] of Object.entries(stats)) {
      ratio[instructor] = s.total === 0 ? 0 : (s.passed / s.total) * 100;
    }
    return ratio;
  }, [groups]);

  // Seviye bazlı en iyi eğitmen istatistikleri: { [level]: { instructor: string, rate: number, groupCount: number, candidateCount: number } }
  const levelBestInstructors = useMemo(() => {
    const levelsMap: Record<string, Record<string, { candidateCount: number; passedCount: number }>> = {};
    groups.forEach(group => {
      if (!levelsMap[group.level]) levelsMap[group.level] = {};
      const instr = group.instructor;
      if (!levelsMap[group.level][instr]) {
        levelsMap[group.level][instr] = { candidateCount: 0, passedCount: 0 };
      }
      levelsMap[group.level][instr].candidateCount += group.candidateCount;
      levelsMap[group.level][instr].passedCount += group.examStats.passed;
    });
    // Her seviye için en başarılı eğitmeni bul
    const bests: Record<string, { instructor: string, rate: number, candidateCount: number }> = {};
    Object.entries(levelsMap).forEach(([level, stats]) => {
      let bestInstructor = "Yok";
      let bestRate = 0;
      let count = 0;
      Object.entries(stats).forEach(([inst, { candidateCount, passedCount }]) => {
        const rate = candidateCount > 0 ? (passedCount / candidateCount) * 100 : 0;
        if (rate > bestRate) {
          bestRate = rate;
          bestInstructor = inst;
          count = candidateCount;
        }
      });
      bests[level] = { instructor: bestInstructor, rate: bestRate, candidateCount: count };
    });
    return bests;
  }, [groups]);

  // Filtrele
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const matchesSearch =
        !searchQuery ||
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLevel = !selectedLevel || group.level === selectedLevel;

      const matchesInstructor =
        !selectedInstructor || group.instructor === selectedInstructor;

      return matchesSearch && matchesLevel && matchesInstructor;
    });
  }, [groups, searchQuery, selectedLevel, selectedInstructor]);

  // Sayfa ilk açıldığında örnek bir toast gönderelim (kullanıcıya bildirim sistemi geldiğini göstermek için)
  React.useEffect(() => {
    toast({
      title: "Hoşgeldin!",
      description: "Gruplar sayfasına girdin. Bildirim sistemi aktif.",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddGroup = (groupData: { name: string; level: string; instructor: string }) => {
    // In a real application, this would make an API call to add the group
    toast({
      title: "Grup Eklendi",
      description: `${groupData.name} grubu başarıyla eklendi.`,
    });
  };

  // Calculate instructor success rates per level
  const instructorSuccessPerLevel = useMemo(() => {
    const stats: Record<string, Record<string, { success: number; total: number; rate: number; candidateCount: number }>> = {};
    
    // Initialize stats for each level
    levels.forEach(level => {
      stats[level] = {};
      instructors.forEach(instructor => {
        stats[level][instructor] = { success: 0, total: 0, rate: 0, candidateCount: 0 };
      });
    });
    
    // Calculate stats
    groups.forEach(group => {
      const level = group.level;
      const instructor = group.instructor;
      if (instructor && level) {
        if (!stats[level][instructor]) {
          stats[level][instructor] = { success: 0, total: 0, rate: 0, candidateCount: 0 };
        }
        stats[level][instructor].success += group.examStats.passed;
        stats[level][instructor].total += (group.examStats.passed + group.examStats.failed);
        stats[level][instructor].candidateCount += group.candidateCount;
        stats[level][instructor].rate = stats[level][instructor].total > 0 
          ? (stats[level][instructor].success / stats[level][instructor].total) * 100 
          : 0;
      }
    });

    // Convert to final format
    const result: Record<string, Record<string, { instructor: string; rate: number; candidateCount: number }>> = {};
    Object.entries(stats).forEach(([level, instructorStats]) => {
      result[level] = {};
      Object.entries(instructorStats).forEach(([instructor, stats]) => {
        if (stats.total > 0) {
          result[level][instructor] = {
            instructor,
            rate: stats.rate,
            candidateCount: stats.candidateCount
          };
        }
      });
    });

    return result;
  }, [groups, levels, instructors]);

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gruplar</h1>
            <p className="text-gray-500 mt-1">
              Tüm sınıf gruplarını görüntüleyin ve yönetin
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <AddGroupDialog onGroupAdd={handleAddGroup} />
          </div>
        </div>

        {/* GENEL SEVİYE İSTATİSTİKLERİ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {levels.map(level => (
            <StatCard
              key={level}
              title={`${level} Seviyesinde En Başarılı Eğitmen`}
              value={levelBestInstructors[level]?.instructor || "Yok"}
              subValue={levelBestInstructors[level]?.candidateCount > 0
                ? `${levelBestInstructors[level].rate.toFixed(1)}% başarı`
                : ""}
              description={`Toplam ${levelBestInstructors[level]?.candidateCount || 0} öğrenci`}
              icon={<BarChart className="text-blue-500" />}
              className="bg-white"
            />
          ))}
        </div>

        {/* Instructor Success Statistics Per Level */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Seviye Bazlı Eğitmen Başarı Oranları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {levels.map(level => (
              <InstructorSuccessStats 
                key={level} 
                data={instructorSuccessPerLevel[level] || {}}
                level={level}
              />
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Grup ara..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8"
              data-testid="search-group"
            />
          </div>

          {/* Level Filter */}
          <Menubar className="border-none p-0 bg-transparent shadow-none" data-testid="filter-menubar-level">
            <MenubarMenu>
              <MenubarTrigger className="bg-white border dark:bg-slate-900 px-4 py-2 rounded-md h-10">
                {selectedLevel ? `Seviye: ${selectedLevel}` : "Tüm Seviyeler"}
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => setSelectedLevel(null)}>
                  Tüm Seviyeler
                </MenubarItem>
                {levels.map(level => (
                  <MenubarItem
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          {/* Instructor Filter */}
          <Menubar className="border-none p-0 bg-transparent shadow-none" data-testid="filter-menubar-instructor">
            <MenubarMenu>
              <MenubarTrigger className="bg-white border dark:bg-slate-900 px-4 py-2 rounded-md h-10">
                {selectedInstructor
                  ? `Eğitmen: ${selectedInstructor}`
                  : "Tüm Eğitmenler"}
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => setSelectedInstructor(null)}>
                  Tüm Eğitmenler
                </MenubarItem>
                {instructors.map(instructor => (
                  <MenubarItem
                    key={instructor}
                    onClick={() => setSelectedInstructor(instructor)}
                  >
                    {instructor}
                    <span className="ml-2 text-xs text-green-700">
                      {instructorSuccessStats[instructor]
                        ? `${instructorSuccessStats[instructor].toFixed(1)}% başarı`
                        : "0%"}
                    </span>
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map(group => (
            <Link to={`/group/${group.id}`} key={group.id}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                      <span
                        className={`w-2 h-2 rounded-full mr-2 ${
                          group.level.startsWith('A1')
                            ? 'bg-green-500'
                            : group.level.startsWith('A2')
                            ? 'bg-blue-500'
                            : group.level.startsWith('B1')
                            ? 'bg-violet-500'
                            : 'bg-amber-500'
                        }`}
                      ></span>
                      {group.name}
                    </CardTitle>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">
                        {group.candidateCount}
                      </span>
                      <span className="text-gray-500 ml-1">kişi</span>
                    </div>

                    <div className="text-sm">
                      <div className="text-gray-500 mb-1 flex items-center">
                        <BarChart className="h-4 w-4 mr-2" />
                        Sınav Durumu
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Geçen: {group.examStats.passed}</span>
                          <span>Kalan: {group.examStats.failed}</span>
                          <span>Girmemiş: {group.examStats.notTaken}</span>
                        </div>
                        <Progress
                          value={
                            group.candidateCount > 0
                              ? (group.examStats.passed / group.candidateCount) *
                                100
                              : 0
                          }
                          className="h-2"
                        />
                      </div>
                    </div>

                    <div className="text-sm pt-2 border-t flex flex-col gap-1">
                      <span>
                        <span className="text-gray-500">Eğitmen:</span>
                        <span className="font-medium ml-1">
                          {group.instructor}
                        </span>
                      </span>
                      {/* Eğitmen başarı oranı */}
                      <span className="text-xs text-gray-600">
                        Başarı Oranı:{" "}
                        <span className="font-semibold text-green-700">
                          {instructorSuccessStats[group.instructor]
                            ? `${instructorSuccessStats[
                                group.instructor
                              ].toFixed(1)}%`
                            : "0%"}
                        </span>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Arama kriterlerinize uygun grup bulunamadı.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
