import React, { useState } from "react";
import { FileCheck2, Plus, AlertCircle, CheckCircle2, ShieldAlert, X } from "lucide-react";
import { WorkPermit, PermitType, PermitStatus } from "../../../types/hseTypes";

interface HSEPermitsTabProps {
  permits: WorkPermit[];
  onCreatePermit: (data: Omit<WorkPermit, "id" | "createdAt" | "updatedAt">) => void;
  onValidateActivate: (permitId: string, approvedBy: string) => Promise<{ success: boolean; errors: string[] }>;
}

export const HSEPermitsTab: React.FC<HSEPermitsTabProps> = ({ permits, onCreatePermit, onValidateActivate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<{ permitId: string; errors: string[] } | null>(null);

  const [formData, setFormData] = useState({
    permitId: `PTW-${Date.now()}`,
    permitNumber: `PTW-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    permitType: "Hot Work" as PermitType,
    companyId: "COMP-01",
    siteId: "SITE-01",
    locationName: "Port Jetty Vessel Conveyor Line 2",
    activityName: "Pengelasan Penahan Conveyor",
    requesterName: "Agus Pratama",
    supervisorName: "Bambang Triyono",
    workers: ["Supriadi", "Rudi"],
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    jsaApproved: true,
    riskAssessmentDone: true,
    requiredControls: ["APAR 6kg di tempat", "Fire Watcher terdedikasi"],
    requiredPPE: ["Welding Helmet", "Leather Apron & Gloves"],
    isolationLOTORequired: true,
    isolationLOTOVerified: true,
    emergencyPlanDefined: true,
    approvalStatus: "UNDER_REVIEW" as PermitStatus,
  });

  const handleActivate = async (permitId: string) => {
    const res = await onValidateActivate(permitId, "Irwan Setiawan (HSE Manager)");
    if (!res.success) {
      setValidationResult({ permitId, errors: res.errors });
    } else {
      setValidationResult(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePermit(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-amber-400" />
            Izin Kerja Khusus (Permit to Work - PTW)
          </h2>
          <p className="text-xs text-slate-400">Persetujuan & validasi keselamatan untuk pekerjaan risiko tinggi (Hot Work, Confined Space, Height)</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Pengajuan Izin Kerja (PTW)
        </button>
      </div>

      {validationResult && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-xs text-rose-300 space-y-2">
          <div className="font-bold flex items-center gap-2 text-rose-400">
            <AlertCircle className="w-4 h-4" /> PERMIT CANNOT BE ACTIVATED - Syarat Belum Terpenuhi
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300">
            {validationResult.errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {permits.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400">{p.permitNumber}</span>
                <h3 className="font-semibold text-white text-sm mt-0.5">{p.permitType} - {p.locationName}</h3>
                <p className="text-xs text-slate-400">{p.activityName}</p>
              </div>

              <span
                className={`px-2.5 py-1 rounded text-xs font-bold border ${
                  p.approvalStatus === "ACTIVE"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : p.approvalStatus === "EXPIRED"
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                    : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                }`}
              >
                {p.approvalStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-800/50 p-2.5 rounded-lg text-slate-300">
              <div>JSA Approved: {p.jsaApproved ? "YES" : "NO"}</div>
              <div>Risk Assessed: {p.riskAssessmentDone ? "YES" : "NO"}</div>
              <div>LOTO Verified: {p.isolationLOTOVerified ? "YES" : "NO"}</div>
              <div>Supervisor: {p.supervisorName}</div>
            </div>

            {p.approvalStatus !== "ACTIVE" && (
              <button
                onClick={() => handleActivate(p.permitId)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Validasi & Aktifkan Permit
              </button>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Pengajuan Permit to Work</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Tipe Izin Kerja</label>
                <select
                  value={formData.permitType}
                  onChange={(e) => setFormData({ ...formData, permitType: e.target.value as PermitType })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="Hot Work">Hot Work (Pengelasan/Pemotongan)</option>
                  <option value="Confined Space">Confined Space (Ruang Terbatas)</option>
                  <option value="Working at Height">Working at Height (Ketinggian)</option>
                  <option value="Electrical">Electrical Isolation</option>
                  <option value="Excavation">Excavation (Penggalian)</option>
                </select>
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

              <div className="col-span-2">
                <label className="text-slate-400 block mb-1">Uraian Pekerjaan</label>
                <input
                  type="text"
                  value={formData.activityName}
                  onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
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
              <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold">
                Kirim Pengajuan Permit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
