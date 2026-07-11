"use client";

import { useEffect, useState } from "react";
import LinkRow from "./LinkRow";

export interface DashboardLink {
  id: string;
  slug: string;
  destination_url: string;
  disabled: number;
  created_at: string;
  total_clicks: number;
}

export default function Dashboard() {
  const [links, setLinks] = useState<DashboardLink[] | null>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    const res = await fetch("/api/links");
    const data = await res.json();
    setLinks(data.links ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setUrl("");
      await load();
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="font-display text-3xl">Your links</h1>
      </div>

      <form onSubmit={onCreate} className="flex flex-col sm:flex-row gap-3 mb-2">
        <input
          type="text"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a long URL to shorten"
          className="flex-1 px-4 py-2.5 rounded-sm border border-line bg-white/70 focus:bg-white outline-none"
        />
        <button
          type="submit"
          disabled={creating}
          className="px-5 py-2.5 rounded-sm bg-amber text-ink font-medium hover:bg-amberDeep transition-colors disabled:opacity-60"
        >
          {creating ? "Shortening…" : "Shorten"}
        </button>
      </form>
      {error && <p className="text-sm text-red-700 mb-4">{error}</p>}

      <div className="mt-8">
        {links === null ? (
          <p className="text-ink/50 text-sm">Loading…</p>
        ) : links.length === 0 ? (
          <div className="border border-dashed border-line rounded-md py-16 text-center">
            <p className="text-ink/60">No links yet. Shorten your first one above.</p>
          </div>
        ) : (
          <div className="border border-line rounded-md overflow-hidden divide-y divide-line bg-white/40">
            {links.map((link) => (
              <LinkRow key={link.id} link={link} onChange={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
