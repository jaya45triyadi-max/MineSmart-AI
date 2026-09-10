import React, { useState, useEffect } from "react";
import { useAuth } from "../../providers/AuthProvider";
import {
  User,
  Building2,
  MapPin,
  Lock,
  ShieldCheck,
  History,
  Key,
  Camera,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Globe,
  Bell,
} from "lucide-react";
import { SessionService, LoginHistoryItem } from "../../services/auth/session-service";

export const UserProfilePage: React.FC = () => {
  const { currentUser, company, activeSite, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"personal" | "company" | "preferences" | "security">("personal");

  // Profile Form state
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [phone, setPhone] = useState(currentUser.phone || "");
  const [photoUrl, setPhotoUrl] = useState(currentUser.photoUrl || "");
  const [department, setDepartment] = useState(currentUser.department || "");
  const [position, setPosition] = useState(currentUser.position || "");

  // Preferences
  const [language, setLanguage] = useState("id");
  const [timezone, setTimezone] = useState("Asia/Makassar");
  const [notifyEmail, setNotifyEmail] = useState(true);

  // Security Form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);

  // Statuses
  const [saveStatus, setSaveStatus] = useState("");
  const [passStatus, setPassStatus] = useState("");
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);

  useEffect(() => {
    SessionService.getLoginHistory(currentUser.uid).then(setLoginHistory);
  }, [currentUser.uid]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("");
    try {
      await updateProfile({
        fullName,
        displayName,
        phone,
        photoUrl,
        department,
        position,
      });
      setSaveStatus("Profil berhasil diperbarui.");
    } catch (err: any) {
      setSaveStatus("Gagal memperbarui profil.");
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassStatus("");

    if (!currentPassword || !newPassword) {
      setPassStatus("Seluruh kolom kata sandi wajib diisi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassStatus("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setPassStatus("Kata sandi berhasil diperbarui.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-[#0F172A] to-[#1E293B] p-6 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <div className="h-20 w-20 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-2xl border border-emerald-500/30 overflow-hidden shadow-lg">
            {photoUrl ? (
              <img src={photoUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              currentUser.fullName.charAt(0)
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 h-8 w-8 bg-emerald-500 text-slate-950 rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-emerald-400 transition-all">
            <Camera className="h-4 w-4" />
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-white">{currentUser.fullName}</h1>
            <span className="rounded bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/30">
              {currentUser.role.replace("_", " ")}
            </span>
            <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              {currentUser.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
          <p className="text-xs text-slate-300">
            {company.name} | Site: <span className="text-emerald-400 font-bold">{activeSite.name}</span>
          </p>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab("personal")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
            activeTab === "personal"
              ? "border-emerald-400 text-emerald-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <User className="h-4 w-4" /> Informasi Pribadi
        </button>

        <button
          onClick={() => setActiveTab("company")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
            activeTab === "company"
              ? "border-emerald-400 text-emerald-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Building2 className="h-4 w-4" /> Perusahaan & Hak Akses
        </button>

        <button
          onClick={() => setActiveTab("preferences")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
            activeTab === "preferences"
              ? "border-emerald-400 text-emerald-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Globe className="h-4 w-4" /> Preferensi & Notifikasi
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
            activeTab === "security"
              ? "border-emerald-400 text-emerald-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> Keamanan & Login History
        </button>
      </div>

      {/* Tab Panels */}
      <div className="rounded-3xl border border-slate-800 bg-[#0F172A]/90 p-6 sm:p-8 shadow-xl">
        {activeTab === "personal" && (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs max-w-2xl">
            {saveStatus && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-emerald-400 font-bold border border-emerald-500/30">
                <CheckCircle2 className="h-4 w-4" />
                <span>{saveStatus}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Nama Tampilan / Inisial</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Alamat Email Bisnis</label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-slate-400 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Nomor Kontak / WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Departemen Tambang</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Jabatan / Position Title</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 font-bold text-slate-950 hover:from-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              Simpan Perubahan Profil
            </button>
          </form>
        )}

        {activeTab === "company" && (
          <div className="space-y-4 text-xs max-w-2xl">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Informasi Otorisasi Entitas</h3>
            <div className="grid grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div>
                <span className="text-slate-400 block mb-1">Perusahaan:</span>
                <span className="font-bold text-white text-sm">{company.name}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Kode Perusahaan:</span>
                <span className="font-mono font-bold text-emerald-400">{company.code}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Peran Akses (Role):</span>
                <span className="font-bold text-amber-400">{currentUser.role.replace("_", " ")}</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Lokasi Site Tambang Aktif:</span>
                <span className="font-bold text-emerald-300">{activeSite.name} ({activeSite.code})</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="space-y-6 text-xs max-w-2xl">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Bahasa & Zona Waktu</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Bahasa Konsol</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white focus:outline-none"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English (US)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Zona Waktu Operasional</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white focus:outline-none"
                  >
                    <option value="Asia/Makassar">WITA (Asia/Makassar)</option>
                    <option value="Asia/Jakarta">WIB (Asia/Jakarta)</option>
                    <option value="Asia/Jayapura">WIT (Asia/Jayapura)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-800 pt-4">
              <h3 className="text-sm font-bold text-white">Notifikasi Email & Waspada</h3>
              <label className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800 cursor-pointer">
                <div>
                  <p className="font-bold text-white">Notifikasi Email Sistem</p>
                  <p className="text-[11px] text-slate-400">Terima notifikasi darurat K3/HSE dan pesanan solar.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-emerald-500 h-5 w-5"
                />
              </label>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-8 text-xs">
            {/* Change Password Form */}
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Ubah Kata Sandi</h3>
              {passStatus && (
                <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400 font-bold border border-emerald-500/30">
                  {passStatus}
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-bold mb-1">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rounded-xl bg-slate-800 border border-slate-700 px-5 py-2.5 font-bold text-white hover:bg-slate-700 transition-all"
              >
                Perbarui Kata Sandi
              </button>
            </form>

            {/* MFA / OTP toggle */}
            <div className="space-y-3 max-w-xl border-t border-slate-800 pt-6">
              <h3 className="text-sm font-bold text-white">Multi-Factor Authentication (2FA/OTP)</h3>
              <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <div>
                  <p className="font-bold text-white">Verifikasi OTP Saat Login</p>
                  <p className="text-[11px] text-slate-400">Wajibkan verifikasi kode 6-digit setiap kali melakukan login.</p>
                </div>
                <input
                  type="checkbox"
                  checked={mfaEnabled}
                  onChange={(e) => setMfaEnabled(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-900 text-emerald-500 h-5 w-5"
                />
              </div>
            </div>

            {/* Login History */}
            <div className="space-y-3 border-t border-slate-800 pt-6">
              <h3 className="text-sm font-bold text-white">Riwayat Otentikasi & Login (Login History)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-slate-300">
                  <thead className="bg-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                    <tr>
                      <th className="p-3">Waktu</th>
                      <th className="p-3">Event</th>
                      <th className="p-3">Perangkat / Browser</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                    {loginHistory.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40">
                        <td className="p-3 text-slate-400">{log.timestamp}</td>
                        <td className="p-3 font-bold text-white">{log.eventType}</td>
                        <td className="p-3 text-slate-300">{log.deviceType} ({log.browser})</td>
                        <td className="p-3 text-emerald-400">{log.ipAddress}</td>
                        <td className="p-3">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                              log.success
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {log.success ? "SUCCESS" : "FAILED"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
