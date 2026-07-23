import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import { Link2, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Stub — Precision URL Shortener & Analytics",
  description: "Fast, elegant link shortener with real-time analytics and QR code generation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased bg-grid-pattern selection:bg-brand-500/30 selection:text-brand-200">
        <NavBar />
        <main className="flex-1 relative z-10">{children}</main>
        <footer className="border-t border-slate-800/60 py-10 mt-20 bg-slate-950/60 backdrop-blur-md relative z-10">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-brand-400" />
              <span className="font-semibold text-slate-200">Stub URL Shortener</span>
              <span>— Modern link management made simple.</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="flex items-center gap-1 text-slate-300 font-mono">
                <Sparkles className="w-3 h-3 text-brand-400" />
                v0.1 MVP
              </span>
              <span>•</span>
              <span>Built with Next.js & SQLite</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
