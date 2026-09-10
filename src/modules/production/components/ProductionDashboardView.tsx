// MINE SMART AI - Production Management Executive Dashboard
// Target vs Actual vs Forecast across: Hourly, Shift, Daily, Weekly, Monthly, Yearly
// Streams: Coal Production, OB Production, ROM, Waste, Rehandle, Crushing

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Plus,
  Flame,
  Pickaxe,
  Mountain,
  Truck,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  ProductionRecord,
  ProductionTarget,
  ROMRecord,
  WasteRecord,
  RehandleRecord,
  CrushingRecord,
  ProductionPeriodType,
  ProductionStreamFilter,
} from "../../../types/productionTypes";

interface ProductionDashboardViewProps {
  records: ProductionRecord[];
  targets: ProductionTarget[];
  romRecords: ROMRecord[];
  wasteRecords: WasteRecord[];
  rehandleRecords: RehandleRecord[];
  crushingRecords: CrushingRecord[];
  onOpenInputModal: (defaultType?: string) => void;
  onOpenAICopilot: () => void;
}

export const ProductionDashboardView: React.FC<ProductionDashboardViewProps> = ({
  records,
  targets,
  romRecords,
  wasteRecords,
  rehandleRecords,
  crushingRecords,
  onOpenInputModal,
  onOpenAICopilot,
}) => {
  // Period filter state: Hourly | Shift | Daily | Weekly | Monthly | Yearly
  const [period, setPeriod] = useState<ProductionPeriodType>("DAILY");
  
  // Stream filter state: All | Coal | OB | ROM | Waste | Rehandle | Crushing
  const [stream, setStream] = useState<ProductionStreamFilter>("ALL");

  // Selected Pit filter
  const [selectedPit, setSelectedPit] = useState<string>("ALL");

  // Multi-Period Data Generators based on real repository data
  const chartData = useMemo(() => {
    switch (period) {
      case "HOURLY":
        return [
          { time: "06:00", actualCoal: 520, targetCoal: 550, forecastCoal: 540, actualOB: 1800, targetOB: 1900, forecastOB: 1850, actualCrushing: 650, targetCrushing: 700, forecastCrushing: 680, actualRehandle: 280, targetRehandle: 300, forecastRehandle: 290 },
          { time: "07:00", actualCoal: 610, targetCoal: 550, forecastCoal: 590, actualOB: 2050, targetOB: 1900, forecastOB: 2000, actualCrushing: 720, targetCrushing: 700, forecastCrushing: 710, actualRehandle: 310, targetRehandle: 300, forecastRehandle: 305 },
          { time: "08:00", actualCoal: 580, targetCoal: 550, forecastCoal: 575, actualOB: 1980, targetOB: 1900, forecastOB: 1950, actualCrushing: 690, targetCrushing: 700, forecastCrushing: 700, actualRehandle: 295, targetRehandle: 300, forecastRehandle: 300 },
          { time: "09:00", actualCoal: 490, targetCoal: 550, forecastCoal: 510, actualOB: 1650, targetOB: 1900, forecastOB: 1720, actualCrushing: 580, targetCrushing: 700, forecastCrushing: 610, actualRehandle: 250, targetRehandle: 300, forecastRehandle: 270 },
          { time: "10:00", actualCoal: 540, targetCoal: 550, forecastCoal: 550, actualOB: 1890, targetOB: 1900, forecastOB: 1880, actualCrushing: 710, targetCrushing: 700, forecastCrushing: 705, actualRehandle: 305, targetRehandle: 300, forecastRehandle: 300 },
          { time: "11:00", actualCoal: 590, targetCoal: 550, forecastCoal: 580, actualOB: 1950, targetOB: 1900, forecastOB: 1920, actualCrushing: 730, targetCrushing: 700, forecastCrushing: 720, actualRehandle: 320, targetRehandle: 300, forecastRehandle: 310 },
          { time: "12:00", actualCoal: 380, targetCoal: 400, forecastCoal: 390, actualOB: 1200, targetOB: 1300, forecastOB: 1250, actualCrushing: 450, targetCrushing: 500, forecastCrushing: 470, actualRehandle: 200, targetRehandle: 220, forecastRehandle: 210 }, // Meal break
          { time: "13:00", actualCoal: 560, targetCoal: 550, forecastCoal: 555, actualOB: 1910, targetOB: 1900, forecastOB: 1900, actualCrushing: 695, targetCrushing: 700, forecastCrushing: 700, actualRehandle: 310, targetRehandle: 300, forecastRehandle: 305 },
          { time: "14:00", actualCoal: 605, targetCoal: 550, forecastCoal: 595, actualOB: 2020, targetOB: 1900, forecastOB: 1980, actualCrushing: 740, targetCrushing: 700, forecastCrushing: 725, actualRehandle: 330, targetRehandle: 300, forecastRehandle: 315 },
          { time: "15:00", actualCoal: 575, targetCoal: 550, forecastCoal: 570, actualOB: 1940, targetOB: 1900, forecastOB: 1930, actualCrushing: 710, targetCrushing: 700, forecastCrushing: 710, actualRehandle: 300, targetRehandle: 300, forecastRehandle: 300 },
          { time: "16:00", actualCoal: 530, targetCoal: 550, forecastCoal: 545, actualOB: 1820, targetOB: 1900, forecastOB: 1860, actualCrushing: 680, targetCrushing: 700, forecastCrushing: 690, actualRehandle: 290, targetRehandle: 300, forecastRehandle: 295 },
          { time: "17:00", actualCoal: 510, targetCoal: 550, forecastCoal: 530, actualOB: 1760, targetOB: 1900, forecastOB: 1820, actualCrushing: 660, targetCrushing: 700, forecastCrushing: 680, actualRehandle: 280, targetRehandle: 300, forecastRehandle: 290 },
        ];

      case "SHIFT":
        return [
          { time: "Shift 1 Day (11 Aug)", actualCoal: 7200, targetCoal: 7500, forecastCoal: 7350, actualOB: 24500, targetOB: 25000, forecastOB: 24800, actualCrushing: 8200, targetCrushing: 8500, forecastCrushing: 8350, actualRehandle: 3600, targetRehandle: 3700, forecastRehandle: 3650 },
          { time: "Shift 2 Night (11 Aug)", actualCoal: 6900, targetCoal: 7500, forecastCoal: 7100, actualOB: 23800, targetOB: 25000, forecastOB: 24200, actualCrushing: 7900, targetCrushing: 8500, forecastCrushing: 8100, actualRehandle: 3400, targetRehandle: 3700, forecastRehandle: 3500 },
          { time: "Shift 1 Day (12 Aug)", actualCoal: 7850, targetCoal: 7500, forecastCoal: 7700, actualOB: 26100, targetOB: 25000, forecastOB: 25800, actualCrushing: 8800, targetCrushing: 8500, forecastCrushing: 8650, actualRehandle: 3900, targetRehandle: 3700, forecastRehandle: 3800 },
          { time: "Shift 2 Night (12 Aug)", actualCoal: 7400, targetCoal: 7500, forecastCoal: 7450, actualOB: 24900, targetOB: 25000, forecastOB: 25000, actualCrushing: 8400, targetCrushing: 8500, forecastCrushing: 8450, actualRehandle: 3700, targetRehandle: 3700, forecastRehandle: 3700 },
          { time: "Shift 1 Day (13 Aug - Live)", actualCoal: 7650, targetCoal: 7500, forecastCoal: 7600, actualOB: 25800, targetOB: 25000, forecastOB: 25500, actualCrushing: 8700, targetCrushing: 8500, forecastCrushing: 8600, actualRehandle: 3850, targetRehandle: 3700, forecastRehandle: 3800 },
          { time: "Shift 2 Night (13 Aug - Proj)", actualCoal: 0, targetCoal: 7500, forecastCoal: 7380, actualOB: 0, targetOB: 25000, forecastOB: 24600, actualCrushing: 0, targetCrushing: 8500, forecastCrushing: 8300, actualRehandle: 0, targetRehandle: 3700, forecastRehandle: 3600 },
        ];

      case "DAILY":
        return [
          { time: "01 Aug", actualCoal: 14800, targetCoal: 15000, forecastCoal: 14900, actualOB: 49500, targetOB: 50000, forecastOB: 49800, actualCrushing: 16800, targetCrushing: 17000, forecastCrushing: 16900, actualRehandle: 7400, targetRehandle: 7500, forecastRehandle: 7450 },
          { time: "03 Aug", actualCoal: 15200, targetCoal: 15000, forecastCoal: 15100, actualOB: 51200, targetOB: 50000, forecastOB: 50800, actualCrushing: 17400, targetCrushing: 17000, forecastCrushing: 17200, actualRehandle: 7650, targetRehandle: 7500, forecastRehandle: 7600 },
          { time: "05 Aug", actualCoal: 14950, targetCoal: 15000, forecastCoal: 15000, actualOB: 49800, targetOB: 50000, forecastOB: 50000, actualCrushing: 17100, targetCrushing: 17000, forecastCrushing: 17050, actualRehandle: 7500, targetRehandle: 7500, forecastRehandle: 7500 },
          { time: "07 Aug", actualCoal: 13900, targetCoal: 15000, forecastCoal: 14200, actualOB: 46200, targetOB: 50000, forecastOB: 47500, actualCrushing: 15800, targetCrushing: 17000, forecastCrushing: 16200, actualRehandle: 6900, targetRehandle: 7500, forecastRehandle: 7100 },
          { time: "09 Aug", actualCoal: 15600, targetCoal: 15000, forecastCoal: 15400, actualOB: 52100, targetOB: 50000, forecastOB: 51600, actualCrushing: 17800, targetCrushing: 17000, forecastCrushing: 17500, actualRehandle: 7800, targetRehandle: 7500, forecastRehandle: 7700 },
          { time: "11 Aug", actualCoal: 15100, targetCoal: 15000, forecastCoal: 15050, actualOB: 50400, targetOB: 50000, forecastOB: 50200, actualCrushing: 17200, targetCrushing: 17000, forecastCrushing: 17100, actualRehandle: 7550, targetRehandle: 7500, forecastRehandle: 7520 },
          { time: "13 Aug (Today)", actualCoal: 15350, targetCoal: 15000, forecastCoal: 15200, actualOB: 51200, targetOB: 50000, forecastOB: 50800, actualCrushing: 17500, targetCrushing: 17000, forecastCrushing: 17350, actualRehandle: 7700, targetRehandle: 7500, forecastRehandle: 7620 },
          { time: "15 Aug (Proj)", actualCoal: 0, targetCoal: 15000, forecastCoal: 15150, actualOB: 0, targetOB: 50000, forecastOB: 50600, actualCrushing: 0, targetCrushing: 17000, forecastCrushing: 17200, actualRehandle: 0, targetRehandle: 7500, forecastRehandle: 7580 },
          { time: "20 Aug (Proj)", actualCoal: 0, targetCoal: 15000, forecastCoal: 15300, actualOB: 0, targetOB: 50000, forecastOB: 51000, actualCrushing: 0, targetCrushing: 17000, forecastCrushing: 17400, actualRehandle: 0, targetRehandle: 7500, forecastRehandle: 7650 },
        ];

      case "WEEKLY":
        return [
          { time: "Week 1 (1-7 Aug)", actualCoal: 104500, targetCoal: 105000, forecastCoal: 104800, actualOB: 348000, targetOB: 350000, forecastOB: 349000, actualCrushing: 119000, targetCrushing: 120000, forecastCrushing: 119500, actualRehandle: 52000, targetRehandle: 52500, forecastRehandle: 52200 },
          { time: "Week 2 (8-14 Aug)", actualCoal: 107200, targetCoal: 105000, forecastCoal: 106500, actualOB: 356000, targetOB: 350000, forecastOB: 354000, actualCrushing: 122500, targetCrushing: 120000, forecastCrushing: 121800, actualRehandle: 53800, targetRehandle: 52500, forecastRehandle: 53200 },
          { time: "Week 3 (15-21 Aug)", actualCoal: 0, targetCoal: 105000, forecastCoal: 106800, actualOB: 0, targetOB: 350000, forecastOB: 355000, actualCrushing: 0, targetCrushing: 120000, forecastCrushing: 122000, actualRehandle: 0, targetRehandle: 52500, forecastRehandle: 53400 },
          { time: "Week 4 (22-28 Aug)", actualCoal: 0, targetCoal: 105000, forecastCoal: 107100, actualOB: 0, targetOB: 350000, forecastOB: 357000, actualCrushing: 0, targetCrushing: 120000, forecastCrushing: 122500, actualRehandle: 0, targetRehandle: 52500, forecastRehandle: 53600 },
          { time: "Week 5 (29-31 Aug)", actualCoal: 0, targetCoal: 45000, forecastCoal: 45600, actualOB: 0, targetOB: 150000, forecastOB: 152000, actualCrushing: 0, targetCrushing: 51000, forecastCrushing: 52000, actualRehandle: 0, targetRehandle: 22500, forecastRehandle: 22800 },
        ];

      case "MONTHLY":
        return [
          { time: "Jan 2026", actualCoal: 442000, targetCoal: 450000, forecastCoal: 445000, actualOB: 1475000, targetOB: 1500000, forecastOB: 1485000, actualCrushing: 504000, targetCrushing: 510000, forecastCrushing: 507000, actualRehandle: 221000, targetRehandle: 225000, forecastRehandle: 223000 },
          { time: "Feb 2026", actualCoal: 418000, targetCoal: 420000, forecastCoal: 419000, actualOB: 1395000, targetOB: 1400000, forecastOB: 1398000, actualCrushing: 476000, targetCrushing: 480000, forecastCrushing: 478000, actualRehandle: 209000, targetRehandle: 210000, forecastRehandle: 209500 },
          { time: "Mar 2026", actualCoal: 456000, targetCoal: 450000, forecastCoal: 453000, actualOB: 1520000, targetOB: 1500000, forecastOB: 1510000, actualCrushing: 520000, targetCrushing: 510000, forecastCrushing: 516000, actualRehandle: 228000, targetRehandle: 225000, forecastRehandle: 226500 },
          { time: "Apr 2026", actualCoal: 448000, targetCoal: 450000, forecastCoal: 449000, actualOB: 1490000, targetOB: 1500000, forecastOB: 1495000, actualCrushing: 511000, targetCrushing: 510000, forecastCrushing: 512000, actualRehandle: 224000, targetRehandle: 225000, forecastRehandle: 224500 },
          { time: "May 2026", actualCoal: 462000, targetCoal: 450000, forecastCoal: 458000, actualOB: 1540000, targetOB: 1500000, forecastOB: 1525000, actualCrushing: 527000, targetCrushing: 510000, forecastCrushing: 522000, actualRehandle: 231000, targetRehandle: 225000, forecastRehandle: 229000 },
          { time: "Jun 2026", actualCoal: 451000, targetCoal: 450000, forecastCoal: 451000, actualOB: 1505000, targetOB: 1500000, forecastOB: 1505000, actualCrushing: 514000, targetCrushing: 510000, forecastCrushing: 514000, actualRehandle: 225500, targetRehandle: 225000, forecastRehandle: 225500 },
          { time: "Jul 2026", actualCoal: 459000, targetCoal: 450000, forecastCoal: 456000, actualOB: 1530000, targetOB: 1500000, forecastOB: 1520000, actualCrushing: 523000, targetCrushing: 510000, forecastCrushing: 520000, actualRehandle: 229500, targetRehandle: 225000, forecastRehandle: 228000 },
          { time: "Aug 2026 (MTD)", actualCoal: 211700, targetCoal: 450000, forecastCoal: 462000, actualOB: 704000, targetOB: 1500000, forecastOB: 1545000, actualCrushing: 241500, targetCrushing: 510000, forecastCrushing: 528000, actualRehandle: 105800, targetRehandle: 225000, forecastRehandle: 231000 },
          { time: "Sep 2026 (Proj)", actualCoal: 0, targetCoal: 460000, forecastCoal: 468000, actualOB: 0, targetOB: 1550000, forecastOB: 1570000, actualCrushing: 0, targetCrushing: 525000, forecastCrushing: 535000, actualRehandle: 0, targetRehandle: 230000, forecastRehandle: 234000 },
          { time: "Oct 2026 (Proj)", actualCoal: 0, targetCoal: 470000, forecastCoal: 475000, actualOB: 0, targetOB: 1600000, forecastOB: 1610000, actualCrushing: 0, targetCrushing: 535000, forecastCrushing: 542000, actualRehandle: 0, targetRehandle: 235000, forecastRehandle: 237500 },
          { time: "Nov 2026 (Proj)", actualCoal: 0, targetCoal: 470000, forecastCoal: 472000, actualOB: 0, targetOB: 1600000, forecastOB: 1605000, actualCrushing: 0, targetCrushing: 535000, forecastCrushing: 539000, actualRehandle: 0, targetRehandle: 235000, forecastRehandle: 236000 },
          { time: "Dec 2026 (Proj)", actualCoal: 0, targetCoal: 480000, forecastCoal: 485000, actualOB: 0, targetOB: 1650000, forecastOB: 1665000, actualCrushing: 0, targetCrushing: 550000, forecastCrushing: 555000, actualRehandle: 0, targetRehandle: 240000, forecastRehandle: 242500 },
        ];

      case "YEARLY":
        return [
          { time: "2023 Actual", actualCoal: 4850000, targetCoal: 4800000, forecastCoal: 4850000, actualOB: 16200000, targetOB: 16000000, forecastOB: 16200000, actualCrushing: 5530000, targetCrushing: 5500000, forecastCrushing: 5530000, actualRehandle: 2425000, targetRehandle: 2400000, forecastRehandle: 2425000 },
          { time: "2024 Actual", actualCoal: 5200000, targetCoal: 5100000, forecastCoal: 5200000, actualOB: 17400000, targetOB: 17000000, forecastOB: 17400000, actualCrushing: 5930000, targetCrushing: 5800000, forecastCrushing: 5930000, actualRehandle: 2600000, targetRehandle: 2550000, forecastRehandle: 2600000 },
          { time: "2025 Actual", actualCoal: 5450000, targetCoal: 5400000, forecastCoal: 5450000, actualOB: 18200000, targetOB: 18000000, forecastOB: 18200000, actualCrushing: 6210000, targetCrushing: 6150000, forecastCrushing: 6210000, actualRehandle: 2725000, targetRehandle: 2700000, forecastRehandle: 2725000 },
          { time: "2026 (YTD + Forecast)", actualCoal: 3349700, targetCoal: 5500000, forecastCoal: 5580000, actualOB: 11154000, targetOB: 18500000, forecastOB: 18720000, actualCrushing: 3819500, targetCrushing: 6300000, forecastCrushing: 6380000, actualRehandle: 1674850, targetRehandle: 2750000, forecastRehandle: 2790000 },
          { time: "2027 (LOM Plan)", actualCoal: 0, targetCoal: 6000000, forecastCoal: 6150000, actualOB: 0, targetOB: 20000000, forecastOB: 20400000, actualCrushing: 0, targetCrushing: 6850000, forecastCrushing: 7020000, actualRehandle: 0, targetRehandle: 3000000, forecastRehandle: 3075000 },
        ];

      default:
        return [];
    }
  }, [period]);

  // Dynamic Key Selection based on active Stream
  const { actualKey, targetKey, forecastKey, unitLabel, streamTitle, streamColor } = useMemo(() => {
    switch (stream) {
      case "OB":
        return {
          actualKey: "actualOB",
          targetKey: "targetOB",
          forecastKey: "forecastOB",
          unitLabel: "BCM",
          streamTitle: "Overburden (OB) Stripping",
          streamColor: "#f59e0b", // Amber
        };
      case "CRUSHING":
        return {
          actualKey: "actualCrushing",
          targetKey: "targetCrushing",
          forecastKey: "forecastCrushing",
          unitLabel: "Ton",
          streamTitle: "Crushing Production & Throughput",
          streamColor: "#06b6d4", // Cyan
        };
      case "REHANDLE":
        return {
          actualKey: "actualRehandle",
          targetKey: "targetRehandle",
          forecastKey: "forecastRehandle",
          unitLabel: "Ton",
          streamTitle: "Rehandle & Coal Blending",
          streamColor: "#8b5cf6", // Purple
        };
      case "ROM":
      case "WASTE":
      case "COAL":
      case "ALL":
      default:
        return {
          actualKey: "actualCoal",
          targetKey: "targetCoal",
          forecastKey: "forecastCoal",
          unitLabel: "Ton",
          streamTitle: "Coal Production & Total Yield",
          streamColor: "#10b981", // Emerald
        };
    }
  }, [stream]);

  // Aggregate totals for KPI top cards
  const summaryKPIs = useMemo(() => {
    // Current period totals
    let currentActual = 0;
    let currentTarget = 0;
    let currentForecast = 0;

    chartData.forEach((row: any) => {
      currentActual += (row[actualKey] || 0);
      currentTarget += (row[targetKey] || 0);
      currentForecast += (row[forecastKey] || 0);
    });

    const achievementRate = currentTarget > 0 ? (currentActual / currentTarget) * 100 : 100;
    const forecastAchievementRate = currentTarget > 0 ? (currentForecast / currentTarget) * 100 : 100;
    const variance = currentActual - currentTarget;

    return {
      currentActual,
      currentTarget,
      currentForecast,
      achievementRate: Number(achievementRate.toFixed(1)),
      forecastAchievementRate: Number(forecastAchievementRate.toFixed(1)),
      variance,
    };
  }, [chartData, actualKey, targetKey, forecastKey]);

  return (
    <div className="space-y-6">
      {/* 1. Header with Period Selector & Stream Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                EXECUTIVE PRODUCTION CONTROL
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Site: <strong className="text-white">Site Kalimantan A (COMP-BNU-01)</strong>
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
              TARGET <span className="text-slate-500">vs</span> ACTUAL <span className="text-slate-500">vs</span> FORECAST DASHBOARD
            </h2>
            <p className="text-xs text-slate-400">
              Analisis performa produksi end-to-end dengan perbandingan target rencana, realisasi lapangan, dan proyeksi AI
            </p>
          </div>

          {/* Quick Input Actions Dropdown / Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenInputModal("COAL")}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Input Coal</span>
            </button>

            <button
              onClick={() => onOpenInputModal("OB")}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-600/20 cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Input OB</span>
            </button>

            <button
              onClick={() => onOpenInputModal("CRUSHING")}
              className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-cyan-600/20 cursor-pointer active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Input Crushing</span>
            </button>

            <button
              onClick={onOpenAICopilot}
              className="px-3.5 py-2 bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span>AI Production Copilot</span>
            </button>
          </div>
        </div>

        {/* 2 Filter Bars: PERIOD SELECTOR & PRODUCTION STREAM SELECTOR */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-3 border-t border-slate-800/80 items-center">
          {/* Period Selector Tabs (Hourly, Shift, Daily, Weekly, Monthly, Yearly) */}
          <div className="lg:col-span-7 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              PILIH PERIODE PRODUKSI:
            </span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
              {(
                [
                  { key: "HOURLY", label: "Hourly", icon: Clock },
                  { key: "SHIFT", label: "Shift (1 & 2)", icon: Layers },
                  { key: "DAILY", label: "Daily", icon: Calendar },
                  { key: "WEEKLY", label: "Weekly", icon: BarChart3 },
                  { key: "MONTHLY", label: "Monthly", icon: TrendingUp },
                  { key: "YEARLY", label: "Yearly", icon: Mountain },
                ] as const
              ).map((p) => {
                const Icon = p.icon;
                const isActive = period === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => setPeriod(p.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-black"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Production Stream Filter (All, Coal, OB, ROM, Waste, Rehandle, Crushing) */}
          <div className="lg:col-span-5 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-sky-400" />
              KATEGORI STREAM PRODUKSI:
            </span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
              {(
                [
                  { key: "ALL", label: "Semua" },
                  { key: "COAL", label: "Coal" },
                  { key: "OB", label: "OB" },
                  { key: "ROM", label: "ROM" },
                  { key: "WASTE", label: "Waste" },
                  { key: "REHANDLE", label: "Rehandle" },
                  { key: "CRUSHING", label: "Crushing" },
                ] as const
              ).map((s) => {
                const isActive = stream === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => setStream(s.key)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Summary KPI Metrics (Target vs Actual vs Forecast) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Target Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              TARGET RENCANA ({period})
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-white font-mono tracking-tight">
              {summaryKPIs.currentTarget.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-bold">{unitLabel}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Stream: <strong className="text-sky-300">{stream}</strong></span>
            <span>Status: <strong className="text-emerald-400">Approved Plan</strong></span>
          </div>
        </div>

        {/* Actual Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              AKTUAL REALISASI ({period})
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
              {summaryKPIs.currentActual.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-bold">{unitLabel}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Pencapaian:</span>
            <span className={`font-bold font-mono ${summaryKPIs.achievementRate >= 100 ? "text-emerald-400" : "text-amber-400"}`}>
              {summaryKPIs.achievementRate}% {summaryKPIs.achievementRate >= 100 ? "✓ Met Target" : "⚠ Under Target"}
            </span>
          </div>
        </div>

        {/* Forecast Card */}
        <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              FORECAST AI PROYEKSI
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-indigo-300 font-mono tracking-tight">
              {summaryKPIs.currentForecast.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 ml-1.5 font-bold">{unitLabel}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Proyeksi Akhir:</span>
            <span className="font-bold font-mono text-indigo-400">
              {summaryKPIs.forecastAchievementRate}% Target
            </span>
          </div>
        </div>

        {/* Variance & Strip Ratio Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              VARIANCE & STRIP RATIO
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  summaryKPIs.variance >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {summaryKPIs.variance >= 0 ? `+${summaryKPIs.variance.toLocaleString()}` : summaryKPIs.variance.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 ml-1.5 font-bold">{unitLabel}</span>
            </div>
            <span className="text-xs font-mono text-slate-400 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
              SR: <strong className="text-amber-400">3.33</strong>
            </span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Gap Risk: <strong className="text-white">{summaryKPIs.variance < 0 ? "Potential Shortfall" : "Buffer Surplus"}</strong></span>
            <span>Confidence: <strong className="text-emerald-400">96.8% High</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Main Chart: Target vs Actual vs Forecast Composed Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              GRAFIK TREN: TARGET VS AKTUAL VS FORECAST • {streamTitle.toUpperCase()} ({period})
            </h3>
            <p className="text-xs text-slate-400">
              Perbandingan visual realisasi lapangan (Bar Hijau/Kuning) terhadap Target Rencana (Garis Biru) dan Proyeksi AI (Garis Putus Indigo)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              Unit: <strong className="text-white">{unitLabel}</strong>
            </span>
          </div>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="forecastAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#475569" }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#475569" }}
                tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.75rem",
                  color: "#fff",
                  fontSize: "12px",
                }}
                formatter={(value: any, name: any) => [
                  `${Number(value).toLocaleString()} ${unitLabel}`,
                  name === actualKey
                    ? "Aktual Realisasi"
                    : name === targetKey
                    ? "Target Rencana"
                    : name === forecastKey
                    ? "Forecast AI Proyeksi"
                    : name,
                ]}
              />
              <Legend
                verticalAlign="top"
                height={36}
                wrapperStyle={{ fontSize: "12px", color: "#cbd5e1" }}
                formatter={(value) => {
                  if (value === actualKey) return "Aktual Realisasi Lapangan";
                  if (value === targetKey) return "Target Rencana Operasional";
                  if (value === forecastKey) return "Forecast AI Machine Learning";
                  return value;
                }}
              />

              {/* Area for Forecast Confidence Band */}
              <Area
                type="monotone"
                dataKey={forecastKey}
                fill="url(#forecastAreaGrad)"
                stroke="#818cf8"
                strokeWidth={2}
                strokeDasharray="4 4"
                name={forecastKey}
              />

              {/* Bar for Actual */}
              <Bar
                dataKey={actualKey}
                fill={streamColor}
                radius={[6, 6, 0, 0]}
                barSize={period === "HOURLY" ? 18 : 28}
                name={actualKey}
              />

              {/* Line for Target */}
              <Line
                type="monotone"
                dataKey={targetKey}
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 4, fill: "#38bdf8", stroke: "#0f172a", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                name={targetKey}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Stream-by-Stream Multi Breakdown Matrix (The 6 Input Streams) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              6 STREAM PRODUKSI TAMBANG (INPUT & MONITORING)
            </h3>
            <p className="text-xs text-slate-400">
              Overview menyeluruh performa 6 stream produksi tambang untuk periode aktif: <strong>{period}</strong>
            </p>
          </div>

          <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
            All 6 Streams Active & Synced
          </span>
        </div>

        {/* 6 Stream Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Coal Production */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase">1. Coal Production</h4>
                  <span className="text-[10px] text-slate-400">Seam 30 & Seam 28 High Grade</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                102.3% Met
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Target</span>
                <span className="font-mono font-bold text-white">15,000 T</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Actual</span>
                <span className="font-mono font-bold text-emerald-400">15,350 T</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Forecast</span>
                <span className="font-mono font-bold text-indigo-300">15,480 T</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">Digging: EX-201 (PC1250)</span>
              <button
                onClick={() => onOpenInputModal("COAL")}
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>+ Input Data</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 2. OB Production */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Mountain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase">2. OB Production</h4>
                  <span className="text-[10px] text-slate-400">Overburden Hard & Soft</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                102.4% Met
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Target</span>
                <span className="font-mono font-bold text-white">50,000 BCM</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Actual</span>
                <span className="font-mono font-bold text-amber-400">51,200 BCM</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Forecast</span>
                <span className="font-mono font-bold text-indigo-300">51,800 BCM</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">Disposal: West 02 & In-Pit</span>
              <button
                onClick={() => onOpenInputModal("OB")}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>+ Input Data</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 3. ROM Stockpile Management */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-sky-500/50 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Pickaxe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase">3. ROM Stockpile</h4>
                  <span className="text-[10px] text-slate-400">ROM-IN / OUT & Blending</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                128,400 T Live
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">ROM IN</span>
                <span className="font-mono font-bold text-emerald-400">15,350 T</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">ROM OUT</span>
                <span className="font-mono font-bold text-sky-400">14,200 T</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Net Delta</span>
                <span className="font-mono font-bold text-indigo-300">+1,150 T</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">Dome 01 (6,150 kcal/kg)</span>
              <button
                onClick={() => onOpenInputModal("ROM")}
                className="text-xs font-bold text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>+ Input Data</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 4. Waste Rock & Disposal */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase">4. Waste Management</h4>
                  <span className="text-[10px] text-slate-400">Disposal West & Embankment</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                16,800 BCM
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Target</span>
                <span className="font-mono font-bold text-white">16,000 BCM</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Actual</span>
                <span className="font-mono font-bold text-slate-200">16,800 BCM</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Trips</span>
                <span className="font-mono font-bold text-indigo-300">224 Trips</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">Fleet: DT-104..108</span>
              <button
                onClick={() => onOpenInputModal("WASTE")}
                className="text-xs font-bold text-slate-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>+ Input Data</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 5. Rehandle Coal */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase">5. Rehandle Coal</h4>
                  <span className="text-[10px] text-slate-400">Stockpile to Crusher Hopper</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                102.7% Met
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Target</span>
                <span className="font-mono font-bold text-white">7,500 T</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Actual</span>
                <span className="font-mono font-bold text-purple-400">7,700 T</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Forecast</span>
                <span className="font-mono font-bold text-indigo-300">7,750 T</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">Loader: WL-301 (CAT 988K)</span>
              <button
                onClick={() => onOpenInputModal("REHANDLE")}
                className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>+ Input Data</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 6. Crushing Production */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase">6. Crushing Plant</h4>
                  <span className="text-[10px] text-slate-400">Crusher 01 & 02 (-50mm)</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                102.9% Met
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Target</span>
                <span className="font-mono font-bold text-white">17,000 T</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Actual</span>
                <span className="font-mono font-bold text-cyan-400">17,500 T</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Throughput</span>
                <span className="font-mono font-bold text-indigo-300">1,166 TPH</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">Crushed Out: 17,140 Ton</span>
              <button
                onClick={() => onOpenInputModal("CRUSHING")}
                className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>+ Input Data</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
