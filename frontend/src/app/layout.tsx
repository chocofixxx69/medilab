import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "MediNote | Ambient Clinical Intelligence & Scribe",
  description:
    "Transform doctor-patient consultations into structured prescriptions, diet plans, and care instructions in real-time with ambient AI speech recognition.",
  keywords: [
    "clinical ai",
    "ambient scribe",
    "medical transcription",
    "doctor prescription generator",
    "ehr assistant",
    "healthcare ai",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className={`${jakarta.className} min-h-screen bg-background text-foreground antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
