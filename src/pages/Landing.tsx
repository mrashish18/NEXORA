import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Trusted from "../components/Trusted";
import Features from "../components/Features";
import Workflow from "../components/Workflow";
import DashboardPreview from "../components/DashboardPreview";

export default function Landing() {
  return (
    <main className="bg-slate-950">
      <Navbar />
      <Hero />
      <Trusted />
      <Features />
      <Workflow />
      <DashboardPreview />
    </main>
  );
}