// MINE SMART AI - Master Global User Directory Console
// PROMPT 36: Cross-Tenant User Management, Security Controls & Password Reset Triggers

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Shield,
  Key,
  Lock,
  Unlock,
  RefreshCcw,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Mail,
  Building2,
  UserCheck,
  UserX,
  RotateCcw,
  Plus,
  Edit,
  Save,
  X,
} from "lucide-react";
import { MasterGlobalUser } from "../../../types/developerControlPanelTypes";

export const DEFAULT_GLOBAL_USERS: MasterGlobalUser[] = [
  {
    id: "usr-01",
    name: "Bambang Soedarmono",
    email: "bambang.s@batubaranusa.co.id",
    companyId: "COMP-BNU-01",
    companyName: "PT Batubara Nusa Utama",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    lastLogin: "2026-08-17T08:15:00Z",
    registeredAt: "2024-01-15T08:00:00Z",
    activeSessionsCount: 2,
    activeDeviceName: "MacBook Pro M3 & iPad Pro",
  },
  {
    id: "usr-02",
    name: "Hendro Wibowo, S.T.",
    email: "hendro.w@batubaranusa.co.id",
    companyId: "COMP-BNU-01",
    companyName: "PT Batubara Nusa Utama",
    role: "MINE_ENGINEER",
    status: "ACTIVE",
    lastLogin: "2026-08-17T07:45:00Z",
    registeredAt: "2024-01-16T10:00:00Z",
    activeSessionsCount: 1,
    activeDeviceName: "Toughbook Pit Laptop",
  },
  {
    id: "usr-03",
    name: "Rudi Hartono",
    email: "rudi.h@ktmining.id",
    companyId: "COMP-KTM-02",
    companyName: "PT Kalimantan Tambang Makmur",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    lastLogin: "2026-08-16T19:20:00Z",
    registeredAt: "2024-04-10T09:30:00Z",
    activeSessionsCount: 1,
    activeDeviceName: "Dell Precision 5570",
  },
  {
    id: "usr-04",
    name: "Dr. Ir. Agus Supriyadi",
    email: "agus.s@ktmining.id",
    companyId: "COMP-KTM-02",
    companyName: "PT Kalimantan Tambang Makmur",
    role: "GEOLOGY",
    status: "ACTIVE",
    lastLogin: "2026-08-17T06:10:00Z",
    registeredAt: "2024-04-12T11:00:00Z",
    activeSessionsCount: 1,
    activeDeviceName: "Geology Workstation 02",
  },
  {
    id: "usr-05",
    name: "Dewi Lestari",
    email: "dewi.lestari@borneoprima.com",
    companyId: "COMP-BBE-03",
    companyName: "PT Borneo Prima Energi",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
    lastLogin: "2026-08-15T14:30:00Z",
    registeredAt: "2024-08-01T11:00:00Z",
    activeSessionsCount: 1,
    activeDeviceName: "Lenovo ThinkPad X1",
  },
];

