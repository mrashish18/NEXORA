import {
  FileText,
  FileSpreadsheet,
  ScrollText,
  CheckCircle2,
} from "lucide-react";

const documents = [
  {
    icon: <FileSpreadsheet size={22} />,
    name: "Purchase_Order_2045.pdf",
    type: "Purchase Order",
    status: "Processed",
    time: "2 min ago",
  },
  {
    icon: <ScrollText size={22} />,
    name: "Vendor_Contract.pdf",
    type: "Contract",
    status: "AI Reviewed",
    time: "15 min ago",
  },
  {
    icon: <FileText size={22} />,
    name: "Steel_Invoice.pdf",
    type: "Invoice",
    status: "Verified",
    time: "34 min ago",
  },
  {
    icon: <FileSpreadsheet size={22} />,
    name: "Material_Schedule.xlsx",
    type: "Schedule",
    status: "Uploaded",
    time: "1 hour ago",
  },
];

export default function DocumentList() {
  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-6
        backdrop-blur-xl
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wider text-slate-400">
            Recent Documents
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            AI Document Center
          </h2>
        </div>

        <span className="rounded-full bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-400">
          Live
        </span>
      </div>

      {/* Document List */}

      <div className="mt-8 space-y-4">

        {documents.map((doc) => (
          <div
            key={doc.name}
            className="
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-white/5
              bg-slate-900/60
              p-4
              transition-all
              duration-300
              hover:border-cyan-500/30
              hover:bg-slate-800
            "
          >
            <div className="flex items-center gap-4">

              <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                {doc.icon}
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  {doc.name}
                </h3>

                <p className="text-sm text-slate-400">
                  {doc.type}
                </p>
              </div>

            </div>

            <div className="text-right">

              <div className="flex items-center justify-end gap-2 text-green-400">
                <CheckCircle2 size={16} />

                <span className="text-sm">
                  {doc.status}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {doc.time}
              </p>

            </div>

          </div>
        ))}

      </div>

      {/* Footer */}

      <button
        className="
          mt-8
          w-full
          rounded-xl
          border
          border-cyan-500/30
          py-3
          font-semibold
          text-cyan-400
          transition
          hover:bg-cyan-500
          hover:text-white
        "
      >
        View All Documents
      </button>
    </div>
  );
}