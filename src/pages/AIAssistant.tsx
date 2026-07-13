import DashboardLayout from "../layouts/DashboardLayout";

import ChatPreview from "../components/ChatPreview";

export default function AIAssistant() {
  return (
    <DashboardLayout>

      <div className="space-y-6">

        <div>

          <p className="uppercase tracking-[0.3em] text-cyan-400 text-sm">
            AI Copilot
          </p>

          <h1 className="mt-3 text-4xl font-black text-white">
            NEXORA AI Assistant
          </h1>

          <p className="mt-4 max-w-3xl text-slate-400">
            Ask procurement questions, receive vendor recommendations,
            detect risks and monitor construction operations.
          </p>

        </div>

        <ChatPreview />

      </div>

    </DashboardLayout>
  );
}