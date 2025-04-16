
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  PlusCircle, 
  BarChart, 
  FileText, 
  UserPlus,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar";

export const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { toast } = useToast();
  
  // Navbar items moved from Navbar component
  const navItems = [
    { name: 'Genel Bakış', path: '/', icon: <Home className="w-5 h-5" />, cssClass: 'nav-home', controller: 'Home', action: 'Index', roles: ['admin', 'manager', 'staff'] },
    { name: 'Adaylar', path: '/candidates', icon: <Users className="w-5 h-5" />, cssClass: 'nav-candidates', controller: 'Candidate', action: 'Index', roles: ['admin', 'manager', 'staff'] },
    { name: 'Aday Ekle', path: '/add-candidate', icon: <PlusCircle className="w-5 h-5" />, cssClass: 'nav-add', controller: 'Candidate', action: 'Create', roles: ['admin', 'manager'] },
    { name: 'Kullanıcı Raporları', path: '/reports', icon: <BarChart className="w-5 h-5" />, cssClass: 'nav-reports', controller: 'Report', action: 'Index', roles: ['admin', 'manager'] },
    { name: 'Form', path: '/form', icon: <FileText className="w-5 h-5" />, cssClass: 'nav-form', controller: 'Form', action: 'Index', roles: ['admin', 'manager', 'staff'] },
  ];

  // Add user management menu item for admins
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
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Çıkış yapıldı",
      description: "Başarıyla çıkış yaptınız",
    });
    navigate('/login');
  };

  // If not authenticated, don't render the sidebar items
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/c2b41ad4-b7ad-4952-8bab-44ecea70c96e.png" 
            alt="Rapola Logo" 
            className="h-8" 
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredNavItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                isActive={location.pathname === item.path}
                tooltip={item.name}
                asChild
              >
                <Link to={item.path} className={`flex items-center gap-2 ${item.cssClass}`}>
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Çıkış Yap</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
