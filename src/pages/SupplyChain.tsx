import DashboardLayout from "../layouts/DashboardLayout";
import {
  Truck,
  Package,
  Warehouse,
  MapPin,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

const shipments = [
  {
    id: "ST-204",
    origin: "Mumbai",
    destination: "Delhi",
    status: "Delayed",
    eta: "18 Jul",
    progress: 72,
  },
  {
    id: "ST-118",
    origin: "Chennai",
    destination: "Bengaluru",
    status: "In Transit",
    eta: "16 Jul",
    progress: 48,
  },
  {
    id: "ST-301",
    origin: "Pune",
    destination: "Hyderabad",
    status: "Delivered",
    eta: "Delivered",
    progress: 100,
  },
];

export default function SupplyChain() {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}

        <div>
          <p className="uppercase tracking-[0.35em] text-cyan-400 text-sm">
            Supply Chain Intelligence
          </p>

          <h1 className="mt-3 text-5xl font-black text-white">
            Supply Chain Monitoring
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Track shipments, inventory, warehouse utilization and logistics
            performance in real time using AI.
          </p>
        </div>

        {/* KPI Cards */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <Truck className="text-cyan-400" size={32} />

            <p className="mt-4 text-slate-400">
              Active Shipments
            </p>

            <h2 className="mt-2 text-4xl font-bold text-white">
              186
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <Warehouse className="text-green-400" size={32} />

            <p className="mt-4 text-slate-400">
              Warehouses
            </p>

            <h2 className="mt-2 text-4xl font-bold text-white">
              24
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <Package className="text-orange-400" size={32} />

            <p className="mt-4 text-slate-400">
              Inventory Health
            </p>

            <h2 className="mt-2 text-4xl font-bold text-green-400">
              92%
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
            <TrendingUp className="text-purple-400" size={32} />

            <p className="mt-4 text-slate-400">
              AI Accuracy
            </p>

            <h2 className="mt-2 text-4xl font-bold text-cyan-400">
              98%
            </h2>
          </div>

        </div>

        {/* Shipments */}

        <div className="rounded-3xl border border-white/10 bg-slate-900 overflow-hidden">

          <div className="border-b border-white/10 p-6">
            <h2 className="text-2xl font-bold text-white">
              Live Shipment Tracking
            </h2>
          </div>

          <div className="divide-y divide-white/10">

            {shipments.map((shipment) => (

              <div
                key={shipment.id}
                className="p-6 hover:bg-slate-800 transition"
              >

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="text-xl font-semibold text-white">
                      {shipment.id}
                    </h3>

                    <div className="mt-2 flex items-center gap-5 text-slate-400">

                      <span className="flex items-center gap-2">
                        <MapPin size={16} />
                        {shipment.origin}
                      </span>

                      →

                      <span>{shipment.destination}</span>

                    </div>

                  </div>

                  <div className="text-right">

                    <div
                      className={`inline-flex rounded-full px-4 py-1 text-sm ${
                        shipment.status === "Delivered"
                          ? "bg-green-500/20 text-green-400"
                          : shipment.status === "Delayed"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-cyan-500/20 text-cyan-400"
                      }`}
                    >
                      {shipment.status}
                    </div>

                    <p className="mt-2 text-slate-400">
                      ETA : {shipment.eta}
                    </p>

                  </div>

                </div>

                <div className="mt-5 h-3 rounded-full bg-slate-800">

                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{
                      width: `${shipment.progress}%`,
                    }}
                  />

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* Bottom Grid */}

        <div className="grid gap-6 xl:grid-cols-2">

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">

            <div className="flex items-center gap-3">

              <AlertTriangle className="text-yellow-400" />

              <h2 className="text-2xl font-bold text-white">
                AI Risk Alert
              </h2>

            </div>

            <p className="mt-6 leading-8 text-slate-300">
              Shipment ST-204 may arrive 2 days late due to weather
              conditions. AI recommends switching to BuildMax Logistics.
            </p>

            <button className="mt-8 rounded-xl bg-red-500 px-6 py-3 text-white font-semibold hover:bg-red-600">
              View Recommendation
            </button>

          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">

            <div className="flex items-center gap-3">

              <CheckCircle2 className="text-green-400" />

              <h2 className="text-2xl font-bold text-white">
                Warehouse Health
              </h2>

            </div>

            <div className="mt-6 space-y-5">

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Warehouse Capacity
                </span>

                <span className="text-green-400 font-semibold">
                  84%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Inventory Available
                </span>

                <span className="text-cyan-400 font-semibold">
                  92%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Avg Delivery Time
                </span>

                <span className="text-white">
                  3.8 Days
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  Last Updated
                </span>

                <span className="text-white flex items-center gap-2">
                  <Clock3 size={16} />
                  2 mins ago
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}