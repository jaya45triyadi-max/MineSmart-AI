import React from "react";
import { Building2, PhoneCall, ShieldCheck, Flame, AlertCircle } from "lucide-react";
import { ContractorHSE, EmergencyContact, EmergencyPlan, EnvironmentalIncidentRecord } from "../../../types/hseTypes";

interface HSEContractorEmergencyTabProps {
  contractors: ContractorHSE[];
  emergencyContacts: EmergencyContact[];
  emergencyPlan: EmergencyPlan;
  envIncidents: EnvironmentalIncidentRecord[];
}

export const HSEContractorEmergencyTab: React.FC<HSEContractorEmergencyTabProps> = ({
  contractors,
  emergencyContacts,
  emergencyPlan,
  envIncidents,
}) => {
  return (
    <div className="space-y-6">
      {/* Emergency Management Contacts */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-white text-sm">Kontak Tanggap Darurat (Emergency Response Contacts)</h3>
          </div>
          <span className="text-xs bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded border border-rose-500/20 font-semibold">
            24/7 Hotline Site
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyContacts.map((contact) => (
            <div key={contact.contactId} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-1">
              <div className="font-bold text-white text-xs flex items-center justify-between">
                <span>{contact.name}</span>
                {contact.isPrimary && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded">Primary</span>}
              </div>
              <p className="text-[11px] text-slate-400">{contact.role}</p>
              <div className="text-xs font-bold text-rose-400 mt-2">{contact.phone}</div>
              <div className="text-[10px] text-indigo-300">Radio: {contact.radioFrequency}</div>
            </div>
          ))}
        </div>

        <div className="bg-slate-800/40 p-3 rounded-lg text-xs text-slate-300 flex items-center justify-between border border-slate-700/40">
          <div>
            <span className="font-semibold text-white">Muster Points:</span> {emergencyPlan.assemblyPoints.join(" | ")}
          </div>
          <div>Drill Terakhir: <span className="text-emerald-400 font-medium">{emergencyPlan.lastDrillDate}</span></div>
        </div>
      </div>

      {/* Contractor HSE Performance */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-sm">Kepatuhan & Rating K3 Kontraktor (Contractor HSE)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-700">
              <tr>
                <th className="p-3">Nama Kontraktor</th>
                <th className="p-3">Pekerja Aktif</th>
                <th className="p-3">Incident Rate</th>
                <th className="p-3">Compliance Permit</th>
                <th className="p-3">Compliance Inspeksi</th>
                <th className="p-3">Rating K3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {contractors.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/50">
                  <td className="p-3 font-semibold text-white">{c.companyName}</td>
                  <td className="p-3 text-slate-300">{c.activeWorkerCount} Pekerja</td>
                  <td className="p-3 font-medium text-slate-200">{c.incidentRate}</td>
                  <td className="p-3 text-emerald-400 font-bold">{c.permitCompliancePercent}%</td>
                  <td className="p-3 text-emerald-400 font-bold">{c.inspectionCompliancePercent}%</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        c.safetyRating === "EXCELLENT"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {c.safetyRating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Environmental Incidents */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Flame className="w-4 h-4 text-emerald-400" /> Catatan Insiden Lingkungan (Environmental Control)
        </h3>

        <div className="space-y-2 text-xs">
          {envIncidents.map((env) => (
            <div key={env.id} className="bg-slate-800/50 p-3 rounded-lg flex items-center justify-between border border-slate-700/50">
              <div>
                <span className="font-bold text-white">[{env.category}] {env.substanceName}</span>
                <p className="text-slate-400 text-[11px]">{env.description} ({env.locationName})</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                {env.containmentStatus}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
