import { Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

        {/* Logo */}
        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-2xl shadow-lg shadow-cyan-500/40">
            🚀
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              NEXORA
            </h1>

            <p className="text-xs text-slate-400">
              Construction AI
            </p>
          </div>

        </div>

        {/* Desktop Menu */}

        <nav className="hidden gap-10 text-slate-300 lg:flex">

          <a className="transition hover:text-cyan-400" href="#">
            Features
          </a>

          <a className="transition hover:text-cyan-400" href="#">
            Solutions
          </a>

          <a className="transition hover:text-cyan-400" href="#">
            Dashboard
          </a>

          <a className="transition hover:text-cyan-400" href="#">
            Pricing
          </a>

          <a className="transition hover:text-cyan-400" href="#">
            Contact
          </a>

        </nav>

        {/* Buttons */}

        <div className="hidden gap-4 lg:flex">

          <button className="rounded-xl border border-cyan-500 px-5 py-2 text-cyan-400 transition hover:bg-cyan-500 hover:text-white">
            Login
          </button>

          <button className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 font-semibold shadow-lg shadow-cyan-500/30 transition hover:scale-105">
            Try Demo
          </button>

        </div>

        <button className="lg:hidden">
          <Menu />
        </button>

      </div>
    </header>
  );
}