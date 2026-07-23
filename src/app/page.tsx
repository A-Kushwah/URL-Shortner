import ShortenForm from "@/components/ShortenForm";
import { Zap, BarChart3, ShieldCheck, QrCode, Sparkles, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 sm:pt-24 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-8 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
          <span>Fast, Privacy-Focused & Simple</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-[1.15]">
          Short links that look <span className="gradient-text-emerald">professional</span> & perform fast.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Transform long, messy URLs into clean, memorable short links. Track real-time click stats, download QR codes, and keep your links organized.
        </p>

        {/* Shorten Form Widget */}
        <div className="mt-12">
          <ShortenForm />
        </div>

        {/* Stats highlight strip */}
        <div className="mt-16 pt-10 border-t border-slate-800/60 max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl sm:text-2xl font-bold font-mono text-white">Instant</p>
            <p className="text-xs text-slate-500 mt-1">Shortening Speed</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold font-mono text-brand-400">100% Free</p>
            <p className="text-xs text-slate-500 mt-1">No Paywalls</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold font-mono text-white">Clean</p>
            <p className="text-xs text-slate-500 mt-1">No Ad Interstitials</p>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="border-t border-slate-800/80 bg-slate-950/40 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Everything you need in a modern link shortener
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Built with clean code and no unnecessary fluff.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Zap className="w-5 h-5 text-brand-400" />}
              title="Lightning Fast"
              body="Sub-millisecond SQLite lookup ensures instant redirects without delay."
            />
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5 text-accent-cyan" />}
              title="Click Analytics"
              body="Track referrers, device types, and geographic origins in clear charts."
            />
            <FeatureCard
              icon={<QrCode className="w-5 h-5 text-accent-amber" />}
              title="QR Code Generation"
              body="Generate high-resolution PNG QR codes for print or digital sharing."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-5 h-5 text-accent-violet" />}
              title="Security & Safety"
              body="Automatic protocol validation and malware host checking built right in."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between">
      <div>
        <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-slate-100 text-base mb-2">{title}</h3>
        <p className="text-slate-400 text-xs leading-relaxed">{body}</p>
      </div>
    </div>
  );
}
