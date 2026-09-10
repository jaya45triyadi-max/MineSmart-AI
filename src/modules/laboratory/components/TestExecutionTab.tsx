import React, { useState } from "react";
import {
  TestTube,
  Flame,
  Activity,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Wrench,
  AlertTriangle,
  FileCheck2,
} from "lucide-react";
import { LabTest, LabInstrument, TestStatus } from "../../../types/laboratoryTypes";

interface TestExecutionTabProps {
  tests: LabTest[];
  instruments: LabInstrument[];
  onUpdateTestStatus: (testId: string, status: TestStatus, resultValue?: number) => void;
}

export const TestExecutionTab: React.FC<TestExecutionTabProps> = ({
  tests,
  instruments,
  onUpdateTestStatus,
}) => {
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(tests[0] || null);
  const [inputResult, setInputResult] = useState<number>(6280);

  const handleCompleteTest = (testId: string) => {
    onUpdateTestStatus(testId, "COMPLETED", Number(inputResult));
    alert(`Pengujian ${selectedTest?.testName} berhasil disimpan dengan hasil ${inputResult}!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TestTube className="w-5 h-5 text-emerald-500" /> Eksekusi Testing & Pengujian Laboratorium
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pelaksanaan pengujian sampel batubara: Proximate, Ultimate, Calorific Value (GCV), Moisture, Ash, Sulfur, HGI sesuai standar ISO / ASTM.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Test Workorders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
              Antrean Workorder Pengujian ({tests.length})
            </h3>

            <div className="space-y-3">
              {tests.map((test) => (
                <div
                  key={test.id}
                  onClick={() => {
                    setSelectedTest(test);
                    if (test.resultValue) setInputResult(test.resultValue);
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    selectedTest?.id === test.id
                      ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {test.testId}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {test.testName}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${
                        test.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : test.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                    Sample Code: <strong className="font-mono text-slate-800 dark:text-slate-200">{test.sampleCode}</strong> • Method: {test.method}
                  </div>

                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                    <div>
                      <span>Instrument: </span>
                      <strong className="text-slate-700 dark:text-slate-300">{test.instrumentName}</strong>
                    </div>
                    <div>
                      <span>Analis: </span>
                      <strong className="text-slate-700 dark:text-slate-300">{test.analystName}</strong>
                    </div>
                    <div>
                      <span>Hasil: </span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {test.resultValue !== undefined ? `${test.resultValue} ${test.unit || ""}` : "Dalam Proses"}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Measurement Form & Instrument Status */}
        {selectedTest && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="font-mono text-xs font-bold text-emerald-500">
                  {selectedTest.testId} • {selectedTest.sampleCode}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Input Hasil: {selectedTest.testName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standard Method: {selectedTest.method}
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    Analis Bertanggung Jawab
                  </label>
                  <input
                    type="text"
                    value={selectedTest.analystName}
                    disabled
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    Instrumen / Alat Laboratorium
                  </label>
                  <input
                    type="text"
                    value={selectedTest.instrumentName}
                    disabled
                    className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold text-emerald-600 dark:text-emerald-400">
                    Nilai Pengujian Pembacaan Alat ({selectedTest.unit || "kcal/kg"})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={inputResult}
                    onChange={(e) => setInputResult(Number(e.target.value))}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-emerald-500 font-mono text-base font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">
                    Catatan Pengujian / Reagen / Drift Check
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Benzoic acid check standard within ±0.05% RSD..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => handleCompleteTest(selectedTest.testId)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Simpan Hasil & Verifikasi
                  </button>
                  <button
                    onClick={() => onUpdateTestStatus(selectedTest.testId, "IN_PROGRESS")}
                    className="w-full py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" /> Start Test Run
                  </button>
                </div>
              </div>
            </div>

            {/* Instrument Status Widget */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-500" /> Status Kalibrasi Alat
              </h4>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {instruments[0]?.name}
                </p>
                <p className="text-slate-500">
                  Kalibrasi Terakhir: {instruments[0]?.lastCalibrationDate} • Toleransi: {instruments[0]?.accuracyTolerance}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
