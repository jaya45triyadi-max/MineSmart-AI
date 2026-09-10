// MINE SMART AI - Prediction History & Ground-Truth Verification Outcome View

import React, { useState } from "react";
import {
  History,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Info,
} from "lucide-react";
import { PredictionHistoryItem } from "../../types/predictiveTypes";

interface PredictionHistoryViewProps {
  historyItems: PredictionHistoryItem[];
  onVerifyOutcome: (
    historyId: string,
    result: "Correct Prediction" | "False Positive" | "False Negative" | "Missed Event",
    actualOutcome: string
  ) => Promise<void>;
  onOpenAIAssistant: () => void;
}

export const PredictionHistoryView: React.FC<PredictionHistoryViewProps> = ({
  historyItems,
  onVerifyOutcome,
  onOpenAIAssistant,
}) => {
  const [selectedItem, setSelectedItem] = useState<PredictionHistoryItem | null>(null);
  const [verifyResult, setVerifyResult] = useState<"Correct Prediction" | "False Positive" | "False Negative" | "Missed Event">("Correct Prediction");
  const [actualText, setActualText] = useState("");

  const handleSaveVerification = async () => {
    if (!selectedItem) return;
    try {
      await onVerifyOutcome(selectedItem.id, verifyResult, actualText);
      setSelectedItem(null);
      setActualText("");
    } catch (err: any) {
      alert(`Gagal memverifikasi: ${err.message}`);
    }
  };

  const getOutcomeBadge = (res: string) => {
    switch (res) {
      case "Correct Prediction":
        return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30";
      case "False Positive":
        return "bg-amber-500/20 text-amber-500 border-amber-500/30";
      case "False Negative":
        return "bg-rose-500/20 text-rose-500 border-rose-500/30";
      case "Missed Event":
        return "bg-purple-500/20 text-purple-500 border-purple-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <History className="h-5 w-5 text-emerald-500" />
            <span>Prediction History & Model Ground-Truth Feedback Loop</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rekam jejak prediksi historis dibanding kejadian aktual untuk mengukur False Positives / False Negatives dan menyempurnakan model AI.
          </p>
        </div>

        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Analisis Kinerja Prediksi</span>
        </button>
      </div>

      {/* History Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Prediction vs Actual Outcome Audit Log</h3>
          <span className="text-xs text-slate-400">Model Feedback Enabled</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-extrabold uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-xl">Date & Unit</th>
                <th className="p-3">Prediction Type</th>
                <th className="p-3">Predicted Outcome</th>
                <th className="p-3">Actual Outcome</th>
                <th className="p-3">Verification Result</th>
                <th className="p-3">Model</th>
                <th className="p-3 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {historyItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">
                    <div>{item.unitCode}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{new Date(item.predictionDate).toLocaleDateString()}</div>
                  </td>
                  <td className="p-3 font-semibold text-emerald-500">{item.predictionType}</td>
                  <td className="p-3 max-w-xs">{item.predictedOutcome}</td>
                  <td className="p-3 max-w-xs text-slate-500">{item.actualOutcome || "Pending Verification"}</td>
                  <td className="p-3">
                    <span className={`inline-block rounded border px-2 py-0.5 text-[10px] font-black ${getOutcomeBadge(item.verificationResult)}`}>
                      {item.verificationResult}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[10px] text-slate-400">{item.modelVersion}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setActualText(item.actualOutcome || "");
                      }}
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      Verify Actual
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Feedback Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Verifikasi Ground-Truth ({selectedItem.unitCode})
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Hasil Verifikasi Actual</label>
                <select
                  value={verifyResult}
                  onChange={(e) => setVerifyResult(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  <option value="Correct Prediction">Correct Prediction (Prediksi Tepat)</option>
                  <option value="False Positive">False Positive (Alarm Palsu)</option>
                  <option value="False Negative">False Negative (Gagal Memprediksi)</option>
                  <option value="Missed Event">Missed Event (Kejadian Terlewat)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Catatan Kejadian Aktual</label>
                <textarea
                  value={actualText}
                  onChange={(e) => setActualText(e.target.value)}
                  placeholder="Tuliskan catatan kejadian aktual di lapangan..."
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 dark:border-slate-800 dark:text-slate-400 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveVerification}
                className="rounded-xl bg-emerald-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all cursor-pointer"
              >
                Simpan Verifikasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
