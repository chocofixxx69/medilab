"use client";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="flex min-h-screen bg-background text-foreground bg-radial-glow">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
