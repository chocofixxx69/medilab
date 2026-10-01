"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar,
  Languages,
  Clock,
  Sparkles,
  CheckCircle2,
  FileText,
  Activity,
  ArrowUpRight,
  Download,
  Filter,
  Eye,
  Table,
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");
  const [showDataTable, setShowDataTable] = useState(false);

  // Daily consultation trend data (Chart type: Trend Over Time - Line/Area)
  const consultationTrend = [
    { day: "Mon", count: 18, accuracy: 99.1, duration: 3.1 },
    { day: "Tue", count: 24, accuracy: 99.3, duration: 2.9 },
    { day: "Wed", count: 22, accuracy: 99.5, duration: 2.8 },
    { day: "Thu", count: 28, accuracy: 99.2, duration: 3.0 },
    { day: "Fri", count: 26, accuracy: 99.6, duration: 2.7 },
    { day: "Sat", count: 32, accuracy: 99.4, duration: 2.5 },
    { day: "Sun", count: 14, accuracy: 99.8, duration: 2.4 },
  ];

  // Top Clinical Diagnoses (Chart type: Compare Categories - Bar Chart)
  const topDiagnoses = [
    { diagnosis: "Upper Respiratory Infection / Viral Fever", count: 48, percentage: 32 },
    { diagnosis: "Type 2 Diabetes Mellitus Follow-up", count: 34, percentage: 23 },
    { diagnosis: "Essential Hypertension Management", count: 28, percentage: 19 },
    { diagnosis: "Acute Gastroenteritis / Dehydration", count: 18, percentage: 12 },
    { diagnosis: "Allergic Bronchitis / Cough", count: 14, percentage: 9 },
    { diagnosis: "Musculoskeletal Pain / Myalgia", count: 8, percentage: 5 },
  ];

  // Language Breakdown (Chart type: Part-to-Whole - Donut / Segmented Bar)
  const languageShare = [
    { lang: "Hindi (हिन्दी)", count: 92, percentage: 54, color: "bg-teal-500", hex: "#0d9488" },
    { lang: "English (Indian Standard)", count: 44, percentage: 26, color: "bg-emerald-500", hex: "#10b981" },
    { lang: "Tamil (தமிழ்)", count: 18, percentage: 11, color: "bg-cyan-500", hex: "#06b6d4" },
    { lang: "Telugu (తెలుగు)", count: 10, percentage: 6, color: "bg-amber-500", hex: "#f59e0b" },
    { lang: "Marathi / Others", count: 6, percentage: 3, color: "bg-indigo-500", hex: "#6366f1" },
  ];

  const maxDailyCount = Math.max(...consultationTrend.map((d) => d.count));

  return (
    <div className="space-y-8 pb-16" role="region" aria-label="Clinical Analytics & Performance Dashboard">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-card/80 border border-border/70 backdrop-blur-xl shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Clinical Intelligence Reporting
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Doctor Practice Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Consultation throughput, speech-to-text accuracy metrics, and regional language distribution
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-2xl border border-border/60">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-primary ${
                timeRange === range
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {range === "7d" ? "Past 7 Days" : range === "30d" ? "Past Month" : "Quarterly"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Target Cards (Performance vs Target) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl p-5 border-border/70 bg-card/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Weekly Consultations
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-foreground">164</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+18% vs last week</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Average 23.4 patients/day</p>
        </Card>

        <Card className="rounded-2xl p-5 border-border/70 bg-card/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Avg. Doc Turnaround
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-foreground">2.8 min</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">76% faster</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Traditional typing: ~12.5 min</p>
        </Card>

        <Card className="rounded-2xl p-5 border-border/70 bg-card/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Speech AI Confidence
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-foreground">99.4%</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Benchmark: &gt;98%</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Pharmacological entity precision</p>
        </Card>

        <Card className="rounded-2xl p-5 border-border/70 bg-card/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Time Saved This Week
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Activity className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-foreground">26.5 hrs</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Reclaimed</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Equivalent to ~3.5 OPD shifts</p>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Chart 1: Daily Consultation Volume & Audio Hours (Line & Area Chart) */}
        <Card className="lg:col-span-7 rounded-3xl border-border/70 p-6 md:p-8 bg-card/80 backdrop-blur-xl shadow-glass space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 className="text-base font-bold text-foreground">
                  Consultation Volume & Speed
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Daily patient visits and average Scribe completion duration
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDataTable(!showDataTable)}
              className="rounded-xl text-xs font-semibold"
              aria-label="Toggle accessible data table view"
            >
              <Table className="h-3.5 w-3.5 mr-1.5" />
              {showDataTable ? "Hide Table" : "A11y Table"}
            </Button>
          </div>

          {/* SVG Visual Chart */}
          <div className="space-y-4">
            <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2 px-2 bg-muted/20 rounded-2xl border border-border/50 relative overflow-hidden">
              {/* Background horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
                <div className="border-b border-dashed border-foreground w-full" />
                <div className="border-b border-dashed border-foreground w-full" />
                <div className="border-b border-dashed border-foreground w-full" />
                <div className="border-b border-dashed border-foreground w-full" />
              </div>

              {consultationTrend.map((d, i) => {
                const heightPercent = (d.count / maxDailyCount) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group z-10">
                    <span className="text-[11px] font-mono font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.count}
                    </span>
                    <div
                      className="w-full max-w-[36px] rounded-t-xl bg-gradient-to-t from-teal-600 via-emerald-500 to-cyan-400 group-hover:shadow-glow-teal transition-all duration-200"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-xs font-semibold text-muted-foreground">{d.day}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-gradient-to-tr from-teal-600 to-cyan-400" />
                Daily Consultations (Patients)
              </span>
              <span>Average Scribe Speed: 2.8 min</span>
            </div>
          </div>

          {/* Accessible Table Fallback (WCAG Requirement for Charts) */}
          {showDataTable && (
            <div className="overflow-x-auto pt-2 border-t border-border/50">
              <table className="w-full text-left text-xs font-mono">
                <caption className="sr-only">Daily consultation volume and accuracy statistics</caption>
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3">Day</th>
                    <th className="py-2 px-3">Consultations</th>
                    <th className="py-2 px-3">AI Accuracy</th>
                    <th className="py-2 px-3">Turnaround</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {consultationTrend.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/20">
                      <td className="py-2 px-3 font-sans font-bold">{row.day}</td>
                      <td className="py-2 px-3">{row.count} patients</td>
                      <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400">{row.accuracy}%</td>
                      <td className="py-2 px-3">{row.duration} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Chart 2: Indic Language Breakdown (Part-to-Whole Donut/Progress) */}
        <Card className="lg:col-span-5 rounded-3xl border-border/70 p-6 md:p-8 bg-card/80 backdrop-blur-xl shadow-glass space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
              <h2 className="text-base font-bold text-foreground">
                Indic Language Distribution
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Consultation speech recognition breakdown by dialect
            </p>
          </div>

          {/* Segmented Visual Stacked Bar */}
          <div className="space-y-3">
            <div
              className="h-6 w-full rounded-xl overflow-hidden flex bg-muted/40 border border-border/50"
              role="img"
              aria-label="Language distribution: Hindi 54%, English 26%, Tamil 11%, Telugu 6%, Marathi 3%"
            >
              {languageShare.map((l, i) => (
                <div
                  key={i}
                  className={`${l.color} transition-all duration-300 hover:opacity-90`}
                  style={{ width: `${l.percentage}%` }}
                  title={`${l.lang}: ${l.percentage}% (${l.count} sessions)`}
                />
              ))}
            </div>

            {/* Accessible Legend & Counts */}
            <div className="space-y-2.5 pt-2">
              {languageShare.map((l, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${l.color}`} aria-hidden="true" />
                    <span className="font-semibold text-foreground">{l.lang}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-muted-foreground">{l.count} visits</span>
                    <span className="font-bold text-foreground">{l.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Chart 3: Top Clinical Diagnoses (Category Comparison - Horizontal Bar) */}
      <Card className="rounded-3xl border-border/70 p-6 md:p-8 bg-card/80 backdrop-blur-xl shadow-glass space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            <h2 className="text-base font-bold text-foreground">
              Most Prevalent Clinical Diagnoses This Week
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Auto-extracted from ambient doctor-patient consultations
          </p>
        </div>

        <div className="space-y-3.5">
          {topDiagnoses.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-foreground">{item.diagnosis}</span>
                <span className="font-mono text-muted-foreground">
                  <strong className="text-foreground">{item.count} cases</strong> ({item.percentage}%)
                </span>
              </div>
              <div
                className="h-3 w-full rounded-full bg-muted/40 border border-border/50 overflow-hidden"
                role="progressbar"
                aria-valuenow={item.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${item.diagnosis}: ${item.count} cases`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all duration-300"
                  style={{ width: `${item.percentage * 2.5}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
