import { faker } from '@faker-js/faker';

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
  status: 'pending' | 'inProgress' | 'waiting' | 'completed' | 'rejected';
  timeline: TimelineEvent[];
  notes: string[];
  returnDate?: Date | string;
  classConfirmation?: 'pending' | 'confirmed';
}

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

export const getStatusLabel = (status: Candidate['status']): string => {
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

const generateTimeline = (): TimelineEvent[] => {
  const timeline: TimelineEvent[] = [
    {
      id: `timeline-${Date.now()}-1`,
      date: faker.date.past(),
      title: 'Başvuru Alındı',
      description: 'Adayın başvurusu başarıyla alındı.',
      staff: faker.name.fullName(),
    },
    {
      id: `timeline-${Date.now()}-2`,
      date: faker.date.past(),
      title: 'Telefon Görüşmesi',
      description: 'Aday ile telefon görüşmesi yapıldı.',
      staff: faker.name.fullName(),
    },
    {
      id: `timeline-${Date.now()}-3`,
      date: faker.date.recent(),
      title: 'İK Görüşmesi',
      description: 'Aday ile İK görüşmesi yapıldı.',
      staff: faker.name.fullName(),
    },
  ];
  return timeline;
};

export const mockCandidates: Candidate[] = [
  {
    id: "candidate-1",
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.name.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Sınıf Yerleştirme",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    classConfirmation: 'pending',
  },
  {
    id: "candidate-2",
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.name.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "İK Görüşmesi",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
  },
  {
    id: "candidate-3",
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.name.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Evrak Toplama",
    status: 'waiting',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    returnDate: faker.date.future(),
  },
  {
    id: "candidate-4",
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.name.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Vize Süreci",
    status: 'completed',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
  },
  {
    id: "candidate-5",
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.name.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Başvuru Alındı",
    status: 'rejected',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
  },
  {
    id: "candidate-6",
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.name.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Sertifika Süreci",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
  },
  {
    id: "candidate-7",
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.name.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Denklik Süreci",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
  },
  {
    id: "candidate-8",
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.name.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Sınıf Yerleştirme",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    classConfirmation: 'pending',
  },
  {
    id: "candidate-9",
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.name.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Telefon Görüşmesi",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
  },
  {
    id: "candidate-10",
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.name.jobTitle(),
    appliedAt: faker.date.past(),
    stage: "Evrak Toplama",
    status: 'waiting',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    returnDate: faker.date.future(),
  },
];
