import ShortenForm from "@/components/ShortenForm";

export default function HomePage() {
  return (
    <div>
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="font-mono text-sm text-moss mb-4 tracking-wide">tiny links, simple stats</p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] max-w-2xl">
          Short links that still feel <span className="italic text-moss">useful</span>.
        </h1>
        <p className="mt-5 text-lg text-ink/70 max-w-xl">
          Paste a long URL, get a shorter one back, and keep the whole thing simple.
          No weird extra steps, no nonsense on the destination page.
        </p>

        <div className="mt-10">
          <ShortenForm />
        </div>
      </section>

      <section className="border-t border-line bg-white/50">
        <div className="max-w-5xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-10">
          <Feature
            eyebrow="Fast"
            title="Quick enough for daily use"
            body="Paste a URL, shorten it, and move on. The account is there if you want it, not something you have to deal with first."
          />
          <Feature
            eyebrow="Helpful"
            title="Basic click stats"
            body="You can see how many times a link got used and get a quick sense of where the traffic is coming from."
          />
          <Feature
            eyebrow="Simple"
            title="Nothing flashy"
            body="No popups, no ad traps, and no extra junk. Just a short link and the basic info around it."
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
