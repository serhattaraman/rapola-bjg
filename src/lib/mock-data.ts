import { faker } from '@faker-js/faker';

export type CandidateStatus = 'pending' | 'inProgress' | 'completed' | 'rejected' | 'waiting';
export type ClassConfirmation = 'pending' | 'confirmed';

export interface ExamResult {
  level: string;
  passed: boolean;
  score?: number;
  date?: Date | string;
}

export interface TimelineEvent {
  id: string;
  date: Date | string;
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
  profession: string;
  age: number;
  appliedAt: Date | string;
  status: CandidateStatus;
  stage: string;
  processDays: number;
  startDate: Date | string;
  endDate: Date | string;
  responsiblePerson?: string;
  classConfirmation?: ClassConfirmation;
  examResults?: ExamResult[];
  returnDate?: Date | string;
  rejectionReason?: string;
  rejectionNote?: string;
  notes?: string[];
  timeline?: TimelineEvent[];
  stageTimeline?: {
    stage: string;
    date: Date | string;
    completedOn?: Date | string;
  }[];
}

// Modified to ensure logical exam progression: You must pass previous level to take next exam
const generateRandomExamResults = (): ExamResult[] => {
  const levels = ['A1', 'A2', 'B1', 'B2'];
  const results: ExamResult[] = [];
  
  // Start with A1
  const a1Passed = faker.datatype.boolean();
  results.push({
    level: 'A1',
    passed: a1Passed,
    score: faker.number.int({ min: a1Passed ? 60 : 30, max: a1Passed ? 100 : 59 }),
    date: faker.date.past(),
  });
  
  // Only continue to A2 if A1 was passed
  if (a1Passed) {
    const a2Passed = faker.datatype.boolean();
    results.push({
      level: 'A2',
      passed: a2Passed,
      score: faker.number.int({ min: a2Passed ? 60 : 30, max: a2Passed ? 100 : 59 }),
      date: faker.date.recent({ days: 60 }),
    });
    
    // Only continue to B1 if A2 was passed
    if (a2Passed) {
      const b1Passed = faker.datatype.boolean();
      results.push({
        level: 'B1',
        passed: b1Passed,
        score: faker.number.int({ min: b1Passed ? 60 : 30, max: b1Passed ? 100 : 59 }),
        date: faker.date.recent({ days: 30 }),
      });
      
      // Only continue to B2 if B1 was passed
      if (b1Passed) {
        const b2Passed = faker.datatype.boolean();
        results.push({
          level: 'B2',
          passed: b2Passed,
          score: faker.number.int({ min: b2Passed ? 60 : 30, max: b2Passed ? 100 : 59 }),
          date: faker.date.recent({ days: 15 }),
        });
      }
    }
  }
  
  return results;
};

// Generate random timeline events
const generateRandomTimeline = (candidate: Partial<Candidate>): TimelineEvent[] => {
  const stages = [
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
  
  const currentStageIndex = stages.findIndex(stage => stage === candidate.stage);
  const completedStages = stages.slice(0, currentStageIndex + 1);
  
  return completedStages.map((stage, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (completedStages.length - index) * 5);
    
    return {
      id: `timeline-${faker.string.uuid()}`,
      date,
      title: stage,
      description: `${stage} aşaması tamamlandı.`,
      staff: faker.person.fullName()
    };
  }).reverse();
};

// Generate random stage timeline
const generateStageTimeline = (candidate: Partial<Candidate>): any[] => {
  const stages = [
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
  
  const currentStageIndex = stages.findIndex(stage => stage === candidate.stage);
  const completedStages = stages.slice(0, currentStageIndex + 1);
  
  return completedStages.map((stage, index) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (completedStages.length - index) * 10);
    
    const completedDate = index < currentStageIndex ? new Date(startDate) : undefined;
    if (completedDate) {
      completedDate.setDate(startDate.getDate() + faker.number.int({ min: 3, max: 8 }));
    }
    
    return {
      stage,
      date: startDate,
      completedOn: completedDate
    };
  });
};

