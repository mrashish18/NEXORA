import { BrainCircuit, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

export default function AISummary() {
  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-blue-500/10 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">
            Procurement Intelligence
          </p>
          <h3 className="mt-1 text-2xl font-bold text-white">AI Procurement Analysis</h3>
        </div>
        <div className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-400">
          <BrainCircuit size={28} />
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-start gap-3 rounded-2xl bg-slate-800/60 p-4 border border-white/5">
          <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-white text-sm">Quotation Benchmark</h4>
            <p className="text-xs text-slate-400 mt-1">
              Current quotation is 4.2% below regional market averages for Grade 60 steel.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-slate-800/60 p-4 border border-white/5">
          <TrendingUp className="text-cyan-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-white text-sm">Lead Time Forecast</h4>
            <p className="text-xs text-slate-400 mt-1">
              Supplier has historically delivered 98% of orders within 5 calendar days.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-slate-800/60 p-4 border border-white/5">
          <AlertTriangle className="text-yellow-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-white text-sm">Risk Assessment</h4>
            <p className="text-xs text-slate-400 mt-1">
              Weather disruptions along western corridor may add minor transit risk (+1 day).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
