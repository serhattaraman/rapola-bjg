export type CandidateStatus = 'pending' | 'inProgress' | 'completed' | 'rejected' | 'waiting';

export type Candidate = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  appliedAt: Date;
  status: CandidateStatus;
  stage: string;
  returnDate?: Date; // Optional return date for waiting status
  notes: string[];
  documents: {
    id: string;
    name: string;
    dateUploaded: Date;
    type: string;
  }[];
  timeline: {
    id: string;
    date: Date;
    title: string;
    description: string;
    staff?: string; // Added staff field
  }[];
};

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    email: 'ahmet.yilmaz@example.com',
    phone: '+90 532 123 4567',
    position: 'Frontend Developer',
    appliedAt: new Date('2023-09-15'),
    status: 'inProgress',
    stage: 'Belge Kontrol',
    notes: [
      'İlk görüşme olumlu geçti',
      'Referans kontrolleri tamamlandı'
    ],
    documents: [
      {
        id: 'd1',
        name: 'CV',
        dateUploaded: new Date('2023-09-15'),
        type: 'pdf'
      },
      {
        id: 'd2',
        name: 'Diploma',
        dateUploaded: new Date('2023-09-16'),
        type: 'pdf'
      }
    ],
    timeline: [
      {
        id: 't1',
        date: new Date('2023-09-15'),
        title: 'Başvuru alındı',
        description: 'Online başvuru formu dolduruldu',
        staff: 'Ayşe Kara'
      },
      {
        id: 't2',
        date: new Date('2023-09-20'),
        title: 'İlk değerlendirme',
        description: 'CV değerlendirmesi olumlu sonuçlandı',
        staff: 'Mehmet Demir'
      },
      {
        id: 't3',
        date: new Date('2023-09-25'),
        title: 'Teknik mülakat',
        description: 'Teknik mülakat başarıyla tamamlandı',
        staff: 'Selin Yıldız'
      }
    ]
  },
  {
    id: '2',
    firstName: 'Zeynep',
    lastName: 'Kaya',
    email: 'zeynep.kaya@example.com',
    phone: '+90 533 456 7890',
    position: 'UX Designer',
    appliedAt: new Date('2023-09-10'),
    status: 'completed',
    stage: 'Vize Onayı',
    notes: [
      'Portfolyo çok etkileyici',
      'İş teklifini kabul etti'
    ],
    documents: [
      {
        id: 'd3',
        name: 'CV',
        dateUploaded: new Date('2023-09-10'),
        type: 'pdf'
      },
      {
        id: 'd4',
        name: 'Portfolyo',
        dateUploaded: new Date('2023-09-11'),
        type: 'pdf'
      }
    ],
    timeline: [
      {
        id: 't4',
        date: new Date('2023-09-10'),
        title: 'Başvuru alındı',
        description: 'Online başvuru formu dolduruldu'
      },
      {
        id: 't5',
        date: new Date('2023-09-12'),
        title: 'Portfolyo değerlendirmesi',
        description: 'Portfolyo değerlendirmesi olumlu sonuçlandı'
      },
      {
        id: 't6',
        date: new Date('2023-09-15'),
        title: 'Tasarım mülakat',
        description: 'Tasarım challenge başarıyla tamamlandı'
      },
      {
        id: 't7',
        date: new Date('2023-09-20'),
        title: 'İş teklifi',
        description: 'İş teklifi yapıldı ve kabul edildi'
      },
      {
        id: 't8',
        date: new Date('2023-09-25'),
        title: 'Evrak süreci',
        description: 'Gerekli evraklar tamamlandı'
      },
      {
        id: 't9',
        date: new Date('2023-10-05'),
        title: 'Vize onayı',
        description: 'Vize onayı alındı'
      }
    ]
  },
  {
    id: '3',
    firstName: 'Mehmet',
    lastName: 'Demir',
    email: 'mehmet.demir@example.com',
    phone: '+90 534 789 0123',
    position: 'Backend Developer',
    appliedAt: new Date('2023-09-05'),
    status: 'pending',
    stage: 'Mülakat',
    notes: [
      'Teknik becerileri güçlü',
      'İletişim becerileri geliştirilmeli'
    ],
    documents: [
      {
        id: 'd5',
        name: 'CV',
        dateUploaded: new Date('2023-09-05'),
        type: 'pdf'
      },
      {
        id: 'd6',
        name: 'GitHub Portfolio',
        dateUploaded: new Date('2023-09-06'),
        type: 'link'
      }
    ],
    timeline: [
      {
        id: 't10',
        date: new Date('2023-09-05'),
        title: 'Başvuru alındı',
        description: 'Online başvuru formu dolduruldu'
      },
      {
        id: 't11',
        date: new Date('2023-09-08'),
        title: 'CV değerlendirmesi',
        description: 'CV değerlendirmesi olumlu sonuçlandı'
      },
      {
        id: 't12',
        date: new Date('2023-09-12'),
        title: 'Teknik değerlendirme',
        description: 'Teknik ödev gönderildi'
      }
    ]
  },
  {
    id: '4',
    firstName: 'Ayşe',
    lastName: 'Şahin',
    email: 'ayse.sahin@example.com',
    phone: '+90 535 012 3456',
    position: 'Project Manager',
    appliedAt: new Date('2023-08-25'),
    status: 'rejected',
    stage: 'Final Değerlendirme',
    notes: [
      'Deneyimi yetersiz',
      'Başka bir pozisyon için değerlendirilebilir'
    ],
    documents: [
      {
        id: 'd7',
        name: 'CV',
        dateUploaded: new Date('2023-08-25'),
        type: 'pdf'
      },
      {
        id: 'd8',
        name: 'Sertifikalar',
        dateUploaded: new Date('2023-08-26'),
        type: 'zip'
      }
    ],
    timeline: [
      {
        id: 't13',
        date: new Date('2023-08-25'),
        title: 'Başvuru alındı',
        description: 'Online başvuru formu dolduruldu'
      },
      {
        id: 't14',
        date: new Date('2023-08-28'),
        title: 'İlk değerlendirme',
        description: 'CV değerlendirmesi olumlu sonuçlandı'
      },
      {
        id: 't15',
        date: new Date('2023-09-01'),
        title: 'İlk mülakat',
        description: 'İlk mülakat gerçekleştirildi'
      },
      {
        id: 't16',
        date: new Date('2023-09-10'),
        title: 'İkinci mülakat',
        description: 'İkinci mülakat gerçekleştirildi'
      },
      {
        id: 't17',
        date: new Date('2023-09-15'),
        title: 'Ret kararı',
        description: 'Deneyim yetersizliği nedeniyle reddedildi'
      }
    ]
  },
  {
    id: '5',
    firstName: 'Emre',
    lastName: 'Özkan',
    email: 'emre.ozkan@example.com',
    phone: '+90 536 345 6789',
    position: 'DevOps Engineer',
    appliedAt: new Date('2023-09-01'),
    status: 'waiting',
    stage: 'Evrak Hazırlığı',
    returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from today
    notes: [
      'Teknik becerileri çok iyi',
      'Vize süreci için evrakları hazırlanıyor',
      'Adayın belgeleri tamamlaması bekleniyor'
    ],
    documents: [
      {
        id: 'd9',
        name: 'CV',
        dateUploaded: new Date('2023-09-01'),
        type: 'pdf'
      },
      {
        id: 'd10',
        name: 'Referans Mektupları',
        dateUploaded: new Date('2023-09-02'),
        type: 'pdf'
      }
    ],
    timeline: [
      {
        id: 't18',
        date: new Date('2023-09-01'),
        title: 'Başvuru alındı',
        description: 'Online başvuru formu dolduruldu',
        staff: 'Ayşe Kaya'
      },
      {
        id: 't19',
        date: new Date('2023-09-05'),
        title: 'CV değerlendirmesi',
        description: 'CV değerlendirmesi olumlu sonuçlandı',
        staff: 'Mehmet Demir'
      },
      {
        id: 't20',
        date: new Date('2023-09-10'),
        title: 'Teknik mülakat',
        description: 'Teknik mülakat başarıyla tamamlandı',
        staff: 'Ali Yıldız'
      },
      {
        id: 't21',
        date: new Date('2023-09-15'),
        title: 'İş teklifi',
        description: 'İş teklifi yapıldı ve kabul edildi',
        staff: 'Zeynep Çelik'
      },
      {
        id: 't22',
        date: new Date('2023-09-20'),
        title: 'Evrak hazırlığı',
        description: 'Vize için gerekli evraklar hazırlanıyor',
        staff: 'Hakan Demir'
      },
      {
        id: 't23',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        title: 'Bekleme moduna alındı',
        description: 'Adayın belgeleri tamamlaması için süreç beklemeye alındı',
        staff: 'Hakan Demir'
      }
    ]
  }
];

