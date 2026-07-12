import {
  Boxes,
  Truck,
  TriangleAlert,
  Users,
} from "lucide-react";

import KpiCard from "./KpiCard";
import ChartPreview from "./ChartPreview";
import ChatPreview from "./ChatPreview";
import DocumentList from "./DocumentList";
import AlertPanel from "./AlertPanel";

export default function DashboardPreview() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-28">
      {/* Background Glow */}
      <div className="absolute left-20 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-8">
        {/* Heading */}

        <div className="text-center">
          <p className="font-semibold uppercase tracking-[0.35em] text-cyan-400">
            AI Command Center
          </p>

          <h2 className="mt-5 text-5xl font-black text-white">
            Live Dashboard Preview
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            Monitor procurement, logistics, vendors, inventory and AI
            recommendations from one intelligent dashboard.
          </p>
        </div>

        {/* KPI Cards */}

        <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="Orders"
            value="1,248"
            subtitle="Active Purchase Orders"
            icon={<Boxes size={28} />}
            color="from-cyan-500 to-blue-600"
          />

          <KpiCard
            title="Deliveries"
            value="96%"
            subtitle="On-Time Delivery"
            icon={<Truck size={28} />}
            color="from-green-500 to-emerald-600"
          />

          <KpiCard
            title="Vendors"
            value="324"
            subtitle="Verified Vendors"
            icon={<Users size={28} />}
            color="from-violet-500 to-purple-600"
          />

          <KpiCard
            title="Risk"
            value="LOW"
            subtitle="Overall Project Risk"
            icon={<TriangleAlert size={28} />}
            color="from-orange-500 to-red-500"
          />
        </div>

        {/* Dashboard */}

        <div className="mt-12 grid gap-8 xl:grid-cols-3">
          {/* Left */}

          <div className="space-y-8 xl:col-span-2">
            <ChartPreview />

            <DocumentList />
          </div>

          {/* Right */}

          <div className="space-y-8">
            <ChatPreview />

            <AlertPanel />
          </div>
        </div>

        {/* Bottom Banner */}

        <div className="mt-16 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 p-10 text-center backdrop-blur-xl">
          <h3 className="text-3xl font-bold text-white">
            AI is Monitoring Your Construction Supply Chain 24×7
          </h3>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            From procurement to delivery, NEXORA continuously analyzes
            documents, predicts risks, tracks shipments and recommends
            smarter decisions before delays happen.
          </p>

          <button className="mt-8 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:scale-105">
            Explore Full Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}