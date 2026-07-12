export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 py-8">
      <div className="flex flex-col items-center justify-between gap-3 text-sm text-slate-400 md:flex-row">
        <p>© 2026 NEXORA AI. All rights reserved.</p>

        <div className="flex gap-6">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Documentation</a>
          <a href="#">Support</a>
        </div>

        <p>Powered by AI for Construction</p>
      </div>
    </footer>
  );
}