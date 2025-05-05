import React, { ReactNode } from "react";
import Navbar from "../components/Navbar";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-50">
      <Navbar />
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">{children}</div>
    </div>
  );
};

export default PageLayout;
