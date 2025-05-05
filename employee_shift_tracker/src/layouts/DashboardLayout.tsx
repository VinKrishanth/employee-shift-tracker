import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DashboardLayout() {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {isMobile ? (
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-50">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[240px]">
                <DashboardSidebar />
              </SheetContent>
            </Sheet>
            <main className="flex-1 overflow-y-auto bg-background p-6 pt-16">
              <Outlet />
            </main>
          </>
        ) : (
          <>
            <DashboardSidebar />
            <main className="flex-1 overflow-y-auto bg-background p-6">
              <Outlet />
            </main>
          </>
        )}
      </div>
    </SidebarProvider>
  );
}