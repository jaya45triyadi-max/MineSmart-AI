import React, { useState } from "react";
import {
  Mountain,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Ruler,
  TrendingUp,
  ShieldCheck,
  Plus,
  Compass,
  FileSpreadsheet,
  Building,
  Sprout,
  ArrowRight,
  Filter,
  Eye,
} from "lucide-react";
import { ReclamationLandParcel } from "../../../types/environmentTypes";

export const ReclamationTab: React.FC = () => {
  const [parcels, setParcels] = useState<ReclamationLandParcel[]>([
    {
      id: "REC-P01",
      parcelCode: "REC-PIT-ALPHA-W3",
      pitOrDisposalName: "Pit Alpha West Slope Bench 3-5",
      targetLandUse: "PRODUCTION_FOREST",
      totalAreaHa: 12.5,
      reshapedAreaHa: 12.5,
      topsoilSpreadingAreaHa: 11.8,
      revegetatedAreaHa: 10.2,
      slopeAngleDeg: 18,
      topsoilThicknessCm: 45,
      soilPh: 6.2,
      backfillingVolumeM3: 450000,
      reclamationGuaranteeBondIDR: 1250000000,
      relinquishmentStatus: "READY_FOR_EVALUATION",
      status: "LOCAL_SPECIES_PLANTED",
    },
    {
      id: "REC-P02",
      parcelCode: "REC-DISPOSAL-NORTH-A",
      pitOrDisposalName: "Waste Dump Disposal North Slope",
      targetLandUse: "CONSERVATION_FOREST",
      totalAreaHa: 18.2,
      reshapedAreaHa: 18.2,
      topsoilSpreadingAreaHa: 16.0,
      revegetatedAreaHa: 12.5,
      slopeAngleDeg: 15,
      topsoilThicknessCm: 40,
      soilPh: 5.8,
      backfillingVolumeM3: 820000,
      reclamationGuaranteeBondIDR: 1820000000,
      relinquishmentStatus: "UNDER_PREPARATION",
      status: "FAST_GROWING_PLANTED",
    },
    {
      id: "REC-P03",
      parcelCode: "REC-VOID-PIT-BETA",
      pitOrDisposalName: "Ex-Pit Beta South Void Perimeter",
      targetLandUse: "RAW_WATER_RESERVOIR",
      totalAreaHa: 8.4,
      reshapedAreaHa: 6.2,
      topsoilSpreadingAreaHa: 4.5,
      revegetatedAreaHa: 3.1,
      slopeAngleDeg: 20,
      topsoilThicknessCm: 35,
      soilPh: 6.5,
      backfillingVolumeM3: 310000,
      reclamationGuaranteeBondIDR: 840000000,
      relinquishmentStatus: "UNDER_PREPARATION",
      status: "TOPSOIL_SPREADING",
    },
  ]);

  const [selectedParcel, setSelectedParcel] = useState<ReclamationLandParcel>(parcels[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stats calculation
  const totalTargetHa = parcels.reduce((sum, p) => sum + p.totalAreaHa, 0);
  const totalReshapedHa = parcels.reduce((sum, p) => sum + p.reshapedAreaHa, 0);
  const totalTopsoilHa = parcels.reduce((sum, p) => sum + p.topsoilSpreadingAreaHa, 0);
  const totalRevegetatedHa = parcels.reduce((sum, p) => sum + p.revegetatedAreaHa, 0);
  const totalBondIDR = parcels.reduce((sum, p) => sum + p.reclamationGuaranteeBondIDR, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white border border-amber-500/30 shadow-xl flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 uppercase tracking-wider">
              <Mountain className="w-3.5 h-3.5" /> REKLAMASI LAHAN TAMANG TERPADU
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Kepmen ESDM 1827 K/2018
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Land Reclamation & Void Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Pengelolaan tahapan reklamasi tambang: <strong>Penataan Lahan (Land Reshaping), Penebaran Topsoil, Backfilling Void, Pengendalian Geoteknik Lereng</strong>, dan pencairan Jaminan Reklamasi (Jamrek).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-amber-600/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Blok Reklamasi
        </button>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Total Target Reklamasi</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalTargetHa.toFixed(1)} Ha
          </div>
          <span className="text-[10px] text-emerald-500 font-sans font-semibold">100% Sesuai Rencana RKL</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Penataan Lahan (Reshaping)</span>
          <div className="text-2xl font-black text-amber-500">
            {totalReshapedHa.toFixed(1)} Ha
          </div>
          <span className="text-[10px] text-slate-400 font-sans">
            {((totalReshapedHa / totalTargetHa) * 100).toFixed(1)}% Terealisasi
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Penebaran Topsoil (min 40cm)</span>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
            {totalTopsoilHa.toFixed(1)} Ha
          </div>
          <span className="text-[10px] text-cyan-500 font-sans">
            {((totalTopsoilHa / totalTargetHa) * 100).toFixed(1)}% Lahan Siap Tanam
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-sans font-bold uppercase">Jaminan Reklamasi (Jamrek)</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {(totalBondIDR / 1000000000).toFixed(2)} M
          </div>
          <span className="text-[10px] text-emerald-500 font-sans font-semibold">Bank Garansi ESDM</span>
        </div>
      </div>

      {/* Reclamation Parcels Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Mountain className="w-5 h-5 text-amber-500" />
              Daftar Blok Lahan Reklamasi & Rencana Pemanfaatan Akhir (Post-Mining Land Use)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitoring progres backfilling, ketebalan tanah pucuk (topsoil), dan status evaluasi pelepasan jaminan.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {parcels.length} Blok Aktif
          </span>
        </div>

        <div className="space-y-4">
          {parcels.map((parcel) => (
            <div
              key={parcel.id}
              onClick={() => setSelectedParcel(parcel)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                selectedParcel.id === parcel.id
                  ? "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20"
                  : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {parcel.parcelCode}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {parcel.pitOrDisposalName}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {parcel.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {parcel.targetLandUse.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <span>Progres Revegetasi / Luas Total</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {parcel.revegetatedAreaHa} Ha / {parcel.totalAreaHa} Ha ({((parcel.revegetatedAreaHa / parcel.totalAreaHa) * 100).toFixed(0)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${(parcel.revegetatedAreaHa / parcel.totalAreaHa) * 100}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                  />
                </div>
              </div>

              {/* Technical indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Sudut Lereng</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{parcel.slopeAngleDeg}° (Standar &lt;20°)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tebal Topsoil</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{parcel.topsoilThicknessCm} cm</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">pH Tanah Pucuk</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{parcel.soilPh} (Netral)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Jamrek ESDM</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">Rp {(parcel.reclamationGuaranteeBondIDR / 1000000).toLocaleString()} Jt</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
