import {
  BrainCircuit,
  BadgeCheck,
  TrendingUp,
  Truck,
  IndianRupee,
  ArrowRight,
} from "lucide-react";

export default function AIRecommendation() {
  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-blue-500/10 p-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-widest text-cyan-400">
            AI Decision Engine
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Smart Recommendation
          </h2>

        </div>

        <div className="rounded-2xl bg-cyan-500/20 p-4">
          <BrainCircuit
            size={32}
            className="text-cyan-400"
          />
        </div>

      </div>

      {/* Recommendation */}

      <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-6">

        <div className="flex items-center gap-3">

          <BadgeCheck
            className="text-green-400"
            size={24}
          />

          <h3 className="text-xl font-bold text-green-400">
            AI Recommendation
          </h3>

        </div>

        <p className="mt-5 text-lg leading-8 text-slate-300">

          This Purchase Order can be

          <span className="font-bold text-green-400">
            {" "}Approved
          </span>

          because no procurement anomalies,
          duplicate invoices,
          missing clauses,
          pricing issues,
          or delivery conflicts were detected.

        </p>

      </div>

      {/* Metrics */}

      <div className="mt-8 grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl bg-slate-800/70 p-5">

          <TrendingUp
            className="text-cyan-400"
            size={24}
          />

          <p className="mt-4 text-sm text-slate-400">
            Optimization Score
          </p>

          <h3 className="mt-2 text-3xl font-bold text-white">
            96%
          </h3>

        </div>

        <div className="rounded-2xl bg-slate-800/70 p-5">

          <IndianRupee
            className="text-green-400"
            size={24}
          />

          <p className="mt-4 text-sm text-slate-400">
            Estimated Savings
          </p>

          <h3 className="mt-2 text-3xl font-bold text-green-400">
            ₹24K
          </h3>

        </div>

        <div className="rounded-2xl bg-slate-800/70 p-5">

          <Truck
            className="text-blue-400"
            size={24}
          />

          <p className="mt-4 text-sm text-slate-400">
            Delivery ETA
          </p>

          <h3 className="mt-2 text-3xl font-bold text-white">
            18 Jul
          </h3>

        </div>

      </div>

      {/* Alternate Vendor */}

      <div className="mt-8 rounded-2xl border border-white/10 bg-slate-800/70 p-6">

        <h3 className="font-semibold text-white">
          Suggested Backup Vendor
        </h3>

        <div className="mt-5 flex items-center justify-between">

          <div>

            <h4 className="text-xl font-bold text-cyan-400">
              BuildMax Steel Ltd.
            </h4>

            <p className="mt-2 text-slate-400">
              98% On-Time Delivery • 4.9★ Rating
            </p>

          </div>

          <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-600">

            View Vendor

            <ArrowRight size={18} />

          </button>

        </div>

      </div>

      {/* Action Buttons */}

      <div className="mt-10 flex flex-wrap gap-4">

        <button className="rounded-xl bg-green-500 px-8 py-4 font-semibold text-white transition hover:bg-green-600">
          Approve Purchase Order
        </button>

        <button className="rounded-xl border border-cyan-500 px-8 py-4 font-semibold text-cyan-400 transition hover:bg-cyan-500 hover:text-white">
          Generate AI Report
        </button>

        <button className="rounded-xl border border-white/10 px-8 py-4 font-semibold text-slate-300 transition hover:border-white">
          Download JSON
        </button>

      </div>

    </section>
  );
}