export const GlobalUsersManagerView: React.FC = () => {
  const [usersList, setUsersList] = useState<MasterGlobalUser[]>(() => {
    const saved = localStorage.getItem("minesmart_master_global_users");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_GLOBAL_USERS;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("ALL");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Modals
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<MasterGlobalUser | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    companyName: "PT Batubara Nusa Utama",
    companyId: "COMP-BNU-01",
    role: "MINE_ENGINEER" as any,
    status: "ACTIVE" as any,
    activeDeviceName: "Workstation Chrome",
  });

  const saveUsers = (newList: MasterGlobalUser[]) => {
    setUsersList(newList);
    localStorage.setItem("minesmart_master_global_users", JSON.stringify(newList));
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === "ALL" || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      companyName: "PT Batubara Nusa Utama",
      companyId: "COMP-BNU-01",
      role: "MINE_ENGINEER",
      status: "ACTIVE",
      activeDeviceName: "Workstation Chrome",
    });
    setShowCreateUserModal(true);
  };

  const handleCreateUser = () => {
    if (!formData.name.trim() || !formData.email.trim()) return;

    const newUser: MasterGlobalUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      companyName: formData.companyName,
      companyId: formData.companyId,
      role: formData.role,
      status: formData.status,
      lastLogin: new Date().toISOString(),
      registeredAt: new Date().toISOString(),
      activeSessionsCount: 1,
      activeDeviceName: formData.activeDeviceName,
    };

    const updated = [newUser, ...usersList];
    saveUsers(updated);
    setShowCreateUserModal(false);
    setActionSuccessMessage(`✅ Akun pengguna baru [${newUser.name}] berhasil dibuat!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleOpenEdit = (user: MasterGlobalUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      companyName: user.companyName,
      companyId: user.companyId,
      role: user.role,
      status: user.status,
      activeDeviceName: user.activeDeviceName,
    });
  };

  const handleSaveEditUser = () => {
    if (!editingUser) return;
    const updated = usersList.map((u) =>
      u.id === editingUser.id
        ? {
            ...u,
            name: formData.name.trim(),
            email: formData.email.trim(),
            companyName: formData.companyName,
            companyId: formData.companyId,
            role: formData.role,
            status: formData.status,
          }
        : u
    );

    saveUsers(updated);
    setEditingUser(null);
    setActionSuccessMessage(`✅ Perubahan akun user [${formData.name}] berhasil disimpan!`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleToggleSuspendUser = (user: MasterGlobalUser) => {
    const newStatus = user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    const updated = usersList.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u));
    saveUsers(updated);
    setActionSuccessMessage(
      `Akun user ${user.name} (${user.email}) diubah statusnya menjadi ${newStatus}.`
    );
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleRevokeSessions = (user: MasterGlobalUser) => {
    const updated = usersList.map((u) => (u.id === user.id ? { ...u, activeSessionsCount: 0 } : u));
    saveUsers(updated);
    setActionSuccessMessage(
      `Seluruh sesi aktif & perangkat terdaftar untuk ${user.name} berhasil dicabut (Revoked). User harus login ulang.`
    );
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  const handleTriggerPasswordReset = (user: MasterGlobalUser) => {
    setActionSuccessMessage(
      `Email tautan reset password aman telah dikirimkan ke alamat ${user.email}. (Zero plaintext password exposure).`
    );
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Global User Management Across All Tenants</span>
          </h2>
          <p className="text-xs text-slate-400">
            Direktori terpadu seluruh akun pengguna. Buat akun user baru, edit profil & perizinan role, cabut sesi aktif, atau kirim tautan reset password.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Akun User Baru</span>
        </button>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Filters */}
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama pengguna, email, atau nama IUP perusahaan..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
          >
            <option value="ALL">Semua Peran / Role</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="MINE_ENGINEER">MINE_ENGINEER</option>
            <option value="GEOLOGY">GEOLOGY</option>
            <option value="DISPATCHER">DISPATCHER</option>
            <option value="HSE_OFFICER">HSE_OFFICER</option>
            <option value="SURVEYOR">SURVEYOR</option>
            <option value="PLANT_MAINTENANCE">PLANT_MAINTENANCE</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Nama Pengguna & Email</th>
                <th className="py-3.5 px-4">Perusahaan / Tenant</th>
                <th className="py-3.5 px-4">Role Akses</th>
                <th className="py-3.5 px-4">Sesi & Perangkat</th>
                <th className="py-3.5 px-4">Login Terakhir</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filteredUsers.map((user) => {
                const isSuspended = user.status === "SUSPENDED";
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{user.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.companyName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{user.companyId}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                        {user.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                        <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.activeDeviceName}</span>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold ${
                          user.activeSessionsCount > 0 ? "text-emerald-400" : "text-slate-400"
                        }`}
                      >
                        {user.activeSessionsCount} Sesi Aktif
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(user.lastLogin).toLocaleString("id-ID")}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          user.status === "ACTIVE"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.status === "ACTIVE" ? "bg-emerald-400" : "bg-rose-400"
                          }`}
                        />
                        <span>{user.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-1.5 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors cursor-pointer"
                          title="Edit Akun & Role User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleTriggerPasswordReset(user)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded-lg transition-colors cursor-pointer"
                          title="Kirim Tautan Reset Password"
                        >
                          <Mail className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleRevokeSessions(user)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded-lg transition-colors cursor-pointer"
                          title="Cabut Sesi & Perangkat Aktif"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleSuspendUser(user)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            isSuspended
                              ? "hover:bg-emerald-500/20 text-emerald-400"
                              : "hover:bg-rose-500/20 text-rose-400"
                          }`}
                          title={isSuspended ? "Aktifkan User" : "Suspend User"}
                        >
                          {isSuspended ? (
                            <Unlock className="w-4 h-4" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit User Modal */}
      {(showCreateUserModal || editingUser) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-black text-white">
                  {editingUser ? `Edit Akun Pengguna: ${editingUser.name}` : "Buat Akun Pengguna Baru"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowCreateUserModal(false);
                  setEditingUser(null);
                }}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nama Lengkap User"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Alamat Email (Login ID)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@perusahaan.co.id"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Perusahaan / IUP Tenant
                </label>
                <select
                  value={formData.companyName}
                  onChange={(e) => {
                    const name = e.target.value;
                    let id = "COMP-BNU-01";
                    if (name.includes("Kalimantan")) id = "COMP-KTM-02";
                    if (name.includes("Borneo")) id = "COMP-BBE-03";
                    setFormData({ ...formData, companyName: name, companyId: id });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-cyan-500"
                >
                  <option value="PT Batubara Nusa Utama">PT Batubara Nusa Utama</option>
                  <option value="PT Kalimantan Tambang Makmur">PT Kalimantan Tambang Makmur</option>
                  <option value="PT Borneo Prima Energi">PT Borneo Prima Energi</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Role / Hak Akses
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-cyan-500"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full Tenant Control)</option>
                  <option value="MINE_ENGINEER">MINE_ENGINEER (Perencanaan & RKAB)</option>
                  <option value="GEOLOGY">GEOLOGY (Model Seam & Kualitas Batubara)</option>
                  <option value="DISPATCHER">DISPATCHER (Fleet & Ritase Produksi)</option>
                  <option value="HSE_OFFICER">HSE_OFFICER (K3LH & Safety Guard)</option>
                  <option value="SURVEYOR">SURVEYOR (Topografi & Volume Opname)</option>
                  <option value="PLANT_MAINTENANCE">PLANT_MAINTENANCE (Alat Berat)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                  Status Akun
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-cyan-500"
                >
                  <option value="ACTIVE">ACTIVE (Aktif Normal)</option>
                  <option value="SUSPENDED">SUSPENDED (Tangguhkan Akses)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowCreateUserModal(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={editingUser ? handleSaveEditUser : handleCreateUser}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-cyan-500/25 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{editingUser ? "Simpan Perubahan User" : "Buat Akun User"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};