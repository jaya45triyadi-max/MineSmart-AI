import React from "react";
import { useLicense } from "../../providers/LicenseProvider";
import { ShieldCheck, AlertTriangle, ShieldAlert, Sparkles, Clock } from "lucide-react";

interface LicenseBadgeProps {
  onClick?: () => void;
}

export const LicenseBadge: React.FC<LicenseBadgeProps> = ({ onClick }) => {
  const { currentLicense, calculatedStatus, daysRemaining, isGracePeriod, isExpired } = useLicense();

  let badgeColor = "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  let icon = <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />;
  let label = `${currentLicense.planId} • ACTIVE`;

  if (calculatedStatus === "EXPIRING") {
    badgeColor = "border-amber-500/40 bg-amber-500/15 text-amber-300 animate-pulse";
    icon = <Clock className="h-3.5 w-3.5 text-amber-400" />;
    label = `${currentLicense.planId} • ${daysRemaining} HARI LAGI`;
  } else if (isGracePeriod) {
    badgeColor = "border-orange-500/50 bg-orange-500/20 text-orange-300 animate-bounce";
    icon = <AlertTriangle className="h-3.5 w-3.5 text-orange-400" />;
    label = `GRACE PERIOD • ${daysRemaining} HARI`;
  } else if (isExpired) {
    badgeColor = "border-red-500/50 bg-red-500/20 text-red-400";
    icon = <ShieldAlert className="h-3.5 w-3.5 text-red-400" />;
    label = `EXPIRED`;
  } else if (calculatedStatus === "TRIAL") {
    badgeColor = "border-teal-500/40 bg-teal-500/15 text-teal-300";
    icon = <Sparkles className="h-3.5 w-3.5 text-teal-400" />;
    label = `TRIAL • ${daysRemaining} HARI`;
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all hover:brightness-110 ${badgeColor}`}
      title="Status Lisensi Komersial"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
