"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CopyButton from "./CopyButton";
import ClicksChart from "./ClicksChart";

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

export default function LinkDetail({ linkId }: { linkId: string }) {
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
        setSaveError(data.error ?? "Couldn't save.");
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
      <div>
        <p className="text-ink/60">This link doesn&apos;t exist or isn&apos;t yours.</p>
        <Link href="/dashboard" className="text-moss underline underline-offset-2 text-sm">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!link || !analytics) {
    return <p className="text-ink/50 text-sm">Loading…</p>;
  }

  const shortUrl = typeof window !== "undefined" ? `${window.location.origin}/${link.slug}` : `/${link.slug}`;

  return (
    <div>
      <Link href="/dashboard" className="text-sm text-ink/50 hover:text-moss">
        ← Back to dashboard
      </Link>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-2xl text-moss">/{link.slug}</h1>
            {link.disabled === 1 && (
              <span className="text-xs px-1.5 py-0.5 rounded-sm bg-sand text-ink/60 border border-line">
                Disabled
              </span>
            )}
          </div>
          <p className="text-ink/50 text-sm mt-1">Created {new Date(link.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={shortUrl} label="Copy short link" />
          <button
            onClick={toggleDisabled}
            disabled={busy}
            className="px-3 py-1.5 rounded-sm border border-line text-sm hover:border-amberDeep hover:text-amberDeep transition-colors disabled:opacity-50"
          >
            {link.disabled ? "Enable link" : "Disable link"}
          </button>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="border border-line rounded-md bg-white/40 p-5">
            <h2 className="text-sm font-medium text-ink/70 mb-3">Destination</h2>
            {editing ? (
              <form onSubmit={saveDestination} className="flex flex-col sm:flex-row gap-2">
                <input
                  value={destInput}
                  onChange={(e) => setDestInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-sm border border-line bg-white outline-none text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-3 py-2 rounded-sm bg-moss text-paper text-sm hover:bg-mossLight transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setDestInput(link.destination_url);
                      setSaveError(null);
                    }}
                    className="px-3 py-2 rounded-sm border border-line text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-ink/75 break-all">{link.destination_url}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="shrink-0 px-3 py-1.5 rounded-sm border border-line text-sm hover:border-moss hover:text-moss transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
            {saveError && <p className="text-sm text-red-700 mt-2">{saveError}</p>}
          </section>

          <section className="border border-line rounded-md bg-white/40 p-5">
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="text-sm font-medium text-ink/70">Clicks, last 30 days</h2>
              <p className="font-display text-2xl">{analytics.totalClicks}</p>
            </div>
            <ClicksChart data={analytics.clicksByDay} />
          </section>

          <div className="grid sm:grid-cols-2 gap-8">
            <StatList title="Top referrers" rows={analytics.topReferrers.map((r) => [r.referer_host, r.clicks])} />
            <StatList title="Top countries" rows={analytics.topCountries.map((r) => [r.country, r.clicks])} />
          </div>
          <StatList
            title="Devices"
            rows={analytics.deviceBreakdown.map((r) => [capitalize(r.device), r.clicks])}
          />
        </div>

        <div className="space-y-4">
          <section className="border border-line rounded-md bg-white/40 p-5 text-center">
            <h2 className="text-sm font-medium text-ink/70 mb-3">QR code</h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/links/${link.id}/qr`}
              alt={`QR code for ${shortUrl}`}
              className="mx-auto rounded-sm border border-line"
              width={200}
              height={200}
            />
            <a
              href={`/api/links/${link.id}/qr`}
              download={`${link.slug}-qr.png`}
              className="inline-block mt-3 px-3 py-1.5 rounded-sm border border-line text-sm hover:border-moss hover:text-moss transition-colors"
            >
              Download PNG
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatList({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <section className="border border-line rounded-md bg-white/40 p-5">
      <h2 className="text-sm font-medium text-ink/70 mb-3">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-sm text-ink/40">No data yet.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map(([label, clicks]) => (
            <li key={label} className="flex items-center justify-between text-sm">
              <span className="text-ink/75 truncate">{label}</span>
              <span className="font-mono text-ink/50">{clicks}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
