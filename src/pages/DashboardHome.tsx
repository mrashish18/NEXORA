import DashboardPreview from "../components/DashboardPreview";

export default function DashboardHome() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Welcome back! Here's your construction intelligence overview.
        </p>
      </div>

      <DashboardPreview />
    </>
  );
}