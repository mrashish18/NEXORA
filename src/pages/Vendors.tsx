import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  Star,
  TrendingUp,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  CheckCircle,
} from "lucide-react";

interface VendorData {
  name: string;
  rating: number;
  reliability: string;
  projects: number;
  delivery: string;
  status: "Approved" | "Recommended" | "Monitoring";
  city: string;
  phone: string;
  email: string;
}

const initialVendors: VendorData[] = [
  {
    name: "Larsen & Toubro Ltd.",
    rating: 4.9,
    reliability: "98%",
    projects: 148,
    delivery: "97%",
    status: "Approved",
    city: "Mumbai",
    phone: "+91 22 6752 5656",
    email: "infra@larsentoubro.com",
  },
  {
    name: "BuildMax Steel Ltd.",
    rating: 4.8,
    reliability: "96%",
    projects: 112,
    delivery: "95%",
    status: "Recommended",
    city: "Bengaluru",
    phone: "+91 80 4123 7890",
    email: "supply@buildmaxsteel.com",
  },
  {
    name: "Ultra Cement Pvt Ltd.",
    rating: 4.7,
    reliability: "95%",
    projects: 186,
    delivery: "94%",
    status: "Approved",
    city: "Hyderabad",
    phone: "+91 40 2345 6789",
    email: "commercial@ultracement.in",
  },
  {
    name: "Shree Infra Supply",
    rating: 4.6,
    reliability: "93%",
    projects: 84,
    delivery: "91%",
    status: "Monitoring",
    city: "Delhi",
    phone: "+91 11 2678 9012",
    email: "contact@shreeinfra.org",
  },
];

export default function Vendors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedVendor, setSelectedVendor] = useState<VendorData>(initialVendors[1]); // Default BuildMax

  const filteredVendors = initialVendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "All" || v.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-cyan-400 uppercase tracking-[0.35em] text-sm font-semibold">
            Vendor Intelligence
          </p>

          <h1 className="mt-2 text-3xl sm:text-5xl font-black text-white">
            Vendor Management
          </h1>

          <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-400">
            AI evaluates supplier performance, pricing trends, delivery reliability and procurement history.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-slate-900 p-6 border border-white/10">
            <p className="text-slate-400 text-sm">Approved Vendors</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">324</h2>
            <p className="mt-2 text-xs sm:text-sm text-green-400 font-medium">+18 this month</p>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 border border-white/10">
            <p className="text-slate-400 text-sm">Average Rating</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-yellow-400">4.8 ★</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">Enterprise Suppliers</p>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 border border-white/10">
            <p className="text-slate-400 text-sm">On-Time Delivery</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-cyan-400">96%</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">Last 30 Days</p>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 border border-white/10">
            <p className="text-slate-400 text-sm">AI Confidence</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-green-400">98%</h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">Vendor Prediction Model</p>
          </div>
        </div>

        {/* Vendor Search & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendor name or city..."
              className="w-full rounded-xl border border-white/10 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter size={16} className="text-slate-400 shrink-0 hidden sm:block" />
            {["All", "Approved", "Recommended", "Monitoring"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition shrink-0 ${
                  statusFilter === status
                    ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                    : "border border-white/10 bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Vendor Table with responsive overflow protection */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 overflow-hidden shadow-xl">
          <div className="border-b border-white/10 p-6 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Top Performing Vendors
            </h2>
            <span className="text-xs text-slate-400">
              Showing {filteredVendors.length} of {initialVendors.length}
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-slate-950 text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="p-4 sm:p-5">Vendor</th>
                  <th className="p-4 sm:p-5">Rating</th>
                  <th className="p-4 sm:p-5">Reliability</th>
                  <th className="p-4 sm:p-5">Projects</th>
                  <th className="p-4 sm:p-5">Delivery</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 text-sm">
                {filteredVendors.map((vendor) => {
                  const isSelected = selectedVendor.name === vendor.name;
                  return (
                    <tr
                      key={vendor.name}
                      onClick={() => setSelectedVendor(vendor)}
                      className={`cursor-pointer transition ${
                        isSelected
                          ? "bg-cyan-950/40 border-l-4 border-cyan-400"
                          : "hover:bg-slate-800/80"
                      }`}
                    >
                      <td className="p-4 sm:p-5">
                        <div className="font-semibold text-white flex items-center gap-2">
                          {vendor.name}
                          {isSelected && <CheckCircle size={14} className="text-cyan-400" />}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <MapPin size={12} />
                          {vendor.city}
                        </div>
                      </td>

                      <td className="p-4 sm:p-5 text-yellow-400 font-semibold">
                        {vendor.rating} ★
                      </td>

                      <td className="p-4 sm:p-5 text-green-400 font-medium">
                        {vendor.reliability}
                      </td>

                      <td className="p-4 sm:p-5 text-white font-mono">
                        {vendor.projects}
                      </td>

                      <td className="p-4 sm:p-5 text-cyan-400 font-medium">
                        {vendor.delivery}
                      </td>

                      <td className="p-4 sm:p-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            vendor.status === "Approved"
                              ? "bg-green-500/20 text-green-300"
                              : vendor.status === "Recommended"
                              ? "bg-cyan-500/20 text-cyan-300"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {vendor.status}
                        </span>
                      </td>

                      <td className="p-4 sm:p-5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedVendor(vendor);
                          }}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                            isSelected
                              ? "bg-cyan-500 text-white"
                              : "border border-white/10 bg-slate-800 text-slate-300 hover:text-white"
                          }`}
                        >
                          {isSelected ? "Active" : "Inspect"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vendor Detail & AI Recommendation Grid */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* AI Recommendation Panel */}
          <div className="rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-cyan-400" size={24} />
              <h2 className="text-2xl font-bold text-white">
                AI Recommendation
              </h2>
            </div>

            <p className="mt-6 leading-relaxed text-slate-300 text-sm sm:text-base">
              <strong className="text-white">BuildMax Steel Ltd.</strong> is predicted to deliver 4 days faster than
              alternative regional suppliers while reducing procurement cost by 7%.
            </p>

            <button
              type="button"
              onClick={() => {
                const buildMax = initialVendors.find((v) => v.name.includes("BuildMax"));
                if (buildMax) setSelectedVendor(buildMax);
              }}
              className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white hover:bg-cyan-600 transition active:scale-95 text-sm"
            >
              Select & Inspect BuildMax
            </button>
          </div>

          {/* Active Vendor Contact Panel */}
          <div className="rounded-3xl bg-slate-900 border border-white/10 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-400" size={24} />
                <h2 className="text-2xl font-bold text-white">
                  Vendor Dossier
                </h2>
              </div>
              <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/20">
                {selectedVendor.status}
              </span>
            </div>

            <h3 className="mt-4 text-xl font-bold text-white">
              {selectedVendor.name}
            </h3>

            <div className="mt-4 space-y-3.5 text-slate-300 text-sm">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-cyan-400 shrink-0" />
                <span>Operating Hub: {selectedVendor.city}, India</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={16} className="text-cyan-400 shrink-0" />
                <span>{selectedVendor.phone}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={16} className="text-cyan-400 shrink-0" />
                <span>{selectedVendor.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Star size={16} className="text-yellow-400 shrink-0" />
                <span>Verified Partner • {selectedVendor.projects} Completed Construction Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}