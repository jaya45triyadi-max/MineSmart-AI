import React from "react";
import {
  Trees,
  Sprout,
  Plus,
  Info,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { PlantSpecies } from "../../../types/reclamationTypes";

interface Props {
  speciesList: PlantSpecies[];
}

export const RevegetationTab: React.FC<Props> = ({ speciesList }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Trees className="h-5 w-5 text-emerald-400" />
            Revegetation & Plant Species Master Data
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Master spesies tanaman reklamasi (Cover Crop, Pioneer, Fast Growing, Spesies Lokal) dan standar kerapatan tanam.
          </p>
        </div>
      </div>

      {/* Species Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {speciesList.map((sp) => (
          <div
            key={sp.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md flex flex-col justify-between space-y-3 hover:border-slate-700 transition"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-emerald-400">{sp.speciesId}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {sp.category}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">{sp.name}</h3>
                <p className="text-xs italic text-slate-400 mt-0.5">{sp.scientificName}</p>
                <p className="text-xs text-slate-300 font-medium mt-1">Lokal: {sp.localName}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Tipe Tumbuh:</span>
                <span className="text-slate-200 font-semibold">{sp.growthType}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Standar Kerapatan:</span>
                <span className="text-emerald-400 font-bold">
                  {sp.recommendedDensityPerHa} {sp.unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory Note */}
      <div className="rounded-2xl border border-amber-800/30 bg-amber-950/20 p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200/90 space-y-1">
          <strong className="text-amber-400 block font-bold">Catatan Agronomi & Lingkungan Reklamasi:</strong>
          <p>
            Pemilihan spesies tanaman harus mengikuti tahap suksesi alami (LCC -&gt; Pioneer/Fast Growing -&gt; Lokal Kalimantan).
            Penetapan rekomendasi spesies akhir wajib melalui verifikasi dan persetujuan Tim Environmental &amp; Agronomi Tambang.
          </p>
        </div>
      </div>
    </div>
  );
};
