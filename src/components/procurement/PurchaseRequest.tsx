import {
  Building2,
  CalendarDays,
  IndianRupee,
  Package,
  Flag,
  CheckCircle2,
} from "lucide-react";

export default function PurchaseRequest() {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="uppercase tracking-[0.3em] text-cyan-400 text-sm">
            Purchase Request
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            PR-2026-1048
          </h2>

        </div>

        <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-400">
          Pending Approval
        </span>

      </div>

      {/* Information */}

      <div className="mt-8 grid gap-5">

        <div className="flex items-center gap-4 rounded-2xl bg-slate-800/70 p-5">

          <Building2 className="text-cyan-400" />

          <div>

            <p className="text-sm text-slate-400">
              Project
            </p>

            <h3 className="font-semibold text-white">
              Metro Line Phase-II
            </h3>

          </div>

        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-slate-800/70 p-5">

          <Package className="text-cyan-400" />

          <div>

            <p className="text-sm text-slate-400">
              Material
            </p>

            <h3 className="font-semibold text-white">
              Steel Beams (500 Units)
            </h3>

          </div>

        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-slate-800/70 p-5">

          <IndianRupee className="text-green-400" />

          <div>

            <p className="text-sm text-slate-400">
              Budget
            </p>

            <h3 className="font-semibold text-green-400">
              ₹42,00,000
            </h3>

          </div>

        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-slate-800/70 p-5">

          <CalendarDays className="text-blue-400" />

          <div>

            <p className="text-sm text-slate-400">
              Delivery Deadline
            </p>

            <h3 className="font-semibold text-white">
              18 July 2026
            </h3>

          </div>

        </div>

        <div className="flex items-center gap-4 rounded-2xl bg-slate-800/70 p-5">

          <Flag className="text-red-400" />

          <div>

            <p className="text-sm text-slate-400">
              Priority
            </p>

            <h3 className="font-semibold text-red-400">
              HIGH
            </h3>

          </div>

        </div>

      </div>

      {/* AI Summary */}

      <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-6">

        <div className="flex items-center gap-3">

          <CheckCircle2
            className="text-cyan-400"
            size={22}
          />

          <h3 className="font-bold text-white">
            AI Procurement Summary
          </h3>

        </div>

        <p className="mt-4 leading-8 text-slate-300">

          Purchase request has passed validation.

          Budget is within project limits.

          Material quantity is available from
          multiple approved vendors.

          No duplicate purchase requests detected.

        </p>

      </div>

    </div>
  );
}