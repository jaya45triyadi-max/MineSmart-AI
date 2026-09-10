// MINE SMART AI - Comprehensive Warehouse & Inventory Management Module
import React, { useState, useEffect, useCallback } from "react";
import {
  Boxes,
  PackageCheck,
  ArrowDownLeft,
  ArrowRightLeft,
  CheckSquare,
  AlertTriangle,
  Wrench,
  MapPin,
  QrCode,
  BarChart3,
  Sparkles,
  FileText,
  Settings,
  RefreshCw,
  Plus,
  Layers,
  ChevronRight,
  TrendingUp,
  Search,
} from "lucide-react";
import { useToast } from "../../components/ui/ToastProvider";
import { warehouseRepository } from "../../services/repositories/WarehouseRepository";
import {
  Warehouse,
  StorageLocation,
  InventoryItem,
  StockBalance,
  StockMovement,
  GoodsIssueRequest,
  StockTransfer,
  StockOpnameSession,
  ReorderRecommendation,
  WarehouseKPISummary,
  WarehouseAIInsight,
} from "../../types/warehouseTypes";

// Tab Components
import { WarehouseCommandCenterTab } from "./components/WarehouseCommandCenterTab";
import { SmartInventoryTab } from "./components/SmartInventoryTab";
import { InventoryCatalogTab } from "./components/InventoryCatalogTab";
import { StockBalancesTab } from "./components/StockBalancesTab";
import { GoodsReceivingTab } from "./components/GoodsReceivingTab";
import { GoodsIssueTab } from "./components/GoodsIssueTab";
import { StockTransfersTab } from "./components/StockTransfersTab";
import { StockOpnameTab } from "./components/StockOpnameTab";
import { ReorderEngineTab } from "./components/ReorderEngineTab";
import { SparePartsEquipmentTab } from "./components/SparePartsEquipmentTab";
import { WarehouseLocationsTab } from "./components/WarehouseLocationsTab";
import { BarcodeQRTab } from "./components/BarcodeQRTab";
import { InventoryAnalyticsTab } from "./components/InventoryAnalyticsTab";
import { WarehouseAIInsightTab } from "./components/WarehouseAIInsightTab";
import { WarehouseReportsTab } from "./components/WarehouseReportsTab";
import { WarehouseSettingsTab } from "./components/WarehouseSettingsTab";

interface WarehouseModuleProps {
  onOpenAICopilot?: () => void;
}

export type WarehouseTabKey =
  | "COMMAND_CENTER"
  | "SMART_INVENTORY"
  | "CATALOG"
  | "BALANCES"
  | "GOODS_RECEIVING"
  | "GOODS_ISSUE"
  | "TRANSFERS"
  | "STOCK_OPNAME"
  | "REORDER_ENGINE"
  | "SPAREPARTS_EQUIP"
  | "LOCATIONS"
  | "BARCODE_QR"
  | "ANALYTICS"
  | "AI_INSIGHTS"
  | "REPORTS"
  | "SETTINGS";

