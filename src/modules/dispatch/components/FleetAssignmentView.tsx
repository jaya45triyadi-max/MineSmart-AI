// MINE SMART AI - Fleet Assignment & Validation View

import React, { useState } from "react";
import {
  Truck,
  Layers,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Radio,
  Clock,
  ShieldAlert,
} from "lucide-react";

import { DispatchRecord } from "../../../types/dispatchTypes";

interface FleetAssignmentViewProps {
  dispatches: DispatchRecord[];
  onCreateAssignment: (assignment: Partial<DispatchRecord>) => void;
  onUpdateStatus: (dispatchId: string, status: DispatchRecord["dispatchStatus"]) => void;
  onReassign: (dispatchId: string, excavatorCode: string, origin: string, destination: string) => void;
}

export const FleetAssignmentView: React.FC<FleetAssignmentViewProps> = ({
  dispatches,
  onCreateAssignment,
  onUpdateStatus,
  onReassign,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    truckUnitCode: "DT-109",
    excavatorUnitCode: "EX-201",
    operatorName: "Supriadi",
    originName: "Pit 1 South - Seam 2",
    destinationName: "ROM Stockpile 01",
    materialType: "Coal" as const,
    shiftId: "SHIFT-DAY-1",
    priority: "HIGH" as const,
    targetProductionTon: 350,
  });

  // Reassign Modal State
  const [selectedReassign, setSelectedReassign] = useState<DispatchRecord | null>(null);
  const [reassignForm, setReassignForm] = useState({
    excavatorUnitCode: "EX-202",
    originName: "Pit 2 North - OB Waste",
    destinationName: "Waste Dump West",
  });

  const handleValidateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Assignment Validation Logic
    if (formData.truckUnitCode === "DT-999") {
      setValidationError("Assignment Rejected: Truck DT-999 is currently under BREAKDOWN maintenance in Workshop 2.");
      return;
    }

    if (!formData.truckUnitCode || !formData.excavatorUnitCode) {
      setValidationError("Assignment Rejected: Truck Code and Excavator Code are required.");
      return;
    }

    // Pass validation
    onCreateAssignment({
      truckUnitCode: formData.truckUnitCode,
      truckId: `EQ-${formData.truckUnitCode.replace("-", "")}`,
      excavatorUnitCode: formData.excavatorUnitCode,
      excavatorId: `EQ-${formData.excavatorUnitCode.replace("-", "")}`,
      operatorName: formData.operatorName,
      operatorId: "OP-099",
      originName: formData.originName,
      originId: "PIT-ORIGIN",
      destinationName: formData.destinationName,
      destinationId: "DEST-ROM",
      materialType: formData.materialType,
      shiftId: formData.shiftId,
      priority: formData.priority,
      targetProductionTon: Number(formData.targetProductionTon) || 300,
      actualProductionTon: 0,
      tripCount: 0,
      dispatchStatus: "Assigned",
      assignmentStatus: "ACTIVE",
      queueTimeMin: 0,
      loadingTimeMin: 0,
      haulingTimeMin: 0,
      dumpingTimeMin: 0,
      returnTimeMin: 0,
      totalCycleTimeMin: 30.0,
      lastUpdateTimestamp: new Date().toISOString(),
      companyId: "COMP-BNU-01",
      siteId: "SITE-KAL-A",
      date: new Date().toISOString().split("T")[0],
    });

    setIsModalOpen(false);
  };

  const handleConfirmReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedReassign) {
      onReassign(
        selectedReassign.dispatchId,
        reassignForm.excavatorUnitCode,
        reassignForm.originName,
        reassignForm.destinationName
      );
      setSelectedReassign(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              FLEET DISPATCH ASSIGNMENT MANAGEMENT
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manajemen penugasan armada dump truck ke excavator loading bay dengan sistem validasi ketersediaan otomatis
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Buat Fleet Assignment Baru</span>
        </button>
      </div>

      {/* Assignment List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase font-mono">
            DAFTAR FLEET ASSIGNMENT AKTIF ({dispatches.length})
          </h4>
          <span className="text-[10px] text-emerald-400 font-mono">Validation Status: ALL PASSED</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Truck Unit</th>
                <th className="p-3">Excavator Digger</th>
                <th className="p-3">Operator</th>
                <th className="p-3">Origin Pit</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Material</th>
                <th className="p-3">Target (Ton)</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {dispatches.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-amber-300">{d.truckUnitCode}</td>
                  <td className="p-3 font-bold text-slate-200">{d.excavatorUnitCode}</td>
                  <td className="p-3 text-slate-300">{d.operatorName}</td>
                  <td className="p-3 text-slate-400">{d.originName}</td>
                  <td className="p-3 text-slate-400">{d.destinationName}</td>
                  <td className="p-3 font-semibold text-emerald-400">{d.materialType}</td>
                  <td className="p-3 text-slate-200 font-bold">{d.targetProductionTon}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${
                        d.priority === "HIGH" || d.priority === "URGENT"
                          ? "bg-rose-500/20 text-rose-300"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {d.priority}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      {d.dispatchStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1">
                    <button
                      onClick={() => {
                        setSelectedReassign(d);
                        setReassignForm({
                          excavatorUnitCode: d.excavatorUnitCode,
                          originName: d.originName,
                          destinationName: d.destinationName,
                        });
                      }}
                      className="px-2 py-1 bg-indigo-950 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-bold hover:bg-indigo-900 cursor-pointer"
                    >
                      Reassign
                    </button>
                    <button
                      onClick={() => onUpdateStatus(d.dispatchId, "Cancelled")}
                      className="px-2 py-1 bg-rose-950 text-rose-300 border border-rose-500/30 rounded text-[10px] font-bold hover:bg-rose-900 cursor-pointer"
                    >
                      Hold/Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Truck className="w-5 h-5" />
                <h3>NEW FLEET ASSIGNMENT & VALIDATION</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            {validationError && (
              <div className="bg-rose-950/60 border border-rose-500/50 p-3 rounded-xl flex items-start gap-2 text-rose-200 text-xs">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">ASSIGNMENT REJECTED</strong>
                  <span>{validationError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleValidateAndSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Truck Unit Code</label>
                  <input
                    type="text"
                    value={formData.truckUnitCode}
                    onChange={(e) => setFormData({ ...formData, truckUnitCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    placeholder="Contoh: DT-109"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Excavator Digger Code</label>
                  <select
                    value={formData.excavatorUnitCode}
                    onChange={(e) => setFormData({ ...formData, excavatorUnitCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  >
                    <option value="EX-201">EX-201 (Komatsu PC1250 - Pit 1)</option>
                    <option value="EX-202">EX-202 (CAT 6015B - Pit 2)</option>
                    <option value="EX-203">EX-203 (Hitachi EX1200 - Pit 3)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Nama Operator Truck</label>
                  <input
                    type="text"
                    value={formData.operatorName}
                    onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Jenis Material</label>
                  <select
                    value={formData.materialType}
                    onChange={(e) => setFormData({ ...formData, materialType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Coal">Coal (Batu Bara)</option>
                    <option value="Overburden">Overburden (OB)</option>
                    <option value="Interburden">Interburden</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Origin Pit Location</label>
                  <input
                    type="text"
                    value={formData.originName}
                    onChange={(e) => setFormData({ ...formData, originName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Destination Dumping Point</label>
                  <input
                    type="text"
                    value={formData.destinationName}
                    onChange={(e) => setFormData({ ...formData, destinationName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Target Production (Ton)</label>
                  <input
                    type="number"
                    value={formData.targetProductionTon}
                    onChange={(e) => setFormData({ ...formData, targetProductionTon: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 cursor-pointer"
                >
                  Validate & Assign Fleet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      {selectedReassign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-indigo-400 uppercase">
                REASSIGN TRUCK [{selectedReassign.truckUnitCode}]
              </h3>
              <button onClick={() => setSelectedReassign(null)} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmReassign} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target Excavator Baru</label>
                <select
                  value={reassignForm.excavatorUnitCode}
                  onChange={(e) => setReassignForm({ ...reassignForm, excavatorUnitCode: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                >
                  <option value="EX-201">EX-201 (Pit 1 South)</option>
                  <option value="EX-202">EX-202 (Pit 2 North)</option>
                  <option value="EX-203">EX-203 (Pit 3 East)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Lokasi Origin Baru</label>
                <input
                  type="text"
                  value={reassignForm.originName}
                  onChange={(e) => setReassignForm({ ...reassignForm, originName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Tujuan Dumping Baru</label>
                <input
                  type="text"
                  value={reassignForm.destinationName}
                  onChange={(e) => setReassignForm({ ...reassignForm, destinationName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedReassign(null)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 text-slate-300 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 cursor-pointer"
                >
                  Terapkan Reassign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
