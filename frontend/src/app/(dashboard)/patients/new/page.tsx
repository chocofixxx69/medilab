"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreatePatient, useCheckDuplicatePatient } from "@/hooks/usePatients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  UserPlus,
  ShieldCheck,
  Heart,
  AlertTriangle,
  Phone,
  Home,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import type { PatientCreate } from "@/types";

const patientSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_primary: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^[\d\s+-]+$/, "Invalid phone format"),
  date_of_birth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  blood_group: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address_line1: z.string().optional(),
  address_city: z.string().optional(),
  address_state: z.string().optional(),
  address_postal_code: z.string().optional(),
  emergency_name: z.string().optional(),
  emergency_relation: z.string().optional(),
  emergency_phone: z.string().optional(),
  allergies: z.string().optional(),
  chronic_conditions: z.string().optional(),
  current_medications: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function NewPatientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("return");
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const createMutation = useCreatePatient();
  const checkDuplicateMutation = useCheckDuplicatePatient();

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_primary: "",
      date_of_birth: "",
      gender: undefined,
      blood_group: "",
      email: "",
      address_line1: "",
      address_city: "",
      address_state: "",
      address_postal_code: "",
      emergency_name: "",
      emergency_relation: "",
      emergency_phone: "",
      allergies: "",
      chronic_conditions: "",
      current_medications: "",
    },
  });

  const handlePhoneBlur = async (phone: string) => {
    if (phone && phone.replace(/\D/g, "").length >= 10) {
      try {
        const result = await checkDuplicateMutation.mutateAsync(phone);
        if (result?.is_duplicate) {
          setDuplicateWarning(`A patient with this mobile number is already registered.`);
        } else {
          setDuplicateWarning(null);
        }
      } catch {
        // ignore check error
      }
    }
  };

  const onSubmit = async (data: PatientFormValues) => {
    setFormError(null);
    try {
      const patientData: PatientCreate = {
        first_name: data.first_name,
        last_name: data.last_name,
        phone_primary: data.phone_primary.replace(/\s+/g, ""),
        date_of_birth: data.date_of_birth || undefined,
        gender: data.gender,
        blood_group: data.blood_group || undefined,
        email: data.email || undefined,
        address:
          data.address_line1 || data.address_city
            ? {
                line1: data.address_line1,
                city: data.address_city,
                state: data.address_state,
                postal_code: data.address_postal_code,
                country: "India",
              }
            : undefined,
        emergency_contact:
          data.emergency_name && data.emergency_phone
            ? {
                name: data.emergency_name,
                relation: data.emergency_relation,
                phone: data.emergency_phone.replace(/\s+/g, ""),
              }
            : undefined,
        allergies: data.allergies
          ? data.allergies.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        chronic_conditions: data.chronic_conditions
          ? data.chronic_conditions.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        current_medications: data.current_medications
          ? data.current_medications.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
      };

      const patient = await createMutation.mutateAsync(patientData);

      if (returnUrl) {
        router.push(`${returnUrl}?patient=${patient.id}`);
      } else {
        router.push(`/patients/${patient.id}`);
      }
    } catch (err: any) {
      console.error("Patient creation failed:", err);
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map((d: any) => d.msg || JSON.stringify(d)).join(", ")
        : (detail || err.message || "Failed to create patient");
      setFormError(msg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-3xl bg-card/80 border border-border/70 backdrop-blur-xl shadow-glass">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="iconSm" asChild className="rounded-xl">
            <Link href="/patients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
              Register New Patient
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Create an EHR electronic profile for consultations and smart prescription records
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Encrypted HIPAA Profile</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Card 1: Core Demographics */}
          <Card className="rounded-3xl border-border/70 p-6 md:p-8 bg-card/80 backdrop-blur-xl shadow-glass space-y-6">
            <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
              <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <UserPlus className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-foreground">
                Primary Identity & Demographics
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ramesh" {...field} className="rounded-xl h-11 bg-muted/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Verma" {...field} className="rounded-xl h-11 bg-muted/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phone_primary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Primary Mobile Number *</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="98765 43210"
                      {...field}
                      onBlur={() => handlePhoneBlur(field.value)}
                      className="rounded-xl h-11 bg-muted/20 font-mono"
                    />
                  </FormControl>
                  {duplicateWarning && (
                    <div className="flex items-center gap-2 text-xs font-medium text-amber-600 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{duplicateWarning}</span>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="rounded-xl h-11 bg-muted/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl h-11 bg-muted/20 text-xs">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="blood_group"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Blood Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl h-11 bg-muted/20 text-xs">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl">
                        {bloodGroups.map((bg) => (
                          <SelectItem key={bg} value={bg}>
                            {bg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Email Address (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="patient@email.com"
                      {...field}
                      className="rounded-xl h-11 bg-muted/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          {/* Card 2: Contact & Emergency */}
          <Card className="rounded-3xl border-border/70 p-6 md:p-8 bg-card/80 backdrop-blur-xl shadow-glass space-y-6">
            <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
              <div className="h-8 w-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <Home className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-foreground">
                Residential & Emergency Information
              </h2>
            </div>

            <FormField
              control={form.control}
              name="address_line1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="House / Flat No., Street, Colony" {...field} className="rounded-xl h-11 bg-muted/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="address_city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mumbai / Delhi" {...field} className="rounded-xl h-11 bg-muted/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address_state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">State</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Maharashtra" {...field} className="rounded-xl h-11 bg-muted/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address_postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">PIN Code</FormLabel>
                    <FormControl>
                      <Input placeholder="400001" {...field} className="rounded-xl h-11 bg-muted/20 font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/50">
              <FormField
                control={form.control}
                name="emergency_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Emergency Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sunita Verma" {...field} className="rounded-xl h-11 bg-muted/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergency_relation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="Spouse / Parent" {...field} className="rounded-xl h-11 bg-muted/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergency_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Emergency Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="98765 00000" {...field} className="rounded-xl h-11 bg-muted/20 font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          {/* Card 3: Clinical Background & Allergies */}
          <Card className="rounded-3xl border-border/70 p-6 md:p-8 bg-card/80 backdrop-blur-xl shadow-glass space-y-6">
            <div className="flex items-center gap-2.5 pb-2 border-b border-border/60">
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Heart className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-foreground">
                Clinical Background & Medical Profile
              </h2>
            </div>

            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Known Allergies (Comma separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Penicillin, Sulfa drugs, Peanuts"
                      {...field}
                      className="rounded-xl h-11 bg-muted/20"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Highlighted in red alerts during consultation voice transcription.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chronic_conditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Chronic Conditions (Comma separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma"
                      {...field}
                      className="rounded-xl h-11 bg-muted/20"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">
                    Used by AI to calibrate personalized dietary advice and contraindication warnings.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Current Regular Medications</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Metformin 500mg, Telmisartan 40mg"
                      {...field}
                      className="rounded-xl h-11 bg-muted/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          {/* Form Error Banner */}
          {formError && (
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" asChild className="rounded-xl h-11">
              <Link href="/patients">Cancel</Link>
            </Button>

            <Button
              type="submit"
              variant="gradient"
              disabled={createMutation.isPending}
              className="rounded-xl font-bold shadow-glow-teal h-11 px-8"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering Patient...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Save Patient Record
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
