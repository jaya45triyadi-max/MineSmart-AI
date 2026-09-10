import React, { useState } from "react";
import {
  Trash2,
  Plus,
  FileText,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Building2,
  Truck,
  X,
} from "lucide-react";
import { EnvironmentalWasteRecord, WasteCategory, WasteStatus } from "../../../types/environmentTypes";

interface Props {
  wasteRecords: EnvironmentalWasteRecord[];
  onAddWasteRecord: (record: Omit<EnvironmentalWasteRecord, "id" | "createdAt" | "updatedAt">) => void;
}

export const WasteManagementTab: React.FC<Props> = ({ wasteRecords, onAddWasteRecord }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wasteType, setWasteType] = useState("Pelumas Bekas / Oli Bekas (B105d)");
  const [category, setCategory] = useState<WasteCategory>("HAZARDOUS_B3");
  const [sourceLocation, setSourceLocation] = useState("Central Workshop Bay 2");
  const [generationDate, setGenerationDate] = useState(new Date().toISOString().split("T")[0]);
  const [quantity, setQuantity] = useState(10);
  const [unit, setUnit] = useState<"KG" | "TON" | "LITER" | "BARREL" | "DRUM">("DRUM");
  const [temporaryStorageLocation, setTemporaryStorageLocation] = useState("TPS B3 Workshop Central");
  const [destinationHandler, setDestinationHandler] = useState("PT Wastec International");
  const [manifestNumber, setManifestNumber] = useState(`MNF-B3-${Date.now().toString().slice(-6)}`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddWasteRecord({
      wasteId: `WST-${Date.now()}`,
      companyId: "COMP-01",
      siteId: "SITE-01",
      wasteType,
      category,
      sourceLocation,
      generationDate,
      quantity,
      unit,
      temporaryStorageLocation,
      destinationHandler,
      transportMethod: "Truk Tangki Khusus B3",
      manifestNumber,
      status: "STORED",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-slate-900 p-6 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <Trash2 className="h-6 w-6 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              Limbah B3 & Non-B3 Waste Management
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pencatatan penciptaan, penyimpanan TPS B3, manifes festronik KLHK, & pengangkutan limbah industri tambang
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-amber-500 transition shadow-md self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Catat Limbah Baru
        </button>
      </div>

      {/* TPS B3 Storage Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            TPS B3 Workshop Central
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-400">12 Drum</span>
            <span className="text-xs text-slate-400">Oli Bekas (B105d)</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Izin TPS B3: SK No. 440/TPS-B3/2024 (Masa simpan &lt; 90 hari)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Filter & Majun Terkontaminasi
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">450 kg</span>
            <span className="text-xs text-slate-400">Limbah B3 Padat</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Terjadwal pengangkutan oleh PT PPLI tanggal 20 Ags 2026
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Status Festronik KLHK
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400">VALIDATED</span>
            <span className="text-xs text-emerald-400">Festronik Sync</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Seluruh manifes elektronik B3 sinkron dengan SIMPEL MoLHK
          </p>
        </div>
      </div>

      {/* Waste Register Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-white text-sm">
            Register Manifes Limbah Tambang
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">ID Limbah / Manifes</th>
                <th className="px-4 py-3.5">Jenis & Kategori Limbah</th>
                <th className="px-4 py-3.5">Sumber & Lokasi TPS</th>
                <th className="px-4 py-3.5">Jumlah / Kuantitas</th>
                <th className="px-4 py-3.5">Pengangkut / Pengolah</th>
                <th className="px-4 py-3.5">Status Limbah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {wasteRecords.map((w) => (
                <tr key={w.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-semibold text-white">
                    {w.manifestNumber}
                    <div className="text-[10px] text-slate-500">{w.generationDate}</div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-200">{w.wasteType}</p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        w.category === "HAZARDOUS_B3"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {w.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {w.sourceLocation}
                    <div className="text-[10px] text-slate-500">{w.temporaryStorageLocation}</div>
                  </td>
                  <td className="px-4 py-3 font-bold text-amber-400">
                    {w.quantity} {w.unit}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{w.destinationHandler}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        w.status === "STORED"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                Pencatatan Log Limbah Baru
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Jenis Limbah & Kode
                </label>
                <input
                  type="text"
                  required
                  value={wasteType}
                  onChange={(e) => setWasteType(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Kategori Limbah
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WasteCategory)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="HAZARDOUS_B3">Limbah B3 (Hazardous)</option>
                    <option value="DOMESTIC">Sampah Domestik</option>
                    <option value="SCRAP_METAL">Scrap Metal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Lokasi Sumber
                  </label>
                  <input
                    type="text"
                    value={sourceLocation}
                    onChange={(e) => setSourceLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Jumlah / Volume
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    Satuan
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="DRUM">DRUM</option>
                    <option value="KG">KG</option>
                    <option value="TON">TON</option>
                    <option value="LITER">LITER</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-slate-800 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 px-4 py-2 font-semibold text-white hover:bg-amber-500"
                >
                  Simpan Limbah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
