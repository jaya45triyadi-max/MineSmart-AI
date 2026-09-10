import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  Shield,
  UserCheck,
  UserX,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  CheckCircle2,
  Lock,
  Building2,
  MapPin,
  Edit,
} from "lucide-react";
import { UserService, PaginatedUsersResult } from "../../services/user/user-service";
import { useAuth } from "../../providers/AuthProvider";
import { UserProfile, UserRole } from "../../types";

export const UserManagementModule: React.FC = () => {
  const { company, sites, currentUser } = useAuth();
  const [usersData, setUsersData] = useState<PaginatedUsersResult>({
    users: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedSite, setSelectedSite] = useState("ALL");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Create Form
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newEmployeeId, setNewEmployeeId] = useState("");
  const [newDept, setNewDept] = useState("Operations");
  const [newRole, setNewRole] = useState<UserRole>("SUPERVISOR");
  const [newSiteIds, setNewSiteIds] = useState<string[]>([sites[0]?.id || "SITE-KAL-A"]);

  // Suspend Form
  const [suspendReason, setSuspendReason] = useState("");
  const [modalError, setModalError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    const result = await UserService.getUsers({
      companyId: company.id,
      siteId: selectedSite,
      department: selectedDept,
      role: selectedRole,
      status: selectedStatus,
      search,
      page,
      pageSize,
    });
    setUsersData(result);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [selectedSite, selectedDept, selectedRole, selectedStatus, search, page, pageSize]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    if (!newFullName || !newEmail) {
      setModalError("Nama lengkap dan email wajib diisi.");
      return;
    }

    try {
      await UserService.createUser(
        {
          uid: `USR-${Date.now().toString().slice(-6)}`,
          authUid: `USR-${Date.now().toString().slice(-6)}`,
          email: newEmail,
          displayName: newFullName,
          fullName: newFullName,
          employeeId: newEmployeeId,
          companyId: company.id,
          companyName: company.name,
          siteIds: newSiteIds,
          activeSiteId: newSiteIds[0] || "SITE-KAL-A",
          role: newRole,
          department: newDept,
          isActive: true,
          status: "ACTIVE",
          isDeleted: false,
        },
        currentUser.uid
      );
      setIsCreateModalOpen(false);
      resetCreateForm();
      loadUsers();
    } catch (err: any) {
      setModalError(err?.message || "Gagal menambah user.");
    }
  };

  const resetCreateForm = () => {
    setNewFullName("");
    setNewEmail("");
    setNewEmployeeId("");
    setNewDept("Operations");
    setNewRole("SUPERVISOR");
    setModalError("");
  };

  const handleSuspendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    if (!selectedUser) return;
    if (!suspendReason || suspendReason.trim().length < 5) {
      setModalError("Alasan penangguhan akun wajib diisi minimal 5 karakter.");
      return;
    }

    try {
      await UserService.suspendUser(selectedUser.id, suspendReason, currentUser.uid);
      setIsSuspendModalOpen(false);
      setSuspendReason("");
      setSelectedUser(null);
      loadUsers();
    } catch (err: any) {
      setModalError(err?.message || "Gagal menangguhkan akun.");
    }
  };

  const handleActivateUser = async (userId: string) => {
    await UserService.activateUser(userId, currentUser.uid);
    loadUsers();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-400" />
            <span>Pengelolaan User RBAC & Otoriasi Akses</span>
          </h2>
          <p className="text-xs text-slate-400">
            Kelola pengguna perusahaan, struktur departemen, penugasan lokasi site, serta status akun.
          </p>
        </div>

        <button
          onClick={() => {
            resetCreateForm();
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah / Undang User Baru</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Nama, Email, NIK..."
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Site Filter */}
        <select
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-white focus:outline-none"
        >
          <option value="ALL">Semua Site Tambang</option>
          {sites.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.code})
            </option>
          ))}
        </select>

        {/* Dept Filter */}
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-white focus:outline-none"
        >
          <option value="ALL">Semua Departemen</option>
          <option value="Mine Technical">Mine Technical</option>
          <option value="Operations & Fleet">Operations & Fleet</option>
          <option value="HSE & Environment">HSE & Environment</option>
          <option value="Coal Processing">Coal Processing</option>
          <option value="Executive Management">Executive Management</option>
        </select>

        {/* Role Filter */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-white focus:outline-none"
        >
          <option value="ALL">Semua Peran RBAC (18 Peran)</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="OWNER">Owner</option>
          <option value="DIRECTOR">Director</option>
          <option value="GENERAL_MANAGER">General Manager</option>
          <option value="MINE_MANAGER">Mine Manager</option>
          <option value="ENGINEERING">Engineering</option>
          <option value="GEOLOGY">Geology</option>
          <option value="SURVEY">Survey</option>
          <option value="PRODUCTION">Production</option>
          <option value="DISPATCH">Dispatch</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="HSE">HSE</option>
          <option value="ENVIRONMENT">Environment</option>
          <option value="HR">HR</option>
          <option value="PROCUREMENT">Procurement</option>
          <option value="WAREHOUSE">Warehouse</option>
          <option value="FINANCE">Finance</option>
          <option value="VIEWER">Viewer</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-white focus:outline-none"
        >
          <option value="ALL">Semua Status Akun</option>
          <option value="ACTIVE">AKTIF (ACTIVE)</option>
          <option value="PENDING_VERIFICATION">PENDING VERIFICATION</option>
          <option value="SUSPENDED">SUSPENDED</option>
          <option value="LOCKED">LOCKED</option>
        </select>
      </div>

      {/* User Data Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left text-slate-300">
            <thead className="bg-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-3.5">User & Profile</th>
                <th className="p-3.5">Email & NIK</th>
                <th className="p-3.5">Departemen</th>
                <th className="p-3.5">Peran (Role)</th>
                <th className="p-3.5">Penugasan Site</th>
                <th className="p-3.5">Status Akun</th>
                <th className="p-3.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {usersData.users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-all">
                  <td className="p-3.5 font-bold text-white flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-800 font-black text-emerald-400 flex items-center justify-center border border-slate-700">
                      {u.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{u.fullName}</p>
                      <p className="text-[10px] text-slate-400">{u.displayName}</p>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <p className="font-mono text-slate-300 text-xs">{u.email}</p>
                    <p className="text-[10px] text-slate-500 font-mono">NIK: {u.employeeId || "-"}</p>
                  </td>

                  <td className="p-3.5 font-medium text-slate-300">{u.department || "-"}</td>

                  <td className="p-3.5">
                    <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      {u.role.replace("_", " ")}
                    </span>
                  </td>

                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {u.siteIds?.map((sId) => (
                        <span key={sId} className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300 border border-slate-700">
                          {sId}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                        u.status === "ACTIVE"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : u.status === "SUSPENDED"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right space-x-2">
                    {u.status === "SUSPENDED" ? (
                      <button
                        onClick={() => handleActivateUser(u.id)}
                        className="rounded bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                      >
                        Aktifkan
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setIsSuspendModalOpen(true);
                        }}
                        className="rounded bg-red-500/20 px-2.5 py-1 text-[10px] font-bold text-red-400 border border-red-500/30 hover:bg-red-500/30"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-slate-800 text-xs text-slate-400 gap-4">
          <div>
            Menampilkan <span className="font-bold text-white">{usersData.users.length}</span> dari{" "}
            <span className="font-bold text-white">{usersData.total}</span> pengguna
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span>
              Halaman <strong className="text-white">{usersData.page}</strong> dari{" "}
              <strong className="text-white">{usersData.totalPages}</strong>
            </span>
            <button
              onClick={() => setPage((p) => Math.min(usersData.totalPages, p + 1))}
              disabled={page >= usersData.totalPages}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Create User */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-[#0F172A] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Undang / Tambah Pengguna Baru</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="rounded-xl bg-red-500/10 p-3 text-red-400 font-bold border border-red-500/30 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Email Bisnis *</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">NIK Karyawan</label>
                  <input
                    type="text"
                    value={newEmployeeId}
                    onChange={(e) => setNewEmployeeId(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Departemen</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white"
                  >
                    <option value="Mine Technical">Mine Technical</option>
                    <option value="Operations & Fleet">Operations & Fleet</option>
                    <option value="HSE & Environment">HSE & Environment</option>
                    <option value="Coal Processing">Coal Processing</option>
                    <option value="Executive Management">Executive Management</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Peran Akses RBAC (18 Peran Tambang)</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white"
                >
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="OWNER">Owner</option>
                  <option value="DIRECTOR">Director</option>
                  <option value="GENERAL_MANAGER">General Manager</option>
                  <option value="MINE_MANAGER">Mine Manager</option>
                  <option value="ENGINEERING">Engineering</option>
                  <option value="GEOLOGY">Geology</option>
                  <option value="SURVEY">Survey</option>
                  <option value="PRODUCTION">Production</option>
                  <option value="DISPATCH">Dispatch</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="HSE">HSE</option>
                  <option value="ENVIRONMENT">Environment</option>
                  <option value="HR">HR</option>
                  <option value="PROCUREMENT">Procurement</option>
                  <option value="WAREHOUSE">Warehouse</option>
                  <option value="FINANCE">Finance</option>
                  <option value="VIEWER">Viewer</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl border border-slate-800 px-4 py-2 font-bold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 font-bold text-slate-950"
                >
                  Kirim Undangan / Buat User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Suspend User with MANDATORY reason */}
      {isSuspendModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-[#0F172A] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Penangguhan Akun (Suspend)</span>
              </h3>
              <button onClick={() => setIsSuspendModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Anda akan menangguhkan akun <strong className="text-white">{selectedUser.fullName}</strong> (
              {selectedUser.email}).
            </p>

            {modalError && (
              <div className="rounded-xl bg-red-500/10 p-3 text-red-400 font-bold border border-red-500/30 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSuspendSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Alasan Penangguhan (Wajib Diisi untuk Audit Trail) *
                </label>
                <textarea
                  rows={3}
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Jelaskan alasan keamanan atau pelanggaran SOP..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white focus:border-red-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSuspendModalOpen(false)}
                  className="rounded-xl border border-slate-800 px-4 py-2 font-bold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-500 transition-all"
                >
                  TANGGUHKAN AKUN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
