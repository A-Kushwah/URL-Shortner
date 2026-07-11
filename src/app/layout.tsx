import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Stub — short links with real analytics",
  description: "A simple, privacy-respecting URL shortener with click analytics.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line py-8 mt-16">
          <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between gap-2 text-sm text-ink/60">
            <span>Stub — a portfolio project. No ads, no data resale.</span>
            <span className="font-mono">v0.1 MVP</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
