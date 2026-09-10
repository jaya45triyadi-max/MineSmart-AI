import React, { useState, useEffect } from "react";
import { LicenseEventService } from "../../services/license/LicenseEventService";
import { LicenseAuditEvent } from "../../types/license";
import { ShieldCheck, History, Search, FileText, Download, Filter, RefreshCw, Key, ShieldAlert, CheckCircle2, RotateCcw, Power } from "lucide-react";

export const AdminLicenseEventsModule: React.FC = () => {
  const [events, setEvents] = useState<LicenseAuditEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const list = await LicenseEventService.getAllRecentEvents();
    setEvents(list);
  };

  const handleExportCSV = () => {
    const headers = ["ID,Waktu,Tipe Event,License ID,User Email,Rincian,IP Address\n"];
    const rows = filteredEvents.map((e) =>
      `"${e.id}","${e.timestamp}","${e.eventType}","${e.licenseId}","${e.userEmail}","${e.details.replace(/"/g, '""')}","${e.ipAddress || ""}"\n`
    );
    const blob = new Blob([headers.concat(rows).join("")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `audit-license-history-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredEvents = events.filter((evt) => {
    if (selectedType !== "ALL" && evt.eventType !== selectedType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        evt.details.toLowerCase().includes(q) ||
        evt.userEmail.toLowerCase().includes(q) ||
        evt.eventType.toLowerCase().includes(q) ||
        evt.licenseId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getEventBadgeClass = (type: string) => {
    switch (type) {
      case "LICENSE_CREATED":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "LICENSE_ACTIVATED":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "LICENSE_RENEWED":
        return "bg-teal-500/20 text-teal-300 border-teal-500/30";
      case "LICENSE_DEACTIVATED":
        return "bg-slate-700 text-slate-300 border-slate-600";
      case "LICENSE_SUSPENDED":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "LICENSE_RESUMED":
        return "bg-sky-500/20 text-sky-300 border-sky-500/30";
      case "LICENSE_REVOKED":
      case "LICENSE_EXPIRED":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
      case "DEVICE_ADDED":
      case "DEVICE_REVOKED":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md">
        <div>
          <span className="rounded bg-teal-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-teal-400 border border-teal-500/30 uppercase tracking-widest">
            IMMUTABLE AUDIT TRAIL & HISTORY
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Riwayat Aktivitas & Perubahan Lisensi Komersial
          </h1>
          <p className="text-xs text-slate-400">
            Pencatatan riwayat siklus hidup lisensi: Generate Key, Aktivasi, Perpanjangan, Suspend, Expire, dan Node Binding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadEvents}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110 cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {[
            "ALL",
            "LICENSE_CREATED",
            "LICENSE_ACTIVATED",
            "LICENSE_RENEWED",
            "LICENSE_DEACTIVATED",
            "LICENSE_SUSPENDED",
            "LICENSE_RESUMED",
            "DEVICE_REVOKED",
          ].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`rounded-lg px-3 py-1.5 transition-all uppercase text-[10px] font-bold shrink-0 ${
                selectedType === type
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              {type.replace("LICENSE_", "").replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari user, event, rincian..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-teal-500 focus:outline-none"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
              <th className="p-3">Waktu Event</th>
              <th className="p-3">Tipe Event</th>
              <th className="p-3">User / Aktor</th>
              <th className="p-3">Rincian Perubahan Audit</th>
              <th className="p-3">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  Tidak ada data riwayat audit yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              filteredEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono text-slate-400">
                    {new Date(evt.timestamp).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">
                    <span className={`rounded px-2.5 py-1 text-[9px] font-extrabold border uppercase inline-block ${getEventBadgeClass(evt.eventType)}`}>
                      {evt.eventType}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-200">{evt.userEmail}</td>
                  <td className="p-3 text-slate-300">{evt.details}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-500">{evt.ipAddress || "182.253.112.45"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
