"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Me {
  id: string;
  email: string;
}

export default function NavBar() {
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
    <header className="border-b border-line">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-sm bg-moss flex items-center justify-center text-amber font-mono text-sm font-medium">
            /s
          </span>
          <span className="font-display text-xl tracking-tight">Stub</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {me === undefined ? null : me ? (
            <>
              <Link
                href="/dashboard"
                className={`hover:text-moss transition-colors ${pathname === "/dashboard" ? "text-moss font-medium" : "text-ink/70"}`}
              >
                Dashboard
              </Link>
              <span className="text-ink/40 hidden sm:inline">{me.email}</span>
              <button
                onClick={logout}
                className="px-3 py-1.5 rounded-sm border border-line hover:border-moss hover:text-moss transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-ink/70 hover:text-moss transition-colors">
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 rounded-sm bg-moss text-paper hover:bg-mossLight transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
