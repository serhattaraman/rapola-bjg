
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

const AddCandidate = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Aday başarıyla eklendi!');
      navigate('/candidates');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Yeni Aday Ekle</h1>
          <p className="text-gray-500 mt-1">Yeni bir aday eklemek için formu doldurun</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-scale-in">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Adı girin"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Soyad
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Soyadı girin"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="E-posta adresi girin"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Telefon numarası girin"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pozisyon
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Başvurulan pozisyon"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başvuru Tarihi
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durum
                </label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                >
                  <option value="">Durum seçin</option>
                  <option value="pending">Beklemede</option>
                  <option value="inProgress">İşlemde</option>
                  <option value="completed">Tamamlandı</option>
                  <option value="rejected">Reddedildi</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aşama
                </label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                >
                  <option value="">Aşama seçin</option>
                  <option value="Başvuru">Başvuru</option>
                  <option value="Ön Değerlendirme">Ön Değerlendirme</option>
                  <option value="Mülakat">Mülakat</option>
                  <option value="Belge Kontrol">Belge Kontrol</option>
                  <option value="Evrak Hazırlığı">Evrak Hazırlığı</option>
                  <option value="Vize Başvurusu">Vize Başvurusu</option>
                  <option value="Vize Onayı">Vize Onayı</option>
                  <option value="Final Değerlendirme">Final Değerlendirme</option>
                </select>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notlar
              </label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-32 resize-none"
                placeholder="Aday hakkında notlar ekleyin"
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Belgeler
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <input type="file" multiple className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="text-primary font-medium">Dosya yüklemek için tıklayın</span> veya dosyaları sürükleyip bırakın
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      PDF, Word, Excel veya görüntü dosyaları (maks. 10MB)
                    </p>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/candidates')}
                className="btn-secondary mr-3"
              >
                <X className="mr-2 h-4 w-4" />
                İptal
              </button>
              <button
                type="submit"
                className="btn-primary"
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
