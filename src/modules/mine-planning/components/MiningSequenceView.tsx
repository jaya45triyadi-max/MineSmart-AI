// MINE SMART AI - Mining Sequence & Conflict Detection Component

import React, { useState } from "react";
import {
  GitCommit,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Plus,
} from "lucide-react";
import { MiningSequence, PlanningConstraint } from "../../../types/minePlanningTypes";
import { MiningScheduleService, ScheduleConflict } from "../../../services/mine-planning/MiningScheduleService";
import { MinePlanningRepository } from "../../../services/repositories/MinePlanningRepository";

interface MiningSequenceViewProps {
  sequences: MiningSequence[];
  constraints: PlanningConstraint[];
  onAddSequence: (seq: MiningSequence) => void;
}

export const MiningSequenceView: React.FC<MiningSequenceViewProps> = ({
  sequences,
  constraints,
  onAddSequence,
}) => {
  const [benchCode, setBenchCode] = useState("RL -10.0m");
  const [blockId, setBlockId] = useState("BLK-B1");
  const [period, setPeriod] = useState("2026-Aug-W34");

  const conflicts: ScheduleConflict[] = MiningScheduleService.detectConflicts(
    sequences,
    constraints,
    MinePlanningRepository.getDailyPlans()
  );

  const handleAddSequence = () => {
    const newSeq: MiningSequence = {
      id: `seq-${Date.now()}`,
      companyId: "comp-01",
      siteId: "site-01",
      sequenceId: `SEQ-PB01-${benchCode.replace(/[^a-zA-Z0-9]/g, "")}`,
      pitId: "pit-01",
      pushbackId: "PB01",
      benchCode,
      blockId,
      period,
      priorityOrder: sequences.length + 1,
      predecessorSequenceIds: sequences.length > 0 ? [sequences[sequences.length - 1].sequenceId] : [],
      status: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddSequence(newSeq);
  };

  return (
    <div className="space-y-6">
      {/* Sequence Conflict Warning Alert */}
      {conflicts.length > 0 && (
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-500 space-y-2">
          <div className="flex items-center gap-2 font-black text-sm">
            <ShieldAlert className="h-5 w-5" />
            <span>Deteksi Konflik Sekuens Penambangan & Akses ({conflicts.length} Alert)</span>
          </div>
          {conflicts.map((conf) => (
            <p key={conf.id} className="text-xs text-amber-400 leading-relaxed">
              ● <strong>{conf.title}:</strong> {conf.description}
            </p>
          ))}
        </div>
      )}

      {/* Sequence Creation Toolbar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm text-xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <GitCommit className="h-5 w-5 text-teal-500" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Sistem Urutan (Mining Sequence & Dependency Engine)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-slate-400 font-bold block mb-1">Bench Level:</label>
            <input
              type="text"
              value={benchCode}
              onChange={(e) => setBenchCode(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">Mining Block ID:</label>
            <input
              type="text"
              value={blockId}
              onChange={(e) => setBlockId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">Periode Target:</label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleAddSequence}
              className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Sekuens</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sequence Timeline Flow Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Urutan Penambangan Terjadwal ({sequences.length} Sequence Steps)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3 text-center">Prioritas</th>
                <th className="py-2.5 px-3">Kode Sequence</th>
                <th className="py-2.5 px-3">Pushback Stage</th>
                <th className="py-2.5 px-3">Bench RL</th>
                <th className="py-2.5 px-3">Mining Block</th>
                <th className="py-2.5 px-3">Periode</th>
                <th className="py-2.5 px-3">Syarat Predecessor</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {sequences.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-3 text-center font-mono font-black text-teal-500">#{s.priorityOrder}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{s.sequenceId}</td>
                  <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-300">{s.pushbackId}</td>
                  <td className="py-3 px-3 font-mono text-sky-400">{s.benchCode}</td>
                  <td className="py-3 px-3 font-mono">{s.blockId}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{s.period}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                    {s.predecessorSequenceIds.length > 0 ? s.predecessorSequenceIds.join(", ") : "Main Root"}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        s.status === "IN_PROGRESS"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-slate-500/10 text-slate-400"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
