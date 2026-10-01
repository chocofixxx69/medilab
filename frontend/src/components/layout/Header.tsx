"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Search,
  Plus,
  Mic,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useState } from "react";

export function Header() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const { logout } = useAuth();
  const [globalSearch, setGlobalSearch] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      router.push(`/patients?search=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-4 md:px-8 backdrop-blur-xl transition-all">
      {/* Mobile menu toggle & Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="iconSm"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle navigation</span>
        </Button>

        {/* Global Instant Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden sm:flex items-center w-72 md:w-96"
        >
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search patients, phone, or report ID..."
            className="pl-10 pr-12 h-10 rounded-xl bg-muted/40 border-border/60 focus:bg-background transition-all text-sm"
          />
          <kbd className="absolute right-3 hidden lg:inline-flex items-center gap-0.5 rounded border border-border/70 bg-card px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground shadow-xs">
            ⌘K
          </kbd>
        </form>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Whisper AI Online (Indic 10+)</span>
        </div>

        {/* Quick New Patient */}
        <Button
          variant="outline"
          size="sm"
          asChild
          className="hidden sm:flex rounded-xl gap-1.5 font-semibold text-xs h-9"
        >
          <Link href="/patients/new">
            <Plus className="h-3.5 w-3.5" />
            <span>New Patient</span>
          </Link>
        </Button>

        {/* Start Recording CTA */}
        <Button
          variant="gradient"
          size="sm"
          asChild
          className="rounded-xl gap-1.5 font-bold text-xs h-9 px-3.5 shadow-glow-teal"
        >
          <Link href="/recording">
            <Mic className="h-3.5 w-3.5" />
            <span>Consultation</span>
          </Link>
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="iconSm"
              className="relative rounded-xl border-border/60 bg-card/60"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-xs">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Clinical Alerts
              </span>
              <Badge variant="outline" className="text-[10px]">
                3 New
              </Badge>
            </div>
            <div className="space-y-1 py-1">
              <div className="p-2.5 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <p className="text-xs font-semibold text-foreground">
                    Prescription Ready
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 pl-6">
                  Report #MN-2024-0012 ready for download & WhatsApp dispatch
                </p>
              </div>
              <div className="p-2.5 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-teal-500 shrink-0" />
                  <p className="text-xs font-semibold text-foreground">
                    Hindi Audio Model Updated
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 pl-6">
                  Enhanced medical phonetic dictionary active for North India dialects
                </p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Account Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-card/80 p-1.5 pr-3 hover:bg-accent/50 transition-all focus:outline-none">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-xs font-extrabold text-white shadow-xs">
                {user?.name ? getInitials(user.name) : "DR"}
              </div>
              <div className="hidden flex-col items-start text-left md:flex">
                <span className="text-xs font-bold leading-tight text-foreground truncate max-w-[120px]">
                  {user?.name || "Dr. Medical User"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                  {user?.hospital_name || "General Clinic"}
                </span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 p-2 rounded-2xl shadow-xl">
            <DropdownMenuLabel className="p-2">
              <div className="flex flex-col space-y-0.5">
                <p className="text-xs font-bold text-foreground">{user?.name || "Doctor"}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                {user?.qualification && (
                  <Badge variant="outline" className="text-[10px] w-fit mt-1">
                    {user.qualification}
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
              <Link href="/settings" className="flex items-center text-xs font-medium">
                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                Clinic Preferences
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="rounded-lg cursor-pointer text-destructive focus:text-destructive text-xs font-semibold"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
