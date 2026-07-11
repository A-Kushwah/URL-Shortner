"use client";

import { useState } from "react";

export default function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard API can fail on non-HTTPS/local contexts; fail silently.
    }
  }

  return (
    <button
      onClick={copy}
      className="px-3 py-1.5 rounded-sm bg-moss text-paper text-sm font-medium hover:bg-mossLight transition-colors whitespace-nowrap"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
