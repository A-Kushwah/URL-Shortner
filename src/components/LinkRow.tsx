"use client";

import Link from "next/link";
import { useState } from "react";
import CopyButton from "./CopyButton";
import type { DashboardLink } from "./Dashboard";

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
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/${link.id}`} className="font-mono text-moss hover:underline truncate">
            /{link.slug}
          </Link>
          {link.disabled === 1 && (
            <span className="text-xs px-1.5 py-0.5 rounded-sm bg-sand text-ink/60 border border-line">
              Disabled
            </span>
          )}
        </div>
        <p className="text-sm text-ink/55 truncate">{link.destination_url}</p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-sm text-right">
          <p className="font-medium">{link.total_clicks}</p>
          <p className="text-ink/45 text-xs">clicks</p>
        </div>
        <CopyButton text={shortUrl} />
        <Link
          href={`/dashboard/${link.id}`}
          className="px-3 py-1.5 rounded-sm border border-line text-sm hover:border-moss hover:text-moss transition-colors"
        >
          Open
        </Link>
        <button
          onClick={toggleDisabled}
          disabled={busy}
          className="px-3 py-1.5 rounded-sm border border-line text-sm hover:border-amberDeep hover:text-amberDeep transition-colors disabled:opacity-50"
        >
          {link.disabled ? "Enable" : "Disable"}
        </button>
      </div>
    </div>
  );
}
