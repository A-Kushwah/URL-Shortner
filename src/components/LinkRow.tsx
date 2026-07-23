"use client";

import Link from "next/link";
import { useState } from "react";
import CopyButton from "./CopyButton";
import type { DashboardLink } from "./Dashboard";
import { MousePointerClick, ExternalLink, BarChart2, Power, Globe } from "lucide-react";

export default function LinkEntry({ link, onChange }: { link: DashboardLink; onChange: () => void }) {
  const [busy, setBusy] = useState(false);
  const shortUrl =
    typeof window !== "undefined" ? `${window.location.origin}/${link.slug}` : `/${link.slug}`;

  async function toggleDisabled() {
    setBusy(true);
    try {
      await fetch(`/api/links/${link.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disabled: link.disabled ? false : true }),
      });
      onChange();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 mb-1">
          <Link
            href={`/dashboard/${link.id}`}
            className="font-mono font-semibold text-base text-brand-300 hover:text-brand-200 transition-colors flex items-center gap-1.5"
          >
            <span>/{link.slug}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-400" />
          </Link>

          {link.disabled === 1 ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[11px] font-medium border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              Disabled
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 text-[11px] font-medium border border-brand-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              Active
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 max-w-xl">
          <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{link.destination_url}</span>
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
          <MousePointerClick className="w-3.5 h-3.5 text-brand-400" />
          <span className="font-mono font-bold text-white">{link.total_clicks}</span>
          <span className="text-slate-500 hidden sm:inline">clicks</span>
        </div>

        <CopyButton text={shortUrl} />

        <Link
          href={`/dashboard/${link.id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 text-xs font-medium transition-all"
        >
          <BarChart2 className="w-3.5 h-3.5 text-accent-cyan" />
          <span>Stats</span>
        </Link>

        <button
          onClick={toggleDisabled}
          disabled={busy}
          title={link.disabled ? "Enable Link" : "Disable Link"}
          className={`p-2 rounded-lg border text-xs font-medium transition-all ${
            link.disabled
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
              : "bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10"
          }`}
        >
          <Power className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
