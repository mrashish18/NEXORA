import { useState } from "react";
import {
  BrainCircuit,
  BadgeCheck,
  TrendingUp,
  Truck,
  IndianRupee,
  ArrowRight,
  Download,
  FileCheck2,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AIRecommendation() {
  const navigate = useNavigate();
  const [poStatus, setPoStatus] = useState<"pending" | "approved">("pending");

  const recommendationData = {
    po_number: "PO-2026-1048",
    decision: "Approved",
    confidence_score: "96%",
    estimated_savings: "₹24,000",
    delivery_eta: "18 Jul 2026",
    suggested_backup_vendor: {
      name: "BuildMax Steel Ltd.",
      on_time_delivery: "98%",
      rating: 4.9,
    },
    risk_assessment: {
      anomalies_detected: false,
      duplicate_invoices: false,
      missing_clauses: false,
      pricing_issues: false,
      delivery_conflicts: false,
    },
  };

  const handleDownloadJson = () => {
    const jsonBlob = new Blob([JSON.stringify(recommendationData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexora-ai-recommendation-PO2045.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-blue-500/10 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-cyan-400 font-semibold">
            AI Decision Engine
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Smart Recommendation
          </h2>
        </div>

        <div className="rounded-2xl bg-cyan-500/20 p-4">
          <BrainCircuit size={32} className="text-cyan-400" />
        </div>
      </div>

      {/* Recommendation Card */}
      <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <BadgeCheck className="text-green-400" size={24} />
            <h3 className="text-xl font-bold text-green-400">
              AI Recommendation
            </h3>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
              poStatus === "approved"
                ? "bg-green-500 text-white"
                : "bg-green-500/20 text-green-300"
            }`}
          >
            {poStatus === "approved" ? "Approved by User" : "Ready For Approval"}
          </span>
        </div>

        <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
          This Purchase Order can be{" "}
          <span className="font-bold text-green-400">
            {poStatus === "approved" ? "Approved & Processed" : "Approved"}
          </span>{" "}
          because no procurement anomalies, duplicate invoices, missing clauses,
          pricing issues, or delivery conflicts were detected.
        </p>
      </div>

      {/* Metrics */}
      <div className="mt-8 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-800/70 p-5">
          <TrendingUp className="text-cyan-400" size={24} />
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Optimization Score
          </p>
          <h3 className="mt-1 text-2xl sm:text-3xl font-bold text-white">
            96%
          </h3>
        </div>

        <div className="rounded-2xl bg-slate-800/70 p-5">
          <IndianRupee className="text-green-400" size={24} />
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Estimated Savings
          </p>
          <h3 className="mt-1 text-2xl sm:text-3xl font-bold text-green-400">
            ₹24K
          </h3>
        </div>

        <div className="rounded-2xl bg-slate-800/70 p-5">
          <Truck className="text-blue-400" size={24} />
          <p className="mt-3 text-xs sm:text-sm text-slate-400">
            Delivery ETA
          </p>
          <h3 className="mt-1 text-2xl sm:text-3xl font-bold text-white">
            18 Jul
          </h3>
        </div>
      </div>

      {/* Alternate Vendor */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-slate-800/70 p-6">
        <h3 className="font-semibold text-white">Suggested Backup Vendor</h3>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-xl font-bold text-cyan-400">
              BuildMax Steel Ltd.
            </h4>
            <p className="mt-1 text-sm text-slate-400">
              98% On-Time Delivery • 4.9★ Rating
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/vendors")}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 font-semibold text-white transition hover:bg-cyan-600 active:scale-95 text-sm"
          >
            <span>View Vendor</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-3.5">
        <button
          type="button"
          onClick={() => setPoStatus("approved")}
          disabled={poStatus === "approved"}
          className="flex-1 min-w-[200px] flex items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3.5 font-semibold text-white transition hover:bg-green-600 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
        >
          <FileCheck2 size={18} />
          <span>{poStatus === "approved" ? "PO Approved" : "Approve Purchase Order"}</span>
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/assistant?prompt=${encodeURIComponent(
                "Generate a detailed procurement audit report for Purchase Order PO-2045 including risk mitigation and cost analysis"
              )}`
            )
          }
          className="flex-1 min-w-[180px] flex items-center justify-center gap-2 rounded-xl border border-cyan-500 px-6 py-3.5 font-semibold text-cyan-400 transition hover:bg-cyan-500 hover:text-white active:scale-95"
        >
          <Sparkles size={18} />
          <span>Generate AI Report</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadJson}
          className="flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 font-semibold text-slate-300 transition hover:border-cyan-500 hover:text-white active:scale-95 bg-slate-800/40"
        >
          <Download size={18} />
          <span>Download JSON</span>
        </button>
      </div>
    </section>
  );
}