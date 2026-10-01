"use client";

import { useState } from "react";
import Link from "next/link";
import { useReports, useDownloadReport } from "@/hooks/useReports";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Filter,
  Loader2,
  Mic,
  CheckCircle2,
  Sparkles,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Report } from "@/types";

interface ReportCardProps {
  report: Report;
  onDownload: (id: string) => void;
  isDownloading: boolean;
}

function ReportCard({ report, onDownload, isDownloading }: ReportCardProps) {
  const reportTypeLabels: Record<string, string> = {
    full: "Full Clinical Report & Rx",
    prescription_only: "Medical Prescription (Rx)",
    diet_only: "Diet & Nutrition Plan",
    care_only: "Care & Lifestyle Guide",
  };

  const statusVariants: Record<string, "default" | "secondary" | "success"> = {
    generated: "default",
    downloaded: "success",
    shared: "secondary",
  };

  return (
    <Card className="rounded-3xl border border-border/70 hover:border-primary/50 bg-card/80 backdrop-blur-md p-6 hover:shadow-card-hover transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 group-hover:scale-105 transition-transform">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base text-foreground truncate">
                {report.report_number}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {reportTypeLabels[report.report_type] || report.report_type}
              </p>
            </div>
          </div>

          <Badge variant={statusVariants[report.status] || "default"} className="text-[10px]">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {report.status}
          </Badge>
        </div>

        <div className="mt-4 pt-3 border-t border-border/50 space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Generated: {formatDateTime(report.created_at)}</span>
          </div>
          {report.expires_at && (
            <p className="text-[11px] text-muted-foreground">
              Valid until: {formatDate(report.expires_at)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-border/50">
        <Button variant="ghost" size="sm" asChild className="rounded-xl text-xs font-semibold h-9 px-3">
          <Link href={`/reports/${report.id}`}>
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            View Summary
          </Link>
        </Button>

        <Button
          variant="gradient"
          size="sm"
          onClick={() => onDownload(report.id)}
          disabled={isDownloading}
          className="rounded-xl text-xs font-bold shadow-glow-teal h-9 px-3.5"
        >
          {isDownloading ? (
            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="mr-1.5 h-3.5 w-3.5" />
          )}
          Download PDF
        </Button>
      </div>
    </Card>
  );
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");

  const { data, isLoading } = useReports({ limit: 50 });
  const downloadMutation = useDownloadReport();

  const filteredReports =
    reportType === "all"
      ? data?.results
      : data?.results?.filter((r) => r.report_type === reportType);

  const handleDownload = (reportId: string) => {
    downloadMutation.mutate(reportId);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card/80 border border-border/70 backdrop-blur-xl shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Clinical Documents
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Reports & Prescriptions
          </h1>
          <p className="text-sm text-muted-foreground">
            Access verified medical prescriptions, diet regimes, and signed care plans
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="gradient" asChild className="rounded-xl font-bold shadow-glow-teal px-5">
            <Link href="/recording">
              <Mic className="mr-2 h-4 w-4" />
              New Consultation
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-56 h-11 rounded-2xl bg-card border-border/70 text-xs font-semibold">
              <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Document Types</SelectItem>
              <SelectItem value="full">Full Clinical Summary</SelectItem>
              <SelectItem value="prescription_only">Prescriptions (Rx)</SelectItem>
              <SelectItem value="diet_only">Diet & Nutrition</SelectItem>
              <SelectItem value="care_only">Care Instructions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!isLoading && (
          <span className="text-xs font-semibold text-muted-foreground">
            {filteredReports?.length || 0} reports available
          </span>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-3xl" />
          ))}
        </div>
      ) : filteredReports?.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center border-dashed">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold text-foreground">No reports found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-5">
            {reportType !== "all"
              ? "No reports match the selected category filter."
              : "Generate smart clinical reports automatically through an ambient consultation recording."}
          </p>
          <Button asChild variant="gradient" className="rounded-xl">
            <Link href="/recording">
              <Mic className="mr-2 h-4 w-4" />
              Record Consultation
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports?.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onDownload={handleDownload}
              isDownloading={
                downloadMutation.isPending &&
                downloadMutation.variables === report.id
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
