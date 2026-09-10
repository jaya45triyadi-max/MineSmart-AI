// MINE SMART AI - Document Category Badge Component
import React from "react";
import {
  FileText,
  BookOpen,
  FileSpreadsheet,
  FileCheck2,
  Image,
  Award,
  Receipt,
  ClipboardCheck,
  Briefcase,
} from "lucide-react";
import { DocumentCategory } from "../../../types/documentTypes";

interface DocumentCategoryBadgeProps {
  category: DocumentCategory;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export const DocumentCategoryBadge: React.FC<DocumentCategoryBadgeProps> = ({
  category,
  showIcon = true,
  size = "md",
}) => {
  const getCategoryConfig = (cat: DocumentCategory) => {
    switch (cat) {
      case "SOP":
        return {
          label: "SOP",
          sub: "Standard Operating Procedure",
          icon: BookOpen,
          bg: "bg-blue-500/15 text-blue-400 border-blue-500/30",
          dot: "bg-blue-400",
        };
      case "WORK_INSTRUCTION":
        return {
          label: "Work Instruction",
          sub: "Petunjuk Kerja (WI)",
          icon: FileText,
          bg: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
          dot: "bg-cyan-400",
        };
      case "CONTRACT":
        return {
          label: "Contract",
          sub: "Perjanjian / Kontrak",
          icon: Briefcase,
          bg: "bg-purple-500/15 text-purple-400 border-purple-500/30",
          dot: "bg-purple-400",
        };
      case "PERMIT":
        return {
          label: "Permit",
          sub: "Izin Operasi / Legal",
          icon: FileCheck2,
          bg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          dot: "bg-emerald-400",
        };
      case "DRAWING":
        return {
          label: "Drawing",
          sub: "CAD / Gambar Teknik",
          icon: Image,
          bg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          dot: "bg-amber-400",
        };
      case "REPORT":
        return {
          label: "Report",
          sub: "Laporan Teknis / RKL",
          icon: FileSpreadsheet,
          bg: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
          dot: "bg-indigo-400",
        };
      case "CERTIFICATE":
        return {
          label: "Certificate",
          sub: "Sertifikat / Tera / POP",
          icon: Award,
          bg: "bg-teal-500/15 text-teal-400 border-teal-500/30",
          dot: "bg-teal-400",
        };
      case "INVOICE":
        return {
          label: "Invoice",
          sub: "Faktur Tagihan",
          icon: Receipt,
          bg: "bg-rose-500/15 text-rose-400 border-rose-500/30",
          dot: "bg-rose-400",
        };
      case "INSPECTION":
        return {
          label: "Inspection",
          sub: "Inspeksi K3 / P2H",
          icon: ClipboardCheck,
          bg: "bg-orange-500/15 text-orange-400 border-orange-500/30",
          dot: "bg-orange-400",
        };
      default:
        return {
          label: category,
          sub: "Dokumen",
          icon: FileText,
          bg: "bg-slate-800 text-slate-300 border-slate-700",
          dot: "bg-slate-400",
        };
    }
  };

  const config = getCategoryConfig(category);
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-lg border tracking-wide uppercase ${config.bg} ${sizeClasses[size]}`}
    >
      {showIcon && <IconComponent className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />}
      <span>{config.label}</span>
    </span>
  );
};
