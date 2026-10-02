import { useState } from "react";
import {
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

export default function DocumentViewer() {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleResetZoom = () => {
    setZoom(100);
    setRotation(0);
  };

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-widest text-cyan-400 font-semibold">
            Document Preview
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            Purchase_Order_2045.pdf
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 px-2 py-1 bg-slate-800 rounded-lg">
            {zoom}%
          </span>

          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            title="Zoom Out"
            className="rounded-xl bg-slate-800 p-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-40"
          >
            <ZoomOut size={18} />
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            title="Zoom In"
            className="rounded-xl bg-slate-800 p-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition disabled:opacity-40"
          >
            <ZoomIn size={18} />
          </button>

          <button
            type="button"
            onClick={handleRotate}
            title="Rotate Clockwise"
            className="rounded-xl bg-slate-800 p-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <RotateCw size={18} />
          </button>

          {(zoom !== 100 || rotation !== 0) && (
            <button
              type="button"
              onClick={handleResetZoom}
              title="Reset View"
              className="rounded-xl bg-slate-800 p-2.5 text-cyan-400 hover:bg-slate-700 transition text-xs flex items-center gap-1"
            >
              <Maximize2 size={16} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Preview Container */}
      <div className="mt-6 flex min-h-[480px] sm:min-h-[560px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950 overflow-hidden relative p-6">
        <div
          style={{
            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
            transition: "transform 0.25s ease-out",
          }}
          className="text-center p-8 bg-slate-900/90 rounded-2xl border border-white/5 max-w-sm sm:max-w-md shadow-2xl"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10 shadow-inner">
            <FileText size={40} className="text-cyan-400" />
          </div>

          <h3 className="mt-5 text-xl font-bold text-white">
            Purchase_Order_2045.pdf
          </h3>

          <div className="mt-3 inline-block rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">
            Page {currentPage} of {totalPages}
          </div>

          <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
            NEXORA Construction RAG Engine has extracted 8 context chunks from this document.
            Verify details in the Extracted Data and AI Recommendation panels below.
          </p>

          <div className="mt-5 pt-4 border-t border-white/10 flex justify-around text-left text-xs">
            <div>
              <span className="text-slate-500 block">Vendor</span>
              <span className="font-semibold text-slate-200">BuildMax Steel</span>
            </div>
            <div>
              <span className="text-slate-500 block">Amount</span>
              <span className="font-semibold text-green-400">₹42,00,000</span>
            </div>
            <div>
              <span className="text-slate-500 block">Status</span>
              <span className="font-semibold text-cyan-400">Indexed (FAISS)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs sm:text-sm text-slate-300 hover:border-cyan-500 hover:text-white transition disabled:opacity-40 disabled:hover:border-white/10"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <p className="text-xs sm:text-sm text-slate-400">
          Page <span className="font-semibold text-white">{currentPage}</span> of {totalPages}
        </p>

        <button
          type="button"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs sm:text-sm text-slate-300 hover:border-cyan-500 hover:text-white transition disabled:opacity-40 disabled:hover:border-white/10"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}