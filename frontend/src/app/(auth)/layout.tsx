import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-border/50 bg-card/60 backdrop-blur-md">
        <Logo size="sm" href="/" subtitle="Clinical Gateway" />

        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>256-Bit Encrypted Clinical Gateway</span>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-xs text-muted-foreground border-t border-border/50">
        &copy; {new Date().getFullYear()} MediNote. Certified Clinical Intelligence System.
      </footer>
    </div>
  );
}
