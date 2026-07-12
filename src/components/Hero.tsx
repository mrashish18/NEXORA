import {
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
  Boxes,
  Truck,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      {/* Grid Background */}

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Glow */}

      <div className="absolute left-20 top-20 h-96 w-96 rounded-full bg-cyan-500/20 blur-[140px]" />

      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-violet-600/20 blur-[160px]" />

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-20 px-8 pt-32 lg:grid-cols-2">

        {/* LEFT */}

        <div>

          <div className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-300">
            🚀 Built for Kaya AI India Hackathon 2026
          </div>

          <h1 className="mt-10 text-7xl font-black leading-tight tracking-tight">

            Building the Future of

            <br />

            <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 bg-clip-text text-transparent">
              AI Construction Intelligence
            </span>

          </h1>

          <p className="mt-10 max-w-xl text-xl leading-9 text-slate-300">

            NEXORA transforms procurement documents, logistics,
            vendor data and project schedules into real-time AI
            insights that help construction companies predict
            delays, reduce costs and deliver projects faster.

          </p>

          <div className="mt-12 flex gap-5">

            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold shadow-lg shadow-cyan-500/30 transition duration-300 hover:scale-105">

              Try Demo

              <ArrowRight size={18} />

            </button>

            <button className="rounded-xl border border-white/20 px-8 py-4 transition hover:bg-white/10">

              View Dashboard

            </button>

          </div>

          <div className="mt-16 grid grid-cols-3 gap-8">

            <div>

              <h2 className="text-4xl font-bold text-cyan-400">
                500+
              </h2>

              <p className="text-slate-400">
                Projects
              </p>

            </div>

            <div>

              <h2 className="text-4xl font-bold text-cyan-400">
                1200+
              </h2>

              <p className="text-slate-400">
                Vendors
              </p>

            </div>

            <div>

              <h2 className="text-4xl font-bold text-cyan-400">
                98%
              </h2>

              <p className="text-slate-400">
                AI Accuracy
              </p>

            </div>

          </div>

          <div className="mt-12 flex flex-wrap gap-8 text-slate-300">

            <div className="flex items-center gap-2">

              <BrainCircuit className="text-cyan-400" />

              AI Intelligence

            </div>

            <div className="flex items-center gap-2">

              <ShieldCheck className="text-green-400" />

              Enterprise Ready

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="relative">

          <div className="absolute h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />

          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">

            <h2 className="mb-8 text-2xl font-bold">
              Supply Chain Overview
            </h2>

            <div className="grid grid-cols-2 gap-5">

              <Card title="Orders" value="1,248" icon={<Boxes />} />

              <Card title="Delayed" value="23" color="text-red-400" icon={<Truck />} />

              <Card title="On-Time" value="92%" color="text-green-400" icon={<ShieldCheck />} />

              <Card title="Risk" value="LOW" color="text-yellow-400" icon={<BrainCircuit />} />

            </div>

            <div className="mt-8 rounded-2xl bg-slate-800/60 p-6">

              <p className="text-sm text-slate-400">
                AI Recommendation
              </p>

              <p className="mt-3 leading-8">

                Steel shipment is predicted to arrive
                3 days late.

                AI recommends switching to
                BuildMax Steel Ltd to maintain
                project schedule.

              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

function Card({
  title,
  value,
  color = "text-white",
  icon,
}: {
  title: string;
  value: string;
  color?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-800/60 p-6">

      <div className="mb-4 text-cyan-400">
        {icon}
      </div>

      <p className="text-slate-400">
        {title}
      </p>

      <h2 className={`mt-3 text-4xl font-bold ${color}`}>
        {value}
      </h2>

    </div>
  );
}