"use client";

import { useEffect, useState } from "react";
import LinkRow from "./LinkRow";
import { Link2, MousePointerClick, Search, Plus, Loader2, AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";

export interface DashboardLink {
  id: string;
  slug: string;
  destination_url: string;
  disabled: number;
  created_at: string;
  total_clicks: number;
}

export default function LinkDashboard() {
  const [links, setLinks] = useState<DashboardLink[] | null>(null);
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");
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

    let targetUrl = url.trim();
    if (targetUrl && !/^https?:\/\//i.test(targetUrl)) {
      targetUrl = "https://" + targetUrl;
    }

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not shorten URL. Check the format.");
        return;
      }
      setUrl("");
      await load();
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  const filteredLinks = links?.filter(
    (l) =>
      l.slug.toLowerCase().includes(search.toLowerCase()) ||
      l.destination_url.toLowerCase().includes(search.toLowerCase())
  );

  const totalClicksAll = links?.reduce((acc, curr) => acc + (curr.total_clicks || 0), 0) ?? 0;
  const activeCount = links?.filter((l) => l.disabled === 0).length ?? 0;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Link Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your shortened links and monitor performance stats.</p>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Short Links</span>
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Link2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-white mt-3">{links ? links.length : "—"}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Clicks Tracked</span>
            <div className="p-2 rounded-lg bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-white mt-3">{links ? totalClicksAll : "—"}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Links</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold font-mono text-white mt-3">{links ? activeCount : "—"}</p>
        </div>
      </div>

      {/* Create Link Input Widget */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 shadow-xl">
        <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-brand-400" /> Create New Short Link
        </h2>
        <form onSubmit={onCreate} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste destination URL — https://github.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500/60 text-sm font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={creating || !url.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 font-semibold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Link"}
          </button>
        </form>
        {error && (
          <p className="mt-3 text-xs text-rose-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>

      {/* Links List View */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white">Your Short Links</h2>
          
          {/* Search bar */}
          {links && links.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search links..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500/50"
              />
            </div>
          )}
        </div>

        {links === null ? (
          <div className="glass-card rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
            <span className="text-sm">Loading your links...</span>
          </div>
        ) : links.length === 0 ? (
          <div className="glass-card border border-dashed border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400 mb-4">
              <Link2 className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-200 text-base">No links created yet</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-sm">
              Paste a long URL above to shorten your first link and track click analytics.
            </p>
          </div>
        ) : filteredLinks?.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-slate-400 text-sm">
            No links match your search query &quot;{search}&quot;.
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
            {filteredLinks?.map((link) => (
              <LinkRow key={link.id} link={link} onChange={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
