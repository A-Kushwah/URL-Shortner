"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CopyButton from "./CopyButton";
import ClicksChart from "./ClicksChart";
import { ArrowLeft, Edit3, Check, X, QrCode, Download, Globe, Smartphone, BarChart3, ExternalLink, Power, AlertCircle } from "lucide-react";

interface LinkData {
  id: string;
  slug: string;
  destination_url: string;
  disabled: number;
  created_at: string;
}

interface Analytics {
  totalClicks: number;
  clicksByDay: { day: string; clicks: number }[];
  topReferrers: { referer_host: string; clicks: number }[];
  topCountries: { country: string; clicks: number }[];
  deviceBreakdown: { device: string; clicks: number }[];
}

export default function LinkDetails({ linkId }: { linkId: string }) {
  const [link, setLink] = useState<LinkData | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [editing, setEditing] = useState(false);
  const [destInput, setDestInput] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch(`/api/links/${linkId}`);
    if (!res.ok) {
      setNotFound(true);
      return;
    }
    const data = await res.json();
    setLink(data.link);
    setAnalytics(data.analytics);
    setDestInput(data.link.destination_url);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkId]);

  async function saveDestination(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    try {
      const res = await fetch(`/api/links/${linkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationUrl: destInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.error ?? "Couldn't save destination.");
        return;
      }
      setEditing(false);
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function toggleDisabled() {
    if (!link) return;
    setBusy(true);
    try {
      await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disabled: link.disabled ? false : true }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  }

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-slate-400 text-base mb-4">This link doesn&apos;t exist or you don&apos;t have access to it.</p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-brand-300 text-sm font-semibold hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  if (!link || !analytics) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center text-slate-500 text-sm">
        Loading analytics data...
      </div>
    );
  }

  const shortUrl = typeof window !== "undefined" ? `${window.location.origin}/${link.slug}` : `/${link.slug}`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Back Breadcrumb */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-brand-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl sm:text-3xl font-bold text-white">/{link.slug}</h1>
            {link.disabled === 1 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-medium border border-slate-700">
                Disabled
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-300 text-xs font-medium border border-brand-500/20">
                Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            Created on {new Date(link.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CopyButton text={shortUrl} label="Copy Short Link" />
          <button
            onClick={toggleDisabled}
            disabled={busy}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              link.disabled
                ? "bg-brand-500/10 border-brand-500/30 text-brand-300 hover:bg-brand-500/20"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:text-rose-400 hover:border-rose-500/30"
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{link.disabled ? "Enable Link" : "Disable Link"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Destination URL Card */}
          <section className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Destination URL</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit URL</span>
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={saveDestination} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    value={destInput}
                    onChange={(e) => setDestInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500/60"
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setDestInput(link.destination_url);
                      setSaveError(null);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {saveError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {saveError}
                  </p>
                )}
              </form>
            ) : (
              <a
                href={link.destination_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-mono text-slate-200 hover:text-brand-300 break-all flex items-center gap-1.5 group"
              >
                <span>{link.destination_url}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-400 shrink-0" />
              </a>
            )}
          </section>

          {/* Clicks Analytics Chart Card */}
          <section className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Clicks (30 Days)</h2>
                <p className="text-3xl font-extrabold font-mono text-white mt-1">{analytics.totalClicks}</p>
              </div>
              <span className="text-xs text-slate-500">Daily breakdown</span>
            </div>
            <ClicksChart data={analytics.clicksByDay} />
          </section>

          {/* Breakdown Stat Lists */}
          <div className="grid sm:grid-cols-2 gap-6">
            <StatCard
              title="Top Referrers"
              icon={<Globe className="w-4 h-4 text-brand-400" />}
              rows={analytics.topReferrers.map((r) => [r.referer_host, r.clicks])}
              totalClicks={analytics.totalClicks}
            />
            <StatCard
              title="Top Countries"
              icon={<Globe className="w-4 h-4 text-accent-cyan" />}
              rows={analytics.topCountries.map((r) => [r.country, r.clicks])}
              totalClicks={analytics.totalClicks}
            />
          </div>

          <StatCard
            title="Device Breakdown"
            icon={<Smartphone className="w-4 h-4 text-accent-amber" />}
            rows={analytics.deviceBreakdown.map((r) => [capitalize(r.device), r.clicks])}
            totalClicks={analytics.totalClicks}
          />
        </div>

        {/* Sidebar: QR Code */}
        <div className="space-y-6">
          <section className="glass-card p-6 rounded-2xl border border-slate-800 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400 mb-3">
              <QrCode className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-semibold text-slate-200 mb-1">QR Code</h2>
            <p className="text-xs text-slate-400 mb-4">Scan or download for print & digital marketing.</p>

            <div className="p-3 bg-white rounded-xl shadow-2xl border border-slate-700 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/links/${link.id}/qr`}
                alt={`QR code for ${shortUrl}`}
                width={180}
                height={180}
                className="rounded-lg"
              />
            </div>

            <a
              href={`/api/links/${link.id}/qr`}
              download={`${link.slug}-qr.png`}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-brand-400" />
              <span>Download High-Res PNG</span>
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  icon,
  rows,
  totalClicks,
}: {
  title: string;
  icon: React.ReactNode;
  rows: [string, number][];
  totalClicks: number;
}) {
  return (
    <section className="glass-card p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">{title}</h2>
      </div>
      {rows.length === 0 ? (
        <p className="text-xs text-slate-500 py-2">No traffic data captured yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map(([label, clicks]) => {
            const pct = totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0;
            return (
              <div key={label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium truncate max-w-[180px]">{label}</span>
                  <span className="font-mono text-slate-400">{clicks} ({pct}%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full"
                    style={{ width: `${Math.max(5, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
