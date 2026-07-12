import {
  Bell,
  Search,
  Upload,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/90 px-8 backdrop-blur-xl">
      {/* Left */}

      <div className="flex items-center gap-6">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search purchase orders, vendors..."
            className="
              w-[360px]
              rounded-xl
              border
              border-white/10
              bg-slate-900
              py-3
              pl-11
              pr-4
              text-white
              outline-none
              transition
              focus:border-cyan-500
            "
          />

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-600">
          <Upload size={18} />
          Upload
        </button>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-300">
          <CalendarDays size={18} />
          Today
        </div>

        <button className="relative rounded-xl border border-white/10 bg-slate-900 p-3 transition hover:border-cyan-500">
          <Bell size={20} className="text-white" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-4 py-2">
          <img
            src="https://ui-avatars.com/api/?name=Ashish+Kumar&background=0EA5E9&color=fff"
            alt="Profile"
            className="h-10 w-10 rounded-full"
          />

          <div>

            <p className="font-semibold text-white">
              Ashish Kumar
            </p>

            <p className="text-sm text-slate-400">
              Project Admin
            </p>

          </div>

          <ChevronDown
            size={18}
            className="text-slate-400"
          />

        </div>

      </div>
    </header>
  );
}