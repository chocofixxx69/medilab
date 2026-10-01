"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { usePatient, usePatientHistory, useDeletePatient } from "@/hooks/usePatients";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Edit,
  Trash2,
  Mic,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Heart,
  Pill,
  AlertTriangle,
  FileText,
  Loader2,
  ShieldAlert,
  Activity,
  Droplet,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { formatDate, formatPhone, calculateAge, getInitials } from "@/lib/utils";
import { useState } from "react";
import type { Visit } from "@/types";

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: patient, isLoading } = usePatient(patientId);
  const { data: history, isLoading: historyLoading } = usePatientHistory(patientId);
  const deleteMutation = useDeletePatient();

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(patientId);
    router.push("/patients");
  };

  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading patient records">
        <Skeleton className="h-28 w-full rounded-3xl" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl md:col-span-2" />
        </div>
        <span className="sr-only">Loading patient clinical information...</span>
      </div>
    );
  }

  if (!patient) {
    return (
      <Card className="rounded-3xl p-12 text-center border-dashed" role="alert">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" aria-hidden="true" />
        <h2 className="text-xl font-bold text-foreground">Patient record not found</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-5">
          The requested electronic health record may have been archived or does not exist.
        </p>
        <Button asChild variant="gradient" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          <Link href="/patients">Return to Patient Registry</Link>
        </Button>
      </Card>
    );
  }

  const age = patient.date_of_birth ? calculateAge(patient.date_of_birth) : null;
  const fullAddress = patient.address
    ? [
        patient.address.line1,
        patient.address.line2,
        patient.address.city,
        patient.address.state,
        patient.address.postal_code,
        patient.address.country,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <div className="space-y-8 pb-12" role="region" aria-label={`Patient Chart for ${patient.first_name} ${patient.last_name}`}>
      {/* Patient Hero Banner */}
      <section
        aria-labelledby="patient-heading"
        className="p-6 md:p-8 rounded-3xl border border-border/70 bg-card/80 backdrop-blur-xl shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex items-start md:items-center gap-4">
          <Button
            variant="outline"
            size="iconSm"
            asChild
            className="rounded-xl mt-1 md:mt-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Back to patient registry list"
          >
            <Link href="/patients">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-xl font-extrabold text-white shadow-glow-teal select-none"
              aria-hidden="true"
            >
              {getInitials(`${patient.first_name} ${patient.last_name}`)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 id="patient-heading" className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                  {patient.first_name} {patient.last_name}
                </h1>
                <Badge
                  variant={patient.status === "active" ? "success" : "secondary"}
                  className="text-xs px-2.5 py-0.5"
                  aria-label={`Status: ${patient.status}`}
                >
                  <span className="sr-only">Status: </span>
                  {patient.status}
                </Badge>
                {patient.blood_group && (
                  <Badge
                    variant="outline"
                    className="text-xs font-bold text-rose-700 dark:text-rose-300 border-rose-500/40 bg-rose-500/10"
                    aria-label={`Blood Group: ${patient.blood_group}`}
                  >
                    <Droplet className="h-3 w-3 mr-1 fill-current" aria-hidden="true" />
                    <span>{patient.blood_group}</span>
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                EHR Record: <span className="font-bold text-foreground">{patient.patient_id}</span> • Registered {formatDate(patient.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Toolbar with WCAG Accessible Targets */}
        <div className="flex items-center gap-3">
          <Button
            variant="gradient"
            asChild
            className="rounded-xl font-bold shadow-glow-teal h-12 px-6 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Link
              href={`/recording?patient=${patient.id}`}
              aria-label={`Start new ambient voice consultation session for ${patient.first_name} ${patient.last_name}`}
            >
              <Mic className="mr-2 h-4 w-4" aria-hidden="true" />
              New Consultation Scribe
            </Link>
          </Button>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl h-12 w-12 text-destructive hover:bg-destructive/10 border-border/80 focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
                aria-label={`Archive record for ${patient.first_name} ${patient.last_name}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl" role="alertdialog" aria-labelledby="dialog-title" aria-describedby="dialog-desc">
              <DialogHeader>
                <DialogTitle id="dialog-title">Archive Patient Record?</DialogTitle>
                <DialogDescription id="dialog-desc">
                  Are you sure you want to archive the electronic medical records for {patient.first_name} {patient.last_name}? This will hide the profile from active appointments while preserving historical audit logs.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2"
                >
                  {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                  Archive Record
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Tabs with Keyboard Navigation & ARIA labels */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList
          aria-label="Patient chart sections"
          className="p-1 rounded-2xl bg-card border border-border/70 h-auto"
        >
          <TabsTrigger
            value="overview"
            className="rounded-xl px-5 py-2.5 font-bold text-xs focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Overview & Vitals
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-xl px-5 py-2.5 font-bold text-xs focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Consultation History
          </TabsTrigger>
          <TabsTrigger
            value="medical"
            className="rounded-xl px-5 py-2.5 font-bold text-xs focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Allergies & Regimen
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Demographics Definition List */}
            <Card className="rounded-3xl p-6 bg-card/80 border-border/70 space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">
                  Demographics
                </h2>
              </div>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground">Age & Date of Birth</dt>
                  <dd className="font-semibold text-foreground mt-0.5">
                    {age ? `${age} years old` : "Not specified"} {patient.date_of_birth && `(${formatDate(patient.date_of_birth)})`}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground">Biological Sex / Gender</dt>
                  <dd className="font-semibold text-foreground capitalize mt-0.5">
                    {patient.gender || "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground">Blood Type</dt>
                  <dd className="font-semibold text-foreground mt-0.5">
                    {patient.blood_group || "Unknown"}
                  </dd>
                </div>
              </dl>
            </Card>

            {/* Contact Details Definition List */}
            <Card className="rounded-3xl p-6 bg-card/80 border-border/70 space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">
                  Contact Information
                </h2>
              </div>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground">Primary Mobile Phone</dt>
                  <dd className="font-semibold text-foreground font-mono mt-0.5">
                    <a
                      href={`tel:${patient.phone_primary}`}
                      className="hover:text-primary transition-colors focus-visible:underline"
                      aria-label={`Call primary phone ${formatPhone(patient.phone_primary)}`}
                    >
                      {formatPhone(patient.phone_primary)}
                    </a>
                  </dd>
                </div>
                {patient.email && (
                  <div>
                    <dt className="text-xs font-semibold text-muted-foreground">Email Address</dt>
                    <dd className="font-semibold text-foreground truncate mt-0.5">
                      <a
                        href={`mailto:${patient.email}`}
                        className="hover:text-primary transition-colors focus-visible:underline"
                        aria-label={`Email ${patient.email}`}
                      >
                        {patient.email}
                      </a>
                    </dd>
                  </div>
                )}
                {fullAddress && (
                  <div>
                    <dt className="text-xs font-semibold text-muted-foreground">Residential Address</dt>
                    <dd className="font-semibold text-foreground text-xs leading-relaxed mt-0.5">
                      {fullAddress}
                    </dd>
                  </div>
                )}
              </dl>
            </Card>

            {/* Emergency Contact */}
            <Card className="rounded-3xl p-6 bg-card/80 border-border/70 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-rose-500" aria-hidden="true" />
                <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">
                  Emergency Contact
                </h2>
              </div>
              {patient.emergency_contact ? (
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold text-muted-foreground">Contact Person</dt>
                    <dd className="font-semibold text-foreground mt-0.5">{patient.emergency_contact.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-muted-foreground">Relationship</dt>
                    <dd className="font-semibold text-foreground capitalize mt-0.5">{patient.emergency_contact.relation || "Next of kin"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-muted-foreground">Emergency Number</dt>
                    <dd className="font-semibold text-foreground font-mono mt-0.5">
                      <a
                        href={`tel:${patient.emergency_contact.phone}`}
                        className="hover:text-primary transition-colors focus-visible:underline"
                        aria-label={`Call emergency contact at ${formatPhone(patient.emergency_contact.phone)}`}
                      >
                        {formatPhone(patient.emergency_contact.phone)}
                      </a>
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-xs text-muted-foreground">No emergency contact currently registered.</p>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Consultation History */}
        <TabsContent value="history" className="space-y-6 focus-visible:outline-none">
          <Card className="rounded-3xl p-6 bg-card/80 border-border/70">
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div>
                <h2 className="font-bold text-base text-foreground">Clinical Visit Records</h2>
                <p className="text-xs text-muted-foreground">Chronological consultation timeline</p>
              </div>
              <Button size="sm" variant="gradient" asChild className="rounded-xl">
                <Link href={`/recording?patient=${patient.id}`} aria-label={`Start consultation recording for ${patient.first_name}`}>
                  <Mic className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  Start Visit Scribe
                </Link>
              </Button>
            </div>

            {historyLoading ? (
              <div className="space-y-3 pt-4" role="status" aria-busy="true">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-2xl" />
                ))}
                <span className="sr-only">Loading clinical history...</span>
              </div>
            ) : !history || (Array.isArray(history) && history.length === 0) ? (
              <div className="py-12 text-center" role="status">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" aria-hidden="true" />
                <p className="font-semibold text-foreground">No previous consultations recorded</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Conduct your first ambient voice consultation with this patient.
                </p>
                <Button asChild size="sm" variant="gradient">
                  <Link href={`/recording?patient=${patient.id}`}>Start First Scribe</Link>
                </Button>
              </div>
            ) : (
              <ul className="space-y-3 pt-4 list-none p-0 m-0" aria-label="Consultation visit list">
                {(Array.isArray(history) ? history : []).map((visit: Visit) => (
                  <li key={visit.id}>
                    <div className="p-4 rounded-2xl border border-border/60 bg-card hover:bg-muted/30 transition-all flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{visit.visit_number}</span>
                          <Badge variant="outline" className="text-[10px]">{visit.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(visit.visit_date)} • {visit.chief_complaint || "Routine clinical consultation"}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" asChild className="rounded-xl">
                        <Link href={`/reports`} aria-label={`View clinical report for visit ${visit.visit_number}`}>
                          View Report &rarr;
                        </Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </TabsContent>

        {/* Tab 3: Medical Info */}
        <TabsContent value="medical" className="space-y-6 focus-visible:outline-none">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Allergies Card - High Contrast & Alert role */}
            <Card
              className="rounded-3xl p-6 bg-card/80 border border-rose-500/30 space-y-4"
              role="region"
              aria-label="Allergy alerts"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                <h2 className="font-bold text-base text-foreground">Known Medical Allergies</h2>
              </div>
              {patient.allergies && patient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2" role="list" aria-label="Registered allergies">
                  {patient.allergies.map((a, i) => (
                    <span
                      key={i}
                      role="listitem"
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-rose-500/15 text-rose-800 dark:text-rose-200 border border-rose-500/30"
                    >
                      <AlertTriangle className="h-3 w-3 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No known drug or environmental allergies registered.</p>
              )}
            </Card>

            {/* Chronic Conditions */}
            <Card
              className="rounded-3xl p-6 bg-card/80 border border-amber-500/30 space-y-4"
              role="region"
              aria-label="Chronic medical conditions"
            >
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                <h2 className="font-bold text-base text-foreground">Chronic Conditions</h2>
              </div>
              {patient.chronic_conditions && patient.chronic_conditions.length > 0 ? (
                <div className="flex flex-wrap gap-2" role="list" aria-label="Registered chronic conditions">
                  {patient.chronic_conditions.map((c, i) => (
                    <span
                      key={i}
                      role="listitem"
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-amber-500/15 text-amber-800 dark:text-amber-200 border border-amber-500/30"
                    >
                      <Heart className="h-3 w-3 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                      {c}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No chronic conditions registered.</p>
              )}
            </Card>

            {/* Current Medications */}
            <Card className="rounded-3xl p-6 bg-card/80 border-border/70 space-y-4 md:col-span-2">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-teal-600 dark:text-teal-400" aria-hidden="true" />
                <h2 className="font-bold text-base text-foreground">Active Medication Regimen</h2>
              </div>
              {patient.current_medications && patient.current_medications.length > 0 ? (
                <ul className="grid gap-2 sm:grid-cols-2 list-none p-0 m-0" aria-label="Active medications">
                  {patient.current_medications.map((m, i) => (
                    <li
                      key={i}
                      className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 text-xs font-semibold text-foreground flex items-center gap-2.5"
                    >
                      <Pill className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" aria-hidden="true" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">No active medications registered.</p>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
