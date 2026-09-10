import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  UserCheck,
  UserX,
  X,
  Building,
  Phone,
  Mail,
  Briefcase,
} from "lucide-react";
import {
  Employee,
  Department,
  Position,
  EmploymentType,
  EmploymentStatus,
} from "../../../types/hrTypes";

interface Props {
  employees: Employee[];
  departments: Department[];
  positions: Position[];
  onAddEmployee: (emp: Omit<Employee, "id" | "createdAt" | "updatedAt">) => void;
  onSelectEmployee: (employee: Employee) => void;
}

export const EmployeeMasterTab: React.FC<Props> = ({
  employees,
  departments,
  positions,
  onAddEmployee,
  onSelectEmployee,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [employeeNumber, setEmployeeNumber] = useState(`2026${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE">("MALE");
  const [birthDate, setBirthDate] = useState("1995-06-15");
  const [joinDate, setJoinDate] = useState("2026-08-01");
  const [departmentId, setDepartmentId] = useState(departments[0]?.departmentId || "");
  const [positionId, setPositionId] = useState(positions[0]?.positionId || "");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("PERMANENT");
  const [employmentStatus, setEmploymentStatus] = useState<EmploymentStatus>("ACTIVE");
  const [phone, setPhone] = useState("+62 812-3344-5566");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("Mess Karyawan Site Tapin");

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "ALL" || emp.departmentId === deptFilter;
    const matchesStatus = statusFilter === "ALL" || emp.employmentStatus === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const dept = departments.find((d) => d.departmentId === departmentId);
    const pos = positions.find((p) => p.positionId === positionId);

    onAddEmployee({
      employeeId: `EMP-${Math.floor(200 + Math.random() * 800)}`,
      employeeNumber,
      companyId: "COMP-01",
      siteId: "SITE-TAPIN",
      departmentId,
      departmentName: dept?.name || "Mining Dept",
      positionId,
      positionName: pos?.name || "Staff",
      name,
      gender,
      birthDate,
      joinDate,
      employmentType,
      employmentStatus,
      phone,
      email,
      emergencyContact: {
        name: "Kontak Darurat",
        relation: "Keluarga",
        phone,
      },
      address,
    });

    setIsModalOpen(false);
    setName("");
    setEmail("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-400" />
            Employee Master Database & Manpower Inventory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Data terpusat seluruh karyawan tambang, status kepegawaian, jabatan, departemen, dan kontak darurat.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/10"
        >
          <Plus className="h-4 w-4" /> Tambah Karyawan Baru
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari ID, NIK, atau Nama Karyawan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Semua Departemen</option>
            {departments.map((d) => (
              <option key={d.id} value={d.departmentId}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="ON_LEAVE">ON_LEAVE</option>
            <option value="RESIGNED">RESIGNED</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3">ID / NIK</th>
                <th className="px-4 py-3">Nama Karyawan</th>
                <th className="px-4 py-3">Jabatan & Departemen</th>
                <th className="px-4 py-3">Tipe Kerja</th>
                <th className="px-4 py-3">Tgl Bergabung</th>
                <th className="px-4 py-3">Telepon & Email</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500 italic">
                    Tidak ada karyawan yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                      {emp.employeeId}
                      <span className="block text-[10px] text-slate-500">{emp.employeeNumber}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      {emp.name}
                      <span className="block text-[10px] text-slate-400 font-normal">{emp.gender}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-200 font-medium block">{emp.positionName}</span>
                      <span className="text-[10px] text-slate-400">{emp.departmentName}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-cyan-400">{emp.employmentType}</td>
                    <td className="px-4 py-3 text-slate-400">{emp.joinDate}</td>
                    <td className="px-4 py-3 text-slate-300 text-[11px]">
                      <span className="block font-medium">{emp.phone}</span>
                      <span className="text-slate-500 block truncate max-w-[140px]">{emp.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          emp.employmentStatus === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {emp.employmentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onSelectEmployee(emp)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-[11px] transition"
                      >
                        Profile Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Employee */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" /> Form Registrasi Karyawan Baru
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nama Lengkap Karyawan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Prasetyo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nomor Induk Karyawan (NIK)</label>
                  <input
                    type="text"
                    required
                    value={employeeNumber}
                    onChange={(e) => setEmployeeNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Pilih Departemen</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.departmentId}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Pilih Jabatan / Posisi</label>
                  <select
                    value={positionId}
                    onChange={(e) => setPositionId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {positions.map((p) => (
                      <option key={p.id} value={p.positionId}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tipe Kepegawaian</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PERMANENT">PERMANENT (Tetap)</option>
                    <option value="CONTRACT">CONTRACT (Kontrak)</option>
                    <option value="PROBATION">PROBATION (Percobaan)</option>
                    <option value="DAILY">DAILY (Harian)</option>
                    <option value="OUTSOURCE">OUTSOURCE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Tanggal Bergabung</label>
                  <input
                    type="date"
                    value={joinDate}
                    onChange={(e) => setJoinDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Email Perusahaan</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@minesmart.co.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nomor Telepon / WA</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Alamat Domisili Mess / Rumah</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Simpan Karyawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
