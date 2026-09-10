// MINE SMART AI - Barcode & QR Management & Interactive Scanner Tab
import React, { useState, useEffect } from "react";
import {
  QrCode,
  Scan,
  Search,
  PackageCheck,
  ArrowDownLeft,
  ArrowRightLeft,
  CheckSquare,
  Boxes,
  Printer,
  Camera,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  History,
  Tag,
  Maximize2,
  RefreshCw,
} from "lucide-react";
import { StockBalance } from "../../../types/warehouseTypes";

interface BarcodeQRTabProps {
  stocks: StockBalance[];
  onNavigateTab?: (tab: string) => void;
}

export const BarcodeQRTab: React.FC<BarcodeQRTabProps> = ({ stocks, onNavigateTab }) => {
  const [scannedCode, setScannedCode] = useState<string>("880192837401");
  const [activeItem, setActiveItem] = useState<StockBalance | null>(stocks[0] || null);
  const [manualInput, setManualInput] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [scanHistory, setScanHistory] = useState<Array<{ code: string; name: string; time: string; loc: string }>>([
    {
      code: "880192837401",
      name: "Hydraulic Return Filter Element PC1250",
      time: "10:45:22",
      loc: "WH2-ZB-R04-S01-B05",
    },
    {
      code: "QR-ITM-TYR-2749",
      name: "Haul Truck Tyre 27.00R49 E4",
      time: "09:30:15",
      loc: "WH1-ZA-R01-S02-B01",
    },
  ]);
  const [selectedLabelType, setSelectedLabelType] = useState<"ALL" | "SPARE" | "BIN">("ALL");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Play synthetic scanner beep sound
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // Audio context might be restricted before user interaction
    }
  };

  const handleSimulateScan = (stk: StockBalance) => {
    setScannedCode(stk.itemCode);
    setActiveItem(stk);
    playBeep();

    const newEntry = {
      code: stk.itemCode,
      name: stk.itemName,
      time: new Date().toLocaleTimeString(),
      loc: stk.locationCode,
    };
    setScanHistory((prev) => [newEntry, ...prev.slice(0, 7)]);
    setSuccessToast(`Berhasil memindai: ${stk.itemName} (${stk.locationCode})`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    const found = stocks.find(
      (s) =>
        s.itemCode.toLowerCase().includes(manualInput.toLowerCase()) ||
        s.itemName.toLowerCase().includes(manualInput.toLowerCase()) ||
        s.partNumber.toLowerCase().includes(manualInput.toLowerCase()) ||
        s.locationCode.toLowerCase().includes(manualInput.toLowerCase())
    );

    if (found) {
      handleSimulateScan(found);
      setManualInput("");
    } else {
      setSuccessToast(`Item dengan kode "${manualInput}" tidak ditemukan.`);
      setTimeout(() => setSuccessToast(null), 3500);
    }
  };

  const formatIDR = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-400" />
            Sistem Barcode & QR Code Mobile Warehouse Scanner
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Integrasi label Barcode SKU dan QR Code lokasi bin rack untuk pemindaian cepat dari scanner terminal, tablet, & kamera mobile.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
              soundEnabled
                ? "bg-slate-800 border-slate-700 text-emerald-400"
                : "bg-slate-800 border-slate-700 text-slate-500"
            }`}
            title="Toggle Audio Feedback"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? "Audio On" : "Audio Mute"}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Cetak Semua Label
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-between animate-fade-in shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Split: Mobile Scanner Simulator vs Items List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Mobile Scanner Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
              <Scan className="w-4 h-4 text-cyan-400" /> Terminal Pemindai Barcode / QR Cepat
            </h4>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Optical Ready
            </span>
          </div>

          {/* Scanner Viewport Simulation */}
          <div className="bg-slate-950 p-6 rounded-2xl border-2 border-dashed border-cyan-500/50 text-center space-y-3 relative overflow-hidden group">
            <div className="absolute top-2 left-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
              HD Auto-Focus Lens 4K
            </div>

            {/* Targeting Reticle */}
            <div className="w-36 h-36 mx-auto bg-cyan-500/5 border-2 border-cyan-400 rounded-2xl flex flex-col items-center justify-center relative shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              {/* Laser Scanning Line Animation */}
              <div className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_8px_#ef4444] animate-bounce opacity-80" />
              <QrCode className="w-16 h-16 text-cyan-400 opacity-90" />
            </div>

            <div>
              <div className="text-xs font-bold text-slate-200">Arahkan Kamera ke Barcode / QR Label</div>
              <div className="text-[11px] font-mono text-cyan-400 mt-1 font-bold">
                Terakhir Dipindai: <span className="text-amber-400">{scannedCode}</span>
              </div>
            </div>
          </div>

          {/* Manual Barcode Input Form */}
          <form onSubmit={handleManualSearch} className="flex items-center gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Ketik Kode Barcode / Part No / Bin..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              Cari / Scan
            </button>
          </form>

          {/* Scanned Result Active Item Card */}
          {activeItem && (
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-cyan-500/30 space-y-3 text-xs shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Hasil Pemindaian Aktif
                  </span>
                  <h4 className="font-black text-white text-sm mt-1">{activeItem.itemName}</h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Part No: <span className="text-slate-200">{activeItem.partNumber}</span> • SKU: {activeItem.itemCode}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Stok Fisik (On-Hand):</span>
                  <span className="font-black text-amber-400 text-sm">{activeItem.onHand} {activeItem.unit}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Lokasi Rak Bin:</span>
                  <span className="font-bold text-cyan-400 font-mono text-xs">{activeItem.locationCode}</span>
                </div>
              </div>

              {/* Instant Scan-to-Action Buttons */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => onNavigateTab && onNavigateTab("GOODS_RECEIVING")}
                  className="py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <PackageCheck className="w-3.5 h-3.5" /> Terima (GR)
                </button>
                <button
                  onClick={() => onNavigateTab && onNavigateTab("GOODS_ISSUE")}
                  className="py-2 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" /> Keluar (GI)
                </button>
                <button
                  onClick={() => onNavigateTab && onNavigateTab("STOCK_OPNAME")}
                  className="py-2 bg-purple-500 hover:bg-purple-400 text-slate-950 font-black rounded-xl transition flex items-center justify-center gap-1 col-span-2 sm:col-span-1 cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5" /> Opname
                </button>
              </div>
            </div>
          )}

          {/* Recent Scan History */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-400" /> Riwayat Pemindaian Terkini:
            </span>
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {scanHistory.map((h, i) => (
                <div
                  key={i}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-slate-200 block truncate">{h.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{h.code} • {h.loc}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 shrink-0">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Label Tag Printer & Barcode Directory (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h4 className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
              <Boxes className="w-4 h-4 text-amber-400" />
              Katalog Label Barcode & QR Code Siap Cetak (Bin & Pallet Tags)
            </h4>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px]">
              <button
                onClick={() => setSelectedLabelType("ALL")}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  selectedLabelType === "ALL" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedLabelType("SPARE")}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  selectedLabelType === "SPARE" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                Spare Parts
              </button>
              <button
                onClick={() => setSelectedLabelType("BIN")}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  selectedLabelType === "BIN" ? "bg-amber-500 text-slate-950" : "text-slate-400 hover:text-white"
                }`}
              >
                Bin Rack Lokasi
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
            {stocks.map((stk) => (
              <div
                key={stk.stockId}
                className="p-4 bg-slate-950 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition space-y-3 relative group shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <div>
                      <h5 className="font-black text-white text-xs line-clamp-1">{stk.itemName}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">PN: {stk.partNumber}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-cyan-300 font-mono">
                    {stk.locationCode}
                  </span>
                </div>

                {/* Industrial Barcode & QR Visualization */}
                <div className="p-3 bg-white rounded-xl flex items-center justify-between text-slate-950">
                  {/* Fake Code 128 Barcode Visual */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-[2px] h-7">
                      <div className="w-[2px] h-full bg-black" />
                      <div className="w-[1px] h-full bg-black" />
                      <div className="w-[3px] h-full bg-black" />
                      <div className="w-[1px] h-full bg-black" />
                      <div className="w-[2px] h-full bg-black" />
                      <div className="w-[4px] h-full bg-black" />
                      <div className="w-[1px] h-full bg-black" />
                      <div className="w-[2px] h-full bg-black" />
                      <div className="w-[3px] h-full bg-black" />
                      <div className="w-[2px] h-full bg-black" />
                      <div className="w-[1px] h-full bg-black" />
                      <div className="w-[4px] h-full bg-black" />
                      <div className="w-[2px] h-full bg-black" />
                    </div>
                    <div className="text-[9px] font-mono font-bold tracking-widest text-center">
                      {stk.itemCode}
                    </div>
                  </div>

                  {/* 2D QR Code Visual */}
                  <div className="w-12 h-12 bg-slate-100 border border-slate-400 rounded-lg p-1 flex items-center justify-center">
                    <QrCode className="w-10 h-10 text-slate-900" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400">
                    Stok: <strong className="text-amber-400">{stk.onHand} {stk.unit}</strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSimulateScan(stk)}
                      className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-lg text-[10px] transition cursor-pointer"
                    >
                      Scan Item Ini
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
