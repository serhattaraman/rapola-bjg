
import { format, differenceInDays, addDays } from 'date-fns';

// Candidate status types
export type CandidateStatus = 'pending' | 'inProgress' | 'waiting' | 'rejected' | 'completed';

// Timeline event interface
export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  staff?: string;
}

// Update the Candidate type to include the missing properties
export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  stage: string;
  status: CandidateStatus;
  appliedAt: Date;
  lastUpdatedAt: Date;
  returnDate?: Date;
  timeline: TimelineEvent[];
  notes: string[];
  responsiblePerson?: string;
  classConfirmation?: 'pending' | 'confirmed';
  rejectionReason?: string;
  rejectionNote?: string;
  stageTimeline?: {
    stage: string;
    date: Date;
    completedOn?: Date;
  }[];
}

// Helper function to format dates
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return 'Belirtilmemiş';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'dd.MM.yyyy');
};

// Helper function to calculate duration in days
export const calculateDurationInDays = (startDate: Date | string, endDate: Date | string): number => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return differenceInDays(end, start);
};

// Helper function to format duration
export const formatDuration = (days: number): string => {
  if (days === 0) return 'Bugün';
  if (days === 1) return '1 gün';
  return `${days} gün`;
};

// Helper function to get status label
export const getStatusLabel = (status: CandidateStatus): string => {
  switch (status) {
    case 'pending':
      return 'Beklemede';
    case 'inProgress':
      return 'İşlemde';
    case 'waiting':
      return 'Bekleme Modu';
    case 'rejected':
      return 'Reddedildi';
    case 'completed':
      return 'Tamamlandı';
    default:
      return 'Bilinmiyor';
  }
};

// Calculate days remaining until a date
export const getDaysRemaining = (date: Date | string | undefined): number => {
  if (!date) return 0;
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return differenceInDays(targetDate, today);
};

// Helper functions for statistics needed in Index page
export const getStatusCount = (candidates: Candidate[]) => {
  return candidates.reduce((count, candidate) => {
    count[candidate.status] = (count[candidate.status] || 0) + 1;
    return count;
  }, {} as Record<string, number>);
};

export const getRecentApplications = (candidates: Candidate[], days = 30) => {
  const cutoffDate = addDays(new Date(), -days);
  return candidates.filter(candidate => candidate.appliedAt > cutoffDate);
};

export const getApplicationTrend = (candidates: Candidate[]) => {
  // Simple mock implementation - would be more complex in real app
  return [
    { name: 'Jan', count: 4 },
    { name: 'Feb', count: 6 },
    { name: 'Mar', count: 8 },
    { name: 'Apr', count: 10 },
    { name: 'May', count: 12 },
  ];
};

export const getStageDistribution = (candidates: Candidate[]) => {
  const stageCount = candidates.reduce((count, candidate) => {
    count[candidate.stage] = (count[candidate.stage] || 0) + 1;
    return count;
  }, {} as Record<string, number>);

  return Object.entries(stageCount).map(([name, value]) => ({ name, value }));
};

export const getProfessionDistribution = (candidates: Candidate[]) => {
  const professionCount = candidates.reduce((count, candidate) => {
    count[candidate.position] = (count[candidate.position] || 0) + 1;
    return count;
  }, {} as Record<string, number>);

  return Object.entries(professionCount).map(([name, value]) => ({ name, value }));
};

export const getAgeDistribution = () => {
  // Mock implementation for age distribution
  return [
    { name: '20-30', value: 10 },
    { name: '30-40', value: 15 },
    { name: '40-50', value: 8 },
    { name: '50+', value: 5 },
  ];
};

