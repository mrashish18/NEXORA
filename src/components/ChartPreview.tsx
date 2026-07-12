export default function ChartPreview() {
  const revenue = [45, 62, 58, 80, 74, 96, 88];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div
      className="
      rounded-3xl
      border
      border-white/10
      bg-white/5
      p-6
      backdrop-blur-xl
    "
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wider text-slate-400">
            AI Analytics
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Weekly Procurement Health
          </h2>
        </div>

        <div className="rounded-xl bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
          Live
        </div>
      </div>

      {/* Graph */}

      <div className="mt-10 flex h-56 items-end justify-between gap-3">

        {revenue.map((item, index) => (
          <div
            key={index}
            className="flex flex-1 flex-col items-center"
          >
            <div
              className="
                w-full
                rounded-t-xl
                bg-gradient-to-t
                from-cyan-500
                to-blue-500
                transition-all
                duration-500
                hover:scale-105
              "
              style={{
                height: `${item * 1.8}px`,
              }}
            />

            <p className="mt-3 text-sm text-slate-400">
              {days[index]}
            </p>
          </div>
        ))}

      </div>

      {/* Footer */}

      <div className="mt-8 grid grid-cols-3 gap-4">

        <div className="rounded-2xl bg-slate-800/60 p-4">
          <p className="text-sm text-slate-400">
            Documents
          </p>

          <h3 className="mt-2 text-2xl font-bold text-white">
            1,248
          </h3>
        </div>

        <div className="rounded-2xl bg-slate-800/60 p-4">
          <p className="text-sm text-slate-400">
            Vendors
          </p>

          <h3 className="mt-2 text-2xl font-bold text-green-400">
            324
          </h3>
        </div>

        <div className="rounded-2xl bg-slate-800/60 p-4">
          <p className="text-sm text-slate-400">
            Accuracy
          </p>

          <h3 className="mt-2 text-2xl font-bold text-cyan-400">
            98%
          </h3>
        </div>

      </div>
    </div>
  );
}