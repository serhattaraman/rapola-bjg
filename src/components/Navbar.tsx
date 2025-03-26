
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Users, PlusCircle, BarChart, Menu, X, FileText, LogIn, LogOut, UserPlus, Shield } from 'lucide-react';
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

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { toast } = useToast();

  // Bu nesne .NET MVC'de C# model sınıfına dönüştürülebilir
  const navItems = [
    { name: 'Genel Bakış', path: '/', icon: <Home className="w-5 h-5" />, cssClass: 'nav-home', controller: 'Home', action: 'Index', roles: ['admin', 'manager', 'staff'] },
    { name: 'Adaylar', path: '/candidates', icon: <Users className="w-5 h-5" />, cssClass: 'nav-candidates', controller: 'Candidate', action: 'Index', roles: ['admin', 'manager', 'staff'] },
    { name: 'Aday Ekle', path: '/add-candidate', icon: <PlusCircle className="w-5 h-5" />, cssClass: 'nav-add', controller: 'Candidate', action: 'Create', roles: ['admin', 'manager'] },
    { name: 'Raporlar', path: '/reports', icon: <BarChart className="w-5 h-5" />, cssClass: 'nav-reports', controller: 'Report', action: 'Index', roles: ['admin', 'manager'] },
    { name: 'Form', path: '/form', icon: <FileText className="w-5 h-5" />, cssClass: 'nav-form', controller: 'Form', action: 'Index', roles: ['admin', 'manager', 'staff'] },
  ];

  // Add user management menu item for admins
  if (currentUser && currentUser.role === 'admin') {
    navItems.push({ 
      name: 'Kullanıcı Yönetimi', 
      path: '/users', 
      icon: <UserPlus className="w-5 h-5" />, 
      cssClass: 'nav-users', 
      controller: 'User', 
      action: 'Index',
      roles: ['admin']
    });
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

  const handleLogout = () => {
    logout();
    toast({
      title: "Çıkış yapıldı",
      description: "Başarıyla çıkış yaptınız",
    });
    navigate('/login');
  };

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!currentUser) return false;
    return item.roles.includes(currentUser.role);
  });

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
              <span className="text-xl font-semibold text-primary brand-name">Rapola</span>
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
