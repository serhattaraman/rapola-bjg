
import { faker } from '@faker-js/faker';

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appliedAt: string;
  address?: string;
  city?: string;
  country?: string;
  birthDate?: string; // Tarih bilgisi için eklendi
  birthPlace?: string; // Doğum yeri için eklendi
  status: "active" | "inactive" | "pending";
  group?: string;
  stage: string;
  profession?: string;
  followUpDate?: string;
  description?: string;
  notes?: string[];
  source?: string;
  responsiblePerson?: string;
  examResults?: {
    level: string;
    date: string;
    score?: number;
    passed: boolean;
  }[];
  documents?: {
    type: string;
    name: string;
    uploadDate: string;
    status: "approved" | "rejected" | "pending";
  }[];
  visaStatus?: "not_applied" | "in_progress" | "approved" | "rejected";
}

// Mock candidates data
export const mockCandidates: Candidate[] = [
  {
    id: "1",
    firstName: "Ahmet",
    lastName: "Yılmaz",
    email: "ahmet.yilmaz@example.com",
    phone: "+90 532 123 4567",
    appliedAt: "2023-05-15T10:30:00",
    address: "Atatürk Cad. No:123",
    city: "İstanbul",
    country: "Türkiye",
    birthDate: "1990-05-12", // Tarih bilgisi eklendi
    birthPlace: "Ankara", // Doğum yeri eklendi
    status: "active",
    group: "A1-1",
    stage: "Telefon Görüşmesi",
    profession: "Hemşire",
    followUpDate: "2023-06-01T14:00:00",
    description: "Almanya'da hemşire olarak çalışmak istiyor.",
    notes: [
      "İlk görüşme olumlu geçti.",
      "Almanca seviyesi B1 düzeyinde.",
      "2 yıllık tecrübesi var."
    ],
    source: "Instagram",
    responsiblePerson: "Mehmet Demir",
    examResults: [
      {
        level: "A1",
        date: "2023-04-20",
        score: 85,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "ahmet_yilmaz_cv.pdf",
        uploadDate: "2023-05-15",
        status: "approved"
      },
      {
        type: "Diploma",
        name: "ahmet_yilmaz_diploma.pdf",
        uploadDate: "2023-05-16",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  },
  {
    id: "2",
    firstName: "Ayşe",
    lastName: "Demir",
    email: "ayse.demir@example.com",
    phone: "+90 533 234 5678",
    appliedAt: "2023-06-20T09:15:00",
    address: "Cumhuriyet Meydanı No:45",
    city: "İzmir",
    country: "Türkiye",
    birthDate: "1988-02-20", // Tarih bilgisi eklendi
    birthPlace: "İstanbul", // Doğum yeri eklendi
    status: "active",
    group: "A1-1",
    stage: "İK Görüşmesi",
    profession: "Öğretmen",
    followUpDate: "2023-07-05T11:30:00",
    description: "İngilizce öğretmeni olarak çalışmak istiyor.",
    notes: [
      "Referansları kontrol edilecek.",
      "Yüksek lisans diploması var."
    ],
    source: "LinkedIn",
    responsiblePerson: "Zeynep Kaya",
    examResults: [
      {
        level: "A1",
        date: "2023-05-25",
        score: 92,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "ayse_demir_cv.pdf",
        uploadDate: "2023-06-20",
        status: "approved"
      },
      {
        type: "Transkript",
        name: "ayse_demir_transkript.pdf",
        uploadDate: "2023-06-22",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  },
  {
    id: "3",
    firstName: "Mehmet",
    lastName: "Kaya",
    email: "mehmet.kaya@example.com",
    phone: "+90 534 345 6789",
    appliedAt: "2023-07-10T14:45:00",
    address: "İnönü Bulvarı No:67",
    city: "Ankara",
    country: "Türkiye",
    birthDate: "1992-08-15", // Tarih bilgisi eklendi
    birthPlace: "İzmir", // Doğum yeri eklendi
    status: "pending",
    group: "A1-2",
    stage: "Mülakat",
    profession: "Mühendis",
    followUpDate: "2023-07-25T16:00:00",
    description: "Almanya'da mühendis olarak çalışmak istiyor.",
    notes: [
      "Mülakat tarihi belirlendi.",
      "Tecrübe alanları incelenecek."
    ],
    source: "Kariyer.net",
    responsiblePerson: "Ali Can",
    examResults: [
      {
        level: "A1",
        date: "2023-06-15",
        score: 78,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "mehmet_kaya_cv.pdf",
        uploadDate: "2023-07-10",
        status: "approved"
      },
      {
        type: "Niyet Mektubu",
        name: "mehmet_kaya_niyetmektubu.pdf",
        uploadDate: "2023-07-12",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  },
  {
    id: "4",
    firstName: "Fatma",
    lastName: "Şahin",
    email: "fatma.sahin@example.com",
    phone: "+90 535 456 7890",
    appliedAt: "2023-08-01T11:00:00",
    address: "Ziya Gökalp Caddesi No:89",
    city: "Bursa",
    country: "Türkiye",
    birthDate: "1985-11-01", // Tarih bilgisi eklendi
    birthPlace: "Adana", // Doğum yeri eklendi
    status: "inactive",
    group: "A1-2",
    stage: "Evrak Toplama",
    profession: "Doktor",
    followUpDate: "2023-08-15T13:30:00",
    description: "Almanya'da doktor olarak çalışmak istiyor.",
    notes: [
      "Gerekli evraklar listesi gönderildi.",
      "Denklik işlemleri başlatılacak."
    ],
    source: "DoktorSitesi.com",
    responsiblePerson: "Elif Yılmaz",
    examResults: [
      {
        level: "A1",
        date: "2023-07-01",
        score: 65,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "fatma_sahin_cv.pdf",
        uploadDate: "2023-08-01",
        status: "approved"
      },
      {
        type: "Tıp Diploması",
        name: "fatma_sahin_tipdiplomasi.pdf",
        uploadDate: "2023-08-03",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  },
  {
    id: "5",
    firstName: "Mustafa",
    lastName: "Öztürk",
    email: "mustafa.ozturk@example.com",
    phone: "+90 536 567 8901",
    appliedAt: "2023-09-05T16:15:00",
    address: "Mithatpaşa Caddesi No:21",
    city: "Adana",
    country: "Türkiye",
    birthDate: "1995-03-25", // Tarih bilgisi eklendi
    birthPlace: "Gaziantep", // Doğum yeri eklendi
    status: "active",
    group: "A2-1",
    stage: "Evrak Hazırlığı",
    profession: "Diş Hekimi",
    followUpDate: "2023-09-20T10:00:00",
    description: "Almanya'da diş hekimi olarak çalışmak istiyor.",
    notes: [
      "Evrak hazırlık süreci başladı.",
      "Gerekli tercümeler yapılacak."
    ],
    source: "LinkedIn",
    responsiblePerson: "Burak Demir",
    examResults: [
      {
        level: "A2",
        date: "2023-08-05",
        score: 70,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "mustafa_ozturk_cv.pdf",
        uploadDate: "2023-09-05",
        status: "approved"
      },
      {
        type: "Diş Hekimliği Diploması",
        name: "mustafa_ozturk_dishdiplomasi.pdf",
        uploadDate: "2023-09-07",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  },
  {
    id: "6",
    firstName: "Elif",
    lastName: "Yıldırım",
    email: "elif.yildirim@example.com",
    phone: "+90 537 678 9012",
    appliedAt: "2023-10-10T08:30:00",
    address: "Atatürk Bulvarı No:34",
    city: "Gaziantep",
    country: "Türkiye",
    birthDate: "1991-07-04", // Tarih bilgisi eklendi
    birthPlace: "Ankara", // Doğum yeri eklendi
    status: "active",
    group: "A2-1",
    stage: "Belge Kontrol",
    profession: "Avukat",
    followUpDate: "2023-10-25T14:15:00",
    description: "Almanya'da avukat olarak çalışmak istiyor.",
    notes: [
      "Belge kontrol süreci devam ediyor.",
      "Eksik belgeler tamamlanacak."
    ],
    source: "AvukatSitesi.com",
    responsiblePerson: "Ayşe Kaya",
    examResults: [
      {
        level: "A2",
        date: "2023-09-10",
        score: 88,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "elif_yildirim_cv.pdf",
        uploadDate: "2023-10-10",
        status: "approved"
      },
      {
        type: "Hukuk Fakültesi Diploması",
        name: "elif_yildirim_hukukdiplomasi.pdf",
        uploadDate: "2023-10-12",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  },
  {
    id: "7",
    firstName: "Serkan",
    lastName: "Kara",
    email: "serkan.kara@example.com",
    phone: "+90 538 789 0123",
    appliedAt: "2023-11-15T12:45:00",
    address: "İnönü Caddesi No:56",
    city: "Konya",
    country: "Türkiye",
    birthDate: "1987-12-24", // Tarih bilgisi eklendi
    birthPlace: "Sivas", // Doğum yeri eklendi
    status: "pending",
    group: "A2-2",
    stage: "Sisteme Evrak Girişi",
    profession: "Mimar",
    followUpDate: "2023-11-30T11:00:00",
    description: "Almanya'da mimar olarak çalışmak istiyor.",
    notes: [
      "Evraklar sisteme giriliyor.",
      "Onay süreci başlayacak."
    ],
    source: "MimarPlatformu.com",
    responsiblePerson: "Cemil Demir",
    examResults: [
      {
        level: "A2",
        date: "2023-10-15",
        score: 95,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "serkan_kara_cv.pdf",
        uploadDate: "2023-11-15",
        status: "approved"
      },
      {
        type: "Mimarlık Diploması",
        name: "serkan_kara_mimarlikdiplomasi.pdf",
        uploadDate: "2023-11-17",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  },
  {
    id: "8",
    firstName: "Gülcan",
    lastName: "Arslan",
    email: "gulcan.arslan@example.com",
    phone: "+90 539 890 1234",
    appliedAt: "2023-12-01T09:00:00",
    address: "Cumhuriyet Caddesi No:78",
    city: "Sivas",
    country: "Türkiye",
    birthDate: "1993-09-18", // Tarih bilgisi eklendi
    birthPlace: "Konya", // Doğum yeri eklendi
    status: "active",
    group: "A2-2",
    stage: "Sınıf Yerleştirme",
    profession: "Müzisyen",
    followUpDate: "2023-12-15T15:30:00",
    description: "Almanya'da müzisyen olarak çalışmak istiyor.",
    notes: [
      "Sınıf yerleştirme işlemleri yapılıyor.",
      "Müzik yeteneği değerlendirilecek."
    ],
    source: "MüzikOkulu.com",
    responsiblePerson: "Deniz Yılmaz",
    examResults: [
      {
        level: "A2",
        date: "2023-11-01",
        score: 60,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "gulcan_arslan_cv.pdf",
        uploadDate: "2023-12-01",
        status: "approved"
      },
      {
        type: "Müzik Diploması",
        name: "gulcan_arslan_muzikdiplomasi.pdf",
        uploadDate: "2023-12-03",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  },
  {
    id: "9",
    firstName: "Umut",
    lastName: "Can",
    email: "umut.can@example.com",
    phone: "+90 540 901 2345",
    appliedAt: "2024-01-05T14:30:00",
    address: "Ziya Gökalp Bulvarı No:90",
    city: "Eskişehir",
    country: "Türkiye",
    birthDate: "1989-06-10", // Tarih bilgisi eklendi
    birthPlace: "Bursa", // Doğum yeri eklendi
    status: "active",
    group: "B1-1",
    stage: "Denklik Süreci",
    profession: "Öğretim Görevlisi",
    followUpDate: "2024-01-20T10:45:00",
    description: "Almanya'da öğretim görevlisi olarak çalışmak istiyor.",
    notes: [
      "Denklik süreci başlatıldı.",
      "Gerekli belgeler hazırlanıyor."
    ],
    source: "ÜniversiteKariyer.com",
    responsiblePerson: "Fırat Arslan",
    examResults: [
      {
        level: "B1",
        date: "2023-12-05",
        score: 75,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "umut_can_cv.pdf",
        uploadDate: "2024-01-05",
        status: "approved"
      },
      {
        type: "Akademik Transkript",
        name: "umut_can_akademiktranskript.pdf",
        uploadDate: "2024-01-07",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  },
  {
    id: "10",
    firstName: "Pınar",
    lastName: "Aydın",
    email: "pinar.aydin@example.com",
    phone: "+90 541 012 3456",
    appliedAt: "2024-02-10T11:15:00",
    address: "Mithatpaşa Caddesi No:12",
    city: "Antalya",
    country: "Türkiye",
    birthDate: "1994-04-02", // Tarih bilgisi eklendi
    birthPlace: "Eskişehir", // Doğum yeri eklendi
    status: "pending",
    group: "B1-1",
    stage: "Sertifika Süreci",
    profession: "Yazılımcı",
    followUpDate: "2024-02-25T16:00:00",
    description: "Almanya'da yazılımcı olarak çalışmak istiyor.",
    notes: [
      "Sertifika süreci başlatılacak.",
      "Gerekli sınavlara hazırlanılıyor."
    ],
    source: "YazılımcıKariyer.com",
    responsiblePerson: "Gamze Demir",
    examResults: [
      {
        level: "B1",
        date: "2024-01-10",
        score: 82,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "pinar_aydin_cv.pdf",
        uploadDate: "2024-02-10",
        status: "approved"
      },
      {
        type: "Yazılım Sertifikaları",
        name: "pinar_aydin_yazilimsertifikalari.pdf",
        uploadDate: "2024-02-12",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  },
  {
    id: "11",
    firstName: "Canan",
    lastName: "Güneş",
    email: "canan.gunes@example.com",
    phone: "+90 542 123 4567",
    appliedAt: "2024-03-01T09:45:00",
    address: "Atatürk Caddesi No:45",
    city: "İzmir",
    country: "Türkiye",
    birthDate: "1990-08-15",
    birthPlace: "İstanbul",
    status: "active",
    group: "B1-2",
    stage: "Vize Süreci",
    profession: "Grafik Tasarımcı",
    followUpDate: "2024-03-15T14:30:00",
    description: "Almanya'da grafik tasarımcı olarak çalışmak istiyor.",
    notes: [
      "Vize başvuru süreci başladı.",
      "Gerekli evraklar hazırlanıyor."
    ],
    source: "TasarımcılarPlatformu.com",
    responsiblePerson: "Hakan Yılmaz",
    examResults: [
      {
        level: "B1",
        date: "2024-02-01",
        score: 78,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "canan_gunes_cv.pdf",
        uploadDate: "2024-03-01",
        status: "approved"
      },
      {
        type: "Portfolyo",
        name: "canan_gunes_portfolyo.pdf",
        uploadDate: "2024-03-03",
        status: "pending"
      }
    ],
    visaStatus: "in_progress"
  },
  {
    id: "12",
    firstName: "Murat",
    lastName: "Ersoy",
    email: "murat.ersoy@example.com",
    phone: "+90 543 234 5678",
    appliedAt: "2024-03-10T16:00:00",
    address: "İnönü Bulvarı No:67",
    city: "Ankara",
    country: "Türkiye",
    birthDate: "1988-05-20",
    birthPlace: "İzmir",
    status: "pending",
    group: "B1-2",
    stage: "Vize Onayı",
    profession: "Pazarlama Uzmanı",
    followUpDate: "2024-03-25T11:00:00",
    description: "Almanya'da pazarlama uzmanı olarak çalışmak istiyor.",
    notes: [
      "Vize onayı bekleniyor.",
      "Gerekli tüm belgeler tamamlandı."
    ],
    source: "PazarlamaKariyer.com",
    responsiblePerson: "Selen Kaya",
    examResults: [
      {
        level: "B1",
        date: "2024-03-10",
        score: 92,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "murat_ersoy_cv.pdf",
        uploadDate: "2024-03-10",
        status: "approved"
      },
      {
        type: "Referans Mektupları",
        name: "murat_ersoy_referansmektuplari.pdf",
        uploadDate: "2024-03-12",
        status: "pending"
      }
    ],
    visaStatus: "approved"
  },
  {
    id: "13",
    firstName: "Zeynep",
    lastName: "Demirci",
    email: "zeynep.demirci@example.com",
    phone: "+90 544 345 6789",
    appliedAt: "2024-03-15T10:30:00",
    address: "Cumhuriyet Meydanı No:89",
    city: "Bursa",
    country: "Türkiye",
    birthDate: "1992-12-01",
    birthPlace: "Adana",
    status: "active",
    group: "B2-1",
    stage: "Final Değerlendirme",
    profession: "İnsan Kaynakları Uzmanı",
    followUpDate: "2024-03-30T15:45:00",
    description: "Almanya'da insan kaynakları uzmanı olarak çalışmak istiyor.",
    notes: [
      "Final değerlendirme yapılacak.",
      "Mülakat sonuçları incelenecek."
    ],
    source: "İKPlatformu.com",
    responsiblePerson: "Ali Can",
    examResults: [
      {
        level: "B2",
        date: "2024-03-15",
        score: 85,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "zeynep_demirci_cv.pdf",
        uploadDate: "2024-03-15",
        status: "approved"
      },
      {
        type: "Sertifikalar",
        name: "zeynep_demirci_sertifikalar.pdf",
        uploadDate: "2024-03-17",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  },
  {
    id: "14",
    firstName: "Emre",
    lastName: "Kılıç",
    email: "emre.kilic@example.com",
    phone: "+90 545 456 7890",
    appliedAt: "2024-03-20T14:00:00",
    address: "Ziya Gökalp Caddesi No:21",
    city: "Adana",
    country: "Türkiye",
    birthDate: "1985-03-25",
    birthPlace: "Gaziantep",
    status: "inactive",
    group: "B2-1",
    stage: "Başvuru Alındı",
    profession: "Satış Temsilcisi",
    followUpDate: "2024-04-05T10:00:00",
    description: "Almanya'da satış temsilcisi olarak çalışmak istiyor.",
    notes: [
      "Başvurusu alındı.",
      "İlk değerlendirme yapılacak."
    ],
    source: "SatışKariyer.com",
    responsiblePerson: "Elif Yılmaz",
    examResults: [
      {
        level: "B2",
        date: "2024-03-20",
        score: 70,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "emre_kilic_cv.pdf",
        uploadDate: "2024-03-20",
        status: "approved"
      },
      {
        type: "Referanslar",
        name: "emre_kilic_referanslar.pdf",
        uploadDate: "2024-03-22",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  },
  {
    id: "15",
    firstName: "Selin",
    lastName: "Öztürk",
    email: "selin.ozturk@example.com",
    phone: "+90 546 567 8901",
    appliedAt: "2024-03-25T11:30:00",
    address: "Mithatpaşa Caddesi No:34",
    city: "Gaziantep",
    country: "Türkiye",
    birthDate: "1995-07-04",
    birthPlace: "Ankara",
    status: "active",
    group: "B2-2",
    stage: "Telefon Görüşmesi",
    profession: "Proje Yöneticisi",
    followUpDate: "2024-04-10T14:15:00",
    description: "Almanya'da proje yöneticisi olarak çalışmak istiyor.",
    notes: [
      "Telefon görüşmesi planlandı.",
      "Deneyimleri değerlendirilecek."
    ],
    source: "ProjeYöneticisiKariyer.com",
    responsiblePerson: "Ayşe Kaya",
    examResults: [
      {
        level: "B2",
        date: "2024-03-25",
        score: 88,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "selin_ozturk_cv.pdf",
        uploadDate: "2024-03-25",
        status: "approved"
      },
      {
        type: "Projeler",
        name: "selin_ozturk_projeler.pdf",
        uploadDate: "2024-03-27",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  },
  {
    id: "16",
    firstName: "Burak",
    lastName: "Yıldırım",
    email: "burak.yildirim@example.com",
    phone: "+90 547 678 9012",
    appliedAt: "2024-03-30T08:00:00",
    address: "Atatürk Bulvarı No:56",
    city: "Konya",
    country: "Türkiye",
    birthDate: "1991-12-24",
    birthPlace: "Sivas",
    status: "active",
    group: "B2-2",
    stage: "İK Görüşmesi",
    profession: "Veri Analisti",
    followUpDate: "2024-04-15T11:00:00",
    description: "Almanya'da veri analisti olarak çalışmak istiyor.",
    notes: [
      "İK görüşmesi yapılacak.",
      "Analitik yetenekleri değerlendirilecek."
    ],
    source: "VeriAnalistiKariyer.com",
    responsiblePerson: "Cemil Demir",
    examResults: [
      {
        level: "B2",
        date: "2024-03-30",
        score: 95,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "burak_yildirim_cv.pdf",
        uploadDate: "2024-03-30",
        status: "approved"
      },
      {
        type: "Analiz Raporları",
        name: "burak_yildirim_analizraporlari.pdf",
        uploadDate: "2024-04-01",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  },
  {
    id: "17",
    firstName: "Gizem",
    lastName: "Arslan",
    email: "gizem.arslan@example.com",
    phone: "+90 548 789 0123",
    appliedAt: "2024-04-05T12:30:00",
    address: "İnönü Caddesi No:78",
    city: "Sivas",
    country: "Türkiye",
    birthDate: "1987-09-18",
    birthPlace: "Konya",
    status: "pending",
    group: "C1-1",
    stage: "Mülakat",
    profession: "Yazılım Geliştirici",
    followUpDate: "2024-04-20T15:30:00",
    description: "Almanya'da yazılım geliştirici olarak çalışmak istiyor.",
    notes: [
      "Mülakat planlandı.",
      "Teknik bilgisi değerlendirilecek."
    ],
    source: "YazılımcıPlatformu.com",
    responsiblePerson: "Deniz Yılmaz",
    examResults: [
      {
        level: "C1",
        date: "2024-03-05",
        score: 90,
        passed: true
      }
    ],
    documents: [
      {
        type: "CV",
        name: "gizem_arslan_cv.pdf",
        uploadDate: "2024-04-05",
        status: "approved"
      },
      {
        type: "Kod Örnekleri",
        name: "gizem_arslan_kodornekleri.pdf",
        uploadDate: "2024-04-07",
        status: "pending"
      }
    ],
    visaStatus: "not_applied"
  }
];

// Helper functions to format dates and calculate durations
export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR');
};

export const calculateDurationInDays = (startDate: string | Date, endDate: string | Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const differenceInTime = end.getTime() - start.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
};

export const formatDuration = (days: number): string => {
  if (days === 0) return "Bugün";
  if (days === 1) return "1 gün";
  return `${days} gün`;
};

export const getDaysRemaining = (dateString: string | Date): number => {
  const targetDate = new Date(dateString);
  const today = new Date();
  const differenceInTime = targetDate.getTime() - today.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
};
