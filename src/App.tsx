import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Candidates from "./pages/Candidates";
import CandidateDetails from "./pages/CandidateDetails";
import AddCandidate from "./pages/AddCandidate";
import Form from "./pages/Form";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import UserReports from "./pages/UserReports";
import RouteGuard from "./components/RouteGuard";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import AdvertisingReports from "./pages/AdvertisingReports";
import ProcessManagement from "./pages/ProcessManagement";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public route - Login without sidebar */}
              <Route path="/login" element={<Login />} />
              
              {/* All authenticated routes with sidebar */}
              <Route element={<RouteGuard />}>
                <Route path="/*" element={
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar />
                      <div className="flex-1 flex flex-col">
                        {/* Header with sidebar trigger */}
                        <header className="h-12 flex items-center border-b px-4 bg-background">
                          <SidebarTrigger />
                        </header>
                        
                        {/* Main content */}
                        <main className="flex-1 overflow-auto">
                          <Routes>
                            {/* Protected routes - accessible to all authenticated users */}
                            <Route path="/" element={<Index />} />
                            <Route path="/candidates" element={<Candidates />} />
                            <Route path="/candidate/:id" element={<CandidateDetails />} />
                            <Route path="/groups" element={<Groups />} />
                            <Route path="/group/:id" element={<GroupDetail />} />
                            <Route path="/form" element={<Form />} />
                            
                            {/* Admin and Manager only routes */}
                            <Route element={<RouteGuard allowedRoles={['admin', 'manager']} />}>
                              <Route path="/add-candidate" element={<AddCandidate />} />
                              <Route path="/reports" element={<UserReports />} />
                              <Route path="/reports/advertising" element={<AdvertisingReports />} />
                            </Route>
                            
                            {/* Admin only routes */}
                            <Route element={<RouteGuard allowedRoles={['admin']} />}>
                              <Route path="/users" element={<UserManagement />} />
                              <Route path="/process-management" element={<ProcessManagement />} />
                            </Route>
                            
                            {/* 404 page */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </SidebarProvider>
                } />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
