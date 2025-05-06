import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  loginEmployee,
  logoutEmployee,
  fetchCurrentEmployee,
  fetchCurrentAdmin,
} from "@/api/authEmployee";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setIsLoading: () => {},
  login: async () => {},
  logout: async () => {},
};

const AuthContext = createContext<AuthState>(initialState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setUser(null);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const role = parsedUser?.role;

        let data: { user: User | null } | null = null;
        if (role === "employee") {
          data = await fetchCurrentEmployee();
        } else if (role === "admin") {
          data = await fetchCurrentAdmin();
        }

        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await loginEmployee(email, password);
      localStorage.setItem("user", JSON.stringify(data?.user));
      setUser(data?.user);

      if (data?.user?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data?.user?.role === "employee") {
        navigate("/employee/dashboard");
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${data?.user?.name}`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const data = await logoutEmployee();
      if (data?.success) {
        setUser(null);
        localStorage.removeItem("user");
        toast({
          title: "Logged out",
          description: data?.message || "You have been logged out",
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setIsLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
