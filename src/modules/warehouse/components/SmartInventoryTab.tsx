import React, { useState, useMemo } from "react";
import {
  Sparkles,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Clock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Wrench,
  Truck,
  Droplet,
  Boxes,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
  ShoppingCart,
  Zap,
  Activity,
  ChevronRight,
  Info,
  Sliders,
} from "lucide-react";
import { InventoryItem, StockBalance, ReorderRecommendation } from "../../../types/warehouseTypes";

interface SmartInventoryTabProps {
  items: InventoryItem[];
  stocks: StockBalance[];
  recommendations: ReorderRecommendation[];
  onNavigateTab?: (tab: string) => void;
  onOpenCreatePR?: (item: any) => void;
}

export interface BurnDownItem {
  id: string;
  itemId: string;
  itemCode: string;
  itemName: string;
  category: string;
  partNumber: string;
  currentAvailableQty: number;
  unit: string;
  dailyBurnRate: number; // units consumed per day
  daysRemaining: number; // predicted days until stockout
  estimatedStockoutDate: string;
  leadTimeDays: number;
  reorderPoint: number;
  safetyStock: number;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "STABLE";
  aiConfidencePct: number;
  compatibleFleet: string[];
  causeExplanation: string;
  recommendedAction: string;
  recommendedOrderQty: number;
  estimatedCostIDR: number;
}

