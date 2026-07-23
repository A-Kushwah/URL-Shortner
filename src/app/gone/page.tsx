import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function GonePage({ searchParams }: { searchParams: { slug?: string } }) {
  return (
    <div className="max-w-xl mx-auto px-6 py-24 text-center">
      <div className="glass-card p-10 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5">
          <AlertTriangle className="w-7 h-7" />
        </div>

        {searchParams.slug && (
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono font-semibold text-brand-300 mb-3">
            /{searchParams.slug}
          </span>
        )}

        <h1 className="text-2xl font-bold text-white mb-2">Link Unavailable</h1>
        <p className="text-slate-400 text-xs leading-relaxed max-w-sm mb-8">
          This short link has been disabled by its owner, expired, or does not exist. If you think this is a mistake, verify the URL with whoever shared it.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-brand-400" />
          <span>Back to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
