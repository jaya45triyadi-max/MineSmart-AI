// MINE SMART AI - Operator Management & License Validation View

import React, { useState } from "react";
import { Users, ShieldCheck, AlertTriangle, Plus, CheckCircle2, UserCheck, Key, Clock } from "lucide-react";
import { Operator, Equipment } from "../../../types/equipmentTypes";
import { INITIAL_OPERATORS } from "../../../data/equipmentData";

interface OperatorManagementViewProps {
  equipmentList: Equipment[];
}

export const OperatorManagementView: React.FC<OperatorManagementViewProps> = ({ equipmentList }) => {
  const [operators, setOperators] = useState<Operator[]>(INITIAL_OPERATORS);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedUnitCode, setSelectedUnitCode] = useState("EX-201");
  const [assignError, setAssignError] = useState("");

  const handleAssignOperator = (e: React.FormEvent) => {
    e.preventDefault();
    setAssignError("");

    if (!selectedOperator) return;

    // Operator Validation: Block if license is expired or status inactive
    if (selectedOperator.status === "EXPIRED_LICENSE" || selectedOperator.status === "INACTIVE") {
      setAssignError(`TINDAKAN DIBLOKIR: Lisensi K3/SIO Operator '${selectedOperator.name}' sudah kadaluwarsa atau status tidak aktif. Operasi penugasan ditolak.`);
      return;
    }

    // Assign unit
    const updated = operators.map((op) =>
      op.id === selectedOperator.id ? { ...op, assignedUnitCode: selectedUnitCode } : op
    );
    setOperators(updated);
    setIsAssignModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>OPERATOR MANAGEMENT & LICENSE VALIDATION</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan Lisensi SIO K3 Alat Berat, Penugasan Shift, & Validasi Kualifikasi Operator Tambang
          </p>
        </div>
      </div>

      {/* Operators List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800 uppercase tracking-wider">
                <th className="py-3 px-4">Operator Name</th>
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Lisensi & SIO</th>
                <th className="py-3 px-4">Masa Berlaku SIO</th>
                <th className="py-3 px-4">Unit Penugasan</th>
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-4">Status Lisensi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {operators.map((op) => {
                const isExpired = new Date(op.licenseExpiry) < new Date();

                return (
                  <tr key={op.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{op.name}</span>
                      <span className="text-[10px] text-slate-400">{op.department}</span>
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-slate-300">
                      {op.employeeId}
                    </td>

                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {op.licenseType}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      {op.licenseExpiry}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md font-mono">
                        {op.assignedUnitCode || "Unassigned"}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-300">
                      {op.shift}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono uppercase ${
                          !isExpired
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {!isExpired ? "Valid SIO" : "Expired SIO"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOperator(op);
                          setIsAssignModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                      >
                        Assign Unit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operator Assignment Modal */}
      {isAssignModalOpen && selectedOperator && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>Penugasan Unit untuk {selectedOperator.name}</span>
            </h3>

            {assignError && (
              <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-xs text-rose-300 font-sans leading-relaxed">
                {assignError}
              </div>
            )}

            <form onSubmit={handleAssignOperator} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Pilih Unit Alat Tambang</label>
                <select
                  value={selectedUnitCode}
                  onChange={(e) => setSelectedUnitCode(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
                >
                  {equipmentList.map((eq) => (
                    <option key={eq.id} value={eq.unitCode}>
                      {eq.unitCode} - {eq.equipmentType} ({eq.brand} {eq.model})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 text-xs bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl cursor-pointer"
                >
                  Konfirmasi Penugasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
