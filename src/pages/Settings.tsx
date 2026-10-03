import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  User,
  Bell,
  Shield,
  Brain,
  Moon,
  Save,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

interface SettingsState {
  fullName: string;
  email: string;
  emailNotifications: boolean;
  shipmentAlerts: boolean;
  aiRecommendations: boolean;
  aiModel: string;
  ocrEngine: string;
  twoFactor: boolean;
  loginAlerts: boolean;
  theme: string;
  language: string;
}

const defaultSettings: SettingsState = {
  fullName: "Project Administrator",
  email: "admin@nexora.ai",
  emailNotifications: true,
  shipmentAlerts: true,
  aiRecommendations: true,
  aiModel: "OpenAI GPT-4o-mini (Cloud RAG)",
  ocrEngine: "Tesseract OCR",
  twoFactor: false,
  loginAlerts: true,
  theme: "Dark (NEXORA Cyberpunk Navy)",
  language: "English",
};

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>(() => {
    try {
      const saved = localStorage.getItem("nexora_user_settings");
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return defaultSettings;
  });

  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (savedMessage) {
      const timer = setTimeout(() => setSavedMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [savedMessage]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("nexora_user_settings", JSON.stringify(settings));
      setSavedMessage(true);
    } catch (err) {
      console.error("Failed to save settings to localStorage:", err);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("nexora_user_settings");
    setSavedMessage(true);
  };

  return (
    <DashboardLayout>
      <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="uppercase tracking-[0.35em] text-cyan-400 text-sm font-semibold">
              System Settings
            </p>

            <h1 className="mt-2 text-3xl sm:text-5xl font-black text-white">
              Application Settings
            </h1>

            <p className="mt-2 text-sm sm:text-base text-slate-400">
              Configure your profile, AI preferences, notifications, security and preferences.
            </p>
          </div>

          {savedMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-green-500/20 border border-green-500/40 px-4 py-2 text-sm font-semibold text-green-300 animate-in fade-in">
              <CheckCircle2 size={18} className="text-green-400" />
              Settings Saved!
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <User className="text-cyan-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Profile</h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="fullName" className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={settings.fullName}
                onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Bell className="text-yellow-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4 cursor-pointer hover:bg-slate-700/80 transition">
              <span className="text-sm font-medium text-white">Email Notifications</span>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, emailNotifications: e.target.checked })
                }
                className="h-5 w-5 rounded accent-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4 cursor-pointer hover:bg-slate-700/80 transition">
              <span className="text-sm font-medium text-white">Shipment Alerts</span>
              <input
                type="checkbox"
                checked={settings.shipmentAlerts}
                onChange={(e) =>
                  setSettings({ ...settings, shipmentAlerts: e.target.checked })
                }
                className="h-5 w-5 rounded accent-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4 cursor-pointer hover:bg-slate-700/80 transition">
              <span className="text-sm font-medium text-white">AI Recommendations</span>
              <input
                type="checkbox"
                checked={settings.aiRecommendations}
                onChange={(e) =>
                  setSettings({ ...settings, aiRecommendations: e.target.checked })
                }
                className="h-5 w-5 rounded accent-cyan-500"
              />
            </label>
          </div>
        </div>

        {/* AI Settings */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Brain className="text-cyan-400" size={24} />
            <h2 className="text-2xl font-bold text-white">AI Configuration</h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="aiModel" className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Cloud LLM Model
              </label>
              <select
                id="aiModel"
                value={settings.aiModel}
                onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none"
              >
                <option value="OpenAI GPT-4o-mini (Cloud RAG)">OpenAI GPT-4o-mini (Cloud RAG)</option>
                <option value="OpenAI GPT-4o">OpenAI GPT-4o</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (via OpenRouter)</option>
              </select>
            </div>

            <div>
              <label htmlFor="ocrEngine" className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                OCR & Text Extraction Engine
              </label>
              <select
                id="ocrEngine"
                value={settings.ocrEngine}
                onChange={(e) => setSettings({ ...settings, ocrEngine: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none"
              >
                <option value="Tesseract OCR">Tesseract OCR (Local PyPDF)</option>
                <option value="Google Vision OCR">Google Vision OCR</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Shield className="text-green-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Security & Access</h2>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4 cursor-pointer hover:bg-slate-700/80 transition">
              <span className="text-sm font-medium text-white">Two-Factor Authentication</span>
              <input
                type="checkbox"
                checked={settings.twoFactor}
                onChange={(e) => setSettings({ ...settings, twoFactor: e.target.checked })}
                className="h-5 w-5 rounded accent-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl bg-slate-800 p-4 cursor-pointer hover:bg-slate-700/80 transition">
              <span className="text-sm font-medium text-white">Login Security Alerts</span>
              <input
                type="checkbox"
                checked={settings.loginAlerts}
                onChange={(e) => setSettings({ ...settings, loginAlerts: e.target.checked })}
                className="h-5 w-5 rounded accent-cyan-500"
              />
            </label>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Moon className="text-violet-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Appearance & Region</h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="theme" className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Interface Theme
              </label>
              <select
                id="theme"
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none"
              >
                <option value="Dark (NEXORA Cyberpunk Navy)">Dark (NEXORA Cyberpunk Navy)</option>
                <option value="High Contrast Dark">High Contrast Dark</option>
              </select>
            </div>

            <div>
              <label htmlFor="language" className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                Display Language
              </label>
              <select
                id="language"
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white focus:border-cyan-500 outline-none"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:border-white hover:text-white transition"
          >
            <RotateCcw size={16} />
            Reset Defaults
          </button>

          <button
            type="submit"
            className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 transition"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}