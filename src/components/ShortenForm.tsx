"use client";

import { useState } from "react";
import CopyButton from "./CopyButton";
import { Link2, ArrowRight, Loader2, QrCode, AlertCircle, Sparkles, ExternalLink } from "lucide-react";

interface Result {
  shortUrl: string;
  slug: string;
  id: string;
}

export default function LinkShortener() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQr, setShowQr] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setShowQr(false);
    setLoading(true);

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
        setError(data.error ?? "That didn’t work. Please check the URL.");
      } else {
        setResult(data);
        setUrl("");
      }
    } catch {
      setError("Server error. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-card p-2 sm:p-3 rounded-2xl shadow-2xl relative overflow-hidden group">
        {/* Subtle accent top border glow */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 flex items-center">
            <Link2 className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste long URL (e.g. https://github.com/a-kushwah)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 text-sm font-sans transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 font-semibold text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Shortening...</span>
              </>
            ) : (
              <>
                <span>Shorten URL</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="mt-6 glass-card rounded-2xl p-6 relative overflow-hidden border border-brand-500/30 animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-emerald-400 to-accent-cyan" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-300 text-[11px] font-medium border border-brand-500/20">
                  <Sparkles className="w-3 h-3 text-brand-400" /> Ready to share
                </span>
              </div>
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xl sm:text-2xl font-semibold text-white hover:text-brand-300 transition-colors flex items-center gap-2 group truncate"
              >
                <span>{result.shortUrl}</span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand-400 shrink-0" />
              </a>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <CopyButton text={result.shortUrl} label="Copy Link" />
              <button
                onClick={() => setShowQr(!showQr)}
                className={`p-2 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 ${
                  showQr
                    ? "bg-brand-500/20 border-brand-500/40 text-brand-300"
                    : "bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <QrCode className="w-4 h-4 text-brand-400" />
                <span>QR Code</span>
              </button>
            </div>
          </div>

          {/* Expanded QR Code preview */}
          {showQr && (
            <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col items-center justify-center animate-in fade-in slide-in-from-top-3">
              <div className="p-3 bg-white rounded-xl shadow-xl border border-slate-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/links/${result.id}/qr`}
                  alt={`QR code for ${result.shortUrl}`}
                  width={160}
                  height={160}
                  className="rounded-lg"
                />
              </div>
              <a
                href={`/api/links/${result.id}/qr`}
                download={`${result.slug}-qr.png`}
                className="mt-3 text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 hover:underline"
              >
                Download PNG QR Code
              </a>
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-slate-800/60 text-xs text-slate-400 flex items-center justify-between">
            <span>Anyone with this link can access it.</span>
            <a href="/signup" className="text-brand-400 hover:text-brand-300 font-semibold hover:underline">
              Track clicks & stats →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
