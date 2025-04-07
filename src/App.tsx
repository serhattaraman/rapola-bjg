
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
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import UserReports from "./pages/UserReports";
import RouteGuard from "./components/RouteGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes - accessible to all authenticated users */}
            <Route element={<RouteGuard />}>
              <Route path="/" element={<Index />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/candidate/:id" element={<CandidateDetails />} />
              <Route path="/form" element={<Form />} />
            </Route>
            
            {/* Admin and Manager only routes */}
            <Route element={<RouteGuard allowedRoles={['admin', 'manager']} />}>
              <Route path="/add-candidate" element={<AddCandidate />} />
              <Route path="/user-reports" element={<UserReports />} />
              <Route path="/reports" element={<Index />} /> {/* Placeholder for reports */}
            </Route>
            
            {/* Admin only routes */}
            <Route element={<RouteGuard allowedRoles={['admin']} />}>
              <Route path="/users" element={<UserManagement />} />
            </Route>
            
            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
