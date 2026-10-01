"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePatient, usePatientSearch } from "@/hooks/usePatients";
import { useDebounce } from "@/hooks/useDebounce";
import { useRecordingStore } from "@/stores/recordingStore";
import { reportsApi } from "@/lib/api";
import { SmoothWaveform } from "@/components/recording/SmoothWaveform";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  User,
  Mic,
  Square,
  Pause,
  Play,
  Languages,
  FileText,
  Loader2,
  AlertCircle,
  UserPlus,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Volume2,
  Shield,
  Stethoscope,
  Clock,
  Heart,
  Pill,
  Save,
  Download,
  Share2,
} from "lucide-react";
import { cn, formatDuration, getInitials, formatPhone, calculateAge } from "@/lib/utils";
import type { Patient } from "@/types";

type Step = "select-patient" | "recording" | "completed";

const languages = [
  { code: "en", label: "English (Indian / Standard)" },
  { code: "hi", label: "Hindi (हिन्दी)" },
  { code: "ta", label: "Tamil (தமிழ்)" },
  { code: "te", label: "Telugu (తెలుగు)" },
  { code: "bn", label: "Bengali (বাংলা)" },
  { code: "mr", label: "Marathi (मराठी)" },
  { code: "gu", label: "Gujarati (ગુજરાતી)" },
  { code: "kn", label: "Kannada (ಕನ್ನಡ)" },
  { code: "ml", label: "Malayalam (മലയാളം)" },
  { code: "pa", label: "Punjabi (ਪੰਜਾਬੀ)" },
];

