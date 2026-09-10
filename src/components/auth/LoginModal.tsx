import React from "react";
import { UserCheck, Building2, ShieldCheck, X } from "lucide-react";
import { useAuth } from "../../providers/AuthProvider";
import { DEMO_USERS } from "../../data/mockData";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchUserAccount } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#0F172A] p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Login Peran Pengguna (RBAC)</h3>
              <p className="text-xs text-slate-400">Pilih Akun Departemen Tambang</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          {DEMO_USERS.map((user) => {
            const isSelected = currentUser.uid === user.uid;
            return (
              <button
                key={user.uid}
                onClick={() => {
                  switchUserAccount(user.uid);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-2xl p-3 text-left transition-all ${
                  isSelected
                    ? "border-2 border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                    : "border border-slate-800 bg-slate-900/80 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 font-bold text-emerald-400 text-xs border border-slate-700">
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{user.fullName}</p>
                    <p className="text-[11px] text-amber-400 font-medium">{user.role.replace("_", " ")}</p>
                    <p className="text-[10px] text-slate-500">{user.department}</p>
                  </div>
                </div>

                {isSelected && (
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    Aktif
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
