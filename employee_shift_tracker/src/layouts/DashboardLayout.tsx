import { Outlet } from "react-router-dom";
import PageLayout from "./PageLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout() {
  return (
    <PageLayout>
      <div className="flex flex-col min-h-screen w-full bg-white dark:bg-gray-900">
        <header className="h-[66px]  w-full bg-white dark:bg-gray-900 border-border transform transition-transform duration-300 fixed top-0 right-0 left-0 z-30 shadow">
          <div className="w-full flex justify-end py-4 pr-8">
            <Avatar className="cursor-pointer sm:h-10 sm:w-10 h-8 w-8 border-border">
              <AvatarImage src="https://github.com/shadcn.png"  />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pt-16 z-10">
          <Outlet />
        </main>
      </div>
    </PageLayout>
  );
}
