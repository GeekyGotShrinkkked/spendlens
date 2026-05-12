import SpendForm from "@/components/SpendForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080810] text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-teal-500/8 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] rounded-full bg-emerald-600/8 blur-[120px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <div className="relative z-10 px-8 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <img
            src="https://www.svgrepo.com/show/455629/magnifying-glass-money.svg"
            alt="SpendLens logo"
            className="w-8 h-8 invert"
          />
          <span className="font-bold text-white tracking-tight text-lg">
            SpendLens
          </span>
        </div>
        <span className="text-xs text-white/30 border border-white/10 rounded-full px-3 py-1">
          Free audit tool by Credex
        </span>
      </div>

      {/* Hero */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-16 pb-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-xs font-medium tracking-wide">
            FREE — No signup required
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
          Are you{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #34d399, #059669, #34d399)",
            }}
          >
            overpaying
          </span>
          <br />
          for AI tools?
        </h1>

        <p className="text-white/50 text-lg mb-3 leading-relaxed">
          Enter your AI subscriptions. Get an instant audit showing exactly
          where you&apos;re wasting money and what to do about it.
        </p>

        {/* Social proof */}
        <div className="flex items-center justify-center gap-6 mb-12 text-sm text-white/30">
          <span>⚡ Instant results</span>
          <span>•</span>
          <span>🔒 No login needed</span>
          <span>•</span>
          <span>💰 100% free</span>
        </div>
      </div>

      {/* Form */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 pb-20">
        <SpendForm />
      </div>
    </main>
  );
}
