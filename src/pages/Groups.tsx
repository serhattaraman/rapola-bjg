
import React, { useState, useMemo } from 'react';
import { ChevronRight, Search, FileChart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { mockCandidates } from '@/lib/mock-data';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';

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

  // Generate groups from candidates
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
  
  // Get unique levels
  const levels = useMemo(() => {
    return [...new Set(groups.map(g => g.level))].sort();
  }, [groups]);
  
  // Filter groups by search query and level
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const matchesSearch = !searchQuery || 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.instructor.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesLevel = !selectedLevel || group.level === selectedLevel;
      
      return matchesSearch && matchesLevel;
    });
  }, [groups, searchQuery, selectedLevel]);

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Gruplar</h1>
            <p className="text-gray-500 mt-1">Tüm sınıf gruplarını görüntüleyin ve yönetin</p>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Grup ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Menubar className="border-none p-0 bg-transparent shadow-none">
            <MenubarMenu>
              <MenubarTrigger className="bg-white border dark:bg-slate-900 px-4 py-2 rounded-md h-10">
                {selectedLevel ? `Seviye: ${selectedLevel}` : "Tüm Seviyeler"}
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem onClick={() => setSelectedLevel(null)}>
                  Tüm Seviyeler
                </MenubarItem>
                {levels.map(level => (
                  <MenubarItem key={level} onClick={() => setSelectedLevel(level)}>
                    {level}
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
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        group.level.startsWith('A1') ? 'bg-green-500' :
                        group.level.startsWith('A2') ? 'bg-blue-500' :
                        group.level.startsWith('B1') ? 'bg-violet-500' : 'bg-amber-500'
                      }`}></span>
                      {group.name}
                    </CardTitle>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">{group.candidateCount}</span>
                      <span className="text-gray-500 ml-1">kişi</span>
                    </div>
                    
                    <div className="text-sm">
                      <div className="text-gray-500 mb-1 flex items-center">
                        <FileChart className="h-4 w-4 mr-2" />
                        Sınav Durumu
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Geçen: {group.examStats.passed}</span>
                          <span>Kalan: {group.examStats.failed}</span>
                          <span>Girmemiş: {group.examStats.notTaken}</span>
                        </div>
                        <Progress 
                          value={group.candidateCount > 0 ? (group.examStats.passed / group.candidateCount) * 100 : 0}
                          className="h-2"
                        />
                      </div>
                    </div>
                    
                    <div className="text-sm pt-2 border-t">
                      <span className="text-gray-500">Eğitmen:</span> 
                      <span className="font-medium ml-1">{group.instructor}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Arama kriterlerinize uygun grup bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
