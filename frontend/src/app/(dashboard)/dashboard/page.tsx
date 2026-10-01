"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { usePatients } from "@/hooks/usePatients";
import { useReports } from "@/hooks/useReports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Mic,
  FileText,
  Clock,
  UserPlus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calendar,
  Activity,
  CheckCircle2,
  ChevronRight,
  Phone,
  ShieldAlert,
  Download,
  Eye,
  Languages,
} from "lucide-react";
import { formatDate, getInitials, formatPhone, calculateAge } from "@/lib/utils";
import type { Patient, Report } from "@/types";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
  subtitle?: string;
  gradient: string;
}

function StatCard({ title, value, icon: Icon, change, subtitle, gradient }: StatCardProps) {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/80 backdrop-blur-md p-6 relative overflow-hidden group hover:border-primary/50 transition-all hover:shadow-card-hover">
      <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-foreground">{value}</p>
            {change && (
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                {change}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground pt-0.5">{subtitle}</p>}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: patientsData, isLoading: patientsLoading } = usePatients({ limit: 6 });
  const { data: reportsData, isLoading: reportsLoading } = useReports({ limit: 5 });

  const totalPatients = patientsData?.total || 0;
  const totalReports = reportsData?.total || 0;

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Doctor Welcome & Shift Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-teal-950/40 via-card to-card border border-border/70 backdrop-blur-xl relative overflow-hidden shadow-subtle">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Clinical Session Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            {getGreeting()}, {user?.name || "Dr. Consultation"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {user?.hospital_name ? `${user.hospital_name} • ` : ""}
            {formatDate(new Date())} • Speech AI Engine Ready (Indic 10+)
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <Button variant="outline" asChild className="rounded-xl h-10 border-border/80 bg-card/70 font-semibold">
            <Link href="/patients/new">
              <UserPlus className="mr-2 h-4 w-4" />
              New Patient
            </Link>
          </Button>
          <Button variant="gradient" asChild className="rounded-xl h-10 font-bold shadow-glow-teal px-5">
            <Link href="/recording">
              <Mic className="mr-2 h-4 w-4" />
              Start Ambient Scribe
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Registered Patients"
          value={totalPatients}
          change="+14% this month"
          subtitle="Electronic Health Records"
          icon={Users}
          gradient="bg-teal-500"
        />
        <StatCard
          title="Smart Reports Generated"
          value={totalReports}
          change="+28% this week"
          subtitle="Verified prescriptions & care plans"
          icon={FileText}
          gradient="bg-emerald-500"
        />
        <StatCard
          title="Consultation Hours Saved"
          value="48.5 hrs"
          change="~72% faster"
          subtitle="Saved through voice automation"
          icon={Clock}
          gradient="bg-cyan-500"
        />
        <StatCard
          title="Speech Accuracy Rating"
          value="99.4%"
          subtitle="Medical terminology confidence"
          icon={Sparkles}
          gradient="bg-indigo-500"
        />
      </div>

      {/* Quick Launch Studio Widget */}
      <Card className="rounded-3xl border border-primary/20 bg-gradient-to-r from-emerald-500/5 via-primary/5 to-cyan-500/5 p-6 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-glow-teal">
              <Mic className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Ready for your next patient consultation?
              </h3>
              <p className="text-sm text-muted-foreground">
                Select any patient or launch ambient dictation in Hindi, Tamil, Telugu, Bengali, Marathi, or English.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/patients">Search Patient Registry</Link>
            </Button>
            <Button variant="gradient" asChild className="rounded-xl font-bold shadow-glow-teal px-6">
              <Link href="/recording">Launch Studio &rarr;</Link>
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Split Grid: Recent Patients & Recent Reports */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Recent Patients (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Recent Patients</h2>
              <p className="text-xs text-muted-foreground">Active clinical records</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs font-semibold text-primary">
              <Link href="/patients">
                View All Patients
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          {patientsLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-2xl" />
              ))}
            </div>
          ) : patientsData?.results?.length === 0 ? (
            <Card className="rounded-2xl p-8 text-center border-dashed">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
              <h3 className="font-semibold text-foreground">No patients in registry yet</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Add your first patient to start generating ambient smart reports.
              </p>
              <Button asChild size="sm" variant="gradient">
                <Link href="/patients/new">Add First Patient</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {patientsData?.results?.slice(0, 6).map((patient) => {
                const age = patient.date_of_birth ? calculateAge(patient.date_of_birth) : null;
                return (
                  <Card
                    key={patient.id}
                    className="rounded-2xl border-border/60 hover:border-primary/50 transition-all p-4 hover:shadow-subtle group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                            {getInitials(`${patient.first_name} ${patient.last_name}`)}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/patients/${patient.id}`}
                              className="font-bold text-sm text-foreground hover:text-primary transition-colors truncate block"
                            >
                              {patient.first_name} {patient.last_name}
                            </Link>
                            <p className="text-[11px] text-muted-foreground font-mono">
                              {patient.patient_id} {age && `• ${age}y`} {patient.gender && `• ${patient.gender}`}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={patient.status === "active" ? "success" : "secondary"}
                          className="text-[10px]"
                        >
                          {patient.status}
                        </Badge>
                      </div>

                      {patient.chronic_conditions && patient.chronic_conditions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {patient.chronic_conditions.slice(0, 2).map((c, idx) => (
                            <Badge key={idx} variant="outline" className="text-[10px] py-0">
                              {c}
                            </Badge>
                          ))}
                          {patient.chronic_conditions.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{patient.chronic_conditions.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {formatPhone(patient.phone_primary)}
                      </span>
                      <Button
                        size="iconSm"
                        variant="ghost"
                        asChild
                        className="rounded-lg h-7 w-7 text-primary hover:bg-primary/10"
                        title="Start Consultation"
                      >
                        <Link href={`/recording?patient=${patient.id}`}>
                          <Mic className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Reports (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground">Recent Clinical Reports</h2>
              <p className="text-xs text-muted-foreground">Prescriptions & care summaries</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs font-semibold text-primary">
              <Link href="/reports">
                View All
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>

          <Card className="rounded-2xl border-border/60 bg-card/80 p-2 divide-y divide-border/50">
            {reportsLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-xl" />
                ))}
              </div>
            ) : reportsData?.results?.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold text-foreground">No reports generated yet</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Run a recording session to synthesize your first smart report.
                </p>
                <Button size="sm" variant="gradient" asChild>
                  <Link href="/recording">Record Consultation</Link>
                </Button>
              </div>
            ) : (
              reportsData?.results?.slice(0, 5).map((report) => (
                <div
                  key={report.id}
                  className="p-3.5 rounded-xl hover:bg-muted/40 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        {report.report_number}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDate(report.created_at)} • {report.report_type.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="success" className="text-[10px] hidden sm:inline-flex">
                      {report.status}
                    </Badge>
                    <Button size="iconSm" variant="ghost" asChild className="rounded-lg h-8 w-8">
                      <Link href={`/reports/${report.id}`}>
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
