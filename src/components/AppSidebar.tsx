import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Users, 
  UserPlus, 
  FileText, 
  Settings, 
  LogOut, 
  User, 
  BookOpen, 
  Bell,
  ChevronDown,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DarkModeButton } from './DarkModeButton';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function AppSidebar() {
  const [notificationCount, setNotificationCount] = useState(1);
  const { currentUser: user, logout } = useAuth();
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
  };

  const clearNotifications = () => {
    setNotificationCount(0);
    toast({
      title: "Bildirimler temizlendi",
      description: "Tüm bildirimler okundu olarak işaretlendi.",
    });
  };

  const isActive = (path: string) => location.pathname === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50";

  // Navigation items
  const mainItems = [
    { title: "Anasayfa", url: "/", icon: Home },
    { title: "Adaylar", url: "/candidates", icon: Users },
    { title: "Gruplar", url: "/groups", icon: BookOpen },
    { title: "Form", url: "/form", icon: FileText },
  ];

  const adminManagerItems = [
    { title: "Aday Ekle", url: "/add-candidate", icon: UserPlus },
  ];

  const adminItems = [
    { title: "Kullanıcılar", url: "/users", icon: User },
    { title: "Süreç Yönetimi", url: "/process-management", icon: Settings },
  ];

  const reportsItems = [
    { title: "Genel Raporlar", url: "/reports", icon: BarChart3 },
    { title: "Reklam Raporları", url: "/reports/advertising", icon: BarChart3 },
  ];

  const isReportsExpanded = reportsItems.some(item => isActive(item.url));

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/c2b41ad4-b7ad-4952-8bab-44ecea70c96e.png" 
            alt="Rapola Logo" 
            className={collapsed ? "h-8 w-8" : "h-12 w-12"}
          />
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-lg">Rapola</h2>
              <p className="text-xs text-muted-foreground">Aday Takip Sistemi</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Ana Menü</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin/Manager Section */}
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Yönetim</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminManagerItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className={getNavCls}>
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  
                  {/* Reports Collapsible */}
                  <Collapsible defaultOpen={isReportsExpanded}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <BarChart3 className="h-4 w-4" />
                          {!collapsed && (
                            <>
                              <span>Raporlar</span>
                              <ChevronDown className="ml-auto h-4 w-4" />
                            </>
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!collapsed && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {reportsItems.map((item) => (
                              <SidebarMenuSubItem key={item.title}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink to={item.url} className={getNavCls}>
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Admin Only Section */}
        {user?.role === 'admin' && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className={getNavCls}>
                          <item.icon className="h-4 w-4" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          {/* Notifications */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <div className="relative">
                    <Bell className="h-4 w-4" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                        {notificationCount}
                      </span>
                    )}
                  </div>
                  {!collapsed && <span>Bildirimler</span>}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex flex-col">
                    <p className="font-medium">Yeni grup eklendi</p>
                    <p className="text-sm text-gray-500">B1-3 grubu sisteme eklendi</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={clearNotifications} className="cursor-pointer text-blue-600 hover:text-blue-800 dark:text-blue-400">
                  Tüm bildirimleri temizle
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          {/* Dark Mode Toggle */}
          <SidebarMenuItem>
            <div className="flex justify-center p-2">
              <DarkModeButton />
            </div>
          </SidebarMenuItem>

          {/* User & Logout */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Çıkış</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}