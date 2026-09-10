import React, { useState } from "react";
import {
  Flame,
  Award,
  Layers,
  CheckCircle2,
  Sliders,
  Sparkles,
  FlaskConical,
  AlertTriangle,
  Info,
  Scale,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { CoalProduct } from "../../../types/salesTypes";

interface CoalProductsTabProps {
  products: CoalProduct[];
}

export const CoalProductsTab: React.FC<CoalProductsTabProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<CoalProduct | null>(products[0] || null);

  // Detailed Specifications Matrix
  const detailedSpecs: Record<string, {
    imADB: number;
    vmADB: number;
    fcADB: number;
    hgi: number;
    size: string;
    rejectionGAR: number;
    rejectionAsh: number;
    rejectionTS: number;
    rejectionTM: number;
    standard: string;
  }> = {
    "PRD-COAL-5800": {
      imADB: 10.5,
      vmADB: 41.2,
      fcADB: 42.8,
      hgi: 48,
      size: "0 - 50 mm (95% pass)",
      rejectionGAR: 5700,
      rejectionAsh: 8.5,
      rejectionTS: 0.85,
      rejectionTM: 26.0,
      standard: "ASTM D388 / ISO 17025 Certified",
    },
    "PRD-COAL-5200": {
      imADB: 12.0,
      vmADB: 39.5,
      fcADB: 41.0,
      hgi: 52,
      size: "0 - 50 mm (90% pass)",
      rejectionGAR: 5050,
      rejectionAsh: 9.5,
      rejectionTS: 0.90,
      rejectionTM: 29.0,
      standard: "ISO 13909 Mechanical Sampling",
    },
    "PRD-COAL-4650": {
      imADB: 14.5,
      vmADB: 38.0,
      fcADB: 39.5,
      hgi: 55,
      size: "0 - 50 mm (88% pass)",
      rejectionGAR: 4500,
      rejectionAsh: 10.5,
      rejectionTS: 1.10,
      rejectionTM: 32.0,
      standard: "ISO 13909 Mechanical Sampling",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 uppercase tracking-wider">
              COAL SPECIFICATION & QUALITY MATRIX
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              ISO 17025 Accredited
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500" />
            Coal Product Grades, Guaranteed Specifications & Rejection Limits
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Monitoring spesifikasi parameter kualitas batubara komersial: <strong>Gross As Received (GAR), Total Moisture (TM), Inherent Moisture (IM), Ash Content, Total Sulfur (TS), Volatile Matter (VM), HGI, dan Sizing</strong> untuk kepatuhan kontrak ekspor & domestik PLN.
          </p>
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((prd) => {
          const spec = detailedSpecs[prd.productId] || detailedSpecs["PRD-COAL-5800"];
          const isSelected = selectedProduct?.productId === prd.productId;

          return (
            <div
              key={prd.id}
              onClick={() => setSelectedProduct(prd)}
              className={`bg-white dark:bg-slate-900 rounded-3xl p-6 border transition-all cursor-pointer space-y-5 ${
                isSelected
                  ? "border-amber-500 ring-2 ring-amber-500/20 shadow-xl"
                  : "border-slate-200 dark:border-slate-800 hover:border-amber-400 shadow-sm"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md">
                    {prd.productCode}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {prd.coalType.replace("_", " ")}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {prd.productName}
                </h3>
              </div>

              {/* Primary Guaranteed Specs Grid */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                  Guaranteed Typical Specification
                </h4>

                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 font-sans block font-semibold">
                      Calorific Value (GAR)
                    </span>
                    <span className="text-base font-black text-amber-600 dark:text-amber-400">
                      {prd.targetGAR} <span className="text-[10px] font-sans font-normal">kcal/kg</span>
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 font-sans block">Total Moisture (ARB)</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                      {prd.targetTM}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 font-sans block">Ash Content (ADB)</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                      {prd.targetAsh}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 font-sans block">Total Sulfur (ADB)</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                      {prd.targetTS}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Rejection Limits Bar */}
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-[11px] space-y-1">
                <div className="flex items-center gap-1 font-bold text-rose-700 dark:text-rose-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Contract Rejection Limits:</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-rose-800 dark:text-rose-300 font-mono">
                  <span>GAR Min: &lt;{spec.rejectionGAR} kcal</span>
                  <span>Ash Max: &gt;{spec.rejectionAsh}%</span>
                  <span>TS Max: &gt;{spec.rejectionTS}%</span>
                  <span>TM Max: &gt;{spec.rejectionTM}%</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                  <CheckCircle2 className="w-4 h-4" /> ASTM / ISO 17025
                </span>
                <span className="text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  Click for Full Assay
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Product Full Assay Deep-Dive */}
      {selectedProduct && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  {selectedProduct.productCode} • DETAILED CERTIFICATE OF ANALYSIS PROFILE
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedProduct.productName}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                100% Contract Compliance
              </span>
            </div>
          </div>

          {/* Full Assay Parameter Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-sans uppercase font-bold">Inherent Moisture (ADB)</span>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {detailedSpecs[selectedProduct.productId]?.imADB || 11.2}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-sans uppercase font-bold">Volatile Matter (ADB)</span>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {detailedSpecs[selectedProduct.productId]?.vmADB || 40.5}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-sans uppercase font-bold">Fixed Carbon (ADB)</span>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {detailedSpecs[selectedProduct.productId]?.fcADB || 42.1}%
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-sans uppercase font-bold">Hardgrove Index (HGI)</span>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {detailedSpecs[selectedProduct.productId]?.hgi || 50}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-slate-600 dark:text-slate-300">
                Size Distribution: <strong>{detailedSpecs[selectedProduct.productId]?.size || "0 - 50 mm"}</strong>
              </span>
            </div>
            <div className="text-slate-500">
              Sampling Method: <strong>{detailedSpecs[selectedProduct.productId]?.standard || "ISO 13909 / ASTM"}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
