import React, { useState } from "react";
import { MapPin, Flame, Layers, Compass, ExternalLink, ShieldAlert, CheckCircle } from "lucide-react";
import { Stockpile } from "../../../types/stockpileTypes";

interface StockpileLocationGisTabProps {
  stockpiles: Stockpile[];
}

export const StockpileLocationGisTab: React.FC<StockpileLocationGisTabProps> = ({ stockpiles }) => {
  const [selectedStockpile, setSelectedStockpile] = useState<Stockpile | null>(stockpiles[0] || null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-500" />
            GIS Stockpile Spatial Integration & Boundaries
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualisasi spasial GIS lokasi stockpile, pad ROM, processing hub, serta area jetty port dengan status koordinat UTM WGS84.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive GIS Spatial Board Simulation */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-slate-950 p-6 relative overflow-hidden shadow-xl min-h-[420px] flex flex-col justify-between dark:border-slate-800">
          {/* Top GIS Map Overlay Controls */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-xs text-white backdrop-blur-md">
              <Compass className="h-4 w-4 text-emerald-400 animate-spin-slow" />
              <span className="font-semibold">UTM Zone 50S • South Kalimantan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Drone DTM Live Overlay
              </span>
            </div>
          </div>

          {/* Grid Lines & Spatial Polygon Simulation */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />

          {/* Stockpile Pins on Map */}
          <div className="relative z-10 my-auto grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
            {stockpiles.map((sp) => {
              const isSelected = selectedStockpile?.id === sp.id;
              const fillPct = Number(((sp.currentQuantity / sp.capacity) * 100).toFixed(0));

              return (
                <button
                  key={sp.id}
                  onClick={() => setSelectedStockpile(sp)}
                  className={`group relative flex flex-col justify-between rounded-xl p-4 text-left transition-all backdrop-blur-md border ${
                    isSelected
                      ? "bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/20 scale-102"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                      {sp.stockpileCode}
                    </span>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        sp.status === "ACTIVE"
                          ? "bg-emerald-500"
                          : sp.status === "NEAR_FULL"
                          ? "bg-amber-500 animate-pulse"
                          : "bg-red-500"
                      }`}
                    />
                  </div>

                  <div className="mt-3">
                    <h5 className="font-bold text-white text-xs truncate">{sp.stockpileName}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">{sp.location.area}</p>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-300">
                      <span>{sp.currentQuantity.toLocaleString()} T</span>
                      <span className="font-bold text-amber-400">{fillPct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          fillPct > 90 ? "bg-red-500" : fillPct > 75 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(100, fillPct)}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* GIS Coordinates Footer Bar */}
          <div className="relative z-10 flex items-center justify-between rounded-xl bg-slate-900/90 border border-slate-800 p-3 text-[11px] text-slate-300 backdrop-blur-md">
            <div>
              <span>Terpilih: </span>
              <span className="font-bold text-white">{selectedStockpile?.stockpileName}</span>
            </div>
            <div className="font-mono text-amber-400">
              Lat: {selectedStockpile?.location.latitude.toFixed(4)} | Long: {selectedStockpile?.location.longitude.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Selected Stockpile Details Side Panel */}
        {selectedStockpile && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  {selectedStockpile.stockpileCode}
                </span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base mt-1">
                  {selectedStockpile.stockpileName}
                </h4>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600">
                {selectedStockpile.status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400">Tipe Stockpile</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedStockpile.stockpileType}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                  <span className="text-[10px] text-slate-400">Jenis Batubara</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedStockpile.coalType}</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Area:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedStockpile.location.area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Block / Pit:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedStockpile.location.block} {selectedStockpile.location.pit ? `• ${selectedStockpile.location.pit}` : ""}
                  </span>
                </div>
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-500">UTM (X, Y, Z):</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {selectedStockpile.location.x}, {selectedStockpile.location.y}, {selectedStockpile.location.z}m
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimasi Density:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedStockpile.densityTbm3 || 1.32} Ton/m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Volume DTM Survey:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedStockpile.volumeM3?.toLocaleString() || 32000} m³</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-bold">Kualitas Assay CV:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{selectedStockpile.quality.cvGAR} kcal/kg</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
