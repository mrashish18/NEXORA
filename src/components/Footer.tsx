import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="mt-20 border-t border-white/10 bg-slate-950 py-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-8 text-sm text-slate-400 md:flex-row">
        
        {/* Copyright */}
        <p>
          © 2026 <span className="font-semibold text-cyan-400">NEXORA AI</span>. All rights reserved.
        </p>

        {/* Footer Links */}
        <div className="flex flex-wrap items-center gap-6">
          <Link
            to="/"
            className="transition hover:text-cyan-400"
          >
            Home
          </Link>

          <a
            href="#features"
            className="transition hover:text-cyan-400"
          >
            Features
          </a>

          <a
            href="#workflow"
            className="transition hover:text-cyan-400"
          >
            Workflow
          </a>

          <Link
            to="/dashboard"
            className="transition hover:text-cyan-400"
          >
            Dashboard
          </Link>
        </div>

        {/* Right Side */}
        <p className="text-slate-500">
          Powered by AI for Construction 🚀
        </p>

      </div>
    </footer>
  );
}