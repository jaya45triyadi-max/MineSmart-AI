// MINE SMART AI - Fuel Consumption & Efficiency Analytics View
// Deep-dive analysis on Fuel/km, Fuel/hour, Fuel/ton, and fleet equipment efficiency

import React, { useState } from "react";
import {
  Gauge,
  Truck,
  Zap,
  BarChart2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Award,
  Calendar,
  Layers,
  Fuel,
  ArrowUpRight
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell
} from "recharts";
import { FuelConsumptionRecord } from "../../types/fuelTypes";

interface FuelConsumptionEfficiencyViewProps {
  records: FuelConsumptionRecord[];
}

export const FuelConsumptionEfficiencyView: React.FC<FuelConsumptionEfficiencyViewProps> = ({ records }) => {
  const [activeSubTab, setActiveSubTab] = useState<"equipment" | "hour" | "ton" | "km" | "truck" | "excavator">("hour");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = records.filter(r => {
    return (
      r.equipmentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.equipmentType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Chart datasets
  const hourData = records
    .filter(r => r.fuelPerHour && r.fuelPerHour > 0)
    .map(r => ({
      code: r.equipmentCode,
      actual: r.fuelPerHour,
      target: r.equipmentCode.includes("EX") ? 85.0 : 42.0,
      unit: "L/Hr"
    }));

  const tonData = records
    .filter(r => r.fuelPerTon && r.fuelPerTon > 0)
    .map(r => ({
      code: r.equipmentCode,
      actual: r.fuelPerTon,
      target: r.equipmentCode.includes("EX") ? 0.38 : 0.88,
      unit: "L/Ton"
    }));

  const kmData = records
    .filter(r => r.fuelPerKm && r.fuelPerKm > 0)
    .map(r => ({
      code: r.equipmentCode,
      actual: r.fuelPerKm,
      target: 1.95,
      unit: "L/km"
    }));

  return (
    <div className="space-y-6">
      {/* Top Banner KPIs for 3 Key Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Rata-rata Fuel / Hour</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2 font-mono">
            43.1 <span className="text-xs text-slate-400 font-normal">L/Hr</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Target Fleet: 45.0 L/Hr (Optimal)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Rata-rata Fuel / Ton</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2 font-mono">
            0.81 <span className="text-xs text-slate-400 font-normal">L/Ton Coal</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Target: 0.88 L/Ton (Saving +8.0%)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Rata-rata Fuel / KM</span>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-400 mt-2 font-mono">
            1.95 <span className="text-xs text-slate-400 font-normal">L/km Hauler</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
            Benchmark: 1.90 - 2.05 L/km (Normal)
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-lg">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab("hour")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "hour" ? "bg-amber-500 text-slate-950 font-black shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            ⚡ Fuel / Hour Index (L/h)
          </button>
          <button
            onClick={() => setActiveSubTab("ton")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "ton" ? "bg-amber-500 text-slate-950 font-black shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            ⛏️ Fuel / Ton Index (L/t)
          </button>
          <button
            onClick={() => setActiveSubTab("km")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "km" ? "bg-amber-500 text-slate-950 font-black shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            🚚 Fuel / KM Index (L/km)
          </button>
          <button
            onClick={() => setActiveSubTab("equipment")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "equipment" ? "bg-amber-500 text-slate-950 font-black shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            📋 All Equipment Cards
          </button>
          <button
            onClick={() => setActiveSubTab("truck")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "truck" ? "bg-amber-500 text-slate-950 font-black shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Haul Trucks
          </button>
          <button
            onClick={() => setActiveSubTab("excavator")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "excavator" ? "bg-amber-500 text-slate-950 font-black shadow-md" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Excavators & Shovels
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari kode unit..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* VIEW 1: FUEL / HOUR (L/H) */}
      {activeSubTab === "hour" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Fuel Consumption per Operating Hour (Liters / Hour)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Perbandingan laju konsumsi solar aktual terhadap target standar per unit</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="code" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} />
                  <Legend />
                  <Bar dataKey="actual" name="Actual Fuel / Hour (L/h)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target Baseline (L/h)" fill="#64748b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(r => (
              <div key={r.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-amber-400 text-sm">{r.equipmentCode}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{r.operatingHours || 0} Jam Kerja</span>
                </div>
                <div className="text-2xl font-black font-mono text-white">
                  {r.fuelPerHour ? `${r.fuelPerHour}` : "0"} <span className="text-xs text-slate-400 font-normal">L/Hr</span>
                </div>
                <div className="text-xs text-slate-400">{r.equipmentType}</div>
                <div className="pt-2 border-t border-slate-800 text-[11px] flex justify-between text-slate-400 font-mono">
                  <span>Total Solar: {r.fuelLiters} L</span>
                  <span className="text-emerald-400 font-bold">{r.sourceType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: FUEL / TON (L/TON) */}
      {activeSubTab === "ton" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  Fuel Consumption per Ton of Coal & BCM of Overburden (L/Ton & L/BCM)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Indeks intensitas energi produksi tambang terhadap output tonase batubara</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="code" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} />
                  <Legend />
                  <Bar dataKey="actual" name="Actual Fuel / Ton (L/t)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target Target (L/t)" fill="#64748b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map(r => (
              <div key={r.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-emerald-400 text-sm">{r.equipmentCode}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{r.productionTon || 0} Ton Coal</span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  {r.fuelPerTon ? `${r.fuelPerTon}` : "-"} <span className="text-xs text-slate-400 font-normal">L/Ton</span>
                </div>
                <div className="text-xs text-slate-400">{r.equipmentType}</div>
                <div className="pt-2 border-t border-slate-800 text-[11px] flex justify-between text-slate-400 font-mono">
                  <span>OB BCM: {r.productionBCM || "-"}</span>
                  <span className="text-amber-400 font-bold">{r.fuelPerBcm ? `${r.fuelPerBcm} L/BCM` : "-"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: FUEL / KM (L/KM) */}
      {activeSubTab === "km" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-sky-400" />
                  Fuel Consumption per Kilometer Distance (Liters / KM)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Indeks konsumsi solar per jarak tempuh hauling armada Dump Truck</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kmData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="code" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} />
                  <Legend />
                  <Bar dataKey="actual" name="Actual Fuel / KM (L/km)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target Haulage (L/km)" fill="#64748b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.filter(r => r.fuelPerKm && r.fuelPerKm > 0).map(r => (
              <div key={r.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sky-400 text-sm">{r.equipmentCode}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{r.distanceKm || 0} km</span>
                </div>
                <div className="text-2xl font-black font-mono text-sky-400">
                  {r.fuelPerKm} <span className="text-xs text-slate-400 font-normal">L/km</span>
                </div>
                <div className="text-xs text-slate-400">{r.equipmentType}</div>
                <div className="pt-2 border-t border-slate-800 text-[11px] flex justify-between text-slate-400 font-mono">
                  <span>Trips: {r.tripsCount || "-"}</span>
                  <span className="text-amber-400 font-bold">{r.fuelPerTrip || "-"} L/Trip</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: ALL EQUIPMENT CARDS */}
      {activeSubTab === "equipment" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(r => (
            <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-400" /> {r.equipmentCode}
                  </h3>
                  <p className="text-xs text-slate-400">{r.equipmentType}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {r.sourceType}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Total Solar</div>
                  <div className="text-base font-black text-amber-400 mt-0.5">{r.fuelLiters} Liter</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Operating Hours</div>
                  <div className="text-base font-bold text-slate-200 mt-0.5">{r.operatingHours || 0} Jam</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Fuel / Hour</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    {r.fuelPerHour ? `${r.fuelPerHour} L/Hr` : "-"}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Fuel / Ton</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    {r.fuelPerTon ? `${r.fuelPerTon} L/Ton` : "-"}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                <span>Distance: {r.distanceKm ? `${r.distanceKm} km` : "-"}</span>
                <span>Fuel/KM: <strong className="text-sky-400 font-mono">{r.fuelPerKm ? `${r.fuelPerKm} L/km` : "-"}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 5: TRUCKS */}
      {activeSubTab === "truck" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            Truck Hauling Fuel & Efficiency Index Table
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Truck Code</th>
                  <th className="px-4 py-3">Fuel Consumed</th>
                  <th className="px-4 py-3">Trips</th>
                  <th className="px-4 py-3">Distance</th>
                  <th className="px-4 py-3">Production Tonnage</th>
                  <th className="px-4 py-3 text-right">Fuel / Trip</th>
                  <th className="px-4 py-3 text-right">Fuel / Ton</th>
                  <th className="px-4 py-3 text-right">Fuel / KM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {filtered.filter(r => r.equipmentCode.includes("HT")).map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-bold text-amber-300">{r.equipmentCode}</td>
                    <td className="px-4 py-3 font-mono text-amber-400 font-bold">{r.fuelLiters} L</td>
                    <td className="px-4 py-3">{r.tripsCount || 0} Trips</td>
                    <td className="px-4 py-3">{r.distanceKm || 0} km</td>
                    <td className="px-4 py-3">{r.productionTon || 0} Ton</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-200">{r.fuelPerTrip || "-"} L/Trip</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-400">{r.fuelPerTon || "-"} L/Ton</td>
                    <td className="px-4 py-3 text-right font-bold text-sky-400">{r.fuelPerKm || "-"} L/km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 6: EXCAVATORS */}
      {activeSubTab === "excavator" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Excavator & Hydraulic Shovel Fuel Efficiency Table
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Excavator Code</th>
                  <th className="px-4 py-3">Type / Model</th>
                  <th className="px-4 py-3">Operating Hours</th>
                  <th className="px-4 py-3">OB Production (BCM)</th>
                  <th className="px-4 py-3">Coal Production (Ton)</th>
                  <th className="px-4 py-3 text-right">Fuel / Hour</th>
                  <th className="px-4 py-3 text-right">Fuel / BCM</th>
                  <th className="px-4 py-3 text-right">Fuel / Ton</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {filtered.filter(r => r.equipmentCode.includes("EX")).map(r => (
                  <tr key={r.id} className="hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-bold text-amber-300">{r.equipmentCode}</td>
                    <td className="px-4 py-3 font-sans">{r.equipmentType}</td>
                    <td className="px-4 py-3">{r.operatingHours || 0} Jam</td>
                    <td className="px-4 py-3">{r.productionBCM ? `${r.productionBCM} BCM` : "-"}</td>
                    <td className="px-4 py-3">{r.productionTon ? `${r.productionTon} Ton` : "-"}</td>
                    <td className="px-4 py-3 text-right font-bold text-amber-400">{r.fuelPerHour} L/Hr</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-400">{r.fuelPerBcm || "-"} L/BCM</td>
                    <td className="px-4 py-3 text-right font-bold text-sky-400">{r.fuelPerTon || "-"} L/Ton</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
