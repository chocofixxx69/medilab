"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/Logo";
import {
  Mic,
  FileText,
  Shield,
  Stethoscope,
  Languages,
  Clock,
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  CheckCircle2,
  ChevronRight,
  Share2,
  Lock,
  HeartPulse,
  Pill,
  Activity,
  Layers,
  Award,
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"demo" | "features">("demo");
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // Simulated live demo script
  const demoDialogue = [
    {
      speaker: "Doctor",
      text: "Namaste Mr. Verma, how are you feeling today? What brings you in?",
      lang: "Hindi / English",
    },
    {
      speaker: "Patient",
      text: "Doctor sahab, 3 din se tez bukhar hai aur badan dard bohot zyada hai. Khansi bhi shuru hui hai.",
      lang: "Hindi",
    },
    {
      speaker: "Doctor",
      text: "I see. Let me check your temperature and chest. Temperature is 101.4°F, BP 130/85. Have you taken any medicine?",
      lang: "English",
    },
    {
      speaker: "Patient",
      text: "Bas ek paracetamol li thi kal raat ko, par aaram nahi mila.",
      lang: "Hindi",
    },
    {
      speaker: "Doctor",
      text: "I am prescribing Dolo 650mg thrice daily after meals for 3 days, with Azithromycin 500mg once daily for 5 days. Drink plenty of warm water, take light khichdi, and avoid cold drinks.",
      lang: "English",
    },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayingDemo) {
      timer = setInterval(() => {
        setDemoStep((prev) => {
          if (prev >= demoDialogue.length - 1) {
            setIsPlayingDemo(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isPlayingDemo, demoDialogue.length]);

  const handleStartDemo = () => {
    setDemoStep(0);
    setIsPlayingDemo(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-[600px] -left-48 w-[600px] h-[600px] bg-teal-500/5 blur-3xl rounded-full" />
        <div className="absolute top-[800px] -right-48 w-[600px] h-[600px] bg-cyan-500/5 blur-3xl rounded-full" />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
          <Logo size="md" href="/" subtitle="Ambient Clinical Scribe" />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">
              Capabilities
            </a>
            <a href="#demo" className="hover:text-primary transition-colors">
              Interactive Scribe
            </a>
            <a href="#languages" className="hover:text-primary transition-colors">
              10+ Languages
            </a>
            <a href="#security" className="hover:text-primary transition-colors">
              HIPAA Security
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="font-semibold text-sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              variant="gradient"
              asChild
              className="font-bold text-sm shadow-glow-teal px-5"
            >
              <Link href="/dashboard">
                Launch Studio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          {/* Top Tag Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs md:text-sm font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm animate-pulse-subtle">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>AI Ambient Clinical Intelligence for Modern Doctors</span>
            <span className="hidden sm:inline-block text-emerald-500/60">•</span>
            <span className="hidden sm:inline-block font-normal">No manual typing needed</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Turn Consultations Into{" "}
            <span className="text-gradient-medical">Smart Prescriptions</span>{" "}
            in 30 Seconds.
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            MediNote AI automatically listens to bilingual doctor-patient dialogues in{" "}
            <span className="font-semibold text-foreground">10+ Indian languages</span>, extracts clinical symptoms, diagnoses, and vitals, and generates structured prescriptions, diet plans, and care notes ready for signature.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button size="xl" variant="gradient" asChild className="shadow-glow-emerald">
              <Link href="/dashboard">
                <Mic className="mr-2 h-5 w-5" />
                Launch Clinical Scribe
              </Link>
            </Button>
            <Button size="xl" variant="outline" onClick={handleStartDemo} className="border-border/80 bg-card/60">
              <Play className="mr-2 h-5 w-5 text-primary" />
              Simulate Live Scribe
            </Button>
          </div>

          {/* Trust Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 max-w-4xl mx-auto text-left">
            <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-4 shadow-subtle">
              <p className="text-3xl font-extrabold text-foreground">70%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Documentation time saved per patient</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-4 shadow-subtle">
              <p className="text-3xl font-extrabold text-foreground">10+</p>
              <p className="text-xs text-muted-foreground mt-0.5">Indic dialects & bilingual mixes supported</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-4 shadow-subtle">
              <p className="text-3xl font-extrabold text-foreground">99.4%</p>
              <p className="text-xs text-muted-foreground mt-0.5">Medical vocabulary & dosage accuracy</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-4 shadow-subtle">
              <p className="text-3xl font-extrabold text-foreground">&lt; 30s</p>
              <p className="text-xs text-muted-foreground mt-0.5">Instant PDF & care plan generation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Demo Simulator Section */}
      <section id="demo" className="py-16 px-6 max-w-6xl mx-auto">
        <div className="rounded-3xl border border-border/70 bg-card/80 backdrop-blur-2xl shadow-glass p-6 md:p-10 relative overflow-hidden">
          {/* Top header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-border/60 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Live Ambient Consultation Simulator
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mt-1 text-foreground">
                Witness Real-Time AI Speech to Structured Rx
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={isPlayingDemo ? "destructive" : "gradient"}
                onClick={() => setIsPlayingDemo(!isPlayingDemo)}
                className="rounded-xl font-bold"
              >
                {isPlayingDemo ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause Audio
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    {demoStep === 0 ? "Play Simulated Audio" : "Resume Audio"}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleStartDemo} className="rounded-xl">
                Reset
              </Button>
            </div>
          </div>

          {/* Interactive Split Scribe Interface */}
          <div className="grid md:grid-cols-2 gap-8 pt-8">
            {/* Left: Audio Stream & Live Diarized Dialogue */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Mic className="h-4 w-4 text-primary" />
                  <span>Ambient Audio Stream (Diarized)</span>
                </div>
                <Badge variant="outline" className="text-[11px] font-mono">
                  {isPlayingDemo ? "RECORDING: 00:28" : "IDLE / READY"}
                </Badge>
              </div>

              {/* Pulsing visualizer bar */}
              <div className="h-10 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-center gap-1.5 px-4 overflow-hidden">
                {[...Array(28)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-primary/70 rounded-full transition-all duration-150"
                    style={{
                      height: isPlayingDemo
                        ? `${Math.max(6, Math.sin(i * 0.5 + demoStep) * 24 + 12)}px`
                        : "6px",
                      opacity: isPlayingDemo ? 0.9 : 0.3,
                    }}
                  />
                ))}
              </div>

              {/* Dialogue Transcript Bubble List */}
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
                {demoDialogue.slice(0, demoStep + 1).map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      item.speaker === "Doctor"
                        ? "bg-primary/5 border-primary/20 text-foreground"
                        : "bg-muted/40 border-border/60 text-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className={item.speaker === "Doctor" ? "text-primary" : "text-cyan-600 dark:text-cyan-400"}>
                        {item.speaker === "Doctor" ? "👨‍⚕️ Dr. Sharma" : "👤 Patient (Ramesh Verma)"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{item.lang}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Real-Time Extracted Structured Clinical Report */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  <span>Real-Time Clinical Extraction</span>
                </div>
                <Badge variant="success" className="text-[11px]">
                  SOAP Model Auto-Sync
                </Badge>
              </div>

              {/* Structured Card */}
              <div className="rounded-2xl border border-border/70 bg-card p-5 space-y-4 shadow-sm">
                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Chief Complaint & Symptoms
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <Badge variant="warning">High Grade Fever (3 days)</Badge>
                    <Badge variant="warning">Severe Myalgia / Body ache</Badge>
                    {demoStep >= 1 && <Badge variant="warning">Dry Cough</Badge>}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Recorded Vitals
                  </span>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50 text-xs">
                      <span className="text-muted-foreground">Temperature:</span>{" "}
                      <span className="font-bold text-foreground">{demoStep >= 2 ? "101.4°F" : "Pending..."}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-muted/30 border border-border/50 text-xs">
                      <span className="text-muted-foreground">Blood Pressure:</span>{" "}
                      <span className="font-bold text-foreground">{demoStep >= 2 ? "130/85 mmHg" : "Pending..."}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Prescriptions (Rx)
                  </span>
                  <div className="space-y-2 mt-1.5">
                    {demoStep >= 4 ? (
                      <>
                        <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs flex justify-between items-center">
                          <div>
                            <p className="font-bold text-foreground">Tab. Dolo (Paracetamol) 650mg</p>
                            <p className="text-muted-foreground text-[11px]">1 tablet TDS (after food) x 3 days</p>
                          </div>
                          <Badge variant="success">Oral</Badge>
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs flex justify-between items-center">
                          <div>
                            <p className="font-bold text-foreground">Tab. Azithromycin 500mg</p>
                            <p className="text-muted-foreground text-[11px]">1 tablet OD (after food) x 5 days</p>
                          </div>
                          <Badge variant="success">Oral</Badge>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground italic py-2">
                        Listening to doctor&apos;s verbal recommendations...
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Dietary & Lifestyle Advice
                  </span>
                  <p className="text-xs text-foreground mt-1">
                    {demoStep >= 4
                      ? "• Plenty of warm fluids & hydration • Light Khichdi diet • Strictly avoid cold drinks & exposure"
                      : "Awaiting consultation conclusion..."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-500" />
              End-to-End Encrypted Consultation Stream • Zero Permanent Voice Storage
            </span>
            <Button size="sm" variant="gradient" asChild className="rounded-xl">
              <Link href="/recording">Try Live With Your Microphone &rarr;</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="medical" className="text-xs uppercase tracking-wider">
            Engineered For High-Volume Clinics
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Everything A Modern Doctor Needs To Never Type Again
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Built by clinical doctors and AI research scientists to drastically simplify patient documentation without disrupting consultation intimacy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="rounded-3xl border border-border/70 p-7 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all hover:shadow-card-hover group">
            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Ambient Speech Dictation</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Place your phone or laptop on your desk. Speak naturally with the patient in your everyday tone—the AI filters out background clinic noise and diarizes voices.
            </p>
          </Card>

          {/* Card 2 */}
          <Card className="rounded-3xl border border-border/70 p-7 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all hover:shadow-card-hover group">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Languages className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">10+ Indic Languages</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Native multi-language intelligence supporting Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Punjabi, Kannada, Malayalam, and natural Hinglish code-switching.
            </p>
          </Card>

          {/* Card 3 */}
          <Card className="rounded-3xl border border-border/70 p-7 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all hover:shadow-card-hover group">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Smart Prescription Synthesis</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              AI maps brand and generic drug names, routes, dosages, food relations, and durations into ready-to-print, legally compliant prescriptions with verified QR codes.
            </p>
          </Card>

          {/* Card 4 */}
          <Card className="rounded-3xl border border-border/70 p-7 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all hover:shadow-card-hover group">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HeartPulse className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Personalized Diet & Lifestyle</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Automatically creates tailored nutrition plans based on patient chronic conditions (diabetes, hypertension, renal care), avoiding generic one-size-fits-all sheets.
            </p>
          </Card>

          {/* Card 5 */}
          <Card id="security" className="scroll-mt-24 rounded-3xl border border-border/70 p-7 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all hover:shadow-card-hover group">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">HIPAA & DISHA Compliant</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Hospital-grade AES-256 encrypted storage, strict audit trails, localized Indian data residency compliance, and anonymized PHI sanitization.
            </p>
          </Card>

          {/* Card 6 */}
          <Card className="rounded-3xl border border-border/70 p-7 bg-card/60 backdrop-blur-md hover:border-primary/50 transition-all hover:shadow-card-hover group">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Share2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Instant Patient Delivery</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Export high-resolution PDFs with your clinic logo, print directly from the browser, or dispatch patient instructions securely via WhatsApp and SMS in 1 click.
            </p>
          </Card>
        </div>
      </section>

      {/* Language Showcase Section */}
      <section id="languages" className="py-16 px-6 max-w-6xl mx-auto border-t border-border/60">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="text-xs uppercase tracking-wider">
            Linguistic Diversity
          </Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Speaks The Language Your Patients Speak
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Trained specifically on clinical doctor-patient interactions across India, handling regional medical colloquialisms with ease.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { lang: "Hindi", script: "हिन्दी", region: "North / Central" },
            { lang: "Tamil", script: "தமிழ்", region: "Tamil Nadu" },
            { lang: "Telugu", script: "తెలుగు", region: "Andhra / Telangana" },
            { lang: "Bengali", script: "বাংলা", region: "West Bengal" },
            { lang: "Marathi", script: "मराठी", region: "Maharashtra" },
            { lang: "Gujarati", script: "ગુજરાતી", region: "Gujarat" },
            { lang: "Kannada", script: "ಕನ್ನಡ", region: "Karnataka" },
            { lang: "Malayalam", script: "മലയാളം", region: "Kerala" },
            { lang: "Punjabi", script: "ਪੰਜਾਬੀ", region: "Punjab" },
            { lang: "English", script: "Global", region: "All India" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm text-center hover:border-primary/50 transition-all hover:bg-card"
            >
              <p className="text-lg font-bold text-foreground">{item.lang}</p>
              <p className="text-sm font-medium text-primary mt-0.5">{item.script}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{item.region}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 border border-emerald-500/30 p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="relative space-y-6 max-w-2xl mx-auto">
            <Badge variant="outline" className="border-white/30 text-white bg-white/10 text-xs">
              Immediate Clinical Deployment
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Reclaim 2 Hours Of Your Practice Every Day.
            </h2>
            <p className="text-emerald-100/80 text-base md:text-lg">
              Start transforming consultations today. No complicated setups, no contracts, works on any device with a microphone.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button size="xl" className="bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold shadow-lg" asChild>
                <Link href="/dashboard">
                  Open Doctor Command Center
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-12 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" href="/" subtitle="Clinical Healthcare Intelligence" />

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/recording" className="hover:text-foreground transition-colors">
              Live Scribe
            </Link>
            <Link href="/patients" className="hover:text-foreground transition-colors">
              Patients
            </Link>
            <Link href="/reports" className="hover:text-foreground transition-colors">
              Reports
            </Link>
            <Link href="/settings" className="hover:text-foreground transition-colors">
              Settings
            </Link>
          </div>

          <p className="text-xs text-muted-foreground text-center md:text-right">
            &copy; {new Date().getFullYear()} MediNote. Built for clinicians with clinical precision.
          </p>
        </div>
      </footer>
    </div>
  );
}
