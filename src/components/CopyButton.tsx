"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  }

  return (
    <button
      onClick={copy}
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm ${
        copied
          ? "bg-brand-500/20 text-brand-300 border border-brand-500/40"
          : "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 hover:border-slate-600"
      }`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-brand-400 animate-in zoom-in" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-400" />
          <span>{label ?? "Copy"}</span>
        </>
      )}
    </button>
  );
}
