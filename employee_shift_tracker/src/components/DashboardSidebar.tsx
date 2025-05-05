import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  ArrowLeft, 
  ArrowRight, 
  LayoutDashboard, 
  LogIn, 
  Settings, 
  User,
  UserCog,
  Users
} from "lucide-react";

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Common navigation items
  const commonNavItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      path: "/dashboard/settings",
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Profile",
      path: "/dashboard/profile",
    },
  ];

  // Role-specific navigation items
  const adminNavItems = [
    {
      icon: <UserCog className="h-5 w-5" />,
      label: "Admin Dashboard",
      path: "/dashboard/admin",
    }
  ];

  const employeeNavItems = [
    {
      icon: <Users className="h-5 w-5" />,
      label: "Employee Dashboard",
      path: "/dashboard/employee",
    }
  ];

  
  const roleSpecificItems = user?.role === "admin" ? adminNavItems : employeeNavItems;

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "icon"}
      className={`transition-width duration-300 ${
        collapsed && !isMobile ? "w-[70px]" : "w-[240px]"
      }`}
    >
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <span className="text-lg font-semibold">App Dashboard</span>
          )}
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={toggleSidebar}
          >
            {collapsed ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </SidebarHeader>
      
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {commonNavItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.path}
                    asChild
                    tooltip={collapsed ? item.label : undefined}
                  >
                    <NavLink to={item.path}>
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>{user?.role === "admin" ? "Admin" : "Employee"}</SidebarGroupLabel>
            <SidebarMenu>
              {roleSpecificItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.path}
                    asChild
                    tooltip={collapsed ? item.label : undefined}
                  >
                    <NavLink to={item.path}>
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-2">
        <div className="flex items-center justify-between p-2">
          {!collapsed && !isMobile && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                {user?.email}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={logout}
              title="Logout"
            >
              <LogIn className="h-4 w-4 rotate-180" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}