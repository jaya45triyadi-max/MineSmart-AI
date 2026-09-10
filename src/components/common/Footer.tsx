import React from "react";
import { Pickaxe, ShieldCheck } from "lucide-react";
import { useLanguage } from "../../providers/LanguageProvider";

export const Footer: React.FC = () => {
  const { t, currentLanguageMeta } = useLanguage();

  return (
    <footer className="border-t border-slate-800 bg-[#070E20] py-4 px-6 text-xs text-slate-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Pickaxe className="h-4 w-4 text-emerald-400" />
          <span className="font-bold text-white">MINE SMART AI {t("common.version", "v1.0 Enterprise")}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">
            {t("common.appTagline", "Smart AI Platform for Modern Coal Mining")}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t("footer.isoCompliant", "ISO 27001 Security Ready")}
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="flex items-center gap-1">
            <span>{currentLanguageMeta.flag}</span>
            <span className="font-mono text-[10px] text-slate-300">{currentLanguageMeta.nativeName}</span>
          </span>
          <span className="text-slate-500">|</span>
          <span>© {new Date().getFullYear()} {t("footer.allRights", "MINE SMART AI. All rights reserved.")}</span>
        </div>
      </div>
    </footer>
  );
};
