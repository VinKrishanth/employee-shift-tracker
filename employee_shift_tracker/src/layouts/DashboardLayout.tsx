import { Outlet } from "react-router-dom";
import PageLayout from "./PageLayout";

export default function DashboardLayout() {
  return (
    <PageLayout>
      <div className="flex h-screen w-full">
        <main className="flex-1 overflow-y-auto bg-white dark:bg-black/30 p-6">
          <Outlet />
        </main>
      </div>
    </PageLayout>
  );
}
