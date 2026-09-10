import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  Eye,
  FileSpreadsheet,
  Download,
} from "lucide-react";
import { LabSample } from "../../../types/laboratoryTypes";

interface SampleRegisterTabProps {
  samples: LabSample[];
}

export const SampleRegisterTab: React.FC<SampleRegisterTabProps> = ({ samples }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [activeSampleModal, setActiveSampleModal] = useState<LabSample | null>(null);

  const filteredSamples = samples.filter((s) => {
    const matchesSearch =
      s.sampleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.collectorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "ALL" || s.status === selectedStatus;
    const matchesType = selectedType === "ALL" || s.sampleType === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" /> Master Register Sampel Laboratorium
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Register komprehensif seluruh sampel batubara: status pengujian, riwayat lokasi, rantai pengawasan (chain of custody), dan arsip data.
          </p>
        </div>
        <button
          onClick={() => alert("Exporting Sample Master Register to Excel/CSV...")}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Register
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode, sumber, sampler..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div>
            <label className="text-[10px] text-slate-500 uppercase font-bold mr-2">Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
            >
              <option value="ALL">All Types</option>
              <option value="ROM">ROM</option>
              <option value="STOCKPILE">STOCKPILE</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="SHIPMENT">SHIPMENT</option>
              <option value="BOREHOLE">BOREHOLE</option>
              <option value="CHECK_SAMPLE">CHECK_SAMPLE</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 uppercase font-bold mr-2">Status:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium"
            >
              <option value="ALL">All Status</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REVIEW">REVIEW</option>
              <option value="IN_TESTING">IN_TESTING</option>
              <option value="RECEIVED">RECEIVED</option>
              <option value="COLLECTED">COLLECTED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-3">Kode Sample</th>
              <th className="py-3 px-3">Jenis & Sumber</th>
              <th className="py-3 px-3">Tanggal / Shift</th>
              <th className="py-3 px-3">Sampler</th>
              <th className="py-3 px-3">Berat</th>
              <th className="py-3 px-3">Segel</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {filteredSamples.map((sample) => (
              <tr key={sample.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                <td className="py-3.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {sample.sampleCode}
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {sample.sourceName}
                  </div>
                  <div className="text-[11px] text-slate-500">{sample.sampleType}</div>
                </td>
                <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                  {sample.samplingDate} ({sample.shift})
                </td>
                <td className="py-3.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                  {sample.collectorName}
                </td>
                <td className="py-3.5 px-3 font-mono">{sample.sampleWeightKg} kg</td>
                <td className="py-3.5 px-3 font-mono text-slate-500">{sample.chainOfCustody.sealNumber}</td>
                <td className="py-3.5 px-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      sample.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : sample.status === "IN_TESTING"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                    }`}
                  >
                    {sample.status}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={() => setActiveSampleModal(sample)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-600 dark:text-slate-300 transition"
                    title="View Detail & Custody"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {activeSampleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-500">
                  {activeSampleModal.sampleCode}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Detail Sampel: {activeSampleModal.sourceName}
                </h3>
              </div>
              <button
                onClick={() => setActiveSampleModal(null)}
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Tutup
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-500 block">Tipe Sampel</span>
                <strong className="text-slate-800 dark:text-slate-200">{activeSampleModal.sampleType}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Tanggal Sampling</span>
                <strong className="text-slate-800 dark:text-slate-200">{activeSampleModal.samplingDate} {activeSampleModal.samplingTime}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Shift</span>
                <strong className="text-slate-800 dark:text-slate-200">{activeSampleModal.shift}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Sampler</span>
                <strong className="text-slate-800 dark:text-slate-200">{activeSampleModal.collectorName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Berat</span>
                <strong className="text-slate-800 dark:text-slate-200">{activeSampleModal.sampleWeightKg} kg</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Prioritas</span>
                <strong className="text-slate-800 dark:text-slate-200">{activeSampleModal.priority}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Log Chain of Custody & Penyerahan Lab
              </h4>
              <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-1.5 border border-slate-800">
                <p>• Sampling Collected by {activeSampleModal.chainOfCustody.collectedBy} on {activeSampleModal.chainOfCustody.collectedDate}</p>
                <p>• Seal Number: {activeSampleModal.chainOfCustody.sealNumber}</p>
                <p>• Lab Receiving Tech: {activeSampleModal.chainOfCustody.receivedBy || "Pending"}</p>
                <p>• Condition: {activeSampleModal.chainOfCustody.sampleCondition}</p>
                <p>• Storage Location: {activeSampleModal.chainOfCustody.storageLocation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
