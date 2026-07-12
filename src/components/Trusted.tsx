export default function Trusted() {
  const stats = [
    {
      title: "Projects Managed",
      value: "500+",
    },
    {
      title: "Vendors Connected",
      value: "1,200+",
    },
    {
      title: "Prediction Accuracy",
      value: "98%",
    },
    {
      title: "Documents Processed",
      value: "2.5M+",
    },
  ];

  const companies = [
    "Infrastructure Co.",
    "BuildTech",
    "MetroWorks",
    "CivilCore",
    "Skyline Infra",
    "FutureBuild",
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24">

      {/* Top Divider */}

      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-8">

        {/* Heading */}

        <div className="text-center">

          <p className="text-cyan-400 font-semibold tracking-widest uppercase">
            Trusted Technology
          </p>

          <h2 className="mt-4 text-5xl font-black text-white">
            Built for Modern Construction Teams
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-400">
            NEXORA empowers procurement teams, project managers,
            logistics coordinators and site engineers with AI-driven
            insights for smarter construction supply chains.
          </p>

        </div>

        {/* Companies */}

        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">

          {companies.map((company) => (
            <div
              key={company}
              className="rounded-2xl border border-white/10 bg-white/5 py-6 text-center text-lg font-semibold text-slate-300 transition duration-300 hover:border-cyan-500 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              {company}
            </div>
          ))}

        </div>

        {/* Statistics */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {stats.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/20"
            >
              <h3 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {item.value}
              </h3>

              <p className="mt-4 text-lg text-slate-400">
                {item.title}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}