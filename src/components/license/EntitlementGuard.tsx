import React from "react";
import { useLicense } from "../../providers/LicenseProvider";
import { NavigationModuleKey } from "../../types";
import { Lock, Sparkles, ArrowRight, ShieldAlert } from "lucide-react";

interface EntitlementGuardProps {
  moduleKey: NavigationModuleKey;
  children: React.ReactNode;
  onUpgradeClick?: () => void;
}

export const EntitlementGuard: React.FC<EntitlementGuardProps> = ({
  moduleKey,
  children,
  onUpgradeClick,
}) => {
  const { checkEntitlement, currentLicense } = useLicense();

  const isAllowed = checkEntitlement(moduleKey);

  if (!isAllowed) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-8 backdrop-blur-md text-center max-w-2xl mx-auto my-12 space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
          <Lock className="h-7 w-7" />
        </div>

        <div>
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-[10px] font-extrabold text-amber-400 border border-amber-500/30 uppercase tracking-widest">
            PAKET {currentLicense.planId} • MODUL TERKUNCI
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-3 tracking-tight">
            Fitur Modul <span className="text-amber-400 capitalize">{moduleKey.replace("-", " ")}</span> Memerlukan Upgrade Paket
          </h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Modul ini tidak disertakan dalam paket lisensi <span className="font-bold text-white">{currentLicense.planId}</span> Perusahaan Anda. Upgrade ke paket Professional atau Enterprise untuk mengaktifkan seluruh kemampuan analisis spasial, dispatch FMS, dan kecerdasan buatan MINE SMART AI.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-left">
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Paket Anda Saat Ini</span>
            <p className="font-bold text-white text-sm">{currentLicense.planId}</p>
            <p className="text-[11px] text-slate-400">Batasan: Fitur modul & AI dasar</p>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-4 border border-amber-500/30 space-y-2">
            <span className="text-[10px] text-amber-400 font-bold uppercase">Rekomendasi Paket</span>
            <p className="font-bold text-amber-300 text-sm">PROFESSIONAL / ENTERPRISE</p>
            <p className="text-[11px] text-amber-200/80">Termasuk: GIS Spasial, FMS Dispatch & Full AI</p>
          </div>
        </div>

        <button
          onClick={
            onUpgradeClick ||
            (() => {
              if ((window as any).__NAVIGATE_MODULE__) {
                (window as any).__NAVIGATE_MODULE__("license");
              }
            })
          }
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 px-6 py-3 text-xs font-bold text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span>Upgrade Paket Lisensi Sekarang</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
