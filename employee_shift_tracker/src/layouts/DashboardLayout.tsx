import { Outlet } from "react-router-dom";
import PageLayout from "./PageLayout";

export default function DashboardLayout() {
  return (
    <PageLayout>
      <div className="flex flex-col h-screen w-full bg-white dark:bg-gray-900">
        <header className="h-[66px] bg-white dark:bg-gray-900 border-border transform transition-transform duration-300 fixed top-0 right-0 left-0 z-30" >
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pt-16 z-10">
          <Outlet />
        </main>
      </div>
    </PageLayout>
  );
}
