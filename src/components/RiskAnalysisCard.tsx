import {
  ShieldAlert,
  Truck,
  IndianRupee,
  Clock3,
  CheckCircle2,
  TriangleAlert,
} from "lucide-react";

const risks = [
  {
    title: "Overall Risk",
    value: "LOW",
    color: "text-green-400",
    icon: <ShieldAlert size={20} />,
  },
  {
    title: "Delay Probability",
    value: "12%",
    color: "text-yellow-400",
    icon: <Truck size={20} />,
  },
  {
    title: "Cost Overrun",
    value: "8%",
    color: "text-cyan-400",
    icon: <IndianRupee size={20} />,
  },
  {
    title: "Vendor Reliability",
    value: "96%",
    color: "text-green-400",
    icon: <CheckCircle2 size={20} />,
  },
];

export default function RiskAnalysisCard() {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-widest text-cyan-400">
            AI Risk Analysis
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Procurement Risk Engine
          </h2>

        </div>

        <TriangleAlert
          size={32}
          className="text-yellow-400"
        />

      </div>

      {/* Grid */}

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        {risks.map((risk) => (

          <div
            key={risk.title}
            className="
              rounded-2xl
              border
              border-white/10
              bg-slate-800/60
              p-5
              transition
              hover:border-cyan-500/30
            "
          >

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                {risk.icon}
              </div>

              <div>

                <p className="text-sm text-slate-400">
                  {risk.title}
                </p>

                <h3 className={`mt-1 text-xl font-bold ${risk.color}`}>
                  {risk.value}
                </h3>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* Timeline */}

      <div className="mt-8 rounded-2xl bg-slate-800/60 p-6">

        <div className="flex items-center gap-3">

          <Clock3
            size={22}
            className="text-cyan-400"
          />

          <h3 className="text-lg font-semibold text-white">
            Predicted Delivery Timeline
          </h3>

        </div>

        <div className="mt-6">

          <div className="flex justify-between text-sm text-slate-400">

            <span>Today</span>

            <span>18 Jul</span>

            <span>25 Jul</span>

          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-700">

            <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500"></div>

          </div>

          <p className="mt-4 text-slate-300">
            Estimated on-time delivery probability:
            <span className="ml-2 font-semibold text-green-400">
              88%
            </span>
          </p>

        </div>

      </div>

      {/* AI Summary */}

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">

        <h3 className="font-bold text-cyan-300">
          AI Summary
        </h3>

        <p className="mt-4 leading-8 text-slate-300">

          Procurement risk is currently
          <span className="font-semibold text-green-400">
            {" "}LOW
          </span>.

          The selected vendor has maintained
          <span className="font-semibold text-white">
            {" "}96% on-time deliveries
          </span>
          over the past year.

          No duplicate purchase orders or missing fields were detected.

          Delivery is expected on schedule with minimal risk.

        </p>

      </div>

    </section>
  );
}