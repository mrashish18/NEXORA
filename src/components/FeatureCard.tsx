import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  color,
}: FeatureCardProps) {
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
      p-8
      backdrop-blur-xl
      transition-all
      duration-500
      hover:-translate-y-3
      hover:border-cyan-500/40
      hover:shadow-2xl
      hover:shadow-cyan-500/20
    "
    >
      {/* Glow */}

      <div
        className="
        absolute
        -right-12
        -top-12
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

      {/* Icon */}

      <div
        className={`
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-2xl
        bg-gradient-to-r
        ${color}
        text-white
        shadow-lg
      `}
      >
        {icon}
      </div>

      {/* Title */}

      <h3 className="mt-8 text-2xl font-bold text-white">
        {title}
      </h3>

      {/* Description */}

      <p className="mt-5 leading-8 text-slate-400">
        {description}
      </p>

      {/* Bottom Line */}

      <div
        className="
        mt-8
        h-1
        w-0
        rounded-full
        bg-gradient-to-r
        from-cyan-400
        to-blue-500
        transition-all
        duration-500
        group-hover:w-full
      "
      />
    </div>
  );
}