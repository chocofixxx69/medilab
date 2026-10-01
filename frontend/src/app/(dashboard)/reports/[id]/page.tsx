"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  useReport,
  useReportPreview,
  useDownloadReport,
  useExportHtmlReport,
  useDeleteReport,
  useUpdateReport,
} from "@/hooks/useReports";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Download,
  Printer,
  Trash2,
  FileText,
  Calendar,
  Loader2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  Edit3,
  Eye,
  Plus,
  Save,
  X,
  Stethoscope,
  Pill,
  AlertTriangle,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Copy,
  Search,
} from "lucide-react";
import { formatDateTime, cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { DEFAULT_MEDICATIONS } from "@/lib/api";
import type { Report, ReportMedication } from "@/types";

// Common High-Frequency Clinical Drug Presets for Indian OPD practice
const CLINICAL_DRUG_PRESETS: Array<{
  category: string;
  chipLabel: string;
  name: string;
  generic: string;
  hindi_name: string;
  dosage: string;
  frequency: string;
  timing: string;
  timing_hindi: string;
  duration: string;
}> = [
  {
    category: "Fever & Pain",
    chipLabel: "+ Tab. Dolo 650mg",
    name: "Tab. Dolo 650mg",
    generic: "Paracetamol 650mg",
    hindi_name: "डोलो 650 मि.ग्रा.",
    dosage: "1 Tablet (Oral)",
    frequency: "TDS [ 1 - 1 - 1 ]",
    timing: "After Meals",
    timing_hindi: "भोजन के बाद",
    duration: "5 Days (SOS for fever)",
  },
  {
    category: "Fever & Pain",
    chipLabel: "+ Tab. Combiflam",
    name: "Tab. Combiflam",
    generic: "Ibuprofen 400mg + Paracetamol 325mg",
    hindi_name: "कॉम्बिफ़्लैम टैबलेट",
    dosage: "1 Tablet (Oral)",
    frequency: "BD [ 1 - 0 - 1 ]",
    timing: "After Meals",
    timing_hindi: "भोजन के बाद",
    duration: "3 Days (SOS for pain)",
  },
  {
    category: "Antibiotics",
    chipLabel: "+ Tab. Azithromycin 500mg",
    name: "Tab. Azithromycin 500mg",
    generic: "Azithromycin 500mg",
    hindi_name: "एज़िथ्रोमाइसिन 500 मि.ग्रा.",
    dosage: "1 Tablet (Oral)",
    frequency: "OD [ 0 - 0 - 1 ]",
    timing: "1 Hr Before or 2 Hrs After Meals",
    timing_hindi: "भोजन से 1 घंटे पहले या 2 घंटे बाद",
    duration: "3 Days",
  },
  {
    category: "Antibiotics",
    chipLabel: "+ Tab. Augmentin 625 Duo",
    name: "Tab. Augmentin 625 Duo",
    generic: "Amoxicillin 500mg + Clavulanic Acid 125mg",
    hindi_name: "ऑगमेंटिन 625 डुओ",
    dosage: "1 Tablet (Oral)",
    frequency: "BD [ 1 - 0 - 1 ]",
    timing: "With Food at Start of Meals",
    timing_hindi: "भोजन के साथ",
    duration: "5 Days",
  },
  {
    category: "Antibiotics",
    chipLabel: "+ Tab. Cefixime 200mg",
    name: "Tab. Cefixime 200mg",
    generic: "Cefixime Trihydrate 200mg",
    hindi_name: "सेफ़िक्सिम 200 मि.ग्रा.",
    dosage: "1 Tablet (Oral)",
    frequency: "BD [ 1 - 0 - 1 ]",
    timing: "After Meals",
    timing_hindi: "भोजन के बाद",
    duration: "5 Days",
  },
  {
    category: "Gastro",
    chipLabel: "+ Cap. Pan 40mg",
    name: "Cap. Pan 40mg",
    generic: "Pantoprazole Gastro-resistant 40mg",
    hindi_name: "पैन 40 कैप्सूल",
    dosage: "1 Capsule (Oral)",
    frequency: "OD [ 1 - 0 - 0 ]",
    timing: "Empty Stomach in Morning",
    timing_hindi: "सुबह खाली पेट",
    duration: "5 Days",
  },
  {
    category: "Gastro",
    chipLabel: "+ ORS Electral Sachet",
    name: "ORS Electral Sachet",
    generic: "Oral Rehydration Salts IP (WHO Formula)",
    hindi_name: "इलेक्ट्रल ओ.आर.एस.",
    dosage: "1 Sachet in 1 Liter clean water",
    frequency: "Frequent Sips Throughout Day",
    timing: "Between Meals",
    timing_hindi: "दिन भर घूंट-घूंट कर पिएं",
    duration: "3 Days",
  },
  {
    category: "Respiratory",
    chipLabel: "+ Tab. Monticope",
    name: "Tab. Monticope",
    generic: "Levocetirizine 5mg + Montelukast 10mg",
    hindi_name: "मॉन्टीकोप टैबलेट",
    dosage: "1 Tablet (Oral)",
    frequency: "OD [ 0 - 0 - 1 ]",
    timing: "At Bedtime (After Food)",
    timing_hindi: "रात को भोजन के बाद",
    duration: "7 Days",
  },
  {
    category: "Respiratory",
    chipLabel: "+ Syr. Ascoril D Plus",
    name: "Syr. Ascoril D Plus",
    generic: "Dextromethorphan + Chlorpheniramine",
    hindi_name: "एस्कोरिल डी सिरप",
    dosage: "10 ml (Oral)",
    frequency: "BD [ 1 - 0 - 1 ]",
    timing: "After Food with Warm Water",
    timing_hindi: "गर्म पानी के साथ खाने के बाद",
    duration: "5 Days",
  },
  {
    category: "Chronic",
    chipLabel: "+ Tab. Telma 40mg",
    name: "Tab. Telma 40mg",
    generic: "Telmisartan 40mg",
    hindi_name: "टेल्मा 40 मि.ग्रा.",
    dosage: "1 Tablet (Oral)",
    frequency: "OD [ 1 - 0 - 0 ]",
    timing: "Morning After Breakfast",
    timing_hindi: "सुबह नाश्ते के बाद",
    duration: "30 Days (Regular)",
  },
  {
    category: "Chronic",
    chipLabel: "+ Tab. Glycomet GP 1",
    name: "Tab. Glycomet GP 1",
    generic: "Glimepiride 1mg + Metformin 500mg",
    hindi_name: "ग्लाइकोमेट जीपी 1",
    dosage: "1 Tablet (Oral)",
    frequency: "OD [ 1 - 0 - 0 ]",
    timing: "With First Bite of Breakfast",
    timing_hindi: "सुबह नाश्ते के पहले निवाले के साथ",
    duration: "30 Days (Regular)",
  },
];

const PRESET_CATEGORIES = ["All", "Fever & Pain", "Antibiotics", "Respiratory", "Gastro", "Chronic"];

const DOSAGE_PILLS = [
  "1 Tablet (Oral)",
  "2 Tablets",
  "1 Capsule (Oral)",
  "5 ml Syrup",
  "10 ml Syrup",
  "1 Sachet in 1L Water",
  "1 Puff (Inhaler)",
  "2 Drops",
];

const FREQUENCY_PILLS = [
  { label: "TDS [ 1 - 1 - 1 ]", code: "TDS [ 1 - 1 - 1 ]" },
  { label: "BD [ 1 - 0 - 1 ]", code: "BD [ 1 - 0 - 1 ]" },
  { label: "OD [ 0 - 0 - 1 ] (Night)", code: "OD [ 0 - 0 - 1 ]" },
  { label: "OD [ 1 - 0 - 0 ] (Morning)", code: "OD [ 1 - 0 - 0 ]" },
  { label: "QID [ 1 - 1 - 1 - 1 ]", code: "QID [ 1 - 1 - 1 - 1 ]" },
  { label: "SOS (As Needed)", code: "SOS" },
];

const TIMING_PILLS = [
  { label: "After Meals", hindi: "भोजन के बाद" },
  { label: "Before Meals", hindi: "भोजन से पहले" },
  { label: "Empty Stomach", hindi: "सुबह खाली पेट" },
  { label: "At Bedtime", hindi: "रात को सोने से पहले" },
  { label: "With Warm Water", hindi: "गुनगुने पानी के साथ" },
];

const DURATION_PILLS = ["3 Days", "5 Days", "7 Days", "10 Days", "14 Days", "1 Month", "SOS"];

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [presetSearch, setPresetSearch] = useState<string>("");

  const { data: report, isLoading } = useReport(reportId);
  const { data: previewHtml, isLoading: previewLoading, refetch: refetchPreview } = useReportPreview(reportId);
  const downloadMutation = useDownloadReport();
  const exportMutation = useExportHtmlReport();
  const deleteMutation = useDeleteReport();
  const updateMutation = useUpdateReport();

  const [formData, setFormData] = useState<Partial<Report>>({});

  const filteredPresets = useMemo(() => {
    return CLINICAL_DRUG_PRESETS.filter((p) => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch =
        !presetSearch.trim() ||
        p.name.toLowerCase().includes(presetSearch.toLowerCase()) ||
        p.generic.toLowerCase().includes(presetSearch.toLowerCase()) ||
        p.hindi_name.includes(presetSearch);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, presetSearch]);

  useEffect(() => {
    if (report) {
      setFormData({
        diagnosis: report.diagnosis || "Acute Upper Respiratory Tract Infection (Viral Rhinopharyngitis)",
        icd_code: report.icd_code || "ICD-10: J06.9",
        clinical_notes: report.clinical_notes || "Patient presented with a 3-day history of low-grade fever, rhinorrhea, throat tickling, and dry nagging cough. Chest examination reveals bilateral clear vesicular breath sounds with no added sounds. Pharynx mildly erythematous. Vitals stable.",
        vitals: report.vitals || "BP: 120/80 • P: 74 • SpO2: 99% • T: 98.4°F",
        medications: report.medications && report.medications.length > 0 ? report.medications : [...DEFAULT_MEDICATIONS],
        dietary_advice: report.dietary_advice || "• Consume warm soups, light khichdi, steamed greens, and ginger-tulsi decoction.\n• Ensure optimal hydration: 2.5 – 3.0 Liters of warm drinking water daily.\n• Avoid: Chilled refrigerated beverages, cold ice creams, oily/fried items, and heavy dairy at bedtime.",
        care_instructions: report.care_instructions || "• Plain water steam inhalation twice daily for 5-7 minutes.\n• Warm saline gargle 3-4 times daily.\n• Ensure 8 hours of restorative physical rest and sleep.\n• Follow-up: Review in OPD after 5 days with this prescription.",
        investigations: report.investigations || "Complete Blood Count (CBC) with Platelets & ESR • Serum Creatinine & Electrolytes (Review if symptoms do not improve within 5 days).",
        follow_up: report.follow_up || "Review in OPD after 5 days with this prescription or earlier if symptoms worsen.",
        red_flags: report.red_flags || "EMERGENCY RED FLAG SIGNS: Seek immediate medical attention at the nearest Emergency Department if you experience: body temperature > 102°F persisting despite antipyretics, shortness of breath, continuous chest heaviness/pain, or oxygen saturation (SpO2) falling below 95%.",
      });
    }
  }, [report]);

  const handleDownload = () => {
    downloadMutation.mutate(reportId);
  };

  const handleExport = () => {
    exportMutation.mutate(reportId);
  };

  const handlePrint = () => {
    // 1. Try direct printing from existing rendered iframe
    const existingIframe = document.getElementById("prescription-preview-iframe") as HTMLIFrameElement;
    if (existingIframe && existingIframe.contentWindow) {
      existingIframe.contentWindow.focus();
      existingIframe.contentWindow.print();
      return;
    }

    // 2. If in editing mode or iframe not available, use temporary hidden frame (no popup blocking)
    if (previewHtml) {
      const hiddenIframe = document.createElement("iframe");
      hiddenIframe.style.position = "fixed";
      hiddenIframe.style.right = "0";
      hiddenIframe.style.bottom = "0";
      hiddenIframe.style.width = "0";
      hiddenIframe.style.height = "0";
      hiddenIframe.style.border = "0";
      hiddenIframe.setAttribute("aria-hidden", "true");
      document.body.appendChild(hiddenIframe);

      if (hiddenIframe.contentWindow) {
        hiddenIframe.contentWindow.document.open();
        hiddenIframe.contentWindow.document.write(previewHtml);
        hiddenIframe.contentWindow.document.close();
        setTimeout(() => {
          hiddenIframe.contentWindow?.focus();
          hiddenIframe.contentWindow?.print();
          setTimeout(() => {
            if (document.body.contains(hiddenIframe)) {
              document.body.removeChild(hiddenIframe);
            }
          }, 1500);
        }, 350);
      }
    }
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(reportId);
    router.push("/reports");
  };

  // Add blank custom medication
  const handleAddMedication = () => {
    const newMed: ReportMedication = {
      id: `med-${Date.now()}`,
      name: "",
      generic: "",
      hindi_name: "",
      dosage: "1 Tablet (Oral)",
      frequency: "TDS [ 1 - 1 - 1 ]",
      timing: "After Meals",
      timing_hindi: "भोजन के बाद",
      duration: "5 Days",
    };
    setFormData((prev) => ({
      ...prev,
      medications: [...(prev.medications || []), newMed],
    }));
  };

  // Add from pre-filled clinical drug preset
  const handleAddPreset = (preset: typeof CLINICAL_DRUG_PRESETS[0]) => {
    const newMed: ReportMedication = {
      id: `med-${Date.now()}`,
      name: preset.name,
      generic: preset.generic,
      hindi_name: preset.hindi_name,
      dosage: preset.dosage,
      frequency: preset.frequency,
      timing: preset.timing,
      timing_hindi: preset.timing_hindi,
      duration: preset.duration,
    };
    setFormData((prev) => ({
      ...prev,
      medications: [...(prev.medications || []), newMed],
    }));
  };

  const handleUpdateMedication = (index: number, field: keyof ReportMedication, value: string) => {
    setFormData((prev) => {
      const list = [...(prev.medications || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, medications: list };
    });
  };

  const handleRemoveMedication = (index: number) => {
    setFormData((prev) => {
      const list = [...(prev.medications || [])];
      list.splice(index, 1);
      return { ...prev, medications: list };
    });
  };

  const handleMoveMedication = (index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const list = [...(prev.medications || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, medications: list };
    });
  };

  const handleDuplicateMedication = (index: number) => {
    setFormData((prev) => {
      const list = [...(prev.medications || [])];
      const source = list[index];
      const copy: ReportMedication = {
        ...source,
        id: `med-${Date.now()}`,
        name: `${source.name} (Copy)`,
      };
      list.splice(index + 1, 0, copy);
      return { ...prev, medications: list };
    });
  };

  const handleSaveReport = async () => {
    try {
      await updateMutation.mutateAsync({
        id: reportId,
        data: formData,
      });
      await refetchPreview();
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const reportTypeLabels: Record<string, string> = {
    full: "Full Clinical Report & Rx",
    prescription_only: "Medical Prescription (Rx)",
    diet_only: "Diet & Nutrition Plan",
    care_only: "Care Instructions",
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full rounded-3xl" />
        <Skeleton className="h-[600px] w-full rounded-3xl" />
      </div>
    );
  }

  if (!report) {
    return (
      <Card className="rounded-3xl p-12 text-center border-dashed">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
        <h2 className="text-xl font-bold text-foreground">Report document not found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-5">
          This report might have expired or been removed.
        </p>
        <Button asChild variant="gradient">
          <Link href="/reports">Back to Reports Center</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Save Success Notification */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-sm font-semibold shadow-sm animate-fade-in-up">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>
              Prescription & Clinical Report successfully updated! Your edits have been recompiled into the official preview, printable Rx, and downloadable PDF.
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSaveSuccess(false)}
            className="text-xs text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 hover:bg-emerald-500/10 rounded-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-4">
          <Button variant="outline" size="iconSm" asChild className="rounded-xl mt-1 md:mt-0">
            <Link href="/reports">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 shadow-sm">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                  {report.report_number}
                </h1>
                <Badge variant="success" className="text-xs flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 mr-0.5" />
                  Verified Clinical Document
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {reportTypeLabels[report.report_type] || report.report_type} • Generated {formatDateTime(report.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "rounded-xl h-11 font-semibold shadow-sm transition-all",
              isEditing
                ? "bg-teal-600 hover:bg-teal-700 text-white"
                : "border-border/80 hover:border-teal-500/60 hover:text-teal-600"
            )}
          >
            {isEditing ? (
              <>
                <Eye className="mr-2 h-4 w-4" />
                View Preview
              </>
            ) : (
              <>
                <Edit3 className="mr-2 h-4 w-4 text-teal-600 dark:text-teal-400" />
                Edit Report & Rx
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handlePrint}
            disabled={!previewHtml || isEditing}
            className="rounded-xl h-11 border-border/80 font-semibold shadow-sm"
          >
            <Printer className="mr-2 h-4 w-4 text-primary" />
            Print Rx
          </Button>

          <Button
            variant="outline"
            onClick={handleExport}
            disabled={!previewHtml || exportMutation.isPending || isEditing}
            className="rounded-xl h-11 border-border/80 font-semibold shadow-sm"
          >
            {exportMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileCode className="mr-2 h-4 w-4 text-teal-600" />
            )}
            Export HTML
          </Button>

          <Button
            variant="gradient"
            onClick={handleDownload}
            disabled={downloadMutation.isPending || isEditing}
            className="rounded-xl font-bold shadow-glow-teal h-11 px-5"
          >
            {downloadMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Save / Download PDF
          </Button>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl h-11 w-11 text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl">
              <DialogHeader>
                <DialogTitle>Delete Report Record?</DialogTitle>
                <DialogDescription>
                  Are you sure you want to permanently delete report {report.report_number}? This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* VIEW MODE: EDITING vs PREVIEW */}
      {isEditing ? (
        /* ========================================================================= */
        /* LIVE CLINICAL DOCUMENT EDITOR                                             */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Editor Header Bar */}
          <div className="p-5 rounded-3xl border border-teal-500/40 bg-teal-500/5 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-teal-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                  <Edit3 className="h-3 w-3" />
                  Live Clinical Report & Rx Editor
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">{report.report_number}</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                Edit diagnosis, prescribe/remove medications, adjust dosage frequency, or modify clinical guidance.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="rounded-xl"
              >
                <X className="mr-1.5 h-4 w-4" />
                Cancel
              </Button>
              <Button
                variant="gradient"
                onClick={handleSaveReport}
                disabled={updateMutation.isPending}
                className="rounded-xl font-bold shadow-glow-teal px-6"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Report...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save & Update Report
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Section 1: Clinical Assessment & Diagnosis */}
          <Card className="rounded-3xl border-border/70 p-6 md:p-8 bg-card/80 backdrop-blur-xl shadow-glass space-y-5">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Stethoscope className="h-5 w-5 text-teal-600" />
              <h2 className="text-base font-bold text-foreground">
                Clinical Assessment & Provisional Diagnosis
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Provisional Diagnosis
                </label>
                <Input
                  value={formData.diagnosis || ""}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="e.g. Acute Upper Respiratory Tract Infection (Viral Rhinopharyngitis)"
                  className="rounded-xl font-semibold h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  ICD-10 Code
                </label>
                <Input
                  value={formData.icd_code || ""}
                  onChange={(e) => setFormData({ ...formData, icd_code: e.target.value })}
                  placeholder="ICD-10: J06.9"
                  className="rounded-xl font-mono text-xs h-11"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Recorded Vitals
              </label>
              <Input
                value={formData.vitals || ""}
                onChange={(e) => setFormData({ ...formData, vitals: e.target.value })}
                placeholder="BP: 120/80 • P: 74 • SpO2: 99% • T: 98.4°F"
                className="rounded-xl h-11 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Doctor&apos;s Clinical Assessment & Physical Findings
              </label>
              <textarea
                value={formData.clinical_notes || ""}
                onChange={(e) => setFormData({ ...formData, clinical_notes: e.target.value })}
                rows={3}
                placeholder="Detailed clinical examination, throat inspection, chest auscultation, symptoms summary..."
                className="w-full p-4 rounded-2xl bg-muted/30 border border-border/70 text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
              />
            </div>
          </Card>

          {/* Section 2: Prescribed Medications (Rx Table) with Quick Clinical Presets */}
          <Card className="rounded-3xl border-border/70 p-6 md:p-8 bg-card/80 backdrop-blur-xl shadow-glass space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-teal-600" />
                <h2 className="text-base font-bold text-foreground">
                  Prescribed Medications (Rx Table)
                </h2>
                <Badge variant="outline" className="text-xs ml-1 font-mono">
                  {(formData.medications || []).length} items
                </Badge>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={handleAddMedication}
                className="rounded-xl text-xs font-bold border-teal-500/40 text-teal-700 dark:text-teal-300 hover:bg-teal-500/10"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Custom Medication
              </Button>
            </div>

            {/* Quick Clinical Presets Strip with Category Filters & Search */}
            <div className="space-y-3 p-4 rounded-2xl bg-muted/20 border border-border/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                  Quick Clinical Presets (Click to Add):
                </span>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={presetSearch}
                    onChange={(e) => setPresetSearch(e.target.value)}
                    placeholder="Search presets..."
                    className="pl-8 h-8 rounded-xl text-xs bg-background/80"
                  />
                  {presetSearch && (
                    <button
                      type="button"
                      onClick={() => setPresetSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {PRESET_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                      selectedCategory === cat
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-muted/40 text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {filteredPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPreset(preset)}
                    className="text-xs px-3 py-1.5 rounded-xl border border-border/80 bg-card hover:bg-teal-500/10 hover:border-teal-500/40 text-foreground font-medium transition-all shadow-subtle hover:scale-[1.02] active:scale-95 text-left flex items-center gap-1.5"
                  >
                    <span>{preset.chipLabel}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">({preset.frequency.split(" ")[0]})</span>
                  </button>
                ))}
                {filteredPresets.length === 0 && (
                  <p className="text-xs text-muted-foreground italic py-1">
                    No presets match &quot;{presetSearch}&quot; in {selectedCategory}. You can add a custom medicine below.
                  </p>
                )}
              </div>
            </div>

            {/* Medications List */}
            <div className="space-y-4">
              {(formData.medications || []).length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-border/80 space-y-3 bg-muted/10">
                  <Pill className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
                  <p className="text-sm font-semibold text-foreground">No medications currently added</p>
                  <p className="text-xs text-muted-foreground">
                    Click any quick clinical preset above or click below to add custom prescription items.
                  </p>
                  <Button size="sm" variant="gradient" onClick={handleAddMedication} className="rounded-xl text-xs font-bold">
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    + Add First Medication
                  </Button>
                </div>
              ) : (
                (formData.medications || []).map((med, idx) => (
                  <div
                    key={med.id || idx}
                    className="p-4 md:p-5 rounded-2xl border border-border/70 bg-card hover:border-teal-500/40 transition-all space-y-4 shadow-subtle"
                  >
                    {/* Top Bar for Card */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500/10 text-xs font-bold text-teal-700 dark:text-teal-300 font-mono">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {med.name || "Untitled Medication"}
                        </span>
                        {med.hindi_name && (
                          <Badge variant="outline" className="text-[10px] text-teal-700 dark:text-teal-300 border-teal-500/30">
                            {med.hindi_name}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={idx === 0}
                          onClick={() => handleMoveMedication(idx, "up")}
                          className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                          title="Move Up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={idx === (formData.medications || []).length - 1}
                          onClick={() => handleMoveMedication(idx, "down")}
                          className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                          title="Move Down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDuplicateMedication(idx)}
                          className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-teal-600"
                          title="Duplicate Medication"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveMedication(idx)}
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-lg ml-0.5"
                          title="Remove Medicine"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Core Inputs Grid */}
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-muted-foreground">Medicine Brand & Strength</span>
                        <Input
                          value={med.name}
                          onChange={(e) => handleUpdateMedication(idx, "name", e.target.value)}
                          placeholder="e.g. Tab. Dolo 650mg"
                          className="rounded-xl h-9 text-xs font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-muted-foreground">Generic Chemical Formula</span>
                        <Input
                          value={med.generic || ""}
                          onChange={(e) => handleUpdateMedication(idx, "generic", e.target.value)}
                          placeholder="e.g. Paracetamol 650mg"
                          className="rounded-xl h-9 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-muted-foreground">Dosage Form</span>
                        <Input
                          value={med.dosage || ""}
                          onChange={(e) => handleUpdateMedication(idx, "dosage", e.target.value)}
                          placeholder="e.g. 1 Tablet (Oral)"
                          className="rounded-xl h-9 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-muted-foreground">Frequency (Daily Dosage)</span>
                        <Input
                          value={med.frequency || ""}
                          onChange={(e) => handleUpdateMedication(idx, "frequency", e.target.value)}
                          placeholder="e.g. TDS [ 1 - 1 - 1 ]"
                          className="rounded-xl h-9 text-xs font-mono font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-muted-foreground">Timing & Food Advice</span>
                        <Input
                          value={med.timing || ""}
                          onChange={(e) => handleUpdateMedication(idx, "timing", e.target.value)}
                          placeholder="e.g. After Meals"
                          className="rounded-xl h-9 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-muted-foreground">Treatment Duration</span>
                        <Input
                          value={med.duration || ""}
                          onChange={(e) => handleUpdateMedication(idx, "duration", e.target.value)}
                          placeholder="e.g. 5 Days (SOS for fever)"
                          className="rounded-xl h-9 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    {/* Hindi Vernacular Instructions Strip */}
                    <div className="grid gap-3 sm:grid-cols-2 pt-1 border-t border-border/40">
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-300">
                          Hindi Vernacular Medicine Name
                        </span>
                        <Input
                          value={med.hindi_name || ""}
                          onChange={(e) => handleUpdateMedication(idx, "hindi_name", e.target.value)}
                          placeholder="e.g. डोलो 650 मि.ग्रा."
                          className="rounded-xl h-8 text-xs bg-muted/20"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-teal-700 dark:text-teal-300">
                          Hindi Food & Timing Advice
                        </span>
                        <Input
                          value={med.timing_hindi || ""}
                          onChange={(e) => handleUpdateMedication(idx, "timing_hindi", e.target.value)}
                          placeholder="e.g. भोजन के बाद (गुनगुने पानी के साथ)"
                          className="rounded-xl h-8 text-xs bg-muted/20"
                        />
                      </div>
                    </div>

                    {/* Quick Preset Selector Badges for this Medication Row */}
                    <div className="pt-2 border-t border-border/50 space-y-2 text-[11px]">
                      {/* Dosage pills */}
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-muted-foreground font-semibold mr-1">Dose:</span>
                        {DOSAGE_PILLS.map((d, dIdx) => (
                          <button
                            key={dIdx}
                            type="button"
                            onClick={() => handleUpdateMedication(idx, "dosage", d)}
                            className={cn(
                              "px-2 py-0.5 rounded-md text-[10px] border transition-all",
                              med.dosage === d
                                ? "bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 font-bold"
                                : "border-border/60 text-muted-foreground hover:bg-muted/40"
                            )}
                          >
                            {d.replace(" (Oral)", "")}
                          </button>
                        ))}
                      </div>

                      {/* Frequency pills */}
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-muted-foreground font-semibold mr-1">Freq:</span>
                        {FREQUENCY_PILLS.map((f, fIdx) => (
                          <button
                            key={fIdx}
                            type="button"
                            onClick={() => handleUpdateMedication(idx, "frequency", f.code)}
                            className={cn(
                              "px-2 py-0.5 rounded-md font-mono text-[10px] border transition-all",
                              med.frequency?.includes(f.code.split(" ")[0])
                                ? "bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/40 font-bold"
                                : "border-border/60 text-muted-foreground hover:bg-muted/40"
                            )}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>

                      {/* Timing pills */}
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-muted-foreground font-semibold mr-1">Timing:</span>
                        {TIMING_PILLS.map((t, tIdx) => (
                          <button
                            key={tIdx}
                            type="button"
                            onClick={() => {
                              handleUpdateMedication(idx, "timing", t.label);
                              handleUpdateMedication(idx, "timing_hindi", t.hindi);
                            }}
                            className={cn(
                              "px-2 py-0.5 rounded-md text-[10px] border transition-all",
                              med.timing === t.label
                                ? "bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/40 font-bold"
                                : "border-border/60 text-muted-foreground hover:bg-muted/40"
                            )}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {/* Duration pills */}
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-muted-foreground font-semibold mr-1">Duration:</span>
                        {DURATION_PILLS.map((d, dIdx) => (
                          <button
                            key={dIdx}
                            type="button"
                            onClick={() => handleUpdateMedication(idx, "duration", d)}
                            className={cn(
                              "px-2 py-0.5 rounded-md text-[10px] border transition-all",
                              med.duration?.startsWith(d)
                                ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-bold"
                                : "border-border/60 text-muted-foreground hover:bg-muted/40"
                            )}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Button
              variant="outline"
              onClick={handleAddMedication}
              className="w-full rounded-2xl border-dashed border-border/80 text-xs font-semibold py-5"
            >
              <Plus className="mr-2 h-4 w-4 text-teal-600" />
              + Add Custom Prescribed Medicine
            </Button>
          </Card>

          {/* Section 3: Investigations & Clinical Guidance */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-3xl border-border/70 p-6 bg-card/80 backdrop-blur-xl shadow-glass space-y-3">
              <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                <FileText className="h-4 w-4 text-teal-600" />
                <h3 className="text-sm font-bold text-foreground">Advised Investigations & Lab Tests</h3>
              </div>
              <textarea
                value={formData.investigations || ""}
                onChange={(e) => setFormData({ ...formData, investigations: e.target.value })}
                rows={3}
                placeholder="Complete Blood Count (CBC), ESR, Serum Creatinine, Chest X-Ray..."
                className="w-full p-3.5 rounded-2xl bg-muted/30 border border-border/70 text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
              />
            </Card>

            <Card className="rounded-3xl border-border/70 p-6 bg-card/80 backdrop-blur-xl shadow-glass space-y-3">
              <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                <Calendar className="h-4 w-4 text-teal-600" />
                <h3 className="text-sm font-bold text-foreground">Follow-Up Advice</h3>
              </div>
              <textarea
                value={formData.follow_up || ""}
                onChange={(e) => setFormData({ ...formData, follow_up: e.target.value })}
                rows={3}
                placeholder="Review in OPD after 5 days with this prescription or earlier if symptoms persist..."
                className="w-full p-3.5 rounded-2xl bg-muted/30 border border-border/70 text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
              />
            </Card>
          </div>

          {/* Section 4: Dietary Protocol & Patient Care Instructions */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-3xl border-border/70 p-6 bg-card/80 backdrop-blur-xl shadow-glass space-y-3">
              <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-foreground">Dietary Protocol & Nutrition Advice</h3>
              </div>
              <textarea
                value={formData.dietary_advice || ""}
                onChange={(e) => setFormData({ ...formData, dietary_advice: e.target.value })}
                rows={4}
                placeholder="Adequate warm fluid intake, warm soups, light meals, foods to avoid..."
                className="w-full p-3.5 rounded-2xl bg-muted/30 border border-border/70 text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
              />
            </Card>

            <Card className="rounded-3xl border-border/70 p-6 bg-card/80 backdrop-blur-xl shadow-glass space-y-3">
              <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-foreground">Patient Care & Lifestyle Instructions</h3>
              </div>
              <textarea
                value={formData.care_instructions || ""}
                onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value })}
                rows={4}
                placeholder="Steam inhalation twice daily, warm saline gargles, adequate rest..."
                className="w-full p-3.5 rounded-2xl bg-muted/30 border border-border/70 text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
              />
            </Card>
          </div>

          {/* Section 5: Red Flag Warning */}
          <Card className="rounded-3xl border-rose-500/30 p-6 bg-rose-500/5 backdrop-blur-xl shadow-glass space-y-3">
            <div className="flex items-center gap-2 border-b border-rose-500/20 pb-2 text-rose-700 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <h3 className="text-sm font-bold">Emergency Red Flag Signs (ER Warning)</h3>
            </div>
            <textarea
              value={formData.red_flags || ""}
              onChange={(e) => setFormData({ ...formData, red_flags: e.target.value })}
              rows={2}
              placeholder="Difficulty breathing (SpO2 < 94%), persistent high fever (>102°F), chest pain..."
              className="w-full p-3.5 rounded-2xl bg-background/80 border border-rose-500/30 text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/40 transition-all"
            />
          </Card>

          {/* Bottom Action Footer */}
          <div className="p-6 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-muted-foreground">
              Saving updates will recompile the clinical letterhead, QR authentication, and printable PDF.
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                variant="gradient"
                onClick={handleSaveReport}
                disabled={updateMutation.isPending}
                className="rounded-xl font-bold shadow-glow-teal px-8"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save & Update Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* OFFICIAL CLINICAL PREVIEW (INTERACTIVE)                                    */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Report Info Tiles */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-2xl p-5 border-border/70 bg-card/80">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Timestamp</p>
                  <p className="text-sm font-semibold text-foreground">{formatDateTime(report.created_at)}</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl p-5 border-border/70 bg-card/80">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-teal-500" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Report Format</p>
                  <p className="text-sm font-semibold text-foreground">{reportTypeLabels[report.report_type]}</p>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl p-5 border-border/70 bg-card/80">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Legal Validation</p>
                  <p className="text-sm font-semibold text-foreground">Signed & QR Encrypted</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Document Preview Frame */}
          <Card className="rounded-3xl border border-border/70 overflow-hidden shadow-glass bg-card/90">
            <div className="flex flex-wrap items-center justify-between p-4 border-b border-border/60 bg-muted/30 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Official Clinical Preview (Interactive)
                </span>
                <Badge variant="outline" className="text-[10px] text-teal-600 border-teal-500/30 font-semibold">
                  Interactive Frame
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="rounded-xl text-xs font-semibold border-border/80 shadow-sm"
                >
                  <Printer className="mr-1.5 h-3.5 w-3.5 text-primary" />
                  Print Rx
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={downloadMutation.isPending}
                  className="rounded-xl text-xs font-semibold border-border/80 shadow-sm"
                >
                  {downloadMutation.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="mr-1.5 h-3.5 w-3.5 text-teal-600" />
                  )}
                  Save / PDF
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                >
                  <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                  Edit Prescription & Report
                </Button>

                {report.preview_url && (
                  <Button variant="ghost" size="sm" asChild className="rounded-xl text-xs">
                    <a href={report.preview_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                      Open Window
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <CardContent className="p-0">
              {previewLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-xs text-muted-foreground font-semibold">Loading document preview...</p>
                </div>
              ) : previewHtml ? (
                <div className="bg-white">
                  <iframe
                    id="prescription-preview-iframe"
                    srcDoc={previewHtml}
                    className="w-full min-h-[920px] border-0"
                    title="Prescription Document Preview"
                  />
                </div>
              ) : (
                <div className="p-16 text-center space-y-4">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
                  <div>
                    <p className="font-bold text-foreground">Preview Frame Ready</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You can download the full PDF format directly.
                    </p>
                  </div>
                  <Button onClick={handleDownload} disabled={downloadMutation.isPending} variant="gradient" className="rounded-xl font-bold">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
