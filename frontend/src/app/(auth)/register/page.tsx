"use client";

import Link from "next/link";
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
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Building,
  User,
  Mail,
  Lock,
} from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string(),
    phone: z.string().optional(),
    hospital_name: z.string().optional(),
    qualification: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, isRegistering, registerError } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      hospital_name: "",
      qualification: "",
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    const { confirmPassword: _confirmPassword, ...registerData } = data;
    register(registerData);
  };

  return (
    <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl border border-border/70 bg-card shadow-glass overflow-hidden my-6">
      {/* Left Brand Showcase */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-teal-950 via-emerald-950 to-slate-900 text-white relative overflow-hidden">
        <div className="space-y-3 z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Join 15,000+ Doctors</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            Elevate Your Clinical Practice.
          </h2>
          <p className="text-xs text-emerald-100/70 leading-relaxed">
            Eliminate after-hours documentation. Generate complete, legally compliant prescriptions with verified QR codes instantly.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2.5 z-10 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>Enterprise Security Guarantee</span>
          </div>
          <p className="text-emerald-100/80 leading-relaxed text-[11px]">
            Fully HIPAA & DISHA compliant with localized Indian health cloud data storage and end-to-end encryption.
          </p>
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="p-8 sm:p-10 flex flex-col justify-center space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Doctor Registration</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Set up your clinical account and start using ambient speech AI
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            {registerError && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
                {registerError.message || "Registration failed. Please verify your details."}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Doctor Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Rajesh Sharma" {...field} className="h-10 rounded-xl bg-muted/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Degrees / Titles</FormLabel>
                    <FormControl>
                      <Input placeholder="MBBS, MD" {...field} className="h-10 rounded-xl bg-muted/20" />
                    </FormControl>
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
                  <FormLabel className="text-xs font-bold text-foreground">Email Address *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="doctor@hospital.com"
                      autoComplete="email"
                      {...field}
                      className="h-10 rounded-xl bg-muted/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Password *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        {...field}
                        className="h-10 rounded-xl bg-muted/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Confirm *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        {...field}
                        className="h-10 rounded-xl bg-muted/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="hospital_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Hospital / Clinic</FormLabel>
                    <FormControl>
                      <Input placeholder="Apollo Clinic" {...field} className="h-10 rounded-xl bg-muted/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Mobile Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 98765 43210" {...field} className="h-10 rounded-xl bg-muted/20 font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full rounded-xl font-bold shadow-glow-teal h-11 mt-2"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Create Doctor Account
            </Button>
          </form>
        </Form>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
