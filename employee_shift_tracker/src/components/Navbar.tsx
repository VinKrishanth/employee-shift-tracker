import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  Timer,
  UserCircle,
  LogOut,
  ClipboardPenLineIcon,
  HistoryIcon,
  Users2Icon,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const [navItems, setNavItems] = useState([]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const navItemsAdmin = [
    { title: "Dashboard", path: "/admin/dashboard", icon: Home },
    { title: "Employees", path: "/admin/employees", icon: Users2Icon },
    { title: "Add Employee", path: "/admin/create-employee", icon: UserCircle },
  ];
  const navItemsEmployee = [
    { title: "Dashboard", path: "/employee/dashboard", icon: Home },
    { title: "Profile", path: "/employee/profile", icon: UserCircle },
    { title: "Projects", path: "/employee/create-project", icon: ClipboardPenLineIcon  },
    { title: "History", path: "/employee/history", icon: HistoryIcon  },
  ];

  useEffect(() => {
    if (!user) return;

    const items = user.role === "employee" ? navItemsEmployee : navItemsAdmin;
    setNavItems(items);
  }, [user]);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    return path !== "/" && location.pathname.startsWith(path);
  };

  return (
    <>
      <div className="fixed top-4 left-4 z-40 md:hidden ">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-white rounded-full  hover:bg-gray-50 transition-all active:scale-95 dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } md:relative md:translate-x-0 flex flex-col h-full overflow-y-auto`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Timer className="h-6 w-6 text-agri-primary" />
            <span className="text-lg font-bold text-foreground">
              Employee Tracker
            </span>
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-agri-primary/10 text-agri-primary font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-foreground"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon
                className={`h-5 w-5 ${
                  isActive(item.path) ? "text-agri-primary" : ""
                }`}
              />
              <span>{item.title}</span>
              {isActive(item.path) && (
                <div className="ml-auto flex items-center">
                  <span className="h-2 w-2 rounded-full bg-agri-primary animate-pulse-slow"></span>
                  <ChevronRight className="h-4 w-4 text-agri-primary ml-1" />
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border cursor-pointer">
          <div className="flex items-center space-x-3 px-3 py-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">AD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user && user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user && user?.email}
              </p>
            </div>
            <div>
              <LogOut
                onClick={() => {
                  logout();
                }}
                className="h-6 w-6 text-red-500 hover:scale-110 transition-all duration-100"
              />
            </div>
          </div>
        </div>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
