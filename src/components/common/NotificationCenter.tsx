import React, { useState, useEffect } from "react";
import { Drawer } from "../ui/Drawer";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle2,
  Bell,
  Check,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Mail,
  MessageSquare,
  Send,
  Zap,
} from "lucide-react";
import { SmartAlertItem, SmartAlertSeverity, NotificationChannel } from "../../types/smartAlertTypes";
import { SmartAlertEngineService } from "../../services/ai/alerts/SmartAlertEngineService";

export interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAlerts?: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNavigateToAlerts,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [activeChannel, setActiveChannel] = useState<string>("ALL");
  const [alerts, setAlerts] = useState<SmartAlertItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setAlerts(SmartAlertEngineService.getAlerts());
    }
  }, [isOpen]);

  const markAllRead = () => {
    const updated = alerts.map((a) => ({
      ...a,
      status: "ACKNOWLEDGED" as const,
      acknowledgedAt: "Baru saja",
    }));
    SmartAlertEngineService.saveAlerts(updated);
    setAlerts(updated);
  };

  const handleTriggerExample = () => {
    SmartAlertEngineService.triggerPit02ShortfallAlert();
    setAlerts(SmartAlertEngineService.getAlerts());
  };

  const filtered = alerts.filter((n) => {
    if (activeCategory === "CRITICAL" && n.severity !== "CRITICAL") return false;
    if (activeCategory === "WARNING" && n.severity !== "WARNING") return false;
    if (activeCategory === "ATTENTION" && n.severity !== "ATTENTION") return false;
    if (activeCategory === "NORMAL" && n.severity !== "NORMAL") return false;
    if (activeChannel !== "ALL" && !n.channels.includes(activeChannel as NotificationChannel)) return false;
    return true;
  });

  const getSeverityPill = (sev: SmartAlertSeverity) => {
    switch (sev) {
      case "CRITICAL":
        return {
          icon: AlertOctagon,
          badgeText: "🔴 Critical",
          badgeClass: "bg-rose-500/20 text-rose-300 border border-rose-500/40",
          cardBorder: "border-l-4 border-l-rose-500",
        };
      case "WARNING":
        return {
          icon: AlertTriangle,
          badgeText: "🟠 Warning",
          badgeClass: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
          cardBorder: "border-l-4 border-l-amber-500",
        };
      case "ATTENTION":
        return {
          icon: Info,
          badgeText: "🟡 Attention",
          badgeClass: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40",
          cardBorder: "border-l-4 border-l-yellow-400",
        };
      case "NORMAL":
      default:
        return {
          icon: CheckCircle2,
          badgeText: "🟢 Normal",
          badgeClass: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
          cardBorder: "border-l-4 border-l-emerald-500",
        };
    }
  };

  const getChannelIcon = (ch: NotificationChannel) => {
    switch (ch) {
      case "IN_APP":
        return <Bell className="h-3 w-3 text-purple-400" />;
      case "PUSH":
        return <Smartphone className="h-3 w-3 text-blue-400" />;
      case "EMAIL":
        return <Mail className="h-3 w-3 text-amber-400" />;
      case "WHATSAPP":
        return <MessageSquare className="h-3 w-3 text-emerald-400" />;
      case "TELEGRAM":
        return <Send className="h-3 w-3 text-cyan-400" />;
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-rose-400" />
          <span className="font-bold text-sm">Notification Center & Smart Alerts</span>
        </div>
      }
      size="md"
    >
      <div className="space-y-4">
        {/* Banner with Direct Link to Smart Alert Hub */}
        <div className="p-3.5 bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-950 border border-purple-500/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-xs text-white font-extrabold block">
                Pusat Notifikasi Multi-Channel
              </span>
              <span className="text-[10px] text-slate-400">
                In-App • Push • Email • WhatsApp • Telegram
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              if (onNavigateToAlerts) {
                onNavigateToAlerts();
              } else if ((window as any).__NAVIGATE_MODULE__) {
                (window as any).__NAVIGATE_MODULE__("smart-alerts");
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shrink-0 self-start sm:self-auto shadow-md"
          >
            <span>Buka Notification Hub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 🚨 Quick Trigger Critical Example */}
        <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/40 flex items-center justify-between gap-2 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-rose-400 uppercase">Featured Example</span>
            <p className="font-bold text-white text-[11px] truncate max-w-[220px]">
              Produksi Pit 02 diprediksi gagal target
            </p>
          </div>
          <button
            onClick={handleTriggerExample}
            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black flex items-center gap-1 shrink-0"
          >
            <Zap className="h-3 w-3" />
            <span>Test Broadcast</span>
          </button>
        </div>

        {/* Severity Tabs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-800 pb-2">
          {[
            { id: "ALL", label: "Semua" },
            { id: "CRITICAL", label: "🔴 Critical" },
            { id: "WARNING", label: "🟠 Warning" },
            { id: "ATTENTION", label: "🟡 Attention" },
            { id: "NORMAL", label: "🟢 Normal" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-lg px-2 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Channel Filter Chips */}
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[10px] font-bold text-slate-500 mr-1">Channel:</span>
          {[
            { id: "ALL", label: "Semua" },
            { id: "IN_APP", label: "In-App" },
            { id: "PUSH", label: "Push" },
            { id: "EMAIL", label: "Email" },
            { id: "WHATSAPP", label: "WhatsApp" },
            { id: "TELEGRAM", label: "Telegram" },
          ].map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                activeChannel === ch.id
                  ? "bg-slate-200 text-slate-950"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-850"
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>
            {alerts.filter((n) => n.status === "ACTIVE").length} alert aktif perlu tindakan
          </span>
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 font-semibold text-purple-400 hover:underline cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" /> Acknowledge Semua
          </button>
        </div>

        {/* Notification List */}
        <div className="space-y-2.5 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-400">
              Tidak ada notifikasi dalam filter ini.
            </p>
          ) : (
            filtered.map((item) => {
              const sev = getSeverityPill(item.severity);

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-3.5 transition-all space-y-2.5 ${
                    item.status === "RESOLVED"
                      ? "border-slate-800 bg-slate-900/30 opacity-70"
                      : `bg-slate-900/90 border-slate-800 ${sev.cardBorder}`
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sev.badgeClass}`}>
                        {sev.badgeText}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {item.entityId}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{item.timestamp}</span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-100 leading-snug">
                    {item.message}
                  </h5>

                  {/* Channel Badges */}
                  <div className="flex flex-wrap items-center gap-1 text-[10px]">
                    <span className="text-slate-500">Channels:</span>
                    {item.channels.map((ch) => (
                      <span
                        key={ch}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {getChannelIcon(ch)}
                        <span>
                          {ch === "IN_APP"
                            ? "In-App"
                            : ch === "PUSH"
                            ? "Push"
                            : ch === "EMAIL"
                            ? "Email"
                            : ch === "WHATSAPP"
                            ? "WA"
                            : "TG"}
                        </span>
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-300 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                    <strong className="text-amber-400">Tindakan:</strong> {item.suggestedAction}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Drawer>
  );
};
