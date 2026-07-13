import {
  UploadCloud,
  BrainCircuit,
  BarChart3,
  Lightbulb,
  Building2,
  ArrowDown,
} from "lucide-react";

const steps = [
  {
    icon: <UploadCloud size={34} />,
    title: "Upload Documents",
    description:
      "Upload purchase orders, invoices, contracts, drawings and logistics documents.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: <BrainCircuit size={34} />,
    title: "AI Analysis",
    description:
      "NEXORA understands every document using OCR, LLMs and Construction AI.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: <BarChart3 size={34} />,
    title: "Risk Prediction",
    description:
      "Predict delivery delays, inventory shortages and procurement risks.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: <Lightbulb size={34} />,
    title: "AI Recommendation",
    description:
      "Receive intelligent vendor suggestions and optimized procurement plans.",
    color: "from-orange-500 to-pink-500",
  },
  {
    icon: <Building2 size={34} />,
    title: "Project Delivery",
    description:
      "Keep construction projects on schedule with AI-powered decisions.",
    color: "from-blue-500 to-cyan-600",
  },
];

export default function Workflow() {
  return (
    <section
      id="workflow"
      className="relative overflow-hidden bg-slate-950 py-28"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-8">
        {/* Heading */}
        <div className="text-center">
          <p className="font-semibold uppercase tracking-[0.35em] text-cyan-400">
            Workflow
          </p>

          <h2 className="mt-5 text-5xl font-black text-white">
            How NEXORA Works
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            NEXORA combines Document Intelligence, Predictive Analytics and
            Generative AI into one seamless workflow.
          </p>
        </div>

        {/* Workflow */}
        <div className="mt-24 flex flex-col items-center">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex w-full max-w-4xl flex-col items-center"
            >
              <div className="group w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r ${step.color} text-white shadow-lg`}
                  >
                    {step.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-lg leading-8 text-slate-400">
                      {step.description}
                    </p>
                  </div>

                  <div className="text-6xl font-black text-cyan-500/20">
                    {index + 1}
                  </div>
                </div>
              </div>

              {index !== steps.length - 1 && (
                <div className="my-8 flex h-20 items-center justify-center">
                  <ArrowDown
                    size={34}
                    className="animate-bounce text-cyan-400"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}