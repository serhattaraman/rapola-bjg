import { faker } from '@faker-js/faker';

// Define the types
export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  staff?: string;
}

export interface StageTimeline {
  stage: string;
  date: Date;
  completedOn?: Date;
}

export interface ExamResult {
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  score?: number;
  date?: Date;
  passed: boolean;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  profession: "nursing" | "mechatronics" | "automotive" | "other";
  age: number;
  appliedAt: Date | string;
  stage: string;
  status: CandidateStatus;
  timeline: TimelineEvent[];
  notes: string[];
  returnDate?: Date | string;
  classConfirmation?: 'pending' | 'confirmed';
  stageTimeline?: StageTimeline[]; // Add to track duration of each stage
  examResults?: ExamResult[];
  rejectionReason?: string;
  rejectionNote?: string;
  responsiblePerson?: string;
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

// Calculate duration between two dates in days
export const calculateDurationInDays = (startDate: Date | string, endDate: Date | string | undefined): number => {
  if (!startDate || !endDate) return 0;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate difference in milliseconds
  const differenceInMs = end.getTime() - start.getTime();
  
  // Convert milliseconds to days
  return Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
};

// Return string representation of duration
export const formatDuration = (days: number): string => {
  if (days === 0) return "Bugün";
  if (days === 1) return "1 gün";
  return `${days} gün`;
};

// Generate random exam results for a candidate
const generateExamResults = (): ExamResult[] => {
  const examLevels = ['A1', 'A2', 'B1', 'B2'] as const;
  const results: ExamResult[] = [];
  
  // For each level, decide if the candidate has taken this exam
  examLevels.forEach((level) => {
    // 70% chance to have taken the exam
    if (Math.random() > 0.3) {
      const score = Math.floor(Math.random() * 40) + 60; // Score between 60-100
      const passed = score >= 70; // Pass threshold at 70
      
      results.push({
        level,
        score,
        date: faker.date.recent({ days: 60 }),
        passed
      });
    }
  });
  
  return results;
};

// Generate stage timeline for a candidate
const generateStageTimeline = (stages: string[]): StageTimeline[] => {
  const now = new Date();
  const stageTimeline: StageTimeline[] = [];
  
  // Start from 3 months ago for the first stage
  let currentDate = new Date(now);
  currentDate.setMonth(currentDate.getMonth() - 3);
  
  stages.forEach((stage, index) => {
    // Add some random days for realistic progression
    const randomDays = Math.floor(Math.random() * 10) + 5;
    currentDate.setDate(currentDate.getDate() + randomDays);
    
    const stageEntry: StageTimeline = {
      stage,
      date: new Date(currentDate)
    };
    
    // If not the last stage, add completion date
    if (index < stages.length - 1) {
      const completionDate = new Date(currentDate);
      const randomCompletionDays = Math.floor(Math.random() * 7) + 1;
      completionDate.setDate(completionDate.getDate() + randomCompletionDays);
      stageEntry.completedOn = completionDate;
    }
    
    stageTimeline.push(stageEntry);
  });
  
  return stageTimeline;
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

// Combine existing getProfessionDistribution with age breakdown
export const getProfessionDistribution = () => {
  const professions = {
    "nursing": { 
      name: "Hemşirelik", 
      count: 0, 
      under42: 0, 
      over42: 0 
    },
    "mechatronics": { 
      name: "Mekatronik", 
      count: 0, 
      under42: 0, 
      over42: 0 
    },
    "automotive": { 
      name: "Otomotiv", 
      count: 0, 
      under42: 0, 
      over42: 0 
    }
  };
  
  mockCandidates.forEach(candidate => {
    if (professions[candidate.profession]) {
      professions[candidate.profession].count++;
      
      if (candidate.age < 42) {
        professions[candidate.profession].under42++;
      } else {
        professions[candidate.profession].over42++;
      }
    }
  });
  
  return Object.values(professions);
};

// Yeni fonksiyon: Yaş dağılımını al
export const getAgeDistribution = () => {
  const under42 = mockCandidates.filter(c => c.age < 42).length;
  const over42 = mockCandidates.filter(c => c.age >= 42).length;
  
  return [
    { name: "42 yaş altı", value: under42 },
    { name: "42 yaş ve üstü", value: over42 }
  ];
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

// Meslek seçenekleri
const professionOptions = ["nursing", "mechatronics", "automotive", "other"];
const professionLabels = {
  "nursing": "Hemşirelik",
  "mechatronics": "Mekatronik", 
  "automotive": "Otomotiv",
  "other": "Diğer"
};

// Modify mockCandidates to include profession and age
export const mockCandidates: Candidate[] = [
  {
    id: "candidate-1",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    profession: "nursing",
    age: 38,
    appliedAt: faker.date.past(),
    stage: "Sınıf Yerleştirme",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    classConfirmation: 'pending',
    stageTimeline: generateStageTimeline(["Başvuru Alındı", "Telefon Görüşmesi", "İK Görüşmesi", "Evrak Toplama", "Sisteme Evrak Girişi", "Sınıf Yerleştirme"]),
    examResults: generateExamResults(),
    responsiblePerson: faker.person.fullName()
  },
  {
    id: "candidate-2",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    profession: "mechatronics",
    age: 44,
    appliedAt: faker.date.past(),
    stage: "İK Görüşmesi",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    stageTimeline: generateStageTimeline(["Başvuru Alındı", "Telefon Görüşmesi", "İK Görüşmesi"]),
    examResults: generateExamResults(),
    responsiblePerson: faker.person.fullName()
  },
  {
    id: "candidate-3",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    profession: "automotive",
    age: 35,
    appliedAt: faker.date.past(),
    stage: "Evrak Toplama",
    status: 'waiting',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    returnDate: faker.date.future(),
    stageTimeline: generateStageTimeline(["Başvuru Alındı", "Telefon Görüşmesi", "İK Görüşmesi", "Evrak Toplama"]),
    examResults: generateExamResults(),
    responsiblePerson: faker.person.fullName()
  },
  {
    id: "candidate-4",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    profession: "nursing",
    age: 51,
    appliedAt: faker.date.past(),
    stage: "Vize Süreci",
    status: 'completed',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    stageTimeline: generateStageTimeline(["Başvuru Alındı", "Telefon Görüşmesi", "İK Görüşmesi", "Evrak Toplama", "Sisteme Evrak Girişi", "Sınıf Yerleştirme", "Denklik Süreci", "Vize Süreci"]),
    examResults: generateExamResults(),
    responsiblePerson: faker.person.fullName()
  },
  {
    id: "candidate-5",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    profession: "mechatronics",
    age: 31,
    appliedAt: faker.date.past(),
    stage: "Başvuru Alındı",
    status: 'rejected',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    stageTimeline: generateStageTimeline(["Başvuru Alındı"]),
    examResults: generateExamResults(),
    responsiblePerson: faker.person.fullName()
  },
  {
    id: "candidate-6",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    profession: "automotive",
    age: 47,
    appliedAt: faker.date.past(),
    stage: "Sertifika Süreci",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    stageTimeline: generateStageTimeline(["Başvuru Alındı", "Telefon Görüşmesi", "İK Görüşmesi", "Evrak Toplama", "Sisteme Evrak Girişi", "Sınıf Yerleştirme", "Denklik Süreci", "Vize Süreci", "Sertifika Süreci"]),
    examResults: generateExamResults(),
    responsiblePerson: faker.person.fullName()
  },
  {
    id: "candidate-7",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    profession: "nursing",
    age: 33,
    appliedAt: faker.date.past(),
    stage: "Denklik Süreci",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    stageTimeline: generateStageTimeline(["Başvuru Alındı", "Telefon Görüşmesi", "İK Görüşmesi", "Evrak Toplama", "Sisteme Evrak Girişi", "Sınıf Yerleştirme", "Denklik Süreci"]),
    examResults: generateExamResults(),
    responsiblePerson: faker.person.fullName()
  },
  {
    id: "candidate-8",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    profession: "mechatronics",
    age: 40,
    appliedAt: faker.date.past(),
    stage: "Sınıf Yerleştirme",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    classConfirmation: 'pending',
    stageTimeline: generateStageTimeline(["Başvuru Alındı", "Telefon Görüşmesi", "İK Görüşmesi", "Evrak Toplama", "Sisteme Evrak Girişi", "Sınıf Yerleştirme"]),
    examResults: generateExamResults(),
    responsiblePerson: faker.person.fullName()
  },
  {
    id: "candidate-9",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    profession: "automotive",
    age: 29,
    appliedAt: faker.date.past(),
    stage: "Telefon Görüşmesi",
    status: 'inProgress',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    stageTimeline: generateStageTimeline(["Başvuru Alındı", "Telefon Görüşmesi"]),
    examResults: generateExamResults(),
    responsiblePerson: faker.person.fullName()
  },
  {
    id: "candidate-10",
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    position: faker.person.jobTitle(),
    profession: "nursing",
    age: 46,
    appliedAt: faker.date.past(),
    stage: "Evrak Toplama",
    status: 'waiting',
    timeline: generateTimeline(),
    notes: [faker.lorem.sentence(), faker.lorem.sentence()],
    returnDate: faker.date.future(),
    stageTimeline: generateStageTimeline(["Başvuru Alındı", "Telefon Görüşmesi", "İK Görüşmesi", "Evrak Toplama"]),
    examResults: generateExamResults(),
    responsiblePerson: faker.person.fullName()
  },
];

// Each candidate in mockCandidates array needs examResults
mockCandidates.forEach(candidate => {
  if (!candidate.examResults) {
    candidate.examResults = generateExamResults();
  }
  if (!candidate.responsiblePerson) {
    candidate.responsiblePerson = faker.person.fullName();
  }
  if (candidate.status === 'rejected' && !candidate.rejectionReason) {
    candidate.rejectionReason = faker.helpers.arrayElement([
      'Sınav başarısız',
      'Başvuru kriterleri uyumsuz',
      'Adayın vazgeçmesi',
      'İletişim problemi',
      'Evrak eksikliği'
    ]);
    candidate.rejectionNote = faker.lorem.sentence();
  }
});

// Profesyonları ve Türkçe karşılıklarını dışa aktar
export const professions = professionOptions;
export const professionNames = professionLabels;
