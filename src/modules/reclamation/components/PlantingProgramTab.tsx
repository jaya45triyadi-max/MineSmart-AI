import React, { useState } from "react";
import {
  Sprout,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Layers,
  Ruler,
} from "lucide-react";
import {
  PlantingProgram,
  ReclamationProject,
  PlantSpecies,
  PlantingStatus,
} from "../../../types/reclamationTypes";

interface Props {
  programs: PlantingProgram[];
  projects: ReclamationProject[];
  speciesList: PlantSpecies[];
  onAddProgram: (program: Omit<PlantingProgram, "id">) => void;
}

export const PlantingProgramTab: React.FC<Props> = ({
  programs,
  projects,
  speciesList,
  onAddProgram,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [projectId, setProjectId] = useState(projects[0]?.projectId || "");
  const [areaName, setAreaName] = useState("Waste Dump Disposal North Slope Bench 3");
  const [speciesId, setSpeciesId] = useState(speciesList[1]?.speciesId || "");
  const [plantingDate, setPlantingDate] = useState("2026-08-10");
  const [targetQuantity, setTargetQuantity] = useState<number>(5000);
  const [actualQuantity, setActualQuantity] = useState<number>(4800);
  const [targetDensityPerHa, setTargetDensityPerHa] = useState<number>(625);
  const [actualDensityPerHa, setActualDensityPerHa] = useState<number>(615);
  const [responsiblePerson, setResponsiblePerson] = useState("Bambang Suherman");
  const [contractorName, setContractorName] = useState("PT Rimba Hijaubumi Ops");
  const [seedlingsReceived, setSeedlingsReceived] = useState<number>(5000);
  const [seedlingsPlanted, setSeedlingsPlanted] = useState<number>(4800);
  const [seedlingsDamaged, setSeedlingsDamaged] = useState<number>(80);
  const [seedlingsReplaced, setSeedlingsReplaced] = useState<number>(50);
  const [seedlingsSurvived, setSeedlingsSurvived] = useState<number>(4400);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const species = speciesList.find((s) => s.speciesId === speciesId);
    const failed = Math.max(0, seedlingsPlanted - seedlingsSurvived);
    const survivalRate = seedlingsPlanted > 0 ? Math.round((seedlingsSurvived / seedlingsPlanted) * 100) : 0;

    onAddProgram({
      plantingProgramId: `PLANT-2026-A${programs.length + 1}`,
      projectId,
      areaId: "DA-DISPOSAL-NORTH",
      areaName,
      speciesId,
      speciesName: species ? `${species.name} (${species.scientificName})` : "Bibit Reklamasi",
      plantingDate,
      targetQuantity,
      actualQuantity,
      targetDensityPerHa,
      actualDensityPerHa,
      responsiblePerson,
      contractorName,
      seedlingsReceived,
      seedlingsPlanted,
      seedlingsDamaged,
      seedlingsReplaced,
      seedlingsSurvived,
      seedlingsFailed: failed,
      survivalRatePercent: survivalRate,
      status: survivalRate < 70 ? "REPLANTING_REQUIRED" : "IN_PROGRESS",
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sprout className="h-5 w-5 text-emerald-400" />
            Planting Program & Seedling Survival Tracking
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Program penanaman bibit, penerimaan persemaian (nursery), tingkat Kerapatan Tanam (plants/ha), dan persentase Survival Rate.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/10"
        >
          <Plus className="h-4 w-4" /> Tambah Program Penanaman
        </button>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {programs.map((prog) => (
          <div
            key={prog.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase">
                  {prog.plantingProgramId} • {prog.projectId}
                </span>
                <h3 className="font-bold text-white text-sm mt-0.5">{prog.areaName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{prog.speciesName}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto border ${
                  prog.survivalRatePercent >= 80
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : prog.survivalRatePercent >= 60
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                Survival: {prog.survivalRatePercent}%
              </span>
            </div>

            {/* Seedlings Inventory Breakdown */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
              <div className="rounded-xl bg-slate-950 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Diterima</span>
                <strong className="text-white text-xs">{prog.seedlingsReceived}</strong>
              </div>
              <div className="rounded-xl bg-slate-950 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Ditanam</span>
                <strong className="text-emerald-400 text-xs">{prog.seedlingsPlanted}</strong>
              </div>
              <div className="rounded-xl bg-slate-950 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Rusak</span>
                <strong className="text-rose-400 text-xs">{prog.seedlingsDamaged}</strong>
              </div>
              <div className="rounded-xl bg-slate-950 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Disisip</span>
                <strong className="text-amber-400 text-xs">{prog.seedlingsReplaced}</strong>
              </div>
              <div className="rounded-xl bg-slate-950 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Hidup</span>
                <strong className="text-emerald-400 text-xs">{prog.seedlingsSurvived}</strong>
              </div>
              <div className="rounded-xl bg-slate-950 p-2 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Mati</span>
                <strong className="text-slate-400 text-xs">{prog.seedlingsFailed}</strong>
              </div>
            </div>

            {/* Density & Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-800 gap-2">
              <div>
                <span>Kerapatan Tanam: </span>
                <strong className="text-emerald-400 font-bold">
                  {prog.actualDensityPerHa} / {prog.targetDensityPerHa} plants/ha
                </strong>
              </div>
              <div>
                <span className="text-slate-400">Kontraktor: </span>
                <strong className="text-slate-200">{prog.contractorName}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Planting Program */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sprout className="h-4 w-4 text-emerald-400" /> Form Program Penanaman Bibit Baru
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Proyek Reklamasi</label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.projectId}>
                        {p.projectId} - {p.projectName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Spesies Tanaman</label>
                  <select
                    value={speciesId}
                    onChange={(e) => setSpeciesId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {speciesList.map((s) => (
                      <option key={s.id} value={s.speciesId}>
                        {s.name} ({s.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nama Area Sektor Penanaman</label>
                <input
                  type="text"
                  required
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Bibit Diterima</label>
                  <input
                    type="number"
                    value={seedlingsReceived}
                    onChange={(e) => setSeedlingsReceived(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Bibit Ditanam</label>
                  <input
                    type="number"
                    value={seedlingsPlanted}
                    onChange={(e) => setSeedlingsPlanted(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Bibit Survived</label>
                  <input
                    type="number"
                    value={seedlingsSurvived}
                    onChange={(e) => setSeedlingsSurvived(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Kerapatan (plants/ha)</label>
                  <input
                    type="number"
                    value={targetDensityPerHa}
                    onChange={(e) => setTargetDensityPerHa(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Realisasi Kerapatan</label>
                  <input
                    type="number"
                    value={actualDensityPerHa}
                    onChange={(e) => setActualDensityPerHa(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Kontraktor Penanaman</label>
                  <input
                    type="text"
                    value={contractorName}
                    onChange={(e) => setContractorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Penanggung Jawab (PIC)</label>
                  <input
                    type="text"
                    value={responsiblePerson}
                    onChange={(e) => setResponsiblePerson(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Simpan Program Penanaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
