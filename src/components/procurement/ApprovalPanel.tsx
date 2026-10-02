import { useState } from "react";
import { CheckCircle2, XCircle, FileSpreadsheet, ShieldCheck } from "lucide-react";

export default function ApprovalPanel() {
  const [decision, setDecision] = useState<"pending" | "approved" | "rejected">("pending");

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">
            Workflow Governance
          </p>
          <h3 className="mt-1 text-2xl font-bold text-white">Purchase Order Approvals</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            decision === "approved"
              ? "bg-green-500/20 text-green-400"
              : decision === "rejected"
              ? "bg-red-500/20 text-red-400"
              : "bg-cyan-500/20 text-cyan-400"
          }`}
        >
          {decision === "approved"
            ? "Approved"
            : decision === "rejected"
            ? "Rejected"
            : "Review In Progress"}
        </span>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-800/60 p-4 border border-white/5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-cyan-400" />
            PO Document:
          </span>
          <span className="font-mono text-white">PO-2026-1048.pdf</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-400" />
            Compliance Check:
          </span>
          <span className="text-green-400 font-medium">Passed (100%)</span>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setDecision("approved")}
          disabled={decision === "approved"}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-600 disabled:opacity-50"
        >
          <CheckCircle2 size={16} />
          Approve PO
        </button>

        <button
          onClick={() => setDecision("rejected")}
          disabled={decision === "rejected"}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
        >
          <XCircle size={16} />
          Reject PO
        </button>
      </div>
    </div>
  );
}
