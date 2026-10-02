import { useState } from "react";
import {
  Bell,
  Search,
  Upload,
  CalendarDays,
  Menu,
  Check,
  AlertTriangle,
  FileText,
  User,
  Settings as SettingsIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopbarProps {
  onToggleSidebar?: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "alert" | "info" | "success";
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      title: "Delayed Shipment ST-204",
      description: "Mumbai → Delhi transit delayed by weather. AI suggests BuildMax Logistics.",
      time: "10m ago",
      read: false,
      type: "alert",
    },
    {
      id: "notif-2",
      title: "New Purchase Order Indexed",
      description: "PO-2026-1048 indexed into FAISS vector store with 8 chunks.",
      time: "25m ago",
      read: false,
      type: "info",
    },
    {
      id: "notif-3",
      title: "Vendor Evaluation Complete",
      description: "BuildMax Steel Ltd. awarded 98% reliability score.",
      time: "1h ago",
      read: true,
      type: "success",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().trim();
    if (q.includes("doc") || q.includes("po") || q.includes("order") || q.includes("invoice")) {
      navigate("/documents");
    } else if (q.includes("vendor") || q.includes("supplier") || q.includes("steel")) {
      navigate("/vendors");
    } else if (q.includes("ship") || q.includes("transit") || q.includes("track")) {
      navigate("/supply-chain");
    } else {
      navigate(`/assistant?prompt=${encodeURIComponent(`Search project intelligence for: ${searchQuery}`)}`);
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Format today's date
  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/90 px-4 sm:px-6 lg:px-8 backdrop-blur-xl">
      {/* Left Section: Mobile Hamburger + Search */}
      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Open sidebar navigation"
          className="rounded-xl border border-white/10 bg-slate-900 p-2.5 text-slate-300 hover:border-cyan-500 hover:text-white lg:hidden shrink-0"
        >
          <Menu size={20} />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative min-w-0">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders, vendors, docs..."
            className="
              w-44 sm:w-64 md:w-80 lg:w-96
              rounded-xl
              border
              border-white/10
              bg-slate-900
              py-2.5
              pl-10
              pr-3
              text-xs sm:text-sm
              text-white
              placeholder:text-slate-500
              outline-none
              transition
              focus:border-cyan-500
              focus:ring-1
              focus:ring-cyan-500/50
            "
          />
        </form>
      </div>

      {/* Right Section: Actions + Date + Notifications + User */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Upload Action */}
        <button
          type="button"
          onClick={() => navigate("/documents")}
          className="flex items-center gap-2 rounded-xl bg-cyan-500 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-600 active:scale-95"
        >
          <Upload size={16} />
          <span className="hidden sm:inline">Upload</span>
        </button>

        {/* Date Badge */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs sm:text-sm text-slate-300">
          <CalendarDays size={16} className="text-cyan-400" />
          <span>{todayFormatted}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              setShowProfileMenu(false);
            }}
            aria-label="View notifications"
            className="relative rounded-xl border border-white/10 bg-slate-900 p-2.5 transition hover:border-cyan-500 hover:text-white"
          >
            <Bell size={18} className="text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h4 className="font-bold text-white text-sm">Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Check size={14} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl p-3 border transition ${
                      item.read
                        ? "border-transparent bg-slate-950/40 text-slate-400"
                        : "border-cyan-500/20 bg-slate-800/80 text-white"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {item.type === "alert" ? (
                        <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                      ) : item.type === "info" ? (
                        <FileText size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                      ) : (
                        <Check size={16} className="text-green-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold leading-tight">{item.title}</p>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                        <span className="text-[10px] text-slate-500 mt-1 block">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu((prev) => !prev);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-slate-900 p-1.5 sm:px-3 sm:py-1.5 transition hover:border-cyan-500"
          >
            <img
              src="https://ui-avatars.com/api/?name=Ashish+Kumar&background=0EA5E9&color=fff"
              alt="Ashish Kumar"
              className="h-8 w-8 rounded-full ring-1 ring-cyan-500/50"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">Ashish Kumar</p>
              <p className="text-[10px] text-slate-400">Project Admin</p>
            </div>
          </button>

          {/* Profile Dropdown Panel */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl z-50">
              <div className="p-2 border-b border-white/10">
                <p className="text-xs font-bold text-white">Ashish Kumar</p>
                <p className="text-[11px] text-slate-400 font-mono">ashish@nexora.ai</p>
              </div>

              <div className="mt-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/settings");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <User size={15} className="text-cyan-400" />
                  Account Profile
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/settings");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <SettingsIcon size={15} className="text-cyan-400" />
                  Settings & Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}