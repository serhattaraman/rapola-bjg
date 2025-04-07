
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, PlusCircle, BarChart, Menu, X, FileText, LogIn, LogOut, UserPlus, Shield, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
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
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<{ id: string; message: string; read: boolean }[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { toast } = useToast();

  // Check if current page is login page - important: moved outside any conditional rendering
  const isLoginPage = location.pathname === '/login';

  // Bu nesne .NET MVC'de C# model sınıfına dönüştürülebilir
  const navItems = [
    { name: 'Genel Bakış', path: '/', icon: <Home className="w-5 h-5" />, cssClass: 'nav-home', controller: 'Home', action: 'Index', roles: ['admin', 'manager', 'staff'] },
    { name: 'Adaylar', path: '/candidates', icon: <Users className="w-5 h-5" />, cssClass: 'nav-candidates', controller: 'Candidate', action: 'Index', roles: ['admin', 'manager', 'staff'] },
    { name: 'Aday Ekle', path: '/add-candidate', icon: <PlusCircle className="w-5 h-5" />, cssClass: 'nav-add', controller: 'Candidate', action: 'Create', roles: ['admin', 'manager'] },
    { name: 'Kullanıcı Raporları', path: '/reports', icon: <BarChart className="w-5 h-5" />, cssClass: 'nav-reports', controller: 'Report', action: 'Index', roles: ['admin', 'manager'] },
    { name: 'Form', path: '/form', icon: <FileText className="w-5 h-5" />, cssClass: 'nav-form', controller: 'Form', action: 'Index', roles: ['admin', 'manager', 'staff'] },
  ];

  // Add user management menu item for admins - moved outside conditional rendering
  const filteredNavItems = navItems.filter(item => {
    if (!currentUser) return false;
    return item.roles.includes(currentUser.role);
  });

  // Add admin-only menu item if applicable
  if (currentUser && currentUser.role === 'admin') {
    const adminMenuItem = { 
      name: 'Kullanıcı Yönetimi', 
      path: '/users', 
      icon: <UserPlus className="w-5 h-5" />, 
      cssClass: 'nav-users', 
      controller: 'User', 
      action: 'Index',
      roles: ['admin']
    };
    
    // Check if it's not already there before adding
    if (!filteredNavItems.some(item => item.path === '/users')) {
      filteredNavItems.push(adminMenuItem);
    }
  }

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Mock notifications based on user role - in a real app, this would come from an API
  useEffect(() => {
    if (currentUser) {
      // Simulate fetching notifications
      let mockNotifications = [];
      if (currentUser.role === 'admin') {
        mockNotifications = [
          { id: '1', message: 'Yeni bir aday eklendi: Ali Yılmaz', read: false },
          { id: '2', message: 'Evrak süreci tamamlanmayı bekliyor', read: false },
          { id: '3', message: 'Sistem güncellemesi yapıldı', read: true }
        ];
      } else if (currentUser.role === 'staff') {
        mockNotifications = [
          { id: '1', message: 'Mehmet Aydın adlı aday evrak sürecinde', read: false },
          { id: '2', message: 'Zeynep Kaya adlı aday evrak sürecinde', read: false }
        ];
      } else {
        mockNotifications = [
          { id: '1', message: '3 aday işlem bekliyor', read: false }
        ];
      }
      setNotifications(mockNotifications);
      setNotificationCount(mockNotifications.filter(n => !n.read).length);
    }
  }, [currentUser]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Çıkış yapıldı",
      description: "Başarıyla çıkış yaptınız",
    });
    navigate('/login');
  };

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

  // If on login page, don't render the navbar
  if (isLoginPage) {
    return null;
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 main-navbar ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm scrolled' : 'bg-white/0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 navbar-container">
        <div className="flex justify-between h-16 navbar-inner">
          <div className="flex-shrink-0 flex items-center navbar-logo">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/c2b41ad4-b7ad-4952-8bab-44ecea70c96e.png" 
                alt="Rapola Logo" 
                className="h-10" 
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 desktop-nav">
            {isAuthenticated ? (
              <>
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 nav-item ${item.cssClass} ${
                      location.pathname === item.path
                        ? 'text-primary bg-primary/10 active'
                        : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2 nav-text">{item.name}</span>
                  </Link>
                ))}
                
                {/* Notification button */}
                <div className="flex items-center">
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
                              onClick={() => markAsRead(notification.id)}
                            >
                              <p className="text-sm">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.read ? 'Okundu' : 'Okunmadı'}
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

                <div className="ml-2">
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
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Çıkış Yap</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                <LogIn className="w-5 h-5" />
                <span className="ml-2">Giriş Yap</span>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center mobile-menu-button">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-primary/5 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white mobile-nav-container`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 mobile-nav-inner">
          {isAuthenticated ? (
            <>
              <div className="px-3 py-2 text-sm font-medium text-gray-600">
                <div className="flex items-center space-x-2 mb-2">
                  {currentUser?.role === 'admin' && <Shield className="h-4 w-4 text-red-500" />}
                  <span>{currentUser?.name}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {currentUser?.role === 'admin' && 'Admin'}
                  {currentUser?.role === 'manager' && 'Yönetici'}
                  {currentUser?.role === 'staff' && 'Personel'}
                </div>
              </div>

              {/* Mobile Notifications */}
              <button
                className="flex w-full items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-primary/5"
                onClick={() => {
                  // In a real app, this would open a mobile-friendly notification drawer
                  toast({
                    title: "Bildirimler",
                    description: `${notificationCount} okunmamış bildiriminiz var.`,
                  });
                }}
              >
                <div className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  <span>Bildirimler</span>
                </div>
                {notificationCount > 0 && (
                  <Badge className="bg-red-500 text-white">
                    {notificationCount}
                  </Badge>
                )}
              </button>
              
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium nav-item-mobile ${item.cssClass} ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary/10 active'
                      : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {item.icon}
                  <span className="ml-2 nav-text">{item.name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span className="ml-2">Çıkış Yap</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-primary/5"
            >
              <LogIn className="w-5 h-5" />
              <span className="ml-2">Giriş Yap</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
