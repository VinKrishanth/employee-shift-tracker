import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./pages/Login";
import Employee from "./components/admin/Employee";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />

            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
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
                <Route path="employee" element={<Employee />} />
              </Route>

              <Route
                path="/employee"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <EmployeeDashboard />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
