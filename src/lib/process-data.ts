import { ProcessStage, SubProcess } from './mock-data';

export type { ProcessStage, SubProcess } from './mock-data';

// Default process stages - can be modified through Process Management page
export const defaultProcessStages: ProcessStage[] = [
  {
    id: '1',
    name: 'Başvuru Alındı',
    description: 'Adayın başvurusu sisteme kaydedildi',
    order: 1,
    subProcesses: [
      { id: '1-1', name: 'Form Dolduruldu', description: '', order: 1, stageId: '1' },
      { id: '1-2', name: 'Başvuru Onaylandı', description: '', order: 2, stageId: '1' }
    ]
  },
  {
    id: '2',
    name: 'Telefon Görüşmesi',
    description: 'Ön değerlendirme telefon görüşmesi',
    order: 2,
    subProcesses: [
      { id: '2-1', name: 'Randevu Alındı', description: '', order: 1, stageId: '2' },
      { id: '2-2', name: 'Görüşme Tamamlandı', description: '', order: 2, stageId: '2' },
      { id: '2-3', name: 'Değerlendirme Yapıldı', description: '', order: 3, stageId: '2' }
    ]
  },
  {
    id: '3',
    name: 'Zoom Daveti',
    description: 'Online görüşme ve sunum',
    order: 3,
    subProcesses: [
      { id: '3-1', name: 'Davet Gönderildi', description: '', order: 1, stageId: '3' },
      { id: '3-2', name: 'Toplantıya Katıldı', description: '', order: 2, stageId: '3' },
      { id: '3-3', name: 'Sunum Tamamlandı', description: '', order: 3, stageId: '3' }
    ]
  },
  {
    id: '4',
    name: 'İK Görüşmesi',
    description: 'İnsan kaynakları mülakatı',
    order: 4,
    subProcesses: [
      { id: '4-1', name: 'Randevu Planlandı', description: '', order: 1, stageId: '4' },
      { id: '4-2', name: 'Mülakat Yapıldı', description: '', order: 2, stageId: '4' },
      { id: '4-3', name: 'Sonuç Değerlendirildi', description: '', order: 3, stageId: '4' }
    ]
  },
  {
    id: '5',
    name: 'Evrak Toplama',
    description: 'Gerekli belgeler toplanıyor',
    order: 5,
    subProcesses: [
      { id: '5-1', name: 'Evrak Listesi Gönderildi', description: '', order: 1, stageId: '5' },
      { id: '5-2', name: 'Belgeler Alındı', description: '', order: 2, stageId: '5' },
      { id: '5-3', name: 'Kontrol Edildi', description: '', order: 3, stageId: '5' }
    ]
  },
  {
    id: '6',
    name: 'Sisteme Evrak Girişi',
    description: 'Belgeler sisteme kaydediliyor',
    order: 6,
    subProcesses: [
      { id: '6-1', name: 'Tarama Yapıldı', description: '', order: 1, stageId: '6' },
      { id: '6-2', name: 'Sisteme Yüklendi', description: '', order: 2, stageId: '6' }
    ]
  },
  {
    id: '7',
    name: 'Sınıf Yerleştirme',
    description: 'Uygun sınıfa yerleştirme',
    order: 7,
    subProcesses: [
      { id: '7-1', name: 'Seviye Belirlendi', description: '', order: 1, stageId: '7' },
      { id: '7-2', name: 'Sınıf Seçildi', description: '', order: 2, stageId: '7' },
      { id: '7-3', name: 'Kayıt Tamamlandı', description: '', order: 3, stageId: '7' }
    ]
  },
  {
    id: '8',
    name: 'Denklik Süreci',
    description: 'Diploma denklik işlemleri',
    order: 8,
    subProcesses: [
      { id: '8-1', name: 'Başvuru Yapıldı', description: '', order: 1, stageId: '8' },
      { id: '8-2', name: 'İnceleme Süreci', description: '', order: 2, stageId: '8' },
      { id: '8-3', name: 'Sonuç Alındı', description: '', order: 3, stageId: '8' }
    ]
  },
  {
    id: '9',
    name: 'Vize Süreci',
    description: 'Vize başvuru ve takip',
    order: 9,
    subProcesses: [
      { id: '9-1', name: 'Evraklar Hazırlandı', description: '', order: 1, stageId: '9' },
      { id: '9-2', name: 'Başvuru Yapıldı', description: '', order: 2, stageId: '9' },
      { id: '9-3', name: 'Sonuç Bekleniyor', description: '', order: 3, stageId: '9' },
      { id: '9-4', name: 'Vize Alındı', description: '', order: 4, stageId: '9' }
    ]
  },
  {
    id: '10',
    name: 'Sertifika Süreci',
    description: 'Sertifika alma işlemleri',
    order: 10,
    subProcesses: [
      { id: '10-1', name: 'Sınav Planlandı', description: '', order: 1, stageId: '10' },
      { id: '10-2', name: 'Sınav Yapıldı', description: '', order: 2, stageId: '10' },
      { id: '10-3', name: 'Sertifika Verildi', description: '', order: 3, stageId: '10' }
    ]
  }
];

