
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<{ id: string; message: string; read: boolean; candidateId?: string }[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const isMobile = useIsMobile();

  // Check if current page is login page
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock notifications based on user role
  useEffect(() => {
    if (currentUser) {
      // Simulate fetching notifications
      let mockNotifications = [];
      if (currentUser.role === 'admin') {
        mockNotifications = [
          { id: '1', message: 'Yeni bir aday eklendi: Ali Yılmaz', read: false, candidateId: 'c1' },
          { id: '2', message: 'Evrak süreci tamamlanmayı bekliyor', read: false, candidateId: 'c2' },
          { id: '3', message: 'Sistem güncellemesi yapıldı', read: true }
        ];
      } else if (currentUser.role === 'staff') {
        mockNotifications = [
          { id: '1', message: 'Mehmet Aydın adlı aday evrak sürecinde', read: false, candidateId: 'c3' },
          { id: '2', message: 'Zeynep Kaya adlı aday evrak sürecinde', read: false, candidateId: 'c4' }
        ];
      } else {
        mockNotifications = [
          { id: '1', message: '3 aday işlem bekliyor', read: false, candidateId: 'c5' }
        ];
      }
      setNotifications(mockNotifications);
      setNotificationCount(mockNotifications.filter(n => !n.read).length);
    }
  }, [currentUser]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setNotificationCount(0);
  };

  const handleNotificationClick = (notification: { id: string; message: string; read: boolean; candidateId?: string }) => {
    // Mark as read
    markAsRead(notification.id);
    
    // If there's a candidate ID, navigate to that candidate's detail page
    if (notification.candidateId) {
      navigate(`/candidate/${notification.candidateId}`);
    }
  };

  // If on login page, don't render the navbar
  if (isLoginPage) {
    return null;
  }

  return (
    <nav 
      className={`fixed top-0 right-0 left-0 md:left-[var(--sidebar-width)] z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-white/0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Mobile menu toggle */}
          <div className="flex items-center">
            <SidebarTrigger className="md:hidden" />
          </div>
          
          {/* Right side items */}
          <div className="flex items-center">
            {isAuthenticated && (
              <>
                {/* Notification button */}
                <div className="flex items-center mr-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {notificationCount > 0 && (
                          <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full px-1">
                            {notificationCount}
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">Bildirimler</h3>
                          {notificationCount > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-xs text-primary hover:text-primary/80"
                              onClick={markAllAsRead}
                            >
                              Tümünü Okundu İşaretle
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notification => (
                            <div 
                              key={notification.id} 
                              className={`p-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
                                !notification.read ? 'bg-primary/5' : ''
                              }`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <p className="text-sm">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.read ? 'Okundu' : 'Okunmadı'}
                                {notification.candidateId && <span className="ml-2 text-primary">• Detayları Görüntüle</span>}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            Bildirim bulunmuyor
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* User avatar dropdown */}
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {currentUser?.name.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>
                        {currentUser?.name}
                        <div className="text-xs text-gray-500 mt-1">
                          {currentUser?.role === 'admin' && 'Admin'}
                          {currentUser?.role === 'manager' && 'Yönetici'}
                          {currentUser?.role === 'staff' && 'Personel'}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {/* User controls moved to sidebar */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
