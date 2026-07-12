import {
  AlertTriangle,
  Truck,
  Package,
  ShieldAlert,
} from "lucide-react";

const alerts = [
  {
    icon: <Truck size={20} />,
    title: "Steel Shipment Delayed",
    description: "Shipment ST-204 is expected to arrive 2 days late.",
    priority: "High",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  {
    icon: <Package size={20} />,
    title: "Low Cement Inventory",
    description: "Current stock will last only 3 days.",
    priority: "Medium",
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  {
    icon: <ShieldAlert size={20} />,
    title: "Vendor Risk Detected",
    description: "Vendor reliability dropped below 85%.",
    priority: "Low",
    color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
];

export default function AlertPanel() {
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
            AI Alerts
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Risk Monitoring
          </h2>

        </div>

        <AlertTriangle className="text-red-400" size={28} />

      </div>

      {/* Alerts */}

      <div className="mt-8 space-y-5">

        {alerts.map((alert) => (

          <div
            key={alert.title}
            className={`
            rounded-2xl
            border
            p-5
            transition-all
            duration-300
            hover:scale-[1.02]
            ${alert.color}
          `}
          >

            <div className="flex items-start justify-between">

              <div className="flex gap-4">

                <div className="mt-1">
                  {alert.icon}
                </div>

                <div>

                  <h3 className="font-bold">
                    {alert.title}
                  </h3>

                  <p className="mt-2 text-sm opacity-80 leading-6">
                    {alert.description}
                  </p>

                </div>

              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                {alert.priority}
              </span>

            </div>

          </div>

        ))}

      </div>

      {/* Recommendation */}

      <div
        className="
        mt-8
        rounded-2xl
        border
        border-cyan-500/20
        bg-cyan-500/10
        p-5
      "
      >

        <h3 className="font-bold text-cyan-300">
          AI Recommendation
        </h3>

        <p className="mt-3 leading-7 text-slate-300">
          Switch the steel procurement to
          <strong> BuildMax Steel Ltd.</strong>
          to avoid a projected
          <strong> 4-day construction delay.</strong>
        </p>

      </div>

    </div>
  );
}