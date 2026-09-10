import React, { useState } from "react";
import { FileText, Plus, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { JSA } from "../../../types/hseTypes";

interface HSEJSATabProps {
  jsas: JSA[];
  onCreateJSA: (data: Omit<JSA, "id" | "createdAt" | "updatedAt">) => void;
  onApproveJSA: (jsaId: string, approvedBy: string) => void;
}

export const HSEJSATab: React.FC<HSEJSATabProps> = ({ jsas, onCreateJSA, onApproveJSA }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    jsaId: `JSA-${Date.now()}`,
    jsaNumber: `JSA-MIN-2026-${Math.floor(100 + Math.random() * 900)}`,
    title: "",
    activityName: "",
    locationName: "Main Workshop Heavy Bay",
    departmentName: "Maintenance",
    jobOwner: "Bambang Triyono",
    participants: ["Budi Santoso", "Agus Pratama"],
    requiredPPE: ["Safety Helmet", "Safety Shoes", "High Visibility Vest"],
    approvalStatus: "DRAFT" as JSA["approvalStatus"],
    validFrom: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split("T")[0],
    jobSteps: [
      {
        stepNumber: 1,
        stepDescription: "Persiapan peralatan & isolasi energi",
        hazards: ["Sengatan listrik", "Gerakan mekanis tidak sengaja"],
        potentialConsequences: ["Cedera fisik mekanik"],
        existingControls: ["LOTO Lockout Tagout pada breaker utama"],
        initialLikelihood: 3,
        initialSeverity: 4,
        initialRiskScore: 12,
        initialRiskLevel: "HIGH" as JSA["jobSteps"][0]["initialRiskLevel"],
        additionalControls: ["Verifikasi zero energy dengan multimeter"],
        controlHierarchy: "Engineering Control" as JSA["jobSteps"][0]["controlHierarchy"],
        residualLikelihood: 1,
        residualSeverity: 3,
        residualRiskScore: 3,
        residualRiskLevel: "LOW" as JSA["jobSteps"][0]["residualRiskLevel"],
      },
    ],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateJSA(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Job Safety Analysis (JSA)
          </h2>
          <p className="text-xs text-slate-400">Analisis keselamatan tugas per langkah, penilaian risiko, dan hirarki pengendalian</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Buat Dokumen JSA Baru
        </button>
      </div>

      <div className="space-y-4">
        {jsas.map((jsa) => (
          <div key={jsa.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-400">{jsa.jsaNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      jsa.approvalStatus === "APPROVED"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {jsa.approvalStatus}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm mt-1">{jsa.title}</h3>
                <p className="text-xs text-slate-400">Lokasi: {jsa.locationName} | Owner: {jsa.jobOwner}</p>
              </div>

              {jsa.approvalStatus !== "APPROVED" && (
                <button
                  onClick={() => onApproveJSA(jsa.jsaId, "Irwan Setiawan (HSE Manager)")}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui HSE Manager
                </button>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300">Langkah Kerja & Hierarchy of Controls:</h4>
              {jsa.jobSteps.map((step) => (
                <div key={step.stepNumber} className="bg-slate-800/60 p-3 rounded-lg text-xs space-y-1">
                  <div className="font-medium text-slate-200">
                    Langkah {step.stepNumber}: {step.stepDescription}
                  </div>
                  <div className="text-slate-400">
                    Bahaya: <span className="text-amber-300">{step.hazards.join(", ")}</span>
                  </div>
                  <div className="text-slate-400">
                    Hirarki Pengendalian: <span className="text-indigo-300 font-semibold">{step.controlHierarchy}</span> ({step.additionalControls.join(", ")})
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Buat JSA Baru</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Judul Pekerjaan JSA</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                  placeholder="Contoh: Pekerjaan Pengangkatan Crane di Workshop"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Lokasi Pekerjaan</label>
                <input
                  type="text"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
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
                Simpan Dokumen JSA
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
