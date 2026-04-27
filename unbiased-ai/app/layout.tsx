import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Unbiased AI — Fairness Decision System",
  description: "Detect bias, compute fairness metrics, and generate mitigation suggestions for AI models.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
