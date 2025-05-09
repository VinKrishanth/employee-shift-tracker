import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Employee from "./components/admin/Employee";
import Profile from "./components/employee/Profile";
import { TimeTrackingProvider } from "./contexts/TimeTrackingContext";
import Project from "./components/employee/Project";
import History from "./components/employee/History";
import ScrollToTop from '@/components/ScrollToTop'
import EmployeePage from "./components/admin/EmployeePage";
import AdminDashboard from "./components/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => {
  const { user } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <TimeTrackingProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route
                    path="/"
                    element={
                      user?.role === "employee" ? (
                        <Navigate to="/employee/dashboard" replace />
                      ) : (
                        <Navigate to="/login" replace />
                      )
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<NotFound />} />

                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="employees" element={<EmployeePage />} />
                    <Route path="create-employee" element={<Employee />} />
                    <Route path="history/:id" element={<History />} />
                  </Route>

                  <Route
                    path="/employee"
                    element={
                      <ProtectedRoute requiredRole="employee">
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="dashboard" element={<EmployeeDashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="create-project" element={<Project />} />
                    <Route path="edit-project/:id" element={<Project />} />
                    <Route path="history" element={<History />} />
                  </Route>
                </Routes>
              </TooltipProvider>
            </TimeTrackingProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
