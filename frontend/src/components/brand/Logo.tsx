"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showSubtitle?: boolean;
  subtitle?: string;
  href?: string | null;
  collapsed?: boolean;
  className?: string;
}

export function MedicalCrossIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
    >
      <defs>
        <linearGradient id="medinoteBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <filter id="medinoteGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0d9488" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Rounded Squircle Container */}
      <rect
        width="48"
        height="48"
        rx="15"
        fill="url(#medinoteBg)"
        filter="url(#medinoteGlow)"
      />

      {/* Subtle Inner Highlight */}
      <rect
        x="1.5"
        y="1.5"
        width="45"
        height="45"
        rx="13.5"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.5"
      />

      {/* Clinical Cross integrated with Pulse Waveform */}
      {/* Vertical Stem */}
      <rect x="21" y="11" width="6" height="26" rx="3" fill="#ffffff" />

      {/* Left Cross Arm */}
      <rect x="11" y="21" width="10" height="6" rx="3" fill="#ffffff" />

      {/* Right Cross Arm */}
      <rect x="27" y="21" width="10" height="6" rx="3" fill="#ffffff" />

      {/* Dynamic Vitality Pulse Accent along horizontal plane */}
      <path
        d="M 12 24 L 18 24 L 21 16 L 24 32 L 27 20 L 30 24 L 36 24"
        stroke="#065f46"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Vitality Point */}
      <circle cx="24" cy="24" r="1.8" fill="#ffffff" />
    </svg>
  );
}

export function Logo({
  size = "md",
  showSubtitle = true,
  subtitle = "Ambient Clinical Scribe",
  href = "/",
  collapsed = false,
  className,
}: LogoProps) {
  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-11 w-11",
    lg: "h-13 w-13",
  };

  const textSizes = {
    sm: "text-base font-bold",
    md: "text-xl font-extrabold",
    lg: "text-2xl font-black",
  };

  const content = (
    <div className={cn("flex items-center gap-3 group select-none", className)}>
      {/* Custom Clinical Brand Icon */}
      <div
        className={cn(
          "shrink-0 transition-transform duration-200 group-hover:scale-105",
          iconSizes[size]
        )}
      >
        <MedicalCrossIcon />
      </div>

      {/* Wordmark (hidden if collapsed sidebar) */}
      {!collapsed && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "tracking-tight text-foreground font-sans",
                textSizes[size]
              )}
            >
              Medi<span className="text-teal-600 dark:text-teal-400">Note</span>
            </span>
            <span className="inline-flex items-center rounded-full border border-teal-500/20 bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-teal-700 dark:text-teal-300">
              Clinical
            </span>
          </div>

          {showSubtitle && subtitle && (
            <p className="text-[11px] font-medium text-muted-foreground truncate leading-tight mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
