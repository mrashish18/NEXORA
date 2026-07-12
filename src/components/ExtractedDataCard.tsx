import {
  Building2,
  Hash,
  CalendarDays,
  IndianRupee,
  Package,
  BadgeCheck,
} from "lucide-react";

const extractedData = [
  {
    icon: <Building2 size={20} />,
    label: "Vendor",
    value: "Larsen & Toubro Ltd.",
  },
  {
    icon: <Hash size={20} />,
    label: "PO Number",
    value: "PO-2026-1048",
  },
  {
    icon: <IndianRupee size={20} />,
    label: "Total Amount",
    value: "₹4,28,750",
  },
  {
    icon: <CalendarDays size={20} />,
    label: "Delivery Date",
    value: "18 July 2026",
  },
  {
    icon: <Package size={20} />,
    label: "Material",
    value: "Steel Beams & Cement",
  },
  {
    icon: <BadgeCheck size={20} />,
    label: "AI Confidence",
    value: "98.7%",
  },
];

export default function ExtractedDataCard() {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-widest text-cyan-400">
            AI Extraction
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Extracted Information
          </h2>

        </div>

        <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-400">
          Complete
        </span>

      </div>

      {/* Data */}

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        {extractedData.map((item) => (
          <div
            key={item.label}
            className="
              rounded-2xl
              border
              border-white/5
              bg-slate-800/60
              p-5
              transition
              hover:border-cyan-500/30
            "
          >

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                {item.icon}
              </div>

              <div>

                <p className="text-sm text-slate-400">
                  {item.label}
                </p>

                <h3 className="mt-1 font-semibold text-white">
                  {item.value}
                </h3>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* Materials */}

      <div className="mt-8 rounded-2xl bg-slate-800/60 p-5">

        <h3 className="font-semibold text-white">
          Materials Detected
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">

          {[
            "Steel Beam",
            "Concrete",
            "PVC Pipes",
            "Electrical Cable",
          ].map((material) => (
            <span
              key={material}
              className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400"
            >
              {material}
            </span>
          ))}

        </div>

      </div>

    </section>
  );
}