import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

// .NET MVC'ye dönüştürülebilecek aday türü
type CandidateFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  applicationDate: string;
  status: string;
  stage: string;
  notes: string;
  documents?: FileList;
  source: string; // New field for tracking where the candidate found us
};

const AddCandidate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  // React Hook Form ile form yönetimi
  const { register, handleSubmit, formState: { errors } } = useForm<CandidateFormData>({
    defaultValues: {
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      stage: 'Başvuru',
      source: '' // Default empty source
    }
  });
  
  const onSubmit = (data: CandidateFormData) => {
    setIsSubmitting(true);
    
    // Form verilerini gösterme - .NET MVC'de Controller'a gönderilecek
    console.log('Form verileri:', data);
    console.log('Yüklenen dosyalar:', uploadedFiles);
    
    // API çağrısı simülasyonu
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Aday başarıyla eklendi!');
      navigate('/candidates');
    }, 1500);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...fileArray]);
    }
  };
  
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Yeni Aday Ekle</h1>
          <p className="text-gray-500 mt-1">Yeni bir aday eklemek için formu doldurun</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
          <form onSubmit={handleSubmit(onSubmit)} className="candidate-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                  placeholder="Adı girin"
                  {...register('firstName', { required: 'Ad alanı zorunludur' })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                  placeholder="Soyadı girin"
                  {...register('lastName', { required: 'Soyad alanı zorunludur' })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                  placeholder="E-posta adresi girin"
                  {...register('email', { 
                    required: 'E-posta alanı zorunludur',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Geçerli bir e-posta adresi girin'
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                  placeholder="Telefon numarası girin"
                  {...register('phone', { required: 'Telefon alanı zorunludur' })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pozisyon <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.position ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                  placeholder="Başvurulan pozisyon"
                  {...register('position', { required: 'Pozisyon alanı zorunludur' })}
                />
                {errors.position && (
                  <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başvuru Tarihi <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={`w-full px-4 py-2 border ${errors.applicationDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                  {...register('applicationDate', { required: 'Başvuru tarihi zorunludur' })}
                />
                {errors.applicationDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.applicationDate.message}</p>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durum <span className="text-red-500">*</span>
                </label>
                <select 
                  className={`w-full px-4 py-2 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                  {...register('status', { required: 'Durum seçimi zorunludur' })}
                >
                  <option value="pending">Beklemede</option>
                  <option value="inProgress">İşlemde</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="rejected">Reddedildi</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aşama <span className="text-red-500">*</span>
                </label>
                <select 
                  className={`w-full px-4 py-2 border ${errors.stage ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                  {...register('stage', { required: 'Aşama seçimi zorunludur' })}
                >
                  <option value="Başvuru">Başvuru</option>
                  <option value="Ön Değerlendirme">Ön Değerlendirme</option>
                  <option value="Mülakat">Mülakat</option>
                  <option value="Belge Kontrol">Belge Kontrol</option>
                  <option value="Evrak Hazırlığı">Evrak Hazırlığı</option>
                  <option value="Vize Başvurusu">Vize Başvurusu</option>
                  <option value="Vize Onayı">Vize Onayı</option>
                  <option value="Final Değerlendirme">Final Değerlendirme</option>
                </select>
                {errors.stage && (
                  <p className="text-red-500 text-xs mt-1">{errors.stage.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bize nereden ulaştınız? <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-4 py-2 border ${errors.source ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                  {...register('source', { required: 'Başvuru kaynağı seçilmelidir' })}
                >
                  <option value="">Seçiniz</option>
                  <option value="google-ads">Google Reklam</option>
                  <option value="instagram">Instagram</option>
                  <option value="x">X</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="website">Sitemiz</option>
                </select>
                {errors.source && (
                  <p className="text-red-500 text-xs mt-1">{errors.source.message}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notlar
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-32 resize-none"
                placeholder="Aday hakkında notlar ekleyin"
                {...register('notes')}
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Belgeler
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  id="file-upload" 
                  onChange={handleFileChange}
                  {...register('documents')}
                />
                <div className="flex flex-col items-center">
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    Dosya yüklemek için tıklayın veya dosyaları sürükleyip bırakın
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    PDF, Word, Excel veya görüntü dosyaları (maks. 10MB)
                  </p>
                </div>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">Yüklenen Belgeler:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between border border-gray-200 rounded-md p-2 text-sm">
                        <span className="truncate">{file.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeFile(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/candidates')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center mr-3"
              >
                <X className="mr-2 h-4 w-4" />
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Kaydediliyor...' : 'Aday Ekle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCandidate;
