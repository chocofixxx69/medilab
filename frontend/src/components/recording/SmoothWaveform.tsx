"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SmoothWaveformProps {
  isRecording: boolean;
  isPaused?: boolean;
  className?: string;
  barCount?: number;
}

export function SmoothWaveform({
  isRecording,
  isPaused = false,
  className,
  barCount = 48,
}: SmoothWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 640);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 96);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio || 640;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio || 96;
    };

    window.addEventListener("resize", handleResize);

    // Dynamic smoothing state array for bars
    const currentHeights = new Float32Array(barCount).fill(6);

    const render = (time: number) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, width, height);

      const dpr = window.devicePixelRatio || 1;
      const centerY = height / 2;
      const totalWidth = width;
      const barSpacing = totalWidth / barCount;
      const barWidth = Math.max(2.5 * dpr, barSpacing * 0.55);

      // Create vertical gradient for active bars
      const grad = ctx.createLinearGradient(0, centerY - 38 * dpr, 0, centerY + 38 * dpr);
      grad.addColorStop(0, "#06b6d4"); // cyan
      grad.addColorStop(0.35, "#10b981"); // emerald
      grad.addColorStop(0.65, "#0d9488"); // teal
      grad.addColorStop(1, "#0f766e");

      // Inactive/muted gradient
      const mutedGrad = ctx.createLinearGradient(0, centerY - 10 * dpr, 0, centerY + 10 * dpr);
      mutedGrad.addColorStop(0, "rgba(148, 163, 184, 0.45)");
      mutedGrad.addColorStop(1, "rgba(100, 116, 139, 0.25)");

      for (let i = 0; i < barCount; i++) {
        // Normalized coordinate from -1 to 1 (center is 0)
        const xNorm = (i - barCount / 2) / (barCount / 2);
        // Gaussian bell curve envelope
        const envelope = Math.exp(-2.8 * xNorm * xNorm);

        let targetH = 6 * dpr;

        if (isRecording && !isPaused) {
          // 3 harmonized frequencies for organic conversational voice cadence
          const waveA = Math.sin(t * 3.8 + i * 0.26) * 0.45;
          const waveB = Math.sin(t * 5.7 - i * 0.38) * 0.35;
          const waveC = Math.cos(t * 8.4 + i * 0.15) * 0.25;
          const combined = Math.abs(waveA + waveB + waveC);

          targetH = (6 + envelope * combined * 68) * dpr;
        } else if (isPaused) {
          // Slow breathing wave when paused
          targetH = (5 + envelope * (Math.sin(t * 1.8 + i * 0.15) * 0.5 + 0.5) * 8) * dpr;
        } else {
          // Subtle idle ripple
          targetH = (4 + envelope * (Math.sin(t * 1.2 + i * 0.1) * 0.5 + 0.5) * 4) * dpr;
        }

        // Smooth spring interpolation (0.18 factor) for butter-smooth 60fps transitions
        currentHeights[i] += (targetH - currentHeights[i]) * 0.18;
        const curH = currentHeights[i];

        const xPos = i * barSpacing + (barSpacing - barWidth) / 2;
        const yTop = centerY - curH / 2;
        const radius = barWidth / 2;

        ctx.fillStyle = isRecording && !isPaused ? grad : mutedGrad;

        // Draw rounded pill bar
        ctx.beginPath();
        ctx.moveTo(xPos + radius, yTop);
        ctx.lineTo(xPos + barWidth - radius, yTop);
        ctx.quadraticCurveTo(xPos + barWidth, yTop, xPos + barWidth, yTop + radius);
        ctx.lineTo(xPos + barWidth, yTop + curH - radius);
        ctx.quadraticCurveTo(xPos + barWidth, yTop + curH, xPos + barWidth - radius, yTop + curH);
        ctx.lineTo(xPos + radius, yTop + curH);
        ctx.quadraticCurveTo(xPos, yTop + curH, xPos, yTop + curH - radius);
        ctx.lineTo(xPos, yTop + radius);
        ctx.quadraticCurveTo(xPos, yTop, xPos + radius, yTop);
        ctx.closePath();
        ctx.fill();

        // Add soft glow crest on prominent peaks when recording
        if (isRecording && !isPaused && curH > 24 * dpr) {
          ctx.shadowColor = "rgba(16, 185, 129, 0.4)";
          ctx.shadowBlur = 10 * dpr;
        } else {
          ctx.shadowBlur = 0;
        }
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isRecording, isPaused, barCount]);

  return (
    <div
      className={cn(
        "relative w-full h-24 flex items-center justify-center rounded-2xl bg-muted/20 border border-border/50 p-2 overflow-hidden",
        className
      )}
    >
      {/* Background ambient glow pulse when recording */}
      {isRecording && !isPaused && (
        <div className="absolute inset-0 bg-radial-glow opacity-60 animate-pulse-subtle pointer-events-none" />
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full relative z-10 block"
        style={{ display: "block" }}
      />
    </div>
  );
}
