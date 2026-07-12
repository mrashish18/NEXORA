import {
  LayoutDashboard,
  FileText,
  Truck,
  Users,
  Bot,
  Settings,
  Boxes,
} from "lucide-react";

const menu = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    active: true,
  },
  {
    icon: <Boxes size={20} />,
    name: "Procurement",
  },
  {
    icon: <Truck size={20} />,
    name: "Supply Chain",
  },
  {
    icon: <FileText size={20} />,
    name: "Documents",
  },
  {
    icon: <Users size={20} />,
    name: "Vendors",
  },
  {
    icon: <Bot size={20} />,
    name: "AI Assistant",
  },
  {
    icon: <Settings size={20} />,
    name: "Settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col border-r border-white/10 bg-slate-950">

      {/* Logo */}

      <div className="border-b border-white/10 p-8">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl shadow-lg shadow-cyan-500/30">
            🚀
          </div>

          <div>

            <h1 className="text-3xl font-black text-white">
              NEXORA
            </h1>

            <p className="text-sm text-cyan-400">
              Construction AI
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="mt-8 flex-1 px-4">

        {menu.map((item) => (
          <button
            key={item.name}
            className={`mb-3 flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-300 ${
              item.active
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.icon}

            <span className="font-medium">
              {item.name}
            </span>
          </button>
        ))}

      </nav>

      {/* Bottom Card */}

      <div className="p-5">

        <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6">

          <p className="text-sm uppercase tracking-widest text-cyan-400">
            AI Status
          </p>

          <h3 className="mt-2 text-xl font-bold text-white">
            All Systems Online
          </h3>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-700">

            <div className="h-full w-full rounded-full bg-gradient-to-r from-green-400 to-cyan-500" />

          </div>

          <p className="mt-3 text-sm text-slate-300">
            AI Engine • 99.98% Uptime
          </p>

        </div>

      </div>

    </aside>
  );
}