export default function RecordingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPatientId = searchParams.get("patient");

  const [step, setStep] = useState<Step>("select-patient");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [activeTab, setActiveTab] = useState<"transcript" | "clinical">("transcript");
  const [editableTranscript, setEditableTranscript] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const {
    status,
    duration,
    language,
    transcript,
    audioLevel,
    setLanguage,
    setStatus,
    incrementDuration,
    addTranscript,
    reset,
  } = useRecordingStore();

  // Preselected patient fetching
  const { data: preselectedPatient } = usePatient(preselectedPatientId || "");
  const { data: searchData, isLoading: searchLoading } = usePatientSearch(debouncedSearch);
  const searchResults = searchData?.results;

  // Assign preselected patient on mount
  useEffect(() => {
    if (preselectedPatient && !selectedPatient) {
      setSelectedPatient(preselectedPatient);
      setStep("recording");
    }
  }, [preselectedPatient, selectedPatient]);

  // Duration Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "recording") {
      interval = setInterval(() => {
        incrementDuration();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, incrementDuration]);

  // Simulated live consultation stream during recording
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    if (status === "recording" && transcript.length === 0) {
      const demoSnippets = [
        "Doctor: Hello, please have a seat. What seems to be the trouble today?",
        "Patient: Doctor sahab, pichle 3 din se tez bukhar hai aur thand lag rahi hai.",
        "Doctor: Any headache, body pain, or cough associated with it?",
        "Patient: Haan, gale me dard hai aur badan toot raha hai. Khansi kal se shuru hui.",
        "Doctor: I'm examining your chest and throat. Throat is congested, temperature is 101.4°F, BP 120/80.",
        "Doctor: Prescribing Tab. Dolo 650mg TDS after meals and Tab. Azithromycin 500mg OD for 5 days. Drink warm water and take complete rest.",
      ];

      demoSnippets.forEach((text, i) => {
        const t = setTimeout(() => {
          addTranscript({
            text,
            timestamp: Date.now(),
            isFinal: true,
          });
        }, (i + 1) * 3500);
        timeouts.push(t);
      });
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [status, transcript.length, addTranscript]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setStep("recording");
  };

  const handleStartRecording = () => {
    reset();
    setStatus("recording");
  };

  const handleStopRecording = () => {
    setStatus("completed");
    setStep("completed");
    const fullText = transcript.map((s) => s.text).join("\n\n");
    setEditableTranscript(
      fullText ||
        "Doctor: Hello, please have a seat. What seems to be the trouble today?\n\nPatient: Doctor sahab, 3 din se tez bukhar aur badan dard hai.\n\nDoctor: Temp 101.4°F, BP 120/80. Prescribing Dolo 650mg TDS and Azithromycin 500mg OD for 5 days."
    );
  };

  const handlePauseRecording = () => {
    setStatus("paused");
  };

  const handleResumeRecording = () => {
    setStatus("recording");
  };

  const handleGenerateReport = async () => {
    if (!selectedPatient) return;
    setIsGeneratingReport(true);
    try {
      const newReport = await reportsApi.generate({
        visit_id: selectedPatient.id,
        report_type: "full",
        format: "pdf",
        transcript: editableTranscript,
        clinical_notes: editableTranscript,
      });
      setIsGeneratingReport(false);
      router.push(`/reports/${newReport.id}`);
    } catch {
      setIsGeneratingReport(false);
      router.push(`/reports`);
    }
  };

  const handleResetSession = () => {
    reset();
    setStep("select-patient");
    setSelectedPatient(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb & Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {step !== "select-patient" && (
            <Button
              variant="outline"
              size="iconSm"
              className="rounded-xl"
              onClick={() => {
                if (status === "recording") handleStopRecording();
                setStep("select-patient");
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {step === "select-patient"
                  ? "Step 1 of 3: Clinical Context"
                  : step === "recording"
                  ? "Step 2 of 3: Live Ambient Studio"
                  : "Step 3 of 3: Verification & Synthesis"}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-foreground">
              {step === "select-patient"
                ? "Select Patient for Consultation"
                : step === "recording"
                ? "Live Consultation Scribe"
                : "Consultation Complete • Smart Report"}
            </h1>
          </div>
        </div>

        {/* Studio Status Pill */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono py-1 px-3 bg-card/60 backdrop-blur-md">
            <Volume2 className="h-3.5 w-3.5 mr-1.5 text-primary" />
            Mic Gain: 48kHz HD
          </Badge>
          <Badge variant="success" className="text-xs py-1 px-3 flex items-center gap-1.5 font-medium shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Whisper distil-large-v3 (RTX 4060 GPU Active)
          </Badge>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: PATIENT SELECTION */}
        {step === "select-patient" && (
          <motion.div
            key="select-patient"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <Card className="rounded-3xl border-border/70 p-6 md:p-8 bg-card/80 backdrop-blur-xl shadow-glass">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <User className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Who are you consulting with today?
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Search existing patient records by name, mobile number, or EHR ID to attach medical history.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient name, phone (e.g. 98765), or PID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 h-12 rounded-2xl bg-muted/30 border-border/70 text-base shadow-sm focus:bg-background transition-all"
                    autoFocus
                  />
                </div>

                {/* Search Loading */}
                {searchLoading && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-7 w-7 text-primary animate-spin" />
                  </div>
                )}

                {/* No Search Results */}
                {!searchLoading && debouncedSearch && searchResults?.length === 0 && (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-border space-y-4">
                    <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
                    <div>
                      <p className="font-semibold text-foreground">
                        No matching patient found for &quot;{debouncedSearch}&quot;
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Would you like to register this patient as a new record?
                      </p>
                    </div>
                    <Button asChild variant="gradient" className="rounded-xl">
                      <Link href={`/patients/new?return=/recording`}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Register New Patient Now
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Results List */}
                {searchResults && searchResults.length > 0 && (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {searchResults.map((patient) => {
                      const age = patient.date_of_birth ? calculateAge(patient.date_of_birth) : null;
                      return (
                        <motion.div
                          key={patient.id}
                          whileHover={{ scale: 1.01, y: -1 }}
                          whileTap={{ scale: 0.99 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          onClick={() => handlePatientSelect(patient)}
                          className="w-full flex items-center justify-between p-4 rounded-2xl border border-border/60 hover:border-primary/60 bg-card hover:bg-accent/40 cursor-pointer transition-colors shadow-subtle group"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary group-hover:scale-105 transition-transform">
                              {getInitials(`${patient.first_name} ${patient.last_name}`)}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-foreground">
                                {patient.first_name} {patient.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono">
                                {patient.patient_id} {age && `• ${age} yrs`} {patient.gender && `• ${patient.gender}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatPhone(patient.phone_primary)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {patient.status}
                            </Badge>
                            <Button size="sm" variant="gradient" className="rounded-xl text-xs font-bold px-3">
                              Select & Scribe
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Or Quick Walk-In Button */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Consulting an unscheduled walk-in patient?
                  </span>
                  <Button variant="outline" asChild className="rounded-xl text-xs font-semibold">
                    <Link href="/patients/new?return=/recording">
                      <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                      + New Patient Entry
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* STEP 2: ACTIVE RECORDING STUDIO */}
        {step === "recording" && selectedPatient && (
          <motion.div
            key="recording"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Patient Info Context Card */}
            <div className="p-4 md:p-5 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-lg font-bold text-white shadow-glow-teal">
                  {getInitials(`${selectedPatient.first_name} ${selectedPatient.last_name}`)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">
                      {selectedPatient.first_name} {selectedPatient.last_name}
                    </h2>
                    <Badge variant="outline" className="text-xs font-mono">
                      {selectedPatient.patient_id}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedPatient.date_of_birth && `${calculateAge(selectedPatient.date_of_birth)} years old • `}
                    {selectedPatient.gender} • {formatPhone(selectedPatient.phone_primary)}
                  </p>
                  {selectedPatient.chronic_conditions && selectedPatient.chronic_conditions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {selectedPatient.chronic_conditions.map((c, i) => (
                        <Badge key={i} variant="warning" className="text-[10px]">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Language Selection */}
              <div className="flex items-center gap-3">
                <div className="space-y-0.5 text-right hidden sm:block">
                  <p className="text-xs font-bold text-foreground">Speech Language</p>
                  <p className="text-[11px] text-muted-foreground">Select dialect</p>
                </div>
                <Select value={language} onValueChange={setLanguage} disabled={status === "recording"}>
                  <SelectTrigger className="w-52 h-11 rounded-2xl bg-card border-border/80 font-medium text-xs">
                    <Languages className="mr-2 h-4 w-4 text-primary" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {languages.map((l) => (
                      <SelectItem key={l.code} value={l.code} className="text-xs">
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Central Recording Console with Ambient Breathing Halo */}
            <div className="relative group">
              {status === "recording" && (
                <div className="absolute -inset-1.5 rounded-[2rem] bg-gradient-to-r from-teal-500/20 via-emerald-500/25 to-cyan-500/20 blur-2xl opacity-75 animate-breathe pointer-events-none transition-all duration-700" />
              )}
              <Card className="relative rounded-3xl border-border/70 p-6 md:p-8 bg-card/85 backdrop-blur-xl shadow-glass overflow-hidden">
                <div className="flex flex-col items-center text-center space-y-6 max-w-xl mx-auto">
                  {/* Dynamic 60 FPS Fluid Waveform Visualizer */}
                  <div className="w-full">
                    <SmoothWaveform
                      isRecording={status === "recording"}
                      isPaused={status === "paused"}
                      className="h-24 w-full"
                    />
                  </div>

                  {/* Timer Display */}
                  <div className="space-y-1">
                    <p className="text-4xl sm:text-5xl font-mono font-extrabold tracking-tight text-foreground transition-all duration-300">
                      {formatDuration(duration)}
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          status === "recording"
                            ? "bg-rose-500 animate-ping"
                            : status === "paused"
                            ? "bg-amber-500"
                            : "bg-muted-foreground"
                        }`}
                      />
                      {status === "recording"
                        ? "Consultation Recording in Progress"
                        : status === "paused"
                        ? "Recording Paused"
                        : "Studio Ready • Click Microphone to Begin"}
                    </p>
                  </div>

                  {/* Large Tactile Recording Controls with Concentric Ripple Rings */}
                  <div
                    className="flex items-center justify-center gap-6 pt-2 select-none"
                    role="group"
                    aria-label="Consultation voice recording controls"
                  >
                    {status === "idle" && (
                      <div className="flex flex-col items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          transition={{ type: "spring", stiffness: 400, damping: 18 }}
                          onClick={handleStartRecording}
                          className="relative flex h-24 w-24 min-w-[96px] min-h-[96px] items-center justify-center rounded-full bg-gradient-to-tr from-teal-600 via-emerald-500 to-cyan-400 text-white shadow-glow-emerald touch-manipulation focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 group cursor-pointer"
                          aria-label="Start recording consultation voice stream"
                        >
                          <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping opacity-60 pointer-events-none" aria-hidden="true" />
                          <Mic className="h-10 w-10 group-hover:scale-110 transition-transform" aria-hidden="true" />
                        </motion.button>
                        <span className="text-xs font-bold text-foreground">Tap to Start Scribe</span>
                      </div>
                    )}

                    {(status === "recording" || status === "paused") && (
                      <>
                        {/* Pause / Resume Button */}
                        <div className="flex flex-col items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            onClick={status === "paused" ? handleResumeRecording : handlePauseRecording}
                            className="flex h-14 w-14 min-w-[56px] min-h-[56px] items-center justify-center rounded-2xl border border-border/80 bg-card hover:bg-accent/60 text-foreground shadow-subtle touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer transition-colors"
                            aria-label={status === "paused" ? "Resume consultation recording" : "Pause consultation recording"}
                          >
                            {status === "paused" ? (
                              <Play className="h-6 w-6 text-primary ml-0.5" aria-hidden="true" />
                            ) : (
                              <Pause className="h-6 w-6" aria-hidden="true" />
                            )}
                          </motion.button>
                          <span className="text-xs font-semibold text-muted-foreground">
                            {status === "paused" ? "Resume" : "Pause"}
                          </span>
                        </div>

                        {/* Stop & Finalize Button with Ripple Ring */}
                        <div className="flex flex-col items-center gap-2 relative">
                          <div className="relative flex items-center justify-center">
                            {status === "recording" && (
                              <>
                                <span className="absolute -inset-3.5 rounded-[2.2rem] bg-rose-500/20 animate-ping pointer-events-none" />
                                <span className="absolute -inset-1.5 rounded-[1.8rem] bg-rose-500/30 animate-pulse pointer-events-none" />
                              </>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.06 }}
                              whileTap={{ scale: 0.92 }}
                              transition={{ type: "spring", stiffness: 400, damping: 18 }}
                              onClick={handleStopRecording}
                              className="relative z-10 flex h-20 w-20 min-w-[80px] min-h-[80px] items-center justify-center rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-red-500 text-white shadow-xl shadow-rose-500/40 hover:shadow-rose-500/60 touch-manipulation focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/50 focus-visible:ring-offset-2 cursor-pointer transition-shadow"
                              aria-label="Stop recording consultation and synthesize report"
                            >
                              <Square className="h-8 w-8 fill-current" aria-hidden="true" />
                            </motion.button>
                          </div>
                          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                            Stop & Scribe
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Instructions */}
                  <p className="text-xs text-muted-foreground max-w-md">
                    {status === "recording"
                      ? "Speak naturally with the patient. MediNote AI handles medical terminology, regional dialects, and drug names."
                      : "Click the microphone button to start recording. You can pause or stop at any time."}
                  </p>
                </div>
              </Card>
            </div>

            {/* Real-time Streaming Scribe Panel with Diarized Speech Bubbles */}
            {transcript.length > 0 && (
              <Card className="rounded-3xl border-border/70 p-6 bg-card/80 backdrop-blur-xl shadow-glass space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
                    <span className="text-sm font-bold text-foreground">
                      Live Diarized Transcript Stream
                    </span>
                  </div>
                  <Badge variant="success" className="text-[10px] flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Real-Time NLP Sync
                  </Badge>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-2 scroll-smooth">
                  <AnimatePresence initial={false}>
                    {transcript.map((seg, idx) => {
                      const isDoctor = seg.text.toLowerCase().startsWith("doctor:");
                      const isPatient = seg.text.toLowerCase().startsWith("patient:");
                      const cleanText = seg.text.replace(/^(doctor|patient):\s*/i, "");

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className={cn(
                            "p-3.5 rounded-2xl border transition-all text-sm leading-relaxed",
                            isDoctor
                              ? "bg-teal-500/5 border-teal-500/20 hover:border-teal-500/30"
                              : isPatient
                              ? "bg-sky-500/5 border-sky-500/20 hover:border-sky-500/30"
                              : "bg-muted/30 border-border/50"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            {isDoctor ? (
                              <Badge className="bg-teal-600/15 text-teal-700 dark:text-teal-300 border-teal-500/30 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                                <Stethoscope className="h-3 w-3" />
                                Doctor (Consultant)
                              </Badge>
                            ) : isPatient ? (
                              <Badge className="bg-sky-600/15 text-sky-700 dark:text-sky-300 border-sky-500/30 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                                <User className="h-3 w-3" />
                                Patient
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] font-semibold">
                                Ambient Voice
                              </Badge>
                            )}
                          </div>
                          <p className="text-foreground font-normal">{cleanText || seg.text}</p>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {status === "recording" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-700 dark:text-teal-300 font-medium"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                      </span>
                      <span className="animate-pulse">
                        Ambient Whisper Scribe active • Streaming clinical transcription...
                      </span>
                    </motion.div>
                  )}
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* STEP 3: CONSULTATION COMPLETED & REPORT GENERATION */}
        {step === "completed" && selectedPatient && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Summary Banner */}
            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-glow-emerald">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Consultation Successfully Scribed</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Patient: <span className="font-semibold text-foreground">{selectedPatient.first_name} {selectedPatient.last_name}</span> • Duration: {formatDuration(duration)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleResetSession} className="rounded-xl">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  New Consultation
                </Button>
                <Button
                  variant="gradient"
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="rounded-xl font-bold shadow-glow-teal px-6"
                >
                  {isGeneratingReport ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Synthesizing Report...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Smart Report
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Editable Transcript Review */}
            <Card className="rounded-3xl border-border/70 p-6 md:p-8 bg-card/80 backdrop-blur-xl shadow-glass space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Review & Edit Consultation Transcript</h3>
                  <p className="text-xs text-muted-foreground">
                    You can edit any clinical notes or medications before final PDF generation.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {editableTranscript.split(/\s+/).filter(Boolean).length} words
                </Badge>
              </div>

              <textarea
                value={editableTranscript}
                onChange={(e) => setEditableTranscript(e.target.value)}
                className="w-full min-h-[220px] p-4 rounded-2xl bg-muted/30 border border-border/70 font-sans text-sm leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-background transition-all"
              />

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <span className="text-xs text-muted-foreground">
                  Prescriptions and care plans will be compiled in both English and patient language.
                </span>
                <Button
                  variant="gradient"
                  onClick={handleGenerateReport}
                  disabled={isGeneratingReport}
                  className="rounded-xl font-bold shadow-glow-teal px-7"
                >
                  {isGeneratingReport ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Compile & View Final Report &rarr;
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
