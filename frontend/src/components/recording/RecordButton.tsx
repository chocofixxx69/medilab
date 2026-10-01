"use client";

import { cn } from "@/lib/utils";
import { Mic, Square, Pause, Play, Loader2 } from "lucide-react";

type RecordingStatus =
  | "idle"
  | "connecting"
  | "recording"
  | "paused"
  | "processing"
  | "completed"
  | "error";

interface RecordButtonProps {
  status: RecordingStatus;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

// UI/UX Pro Max Guideline Compliant Sizes:
// Every touch target is >= 48px (exceeding iOS 44pt and Android 48dp minimum)
const sizeClasses = {
  sm: {
    main: "w-14 h-14 min-w-[56px] min-h-[56px]",
    mainIcon: "h-6 w-6",
    secondary: "w-12 h-12 min-w-[48px] min-h-[48px]",
    secondaryIcon: "h-5 w-5",
    gap: "gap-4",
  },
  md: {
    main: "w-20 h-20 min-w-[80px] min-h-[80px]",
    mainIcon: "h-8 w-8",
    secondary: "w-14 h-14 min-w-[56px] min-h-[56px]",
    secondaryIcon: "h-6 w-6",
    gap: "gap-5",
  },
  lg: {
    main: "w-24 h-24 min-w-[96px] min-h-[96px]",
    mainIcon: "h-10 w-10",
    secondary: "w-16 h-16 min-w-[64px] min-h-[64px]",
    secondaryIcon: "h-7 w-7",
    gap: "gap-6",
  },
};

export function RecordButton({
  status,
  onStart,
  onStop,
  onPause,
  onResume,
  disabled = false,
  size = "md",
}: RecordButtonProps) {
  const isRecording = status === "recording";
  const isPaused = status === "paused";
  const isConnecting = status === "connecting";
  const isProcessing = status === "processing";
  const isActive = isRecording || isPaused;
  const sizes = sizeClasses[size];

  const handleMainClick = () => {
    if (disabled || isConnecting || isProcessing) return;

    if (isActive) {
      onStop();
    } else {
      onStart();
    }
  };

  const handleSecondaryClick = () => {
    if (disabled || isConnecting || isProcessing) return;

    if (isPaused) {
      onResume();
    } else if (isRecording) {
      onPause();
    }
  };

  return (
    <div
      className={cn("flex items-center justify-center select-none", sizes.gap)}
      role="group"
      aria-label="Audio recording console controls"
    >
      {/* Secondary Button: Pause / Resume (Left on mobile for thumb accessibility) */}
      {isActive && (
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={handleSecondaryClick}
            disabled={disabled}
            className={cn(
              "rounded-2xl bg-card border border-border/80 text-foreground flex items-center justify-center shadow-subtle transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "active:scale-95 touch-manipulation",
              sizes.secondary,
              !disabled && "hover:bg-accent hover:border-primary/50"
            )}
            aria-label={isPaused ? "Resume consultation recording" : "Pause consultation recording"}
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? (
              <Play className={cn(sizes.secondaryIcon, "text-primary ml-0.5")} aria-hidden="true" />
            ) : (
              <Pause className={cn(sizes.secondaryIcon, "text-foreground")} aria-hidden="true" />
            )}
          </button>
          <span className="text-[11px] font-semibold text-muted-foreground">
            {isPaused ? "Resume" : "Pause"}
          </span>
        </div>
      )}

      {/* Main Record/Stop Orb Button */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={handleMainClick}
          disabled={disabled || isConnecting || isProcessing}
          className={cn(
            "relative rounded-full flex items-center justify-center transition-all shadow-lg",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-offset-2",
            "active:scale-95 touch-manipulation",
            sizes.main,
            isActive
              ? "bg-rose-500 hover:bg-rose-600 focus-visible:ring-rose-500/50 shadow-rose-500/30"
              : "bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-400 hover:opacity-95 shadow-glow-emerald focus-visible:ring-primary/50",
            (disabled || isConnecting || isProcessing) && "opacity-50 cursor-not-allowed"
          )}
          aria-label={isActive ? "Stop recording consultation and review report" : "Start recording patient consultation"}
        >
          {/* Animated Halo Ping for Active Recording */}
          {isRecording && (
            <span
              className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-30 pointer-events-none"
              aria-hidden="true"
            />
          )}

          {/* Icon */}
          {isConnecting || isProcessing ? (
            <Loader2 className={cn(sizes.mainIcon, "text-white animate-spin")} aria-hidden="true" />
          ) : isActive ? (
            <Square className={cn(sizes.mainIcon, "text-white fill-current")} aria-hidden="true" />
          ) : (
            <Mic className={cn(sizes.mainIcon, "text-white")} aria-hidden="true" />
          )}
        </button>
        <span className="text-[11px] font-bold text-foreground">
          {isActive ? "Stop & Review" : "Start Scribe"}
        </span>
      </div>
    </div>
  );
}
