import { faker } from '@faker-js/faker';

export type CandidateStatus = 'pending' | 'inProgress' | 'completed' | 'rejected';
export type ClassConfirmation = 'pending' | 'confirmed';

export interface ExamResult {
  level: string;
  passed: boolean;
  score?: number;
  date?: Date | string;
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
}

const generateRandomExamResults = (): ExamResult[] => {
  const levels = ['A1', 'A2', 'B1', 'B2'];
  return levels.map(level => ({
    level,
    passed: faker.datatype.boolean(),
    score: faker.datatype.number({ min: 50, max: 100 }),
    date: faker.date.past(),
  }));
};

const generateCandidate = (): Candidate => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const position = faker.person.jobTitle();
  const profession = faker.person.jobArea();
  const status = faker.helpers.shuffle<CandidateStatus>(['pending', 'inProgress', 'completed', 'rejected'])[0];
  const startDate = faker.date.past();
  const endDate = faker.date.future();
  const processDays = faker.datatype.number({ min: 5, max: 120 });

  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    email: faker.internet.email({ firstName, lastName }),
    phone: faker.phone.number(),
    position,
    profession,
    age: faker.datatype.number({ min: 18, max: 65 }),
    appliedAt: faker.date.past(),
    status,
    stage: faker.helpers.shuffle<string>([
      "Başvuru Alındı",
      "Telefon Görüşmesi",
      "İK Görüşmesi",
      "Evrak Toplama",
      "Sisteme Evrak Girişi",
      "Sınıf Yerleştirme",
      "Denklik Süreci",
      "Vize Süreci",
      "Sertifika Süreci"
    ])[0],
    processDays,
    startDate,
    endDate,
    responsiblePerson: faker.person.fullName(),
    classConfirmation: faker.helpers.shuffle<ClassConfirmation>(['pending', 'confirmed'])[0],
    examResults: generateRandomExamResults(),
  };
};

export const mockCandidates: Candidate[] = faker.helpers.multiple(generateCandidate, {
  count: 67,
});

export const getStatusCount = () => {
  return {
    total: mockCandidates.length,
    pending: mockCandidates.filter(c => c.status === 'pending').length,
    inProgress: mockCandidates.filter(c => c.status === 'inProgress').length,
    completed: mockCandidates.filter(c => c.status === 'completed').length,
    rejected: mockCandidates.filter(c => c.status === 'rejected').length,
    waiting: mockCandidates.filter(c => c.status === 'pending').length,
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
    count: faker.datatype.number({ min: 5, max: 20 }),
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

export const getExamStatistics = () => {
  const a1Passed = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'A1' && e.passed)).length;
  const a1Failed = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'A1' && !e.passed)).length;
  
  const a2Passed = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'A2' && e.passed)).length;
  const a2Failed = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'A2' && !e.passed)).length;
  
  const b1Passed = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'B1' && e.passed)).length;
  const b1Failed = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'B1' && !e.passed)).length;
  
  const b2Passed = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'B2' && e.passed)).length;
  const b2Failed = mockCandidates.filter(c => c.examResults?.some(e => e.level === 'B2' && !e.passed)).length;
  
  return {
    a1: { passed: a1Passed, failed: a1Failed },
    a2: { passed: a2Passed, failed: a2Failed },
    b1: { passed: b1Passed, failed: b1Failed },
    b2: { passed: b2Passed, failed: b2Failed }
  };
};
