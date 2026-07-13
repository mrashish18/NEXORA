import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-2xl shadow-lg shadow-cyan-500/40">
            🚀
          </div>

          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-3xl font-black tracking-wide text-transparent">
              NEXORA
            </h1>

            <p className="text-xs text-slate-400">
              Construction AI
            </p>
          </div>

        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden items-center gap-10 lg:flex">

          <a
            href="#features"
            className="text-slate-300 transition hover:text-cyan-400"
          >
            Features
          </a>

          <a
            href="#workflow"
            className="text-slate-300 transition hover:text-cyan-400"
          >
            Solutions
          </a>

          <Link
            to="/dashboard"
            className="text-slate-300 transition hover:text-cyan-400"
          >
            Dashboard
          </Link>

          <a
            href="#pricing"
            className="text-slate-300 transition hover:text-cyan-400"
          >
            Pricing
          </a>

          <a
            href="#footer"
            className="text-slate-300 transition hover:text-cyan-400"
          >
            Contact
          </a>

        </nav>

        {/* Buttons */}

        <div className="hidden gap-4 lg:flex">

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-cyan-500 px-5 py-2 text-cyan-400 transition hover:bg-cyan-500 hover:text-white"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:scale-105"
          >
            Try Demo
          </button>

        </div>

        {/* Mobile Menu */}

        <button className="text-white lg:hidden">
          <Menu size={30} />
        </button>

      </div>
    </header>
  );
}