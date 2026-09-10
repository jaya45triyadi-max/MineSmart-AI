import React, { useState } from "react";
import {
  Truck,
  Search,
  Scale,
  AlertTriangle,
  User,
  History,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { WeighbridgeVehicle, WeighbridgeTicket } from "../../../types/weighbridgeTypes";

interface WeighbridgeVehiclesTabProps {
  vehicles: WeighbridgeVehicle[];
  tickets: WeighbridgeTicket[];
}

export const WeighbridgeVehiclesTab: React.FC<WeighbridgeVehiclesTabProps> = ({
  vehicles,
  tickets,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [selectedVehicle, setSelectedVehicle] = useState<WeighbridgeVehicle | null>(null);

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.operatorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "ALL" || v.vehicleType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-500" />
            Integrasi Kendaraan Armada & Profil Penimbangan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pusat riwayat penimbangan per unit truk, analisis drift tare weight, kepatuhan beban muatan, dan data operator resmi.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-600 dark:text-slate-300">
          <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            Total Armada: <strong className="text-emerald-500">{vehicles.length} Unit</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Unit Truk, No. Reg, Driver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Tipe Kendaraan:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          >
            <option value="ALL">Semua Tipe Armada</option>
            <option value="DUMP_TRUCK">Dump Truck</option>
            <option value="TRAILER">Trailer</option>
            <option value="LIGHT_VEHICLE">Light Vehicle</option>
          </select>
        </div>
      </div>

      {/* Vehicles Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((veh) => {
          const vehTickets = tickets.filter((t) => t.vehicleId === veh.vehicleId || t.unitNumber === veh.unitNumber);
          const overloadCount = vehTickets.filter((t) => t.isOverload).length;

          return (
            <div
              key={veh.vehicleId}
              className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{veh.unitNumber}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">{veh.registrationNumber}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {veh.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">TIPE & FLEET</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{veh.vehicleType} ({veh.fleetNumber})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">OPERATOR / DRIVER</span>
                    <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                      <User className="w-3 h-3 text-sky-500" />
                      {veh.operatorName}
                    </span>
                  </div>
                </div>

                {/* Capacity & Tare Performance */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">KAPASITAS</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{veh.capacity} Ton</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">STD TARE</span>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{(veh.tareWeightStandard / 1000).toFixed(1)} T</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block text-emerald-500 font-bold">TOTAL TODAY</span>
                    <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">{veh.totalWeightToday} T</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Trip Hari Ini: <strong className="text-slate-900 dark:text-white">{veh.transactionCountToday} Trip</strong></span>
                  {overloadCount > 0 ? (
                    <span className="text-rose-500 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {overloadCount} Overload
                    </span>
                  ) : (
                    <span className="text-emerald-500 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Compliant Load
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedVehicle(veh)}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <History className="w-3.5 h-3.5" />
                Lihat Riwayat Penimbangan Unit
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal: Vehicle Weighing History */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-500" />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Riwayat Penimbangan {selectedVehicle.unitNumber}</h3>
                  <p className="text-xs text-slate-400">Reg: {selectedVehicle.registrationNumber} | Driver: {selectedVehicle.operatorName}</p>
                </div>
              </div>
              <button onClick={() => setSelectedVehicle(null)} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>

            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-900 uppercase font-semibold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">No. Tiket</th>
                    <th className="py-2.5 px-3">Material</th>
                    <th className="py-2.5 px-3">Gross (kg)</th>
                    <th className="py-2.5 px-3">Tare (kg)</th>
                    <th className="py-2.5 px-3 font-bold text-emerald-500">Net (Ton)</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tickets
                    .filter((t) => t.vehicleId === selectedVehicle.vehicleId || t.unitNumber === selectedVehicle.unitNumber)
                    .map((t) => (
                      <tr key={t.ticketId}>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">{t.ticketNumber}</td>
                        <td className="py-2.5 px-3">{t.materialType}</td>
                        <td className="py-2.5 px-3 font-mono">{t.grossWeight.toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-mono">{t.tareWeight.toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{t.normalizedValue} T</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.isOverload ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>
                            {t.isOverload ? "OVERLOAD" : t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
