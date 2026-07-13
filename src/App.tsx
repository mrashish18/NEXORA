import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Procurement from "./pages/Procurement";
import SupplyChain from "./pages/SupplyChain";
import Vendors from "./pages/Vendors";
import AIAssistant from "./pages/AIAssistant";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Dashboard Pages */}
        <Route path="/documents" element={<Documents />} />
        <Route path="/procurement" element={<Procurement />} />
        <Route path="/supply-chain" element={<SupplyChain />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="/settings" element={<Settings />} />

        {/* Redirect unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}