// Make sure mockCandidates have the new properties when needed
export const mockCandidates: Candidate[] = [
  {
    id: 'c1',
    firstName: 'Ali',
    lastName: 'Yılmaz',
    email: 'ali.yilmaz@example.com',
    phone: '05321234567',
    position: 'Aile Hekimi',
    stage: 'İK Görüşmesi',
    status: 'inProgress',
    appliedAt: new Date('2023-05-15'),
    lastUpdatedAt: new Date('2023-05-20'),
    notes: [
      'İlk görüşmede çok istekli görünüyordu.',
      'Belgeleri tamamlaması için süre verildi.'
    ],
    timeline: [
      {
        id: 'tl1',
        date: new Date('2023-05-15'),
        title: 'Başvuru Alındı',
        description: 'Aday başvurusu sistem üzerinden alındı.'
      },
      {
        id: 'tl2',
        date: new Date('2023-05-17'),
        title: 'Telefon Görüşmesi',
        description: 'İlk telefon görüşmesi yapıldı, aday uygun bulundu.'
      },
      {
        id: 'tl3',
        date: new Date('2023-05-20'),
        title: 'İK Görüşmesi',
        description: 'İK departmanı ile görüşme yapıldı.'
      }
    ],
    responsiblePerson: 'Ayşe Demir',
    stageTimeline: [
      {
        stage: 'Başvuru Alındı',
        date: new Date('2023-05-15'),
        completedOn: new Date('2023-05-16')
      },
      {
        stage: 'Telefon Görüşmesi',
        date: new Date('2023-05-17'),
        completedOn: new Date('2023-05-18')
      },
      {
        stage: 'İK Görüşmesi',
        date: new Date('2023-05-20')
      }
    ]
  },
  {
    id: 'c2',
    firstName: 'Ayşe',
    lastName: 'Kaya',
    email: 'ayse.kaya@example.com',
    phone: '05331234567',
    position: 'Çocuk Doktoru',
    stage: 'Evrak Toplama',
    status: 'waiting',
    appliedAt: new Date('2023-05-10'),
    lastUpdatedAt: new Date('2023-05-18'),
    returnDate: new Date('2023-06-10'),
    notes: [
      'Adayın diploma denklik belgesi eksik.',
      'Denklik belgesi için 10 Haziran\'a kadar süre verildi.'
    ],
    timeline: [
      {
        id: 'tl4',
        date: new Date('2023-05-10'),
        title: 'Başvuru Alındı',
        description: 'Aday başvurusu sistem üzerinden alındı.'
      },
      {
        id: 'tl5',
        date: new Date('2023-05-12'),
        title: 'Telefon Görüşmesi',
        description: 'İlk telefon görüşmesi yapıldı, aday uygun bulundu.'
      },
      {
        id: 'tl6',
        date: new Date('2023-05-15'),
        title: 'İK Görüşmesi',
        description: 'İK departmanı ile görüşme yapıldı.'
      },
      {
        id: 'tl7',
        date: new Date('2023-05-18'),
        title: 'Evrak Toplama',
        description: 'Evrak toplama aşamasına geçildi.'
      },
      {
        id: 'tl8',
        date: new Date('2023-05-18'),
        title: 'Durum Değişikliği',
        description: 'Durum "İşlemde" konumundan "Beklemede" konumuna güncellendi. Dönüş tarihi: 10.06.2023'
      }
    ],
    responsiblePerson: 'Mehmet Yılmaz',
    stageTimeline: [
      {
        stage: 'Başvuru Alındı',
        date: new Date('2023-05-10'),
        completedOn: new Date('2023-05-11')
      },
      {
        stage: 'Telefon Görüşmesi',
        date: new Date('2023-05-12'),
        completedOn: new Date('2023-05-14')
      },
      {
        stage: 'İK Görüşmesi',
        date: new Date('2023-05-15'),
        completedOn: new Date('2023-05-17')
      },
      {
        stage: 'Evrak Toplama',
        date: new Date('2023-05-18')
      }
    ]
  },
  {
    id: 'c3',
    firstName: 'Mehmet',
    lastName: 'Demir',
    email: 'mehmet.demir@example.com',
    phone: '05341234567',
    position: 'Genel Cerrah',
    stage: 'Sınıf Yerleştirme',
    status: 'inProgress',
    appliedAt: new Date('2023-05-05'),
    lastUpdatedAt: new Date('2023-05-25'),
    notes: [
      'Tüm evraklar tamamlandı.',
      'Sınıf yerleştirme için onay bekleniyor.'
    ],
    timeline: [
      {
        id: 'tl9',
        date: new Date('2023-05-05'),
        title: 'Başvuru Alındı',
        description: 'Aday başvurusu sistem üzerinden alındı.'
      },
      {
        id: 'tl10',
        date: new Date('2023-05-08'),
        title: 'Telefon Görüşmesi',
        description: 'İlk telefon görüşmesi yapıldı, aday uygun bulundu.'
      },
      {
        id: 'tl11',
        date: new Date('2023-05-12'),
        title: 'İK Görüşmesi',
        description: 'İK departmanı ile görüşme yapıldı.'
      },
      {
        id: 'tl12',
        date: new Date('2023-05-15'),
        title: 'Evrak Toplama',
        description: 'Evrak toplama aşamasına geçildi.'
      },
      {
        id: 'tl13',
        date: new Date('2023-05-20'),
        title: 'Sisteme Evrak Girişi',
        description: 'Evraklar sisteme girildi.'
      },
      {
        id: 'tl14',
        date: new Date('2023-05-25'),
        title: 'Sınıf Yerleştirme',
        description: 'Sınıf yerleştirme aşamasına geçildi.'
      }
    ],
    classConfirmation: 'pending',
    responsiblePerson: 'Ayşe Demir',
    stageTimeline: [
      {
        stage: 'Başvuru Alındı',
        date: new Date('2023-05-05'),
        completedOn: new Date('2023-05-07')
      },
      {
        stage: 'Telefon Görüşmesi',
        date: new Date('2023-05-08'),
        completedOn: new Date('2023-05-11')
      },
      {
        stage: 'İK Görüşmesi',
        date: new Date('2023-05-12'),
        completedOn: new Date('2023-05-14')
      },
      {
        stage: 'Evrak Toplama',
        date: new Date('2023-05-15'),
        completedOn: new Date('2023-05-19')
      },
      {
        stage: 'Sisteme Evrak Girişi',
        date: new Date('2023-05-20'),
        completedOn: new Date('2023-05-24')
      },
      {
        stage: 'Sınıf Yerleştirme',
        date: new Date('2023-05-25')
      }
    ]
  },
  {
    id: 'c4',
    firstName: 'Zeynep',
    lastName: 'Şahin',
    email: 'zeynep.sahin@example.com',
    phone: '05351234567',
    position: 'Kardiyolog',
    stage: 'Başvuru Alındı',
    status: 'rejected',
    appliedAt: new Date('2023-05-01'),
    lastUpdatedAt: new Date('2023-05-03'),
    notes: [
      'Aday deneyim kriterlerini karşılamıyor.',
      'Başvuru reddedildi.'
    ],
    timeline: [
      {
        id: 'tl15',
        date: new Date('2023-05-01'),
        title: 'Başvuru Alındı',
        description: 'Aday başvurusu sistem üzerinden alındı.'
      },
      {
        id: 'tl16',
        date: new Date('2023-05-03'),
        title: 'Aday Reddedildi',
        description: 'Red nedeni: Yeterli Deneyim Yok - Not: En az 3 yıl deneyim gerekiyor.'
      }
    ],
    rejectionReason: 'Yeterli Deneyim Yok',
    rejectionNote: 'En az 3 yıl deneyim gerekiyor.',
    responsiblePerson: 'Mehmet Yılmaz',
    stageTimeline: [
      {
        stage: 'Başvuru Alındı',
        date: new Date('2023-05-01')
      }
    ]
  },
  {
    id: 'c5',
    firstName: 'Mustafa',
    lastName: 'Öztürk',
    email: 'mustafa.ozturk@example.com',
    phone: '05361234567',
    position: 'Nörolog',
    stage: 'Denklik Süreci',
    status: 'inProgress',
    appliedAt: new Date('2023-04-20'),
    lastUpdatedAt: new Date('2023-05-30'),
    notes: [
      'Denklik başvurusu yapıldı.',
      'Denklik onayı bekleniyor.'
    ],
    timeline: [
      {
        id: 'tl17',
        date: new Date('2023-04-20'),
        title: 'Başvuru Alındı',
        description: 'Aday başvurusu sistem üzerinden alındı.'
      },
      {
        id: 'tl18',
        date: new Date('2023-04-22'),
        title: 'Telefon Görüşmesi',
        description: 'İlk telefon görüşmesi yapıldı, aday uygun bulundu.'
      },
      {
        id: 'tl19',
        date: new Date('2023-04-25'),
        title: 'İK Görüşmesi',
        description: 'İK departmanı ile görüşme yapıldı.'
      },
      {
        id: 'tl20',
        date: new Date('2023-04-28'),
        title: 'Evrak Toplama',
        description: 'Evrak toplama aşamasına geçildi.'
      },
      {
        id: 'tl21',
        date: new Date('2023-05-05'),
        title: 'Sisteme Evrak Girişi',
        description: 'Evraklar sisteme girildi.'
      },
      {
        id: 'tl22',
        date: new Date('2023-05-10'),
        title: 'Sınıf Yerleştirme',
        description: 'Sınıf yerleştirme aşamasına geçildi.'
      },
      {
        id: 'tl23',
        date: new Date('2023-05-15'),
        title: 'Sınıf Onayı',
        description: 'Sınıf yerleştirme onaylandı.'
      },
      {
        id: 'tl24',
        date: new Date('2023-05-30'),
        title: 'Denklik Süreci',
        description: 'Denklik süreci başlatıldı.'
      }
    ],
    classConfirmation: 'confirmed',
    responsiblePerson: 'Ayşe Demir',
    stageTimeline: [
      {
        stage: 'Başvuru Alındı',
        date: new Date('2023-04-20'),
        completedOn: new Date('2023-04-21')
      },
      {
        stage: 'Telefon Görüşmesi',
        date: new Date('2023-04-22'),
        completedOn: new Date('2023-04-24')
      },
      {
        stage: 'İK Görüşmesi',
        date: new Date('2023-04-25'),
        completedOn: new Date('2023-04-27')
      },
      {
        stage: 'Evrak Toplama',
        date: new Date('2023-04-28'),
        completedOn: new Date('2023-05-04')
      },
      {
        stage: 'Sisteme Evrak Girişi',
        date: new Date('2023-05-05'),
        completedOn: new Date('2023-05-09')
      },
      {
        stage: 'Sınıf Yerleştirme',
        date: new Date('2023-05-10'),
        completedOn: new Date('2023-05-29')
      },
      {
        stage: 'Denklik Süreci',
        date: new Date('2023-05-30')
      }
    ]
  }
];
