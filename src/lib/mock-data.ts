
import { faker } from '@faker-js/faker';

// Define the types
export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  staff?: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  appliedAt: Date | string;
  stage: string;
  status: CandidateStatus;
  timeline: TimelineEvent[];
  notes: string[];
  returnDate?: Date | string;
  classConfirmation?: 'pending' | 'confirmed';
}

export type CandidateStatus = 'pending' | 'inProgress' | 'waiting' | 'completed' | 'rejected';

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getDaysRemaining = (returnDate: Date | string | undefined): number => {
  if (!returnDate) return 0;
  const now = new Date();
  const returnDateTime = new Date(returnDate).getTime();
  const timeDiff = returnDateTime - now.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const getStatusLabel = (status: CandidateStatus): string => {
  switch (status) {
    case 'pending':
      return 'Beklemede';
    case 'inProgress':
      return 'Devam Ediyor';
    case 'waiting':
      return 'Beklemede';
    case 'completed':
      return 'Tamamlandı';
    case 'rejected':
      return 'Reddedildi';
    default:
      return 'Bilinmiyor';
  }
};

// Define the helper functions referenced in Index.tsx
export const getStatusCount = () => {
  const total = mockCandidates.length;
  const pending = mockCandidates.filter(c => c.status === 'pending').length;
  const inProgress = mockCandidates.filter(c => c.status === 'inProgress').length;
  const waiting = mockCandidates.filter(c => c.status === 'waiting').length;
  const completed = mockCandidates.filter(c => c.status === 'completed').length;
  const rejected = mockCandidates.filter(c => c.status === 'rejected').length;
  
  return { total, pending, inProgress, waiting, completed, rejected };
};

export const getRecentApplications = () => {
  return [...mockCandidates]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, 5);
};

export const getApplicationTrend = () => {
  // Generate last 7 days application trend
  const result = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric' });
    
    // Random count between 1-10 for demo purposes
    const count = Math.floor(Math.random() * 10) + 1;
    
    result.push({
      date: dateStr,
      count: count
    });
  }
  
  return result;
};

export const getStageDistribution = () => {
  const stages = {};
  
  mockCandidates.forEach(candidate => {
    if (!stages[candidate.stage]) {
      stages[candidate.stage] = 0;
    }
    stages[candidate.stage]++;
  });
  
  return Object.entries(stages).map(([name, value]) => ({ name, value }));
};

const generateTimeline = (): TimelineEvent[] => {
  const timeline: TimelineEvent[] = [
    {
      id: `timeline-${Date.now()}-1`,
      date: faker.date.past(),
      title: 'Başvuru Alındı',
      description: 'Adayın başvurusu başarıyla alındı.',
      staff: faker.person.fullName(),
    },
    {
      id: `timeline-${Date.now()}-2`,
      date: faker.date.past(),
      title: 'Telefon Görüşmesi',
      description: 'Aday ile telefon görüşmesi yapıldı.',
      staff: faker.person.fullName(),
    },
    {
      id: `timeline-${Date.now()}-3`,
      date: faker.date.recent(),
      title: 'İK Görüşmesi',
      description: 'Aday ile İK görüşmesi yapıldı.',
      staff: faker.person.fullName(),
    },
  ];
  return timeline;
};

export const mockCandidates: Candidate[] = [
  {
    id: "candidate-1",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Sınıf Yerleştirme",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    classConfirmation: 'pending',
  },
  {
    id: "candidate-2",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "İK Görüşmesi",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
  },
  {
    id: "candidate-3",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Evrak Toplama",
    status: 'waiting',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    returnDate: faker.date.future(),
  },
  {
    id: "candidate-4",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Vize Süreci",
    status: 'completed',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
  },
  {
    id: "candidate-5",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Başvuru Alındı",
    status: 'rejected',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
  },
  {
    id: "candidate-6",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Sertifika Süreci",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
  },
  {
    id: "candidate-7",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Denklik Süreci",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
  },
  {
    id: "candidate-8",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Sınıf Yerleştirme",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    classConfirmation: 'pending',
  },
  {
    id: "candidate-9",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Telefon Görüşmesi",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
  },
  {
    id: "candidate-10",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Evrak Toplama",
    status: 'waiting',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    returnDate: faker.date.future(),
  },
];
