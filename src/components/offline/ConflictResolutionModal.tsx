// MINE SMART AI - Visual Local vs Server Conflict Resolution Modal
// Features: Side-by-Side Diff, Field-Level Selectors, AI Smart Merge, Custom Value Override

import React, { useState } from "react";
import {
  AlertTriangle,
  Sparkles,
  Smartphone,
  Server,
  ArrowRightLeft,
  Check,
  X,
  Clock,
  User,
  Cpu,
  HelpCircle,
  FileText,
  Sliders,
} from "lucide-react";
import { OfflineConflictRecord, FieldDiff } from "../../types/offlineSyncTypes";

interface ConflictResolutionModalProps {
  conflict: OfflineConflictRecord;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (
    conflictId: string,
    strategy: "KEEP_LOCAL" | "USE_SERVER" | "AI_SMART_MERGE" | "CUSTOM_MERGE",
    resolvedBy: string,
    customData?: Record<string, any>
  ) => void;
}

export const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  conflict,
  isOpen,
  onClose,
  onResolve,
}) => {
  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState<"DIFF" | "AI_MERGE" | "CUSTOM">("DIFF");
  const [customFieldSelections, setCustomFieldSelections] = useState<Record<string, "LOCAL" | "SERVER">>({});
  const [customNotes, setCustomNotes] = useState<string>(
    conflict.aiMergeSuggestion?.mergedData?.notes || conflict.localVersion.data.notes || ""
  );

  const handleFieldChoice = (fieldName: string, choice: "LOCAL" | "SERVER") => {
    setCustomFieldSelections((prev) => ({
      ...prev,
      [fieldName]: choice,
    }));
  };

  const executeCustomMerge = () => {
    const customMerged: Record<string, any> = { ...conflict.serverVersion.data };

    conflict.fieldDiffs.forEach((diff) => {
      const choice = customFieldSelections[diff.fieldName] || "LOCAL";
      if (choice === "LOCAL") {
        customMerged[diff.fieldName] = diff.localValue;
      } else {
        customMerged[diff.fieldName] = diff.serverValue;
      }
    });

    if (customNotes) {
      customMerged.notes = customNotes;
    }

    onResolve(conflict.conflictId, "CUSTOM_MERGE", "Foreman Pengawas (Custom Merge)", customMerged);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-purple-500/30 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Resolusi Konflik Data: Local vs Server
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-bold">
                  {conflict.recordType}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {conflict.title} &bull; Lokasi: <span className="text-purple-300">{conflict.pitOrLocation}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Side-by-Side Diff | AI Smart Merge | Custom Field Picker */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveMode("DIFF")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeMode === "DIFF"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Perbandingan Side-by-Side</span>
          </button>

          <button
            onClick={() => setActiveMode("AI_MERGE")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeMode === "AI_MERGE"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-emerald-400 hover:bg-emerald-950/40"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Smart Merge ({conflict.aiMergeSuggestion?.confidence}% Confidence)</span>
          </button>

          <button
            onClick={() => setActiveMode("CUSTOM")}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer ${
              activeMode === "CUSTOM"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Kustomisasi Per Field</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* AI Recommendation Alert Banner */}
          {conflict.aiMergeSuggestion && (
            <div className="p-4 bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-500/30 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-emerald-300 text-xs">
                    Rekomendasi AI Smart Conflict Engine
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Akurasi {conflict.aiMergeSuggestion.confidence}%
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {conflict.aiMergeSuggestion.rationale}
                </p>
              </div>
            </div>
          )}

          {/* MODE 1: SIDE-BY-SIDE DIFF */}
          {activeMode === "DIFF" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Local Version Column */}
                <div className="p-4 bg-slate-950/80 border border-purple-500/40 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2 text-purple-400 font-bold">
                      <Smartphone className="w-4 h-4" />
                      <span>Versi Lokal (Perangkat Lapangan)</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      Offline Cache
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-400">
                    <p className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-500" />
                      Operator: <strong className="text-slate-200">{conflict.localVersion.updatedBy}</strong>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Waktu Input: <span className="text-slate-200 font-mono">{conflict.localVersion.updatedAt}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-slate-500" />
                      Device: <span className="text-slate-300 font-mono">{conflict.localVersion.clientDeviceId}</span>
                    </p>
                  </div>

                  {/* Local Field Values */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {conflict.fieldDiffs.map((diff) => (
                      <div
                        key={diff.fieldName}
                        className="p-2.5 bg-slate-900/90 rounded-xl border border-purple-500/30 space-y-1"
                      >
                        <span className="text-[10px] text-purple-300 font-bold uppercase">{diff.fieldLabel}:</span>
                        <div className="text-sm font-bold text-white font-mono">
                          {typeof diff.localValue === "object"
                            ? JSON.stringify(diff.localValue)
                            : String(diff.localValue)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      onResolve(conflict.conflictId, "KEEP_LOCAL", "Foreman Pengawas (Override)");
                      onClose();
                    }}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Gunakan Versi Lokal (Keep Local)</span>
                  </button>
                </div>

                {/* Server Master Column */}
                <div className="p-4 bg-slate-950/80 border border-cyan-500/40 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Server className="w-4 h-4" />
                      <span>Versi Master Server (Dispatch / Cloud)</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      Rev #{conflict.serverVersion.serverRevision}
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-400">
                    <p className="flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-500" />
                      Pengubah Server: <strong className="text-slate-200">{conflict.serverVersion.updatedBy}</strong>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      Waktu Server: <span className="text-slate-200 font-mono">{conflict.serverVersion.updatedAt}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-slate-500" />
                      Sumber: <span className="text-slate-300">Weighbridge API / Central Master</span>
                    </p>
                  </div>

                  {/* Server Field Values */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {conflict.fieldDiffs.map((diff) => (
                      <div
                        key={diff.fieldName}
                        className="p-2.5 bg-slate-900/90 rounded-xl border border-cyan-500/30 space-y-1"
                      >
                        <span className="text-[10px] text-cyan-300 font-bold uppercase">{diff.fieldLabel}:</span>
                        <div className="text-sm font-bold text-white font-mono">
                          {typeof diff.serverValue === "object"
                            ? JSON.stringify(diff.serverValue)
                            : String(diff.serverValue)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      onResolve(conflict.conflictId, "USE_SERVER", "Foreman Pengawas (Accept Server)");
                      onClose();
                    }}
                    className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/30 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Gunakan Versi Server (Use Server)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: AI SMART MERGE PREVIEW */}
          {activeMode === "AI_MERGE" && conflict.aiMergeSuggestion && (
            <div className="p-5 bg-slate-950 border border-emerald-500/40 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-black text-white">
                    Hasil Penggabungan Cerdas AI (Smart Merged Dataset)
                  </h4>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-bold">
                  96% Confidence Level
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(conflict.aiMergeSuggestion.mergedData).map(([k, val]) => (
                  <div key={k} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{k}</span>
                    <p className="text-xs font-bold text-emerald-300 font-mono">
                      {typeof val === "object" ? JSON.stringify(val) : String(val)}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  onResolve(conflict.conflictId, "AI_SMART_MERGE", "AI Auto-Resolver (Smart Merge)");
                  onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 text-white font-black rounded-xl shadow-xl shadow-emerald-600/30 hover:scale-[1.01] transition cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Setujui & Terapkan AI Smart Merge Ini</span>
              </button>
            </div>
          )}

          {/* MODE 3: CUSTOM FIELD SELECTION */}
          {activeMode === "CUSTOM" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Pilih per kolom nilai mana yang ingin dipertahankan (*Lokal* atau *Server*):
              </p>

              <div className="space-y-3">
                {conflict.fieldDiffs.map((diff) => {
                  const choice = customFieldSelections[diff.fieldName] || "LOCAL";
                  return (
                    <div
                      key={diff.fieldName}
                      className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2"
                    >
                      <span className="text-xs font-bold text-white uppercase">{diff.fieldLabel}</span>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Option Local */}
                        <button
                          type="button"
                          onClick={() => handleFieldChoice(diff.fieldName, "LOCAL")}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                            choice === "LOCAL"
                              ? "bg-purple-600/20 border-purple-500 text-white"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span className="text-[10px] font-bold text-purple-400 block mb-1">
                            📱 Nilai Lokal:
                          </span>
                          <span className="text-xs font-bold font-mono">{String(diff.localValue)}</span>
                        </button>

                        {/* Option Server */}
                        <button
                          type="button"
                          onClick={() => handleFieldChoice(diff.fieldName, "SERVER")}
                          className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                            choice === "SERVER"
                              ? "bg-cyan-600/20 border-cyan-500 text-white"
                              : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span className="text-[10px] font-bold text-cyan-400 block mb-1">
                            🌐 Nilai Server:
                          </span>
                          <span className="text-xs font-bold font-mono">{String(diff.serverValue)}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Custom Notes Field */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    Catatan Gabungan Final:
                  </label>
                  <textarea
                    rows={2}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    placeholder="Tuliskan catatan rekonsiliasi..."
                  />
                </div>
              </div>

              <button
                onClick={executeCustomMerge}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg cursor-pointer"
              >
                Simpan & Rekonsiliasi Kustom
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400">
            Idempotency Key: <span className="font-mono text-purple-300">{conflict.syncQueueId}</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
