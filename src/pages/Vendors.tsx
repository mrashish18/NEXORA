import DashboardLayout from "../layouts/DashboardLayout";
import {
  Star,
  TrendingUp,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const vendors = [
  {
    name: "Larsen & Toubro Ltd.",
    rating: 4.9,
    reliability: "98%",
    projects: 148,
    delivery: "97%",
    status: "Approved",
    city: "Mumbai",
  },
  {
    name: "BuildMax Steel Ltd.",
    rating: 4.8,
    reliability: "96%",
    projects: 112,
    delivery: "95%",
    status: "Recommended",
    city: "Bengaluru",
  },
  {
    name: "Ultra Cement Pvt Ltd.",
    rating: 4.7,
    reliability: "95%",
    projects: 186,
    delivery: "94%",
    status: "Approved",
    city: "Hyderabad",
  },
  {
    name: "Shree Infra Supply",
    rating: 4.6,
    reliability: "93%",
    projects: 84,
    delivery: "91%",
    status: "Monitoring",
    city: "Delhi",
  },
];

export default function Vendors() {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div>
          <p className="text-cyan-400 uppercase tracking-[0.35em] text-sm">
            Vendor Intelligence
          </p>

          <h1 className="mt-3 text-5xl font-black text-white">
            Vendor Management
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            AI evaluates supplier performance, pricing trends, delivery
            reliability and procurement history.
          </p>
        </div>

        {/* KPI Cards */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl bg-slate-900 p-6 border border-white/10">
            <p className="text-slate-400">Approved Vendors</p>
            <h2 className="mt-3 text-4xl font-bold text-white">324</h2>
            <p className="mt-2 text-green-400">
              +18 this month
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 border border-white/10">
            <p className="text-slate-400">Average Rating</p>
            <h2 className="mt-3 text-4xl font-bold text-yellow-400">
              4.8 ★
            </h2>
            <p className="mt-2 text-slate-400">
              Enterprise Suppliers
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 border border-white/10">
            <p className="text-slate-400">On-Time Delivery</p>
            <h2 className="mt-3 text-4xl font-bold text-cyan-400">
              96%
            </h2>
            <p className="mt-2 text-slate-400">
              Last 30 Days
            </p>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 border border-white/10">
            <p className="text-slate-400">AI Confidence</p>
            <h2 className="mt-3 text-4xl font-bold text-green-400">
              98%
            </h2>
            <p className="mt-2 text-slate-400">
              Vendor Prediction Model
            </p>
          </div>

        </div>

        {/* Vendor Table */}

        <div className="rounded-3xl border border-white/10 bg-slate-900 overflow-hidden">

          <div className="border-b border-white/10 p-6">

            <h2 className="text-2xl font-bold text-white">
              Top Performing Vendors
            </h2>

          </div>

          <table className="w-full">

            <thead className="bg-slate-950 text-slate-400">

              <tr>
                <th className="p-5 text-left">Vendor</th>
                <th>Rating</th>
                <th>Reliability</th>
                <th>Projects</th>
                <th>Delivery</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {vendors.map((vendor) => (

                <tr
                  key={vendor.name}
                  className="border-t border-white/5 hover:bg-slate-800 transition"
                >
                  <td className="p-5">

                    <div className="font-semibold text-white">
                      {vendor.name}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                      <MapPin size={14} />
                      {vendor.city}
                    </div>

                  </td>

                  <td className="text-yellow-400 font-semibold">
                    {vendor.rating}
                  </td>

                  <td className="text-green-400">
                    {vendor.reliability}
                  </td>

                  <td className="text-white">
                    {vendor.projects}
                  </td>

                  <td className="text-cyan-400">
                    {vendor.delivery}
                  </td>

                  <td>

                    <span className="rounded-full bg-cyan-500/20 px-4 py-1 text-cyan-300">
                      {vendor.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* AI Recommendation */}

        <div className="grid gap-6 xl:grid-cols-2">

          <div className="rounded-3xl bg-slate-900 border border-white/10 p-8">

            <div className="flex items-center gap-3">

              <TrendingUp className="text-cyan-400" />

              <h2 className="text-2xl font-bold text-white">
                AI Recommendation
              </h2>

            </div>

            <p className="mt-6 leading-8 text-slate-300">
              BuildMax Steel Ltd. is predicted to deliver 4 days faster than
              current suppliers while reducing procurement cost by 7%.
            </p>

            <button className="mt-8 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white hover:bg-cyan-600 transition">
              View Vendor
            </button>

          </div>

          <div className="rounded-3xl bg-slate-900 border border-white/10 p-8">

            <div className="flex items-center gap-3">

              <ShieldCheck className="text-green-400" />

              <h2 className="text-2xl font-bold text-white">
                Vendor Contact
              </h2>

            </div>

            <div className="mt-6 space-y-5 text-slate-300">

              <div className="flex items-center gap-3">
                <Phone size={18} />
                +91 98765 43210
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} />
                procurement@nexora.ai
              </div>

              <div className="flex items-center gap-3">
                <Star className="text-yellow-400" />
                Enterprise Gold Partner
              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}