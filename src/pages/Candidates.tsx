
import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, CalendarRange, FileSpreadsheet } from 'lucide-react';
import { mockCandidates, CandidateStatus } from '@/lib/mock-data';
import CandidateCard from '@/components/CandidateCard';
import SearchBar from '@/components/SearchBar';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";
import { toast } from "@/hooks/use-toast";
import ExamStatsBadge from '@/components/ExamStatsBadge';
import * as XLSX from 'xlsx';

// Define all possible process stages for filtering
const allProcessStages = [
  "Başvuru Alındı",
  "Telefon Görüşmesi",
  "İK Görüşmesi",
  "Evrak Toplama",
  "Sisteme Evrak Girişi",
  "Sınıf Yerleştirme",
  "Denklik Süreci",
  "Vize Süreci",
  "Sertifika Süreci"
];

// Define available groups for filtering
const allGroups = [
  "A1-1", "A1-2", "A1-3", "A1-4", "A1-5", "A1-6", "A1-7", "A1-8", "A1-9", "A1-10",
  "A2-1", "A2-2", "A2-3", "A2-4", "A2-5",  
  "B1-1", "B1-2", "B1-3",
  "B2-1"
];

// Number of candidates to show per page
const CANDIDATES_PER_PAGE = 20;

// Class confirmation filter options
type ClassConfirmationFilter = 'all' | 'pending' | 'confirmed';

