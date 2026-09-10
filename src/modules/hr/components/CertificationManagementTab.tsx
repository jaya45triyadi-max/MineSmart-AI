import React, { useState } from "react";
import {
  Award,
  ShieldAlert,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  FileText,
} from "lucide-react";
import { Certification, CertificationStatus } from "../../../types/hrTypes";

interface Props {
  certifications: Certification[];
  onAddCertification: (cert: Omit<Certification, "id">) => void;
}

export const CertificationManagementTab: React.FC<Props> = ({
  certifications,
  onAddCertification,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [employeeId, setEmployeeId] = useState("EMP-014");
  const [employeeName, setEmployeeName] = useState("Budi Santoso");
  const [departmentName, setDepartmentName] = useState("Mining & Operation");
  const [name, setName] = useState("POP (Pengawas Operasional Pertama ESDM)");
  const [certificateNumber, setCertificateNumber] = useState("POP-ESDM-99210-2026");
  const [issuer, setIssuer] = useState("LSP Geominerba ESDM");
  const [issueDate, setIssueDate] = useState("2026-08-01");
  const [expiryDate, setExpiryDate] = useState("2029-07-31");
  const [isCriticalForHSE, setIsCriticalForHSE] = useState(true);
  const [isCriticalForEquipment, setIsCriticalForEquipment] = useState(false);

  const filteredCerts = certifications.filter((c) => {
    if (filterStatus === "ALL") return true;
    return c.status === filterStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCertification({
      certificationId: `CERT-${Math.floor(1000 + Math.random() * 9000)}`,
      employeeId,
      employeeName,
      departmentName,
      name,
      certificateNumber,
      issuer,
      issueDate,
      expiryDate,
      status: "VALID",
      verificationStatus: "VERIFIED",
      isCriticalForHSE,
      isCriticalForEquipment,
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-400" />
            Certification Management & Expiry Tracking System
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitoring masa berlaku sertifikasi K3 (POP, POU), SIO Alat Berat (Excavator, Truck), dan sertifikat Ketenagakerjaan.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg"
        >
          <Plus className="h-4 w-4" /> Tambah Sertifikasi
        </button>
      </div>

      {/* Expiry Warning Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Sertifikat Valid</span>
            <h4 className="text-xl font-black text-white">
              {certifications.filter((c) => c.status === "VALID").length} Berkas
            </h4>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Mendekati Expired (&lt;60 Hari)</span>
            <h4 className="text-xl font-black text-amber-400">
              {certifications.filter((c) => c.status === "EXPIRING_SOON").length} Berkas
            </h4>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-800/40 bg-rose-950/20 p-4 flex items-center gap-3">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Kedaluwarsa (Expired)</span>
            <h4 className="text-xl font-black text-rose-400">
              {certifications.filter((c) => c.status === "EXPIRED").length} Berkas
            </h4>
          </div>
        </div>
      </div>

      {/* Certifications Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md space-y-3">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider">
            Daftar Sertifikasi & Lisensi Karyawan
          </h3>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="VALID">VALID</option>
            <option value="EXPIRING_SOON">EXPIRING_SOON</option>
            <option value="EXPIRED">EXPIRED</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">Nama Karyawan</th>
                <th className="px-4 py-3">Nama Sertifikasi / Lisensi</th>
                <th className="px-4 py-3">No Sertifikat & Penerbit</th>
                <th className="px-4 py-3">Tgl Terbit</th>
                <th className="px-4 py-3">Masa Berlaku (Expired)</th>
                <th className="px-4 py-3">Status Sertifikat</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCerts.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-bold text-white">
                    {cert.employeeName}
                    <span className="block text-[10px] text-slate-400 font-normal">{cert.departmentName}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-200 font-semibold">{cert.name}</td>
                  <td className="px-4 py-3 text-slate-300">
                    <span className="block font-mono font-bold text-emerald-400">{cert.certificateNumber}</span>
                    <span className="text-[10px] text-slate-400">{cert.issuer}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{cert.issueDate}</td>
                  <td className="px-4 py-3 font-bold text-rose-400">{cert.expiryDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        cert.status === "VALID"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : cert.status === "EXPIRING_SOON"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-[10px]">
                      Perpanjang
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Certification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-400" /> Tambah Sertifikasi Karyawan
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nama Karyawan</label>
                  <input
                    type="text"
                    required
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nama Sertifikasi / Lisensi</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nomor Sertifikat</label>
                  <input
                    type="text"
                    required
                    value={certificateNumber}
                    onChange={(e) => setCertificateNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Penerbit / Institusi</label>
                  <input
                    type="text"
                    required
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tanggal Terbit</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Masa Berlaku Expired</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold"
                >
                  Simpan Sertifikat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
