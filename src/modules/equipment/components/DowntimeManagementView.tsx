// MINE SMART AI - Downtime Management, MTBF, MTTR & Ranking View

import React, { useState } from "react";
import { Wrench, AlertTriangle, Clock, Activity, Plus, CheckCircle2 } from "lucide-react";
import { EquipmentDowntimeRecord, DowntimeCategory } from "../../../types/equipmentTypes";
import { INITIAL_DOWNTIME_RECORDS } from "../../../data/equipmentData";

export const DowntimeManagementView: React.FC = () => {
  const [records, setRecords] = useState<EquipmentDowntimeRecord[]>(INITIAL_DOWNTIME_RECORDS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [unitCode, setUnitCode] = useState("EX-204");
  const [category, setCategory] = useState<DowntimeCategory>("Hydraulic");
  const [description, setDescription] = useState("");
  const [downHours, setDownHours] = useState(12.0);

  const handleCreateDowntime = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: EquipmentDowntimeRecord = {
      id: `DT-REC-${Date.now()}`,
      equipmentId: `EQ-${unitCode}`,
      unitCode,
      category,
      componentAffected: "Component Inspection",
      description: description || "Breakdown incident logged",
      startTime: new Date().toISOString(),
      downHours,
      status: "In Repair",
      reportedBy: "Dispatch Supervisor",
    };
    setRecords([newRecord, ...records]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-rose-400" />
            <span>DOWNTIME MANAGEMENT, MTBF, MTTR & RANKING</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pencatatan Perbaikan, Kategori Gangguan, Indikator MTBF (Reliability), MTTR (Maintainability), & Peringkat Unit Down
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Laporkan Downtime Unit</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] text-slate-400 font-sans block">Total Down Hours</span>
          <span className="text-2xl font-black text-rose-400">
            {records.reduce((sum, r) => sum + r.downHours, 0)} Jam
          </span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] text-slate-400 font-sans block">Mean Time Between Failures (MTBF)</span>
          <span className="text-2xl font-black text-emerald-400">142.5 h</span>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
          <span className="text-[11px] text-slate-400 font-sans block">Mean Time To Repair (MTTR)</span>
          <span className="text-2xl font-black text-sky-400">3.8 h</span>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800 uppercase tracking-wider">
                <th className="py-3 px-4">Unit Code</th>
                <th className="py-3 px-4">Kategori Gangguan</th>
                <th className="py-3 px-4">Komponen Terdampak</th>
                <th className="py-3 px-4">Deskripsi</th>
                <th className="py-3 px-4 text-right">Down Hours</th>
                <th className="py-3 px-4">Status Repair</th>
                <th className="py-3 px-4">Mekanik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{rec.unitCode}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-300 rounded font-mono">
                      {rec.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono">{rec.componentAffected}</td>
                  <td className="py-3 px-4 text-slate-300">{rec.description}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-rose-400">{rec.downHours} h</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded font-mono">
                      {rec.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{rec.mechanicInCharge || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Laporkan Downtime Unit Tambang</span>
            </h3>

            <form onSubmit={handleCreateDowntime} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Unit Code</label>
                <input
                  type="text"
                  value={unitCode}
                  onChange={(e) => setUnitCode(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Kategori Downtime</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-rose-500"
                >
                  <option value="Breakdown">Breakdown</option>
                  <option value="Hydraulic">Hydraulic</option>
                  <option value="Engine">Engine</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Tyre">Tyre</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Down Hours (Jam)</label>
                <input
                  type="number"
                  value={downHours}
                  onChange={(e) => setDownHours(Number(e.target.value))}
                  className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Deskripsi Kerusakan</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl cursor-pointer"
                >
                  Simpan Downtime
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
