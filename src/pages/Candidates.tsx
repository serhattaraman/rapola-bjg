
import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { mockCandidates, CandidateStatus } from '@/lib/mock-data';
import CandidateCard from '@/components/CandidateCard';
import SearchBar from '@/components/SearchBar';
import StatusBadge from '@/components/StatusBadge';
import ProcessStageIcon from '@/components/ProcessStageIcon';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

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

// Number of candidates to show per page
const CANDIDATES_PER_PAGE = 20;

const Candidates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');
  const [stageFilter, setStageFilter] = useState<string | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique stages that exist in the current candidate data
  const uniqueStages = useMemo(() => {
    const stages = new Set<string>();
    mockCandidates.forEach(candidate => {
      stages.add(candidate.stage);
    });
    return Array.from(stages);
  }, []);

  // Combine predefined stages with any unique stages from the data
  const allStages = useMemo(() => {
    const combinedStages = new Set([...allProcessStages]);
    uniqueStages.forEach(stage => combinedStages.add(stage));
    return Array.from(combinedStages);
  }, [uniqueStages]);

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
      
      return matchesSearch && matchesStatus && matchesStage;
    });
  }, [searchQuery, statusFilter, stageFilter]);

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

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Adaylar</h1>
            <p className="text-gray-500 mt-1">Tüm adayları görüntüleyin ve yönetin</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center btn-secondary"
            >
              <SlidersHorizontal className="mr-2 h-5 w-5" />
              Filtreler
            </button>
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
                    onClick={() => setStageFilter('all')}
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
                      onClick={() => setStageFilter(stage)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center ${
                        stageFilter === stage 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <ProcessStageIcon stage={stage} size={14} className="mr-1" />
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-500">
            {filteredCandidates.length} aday bulundu (Sayfa {currentPage}/{totalPages || 1})
          </div>
        </div>

        {/* Candidates List */}
        <div className="flex flex-col gap-6 animate-slide-in">
          {paginatedCandidates.length > 0 ? (
            paginatedCandidates.map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} />
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
