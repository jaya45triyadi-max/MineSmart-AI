import React, { useState } from "react";
import { CheckCircle2, Plus, XCircle, AlertTriangle, Smartphone, Camera, FileText, Check, X } from "lucide-react";
import { HSEInspection, InspectionChecklistItem, InspectionType } from "../../../types/hseTypes";

interface HSEInspectionsTabProps {
  inspections: HSEInspection[];
  onCreateInspection: (data: Omit<HSEInspection, "id" | "createdAt" | "updatedAt">) => void;
}

export const HSEInspectionsTab: React.FC<HSEInspectionsTabProps> = ({ inspections, onCreateInspection }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspectionType, setInspectionType] = useState<InspectionType>("Workshop Inspection");
  const [locationName, setLocationName] = useState("Main Workshop & Fuel Station");
  const [inspectorName, setInspectorName] = useState("Irwan Setiawan (HSE Lead Inspector)");

  const [items, setItems] = useState<InspectionChecklistItem[]>([
    { itemId: "ITM-01", category: "Fire Safety", requirement: "APAR terinspeksi & tekanan di zona hijau", status: "PASS" },
    { itemId: "ITM-02", category: "Electrical", requirement: "Panel listrik terisolasi & LOTO aktif", status: "PASS" },
    { itemId: "ITM-03", category: "Housekeeping", requirement: "Lantai bebas ceceran oli & dipasang drip tray", status: "FAIL", observation: "Drip tray meluber 0.5 liter", riskLevel: "MEDIUM", correctiveActionRequired: true },
    { itemId: "ITM-04", category: "PPE", requirement: "Pekerja menggunakan APD lengkap", status: "PASS" },
  ]);

  const handleStatusChange = (itemId: string, newStatus: "PASS" | "FAIL" | "NA") => {
    setItems((prev) =>
      prev.map((itm) =>
        itm.itemId === itemId
          ? {
              ...itm,
              status: newStatus,
              correctiveActionRequired: newStatus === "FAIL",
            }
          : itm
      )
    );
  };

  const handleSaveInspection = () => {
    const passCount = items.filter((i) => i.status === "PASS").length;
    const failCount = items.filter((i) => i.status === "FAIL").length;
    const naCount = items.filter((i) => i.status === "NA").length;

    onCreateInspection({
      inspectionId: `INSP-${Date.now()}`,
      inspectionNumber: `INSP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      companyId: "COMP-01",
      siteId: "SITE-01",
      locationName,
      inspectionType,
      inspectorName,
      inspectionDate: new Date().toISOString().split("T")[0],
      items,
      overallResult: failCount > 0 ? "FAIL_WITH_ACTION" : "PASS",
      passCount,
      failCount,
      naCount,
      status: "COMPLETED",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Inspeksi K3LH & Form Lapangan Mobile
          </h2>
          <p className="text-xs text-slate-400">Inspeksi harian/mingguan workshop, jalan haulage, pit, dan fasilitas tambang</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <Smartphone className="w-4 h-4" /> Mulai Inspeksi Lapangan
        </button>
      </div>

      <div className="space-y-4">
        {inspections.map((insp) => (
          <div key={insp.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{insp.inspectionNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      insp.overallResult === "PASS"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                    }`}
                  >
                    {insp.overallResult}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium mt-1">{insp.inspectionType} - {insp.locationName}</p>
                <p className="text-[11px] text-slate-500">Inspektur: {insp.inspectorName} ({insp.inspectionDate})</p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg">Pass: {insp.passCount}</span>
                <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 rounded-lg">Fail: {insp.failCount}</span>
                <span className="px-2.5 py-1 bg-slate-800 text-slate-400 rounded-lg">N/A: {insp.naCount}</span>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-3 space-y-2">
              {insp.items.map((itm) => (
                <div key={itm.itemId} className="flex items-center justify-between text-xs bg-slate-800/40 p-2.5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium">[{itm.category}]</span>
                    <span className="text-slate-200">{itm.requirement}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {itm.status === "PASS" && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> PASS
                      </span>
                    )}
                    {itm.status === "FAIL" && (
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> FAIL
                      </span>
                    )}
                    {itm.status === "NA" && <span className="text-slate-500">N/A</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Form Inspeksi Lapangan Mobile</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Tipe Inspeksi</label>
                <select
                  value={inspectionType}
                  onChange={(e) => setInspectionType(e.target.value as InspectionType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  <option value="Workshop Inspection">Workshop Inspection</option>
                  <option value="Equipment Inspection">Equipment Inspection</option>
                  <option value="Road Inspection">Road Inspection</option>
                  <option value="Pit Inspection">Pit Inspection</option>
                  <option value="Electrical Inspection">Electrical Inspection</option>
                  <option value="Fire Inspection">Fire Inspection</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Lokasi Inspeksi</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-white text-xs">Daftar Checklist K3:</h4>
              {items.map((itm) => (
                <div key={itm.itemId} className="bg-slate-800/80 border border-slate-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">[{itm.category}] {itm.requirement}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(itm.itemId, "PASS")}
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          itm.status === "PASS" ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        PASS
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(itm.itemId, "FAIL")}
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          itm.status === "FAIL" ? "bg-rose-600 text-white" : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        FAIL
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(itm.itemId, "NA")}
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          itm.status === "NA" ? "bg-slate-500 text-white" : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        N/A
                      </button>
                    </div>
                  </div>

                  {itm.status === "FAIL" && (
                    <div className="text-xs text-rose-300 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                      * Catatan: Item FAIL akan secara otomatis membuat Tindakan Korektif (CAPA) baru.
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveInspection}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
              >
                Simpan & Kirim Inspeksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