const Candidates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');
  const [stageFilter, setStageFilter] = useState<string | 'all'>('all');
  const [groupFilter, setGroupFilter] = useState<string | 'all'>('all');
  const [professionFilter, setProfessionFilter] = useState<string | 'all'>('all');
  const [classConfirmationFilter, setClassConfirmationFilter] = useState<ClassConfirmationFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Get unique stages that exist in the current candidate data
  const uniqueStages = useMemo(() => {
    const stages = new Set<string>();
    mockCandidates.forEach(candidate => {
      stages.add(candidate.stage);
    });
    return Array.from(stages);
  }, []);

  // Get unique groups from candidates
  const uniqueGroups = useMemo(() => {
    const groups = new Set<string>();
    mockCandidates.forEach(candidate => {
      if (candidate.group) {
        groups.add(candidate.group);
      }
    });
    return Array.from(groups);
  }, []);

  // Get unique professions from candidates
  const uniqueProfessions = useMemo(() => {
    const professions = new Set<string>();
    mockCandidates.forEach(candidate => {
      if (candidate.profession) {
        professions.add(candidate.profession);
      }
    });
    return Array.from(professions).sort();
  }, []);

  // Combine predefined stages with any unique stages from the data
  const allStages = useMemo(() => {
    const combinedStages = new Set([...allProcessStages]);
    uniqueStages.forEach(stage => combinedStages.add(stage));
    return Array.from(combinedStages);
  }, [uniqueStages]);

  // Reset class confirmation filter when stage filter changes
  const handleStageFilterChange = (stage: string | 'all') => {
    setStageFilter(stage);
    setClassConfirmationFilter('all');
  };

  const filteredCandidates = useMemo(() => {
    return mockCandidates.filter(candidate => {
      // Filter by search query
      const matchesSearch = 
        searchQuery === '' || 
        `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
      
      // Filter by stage
      const matchesStage = stageFilter === 'all' || candidate.stage === stageFilter;
      
      // Filter by group
      const matchesGroup = groupFilter === 'all' || candidate.group === groupFilter;
      
      // Filter by profession
      const matchesProfession = professionFilter === 'all' || candidate.profession === professionFilter;
      
      // Filter by class confirmation (only for "Sınıf Yerleştirme" stage)
      let matchesClassConfirmation = true;
      if (stageFilter === "Sınıf Yerleştirme" && classConfirmationFilter !== 'all') {
        if (classConfirmationFilter === 'pending') {
          matchesClassConfirmation = candidate.classConfirmation === 'pending';
        } else if (classConfirmationFilter === 'confirmed') {
          matchesClassConfirmation = candidate.classConfirmation === 'confirmed';
        }
      }

      // Filter by date range
      let matchesDateRange = true;
      if (startDate && endDate) {
        const appliedDate = new Date(candidate.appliedAt);
        matchesDateRange = isWithinInterval(appliedDate, {
          start: startOfDay(startDate),
          end: endOfDay(endDate)
        });
      }
      
      return matchesSearch && matchesStatus && matchesStage && matchesGroup && matchesProfession && matchesClassConfirmation && matchesDateRange;
    });
  }, [searchQuery, statusFilter, stageFilter, groupFilter, professionFilter, classConfirmationFilter, startDate, endDate]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredCandidates.length / CANDIDATES_PER_PAGE);
  
  // Get paginated candidates
  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * CANDIDATES_PER_PAGE;
    return filteredCandidates.slice(startIndex, startIndex + CANDIDATES_PER_PAGE);
  }, [filteredCandidates, currentPage]);

  // Generate array of page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show class confirmation filters only when "Sınıf Yerleştirme" stage is selected
  const showClassConfirmationFilters = stageFilter === "Sınıf Yerleştirme";

  // Clear date filters
  const clearDateFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    toast({
      description: "Tarih filtreleri temizlendi",
    });
  };

  // Export to Excel
  const exportToExcel = () => {
    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(
      filteredCandidates.map(candidate => ({
        'Ad': candidate.firstName,
        'Soyad': candidate.lastName,
        'Email': candidate.email,
        'Telefon': candidate.phone,
        'Pozisyon': candidate.position,
        'Meslek': candidate.profession,
        'Yaş': candidate.age,
        'Grup': candidate.group || 'Atanmamış',
        'Başvuru Tarihi': candidate.appliedAt instanceof Date 
          ? format(candidate.appliedAt, 'dd.MM.yyyy') 
          : format(new Date(candidate.appliedAt), 'dd.MM.yyyy'),
        'Süreç': candidate.stage,
        'Durum': statusFilter === 'pending' ? 'Beklemede' : 
                 statusFilter === 'inProgress' ? 'İşlemde' : 
                 statusFilter === 'completed' ? 'Tamamlandı' : 
                 statusFilter === 'rejected' ? 'Reddedildi' : 'Bilinmiyor',
        'A1 Sınavı': candidate.examResults?.find(e => e.level === 'A1')?.passed ? 'Geçti' : 'Kalmadı / Yok',
        'A2 Sınavı': candidate.examResults?.find(e => e.level === 'A2')?.passed ? 'Geçti' : 'Kalmadı / Yok',
        'B1 Sınavı': candidate.examResults?.find(e => e.level === 'B1')?.passed ? 'Geçti' : 'Kalmadı / Yok',
        'B2 Sınavı': candidate.examResults?.find(e => e.level === 'B2')?.passed ? 'Geçti' : 'Kalmadı / Yok',
        
      }))
    );

    // Create workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Adaylar");

    // Generate Excel file
    const fileName = startDate && endDate
      ? `Adaylar_${format(startDate, 'dd-MM-yyyy')}_${format(endDate, 'dd-MM-yyyy')}.xlsx`
      : `Adaylar_${format(new Date(), 'dd-MM-yyyy')}.xlsx`;
      
    XLSX.writeFile(workbook, fileName);

    toast({
      title: "Rapor indirildi",
      description: `${filteredCandidates.length} aday içeren Excel dosyası indirildi.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Adaylar</h1>
            <p className="text-gray-500 mt-1">Tüm adayları görüntüleyin ve yönetin</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center btn-secondary"
            >
              <SlidersHorizontal className="mr-2 h-5 w-5" />
              Filtreler
            </button>
            
            <Button
              onClick={exportToExcel}
              variant="outline"
              className="inline-flex items-center"
            >
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              Excel'e Aktar
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 animate-slide-in">
          <div className="flex flex-col md:flex-row gap-4">
            <SearchBar 
              onSearch={setSearchQuery} 
              placeholder="Aday ara..." 
              className="md:w-96"
            />
            
            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={startDate ? "text-primary" : ""}>
                    <CalendarRange className="mr-2 h-4 w-4" />
                    {startDate && endDate ? (
                      `${format(startDate, 'dd.MM.yyyy')} - ${format(endDate, 'dd.MM.yyyy')}`
                    ) : (
                      'Tarih Filtresi'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: startDate,
                      to: endDate,
                    }}
                    onSelect={(range) => {
                      setStartDate(range?.from);
                      setEndDate(range?.to);
                    }}
                    numberOfMonths={2}
                    className="p-3 pointer-events-auto"
                  />
                  <div className="flex justify-end gap-2 p-3 border-t">
                    <Button variant="ghost" size="sm" onClick={clearDateFilter}>
                      Temizle
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {showFilters && (
              <div className="flex flex-col gap-4 w-full">
                {/* Status Filters */}
                <div className="flex flex-wrap items-center gap-2 pb-2">
                  <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                    <Filter className="w-4 h-4 inline-block mr-1" />
                    Durum:
                  </span>
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === 'all' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tümü
                  </button>
                  <button
                    onClick={() => setStatusFilter('pending')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === 'pending' 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    Beklemede
                  </button>
                  <button
                    onClick={() => setStatusFilter('inProgress')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === 'inProgress' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    İşlemde
                  </button>
                  <button
                    onClick={() => setStatusFilter('completed')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === 'completed' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    Tamamlandı
                  </button>
                  <button
                    onClick={() => setStatusFilter('rejected')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      statusFilter === 'rejected' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    Reddedildi
                  </button>
                </div>
                
                {/* Stage Filters */}
                <div className="flex flex-wrap items-center gap-2 pb-2">
                  <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                    <Filter className="w-4 h-4 inline-block mr-1" />
                    Süreç:
                  </span>
                  <button
                    onClick={() => handleStageFilterChange('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      stageFilter === 'all' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tüm Süreçler
                  </button>
                  {allStages.map((stage) => (
                    <button
                      key={stage}
                      onClick={() => handleStageFilterChange(stage)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center ${
                        stageFilter === stage 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>

                {/* Group Filters */}
                <div className="flex flex-wrap items-center gap-2 pb-2">
                  <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                    <Filter className="w-4 h-4 inline-block mr-1" />
                    Grup:
                  </span>
                  <button
                    onClick={() => setGroupFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      groupFilter === 'all' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tüm Gruplar
                  </button>
                  {uniqueGroups.map((group) => (
                    <button
                      key={group}
                      onClick={() => setGroupFilter(group)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center ${
                        groupFilter === group 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {group}
                    </button>
                  ))}
                </div>

                {/* Profession Filters */}
                <div className="flex flex-wrap items-center gap-2 pb-2">
                  <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                    <Filter className="w-4 h-4 inline-block mr-1" />
                    Meslek:
                  </span>
                  <button
                    onClick={() => setProfessionFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      professionFilter === 'all' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tüm Meslekler
                  </button>
                  {uniqueProfessions.map((profession) => (
                    <button
                      key={profession}
                      onClick={() => setProfessionFilter(profession)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center ${
                        professionFilter === profession 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {profession}
                    </button>
                  ))}
                </div>

                {/* Class Confirmation Filters - Only show when Sınıf Yerleştirme is selected */}
                {showClassConfirmationFilters && (
                  <div className="flex flex-wrap items-center gap-2 pl-8 pb-2 mt-1 border-l-2 border-primary/30">
                    <span className="text-sm font-medium text-gray-500 whitespace-nowrap">
                      <Filter className="w-4 h-4 inline-block mr-1" />
                      Sınıf Onayı:
                    </span>
                    <button
                      onClick={() => setClassConfirmationFilter('all')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        classConfirmationFilter === 'all' 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Tümü
                    </button>
                    <button
                      onClick={() => setClassConfirmationFilter('pending')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        classConfirmationFilter === 'pending' 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                      }`}
                    >
                      Sınıf Onayı Bekliyor
                    </button>
                    <button
                      onClick={() => setClassConfirmationFilter('confirmed')}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        classConfirmationFilter === 'confirmed' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      Sınıf Onayı Verildi
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-500">
            {filteredCandidates.length} aday bulundu (Sayfa {currentPage}/{totalPages || 1})
            {startDate && endDate && (
              <span className="ml-2">
                • {format(startDate, 'dd.MM.yyyy')} - {format(endDate, 'dd.MM.yyyy')} tarih aralığı
              </span>
            )}
          </div>
        </div>

        {/* Candidates List */}
        <div className="flex flex-col gap-6 animate-slide-in">
          {paginatedCandidates.length > 0 ? (
            paginatedCandidates.map(candidate => (
              <div key={candidate.id} className="relative">
                <CandidateCard candidate={candidate} />
                <div className="mt-2 ml-1">
                  <ExamStatsBadge examResults={candidate.examResults} />
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500">Aradığınız kriterlere uygun aday bulunamadı.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                {/* Previous page button */}
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {/* Page numbers */}
                {pageNumbers.map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {/* Next page button */}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
