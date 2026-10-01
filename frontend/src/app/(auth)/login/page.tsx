"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Loader2,
  CheckCircle,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const loginSchema = z.object({
  username: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const { login, isLoggingIn, loginError } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login({
      username: data.username.trim().toLowerCase(),
      password: data.password,
    });
  };

  const handleDemoLogin = () => {
    form.setValue("username", "doctor@hospital.com");
    form.setValue("password", "DoctorPass123!");
    login({
      username: "doctor@hospital.com",
      password: "DoctorPass123!",
    });
  };

  return (
    <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl border border-border/70 bg-card shadow-glass overflow-hidden">
      {/* Left Medical Brand Showcase */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-teal-950 via-emerald-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ambient Clinical Intelligence</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            Consult With Care. <br />
            Focus On The Patient.
          </h2>
          <p className="text-xs text-emerald-100/70 leading-relaxed">
            Ambient bilingual documentation in 10+ Indian languages with instant medical prescription synthesis.
          </p>
        </div>

        {/* Highlight Quote */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 z-10">
          <p className="text-xs text-emerald-100/90 italic">
            &quot;MediNote saves me 2.5 hours every day in OPD documentation. My prescriptions are neat, bilingual, and ready before the patient leaves the room.&quot;
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-300 font-bold">
            <Stethoscope className="h-3.5 w-3.5" />
            <span>Dr. Rajesh Sharma • Apollo Clinic</span>
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="p-8 sm:p-10 flex flex-col justify-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Sign in to access your doctor dashboard & clinical charts
          </p>
        </div>

        {registered && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Registration successful! Please sign in.
          </div>
        )}

        {/* Quick Demo Fill Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleDemoLogin}
          className="w-full rounded-xl border-dashed border-primary/50 text-primary hover:bg-primary/5 text-xs font-bold h-11"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          One-Click Demo Doctor Sign-In
        </Button>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/60" />
          </div>
          <span className="relative bg-card px-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            Or Sign In With Email
          </span>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
                {loginError.message || "Invalid doctor email or password"}
              </div>
            )}

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Doctor Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="doctor@hospital.com"
                        autoComplete="email"
                        {...field}
                        className="pl-10 h-11 rounded-xl bg-muted/20"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-foreground">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...field}
                        className="pl-10 h-11 rounded-xl bg-muted/20"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="gradient"
              className="w-full rounded-xl font-bold shadow-glow-teal h-11"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Sign In to MediNote
            </Button>
          </form>
        </Form>

        <p className="text-center text-xs text-muted-foreground">
          New clinic or hospital?{" "}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Register for access
          </Link>
        </p>
      </div>
    </div>
  );
}
