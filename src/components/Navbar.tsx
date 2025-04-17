
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Home, Users, UserPlus, FileText, Settings, LogOut, User, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { DarkModeButton } from './DarkModeButton';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser: user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    closeMobileMenu();
  }, [location]);

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="main-navbar fixed top-0 left-0 w-full bg-white border-b z-50">
      <div className="navbar-container">
        <div className="navbar-inner px-4 py-3 flex items-center justify-between">
          <Link to="/" className="navbar-logo flex items-center">
            <span className="brand-name font-bold text-xl">CRM</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="desktop-nav hidden md:flex items-center gap-4">
            <Link to="/" className={`nav-item ${isActive('/')}`}>
              <Home className="h-5 w-5" />
              <span className="nav-text">Anasayfa</span>
            </Link>
            <Link to="/candidates" className={`nav-item ${isActive('/candidates')}`}>
              <Users className="h-5 w-5" />
              <span className="nav-text">Adaylar</span>
            </Link>
            <Link to="/groups" className={`nav-item ${isActive('/groups')}`}>
              <BookOpen className="h-5 w-5" />
              <span className="nav-text">Gruplar</span>
            </Link>
            {user?.role === 'admin' && (
              <Link to="/users" className={`nav-item ${isActive('/users')}`}>
                <User className="h-5 w-5" />
                <span className="nav-text">Kullanıcılar</span>
              </Link>
            )}
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Link to="/add-candidate" className={`nav-item ${isActive('/add-candidate')}`}>
                <UserPlus className="h-5 w-5" />
                <span className="nav-text">Aday Ekle</span>
              </Link>
            )}
            <Link to="/form" className={`nav-item ${isActive('/form')}`}>
              <FileText className="h-5 w-5" />
              <span className="nav-text">Form</span>
            </Link>
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Link to="/reports" className={`nav-item ${isActive('/reports')}`}>
                <Settings className="h-5 w-5" />
                <span className="nav-text">Raporlar</span>
              </Link>
            )}
            <DarkModeButton />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış
            </Button>
          </div>

          {/* Mobile Menu Button */}
          {isMobile && (
            <button onClick={toggleMobileMenu} className="mobile-menu-button">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-container md:hidden">
          <div className="mobile-nav-inner p-4 flex flex-col gap-2">
            <Link to="/" className={`nav-item-mobile ${isActive('/')}`}>
              <Home className="h-5 w-5 mr-2" />
              Anasayfa
            </Link>
            <Link to="/candidates" className={`nav-item-mobile ${isActive('/candidates')}`}>
              <Users className="h-5 w-5 mr-2" />
              Adaylar
            </Link>
            <Link to="/groups" className={`nav-item-mobile ${isActive('/groups')}`}>
              <BookOpen className="h-5 w-5 mr-2" />
              Gruplar
            </Link>
            {user?.role === 'admin' && (
              <Link to="/users" className={`nav-item-mobile ${isActive('/users')}`}>
                <User className="h-5 w-5 mr-2" />
                Kullanıcılar
              </Link>
            )}
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Link to="/add-candidate" className={`nav-item-mobile ${isActive('/add-candidate')}`}>
                <UserPlus className="h-5 w-5 mr-2" />
                Aday Ekle
              </Link>
            )}
            <Link to="/form" className={`nav-item-mobile ${isActive('/form')}`}>
              <FileText className="h-5 w-5 mr-2" />
              Form
            </Link>
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <Link to="/reports" className={`nav-item-mobile ${isActive('/reports')}`}>
                <Settings className="h-5 w-5 mr-2" />
                Raporlar
              </Link>
            )}
            <DarkModeButton />
            <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Çıkış
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
