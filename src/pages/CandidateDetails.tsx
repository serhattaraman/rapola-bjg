
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Edit, Trash2, Calendar, FileText, MessageSquare, PlusCircle } from 'lucide-react';
import { mockCandidates, formatDate, getStatusLabel } from '@/lib/mock-data';
import StatusBadge from '@/components/StatusBadge';

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const candidate = mockCandidates.find(c => c.id === id);
  
  if (!candidate) {
    return (
      <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Aday bulunamadı</h2>
          <Link to="/candidates" className="btn-primary">
            Adaylara Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </button>
        </div>

        {/* Candidate Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 animate-scale-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                {candidate.firstName} {candidate.lastName}
              </h1>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-gray-500">
                <span>{candidate.position}</span>
                <span className="hidden sm:inline">•</span>
                <span>{candidate.email}</span>
                <span className="hidden sm:inline">•</span>
                <span>{candidate.phone}</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <StatusBadge status={candidate.status} className="text-base px-4 py-1.5" />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            <button className="btn-secondary inline-flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Düzenle
            </button>
            <button className="btn-secondary inline-flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Rapor İndir
            </button>
            <button className="btn-secondary inline-flex items-center text-red-600 hover:text-red-700">
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </button>
          </div>
        </div>
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Aday Süreci</h2>
                <div className="text-sm text-gray-500">
                  Başvuru: {formatDate(candidate.appliedAt)}
                </div>
              </div>
              
              {/* Timeline */}
              <div className="mt-8">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {candidate.timeline.map((event, eventIdx) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {eventIdx !== candidate.timeline.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-primary" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                                <p className="text-xs text-gray-500">{formatDate(event.date)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 flex justify-center">
                  <button className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Yeni Adım Ekle
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Current Stage */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
              <h2 className="text-lg font-semibold mb-4">Mevcut Aşama</h2>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <div className="text-lg font-medium text-gray-900">{candidate.stage}</div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    Aday şu anda <strong>{candidate.stage}</strong> aşamasında ve durumu <strong>{getStatusLabel(candidate.status)}</strong>.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <button className="w-full btn-primary justify-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Aşama Güncelle
                </button>
              </div>
            </div>
            
            {/* Documents */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Belgeler</h2>
                <button className="text-primary hover:text-primary/80 text-sm font-medium">
                  <PlusCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {candidate.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium">{doc.name}</div>
                        <div className="text-xs text-gray-500">{formatDate(doc.dateUploaded)}</div>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-primary">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Notes */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Notlar</h2>
                <button className="text-primary hover:text-primary/80 text-sm font-medium">
                  <PlusCircle className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {candidate.notes.map((note, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-start">
                      <MessageSquare className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div className="text-sm">{note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