export const SmartInventoryTab: React.FC<SmartInventoryTabProps> = ({
  items,
  stocks,
  recommendations,
  onNavigateTab,
  onOpenCreatePR,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedRisk, setSelectedRisk] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fleetIntensityMultiplier, setFleetIntensityMultiplier] = useState<number>(1.0); // 0.8x to 1.5x simulation
  const [selectedItemDetail, setSelectedItemDetail] = useState<BurnDownItem | null>(null);
  const [prSuccessMessage, setPrSuccessMessage] = useState<string | null>(null);

  // Format IDR helper
  const formatIDR = (val: number) => {
    if (!val) return "Rp 0";
    if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(2)} Miliar`;
    if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)} Juta`;
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  // Base burn-down dataset with the requested AI prediction highlighted
  const baseBurnDownData: BurnDownItem[] = useMemo(() => {
    return [
      {
        id: "burn-001",
        itemId: "itm-001",
        itemCode: "ITM-HYD-1025",
        itemName: "Hydraulic Return Filter Element PC1250",
        category: "Spare Parts",
        partNumber: "208-60-71120",
        currentAvailableQty: 8,
        unit: "PCS",
        dailyBurnRate: 0.67, // ~2 pcs every 3 days = 8 / 0.67 = 12 days!
        daysRemaining: 12,
        estimatedStockoutDate: "2026-08-27",
        leadTimeDays: 14,
        reorderPoint: 12,
        safetyStock: 4,
        riskLevel: "CRITICAL",
        aiConfidencePct: 96.4,
        compatibleFleet: ["Komatsu PC1250-8 (EX-012, EX-015)", "Hitachi EX1200-6"],
        causeExplanation:
          "Peningkatan jam kerja excavator di Pit North Block 3 dan jadwal PM 250H simultan pada EX-012 dan EX-015.",
        recommendedAction:
          "Terbitkan PR darurat sekarang (14 hari lead time vendor PT Hexindo) atau alokasikan buffer 6 pcs dari Central Warehouse.",
        recommendedOrderQty: 20,
        estimatedCostIDR: 85000000,
      },
      {
        id: "burn-002",
        itemId: "itm-006",
        itemCode: "ITM-ENG-INJ01",
        itemName: "Fuel Injector Unit CAT 3508B / 3512B Engine",
        category: "Spare Parts",
        partNumber: "254-4339",
        currentAvailableQty: 3,
        unit: "PCS",
        dailyBurnRate: 0.33,
        daysRemaining: 9,
        estimatedStockoutDate: "2026-08-24",
        leadTimeDays: 10,
        reorderPoint: 8,
        safetyStock: 2,
        riskLevel: "CRITICAL",
        aiConfidencePct: 94.2,
        compatibleFleet: ["CAT 777D Haul Truck (HD-041, HD-044)"],
        causeExplanation:
          "Deteksi getaran injector dan emisi gas buang hitam pada unit HD-041 saat hauling tanjakan KM 12.",
        recommendedAction:
          "Segera lakukan PO expediting untuk vendor Trakindo Utama dengan rekomendasi order 12 PCS.",
        recommendedOrderQty: 12,
        estimatedCostIDR: 198000000,
      },
      {
        id: "burn-003",
        itemId: "itm-004",
        itemCode: "ITM-GET-BCK01",
        itemName: "Excavator Bucket Tooth Rock Chisel PC1250",
        category: "Spare Parts",
        partNumber: "XS115RC-RC1250",
        currentAvailableQty: 22,
        unit: "PCS",
        dailyBurnRate: 2.0,
        daysRemaining: 11,
        estimatedStockoutDate: "2026-08-26",
        leadTimeDays: 10,
        reorderPoint: 35,
        safetyStock: 10,
        riskLevel: "HIGH",
        aiConfidencePct: 92.8,
        compatibleFleet: ["Komatsu PC1250-8", "Hitachi EX1200-6"],
        causeExplanation:
          "Tingkat abrasi batuan overburden tinggi di Pit Alpha West menyebabkan laju aus kuku bucket naik 40%.",
        recommendedAction:
          "Pesan 50 pcs sebelum stok berada di bawah batas kritis safety stock (10 pcs).",
        recommendedOrderQty: 50,
        estimatedCostIDR: 142500000,
      },
      {
        id: "burn-004",
        itemId: "itm-003",
        itemCode: "ITM-LUB-15W40",
        itemName: "Engine Oil Shell Rimula R4 X 15W-40 (Drum 209L)",
        category: "Consumables",
        partNumber: "SHL-RIM-R4X-209L",
        currentAvailableQty: 14,
        unit: "DRUM",
        dailyBurnRate: 1.0,
        daysRemaining: 14,
        estimatedStockoutDate: "2026-08-29",
        leadTimeDays: 7,
        reorderPoint: 25,
        safetyStock: 8,
        riskLevel: "HIGH",
        aiConfidencePct: 95.0,
        compatibleFleet: ["Fleet Hauler HD785", "CAT 777D", "Scania P410", "Genset Camp"],
        causeExplanation:
          "Siklus penggantian oli mesin berkala armada hauling 54 unit truk dan 18 excavator di awal bulan.",
        recommendedAction:
          "Terbitkan PR procurement 30 drum ke PT Shell Indonesia sebelum buffer menipis.",
        recommendedOrderQty: 30,
        estimatedCostIDR: 336000000,
      },
      {
        id: "burn-005",
        itemId: "itm-002",
        itemCode: "ITM-TYR-2749",
        itemName: "Haul Truck Tyre 27.00R49 E4 VRPS",
        category: "Spare Parts",
        partNumber: "TYR-BS-2700R49-E4",
        currentAvailableQty: 6,
        unit: "PCS",
        dailyBurnRate: 0.33,
        daysRemaining: 18,
        estimatedStockoutDate: "2026-09-02",
        leadTimeDays: 21,
        reorderPoint: 10,
        safetyStock: 4,
        riskLevel: "HIGH",
        aiConfidencePct: 91.5,
        compatibleFleet: ["CAT 777D", "Komatsu HD785-7"],
        causeExplanation:
          "Lead time pengiriman ban raksasa dari Balikpapan mencapai 21 hari (lebih lama dari sisa stok 18 hari).",
        recommendedAction:
          "STATUS ALERT: Lead time (21 hari) melebihi hari habis stok (18 hari). Wajib eksekusi PO hari ini!",
        recommendedOrderQty: 12,
        estimatedCostIDR: 2220000000,
      },
      {
        id: "burn-006",
        itemId: "itm-005",
        itemCode: "ITM-PPE-RES02",
        itemName: "3M Respirator 6200 + P100 Cartridge",
        category: "Consumables",
        partNumber: "3M-6200-P100",
        currentAvailableQty: 65,
        unit: "SET",
        dailyBurnRate: 2.5,
        daysRemaining: 26,
        estimatedStockoutDate: "2026-09-10",
        leadTimeDays: 5,
        reorderPoint: 80,
        safetyStock: 25,
        riskLevel: "MEDIUM",
        aiConfidencePct: 88.0,
        compatibleFleet: ["Pit Operators & Crusher Plant Staff"],
        causeExplanation:
          "Musim kemarau meningkatkan intensitas debu batubara di area ROM Stockpile dan Pit Crusher.",
        recommendedAction:
          "Monitor konsumsi mingguan dan jadwalkan pengadaan rutin 100 SET.",
        recommendedOrderQty: 100,
        estimatedCostIDR: 38500000,
      },
    ];
  }, []);

  // Recalculate dynamic days remaining based on interactive Fleet Intensity Multiplier
  const dynamicBurnDownData: BurnDownItem[] = useMemo(() => {
    return baseBurnDownData.map((item) => {
      const adjustedDailyBurn = item.dailyBurnRate * fleetIntensityMultiplier;
      const adjustedDays = Math.max(1, Math.round(item.currentAvailableQty / adjustedDailyBurn));
      
      const now = new Date("2026-08-15");
      now.setDate(now.getDate() + adjustedDays);
      const estDateStr = now.toISOString().split("T")[0];

      let risk: "CRITICAL" | "HIGH" | "MEDIUM" | "STABLE" = "STABLE";
      if (adjustedDays <= 12 || adjustedDays <= item.leadTimeDays) {
        risk = "CRITICAL";
      } else if (adjustedDays <= 20) {
        risk = "HIGH";
      } else if (adjustedDays <= 35) {
        risk = "MEDIUM";
      }

      return {
        ...item,
        dailyBurnRate: parseFloat(adjustedDailyBurn.toFixed(2)),
        daysRemaining: adjustedDays,
        estimatedStockoutDate: estDateStr,
        riskLevel: risk,
      };
    });
  }, [baseBurnDownData, fleetIntensityMultiplier]);

  // Primary Highlight: The specific item requested by the user prompt
  const spotlightItem = useMemo(() => {
    return dynamicBurnDownData.find((i) => i.itemCode === "ITM-HYD-1025") || dynamicBurnDownData[0];
  }, [dynamicBurnDownData]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return dynamicBurnDownData.filter((item) => {
      const matchesSearch =
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === "ALL" || item.category === selectedCategory;
      const matchesRisk = selectedRisk === "ALL" || item.riskLevel === selectedRisk;
      return matchesSearch && matchesCat && matchesRisk;
    });
  }, [dynamicBurnDownData, searchTerm, selectedCategory, selectedRisk]);

  // Summary Metrics
  const criticalCount = dynamicBurnDownData.filter((i) => i.riskLevel === "CRITICAL").length;
  const highCount = dynamicBurnDownData.filter((i) => i.riskLevel === "HIGH").length;
  const avgDaysRemaining = Math.round(
    dynamicBurnDownData.reduce((acc, i) => acc + i.daysRemaining, 0) / dynamicBurnDownData.length
  );
  const totalRecommendedCost = dynamicBurnDownData
    .filter((i) => i.riskLevel === "CRITICAL" || i.riskLevel === "HIGH")
    .reduce((acc, i) => acc + i.estimatedCostIDR, 0);

  // Trigger Purchase Requisition
  const handleTriggerPR = (item: BurnDownItem) => {
    setPrSuccessMessage(
      `Purchase Requisition otomatis untuk "${item.itemName}" (${item.recommendedOrderQty} ${item.unit}) berhasil dibuat dan diteruskan ke Departemen Procurement!`
    );
    if (onOpenCreatePR) {
      onOpenCreatePR(item);
    }
    setTimeout(() => {
      setPrSuccessMessage(null);
    }, 6000);
  };

  return (
    <div className="space-y-6 text-slate-100 animate-fade-in">
      {/* 🌟 HERO AI SPOTLIGHT BANNER: "Spare part X diperkirakan habis dalam 12 hari." */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-amber-950/70 to-slate-900 border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Tag & AI Status */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 flex items-center gap-1.5 uppercase tracking-wider shadow-lg shadow-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> AI PREDICTIVE INVENTORY ENGINE
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> High Stockout Risk Alert
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-300/80 font-mono bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Machine Learning Confidence: <strong>{spotlightItem.aiConfidencePct}%</strong></span>
            </div>
          </div>

          {/* AI Prediction Main Headline */}
          <div className="space-y-3">
            <div className="text-xs font-black uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> AI PREDIKSI KEBUTUHAN SUKU CADANG TAMBANG
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              &ldquo;Spare part <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-rose-400">{spotlightItem.itemName}</span> diperkirakan habis dalam <span className="text-rose-400 font-mono underline decoration-rose-500 decoration-wavy decoration-2">{spotlightItem.daysRemaining} hari</span>.&rdquo;
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-4xl leading-relaxed">
              Berdasarkan model burn-down velocity konsumsi armada excavator di Pit North (laju pemakaian <strong>{spotlightItem.dailyBurnRate} {spotlightItem.unit}/hari</strong>), stok tersedia saat ini (<strong>{spotlightItem.currentAvailableQty} {spotlightItem.unit}</strong>) akan habis pada estimasi tanggal <strong className="text-amber-300 font-mono">{spotlightItem.estimatedStockoutDate}</strong>.
            </p>
          </div>

          {/* Key Metrics Breakdown Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Stok Tersedia</span>
              <div className="text-xl font-black text-white font-mono">
                {spotlightItem.currentAvailableQty} <span className="text-xs font-normal text-slate-400">{spotlightItem.unit}</span>
              </div>
              <span className="text-[10px] text-rose-400 font-bold">ROP: {spotlightItem.reorderPoint} {spotlightItem.unit}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-amber-400 font-bold uppercase block">Laju Konsumsi Harian</span>
              <div className="text-xl font-black text-amber-300 font-mono">
                {spotlightItem.dailyBurnRate} <span className="text-xs font-normal text-slate-400">{spotlightItem.unit}/hari</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Armada Pit North EX-012/015</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] text-purple-400 font-bold uppercase block">Lead Time Supplier</span>
              <div className="text-xl font-black text-purple-300 font-mono">
                {spotlightItem.leadTimeDays} <span className="text-xs font-normal text-slate-400">Hari</span>
              </div>
              <span className="text-[10px] text-purple-400/80 font-medium">PT Hexindo (Balikpapan)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-1">
              <span className="text-[10px] text-rose-400 font-bold uppercase block">Sisa Waktu Kritis</span>
              <div className="text-xl font-black text-rose-300 font-mono animate-pulse">
                {spotlightItem.daysRemaining} Hari Lagi
              </div>
              <span className="text-[10px] text-rose-400 font-medium">Wajib Pesan Hari Ini!</span>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Rekomendasi Pemesanan: <strong>{spotlightItem.recommendedOrderQty} {spotlightItem.unit}</strong> (~{formatIDR(spotlightItem.estimatedCostIDR)})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedItemDetail(spotlightItem)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition cursor-pointer"
              >
                Lihat Analisis Rinci
              </button>
              <button
                onClick={() => handleTriggerPR(spotlightItem)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition cursor-pointer active:scale-95"
              >
                <ShoppingCart className="w-4 h-4 text-slate-950" />
                Terbitkan PR Otomatis Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {prSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-fade-in shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{prSuccessMessage}</span>
          </div>
          <button
            onClick={() => setPrSuccessMessage(null)}
            className="text-slate-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Interactive Simulation & Summary KPI Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Fleet Workload Simulator (4 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-xs sm:text-sm">
                Simulasi Beban Kerja Armada (Fleet Intensity)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold">
              {fleetIntensityMultiplier}x Laju Normal
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Geser slider untuk melihat dampak peningkatan target produksi pit terhadap laju keausan sparepart dan percepatan hari habis stok (*burn-down acceleration*).
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>0.8x (Musim Hujan / Slow)</span>
              <span>1.0x (Normal)</span>
              <span>1.5x (Surge 24/7 Peak)</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.1"
              value={fleetIntensityMultiplier}
              onChange={(e) => setFleetIntensityMultiplier(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Dampak Penyesuaian:</span>
              <strong className="text-amber-400">
                {fleetIntensityMultiplier > 1.0 ? `+${Math.round((fleetIntensityMultiplier - 1) * 100)}% Konsumsi Part` : "Konsumsi Normal / Standby"}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hari Habis Filter PC1250:</span>
              <strong className="text-rose-400 font-mono">{spotlightItem.daysRemaining} Hari</strong>
            </div>
          </div>
        </div>

        {/* Right: AI Burn-Down Summary Stat Cards (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-1">
            <span className="text-[10px] text-rose-400 font-bold uppercase block">Kritis &lt; 14 Hari</span>
            <div className="text-2xl font-black text-rose-400 font-mono">{criticalCount} SKU</div>
            <span className="text-[10px] text-slate-400">Perlu PR Mendesak</span>
          </div>

          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-1">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">Waspada &lt; 21 Hari</span>
            <div className="text-2xl font-black text-amber-300 font-mono">{highCount} SKU</div>
            <span className="text-[10px] text-slate-400">Pantau ROP Buffer</span>
          </div>

          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-1">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block">Rata-rata Ketahanan</span>
            <div className="text-2xl font-black text-cyan-300 font-mono">{avgDaysRemaining} Hari</div>
            <span className="text-[10px] text-slate-400">Seluruh Suku Cadang</span>
          </div>

          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-md space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">Estimasi PR Urgent</span>
            <div className="text-base font-black text-emerald-300 font-mono truncate" title={formatIDR(totalRecommendedCost)}>
              {formatIDR(totalRecommendedCost)}
            </div>
            <span className="text-[10px] text-slate-400">Total Nilai Pengadaan</span>
          </div>
        </div>
      </div>

      {/* AI Burn-Down Table & Filtering Controls */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-black text-white text-base flex items-center gap-2">
              <Boxes className="w-5 h-5 text-amber-400" />
              Tabel Prediksi Ketahanan Stok & Burn-Down Rate Suku Cadang (Smart Inventory)
            </h3>
            <p className="text-xs text-slate-400">
              Evaluasi prediksi waktu habis per item suku cadang, pelumas, dan consumable berdasarkan tren konsumsi aktual tambang.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari Suku Cadang / Part No..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Spare Parts">Spare Parts Suku Cadang</option>
              <option value="Consumables">Consumables & PPE</option>
              <option value="Lubricants">Lubricants & Fuel</option>
            </select>

            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Semua Tingkat Risiko</option>
              <option value="CRITICAL">Kritis (&le; 12 Hari)</option>
              <option value="HIGH">Tinggi (13-20 Hari)</option>
              <option value="MEDIUM">Sedang (21-35 Hari)</option>
            </select>
          </div>
        </div>

        {/* Burn Down Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">Nama Suku Cadang & Part Number</th>
                <th className="px-4 py-3 text-center">Stok Tersedia</th>
                <th className="px-4 py-3 text-center">Laju Konsumsi</th>
                <th className="px-4 py-3 text-center">Prediksi Sisa Hari</th>
                <th className="px-4 py-3 text-center">Estimasi Habis</th>
                <th className="px-4 py-3 text-center">Tingkat Risiko</th>
                <th className="px-4 py-3 text-right">Rekomendasi Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredData.map((item) => {
                const isCritical = item.riskLevel === "CRITICAL";
                const isHigh = item.riskLevel === "HIGH";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {item.itemName}
                        {item.itemCode === "ITM-HYD-1025" && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            PROMPT SPOTLIGHT
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        PN: <span className="text-slate-200">{item.partNumber}</span> • Code: {item.itemCode} • {item.category}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center font-mono font-bold text-white">
                      {item.currentAvailableQty} {item.unit}
                    </td>

                    <td className="px-4 py-3 text-center font-mono text-amber-400 font-bold">
                      {item.dailyBurnRate} {item.unit}/hr
                    </td>

                    <td className="px-4 py-3 text-center font-mono">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                          isCritical
                            ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse"
                            : isHigh
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                            : "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                        }`}
                      >
                        {item.daysRemaining} Hari
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center font-mono text-slate-300 text-[11px]">
                      {item.estimatedStockoutDate}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          isCritical
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            : isHigh
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {item.riskLevel}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedItemDetail(item)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition cursor-pointer"
                        >
                          Detail
                        </button>
                        <button
                          onClick={() => handleTriggerPR(item)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black transition cursor-pointer shadow-md flex items-center gap-1"
                        >
                          <ShoppingCart className="w-3 h-3" /> Auto PR
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl p-6 space-y-4 text-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AI Deep Diagnostics
                </span>
                <h3 className="font-black text-white text-base mt-1">{selectedItemDetail.itemName}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Part No: {selectedItemDetail.partNumber} • Kode: {selectedItemDetail.itemCode}
                </p>
              </div>
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                <span className="font-bold text-amber-400 uppercase text-[10px]">Pernyataan Prediksi AI:</span>
                <p className="text-white font-bold text-sm">
                  &ldquo;Diperkirakan habis dalam {selectedItemDetail.daysRemaining} hari ({selectedItemDetail.estimatedStockoutDate})&rdquo;
                </p>
                <p className="text-slate-300 text-[11px]">{selectedItemDetail.causeExplanation}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Stok Tersedia</span>
                  <span className="font-mono text-white font-bold text-sm">
                    {selectedItemDetail.currentAvailableQty} {selectedItemDetail.unit}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Laju Konsumsi Harian</span>
                  <span className="font-mono text-amber-300 font-bold text-sm">
                    {selectedItemDetail.dailyBurnRate} {selectedItemDetail.unit}/hari
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Lead Time Pengadaan</span>
                  <span className="font-mono text-purple-300 font-bold text-sm">
                    {selectedItemDetail.leadTimeDays} Hari
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px]">Reorder Point (ROP)</span>
                  <span className="font-mono text-cyan-300 font-bold text-sm">
                    {selectedItemDetail.reorderPoint} {selectedItemDetail.unit}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px]">Armada Pengguna yang Kompatibel:</span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedItemDetail.compatibleFleet.map((eq, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[10px]">Tindakan Mitigasi yang Disarankan:</span>
                <p className="text-slate-200">{selectedItemDetail.recommendedAction}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleTriggerPR(selectedItemDetail);
                  setSelectedItemDetail(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-black text-slate-950 flex items-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Terbitkan Purchase Requisition
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
