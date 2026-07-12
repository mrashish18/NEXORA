import type { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  color: string;
}

export default function KpiCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: KpiCardProps) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-6
        backdrop-blur-xl
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-cyan-500/40
        hover:shadow-2xl
        hover:shadow-cyan-500/20
      "
    >
      {/* Background Glow */}

      <div
        className="
          absolute
          -top-12
          -right-12
          h-36
          w-36
          rounded-full
          bg-cyan-500/10
          blur-3xl
          transition
          duration-500
          group-hover:bg-cyan-500/20
        "
      />

      {/* Header */}

      <div className="flex items-center justify-between">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${color} text-white shadow-lg`}
        >
          {icon}
        </div>

        <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
          Live
        </span>
      </div>

      {/* Content */}

      <div className="mt-6">
        <p className="text-sm uppercase tracking-wider text-slate-400">
          {title}
        </p>

        <h3 className="mt-2 text-4xl font-black text-white">
          {value}
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          {subtitle}
        </p>
      </div>

      {/* Bottom Progress */}

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 group-hover:w-full`}
          style={{ width: "75%" }}
        />
      </div>
    </div>
  );
}