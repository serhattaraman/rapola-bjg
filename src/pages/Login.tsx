
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email);
      if (success) {
        toast({
          title: "Giriş başarılı!",
          description: "Hoş geldiniz, yönlendiriliyorsunuz...",
        });
        navigate('/');
      } else {
        toast({
          title: "Giriş başarısız",
          description: "E-posta bulunamadı. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pt-20 pb-10 px-4 sm:px-6 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="mb-6">
            <img 
              src="/lovable-uploads/c2b41ad4-b7ad-4952-8bab-44ecea70c96e.png" 
              alt="Rapola Logo" 
              className="h-16" 
            />
          </div>
          <CardTitle className="text-2xl font-bold">Giriş</CardTitle>
          <CardDescription>
            Sisteme erişmek için e-posta adresinizi girin
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">E-posta</label>
              <Input
                id="email"
                type="email"
                placeholder="örnek@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Test için: admin@example.com, manager@example.com, staff@example.com
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Giriş yapılıyor...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Giriş Yap
                </span>
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">İş başvurusu yapmak istiyorsanız</p>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/basvuru')}
              >
                Başvuru Formu
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