export const WarehouseModule: React.FC<WarehouseModuleProps> = ({ onOpenAICopilot }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<WarehouseTabKey>("COMMAND_CENTER");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Repository Data States
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [locations, setLocations] = useState<StorageLocation[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stocks, setStocks] = useState<StockBalance[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [issueRequests, setIssueRequests] = useState<GoodsIssueRequest[]>([]);
  const [transfers, setTransfers] = useState<StockTransfer[]>([]);
  const [opnameSessions, setOpnameSessions] = useState<StockOpnameSession[]>([]);
  const [reorderRecs, setReorderRecs] = useState<ReorderRecommendation[]>([]);
  const [kpi, setKpi] = useState<WarehouseKPISummary | null>(null);
  const [insights, setInsights] = useState<WarehouseAIInsight[]>([]);

  // Load All Repository Data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        loadedWh,
        loadedLoc,
        loadedItems,
        loadedStocks,
        loadedMvt,
        loadedGi,
        loadedTrf,
        loadedOpn,
        loadedRecs,
        loadedKpi,
        loadedInsights,
      ] = await Promise.all([
        warehouseRepository.getWarehouses(),
        warehouseRepository.getStorageLocations(),
        warehouseRepository.getItems(),
        warehouseRepository.getStockBalances(),
        warehouseRepository.getStockMovements(),
        warehouseRepository.getGoodsIssueRequests(),
        warehouseRepository.getTransfers(),
        warehouseRepository.getOpnameSessions(),
        warehouseRepository.getReorderRecommendations(),
        warehouseRepository.getKPISummary(),
        warehouseRepository.getAIInsights(),
      ]);

      setWarehouses(loadedWh);
      setLocations(loadedLoc);
      setItems(loadedItems);
      setStocks(loadedStocks);
      setMovements(loadedMvt);
      setIssueRequests(loadedGi);
      setTransfers(loadedTrf);
      setOpnameSessions(loadedOpn);
      setReorderRecs(loadedRecs);
      setKpi(loadedKpi);
      setInsights(loadedInsights);
    } catch (err) {
      console.error("Error loading Warehouse repository data:", err);
      showToast("Gagal memuat data pergudangan & logistik site", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler: Save / Update Inventory Item Master
  const handleSaveItem = async (item: InventoryItem) => {
    try {
      await warehouseRepository.saveItem(item);
      showToast(`Master Item '${item.itemName}' berhasil disimpan!`, "success");
      await loadData();
    } catch (err) {
      showToast("Gagal menyimpan item master", "error");
    }
  };

  // Handler: Record Movement (Goods Receipt / Issue / Transfer / Adjustment)
  const handleRecordMovement = async (mvtData: any) => {
    try {
      const res = await warehouseRepository.recordMovement(mvtData);
      showToast(`Mutasi Stok '${res.movementNumber}' berhasil dicatat!`, "success");
      await loadData();
      return res;
    } catch (err) {
      showToast("Gagal mencatat mutasi stok", "error");
    }
  };

  // Handler: Save Goods Issue Request
  const handleSaveIssueRequest = async (req: GoodsIssueRequest) => {
    try {
      await warehouseRepository.saveGoodsIssueRequest(req);
      showToast(`Permintaan Barang '${req.issueNumber}' berhasil diajukan!`, "success");
      await loadData();
    } catch (err) {
      showToast("Gagal menyimpan permintaan pengeluaran barang", "error");
    }
  };

  // Handler: Approve Goods Issue Request
  const handleApproveIssueRequest = async (id: string, approver: string) => {
    try {
      await warehouseRepository.approveGoodsIssueRequest(id, approver);
      showToast("Permintaan barang telah disetujui (Approved)!", "success");
      await loadData();
    } catch (err) {
      showToast("Gagal menyetujui permintaan barang", "error");
    }
  };

  // Handler: Fulfill Goods Issue Request
  const handleFulfillIssueRequest = async (id: string, issuer: string) => {
    try {
      await warehouseRepository.fulfillGoodsIssueRequest(id, issuer);
      showToast("Pengeluaran barang selesai (Issued) & Stok terpotong!", "success");
      await loadData();
    } catch (err) {
      showToast("Gagal memproses pengeluaran barang", "error");
    }
  };

  // Handler: Save Stock Transfer
  const handleSaveTransfer = async (trf: StockTransfer) => {
    try {
      await warehouseRepository.saveTransfer(trf);
      showToast(`Permintaan Transfer Stok '${trf.transferNumber}' berhasil dibuat!`, "success");
      await loadData();
    } catch (err) {
      showToast("Gagal menyimpan data transfer stok", "error");
    }
  };

  // Handler: Dispatch Transfer (In-Transit)
  const handleDispatchTransfer = async (id: string, approver: string) => {
    try {
      await warehouseRepository.dispatchTransfer(id, approver);
      showToast("Transfer barang dikirim (In-Transit)!", "success");
      await loadData();
    } catch (err) {
      showToast("Gagal memproses pengiriman transfer", "error");
    }
  };

  // Handler: Receive Transfer (At Destination)
  const handleReceiveTransfer = async (id: string, receiver: string) => {
    try {
      await warehouseRepository.receiveTransfer(id, receiver);
      showToast("Transfer barang diterima di gudang tujuan (Received)!", "success");
      await loadData();
    } catch (err) {
      showToast("Gagal memproses penerimaan transfer", "error");
    }
  };

  // Handler: Save Stock Opname Session
  const handleSaveOpnameSession = async (session: StockOpnameSession) => {
    try {
      await warehouseRepository.saveOpnameSession(session);
      showToast(`Sesi Stock Opname '${session.opnameNumber}' berhasil disimpan!`, "success");
      await loadData();
    } catch (err) {
      showToast("Gagal menyimpan sesi stock opname", "error");
    }
  };

  // Handler: Save Warehouse Master
  const handleSaveWarehouse = async (wh: Warehouse) => {
    try {
      await warehouseRepository.saveWarehouse(wh);
      showToast(`Master Gudang '${wh.warehouseName}' berhasil disimpan!`, "success");
      await loadData();
    } catch (err) {
      showToast("Gagal menyimpan master gudang", "error");
    }
  };

  // Handler: Save Storage Location
  const handleSaveLocation = async (loc: StorageLocation) => {
    try {
      await warehouseRepository.saveStorageLocation(loc);
      showToast(`Lokasi Bintang/Rak '${loc.locationCode}' berhasil disimpan!`, "success");
      await loadData();
    } catch (err) {
      showToast("Gagal menyimpan lokasi gudang", "error");
    }
  };

  // Tab definitions
  const tabs = [
    { key: "COMMAND_CENTER", label: "Command Center", icon: Boxes, badge: null },
    { key: "SMART_INVENTORY", label: "Smart Inventory (AI)", icon: Sparkles, badge: "PREDIKSI 12 HARI" },
    { key: "CATALOG", label: "Katalog Master Item", icon: Layers, badge: items.length },
    { key: "BALANCES", label: "Posisi Stok", icon: TrendingUp, badge: stocks.length },
    { key: "GOODS_RECEIVING", label: "Penerimaan (GR)", icon: PackageCheck, badge: null },
    {
      key: "GOODS_ISSUE",
      label: "Pengeluaran (GI)",
      icon: ArrowDownLeft,
      badge: issueRequests.filter((r) => r.status === "SUBMITTED" || r.status === "APPROVED").length || null,
    },
    {
      key: "TRANSFERS",
      label: "Transfer Gudang",
      icon: ArrowRightLeft,
      badge: transfers.filter((t) => t.status === "REQUESTED" || t.status === "IN_TRANSIT").length || null,
    },
    {
      key: "STOCK_OPNAME",
      label: "Stock Opname",
      icon: CheckSquare,
      badge: opnameSessions.filter((o) => o.status === "IN_PROGRESS").length || null,
    },
    { key: "REORDER_ENGINE", label: "Reorder Engine", icon: AlertTriangle, badge: reorderRecs.length || null },
    { key: "SPAREPARTS_EQUIP", label: "Sparepart & Alat Berat", icon: Wrench, badge: null },
    { key: "LOCATIONS", label: "Gudang & Rak Bin", icon: MapPin, badge: warehouses.length },
    { key: "BARCODE_QR", label: "Scanner Barcode", icon: QrCode, badge: null },
    { key: "ANALYTICS", label: "Analytics & Aging", icon: BarChart3, badge: null },
    { key: "AI_INSIGHTS", label: "AI Advisor", icon: Sparkles, badge: "AI" },
    { key: "REPORTS", label: "Kartu Stok & Laporan", icon: FileText, badge: null },
    { key: "SETTINGS", label: "Kebijakan Gudang", icon: Settings, badge: null },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30 shadow-inner">
                <Boxes className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                    MINE SMART AI ERP
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                    Real-Time Site Logistics
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                  Warehouse & Heavy Equipment Spare Parts Management
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              Sistem manajemen pergudangan tambang terpadu: monitoring persediaan suku cadang kritis, reorder point otomatis, penerimaan/pengeluaran barang WO, transfer inter-warehouse, barcode mobile scanning, serta audit stock opname presisi tinggi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-2 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-400" : ""}`} />
              Segarkan Data
            </button>

            {onOpenAICopilot && (
              <button
                onClick={onOpenAICopilot}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                AI Copilot Gudang
              </button>
            )}
          </div>
        </div>

        {/* Quick KPI Bar in Banner */}
        {kpi && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-5 border-t border-slate-800/80">
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Valuation</div>
              <div className="text-sm font-black text-amber-400 mt-0.5">
                Rp {(kpi.totalStockValueIDR / 1_000_000_000).toFixed(2)} M
              </div>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Item Catalog</div>
              <div className="text-sm font-black text-slate-100 mt-0.5">{kpi.totalItems} Items</div>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peringatan Reorder</div>
              <div className="text-sm font-black text-rose-400 mt-0.5">{kpi.reorderRequiredCount} Item Triggered</div>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Pengeluaran</div>
              <div className="text-sm font-black text-cyan-400 mt-0.5">{kpi.pendingGoodsIssue} Req</div>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Akurasi Stock Opname</div>
              <div className="text-sm font-black text-emerald-400 mt-0.5">{kpi.stockAccuracyPct}%</div>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inventory Turnover</div>
              <div className="text-sm font-black text-purple-400 mt-0.5">{kpi.inventoryTurnoverRatio}x / Thn</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tab Horizontal Scroll Bar */}
      <div className="bg-slate-900/90 p-2 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
        <div className="flex items-center gap-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as WarehouseTabKey)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${
                  isActive
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-950" : "text-amber-400"}`} />
                <span>{tab.label}</span>
                {tab.badge !== null && tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                      isActive
                        ? "bg-slate-950/30 text-slate-950"
                        : "bg-slate-800 text-amber-400 border border-slate-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Placeholder */}
      {isLoading ? (
        <div className="bg-slate-900/90 p-12 rounded-2xl border border-slate-800 text-center space-y-4">
          <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          <div className="text-sm font-bold text-slate-300">Memuat Data Repository Pergudangan MINE SMART AI...</div>
          <p className="text-xs text-slate-500">Mengambil data persediaan, mutasi stok, dan lokasi bin gudang site.</p>
        </div>
      ) : (
        /* Tab Content View Switching */
        <div className="transition-all duration-200">
          {activeTab === "COMMAND_CENTER" && kpi && (
            <WarehouseCommandCenterTab
              kpi={kpi}
              insights={insights}
              stocks={stocks}
              recentMovements={movements}
              warehouses={warehouses}
              onNavigateTab={(tabKey) => setActiveTab(tabKey as WarehouseTabKey)}
              onOpenCreateItem={() => setActiveTab("CATALOG")}
              onOpenIssueRequest={() => setActiveTab("GOODS_ISSUE")}
            />
          )}

          {activeTab === "SMART_INVENTORY" && (
            <SmartInventoryTab
              items={items}
              stocks={stocks}
              recommendations={reorderRecs}
              onNavigateTab={(tabKey) => setActiveTab(tabKey as WarehouseTabKey)}
              onOpenCreatePR={(item) => {
                showToast(`PR untuk ${item.itemName} dialihkan ke antrean persetujuan procurement`, "success");
              }}
            />
          )}

          {activeTab === "CATALOG" && (
            <InventoryCatalogTab
              items={items}
              stocks={stocks}
              movements={movements}
              onSaveItem={handleSaveItem}
            />
          )}

          {activeTab === "BALANCES" && <StockBalancesTab stocks={stocks} warehouses={warehouses} />}

          {activeTab === "GOODS_RECEIVING" && (
            <GoodsReceivingTab
              stocks={stocks}
              warehouses={warehouses}
              onRecordMovement={handleRecordMovement}
            />
          )}

          {activeTab === "GOODS_ISSUE" && (
            <GoodsIssueTab
              issueRequests={issueRequests}
              stocks={stocks}
              warehouses={warehouses}
              onApproveRequest={handleApproveIssueRequest}
              onFulfillRequest={handleFulfillIssueRequest}
              onSaveRequest={handleSaveIssueRequest}
            />
          )}

          {activeTab === "TRANSFERS" && (
            <StockTransfersTab
              transfers={transfers}
              warehouses={warehouses}
              stocks={stocks}
              onDispatchTransfer={handleDispatchTransfer}
              onReceiveTransfer={handleReceiveTransfer}
              onSaveTransfer={handleSaveTransfer}
            />
          )}

          {activeTab === "STOCK_OPNAME" && (
            <StockOpnameTab
              opnameSessions={opnameSessions}
              stocks={stocks}
              warehouses={warehouses}
              onSaveOpnameSession={handleSaveOpnameSession}
              onRecordMovement={handleRecordMovement}
            />
          )}

          {activeTab === "REORDER_ENGINE" && (
            <ReorderEngineTab
              recommendations={reorderRecs}
              onOpenProcurementPR={() => {
                showToast("Mengarahkan ke modul Procurement untuk pengajuan PR...", "info");
                if ((window as any).__NAVIGATE_MODULE__) {
                  (window as any).__NAVIGATE_MODULE__("procurement");
                }
              }}
            />
          )}

          {activeTab === "SPAREPARTS_EQUIP" && <SparePartsEquipmentTab items={items} stocks={stocks} />}

          {activeTab === "LOCATIONS" && (
            <WarehouseLocationsTab
              warehouses={warehouses}
              locations={locations}
              onSaveWarehouse={handleSaveWarehouse}
              onSaveLocation={handleSaveLocation}
            />
          )}

          {activeTab === "BARCODE_QR" && (
            <BarcodeQRTab
              stocks={stocks}
              onNavigateTab={(tabKey) => setActiveTab(tabKey as WarehouseTabKey)}
            />
          )}

          {activeTab === "ANALYTICS" && kpi && <InventoryAnalyticsTab kpi={kpi} />}

          {activeTab === "AI_INSIGHTS" && <WarehouseAIInsightTab insights={insights} />}

          {activeTab === "REPORTS" && <WarehouseReportsTab movements={movements} stocks={stocks} />}

          {activeTab === "SETTINGS" && <WarehouseSettingsTab />}
        </div>
      )}
    </div>
  );
};

export default WarehouseModule;
