"use client";

import { useState } from "react";
import CopyButton from "./CopyButton";

interface Result {
  shortUrl: string;
  slug: string;
  id: string;
}

export default function ShortenForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setResult(data);
        setUrl("");
      }
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a long URL — https://example.com/a/very/long/path"
          className="flex-1 px-4 py-3 rounded-sm border border-line bg-white/70 focus:bg-white outline-none text-ink placeholder:text-ink/40"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-sm bg-amber text-ink font-medium hover:bg-amberDeep transition-colors disabled:opacity-60"
        >
          {loading ? "Shortening…" : "Shorten"}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}

      {result && (
        <div className="mt-6 relative stub-notch bg-moss text-paper rounded-md px-6 py-5 flex items-center justify-between gap-4 shadow-sm">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-widest text-amber mb-1">Your short link</p>
            <p className="font-mono text-lg truncate">{result.shortUrl}</p>
          </div>
          <CopyButton text={result.shortUrl} />
        </div>
      )}

      {result && (
        <p className="mt-3 text-sm text-ink/60">
          This link works for anyone, no account needed.{" "}
          <a href="/signup" className="text-moss underline underline-offset-2 hover:text-mossLight">
            Create a free account
          </a>{" "}
          to track its clicks, edit the destination, or get a QR code.
        </p>
      )}
    </div>
  );
}
