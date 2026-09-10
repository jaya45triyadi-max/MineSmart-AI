import React, { useState } from "react";
import { UserCheck, Plus, Search, HeartPulse, FileText, AlertCircle, X } from "lucide-react";
import { AccidentRecord, AccidentClassification } from "../../../types/hseTypes";

interface HSEAccidentsTabProps {
  accidents: AccidentRecord[];
  onCreateAccident: (data: Omit<AccidentRecord, "id" | "createdAt" | "updatedAt">) => void;
}

export const HSEAccidentsTab: React.FC<HSEAccidentsTabProps> = ({ accidents, onCreateAccident }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    accidentId: `ACC-${Math.floor(100 + Math.random() * 900)}`,
    incidentId: "INC-2026-002",
    incidentNumber: "INC-2026-002",
    classification: "FIRST_AID" as AccidentClassification,
    personName: "",
    employeeId: "",
    companyName: "PT Barito Mining Service",
    injuryType: "Laceration / Goresan",
    bodyPart: "Right Hand / Tangan Kanan",
    treatment: "First Aid Cleaning",
    lostWorkDays: 0,
    restrictedWorkDays: 0,
    medicalTreatment: false,
    hospitalization: false,
    fatality: false,
    propertyDamage: false,
    estimatedDamageCost: 0,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateAccident(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-400" />
            Manajemen Kecelakaan Kerja & Cedera (Accidents)
          </h2>
          <p className="text-xs text-slate-400">Pencatatan medis, penanganan cedera, dan analisis Lost Work Days</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Catat Kasus Kecelakaan
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="p-3">Nama Pekerja</th>
                <th className="p-3">Klasifikasi Medis</th>
                <th className="p-3">Jenis Cedera</th>
                <th className="p-3">Bagian Tubuh</th>
                <th className="p-3">Perawatan</th>
                <th className="p-3">Lost Days</th>
                <th className="p-3">Perusahaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {accidents.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-800/50">
                  <td className="p-3 font-semibold text-white">{acc.personName} ({acc.employeeId})</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                      {acc.classification}
                    </span>
                  </td>
                  <td className="p-3">{acc.injuryType}</td>
                  <td className="p-3">{acc.bodyPart}</td>
                  <td className="p-3">{acc.treatment}</td>
                  <td className="p-3 font-bold text-amber-400">{acc.lostWorkDays} Hari</td>
                  <td className="p-3 text-slate-400">{acc.companyName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Input Kasus Kecelakaan / Medis</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nama Korban/Pekerja</label>
                <input
                  type="text"
                  value={formData.personName}
                  onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">NIP / Employee ID</label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Klasifikasi Kecelakaan</label>
                <select
                  value={formData.classification}
                  onChange={(e) => setFormData({ ...formData, classification: e.target.value as AccidentClassification })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="FIRST_AID">First Aid</option>
                  <option value="MEDICAL_TREATMENT">Medical Treatment</option>
                  <option value="RESTRICTED_WORK">Restricted Work</option>
                  <option value="LOST_TIME_INJURY">Lost Time Injury (LTI)</option>
                  <option value="SERIOUS_INJURY">Serious Injury</option>
                  <option value="FATALITY">Fatality</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Jumlah Hari Kerja Hilang (LTI)</label>
                <input
                  type="number"
                  value={formData.lostWorkDays}
                  onChange={(e) => setFormData({ ...formData, lostWorkDays: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Jenis Cedera</label>
                <input
                  type="text"
                  value={formData.injuryType}
                  onChange={(e) => setFormData({ ...formData, injuryType: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Bagian Tubuh Terkena</label>
                <input
                  type="text"
                  value={formData.bodyPart}
                  onChange={(e) => setFormData({ ...formData, bodyPart: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
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
              <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold">
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
