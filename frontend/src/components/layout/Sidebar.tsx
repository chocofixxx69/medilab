"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Mic,
  FileText,
  Settings,
  ChevronLeft,
  X,
  BarChart3,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    title: "Clinical Command",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Live Scribe Studio",
    href: "/recording",
    icon: Mic,
    badge: "AI",
  },
  {
    title: "Patient Registry",
    href: "/patients",
    icon: Users,
  },
  {
    title: "Reports & Prescriptions",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Clinical Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Clinic & AI Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, sidebarCollapsed, setSidebarOpen, setSidebarCollapsed } =
    useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border/70 bg-card/95 backdrop-blur-xl transition-all duration-300 md:relative md:z-20",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          sidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-border/60 px-4">
          <Logo
            size="sm"
            href="/dashboard"
            collapsed={sidebarCollapsed}
            subtitle="Clinical Suite"
          />

          {/* Close for mobile */}
          <Button
            variant="ghost"
            size="iconSm"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Collapse toggle for desktop */}
          <Button
            variant="ghost"
            size="iconSm"
            className="hidden md:flex text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                sidebarCollapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        {/* Quick Action Button */}
        <div className="p-3">
          <Button
            variant="gradient"
            asChild
            className={cn(
              "w-full justify-center transition-all",
              sidebarCollapsed ? "px-0 h-11 w-11 mx-auto rounded-xl" : "h-11 shadow-glow-teal"
            )}
          >
            <Link href="/recording" onClick={() => setSidebarOpen(false)}>
              <Mic className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span className="ml-2 font-semibold">Start Consultation</span>}
            </Link>
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-3 py-2 overflow-y-auto">
          {!sidebarCollapsed && (
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
              Clinical Workspace
            </p>
          )}

          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(`${item.href}`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-bold"
                    : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
                  sidebarCollapsed && "justify-center px-0 h-11 w-11 mx-auto"
                )}
                title={sidebarCollapsed ? item.title : undefined}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-primary"
                  )}
                />

                {!sidebarCollapsed && (
                  <div className="flex flex-1 items-center justify-between min-w-0">
                    <span className="truncate">{item.title}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Clinical Engine System Status */}
        <div className="border-t border-border/60 p-3 bg-muted/10">
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-muted-foreground transition-all",
              sidebarCollapsed ? "justify-center px-1" : "justify-between"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              {!sidebarCollapsed && (
                <span className="text-[11px] font-semibold text-foreground/80">
                  MediLab Engine
                </span>
              )}
            </div>
            {!sidebarCollapsed && (
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Active
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
