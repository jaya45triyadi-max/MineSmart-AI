import React, { useState } from "react";
import { Activity, Filter, Layers, AlertCircle, Plus, X } from "lucide-react";
import { RiskAssessmentItem } from "../../../types/hseTypes";

interface HSERiskMatrixTabProps {
  riskAssessments: RiskAssessmentItem[];
  onCreateRiskAssessment: (data: Omit<RiskAssessmentItem, "id" | "createdAt" | "updatedAt">) => void;
}

export const HSERiskMatrixTab: React.FC<HSERiskMatrixTabProps> = ({ riskAssessments, onCreateRiskAssessment }) => {
  const [selectedCell, setSelectedCell] = useState<{ l: number; s: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    riskAssessmentId: `RA-${Date.now()}`,
    activityName: "",
    locationName: "Pit Alpha Bench +40",
    hazardDescription: "",
    consequence: "",
    likelihood: 3,
    severity: 4,
    riskScore: 12,
    riskLevel: "HIGH" as RiskAssessmentItem["riskLevel"],
    controls: "",
    controlHierarchy: "Engineering Control" as RiskAssessmentItem["controlHierarchy"],
    residualLikelihood: 1,
    residualSeverity: 3,
    residualRiskScore: 3,
    residualRiskLevel: "LOW" as RiskAssessmentItem["residualRiskLevel"],
    ownerName: "HSE Superintendent",
    reviewDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split("T")[0],
    status: "ACTIVE" as RiskAssessmentItem["status"],
  });

  const getCellColor = (l: number, s: number) => {
    const score = l * s;
    if (score >= 15) return "bg-rose-600/80 text-white hover:bg-rose-500 border border-rose-500";
    if (score >= 10) return "bg-amber-600/80 text-white hover:bg-amber-500 border border-amber-500";
    if (score >= 5) return "bg-blue-600/80 text-white hover:bg-blue-500 border border-blue-500";
    return "bg-emerald-600/80 text-white hover:bg-emerald-500 border border-emerald-500";
  };

  const getCellCount = (l: number, s: number) => {
    return riskAssessments.filter((r) => r.likelihood === l && r.severity === s).length;
  };

  const filtered = selectedCell
    ? riskAssessments.filter((r) => r.likelihood === selectedCell.l && r.severity === selectedCell.s)
    : riskAssessments;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = formData.likelihood * formData.severity;
    let level: RiskAssessmentItem["riskLevel"] = "LOW";
    if (score >= 15) level = "EXTREME";
    else if (score >= 10) level = "HIGH";
    else if (score >= 5) level = "MEDIUM";

    onCreateRiskAssessment({
      ...formData,
      riskScore: score,
      riskLevel: level,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Matriks Penilaian Risiko K3 & Heatmap 5x5
          </h2>
          <p className="text-xs text-slate-400">Peta distribusi risiko operasional berdasarkan Likelihood x Severity</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Input Risk Assessment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5x5 Heatmap Matrix */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">Interactive 5x5 Risk Heatmap</h3>
            {selectedCell && (
              <button
                onClick={() => setSelectedCell(null)}
                className="text-xs text-indigo-400 hover:underline"
              >
                Reset Filter Cell (L:{selectedCell.l}, S:{selectedCell.s})
              </button>
            )}
          </div>

          <div className="grid grid-cols-6 gap-1 text-center text-xs">
            <div className="p-2 font-bold text-slate-400">Severity \ Likelihood</div>
            {[1, 2, 3, 4, 5].map((l) => (
              <div key={l} className="p-2 font-bold text-slate-300 bg-slate-800/80 rounded">L{l}</div>
            ))}

            {[5, 4, 3, 2, 1].map((s) => (
              <React.Fragment key={s}>
                <div className="p-2 font-bold text-slate-300 bg-slate-800/80 rounded flex items-center justify-center">S{s}</div>
                {[1, 2, 3, 4, 5].map((l) => {
                  const count = getCellCount(l, s);
                  const isSelected = selectedCell?.l === l && selectedCell?.s === s;
                  return (
                    <button
                      key={`${l}-${s}`}
                      onClick={() => setSelectedCell({ l, s })}
                      className={`p-3 rounded font-bold text-sm transition-all flex flex-col items-center justify-center min-h-[48px] ${getCellColor(
                        l,
                        s
                      )} ${isSelected ? "ring-2 ring-white shadow-lg" : ""}`}
                    >
                      <span>{l * s}</span>
                      {count > 0 && <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full mt-0.5">{count}</span>}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Low (1-4)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Medium (5-9)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> High (10-14)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Extreme (15-25)</span>
          </div>
        </div>

        {/* Risk Register List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <h3 className="font-semibold text-white text-sm">HSE Risk Register Items ({filtered.length})</h3>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {filtered.map((ra) => (
              <div key={ra.id} className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3 space-y-1.5 text-xs">
                <div className="flex items-start justify-between">
                  <span className="font-bold text-slate-200">{ra.activityName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      ra.riskLevel === "EXTREME" || ra.riskLevel === "HIGH"
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    }`}
                  >
                    {ra.riskLevel} ({ra.riskScore})
                  </span>
                </div>
                <p className="text-slate-300">{ra.hazardDescription}</p>
                <div className="text-[11px] text-indigo-300 bg-indigo-500/10 p-2 rounded">
                  Pengendalian ({ra.controlHierarchy}): {ra.controls}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Input Penilaian Risiko Baru</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Aktivitas Kerja</label>
                <input
                  type="text"
                  value={formData.activityName}
                  onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  placeholder="Contoh: Peledakan Pit Alpha Bench +40"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Likelihood (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.likelihood}
                  onChange={(e) => setFormData({ ...formData, likelihood: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Severity (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Uraian Bahaya & Konsekuensi</label>
                <input
                  type="text"
                  value={formData.hazardDescription}
                  onChange={(e) => setFormData({ ...formData, hazardDescription: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Hirarki Pengendalian (Controls)</label>
                <input
                  type="text"
                  value={formData.controls}
                  onChange={(e) => setFormData({ ...formData, controls: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs"
              >
                Batal
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold">
                Simpan Penilaian
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
