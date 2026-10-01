"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  User,
  Lock,
  Bell,
  Palette,
  Sparkles,
  ShieldCheck,
  Building,
  CheckCircle2,
  Mic,
  Languages,
} from "lucide-react";
import { getInitials } from "@/lib/utils";
import { useState } from "react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  hospital_name: z.string().optional(),
  qualification: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user, updateUser } = useAuthStore();
  const { changePassword, isChangingPassword, changePasswordError } = useAuth();
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [activeTheme, setActiveTheme] = useState<"system" | "light" | "dark">("light");

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "Dr. Rajesh Sharma",
      email: user?.email || "dr.sharma@apollo.com",
      phone: user?.phone || "+91 98765 43210",
      hospital_name: user?.hospital_name || "Apollo Multispecialty Clinic",
      qualification: user?.qualification || "MBBS, MD (Medicine)",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    updateUser(data);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    passwordForm.reset();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-card/80 border border-border/70 backdrop-blur-xl shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Doctor Console
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Clinic & Speech AI Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your medical credentials, clinic letterhead, speech dialect preferences, and security
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="p-1 rounded-2xl bg-card border border-border/70">
          <TabsTrigger value="profile" className="rounded-xl px-5 font-bold text-xs gap-2">
            <User className="h-4 w-4" />
            Doctor Profile
          </TabsTrigger>
          <TabsTrigger value="ai" className="rounded-xl px-5 font-bold text-xs gap-2">
            <Sparkles className="h-4 w-4" />
            Speech AI Engine
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-5 font-bold text-xs gap-2">
            <Lock className="h-4 w-4" />
            Security & Access
          </TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-xl px-5 font-bold text-xs gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="rounded-3xl border-border/70 p-6 md:p-8 bg-card/80 backdrop-blur-xl shadow-glass space-y-6">
            <div className="flex items-center gap-5 pb-6 border-b border-border/60">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-2xl font-extrabold text-white shadow-glow-teal">
                {user?.name ? getInitials(user.name) : "DR"}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">{user?.name || "Dr. Rajesh Sharma"}</h3>
                <p className="text-xs text-muted-foreground">{user?.hospital_name || "Apollo Clinic"} • {user?.qualification || "MBBS, MD"}</p>
                <Badge variant="success" className="text-[10px]">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  MCI / NMC Verified Clinician
                </Badge>
              </div>
            </div>

            {profileSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Profile changes successfully updated for all generated reports!
              </div>
            )}

            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-foreground">Doctor Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Rajesh Sharma" {...field} className="rounded-xl h-11 bg-muted/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="qualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-foreground">Qualifications & Titles</FormLabel>
                        <FormControl>
                          <Input placeholder="MBBS, MD (General Medicine)" {...field} className="rounded-xl h-11 bg-muted/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="hospital_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-foreground">Clinic / Hospital Name</FormLabel>
                        <FormControl>
                          <Input placeholder="City Multispecialty Clinic" {...field} className="rounded-xl h-11 bg-muted/20" />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Printed at the top of digital prescriptions.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-foreground">Clinic Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98765 43210" {...field} className="rounded-xl h-11 bg-muted/20 font-mono" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-foreground">Login Email</FormLabel>
                      <FormControl>
                        <Input disabled {...field} className="rounded-xl h-11 bg-muted/40 cursor-not-allowed" />
                      </FormControl>
                      <FormDescription className="text-xs">Primary account email is managed by hospital IT.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="gradient" className="rounded-xl font-bold shadow-glow-teal px-6">
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </Form>
          </Card>
        </TabsContent>

        {/* AI Preferences Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="rounded-3xl border-border/70 p-6 md:p-8 bg-card/80 backdrop-blur-xl shadow-glass space-y-6">
            <div>
              <h3 className="font-bold text-lg text-foreground">Speech Recognition & Clinical NLP Engine</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure acoustic models and dialect preference for your region
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-muted/20">
                <div>
                  <p className="text-sm font-bold text-foreground">Primary Consultation Dialect</p>
                  <p className="text-xs text-muted-foreground">Default speech model loaded in Live Scribe</p>
                </div>
                <Select defaultValue="hi">
                  <SelectTrigger className="w-48 h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="hi">Hindi + English (Hinglish)</SelectItem>
                    <SelectItem value="en">English (Standard)</SelectItem>
                    <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                    <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                    <SelectItem value="bn">Bengali (বাংলা)</SelectItem>
                    <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-muted/20">
                <div>
                  <p className="text-sm font-bold text-foreground">Medical Terminology Auto-Map</p>
                  <p className="text-xs text-muted-foreground">Map verbal brand names to generic formulations</p>
                </div>
                <Badge variant="success" className="text-xs">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-muted/20">
                <div>
                  <p className="text-sm font-bold text-foreground">Automatic Drug Interaction Check</p>
                  <p className="text-xs text-muted-foreground">Warns if newly dictated drug clashes with chronic regimen</p>
                </div>
                <Badge variant="success" className="text-xs">Active</Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="rounded-3xl border-border/70 p-6 md:p-8 bg-card/80 backdrop-blur-xl shadow-glass space-y-6">
            <div>
              <h3 className="font-bold text-lg text-foreground">Change Password</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Keep your doctor account and patient EHR records protected
              </p>
            </div>

            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
                {changePasswordError && (
                  <div className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
                    {changePasswordError.message || "Failed to change password"}
                  </div>
                )}

                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-foreground">Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="rounded-xl h-11 bg-muted/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-foreground">New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="rounded-xl h-11 bg-muted/20" />
                      </FormControl>
                      <FormDescription className="text-xs">Min 8 characters with numbers and uppercase.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-foreground">Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} className="rounded-xl h-11 bg-muted/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" variant="gradient" disabled={isChangingPassword} className="rounded-xl font-bold shadow-glow-teal">
                  {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Account Password
                </Button>
              </form>
            </Form>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="rounded-3xl border-border/70 p-6 md:p-8 bg-card/80 backdrop-blur-xl shadow-glass space-y-6">
            <div>
              <h3 className="font-bold text-lg text-foreground">Theme & Interface Appearance</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Customize your visual clinical workspace for day or night clinics
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <button
                onClick={() => {
                  document.documentElement.classList.remove("dark");
                  setActiveTheme("light");
                }}
                className={`p-5 rounded-2xl border text-center transition-all ${
                  activeTheme === "light"
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : "border-border/70 bg-card hover:border-primary/40"
                }`}
              >
                <div className="h-16 bg-white border border-gray-200 rounded-xl mb-3 shadow-xs" />
                <p className="font-bold text-sm text-foreground">Clinical Light</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">High contrast daylight mode</p>
              </button>

              <button
                onClick={() => {
                  document.documentElement.classList.add("dark");
                  setActiveTheme("dark");
                }}
                className={`p-5 rounded-2xl border text-center transition-all ${
                  activeTheme === "dark"
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : "border-border/70 bg-card hover:border-primary/40"
                }`}
              >
                <div className="h-16 bg-slate-900 border border-slate-800 rounded-xl mb-3 shadow-xs" />
                <p className="font-bold text-sm text-foreground">Obsidian Dark</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Reduced eye strain for night shifts</p>
              </button>

              <button
                onClick={() => setActiveTheme("system")}
                className={`p-5 rounded-2xl border text-center transition-all ${
                  activeTheme === "system"
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                    : "border-border/70 bg-card hover:border-primary/40"
                }`}
              >
                <div className="h-16 bg-gradient-to-r from-white to-slate-900 border border-gray-300 rounded-xl mb-3 shadow-xs" />
                <p className="font-bold text-sm text-foreground">System Automatic</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Syncs with OS day/night cycles</p>
              </button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
