
import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { mockCandidates, CandidateStatus } from '@/lib/mock-data';
import CandidateCard from '@/components/CandidateCard';
import SearchBar from '@/components/SearchBar';
import StatusBadge from '@/components/StatusBadge';

const Candidates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

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
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
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
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
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
            )}
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-500">
            {filteredCandidates.length} aday bulundu
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))
          ) : (
            <div className="col-span-3 py-20 text-center">
              <p className="text-gray-500">Aradığınız kriterlere uygun aday bulunamadı.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Candidates;
