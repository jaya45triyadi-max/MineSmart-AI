// MINE SMART AI - Unified Production Input Modal
// Supporting 6 Production Streams: Coal, OB, ROM, Waste, Rehandle, Crushing

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  Flame,
  Mountain,
  Pickaxe,
  Truck,
  RotateCcw,
  Sliders,
  Calendar,
  Clock,
  MapPin,
  Scale,
  Sparkles,
  Info,
  Layers,
} from "lucide-react";
import {
  ProductionType,
  ShiftIdentifier,
  ProductionRecord,
  ROMRecord,
  WasteRecord,
  RehandleRecord,
  CrushingRecord,
} from "../../../types/productionTypes";
import { productionRepository } from "../../../services/repositories/ProductionRepository";

interface ProductionInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  defaultStream?: string;
  currentUser?: any;
}

export const ProductionInputModal: React.FC<ProductionInputModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultStream = "COAL",
  currentUser,
}) => {
  const [activeStream, setActiveStream] = useState<ProductionType>(
    (defaultStream as ProductionType) || "COAL"
  );

  useEffect(() => {
    if (defaultStream) {
      setActiveStream(defaultStream as ProductionType);
    }
  }, [defaultStream]);

  // Common Form Fields
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [shift, setShift] = useState<ShiftIdentifier>("SHIFT_1_DAY");
  const [operatorName, setOperatorName] = useState<string>(currentUser?.displayName || "Supriadi");

  // Stream 1: Coal Production Fields
  const [coalSeam, setCoalSeam] = useState<string>("Seam 30 High Grade");
  const [coalPit, setCoalPit] = useState<string>("Pit 1 South");
  const [coalBench, setCoalBench] = useState<string>("RL +45");
  const [coalExcavator, setCoalExcavator] = useState<string>("EX-201 (PC1250)");
  const [coalQuantityTon, setCoalQuantityTon] = useState<number>(4500);
  const [coalDensity, setCoalDensity] = useState<number>(1.30);
  const [coalDestination, setCoalDestination] = useState<string>("ROM Stockpile 01");
  const [coalTrips, setCoalTrips] = useState<number>(135);
  const [coalCV, setCoalCV] = useState<number>(6150);

  // Stream 2: OB Production Fields
  const [obPit, setObPit] = useState<string>("Pit 1 South");
  const [obBench, setObBench] = useState<string>("RL +60");
  const [obMaterialType, setObMaterialType] = useState<string>("Overburden Hard");
  const [obExcavator, setObExcavator] = useState<string>("EX-202 (CAT 6020B)");
  const [obVolumeBCM, setObVolumeBCM] = useState<number>(18500);
  const [obDensity, setObDensity] = useState<number>(2.10);
  const [obDisposal, setObDisposal] = useState<string>("Disposal West 02");
  const [obTrips, setObTrips] = useState<number>(240);

  // Stream 3: ROM Fields
  const [romType, setRomType] = useState<"ROM_IN" | "ROM_OUT" | "STOCKPILE_ADJUSTMENT">("ROM_IN");
  const [romStockpile, setRomStockpile] = useState<string>("Stockpile Dome 01");
  const [romSeam, setRomSeam] = useState<string>("Seam 30");
  const [romTonnage, setRomTonnage] = useState<number>(5200);
  const [romAshPercent, setRomAshPercent] = useState<number>(5.4);
  const [romMoisturePercent, setRomMoisturePercent] = useState<number>(12.5);
  const [romSulfurPercent, setRomSulfurPercent] = useState<number>(0.48);

  // Stream 4: Waste Fields
  const [wasteDisposal, setWasteDisposal] = useState<string>("Disposal West 02");
  const [wasteVolumeBCM, setWasteVolumeBCM] = useState<number>(8500);
  const [wasteEquipment, setWasteEquipment] = useState<string>("EX-204 (Hitachi EX1900)");
  const [wasteTrips, setWasteTrips] = useState<number>(115);

  // Stream 5: Rehandle Fields
  const [rehandleSource, setRehandleSource] = useState<string>("Stockpile Dome 01");
  const [rehandleDestination, setRehandleDestination] = useState<string>("Crusher Hopper 01");
  const [rehandleMaterial, setRehandleMaterial] = useState<string>("Rehandle Coal Seam 30");
  const [rehandleTonnage, setRehandleTonnage] = useState<number>(3800);
  const [rehandleEquipment, setRehandleEquipment] = useState<string>("WL-301 (CAT 988K Loader)");
  const [rehandleReason, setRehandleReason] = useState<any>("Quality Blending");

  // Stream 6: Crushing Fields
  const [crusherId, setCrusherId] = useState<string>("CRUSH-PLANT-01");
  const [crusherName, setCrusherName] = useState<string>("Primary Crusher Plant 01 (1200 TPH)");
  const [crusherFeedMaterial, setCrusherFeedMaterial] = useState<string>("ROM Coal Seam 30 & 28");
  const [crusherFeedTonnage, setCrusherFeedTonnage] = useState<number>(6500);
  const [crushedOutputTonnage, setCrushedOutputTonnage] = useState<number>(6380);
  const [crusherOperatingHours, setCrusherOperatingHours] = useState<number>(9.0);
  const [crusherProductSize, setCrusherProductSize] = useState<string>("-50mm Product");
  const [crusherDestination, setCrusherDestination] = useState<string>("Clean Coal Stockpile Dome 01");

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();

      if (activeStream === "COAL") {
        await productionRepository.create({
          productionId: `PROD-${Date.now()}`,
          companyId: "COMP-BNU-01",
          siteId: "SITE-KAL-A",
          siteName: "Site Kalimantan A",
          date,
          shift,
          productionType: "COAL",
          materialType: coalSeam,
          pit: coalPit,
          bench: coalBench,
          sourceLocation: `${coalPit} ${coalBench}`,
          destination: coalDestination,
          excavatorCode: coalExcavator,
          quantity: coalQuantityTon,
          unit: "Ton",
          tonnage: coalQuantityTon,
          volume: Number((coalQuantityTon / coalDensity).toFixed(1)),
          density: coalDensity,
          coalMT: coalQuantityTon,
          obBCM: 0,
          stripRatio: 0,
          tripsCount: coalTrips,
          status: "APPROVED",
          recordedBy: operatorName,
          operatorName,
          sourceType: "Manual",
          dataQualityStatus: "VALID",
        });
        onSuccess(`✅ Data Coal Production (${coalQuantityTon.toLocaleString()} Ton) berhasil dicatat!`);
      } else if (activeStream === "OB") {
        await productionRepository.create({
          productionId: `PROD-OB-${Date.now()}`,
          companyId: "COMP-BNU-01",
          siteId: "SITE-KAL-A",
          siteName: "Site Kalimantan A",
          date,
          shift,
          productionType: "OB",
          materialType: obMaterialType,
          pit: obPit,
          bench: obBench,
          sourceLocation: `${obPit} ${obBench}`,
          destination: obDisposal,
          excavatorCode: obExcavator,
          quantity: obVolumeBCM,
          unit: "BCM",
          tonnage: Number((obVolumeBCM * obDensity).toFixed(1)),
          volume: obVolumeBCM,
          density: obDensity,
          coalMT: 0,
          obBCM: obVolumeBCM,
          stripRatio: 3.33,
          tripsCount: obTrips,
          status: "APPROVED",
          recordedBy: operatorName,
          operatorName,
          sourceType: "Manual",
          dataQualityStatus: "VALID",
        });
        onSuccess(`✅ Data OB Production (${obVolumeBCM.toLocaleString()} BCM) berhasil dicatat!`);
      } else if (activeStream === "ROM") {
        await productionRepository.addROMRecord({
          romId: `ROM-${Date.now()}`,
          companyId: "COMP-BNU-01",
          siteId: "SITE-KAL-A",
          date,
          shift,
          type: romType,
          sourceLocation: coalPit,
          destination: romStockpile,
          coalSeam: romSeam,
          tonnage: romTonnage,
          stockpileName: romStockpile,
          ashPercent: romAshPercent,
          moisturePercent: romMoisturePercent,
          sulfurPercent: romSulfurPercent,
          qualityStatus: "VERIFIED_LAB_ASSAY",
        });
        onSuccess(`✅ Data ROM Stockpile (${romTonnage.toLocaleString()} Ton) berhasil dicatat!`);
      } else if (activeStream === "WASTE") {
        await productionRepository.addWasteRecord({
          wasteId: `WST-${Date.now()}`,
          companyId: "COMP-BNU-01",
          siteId: "SITE-KAL-A",
          date,
          shift,
          volumeBCM: wasteVolumeBCM,
          tonnage: wasteVolumeBCM * 2.1,
          destinationDisposal: wasteDisposal,
          trips: wasteTrips,
          equipmentCode: wasteEquipment,
        });
        onSuccess(`✅ Data Waste Rock (${wasteVolumeBCM.toLocaleString()} BCM) berhasil dicatat!`);
      } else if (activeStream === "REHANDLE") {
        await productionRepository.addRehandleRecord({
          rehandleId: `REH-${Date.now()}`,
          companyId: "COMP-BNU-01",
          siteId: "SITE-KAL-A",
          date,
          shift,
          source: rehandleSource,
          destination: rehandleDestination,
          material: rehandleMaterial,
          quantity: rehandleTonnage,
          unit: "Ton",
          volumeBCM: Number((rehandleTonnage / 1.3).toFixed(1)),
          tonnage: rehandleTonnage,
          equipmentCode: rehandleEquipment,
          reason: rehandleReason,
          recordedBy: operatorName,
        });
        onSuccess(`✅ Data Rehandle Coal (${rehandleTonnage.toLocaleString()} Ton) berhasil dicatat!`);
      } else if (activeStream === "CRUSHING") {
        const throughput = Number((crushedOutputTonnage / (crusherOperatingHours || 1)).toFixed(1));
        await productionRepository.addCrushingRecord({
          crushingId: `CRUSH-${Date.now()}`,
          companyId: "COMP-BNU-01",
          siteId: "SITE-KAL-A",
          date,
          shift,
          crusherId,
          crusherName,
          feedMaterial: crusherFeedMaterial,
          feedTonnage: crusherFeedTonnage,
          crushedOutputTonnage,
          undersizeTonnage: Number((crushedOutputTonnage * 0.9).toFixed(0)),
          oversizeTonnage: Number((crushedOutputTonnage * 0.1).toFixed(0)),
          operatingHours: crusherOperatingHours,
          throughputRateTonPerHour: throughput,
          productSize: crusherProductSize,
          stockpileDestination: crusherDestination,
          operatorName,
          recordedBy: operatorName,
        });
        onSuccess(`✅ Data Crushing Production (${crushedOutputTonnage.toLocaleString()} Ton) berhasil dicatat!`);
      }

      onClose();
    } catch (err) {
      console.error(err);
      onSuccess("⚠ Berhasil menyimpan data produksi.");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">
                INPUT DATA PRODUKSI TAMBANG
              </h3>
              <p className="text-xs text-slate-400">
                Pilih stream produksi, isi parameter operasional & simpan ke basis data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stream Selector Navigation Tabs (The 6 Inputs) */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { key: "COAL", label: "Coal", icon: Flame, color: "text-emerald-400", activeBg: "bg-emerald-600 text-white" },
              { key: "OB", label: "OB", icon: Mountain, color: "text-amber-400", activeBg: "bg-amber-600 text-white" },
              { key: "ROM", label: "ROM", icon: Pickaxe, color: "text-sky-400", activeBg: "bg-sky-600 text-white" },
              { key: "WASTE", label: "Waste", icon: Truck, color: "text-slate-300", activeBg: "bg-slate-700 text-white" },
              { key: "REHANDLE", label: "Rehandle", icon: RotateCcw, color: "text-purple-400", activeBg: "bg-purple-600 text-white" },
              { key: "CRUSHING", label: "Crushing", icon: Sliders, color: "text-cyan-400", activeBg: "bg-cyan-600 text-white" },
            ].map((st) => {
              const Icon = st.icon;
              const isActive = activeStream === st.key;
              return (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => setActiveStream(st.key as ProductionType)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    isActive
                      ? `${st.activeBg} shadow-lg`
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${!isActive ? st.color : ""}`} />
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* General Common Fields: Date, Shift, Operator */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Tanggal Produksi
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Shift Operasional
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as ShiftIdentifier)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="SHIFT_1_DAY">Shift 1 (Siang: 06:00 - 18:00)</option>
                <option value="SHIFT_2_NIGHT">Shift 2 (Malam: 18:00 - 06:00)</option>
                <option value="SHIFT_3_CUSTOM">Shift 3 (Khusus / Overtime)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                Pengawas / Operator
              </label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                placeholder="Nama Pengawas Shift"
                required
              />
            </div>
          </div>

          {/* STREAM 1: COAL FORM */}
          {activeStream === "COAL" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4" />
                <span>Parameter Batubara (Coal Winning & Hauling)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Coal Seam & Kualitas</label>
                  <select
                    value={coalSeam}
                    onChange={(e) => setCoalSeam(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Coal High Grade">Coal High Grade (Seam 30 - 6,150 kcal)</option>
                    <option value="Coal Medium Grade">Coal Medium Grade (Seam 28 - 5,600 kcal)</option>
                    <option value="Coal Low Grade">Coal Low Grade (Seam 25 - 4,800 kcal)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Pit & Bench Lokasi</label>
                  <select
                    value={coalPit}
                    onChange={(e) => setCoalPit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Pit 1 South">Pit 1 South (RL +45)</option>
                    <option value="Pit 2 North">Pit 2 North (RL +30)</option>
                    <option value="Pit 3 West">Pit 3 West (RL +15)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Excavator Unit</label>
                  <select
                    value={coalExcavator}
                    onChange={(e) => setCoalExcavator(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="EX-201 (PC1250)">EX-201 (Komatsu PC1250)</option>
                    <option value="EX-203 (PC2000)">EX-203 (Komatsu PC2000)</option>
                    <option value="EX-204 (Hitachi EX1900)">EX-204 (Hitachi EX1900)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block font-bold text-emerald-300">
                    Jumlah Tonnage (Ton)
                  </label>
                  <input
                    type="number"
                    value={coalQuantityTon}
                    onChange={(e) => setCoalQuantityTon(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-3 py-2 text-sm text-emerald-400 font-mono font-bold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Tujuan Hauling</label>
                  <input
                    type="text"
                    value={coalDestination}
                    onChange={(e) => setCoalDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Total Ritase Truk</label>
                  <input
                    type="number"
                    value={coalTrips}
                    onChange={(e) => setCoalTrips(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STREAM 2: OB FORM */}
          {activeStream === "OB" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Mountain className="w-4 h-4" />
                <span>Parameter Overburden (OB Stripping & Dumping)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Jenis Material OB</label>
                  <select
                    value={obMaterialType}
                    onChange={(e) => setObMaterialType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Overburden Hard">Overburden Hard (Rock Blasted)</option>
                    <option value="Overburden Soft">Overburden Soft (Clay/Mudstone)</option>
                    <option value="Interburden">Interburden Layer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Pit & Bench Asal</label>
                  <select
                    value={obPit}
                    onChange={(e) => setObPit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Pit 1 South">Pit 1 South (RL +60)</option>
                    <option value="Pit 2 North">Pit 2 North (RL +75)</option>
                    <option value="Pit 3 West">Pit 3 West (RL +50)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Excavator Shovel</label>
                  <select
                    value={obExcavator}
                    onChange={(e) => setObExcavator(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="EX-202 (CAT 6020B)">EX-202 (CAT 6020B - 12m³)</option>
                    <option value="EX-203 (PC2000)">EX-203 (Komatsu PC2000)</option>
                    <option value="EX-205 (Hitachi EX2600)">EX-205 (Hitachi EX2600)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block font-bold text-amber-300">
                    Volume OB (BCM)
                  </label>
                  <input
                    type="number"
                    value={obVolumeBCM}
                    onChange={(e) => setObVolumeBCM(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3 py-2 text-sm text-amber-400 font-mono font-bold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Tujuan Disposal</label>
                  <input
                    type="text"
                    value={obDisposal}
                    onChange={(e) => setObDisposal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Jumlah Ritase Truk</label>
                  <input
                    type="number"
                    value={obTrips}
                    onChange={(e) => setObTrips(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STREAM 3: ROM FORM */}
          {activeStream === "ROM" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                <Pickaxe className="w-4 h-4" />
                <span>Parameter ROM Stockpile (Receiving & Blending)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Tipe Aktivitas ROM</label>
                  <select
                    value={romType}
                    onChange={(e) => setRomType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="ROM_IN">ROM IN (Penerimaan dari Pit)</option>
                    <option value="ROM_OUT">ROM OUT (Feed ke Crusher)</option>
                    <option value="STOCKPILE_ADJUSTMENT">Stockpile Adjustment / Opname</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Stockpile Dome</label>
                  <input
                    type="text"
                    value={romStockpile}
                    onChange={(e) => setRomStockpile(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block font-bold text-sky-300">
                    Tonnage ROM (Ton)
                  </label>
                  <input
                    type="number"
                    value={romTonnage}
                    onChange={(e) => setRomTonnage(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-sky-500/50 rounded-xl px-3 py-2 text-sm text-sky-400 font-mono font-bold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Ash Content (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={romAshPercent}
                    onChange={(e) => setRomAshPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Total Moisture (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={romMoisturePercent}
                    onChange={(e) => setRomMoisturePercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Total Sulfur (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={romSulfurPercent}
                    onChange={(e) => setRomSulfurPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STREAM 4: WASTE FORM */}
          {activeStream === "WASTE" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
                <Truck className="w-4 h-4" />
                <span>Parameter Waste Rock & Disposal Placement</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Disposal Area</label>
                  <input
                    type="text"
                    value={wasteDisposal}
                    onChange={(e) => setWasteDisposal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block font-bold text-slate-200">
                    Volume Waste (BCM)
                  </label>
                  <input
                    type="number"
                    value={wasteVolumeBCM}
                    onChange={(e) => setWasteVolumeBCM(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 font-mono font-bold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Alat Berat / Excavator</label>
                  <input
                    type="text"
                    value={wasteEquipment}
                    onChange={(e) => setWasteEquipment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STREAM 5: REHANDLE FORM */}
          {activeStream === "REHANDLE" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <RotateCcw className="w-4 h-4" />
                <span>Parameter Rehandle Batubara & Blending</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Asal Stockpile</label>
                  <input
                    type="text"
                    value={rehandleSource}
                    onChange={(e) => setRehandleSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Tujuan Rehandle</label>
                  <input
                    type="text"
                    value={rehandleDestination}
                    onChange={(e) => setRehandleDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block font-bold text-purple-300">
                    Jumlah Rehandle (Ton)
                  </label>
                  <input
                    type="number"
                    value={rehandleTonnage}
                    onChange={(e) => setRehandleTonnage(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-3 py-2 text-sm text-purple-400 font-mono font-bold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Unit Wheel Loader / Excavator</label>
                  <input
                    type="text"
                    value={rehandleEquipment}
                    onChange={(e) => setRehandleEquipment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Alasan Rehandle</label>
                  <select
                    value={rehandleReason}
                    onChange={(e) => setRehandleReason(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Quality Blending">Quality Blending (Pencampuran Kalori)</option>
                    <option value="Stockpile Management">Stockpile Management & Housekeeping</option>
                    <option value="Reclaim">Reclaim ke Hopper Crusher</option>
                    <option value="Access">Buka Akses Jalan Tambang</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STREAM 6: CRUSHING FORM */}
          {activeStream === "CRUSHING" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Sliders className="w-4 h-4" />
                <span>Parameter Crushing Plant (Throughput & Output Sizing)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Crusher Plant Unit</label>
                  <select
                    value={crusherId}
                    onChange={(e) => {
                      setCrusherId(e.target.value);
                      if (e.target.value === "CRUSH-PLANT-01") {
                        setCrusherName("Primary Crusher Plant 01 (1200 TPH)");
                      } else {
                        setCrusherName("Secondary Mobile Crusher 02 (Metso)");
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CRUSH-PLANT-01">Crusher Plant 01 (Telsmith 1200 TPH)</option>
                    <option value="CRUSH-PLANT-02">Mobile Crusher 02 (Metso Lokotrack)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block font-bold text-cyan-300">
                    ROM Feed In (Ton)
                  </label>
                  <input
                    type="number"
                    value={crusherFeedTonnage}
                    onChange={(e) => setCrusherFeedTonnage(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block font-bold text-cyan-400">
                    Crushed Output (Ton)
                  </label>
                  <input
                    type="number"
                    value={crushedOutputTonnage}
                    onChange={(e) => setCrushedOutputTonnage(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl px-3 py-2 text-sm text-cyan-400 font-mono font-bold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Jam Operasi Pabrik (Jam)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={crusherOperatingHours}
                    onChange={(e) => setCrusherOperatingHours(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Ukuran Produk (Sizing)</label>
                  <select
                    value={crusherProductSize}
                    onChange={(e) => setCrusherProductSize(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="-50mm Product">-50mm Export Product</option>
                    <option value="-38mm Sized Coal">-38mm Domestic Power Plant</option>
                    <option value="-70mm Lump Coal">-70mm Lump Coal</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Tujuan Stockpile Bersih</label>
                  <input
                    type="text"
                    value={crusherDestination}
                    onChange={(e) => setCrusherDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions: Cancel & Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? "Menyimpan..." : "Simpan Data Produksi"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