const generateCandidate = (): Candidate => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const position = faker.person.jobTitle();
  const profession = faker.helpers.arrayElement(['Hemşirelik', 'Öğretmen', 'Mühendis', 'Doktor', 'Avukat', 'Diğer']);
  const status = faker.helpers.arrayElement<CandidateStatus>(['pending', 'inProgress', 'completed', 'rejected', 'waiting']);
  const startDate = faker.date.past();
  const endDate = faker.date.future();
  const processDays = faker.number.int({ min: 5, max: 120 });
  
  const stage = faker.helpers.arrayElement<string>([
    "Başvuru Alındı",
    "Telefon Görüşmesi",
    "İK Görüşmesi",
    "Evrak Toplama",
    "Sisteme Evrak Girişi",
    "Sınıf Yerleştirme",
    "Denklik Süreci",
    "Vize Süreci",
    "Sertifika Süreci"
  ]);

  const candidate: Candidate = {
    id: faker.string.uuid(),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    phone: faker.phone.number(),
    position,
    profession,
    age: faker.number.int({ min: 18, max: 65 }),
    appliedAt: faker.date.past(),
    status,
    stage,
    processDays,
    startDate,
    endDate,
    responsiblePerson: faker.person.fullName(),
    classConfirmation: faker.helpers.arrayElement<ClassConfirmation>(['pending', 'confirmed']),
    examResults: generateRandomExamResults(),
    notes: faker.helpers.maybe(() => [
      faker.lorem.paragraph(),
      faker.lorem.paragraph(),
    ], { probability: 0.7 }),
  };
  
  // Add timeline events
  candidate.timeline = generateRandomTimeline(candidate);
  // Add stage timeline
  candidate.stageTimeline = generateStageTimeline(candidate);
  
  // Add waiting mode data if applicable
  if (status === 'waiting') {
    candidate.returnDate = faker.date.future();
  }
  
  // Add rejection reason if applicable
  if (status === 'rejected') {
    candidate.rejectionReason = faker.helpers.arrayElement([
      'Evrak Eksikliği',
      'Uygun Olmayan Profil',
      'Aday Vazgeçti',
      'Başka Programı Seçti',
      'Sağlık Sorunları'
    ]);
    candidate.rejectionNote = faker.helpers.maybe(() => faker.lorem.sentence(), { probability: 0.6 });
  }

  return candidate;
};

export const mockCandidates: Candidate[] = Array.from({ length: 67 }, generateCandidate);

export const getStatusCount = () => {
  return {
    total: mockCandidates.length,
    pending: mockCandidates.filter(c => c.status === 'pending').length,
    inProgress: mockCandidates.filter(c => c.status === 'inProgress').length,
    completed: mockCandidates.filter(c => c.status === 'completed').length,
    rejected: mockCandidates.filter(c => c.status === 'rejected').length,
    waiting: mockCandidates.filter(c => c.status === 'waiting').length,
  };
};

export const getRecentApplications = () => {
  return mockCandidates.slice(0, 5).map(candidate => ({
    id: candidate.id,
    name: `${candidate.firstName} ${candidate.lastName}`,
    position: candidate.position,
    appliedAt: candidate.appliedAt,
    status: candidate.status,
  }));
};

export const getApplicationTrend = () => {
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  }).reverse();

  return last7Days.map(date => ({
    date,
    count: faker.number.int({ min: 5, max: 20 }),
  }));
};

export const getStageDistribution = () => {
  const stages = [
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

  return stages.map(stage => ({
    name: stage,
    value: mockCandidates.filter(c => c.stage === stage).length,
  }));
};

export const getProfessionDistribution = () => {
  const professions = ['Hemşirelik', 'Öğretmen', 'Mühendis', 'Doktor', 'Avukat', 'Diğer'];

  return professions.map(profession => {
    const candidatesInProfession = mockCandidates.filter(c => c.profession === profession);
    const under42 = candidatesInProfession.filter(c => c.age < 42).length;
    const over42 = candidatesInProfession.filter(c => c.age >= 42).length;

    return {
      name: profession,
      count: candidatesInProfession.length,
      under42,
      over42,
    };
  });
};

export const getAgeDistribution = () => {
  return [
    { name: '42 yaş altı', value: mockCandidates.filter(c => c.age < 42).length },
    { name: '42 yaş ve üstü', value: mockCandidates.filter(c => c.age >= 42).length },
  ];
};

// Updated getExamStatistics to consider the new exam generation logic
export const getExamStatistics = () => {
  const a1Total = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'A1')).length;
  const a1Passed = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'A1' && e.passed)).length;
  const a1Failed = a1Total - a1Passed;
  
  const a2Total = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'A2')).length;
  const a2Passed = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'A2' && e.passed)).length;
  const a2Failed = a2Total - a2Passed;
  
  const b1Total = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'B1')).length;
  const b1Passed = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'B1' && e.passed)).length;
  const b1Failed = b1Total - b1Passed;
  
  const b2Total = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'B2')).length;
  const b2Passed = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'B2' && e.passed)).length;
  const b2Failed = b2Total - b2Passed;
  
  return {
    a1: { passed: a1Passed, failed: a1Failed, total: a1Total },
    a2: { passed: a2Passed, failed: a2Failed, total: a2Total },
    b1: { passed: b1Passed, failed: b1Failed, total: b1Total },
    b2: { passed: b2Passed, failed: b2Failed, total: b2Total }
  };
};

// Helper functions for date formatting and calculations
export const formatDate = (date?: string | Date): string => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export const calculateDurationInDays = (startDate: Date | string, endDate: Date | string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatDuration = (days: number): string => {
  if (days === 0) return 'Bugün';
  if (days === 1) return '1 gün';
  return `${days} gün`;
};

export const getDaysRemaining = (returnDate?: Date | string): number => {
  if (!returnDate) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const endDate = new Date(returnDate);
  endDate.setHours(0, 0, 0, 0);
  
  const diffTime = endDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getStatusLabel = (status: CandidateStatus): string => {
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
