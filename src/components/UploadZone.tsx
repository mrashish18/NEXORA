import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { UploadCloud, FileText, Sparkles, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { api } from "../services/api";
import type { UploadResponse } from "../types/api";

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "indexing" | "success" | "error"
  >("idle");
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file) return;

    setErrorMsg(null);
    setUploadResult(null);
    setUploadStatus("uploading");

    try {
      // Simulate quick transition to indexing since backend does both
      const response = await api.upload(file, true);

      if (response.success) {
        setUploadResult(response);
        setUploadStatus("success");
      } else {
        setErrorMsg(response.message || "Failed to process document.");
        setUploadStatus("error");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error during upload.");
      setUploadStatus("error");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

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
          Drag & drop Purchase Orders, Invoices, Contracts, Drawings or Specifications. NEXORA
          AI will automatically extract structured information and detect procurement risks.
        </p>

        {/* Upload Area */}
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mt-10 flex w-full max-w-3xl cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed p-12 transition ${
            isDragging
              ? "border-cyan-400 bg-cyan-950/30 scale-[1.01]"
              : "border-slate-700 bg-slate-950/60 hover:border-cyan-500 hover:bg-slate-900"
          }`}
        >
          {uploadStatus === "uploading" ? (
            <div className="flex flex-col items-center">
              <Loader2 size={54} className="animate-spin text-cyan-400" />
              <p className="mt-6 text-xl font-semibold text-white">
                Uploading & Indexing Document...
              </p>
              <p className="mt-2 text-sm text-cyan-400">
                Extracting text, generating embeddings & updating FAISS vector store
              </p>
            </div>
          ) : (
            <>
              <UploadCloud size={60} className="text-cyan-400" />

              <p className="mt-6 text-xl font-semibold text-white">
                Drag & Drop PDF, DOCX, or TXT Here
              </p>

              <p className="mt-2 text-slate-500">or click to browse your computer</p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </>
          )}
        </label>

        {/* Upload Result State Feedback */}
        {uploadStatus === "success" && uploadResult && (
          <div className="mt-6 w-full max-w-3xl rounded-2xl border border-green-500/30 bg-green-950/40 p-5 text-left flex items-start gap-4">
            <CheckCircle2 size={24} className="text-green-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-300">
                Document Indexed Successfully!
              </h4>
              <p className="text-sm text-slate-300 mt-1">
                File: <span className="font-mono text-white">{uploadResult.filename}</span>
                {uploadResult.size_bytes ? ` (${(uploadResult.size_bytes / 1024).toFixed(1)} KB)` : ""}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {uploadResult.indexing_details?.characters
                  ? `Extracted ${uploadResult.indexing_details.characters} characters. Available immediately to AI Assistant queries.`
                  : "Available immediately to AI Assistant queries."}
              </p>
            </div>
            <button
              onClick={() => setUploadStatus("idle")}
              className="text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {uploadStatus === "error" && errorMsg && (
          <div className="mt-6 w-full max-w-3xl rounded-2xl border border-red-500/30 bg-red-950/40 p-5 text-left flex items-start gap-4">
            <AlertCircle size={24} className="text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-300">Upload / Indexing Failed</h4>
              <p className="text-sm text-red-200 mt-1">{errorMsg}</p>
            </div>
            <button
              onClick={() => setUploadStatus("idle")}
              className="text-xs text-slate-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Supported Types Badges */}
        <div className="mt-10 grid gap-5 md:grid-cols-3 w-full max-w-3xl">
          <div className="rounded-xl bg-slate-800 p-5">
            <FileText className="mx-auto text-cyan-400" />
            <h3 className="mt-4 font-semibold text-white">Purchase Orders</h3>
            <p className="mt-2 text-sm text-slate-400">PDF • DOCX • TXT</p>
          </div>

          <div className="rounded-xl bg-slate-800 p-5">
            <FileText className="mx-auto text-cyan-400" />
            <h3 className="mt-4 font-semibold text-white">Contracts & BOQs</h3>
            <p className="mt-2 text-sm text-slate-400">RAG Chunking & Indexing</p>
          </div>

          <div className="rounded-xl bg-slate-800 p-5">
            <Sparkles className="mx-auto text-cyan-400" />
            <h3 className="mt-4 font-semibold text-white">AI Extraction</h3>
            <p className="mt-2 text-sm text-slate-400">FAISS Vector Search Ready</p>
          </div>
        </div>
      </div>
    </section>
  );
}