// Helper functions for localStorage management
export const getProcessStagesFromStorage = (): ProcessStage[] => {
  try {
    const stored = localStorage.getItem('processStages');
    return stored ? JSON.parse(stored) : defaultProcessStages;
  } catch {
    return defaultProcessStages;
  }
};

export const saveProcessStagesToStorage = (stages: ProcessStage[]): void => {
  localStorage.setItem('processStages', JSON.stringify(stages));
};

export const addProcessStage = (stage: Omit<ProcessStage, 'id' | 'order'>): ProcessStage => {
  const stages = getProcessStagesFromStorage();
  const newStage: ProcessStage = {
    ...stage,
    id: Date.now().toString(),
    order: 0, // Order no longer matters for sequencing
    subProcesses: stage.subProcesses.map((sp, index) => ({
      ...sp,
      id: `${Date.now()}-${index}`,
      order: index + 1,
      stageId: Date.now().toString()
    }))
  };
  
  const updatedStages = [...stages, newStage];
  saveProcessStagesToStorage(updatedStages);
  return newStage;
};

export const updateProcessStage = (id: string, updates: Partial<ProcessStage>): void => {
  const stages = getProcessStagesFromStorage();
  const updatedStages = stages.map(stage => 
    stage.id === id ? { ...stage, ...updates } : stage
  );
  saveProcessStagesToStorage(updatedStages);
};

export const deleteProcessStage = (id: string): void => {
  const stages = getProcessStagesFromStorage();
  const filteredStages = stages.filter(stage => stage.id !== id);
  // No need to reorder as processes can run in parallel
  saveProcessStagesToStorage(filteredStages);
};

export const addSubProcess = (stageId: string, subProcess: Omit<SubProcess, 'id' | 'order' | 'stageId'>): void => {
  const stages = getProcessStagesFromStorage();
  const updatedStages = stages.map(stage => {
    if (stage.id === stageId) {
      const newSubProcess: SubProcess = {
        ...subProcess,
        id: `${stageId}-${Date.now()}`,
        order: stage.subProcesses.length + 1,
        stageId
      };
      return {
        ...stage,
        subProcesses: [...stage.subProcesses, newSubProcess]
      };
    }
    return stage;
  });
  saveProcessStagesToStorage(updatedStages);
};

export const deleteSubProcess = (stageId: string, subProcessId: string): void => {
  const stages = getProcessStagesFromStorage();
  const updatedStages = stages.map(stage => {
    if (stage.id === stageId) {
      const filteredSubProcesses = stage.subProcesses.filter(sp => sp.id !== subProcessId);
      // Reorder remaining sub-processes
      const reorderedSubProcesses = filteredSubProcesses.map((sp, index) => ({
        ...sp,
        order: index + 1
      }));
      return {
        ...stage,
        subProcesses: reorderedSubProcesses
      };
    }
    return stage;
  });
  saveProcessStagesToStorage(updatedStages);
};