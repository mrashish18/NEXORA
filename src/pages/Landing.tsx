import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Trusted from "../components/Trusted";
import Features from "../components/Features";
import Workflow from "../components/Workflow";
import DashboardPreview from "../components/DashboardPreview";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <Hero />

      <Trusted />

      <Features />

      <Workflow />

      <DashboardPreview />

      <Footer />

    </main>
  );
}