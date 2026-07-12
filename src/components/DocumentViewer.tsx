import {
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function DocumentViewer() {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm uppercase tracking-widest text-cyan-400">
            Document Preview
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Purchase_Order_2045.pdf
          </h2>

        </div>

        <div className="flex gap-3">

          <button className="rounded-xl bg-slate-800 p-3 hover:bg-slate-700">
            <ZoomOut className="text-white" size={18} />
          </button>

          <button className="rounded-xl bg-slate-800 p-3 hover:bg-slate-700">
            <ZoomIn className="text-white" size={18} />
          </button>

          <button className="rounded-xl bg-slate-800 p-3 hover:bg-slate-700">
            <RotateCw className="text-white" size={18} />
          </button>

        </div>

      </div>

      {/* Preview */}

      <div className="mt-8 flex h-[650px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950">

        <div className="text-center">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/10">
            <FileText size={48} className="text-cyan-400" />
          </div>

          <h3 className="mt-6 text-2xl font-bold text-white">
            PDF Preview
          </h3>

          <p className="mt-3 max-w-md text-slate-400">
            Uploaded construction documents will appear here.
            Soon this panel will support PDF rendering,
            OCR highlighting and AI annotations.
          </p>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-6 flex items-center justify-between">

        <button className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-slate-300 hover:border-cyan-500">
          <ChevronLeft size={18} />
          Previous
        </button>

        <p className="text-slate-400">
          Page <span className="font-semibold text-white">1</span> of 8
        </p>

        <button className="flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-slate-300 hover:border-cyan-500">
          Next
          <ChevronRight size={18} />
        </button>

      </div>

    </section>
  );
}