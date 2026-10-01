"use client";

import { useState } from "react";
import Link from "next/link";
import { usePatients } from "@/hooks/usePatients";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Search,
  UserPlus,
  User,
  Phone,
  Calendar,
  Mic,
  LayoutGrid,
  List,
  Eye,
  Filter,
  ArrowRight,
  Heart,
  Droplet,
} from "lucide-react";
import { formatPhone, getInitials, calculateAge, formatDate } from "@/lib/utils";
import type { Patient } from "@/types";

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = usePatients({
    search: debouncedSearch || undefined,
    limit: 50,
  });

  const filteredPatients =
    status === "all"
      ? data?.results
      : data?.results?.filter((p) => p.status === status);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card/80 border border-border/70 backdrop-blur-xl shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Clinical Directory
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Patient Registry
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage electronic health records, active conditions, and consultation history
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="gradient" asChild className="rounded-xl font-bold shadow-glow-teal px-5">
            <Link href="/patients/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Patient
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full max-w-lg">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or EHR patient ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-2xl bg-card border-border/70 text-sm shadow-subtle focus:bg-background transition-all"
            />
          </div>

          {/* Status Dropdown */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-36 h-11 rounded-2xl bg-card border-border/70 text-xs font-semibold">
              <Filter className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Switcher and Count */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          {!isLoading && (
            <span className="text-xs font-semibold text-muted-foreground">
              {filteredPatients?.length || 0} patient records found
            </span>
          )}

          <div className="flex items-center rounded-xl border border-border/60 bg-card p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Patient Content View */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : filteredPatients?.length === 0 ? (
        <Card className="rounded-3xl p-12 text-center border-dashed">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h3 className="text-lg font-bold text-foreground">No patients found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1 mb-5">
            {search
              ? `No records matched your search "${search}". Try checking for typos or phone number.`
              : "Get started by adding your first patient record to the registry."}
          </p>
          <Button asChild variant="gradient" className="rounded-xl">
            <Link href="/patients/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Register Patient
            </Link>
          </Button>
        </Card>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients?.map((patient) => {
            const age = patient.date_of_birth ? calculateAge(patient.date_of_birth) : null;

            return (
              <Card
                key={patient.id}
                className="rounded-3xl border border-border/70 hover:border-primary/50 bg-card/80 backdrop-blur-md p-5 hover:shadow-card-hover transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-sm font-extrabold text-white shadow-sm group-hover:scale-105 transition-transform">
                        {getInitials(`${patient.first_name} ${patient.last_name}`)}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/patients/${patient.id}`}
                          className="font-bold text-base text-foreground hover:text-primary transition-colors block truncate"
                        >
                          {patient.first_name} {patient.last_name}
                        </Link>
                        <p className="text-xs font-mono text-muted-foreground mt-0.5">
                          {patient.patient_id}
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

                  {/* Demographic & Contact Details */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{age ? `${age} years` : "Age N/A"}</span>
                      {patient.gender && <span>• {patient.gender}</span>}
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{formatPhone(patient.phone_primary)}</span>
                    </div>
                  </div>

                  {/* Chronic Conditions & Allergies */}
                  {patient.chronic_conditions && patient.chronic_conditions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-border/50">
                      {patient.chronic_conditions.map((c, i) => (
                        <Badge key={i} variant="warning" className="text-[10px] py-0">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/50">
                  <Button variant="ghost" size="sm" asChild className="rounded-xl text-xs font-semibold h-8 px-2.5">
                    <Link href={`/patients/${patient.id}`}>
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      Full Chart
                    </Link>
                  </Button>

                  <Button
                    size="sm"
                    variant="gradient"
                    asChild
                    className="rounded-xl text-xs font-bold shadow-glow-teal h-8 px-3"
                  >
                    <Link href={`/recording?patient=${patient.id}`}>
                      <Mic className="mr-1.5 h-3.5 w-3.5" />
                      Scribe
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <Card className="rounded-3xl border border-border/70 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border/60 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3.5 px-6">Patient</th>
                  <th className="py-3.5 px-4">Demographics</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Chronic Conditions</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredPatients?.map((patient) => {
                  const age = patient.date_of_birth ? calculateAge(patient.date_of_birth) : null;
                  return (
                    <tr key={patient.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-6">
                        <Link
                          href={`/patients/${patient.id}`}
                          className="font-bold text-foreground hover:text-primary transition-colors block"
                        >
                          {patient.first_name} {patient.last_name}
                        </Link>
                        <span className="text-xs font-mono text-muted-foreground">
                          {patient.patient_id}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {age ? `${age} yrs` : "N/A"} • {patient.gender || "Unspecified"}
                      </td>
                      <td className="py-3 px-4 text-xs text-foreground font-mono">
                        {formatPhone(patient.phone_primary)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {patient.chronic_conditions && patient.chronic_conditions.length > 0 ? (
                            patient.chronic_conditions.slice(0, 2).map((c, i) => (
                              <Badge key={i} variant="warning" className="text-[10px]">
                                {c}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">None</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={patient.status === "active" ? "success" : "secondary"}
                          className="text-[10px]"
                        >
                          {patient.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="iconSm" variant="ghost" asChild className="rounded-lg">
                            <Link href={`/patients/${patient.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="gradient" asChild className="rounded-xl text-xs font-bold">
                            <Link href={`/recording?patient=${patient.id}`}>
                              <Mic className="mr-1 h-3.5 w-3.5" />
                              Scribe
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
