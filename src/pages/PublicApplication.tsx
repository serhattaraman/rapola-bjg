import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Upload, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

// Public application form data type
type PublicApplicationData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  source: string;
  notes?: string;
  documents?: FileList;
};

const PublicApplication = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PublicApplicationData>();
  
  const onSubmit = (data: PublicApplicationData) => {
    setIsSubmitting(true);
    
    // Create candidate object with default values for public applications
    const candidateData = {
      ...data,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      stage: 'Başvuru',
      appliedAt: new Date().toISOString(),
      id: `candidate-${Date.now()}`, // Simple ID generation
    };
    
    // Save to localStorage (in real app, this would be sent to backend)
    const existingCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    existingCandidates.push(candidateData);
    localStorage.setItem('candidates', JSON.stringify(existingCandidates));
    
    console.log('Public application submitted:', candidateData);
    console.log('Uploaded files:', uploadedFiles);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Başvurunuz başarıyla alındı! En kısa sürede size dönüş yapacağız.');
      reset();
      setUploadedFiles([]);
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
        {/* Header with logo and back button */}
        <div className="py-6 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/c2b41ad4-b7ad-4952-8bab-44ecea70c96e.png" 
              alt="Rapola Logo" 
              className="h-12 mr-4" 
            />
            <div>
              <h1 className="text-3xl font-bold">İş Başvurusu</h1>
              <p className="text-gray-500 mt-1">Aramıza katılmak için başvuru formunu doldurun</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Giriş Sayfası
          </button>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
          <form onSubmit={handleSubmit(onSubmit)} className="application-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                  placeholder="Adınızı girin"
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
                  placeholder="Soyadınızı girin"
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
                  placeholder="E-posta adresinizi girin"
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
                  placeholder="Telefon numaranızı girin"
                  {...register('phone', { required: 'Telefon alanı zorunludur' })}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>
              
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başvurmak İstediğiniz Pozisyon <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 border ${errors.position ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                  placeholder="Örn: Yazılım Geliştirici, Muhasebe Uzmanı"
                  {...register('position', { required: 'Pozisyon alanı zorunludur' })}
                />
                {errors.position && (
                  <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bize nereden ulaştınız? <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-4 py-2 border ${errors.source ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all`}
                  {...register('source', { required: 'Bu alanı seçmeniz gerekmektedir' })}
                >
                  <option value="">Seçiniz</option>
                  <option value="google-ads">Google Reklam</option>
                  <option value="instagram">Instagram</option>
                  <option value="x">X (Twitter)</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="website">Web Sitemiz</option>
                  <option value="referral">Arkadaş Tavsiyesi</option>
                  <option value="other">Diğer</option>
                </select>
                {errors.source && (
                  <p className="text-red-500 text-xs mt-1">{errors.source.message}</p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ek Bilgiler
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-32 resize-none"
                placeholder="Kendiniz hakkında kısa bilgi verebilir, deneyimlerinizi paylaşabilirsiniz..."
                {...register('notes')}
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                CV ve Belgeler
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
                    CV ve belgelerinizi yüklemek için tıklayın
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
            
            <div className="border-t border-gray-200 pt-6 flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center disabled:opacity-70 disabled:cursor-not-allowed text-lg font-medium"
                disabled={isSubmitting}
              >
                <Send className="mr-2 h-5 w-5" />
                {isSubmitting ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PublicApplication;