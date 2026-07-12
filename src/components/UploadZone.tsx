import { UploadCloud, FileText, Sparkles } from "lucide-react";

export default function UploadZone() {
  return (
    <section className="rounded-3xl border border-dashed border-cyan-500/30 bg-slate-900/70 p-10 transition-all hover:border-cyan-400">
      <div className="flex flex-col items-center justify-center text-center">

        {/* Icon */}

        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
          <UploadCloud size={42} className="text-white" />
        </div>

        {/* Title */}

        <h2 className="mt-8 text-3xl font-bold text-white">
          Upload Construction Documents
        </h2>

        <p className="mt-3 max-w-xl text-slate-400">
          Drag & drop Purchase Orders, Invoices, Contracts,
          Drawings or Specifications. NEXORA AI will automatically
          extract structured information and detect procurement risks.
        </p>

        {/* Upload Area */}

        <label className="mt-10 flex w-full max-w-3xl cursor-pointer flex-col items-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-12 transition hover:border-cyan-500 hover:bg-slate-900">

          <UploadCloud
            size={60}
            className="text-cyan-400"
          />

          <p className="mt-6 text-xl font-semibold text-white">
            Drag & Drop PDF Here
          </p>

          <p className="mt-2 text-slate-500">
            or click to browse your computer
          </p>

          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
          />

        </label>

        {/* Supported */}

        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <div className="rounded-xl bg-slate-800 p-5">
            <FileText className="mx-auto text-cyan-400" />

            <h3 className="mt-4 font-semibold text-white">
              Purchase Orders
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              PDF • DOCX • Images
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-5">
            <FileText className="mx-auto text-cyan-400" />

            <h3 className="mt-4 font-semibold text-white">
              Contracts
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              AI Clause Analysis
            </p>
          </div>

          <div className="rounded-xl bg-slate-800 p-5">
            <Sparkles className="mx-auto text-cyan-400" />

            <h3 className="mt-4 font-semibold text-white">
              AI Extraction
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Vendor • Amount • Risk
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}