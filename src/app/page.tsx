import ShortenForm from "@/components/ShortenForm";

export default function HomePage() {
  return (
    <div>
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="font-mono text-sm text-moss mb-4 tracking-wide">shorten → share → measure</p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] max-w-2xl">
          Short links, <span className="italic text-moss">honest</span> analytics.
        </h1>
        <p className="mt-5 text-lg text-ink/70 max-w-xl">
          Paste a long URL, get a short one back in seconds. No account, no ads on
          your destination page, and no selling of click data — ever.
        </p>

        <div className="mt-10">
          <ShortenForm />
        </div>
      </section>

      <section className="border-t border-line bg-white/50">
        <div className="max-w-5xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-10">
          <Feature
            eyebrow="Instant"
            title="Under 2 seconds"
            body="Paste, shorten, share. No sign-up gate on the core action — the account is optional, not required."
          />
          <Feature
            eyebrow="Visible"
            title="Real click analytics"
            body="Total clicks, a 30-day trend, top referrers, top countries, and device breakdown — free, on every link you own."
          />
          <Feature
            eyebrow="Respectful"
            title="No dark patterns"
            body="No interstitial ads on redirects, no click-data resale, and links keep working long after you make them."
          />
        </div>
      </section>
    </div>
  );
}

function Feature({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-amberDeep mb-2">{eyebrow}</p>
      <h3 className="font-display text-xl mb-2">{title}</h3>
      <p className="text-sm text-ink/65 leading-relaxed">{body}</p>
    </div>
  );
}
