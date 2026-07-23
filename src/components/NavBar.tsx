"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Link2, LayoutDashboard, LogOut, LogIn, UserPlus, User } from "lucide-react";

interface Me {
  id: string;
  email: string;
}

export default function TopBar() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMe(d.user))
      .catch(() => setMe(null));
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-slate-950 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <Link2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans font-bold text-xl tracking-tight text-white group-hover:text-brand-300 transition-colors">
              Stub
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium">
              v0.1
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          {me === undefined ? (
            <div className="h-8 w-24 bg-slate-800/50 animate-pulse rounded-lg" />
          ) : me ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                  pathname === "/dashboard"
                    ? "bg-brand-500/15 text-brand-300 border border-brand-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate max-w-[140px]">{me.email}</span>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all text-xs font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all text-xs font-semibold"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log in</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 font-semibold shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 transition-all text-xs"
              >
                <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Sign up</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
