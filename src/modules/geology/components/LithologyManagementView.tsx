// MINE SMART AI - Lithology Log Management & Visual Drillhole Profile

import React, { useState } from "react";
import {
  Ruler,
  Layers,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Info,
} from "lucide-react";
import { LithologyCatalogItem, LithologyRecord } from "../../../types/geologyTypes";
import { GeologyCalculationService } from "../../../services/geology/GeologyCalculationService";

interface LithologyManagementViewProps {
  catalog: LithologyCatalogItem[];
  lithologies: LithologyRecord[];
  onAddLithology: (lith: LithologyRecord) => void;
}

export const LithologyManagementView: React.FC<LithologyManagementViewProps> = ({
  catalog,
  lithologies,
  onAddLithology,
}) => {
  const [selectedBoreholeCode, setSelectedBoreholeCode] = useState<string>("BH-SGT-001");

  // Form State for Adding Interval
  const [fromDepth, setFromDepth] = useState<number>(64.8);
  const [toDepth, setToDepth] = useState<number>(85.0);
  const [selectedCode, setSelectedCode] = useState<string>("SNDST");
  const [description, setDescription] = useState<string>("Batu pasir kuarsa kasar berlapis.");

  const filteredLogs = lithologies
    .filter((l) => l.boreholeCode === selectedBoreholeCode)
    .sort((a, b) => a.fromDepth - b.fromDepth);

  const totalLoggedDepth = filteredLogs.reduce((acc, l) => Math.max(acc, l.toDepth), 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { thickness, isValid, errorReason } = GeologyCalculationService.calculateThickness(
      Number(fromDepth),
      Number(toDepth)
    );

    if (!isValid) {
      alert(`Gagal Menambah Interval: ${errorReason}`);
      return;
    }

    const catItem = catalog.find((c) => c.code === selectedCode);

    const newLog: LithologyRecord = {
      id: `lith-${Date.now()}`,
      companyId: "comp-01",
      siteId: "site-01",
      boreholeId: "bh-001",
      boreholeCode: selectedBoreholeCode,
      fromDepth: Number(fromDepth),
      toDepth: Number(toDepth),
      thickness,
      lithologyCode: selectedCode,
      lithologyName: catItem ? catItem.name : "Unknown",
      description,
      weatheringGrade: "UNWEATHERED",
      color: "Gray",
      grainSize: "Medium",
      hardness: "MEDIUM_HARD",
      validationStatus: "VALID",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddLithology(newLog);
    setFromDepth(Number(toDepth));
    setToDepth(Number(toDepth) + 10);
  };

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Ruler className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Geological Drillhole Log & Catalog</h3>
            <p className="text-xs text-slate-400">
              Kelola interval deskripsi batuan (Lithology) & Katalog Master Geologi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-semibold">Pilih Titik Bor:</label>
          <select
            value={selectedBoreholeCode}
            onChange={(e) => setSelectedBoreholeCode(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
          >
            <option value="BH-SGT-001">BH-SGT-001</option>
            <option value="BH-SGT-002">BH-SGT-002</option>
            <option value="BH-SGT-003">BH-SGT-003</option>
            <option value="BH-SGT-004">BH-SGT-004</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Visual Drillhole Strip Column */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>Visual Log Profile ({selectedBoreholeCode})</span>
            <span className="font-mono text-emerald-400">Total: {totalLoggedDepth}m</span>
          </h4>

          {/* Graphical Stratigraphy Column */}
          <div className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 min-h-[400px] flex flex-col gap-1 overflow-y-auto max-h-[550px]">
            {filteredLogs.map((log) => {
              const catItem = catalog.find((c) => c.code === log.lithologyCode);
              const isCoal = log.lithologyCode === "COAL";
              return (
                <div
                  key={log.id}
                  className="w-full p-2.5 rounded border transition-all flex items-center justify-between relative group"
                  style={{
                    backgroundColor: isCoal ? "#064e3b" : "#1e293b",
                    borderColor: isCoal ? "#10b981" : "#334155",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-white/20"
                      style={{ backgroundColor: catItem?.colorHex || "#64748b" }}
                    ></span>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{log.lithologyName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({log.lithologyCode})</span>
                      </div>
                      <span className="text-[10px] text-slate-300 block">{log.description}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs flex-shrink-0">
                    <div className="text-emerald-400 font-bold">{log.thickness}m</div>
                    <div className="text-[10px] text-slate-400">
                      {log.fromDepth} - {log.toDepth}m
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Form & Catalog Manager */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Lithology Interval Form */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Tambah Interval Log Lithology
            </h4>

            <form onSubmit={handleCreateSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">From Depth (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={fromDepth}
                  onChange={(e) => setFromDepth(Number(e.target.value))}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">To Depth (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={toDepth}
                  onChange={(e) => setToDepth(Number(e.target.value))}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Katalog Batuan</label>
                <select
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {catalog.map((c) => (
                    <option key={c.id} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors cursor-pointer"
                >
                  Tambah Interval
                </button>
              </div>

              <div className="col-span-2 md:col-span-4">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Deskripsi Geologis</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi warna, kekerasan, struktur perlapisan..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </form>
          </div>

          {/* Lithology Catalog Master Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Master Katalog Batuan Perusahaan
              </span>
              <span className="text-xs text-slate-400 font-mono">{catalog.length} Kode Batuan</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {catalog.map((cat) => (
                <div key={cat.id} className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                      style={{ backgroundColor: cat.colorHex }}
                    ></span>
                    <div>
                      <div className="text-xs font-bold text-white">{cat.name}</div>
                      <span className="text-[10px] text-slate-400">{cat.description}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 font-mono rounded">
                    {cat.code}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
