import DashboardLayout from "../layouts/DashboardLayout";
import {
  User,
  Bell,
  Shield,
  Brain,
  Moon,
  Save,
} from "lucide-react";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}

        <div>
          <p className="uppercase tracking-[0.35em] text-cyan-400 text-sm">
            System Settings
          </p>

          <h1 className="mt-3 text-5xl font-black text-white">
            Application Settings
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Configure your profile, AI preferences, notifications,
            security and application settings.
          </p>
        </div>

        {/* Profile */}

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">

          <div className="flex items-center gap-3">

            <User className="text-cyan-400" />

            <h2 className="text-2xl font-bold text-white">
              Profile
            </h2>

          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>

              <label className="text-slate-400">
                Full Name
              </label>

              <input
                defaultValue="Ashish Kumar"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none"
              />

            </div>

            <div>

              <label className="text-slate-400">
                Email
              </label>

              <input
                defaultValue="ashish@nexora.ai"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none"
              />

            </div>

          </div>

        </div>

        {/* Notifications */}

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">

          <div className="flex items-center gap-3">

            <Bell className="text-yellow-400" />

            <h2 className="text-2xl font-bold text-white">
              Notifications
            </h2>

          </div>

          <div className="mt-8 space-y-5">

            <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4">

              <span className="text-white">
                Email Notifications
              </span>

              <input type="checkbox" defaultChecked />

            </label>

            <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4">

              <span className="text-white">
                Shipment Alerts
              </span>

              <input type="checkbox" defaultChecked />

            </label>

            <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4">

              <span className="text-white">
                AI Recommendations
              </span>

              <input type="checkbox" defaultChecked />

            </label>

          </div>

        </div>

        {/* AI Settings */}

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">

          <div className="flex items-center gap-3">

            <Brain className="text-cyan-400" />

            <h2 className="text-2xl font-bold text-white">
              AI Configuration
            </h2>

          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>

              <label className="text-slate-400">
                AI Model
              </label>

              <select className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white">

                <option>GPT-4.1</option>
                <option>Gemini 2.5</option>
                <option>Claude Sonnet</option>

              </select>

            </div>

            <div>

              <label className="text-slate-400">
                OCR Engine
              </label>

              <select className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white">

                <option>Tesseract OCR</option>
                <option>Google Vision</option>

              </select>

            </div>

          </div>

        </div>

        {/* Security */}

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">

          <div className="flex items-center gap-3">

            <Shield className="text-green-400" />

            <h2 className="text-2xl font-bold text-white">
              Security
            </h2>

          </div>

          <div className="mt-8 space-y-5">

            <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4">

              <span className="text-white">
                Two Factor Authentication
              </span>

              <input type="checkbox" />

            </label>

            <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4">

              <span className="text-white">
                Login Alerts
              </span>

              <input type="checkbox" defaultChecked />

            </label>

          </div>

        </div>

        {/* Appearance */}

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">

          <div className="flex items-center gap-3">

            <Moon className="text-violet-400" />

            <h2 className="text-2xl font-bold text-white">
              Appearance
            </h2>

          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div>

              <label className="text-slate-400">
                Theme
              </label>

              <select className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white">

                <option>Dark</option>
                <option>Light</option>

              </select>

            </div>

            <div>

              <label className="text-slate-400">
                Language
              </label>

              <select className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white">

                <option>English</option>
                <option>Hindi</option>

              </select>

            </div>

          </div>

        </div>

        {/* Save */}

        <div className="flex justify-end">

          <button className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white shadow-lg hover:scale-105 transition">

            <Save size={20} />

            Save Changes

          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}