export const getStatusCount = () => {
  const counts = {
    pending: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0,
    waiting: 0,
    total: mockCandidates.length
  };

  mockCandidates.forEach(candidate => {
    counts[candidate.status]++;
  });

  return counts;
};

export const getRecentApplications = () => {
  return [...mockCandidates]
    .sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime())
    .slice(0, 5);
};

export const getApplicationTrend = () => {
  // Mock data for application trends over the last 7 days
  const today = new Date();
  const data = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
      count: Math.floor(Math.random() * 10) + 1 // Random number between 1-10
    });
  }

  return data;
};

export const getStageDistribution = () => {
  const stages = {};
  
  mockCandidates.forEach(candidate => {
    if (stages[candidate.stage]) {
      stages[candidate.stage]++;
    } else {
      stages[candidate.stage] = 1;
    }
  });
  
  return Object.entries(stages).map(([name, value]) => ({ name, value }));
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString('tr-TR');
};

export const getStatusLabel = (status: CandidateStatus) => {
  switch (status) {
    case 'pending':
      return 'Beklemede';
    case 'inProgress':
      return 'İşlemde';
    case 'completed':
      return 'Tamamlandı';
    case 'rejected':
      return 'Reddedildi';
    case 'waiting':
      return 'Bekleme Modu';
    default:
      return 'Bilinmiyor';
  }
};

// Calculate days remaining until return date
export const getDaysRemaining = (returnDate: Date | undefined): number => {
  if (!returnDate) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const returnDay = new Date(returnDate);
  returnDay.setHours(0, 0, 0, 0);
  
  const diffTime = returnDay.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};
