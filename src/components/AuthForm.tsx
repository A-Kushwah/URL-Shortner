"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "That didn’t work. Try again.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("The server is being slow. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-sm">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-ink/70">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3 py-2 rounded-sm border border-line bg-white/70 focus:bg-white outline-none"
          autoComplete="email"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-ink/70">Password</span>
        <input
          type="password"
          required
          minLength={mode === "signup" ? 8 : undefined}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-3 py-2 rounded-sm border border-line bg-white/70 focus:bg-white outline-none"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
        {mode === "signup" && <span className="text-xs text-ink/45">At least 8 characters.</span>}
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 px-4 py-2.5 rounded-sm bg-moss text-paper font-medium hover:bg-mossLight transition-colors disabled:opacity-60"
      >
        {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Log in"}
      </button>
    </form>
  );
}
