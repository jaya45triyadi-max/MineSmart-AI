// MINE SMART AI - Quick Status Switcher Modal

import React, { useState } from "react";
import { X, CheckCircle2, Clock, AlertTriangle, Wrench, Sparkles, Send } from "lucide-react";
import { FleetUnitProfile, FleetUnitStatus } from "../../../types/fleetManagementTypes";

interface FleetQuickStatusModalProps {
  unit: FleetUnitProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmStatusChange: (unitId: string, newStatus: FleetUnitStatus, reason: string) => void;
}

export const FleetQuickStatusModal: React.FC<FleetQuickStatusModalProps> = ({
  unit,
  isOpen,
  onClose,
  onConfirmStatusChange,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<FleetUnitStatus>(unit?.status || "RUNNING");
  const [reason, setReason] = useState(unit?.statusReason || "");

  if (!isOpen || !unit) return null;

  const handleApply = () => {
    onConfirmStatusChange(unit.id, selectedStatus, reason);
    onClose();
  };

  const statusOptions: {
    status: FleetUnitStatus;
    label: string;
    description: string;
    color: string;
    bg: string;
    border: string;
  }[] = [
    {
      status: "RUNNING",
      label: "🟢 Running (Beroperasi Aktif)",
      description: "Unit bergerak hauling, loading, dozing, grading, atau spraying.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
    },
    {
      status: "IDLE",
      label: "🟡 Idle (Standby / Antrian)",
      description: "Unit hidup tapi menunggu antrian shovel, dump, rehat operator, atau hujan.",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
    },
    {
      status: "BREAKDOWN",
      label: "🔴 Breakdown (Kerusakan Lapangan)",
      description: "Unit mengalami kerusakan mendadak di area pit (engine, hidrolik, ban, transmisi).",
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
    },
    {
      status: "MAINTENANCE",
      label: "🔵 Maintenance (Workshop Servis)",
      description: "Unit masuk bengkel/workshop untuk jadwal PM-250, PM-500, atau backlog overhaul.",
      color: "text-sky-400",
      bg: "bg-sky-500/10",
      border: "border-sky-500/30",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>Ubah Status Cepat:</span>
              <span className="text-emerald-400">{unit.unitId}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {unit.brand} {unit.model} • Lokasi: {unit.location}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <label className="text-xs font-bold text-slate-300 block">Pilih Status Baru:</label>

          <div className="space-y-2.5">
            {statusOptions.map((opt) => {
              const isSelected = selectedStatus === opt.status;
              return (
                <div
                  key={opt.status}
                  onClick={() => {
                    setSelectedStatus(opt.status);
                    if (opt.status === "RUNNING") setReason("Beroperasi normal di pit");
                    if (opt.status === "IDLE") setReason("Antrian di loading pocket");
                    if (opt.status === "BREAKDOWN") setReason("Alarm engine oil pressure terpicu");
                    if (opt.status === "MAINTENANCE") setReason("Servis PM-250 terencana di Workshop Bay 2");
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? `${opt.bg} ${opt.border} shadow-lg ring-1 ring-emerald-500`
                      : "bg-slate-950/40 border-slate-800 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black ${opt.color}`}>{opt.label}</span>
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => setSelectedStatus(opt.status)}
                      className="accent-emerald-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{opt.description}</p>
                </div>
              );
            })}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Alasan / Keterangan Operasional
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Masukkan alasan perubahan status..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-slate-800 px-6 py-4 bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <Send className="h-4 w-4" />
            <span>Terapkan Status</span>
          </button>
        </div>
      </div>
    </div>
  );
};
