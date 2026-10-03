import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => {
            closeMenu();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-2xl shadow-lg shadow-cyan-500/40">
            🚀
          </div>

          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-2xl sm:text-3xl font-black tracking-wide text-transparent">
              NEXORA
            </h1>
            <p className="text-[11px] text-slate-400">Construction AI</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <a
            href="#features"
            className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
          >
            Features
          </a>

          <a
            href="#workflow"
            className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
          >
            Solutions
          </a>

          <Link
            to="/dashboard"
            className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
          >
            Dashboard
          </Link>

          <a
            href="#pricing"
            className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
          >
            Pricing
          </a>

          <a
            href="#footer"
            className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
          >
            Contact
          </a>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden gap-3.5 lg:flex">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-cyan-500/50 px-5 py-2 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500 hover:text-white"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:scale-105 active:scale-95"
          >
            Launch App
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
          className="rounded-xl border border-white/10 bg-slate-900 p-2.5 text-white lg:hidden"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-white/10 bg-slate-950/95 px-6 py-6 backdrop-blur-2xl lg:hidden animate-in fade-in slide-in-from-top-4">
          <nav className="flex flex-col space-y-4">
            <a
              href="#features"
              onClick={closeMenu}
              className="text-base font-medium text-slate-300 hover:text-cyan-400 transition"
            >
              Features
            </a>
            <a
              href="#workflow"
              onClick={closeMenu}
              className="text-base font-medium text-slate-300 hover:text-cyan-400 transition"
            >
              Solutions
            </a>
            <Link
              to="/dashboard"
              onClick={closeMenu}
              className="text-base font-medium text-cyan-400 hover:text-cyan-300 transition"
            >
              Live Dashboard
            </Link>
            <a
              href="#pricing"
              onClick={closeMenu}
              className="text-base font-medium text-slate-300 hover:text-cyan-400 transition"
            >
              Pricing
            </a>
            <a
              href="#footer"
              onClick={closeMenu}
              className="text-base font-medium text-slate-300 hover:text-cyan-400 transition"
            >
              Contact
            </a>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  navigate("/dashboard");
                }}
                className="w-full rounded-xl border border-cyan-500 py-3 text-center text-sm font-semibold text-cyan-400 hover:bg-cyan-500 hover:text-white transition"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  navigate("/dashboard");
                }}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition"
              >
                Launch NEXORA
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}