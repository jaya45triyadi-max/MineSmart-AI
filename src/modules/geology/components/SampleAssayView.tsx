// MINE SMART AI - Geological Sample Tracking & Assay Laboratory Management

import React, { useState } from "react";
import {
  FlaskConical,
  FileText,
  CheckCircle2,
  Clock,
  Building2,
  Truck,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { SampleRecord, AssayRecord, CustodyStatus } from "../../../types/geologyTypes";

interface SampleAssayViewProps {
  samples: SampleRecord[];
  assays: AssayRecord[];
  onAddSampleSubmit: (smp: SampleRecord) => void;
}

export const SampleAssayView: React.FC<SampleAssayViewProps> = ({
  samples,
  assays,
  onAddSampleSubmit,
}) => {
  const [selectedSample, setSelectedSample] = useState<SampleRecord | null>(samples[0] || null);

  const custodySteps: CustodyStatus[] = [
    "COLLECTED",
    "PREPARED",
    "DISPATCHED",
    "RECEIVED",
    "ANALYZED",
    "VALIDATED",
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sample List */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-purple-400" />
              Sampel Batubara Terdaftar
            </span>
            <span className="text-xs text-slate-400 font-mono">{samples.length} Sampel</span>
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {samples.map((s) => {
              const isSelected = selectedSample?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSample(s)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-950/60 border-purple-500/50 shadow-lg"
                      : "bg-slate-950/60 border-slate-800 hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{s.sampleCode}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                      {s.custodyStatus}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] font-mono text-slate-400 grid grid-cols-2 gap-1">
                    <span>Bor: {s.boreholeCode}</span>
                    <span>Seam: {s.seamCode || "N/A"}</span>
                    <span>Interval: {s.fromDepth}-{s.toDepth}m</span>
                    <span>Berat: {s.weightKg} kg</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chain of Custody Pipeline & Assays */}
        <div className="lg:col-span-2 space-y-6">
          {selectedSample ? (
            <>
              {/* Chain of Custody Tracker */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-400" />
                      Chain of Custody Tracking: {selectedSample.sampleCode}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Laboratorium Penguji: {selectedSample.laboratory} | Berat: {selectedSample.weightKg} kg
                    </p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                    STATUS: {selectedSample.custodyStatus}
                  </span>
                </div>

                {/* Progress Steps */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2">
                  {custodySteps.map((step, idx) => {
                    const isPassed = custodySteps.indexOf(selectedSample.custodyStatus) >= idx;
                    return (
                      <div
                        key={step}
                        className={`p-2.5 rounded-lg border text-center transition-all ${
                          isPassed
                            ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300"
                            : "bg-slate-950/40 border-slate-800/80 text-slate-500"
                        }`}
                      >
                        <span className="text-[10px] font-bold block">{step}</span>
                        <CheckCircle2 className={`w-3.5 h-3.5 mx-auto mt-1 ${isPassed ? "text-emerald-400" : "text-slate-600"}`} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Assays Table */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
                  <FileText className="w-4 h-4 text-purple-400" />
                  Sertifikat & Hasil Uji Laboratorium (Assay Records)
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                      <tr>
                        <th className="px-3 py-2">Parameter Uji</th>
                        <th className="px-3 py-2 text-right">Hasil Value</th>
                        <th className="px-3 py-2">Satuan</th>
                        <th className="px-3 py-2">Standar Metode</th>
                        <th className="px-3 py-2">No. Sertifikat</th>
                        <th className="px-3 py-2 text-center">QC Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {assays.map((asy) => (
                        <tr key={asy.id} className="hover:bg-slate-800/50">
                          <td className="px-3 py-2 font-bold text-white">{asy.parameterName}</td>
                          <td className="px-3 py-2 text-right font-mono font-bold text-emerald-400">
                            {asy.resultValue}
                          </td>
                          <td className="px-3 py-2 font-mono text-slate-400">{asy.unit}</td>
                          <td className="px-3 py-2 font-mono text-slate-400">{asy.methodStandard}</td>
                          <td className="px-3 py-2 font-mono text-slate-300">{asy.certificateRef}</td>
                          <td className="px-3 py-2 text-center">
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 rounded">
                              {asy.qualityFlag}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-400">Pilih sampel untuk melihat Chain of Custody & Assay.</p>
          )}
        </div>
      </div>
    </div>
  );
};
