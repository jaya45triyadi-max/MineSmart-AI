// MINE SMART AI - Warehouse Command Center Tab
import React from "react";
import {
  Boxes,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Clock,
  ShieldCheck,
  QrCode,
  PackageCheck,
  Truck,
  ArrowRightLeft,
  CheckSquare,
  DollarSign,
  ChevronRight,
  Layers,
} from "lucide-react";
import {
  WarehouseKPISummary,
  WarehouseAIInsight,
  StockBalance,
  StockMovement,
  Warehouse,
} from "../../../types/warehouseTypes";

interface WarehouseCommandCenterTabProps {
  kpi: WarehouseKPISummary;
  insights: WarehouseAIInsight[];
  stocks: StockBalance[];
  recentMovements: StockMovement[];
  warehouses: Warehouse[];
  onNavigateTab: (tab: string) => void;
  onOpenCreateItem: () => void;
  onOpenIssueRequest: () => void;
}

export const WarehouseCommandCenterTab: React.FC<WarehouseCommandCenterTabProps> = ({
  kpi,
  insights,
  stocks,
  recentMovements,
  warehouses,
  onNavigateTab,
  onOpenCreateItem,
  onOpenIssueRequest,
}) => {
  const formatIDR = (val: number) => {
    if (!val) return "Rp 0";
    if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(2)} Miliar`;
    if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)} Juta`;
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  const lowStocks = stocks.filter((s) => s.status === "LOW_STOCK" || s.status === "OUT_OF_STOCK");

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Inventory Value</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">{formatIDR(kpi.totalStockValueIDR)}</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Turnover: {kpi.inventoryTurnoverRatio}x / thn
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Item SKU</span>
            <Boxes className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white">{kpi.totalItems} Items</div>
          <div className="text-[11px] text-slate-400 mt-1">{kpi.activeItems} Status Aktif</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Low / Out of Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400">{kpi.lowStockItems + kpi.outOfStockItems} SKU</div>
          <div className="text-[11px] text-amber-300 mt-1">{kpi.reorderRequiredCount} Perlu Reorder</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Goods Issue</span>
            <ArrowDownLeft className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-blue-400">{kpi.pendingGoodsIssue} Req</div>
          <div className="text-[11px] text-slate-400 mt-1">Maintenance & Ops</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Stock Accuracy %</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">{kpi.stockAccuracyPct}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Hasil Opname Terakhir</div>
        </div>
      </div>

      {/* Quick Operations Strip */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Aksi Cepat Operasional Gudang Tambang:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab("SMART_INVENTORY")}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-lg shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" /> Smart Inventory (Prediksi 12 Hari)
          </button>
          <button
            onClick={() => onNavigateTab("GOODS_RECEIVING")}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
          >
            <PackageCheck className="w-3.5 h-3.5 text-emerald-400" /> Penerimaan PO (GR)
          </button>
          <button
            onClick={onOpenIssueRequest}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-blue-400" /> Pengeluaran Barang (GI)
          </button>
          <button
            onClick={() => onNavigateTab("TRANSFERS")}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-purple-400" /> Transfer Antar Gudang
          </button>
          <button
            onClick={() => onNavigateTab("BARCODE_QR")}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-400" /> Mobile Scanner
          </button>
          <button
            onClick={() => onNavigateTab("STOCK_OPNAME")}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
          >
            <CheckSquare className="w-3.5 h-3.5 text-amber-400" /> Stock Opname
          </button>
        </div>
      </div>

      {/* Main Command Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Low Stock & Reorder Alerts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Peringatan Stok Kritis & Reorder Kebutuhan Maintenance
              </h3>
              <button
                onClick={() => onNavigateTab("REORDER_ENGINE")}
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Lihat Reorder Engine <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {lowStocks.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Tidak ada stok kritis saat ini. Seluruh suku cadang dalam kondisi aman.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="py-2.5 px-3">Kode & Nama Item</th>
                      <th className="py-2.5 px-3">Kategori / Gudang</th>
                      <th className="py-2.5 px-3 text-center">Tersedia / Min</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Nilai Estimasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {lowStocks.map((stk) => (
                      <tr key={stk.stockId} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-200">{stk.itemName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {stk.itemCode} | Part: {stk.partNumber}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          <div>{stk.categoryName}</div>
                          <div className="text-[11px] text-slate-500">{stk.warehouseName}</div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-black text-amber-400">{stk.available}</span>
                          <span className="text-slate-500"> / {stk.onHand} {stk.unit}</span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              stk.status === "OUT_OF_STOCK"
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {stk.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-slate-200">
                          {formatIDR(stk.stockValueIDR)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Stock Movement Ledger Snippet */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                Aktivitas Transaksi Mutasi Stok Terakhir (Ledger)
              </h3>
              <button
                onClick={() => onNavigateTab("REPORTS")}
                className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
              >
                Stock Ledger Lengkap <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {recentMovements.slice(0, 5).map((mvt) => (
                <div
                  key={mvt.id}
                  className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg font-bold text-[10px] uppercase ${
                        mvt.quantity > 0
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {mvt.movementType.replace(/_/g, " ")}
                    </div>
                    <div>
                      <div className="font-bold text-slate-200">{mvt.itemName}</div>
                      <div className="text-[11px] text-slate-400">
                        {mvt.movementNumber} | Ref: {mvt.referenceId} ({mvt.userName})
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-black text-sm ${
                        mvt.quantity > 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {mvt.quantity > 0 ? `+${mvt.quantity}` : mvt.quantity} {mvt.unit}
                    </div>
                    <div className="text-[10px] text-slate-500">{mvt.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: AI Advisory & Warehouse Utilization */}
        <div className="space-y-6">
          {/* AI Advisor Insight Card */}
          <div className="bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 rounded-2xl border border-amber-500/30 p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Inventory Intelligence
              </span>
              <span className="text-[11px] text-amber-300 font-bold">Confidence 94%</span>
            </div>

            {insights.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white leading-snug">{insights[0].title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{insights[0].finding}</p>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-amber-500/20 space-y-1.5 text-xs">
                  <div className="text-[11px] text-amber-400 font-bold uppercase">Rekomendasi AI:</div>
                  <div className="text-slate-300">{insights[0].recommendation}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold pt-1 border-t border-slate-800">
                    Impact: {insights[0].expectedImpact}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab("AI_INSIGHTS")}
                  className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/40 transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Eksplor AI Advisory Lengkap
                </button>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Belum ada insight AI yang terdeteksi saat ini.</p>
            )}
          </div>

          {/* Warehouse Capacity Overview */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Boxes className="w-4 h-4 text-purple-400" />
              Utilisasi & Kapasitas Gudang Site A
            </h3>

            <div className="space-y-3">
              {warehouses.map((wh) => (
                <div key={wh.warehouseId} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800/60 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-200">{wh.warehouseName}</span>
                    <span className="font-bold text-purple-400">{wh.utilizedPct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        wh.utilizedPct > 80 ? "bg-rose-500" : wh.utilizedPct > 65 ? "bg-amber-400" : "bg-emerald-400"
                      }`}
                      style={{ width: `${wh.utilizedPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Kapasitas: {wh.capacitySqM} m²</span>
                    <span>Manager: {wh.managerName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
