import DashboardLayout from "../layouts/DashboardLayout";

import UploadZone from "../components/UploadZone";
import DocumentViewer from "../components/DocumentViewer";
import ExtractedDataCard from "../components/ExtractedDataCard";
import RiskAnalysisCard from "../components/RiskAnalysisCard";
import AIRecommendation from "../components/AIRecommendation";

export default function Documents() {
  return (
    <DashboardLayout>
      {/* Header */}

      <div className="mb-10">

        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          AI Document Intelligence
        </p>

        <h1 className="mt-3 text-4xl font-black text-white">
          Construction Document Analysis
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
          Upload Purchase Orders, Contracts, Invoices,
          BOQs and Drawings.

          NEXORA automatically extracts structured data,
          predicts procurement risks,
          and recommends the best course of action.
        </p>

      </div>

      {/* Upload */}

      <UploadZone />

      {/* Grid */}

      <div className="mt-10 grid gap-8 xl:grid-cols-2">

        <DocumentViewer />

        <ExtractedDataCard />

      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-2">

        <RiskAnalysisCard />

        <AIRecommendation />

      </div>

    </DashboardLayout>
  );
}