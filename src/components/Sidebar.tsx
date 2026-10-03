import {
  LayoutDashboard,
  FileText,
  Truck,
  Users,
  Bot,
  Settings,
  Boxes,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useBackendHealth } from "../hooks/useBackendHealth";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const menu = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <Boxes size={20} />,
    name: "Procurement",
    path: "/procurement",
  },
  {
    icon: <Truck size={20} />,
    name: "Supply Chain",
    path: "/supply-chain",
  },
  {
    icon: <FileText size={20} />,
    name: "Documents",
    path: "/documents",
  },
  {
    icon: <Users size={20} />,
    name: "Vendors",
    path: "/vendors",
  },
  {
    icon: <Bot size={20} />,
    name: "AI Assistant",
    path: "/assistant",
  },
  {
    icon: <Settings size={20} />,
    name: "Settings",
    path: "/settings",
  },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { isChecking, isOnline, statusText, llmAvailable, kbIndexed, chunksCount } =
    useBackendHealth(15000);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close navigation sidebar"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") onClose?.();
          }}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-white/10 bg-slate-950 overflow-y-auto overflow-x-hidden transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl shadow-cyan-500/20" : "-translate-x-full"
        }`}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <NavLink
            to="/"
            onClick={() => {
              onClose?.();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl shadow-lg shadow-cyan-500/30">
              🚀
            </div>

            <div>
              <h1 className="text-2xl font-black text-white tracking-wide">
                NEXORA
              </h1>
              <p className="text-xs font-medium text-cyan-400">
                Construction AI
              </p>
            </div>
          </NavLink>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1 px-4 space-y-1.5">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-white shadow-lg shadow-cyan-500/25"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="font-medium tracking-wide">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Card: Live Health Diagnostics */}
        <div className="p-4 mt-auto">
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-widest text-cyan-400 font-semibold">
                AI Status
              </p>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  statusText === "Online"
                    ? "bg-green-400 animate-pulse"
                    : statusText === "Degraded"
                    ? "bg-yellow-400"
                    : "bg-red-400"
                }`}
              />
            </div>

            <h3 className="mt-1.5 text-base font-bold text-white">
              {statusText === "Online"
                ? "All Systems Online"
                : statusText === "Degraded"
                ? "Service Degraded"
                : isChecking
                ? "Checking Status..."
                : "Backend Offline"}
            </h3>

            {/* Subsystem status indicators */}
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Backend:</span>
                <span className={isOnline ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                  {isOnline ? "● Online" : "● Offline"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">LLM Engine:</span>
                <span className={llmAvailable ? "text-green-400 font-medium" : "text-yellow-400 font-medium"}>
                  {llmAvailable ? "● Ready" : "● Offline"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Vector Store:</span>
                <span className={kbIndexed ? "text-cyan-400 font-medium" : "text-slate-500 font-medium"}>
                  {kbIndexed ? `● ${chunksCount} Chunks` : "● Empty"}
                </span>
              </div>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  statusText === "Online"
                    ? "w-full bg-gradient-to-r from-green-400 to-cyan-500"
                    : statusText === "Degraded"
                    ? "w-1/2 bg-yellow-400"
                    : "w-1/12 bg-red-500"
                }`}
              />
            </div>

            <p className="mt-2 text-[10px] text-slate-400">
              Live Health Diagnostics
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}