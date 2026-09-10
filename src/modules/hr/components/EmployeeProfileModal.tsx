import React, { useState } from "react";
import {
  X,
  User,
  Briefcase,
  Building,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Award,
  BookOpen,
  Clock,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Activity,
  Layers,
} from "lucide-react";
import {
  Employee,
  Certification,
  EmployeeSkill,
  EmployeeTrainingRecord,
  AttendanceRecord,
  LeaveRequest,
  OvertimeRecord,
  EmployeeDocument,
} from "../../../types/hrTypes";

interface Props {
  employee: Employee | null;
  certifications?: Certification[];
  skills?: EmployeeSkill[];
  trainings?: EmployeeTrainingRecord[];
  attendance?: AttendanceRecord[];
  leaves?: LeaveRequest[];
  overtime?: OvertimeRecord[];
  documents?: EmployeeDocument[];
  onClose: () => void;
}

export const EmployeeProfileModal: React.FC<Props> = ({
  employee,
  certifications = [],
  skills = [],
  trainings = [],
  attendance = [],
  leaves = [],
  overtime = [],
  documents = [],
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "employment"
    | "skills"
    | "certifications"
    | "training"
    | "attendance"
    | "leave"
    | "overtime"
    | "documents"
  >("overview");

  if (!employee) return null;

  const empCerts = certifications.filter((c) => c.employeeId === employee.employeeId);
  const empSkills = skills.filter((s) => s.employeeId === employee.employeeId);
  const empTrainings = trainings.filter((t) => t.employeeId === employee.employeeId);
  const empAttendance = attendance.filter((a) => a.employeeId === employee.employeeId);
  const empLeaves = leaves.filter((l) => l.employeeId === employee.employeeId);
  const empOvertime = overtime.filter((o) => o.employeeId === employee.employeeId);
  const empDocs = documents.filter((d) => d.employeeId === employee.employeeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Header Info */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-slate-800 border-2 border-emerald-500/40 flex items-center justify-center text-2xl font-black text-emerald-400 shrink-0 shadow-lg">
              {employee.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                  {employee.employeeId}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                  {employee.employmentStatus}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{employee.name}</h2>
              <p className="text-xs text-slate-300">
                {employee.positionName} • <strong className="text-emerald-400">{employee.departmentName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="self-start sm:self-auto p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Navigation Bar */}
        <div className="flex items-center gap-1 overflow-x-auto px-6 py-2 bg-slate-950 border-b border-slate-800 text-xs font-bold scrollbar-none">
          {[
            { id: "overview", label: "Overview" },
            { id: "employment", label: "Employment & Contract" },
            { id: "skills", label: "Skills Matrix" },
            { id: "certifications", label: `Certifications (${empCerts.length})` },
            { id: "training", label: `Training (${empTrainings.length})` },
            { id: "attendance", label: `Attendance (${empAttendance.length})` },
            { id: "leave", label: `Leave (${empLeaves.length})` },
            { id: "overtime", label: `Overtime (${empOvertime.length})` },
            { id: "documents", label: `Documents (${empDocs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-slate-950 font-black"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                <h3 className="font-bold text-white uppercase text-[10px] tracking-wider text-slate-400">Informasi Pribadi & Kontak</h3>
                <div className="space-y-1.5 text-slate-300">
                  <p><strong className="text-slate-500">Gender:</strong> {employee.gender}</p>
                  <p><strong className="text-slate-500">Tgl Lahir:</strong> {employee.birthDate}</p>
                  <p><strong className="text-slate-500">No Telepon:</strong> {employee.phone}</p>
                  <p><strong className="text-slate-500">Email:</strong> {employee.email}</p>
                  <p><strong className="text-slate-500">Alamat:</strong> {employee.address}</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                <h3 className="font-bold text-white uppercase text-[10px] tracking-wider text-slate-400">Pekerjaan & Kontak Darurat</h3>
                <div className="space-y-1.5 text-slate-300">
                  <p><strong className="text-slate-500">Join Date:</strong> {employee.joinDate}</p>
                  <p><strong className="text-slate-500">Status Kepegawaian:</strong> {employee.employmentType}</p>
                  <p><strong className="text-slate-500">Atasan Direct:</strong> {employee.supervisorName || "-"}</p>
                  <p><strong className="text-slate-500">Kontak Darurat:</strong> {employee.emergencyContact.name} ({employee.emergencyContact.relation}) - {employee.emergencyContact.phone}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "employment" && (
            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-xs">Detail Kepegawaian & Kontrak Kerja</h3>
              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div><span className="text-slate-500 block">Nomor Induk Karyawan (NIK):</span><strong>{employee.employeeNumber}</strong></div>
                <div><span className="text-slate-500 block">Site Operasional:</span><strong>{employee.siteId}</strong></div>
                <div><span className="text-slate-500 block">Departemen:</span><strong>{employee.departmentName}</strong></div>
                <div><span className="text-slate-500 block">Jabatan / Posisi:</span><strong>{employee.positionName}</strong></div>
                <div><span className="text-slate-500 block">Tgl Awal Kontrak:</span><strong>{employee.contractStartDate || employee.joinDate}</strong></div>
                <div><span className="text-slate-500 block">Tgl Akhir Kontrak:</span><strong className="text-amber-400">{employee.contractEndDate || "Tetap / Permanent"}</strong></div>
              </div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-2">
              <h3 className="font-bold text-white text-xs">Matrix Matriks Kompetensi & Skill</h3>
              {empSkills.length === 0 ? (
                <p className="text-slate-500 italic bg-slate-950 p-4 rounded-xl border border-slate-800">Belum ada data skill terverifikasi untuk karyawan ini.</p>
              ) : (
                empSkills.map((sk) => (
                  <div key={sk.id} className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{sk.skillName}</h4>
                      <p className="text-[10px] text-slate-400">Diverifikasi oleh: {sk.verifiedBy}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Level: {sk.level}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "certifications" && (
            <div className="space-y-2">
              <h3 className="font-bold text-white text-xs">Sertifikasi & Lisensi Operasional K3/Alat Berat</h3>
              {empCerts.length === 0 ? (
                <p className="text-slate-500 italic bg-slate-950 p-4 rounded-xl border border-slate-800">Belum ada catatan sertifikasi resmi.</p>
              ) : (
                empCerts.map((c) => (
                  <div key={c.id} className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{c.name}</h4>
                      <p className="text-[10px] text-slate-400">Penerbit: {c.issuer} | No: {c.certificateNumber}</p>
                      <p className="text-[10px] text-rose-400">Masa Berlaku s/d: {c.expiryDate}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {c.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "training" && (
            <div className="space-y-2">
              <h3 className="font-bold text-white text-xs">Riwayat Pelatihan & Diklat Tambang</h3>
              {empTrainings.length === 0 ? (
                <p className="text-slate-500 italic bg-slate-950 p-4 rounded-xl border border-slate-800">Belum ada riwayat training tercatat.</p>
              ) : (
                empTrainings.map((t) => (
                  <div key={t.id} className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{t.trainingName}</h4>
                      <p className="text-[10px] text-slate-400">Selesai: {t.completionDate} | Skor: {t.score}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {t.result}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="space-y-2">
              <h3 className="font-bold text-white text-xs">Log Presensi Kehadiran</h3>
              {empAttendance.length === 0 ? (
                <p className="text-slate-500 italic bg-slate-950 p-4 rounded-xl border border-slate-800">Belum ada catatan presensi hari ini.</p>
              ) : (
                empAttendance.map((a) => (
                  <div key={a.id} className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">Tgl: {a.date} ({a.shift})</h4>
                      <p className="text-[10px] text-slate-400">Masuk: {a.checkIn || "-"} | Keluar: {a.checkOut || "-"}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {a.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "leave" && (
            <div className="space-y-2">
              <h3 className="font-bold text-white text-xs">Riwayat Permohonan Cuti</h3>
              {empLeaves.length === 0 ? (
                <p className="text-slate-500 italic bg-slate-950 p-4 rounded-xl border border-slate-800">Tidak ada pengajuan cuti aktif.</p>
              ) : (
                empLeaves.map((l) => (
                  <div key={l.id} className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{l.leaveType} ({l.durationDays} Hari)</h4>
                      <p className="text-[10px] text-slate-400">{l.startDate} s/d {l.endDate} | Alasan: {l.reason}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {l.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "overtime" && (
            <div className="space-y-2">
              <h3 className="font-bold text-white text-xs">Riwayat Jam Overtime / Lembur</h3>
              {empOvertime.length === 0 ? (
                <p className="text-slate-500 italic bg-slate-950 p-4 rounded-xl border border-slate-800">Tidak ada riwayat lembur.</p>
              ) : (
                empOvertime.map((o) => (
                  <div key={o.id} className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">Tgl: {o.date} ({o.durationHours} Jam)</h4>
                      <p className="text-[10px] text-slate-400">Proyek: {o.project} | Alasan: {o.reason}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {o.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-2">
              <h3 className="font-bold text-white text-xs">Arsip Dokumen Resmi HR</h3>
              {empDocs.length === 0 ? (
                <p className="text-slate-500 italic bg-slate-950 p-4 rounded-xl border border-slate-800">Belum ada berkas terlampir.</p>
              ) : (
                empDocs.map((d) => (
                  <div key={d.id} className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{d.documentType}</h4>
                      <p className="text-[10px] text-slate-400">No: {d.documentNumber} | Penerbit: {d.issuer}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {d.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
