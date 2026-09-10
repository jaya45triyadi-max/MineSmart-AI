// MINE SMART AI - Warehouse Settings Tab
import React, { useState } from "react";
import { Settings, ShieldCheck, DollarSign, Clock, Save, AlertTriangle } from "lucide-react";

export const WarehouseSettingsTab: React.FC = () => {
  const [valuationMethod, setValuationMethod] = useState("WEIGHTED_AVERAGE");
  const [negativeStockAllowed, setNegativeStockAllowed] = useState(false);
  const [safetyStockMultiplier, setSafetyStockMultiplier] = useState(1.5);
  const [expiryAlertDays, setExpiryAlertDays] = useState(60);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-lg max-w-3xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-slate-800 text-amber-400 rounded-xl border border-slate-700">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Konfigurasi Kebijakan Persediaan Gudang (Warehouse Policy Settings)</h3>
            <p className="text-xs text-slate-400">Pengaturan valuation method, batas stok negatif, dan sistem pengingat kadaluarsa.</p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
          <div className="space-y-2">
            <label className="block text-slate-300 font-bold">Metode Valuasi HPP Persediaan (Valuation Method)</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValuationMethod("WEIGHTED_AVERAGE")}
                className={`p-4 rounded-xl border text-left transition ${
                  valuationMethod === "WEIGHTED_AVERAGE"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                <div className="font-bold text-sm">Weighted Average (Rata-Rata Tertimbang)</div>
                <div className="text-[11px] text-slate-400 mt-1">Metode default terintegrasi ke Finance & Controlling.</div>
              </button>

              <button
                type="button"
                onClick={() => setValuationMethod("FIFO")}
                className={`p-4 rounded-xl border text-left transition ${
                  valuationMethod === "FIFO"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                <div className="font-bold text-sm">FIFO (First In, First Out)</div>
                <div className="text-[11px] text-slate-400 mt-1">Mengeluarkan batch lama terlebih dahulu.</div>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-200">Izinkan Stok Negatif (Negative Stock)</div>
                <div className="text-[11px] text-slate-400">Default: Disabled untuk mencegah penyimpangan fisik vs sistem.</div>
              </div>

              <button
                type="button"
                onClick={() => setNegativeStockAllowed(!negativeStockAllowed)}
                className={`w-12 h-6 rounded-full transition p-1 ${
                  negativeStockAllowed ? "bg-rose-500" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition transform ${
                    negativeStockAllowed ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Peringatan Kadaluarsa Lubricants/Chemicals (Hari)</label>
              <input
                type="number"
                value={expiryAlertDays}
                onChange={(e) => setExpiryAlertDays(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Faktor Pengali Safety Stock (Safety Stock Multiplier)</label>
              <input
                type="number"
                step="0.1"
                value={safetyStockMultiplier}
                onChange={(e) => setSafetyStockMultiplier(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Kebijakan persediaan berhasil diperbarui.
            </div>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Simpan Konfigurasi Kebijakan
          </button>
        </form>
      </div>
    </div>
  );
};
