import {
  BrainCircuit,
  FileText,
  Truck,
  ShieldCheck,
  BarChart3,
  Bot,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

export default function Features() {
  const features = [
    {
      icon: <BrainCircuit size={34} />,
      title: "AI Document Intelligence",
      description:
        "Automatically extract data from purchase orders, invoices, contracts, and delivery challans using AI.",
      color: "from-cyan-500 to-blue-600",
    },

    {
      icon: <Truck size={34} />,
      title: "Supply Chain Prediction",
      description:
        "Predict shipment delays, inventory shortages, logistics risks and project bottlenecks before they happen.",
      color: "from-purple-500 to-indigo-600",
    },

    {
      icon: <FileText size={34} />,
      title: "Smart Procurement",
      description:
        "Analyze vendor quotations, purchase requests and contracts using intelligent AI workflows.",
      color: "from-orange-500 to-pink-500",
    },

    {
      icon: <Bot size={34} />,
      title: "AI Copilot",
      description:
        "Ask questions in natural language and receive instant recommendations powered by Generative AI.",
      color: "from-green-500 to-emerald-600",
    },

    {
      icon: <BarChart3 size={34} />,
      title: "Predictive Analytics",
      description:
        "Visualize project health, vendor performance, delivery timelines and procurement trends.",
      color: "from-blue-500 to-cyan-600",
    },

    {
      icon: <ShieldCheck size={34} />,
      title: "Risk Detection",
      description:
        "Identify procurement risks early and receive proactive AI recommendations to reduce project delays.",
      color: "from-red-500 to-orange-500",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 py-28">

      {/* Top Divider */}

      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      {/* Background Glow */}

      <div className="absolute left-0 top-40 h-80 w-80 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-8">

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Platform Features
          </p>

          <h2 className="mt-5 text-5xl font-black text-white">
            Everything You Need To Build Smarter
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            NEXORA combines Generative AI, Machine Learning,
            Predictive Analytics and Construction Intelligence
            into one powerful platform.
          </p>

        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}

        </div>

      </div>

    </section>
  );
}