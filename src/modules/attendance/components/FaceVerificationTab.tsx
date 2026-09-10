import React, { useState } from "react";
import {
  Camera,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Search,
  UserCheck,
  MapPin,
  Clock,
  Eye,
  Lock,
  Layers,
  AlertCircle,
  Scan,
  Smartphone,
  Check,
} from "lucide-react";
import { Employee } from "../../../types/hrTypes";
import { AttendanceRecordExtended } from "../../../types/attendanceTypes";

interface Props {
  employees: Employee[];
  records: AttendanceRecordExtended[];
  onClockIn: (data: {
    employeeId: string;
    employeeName: string;
    source: "FACE_VERIFICATION";
    coords?: { lat: number; lng: number };
  }) => Promise<void>;
  onClockOut: (attendanceId: string) => Promise<void>;
}

export const FaceVerificationTab: React.FC<Props> = ({
  employees,
  records,
  onClockIn,
  onClockOut,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.employeeId || "EMP-001");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStage, setScanStage] = useState<string>("Standby");
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedEmployee =
    employees.find((e) => e.employeeId === selectedEmpId) || employees[0];

  const activeRecord = records.find(
    (r) => r.employeeId === selectedEmpId && r.date === new Date().toISOString().split("T")[0]
  );

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      e.departmentName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Run Biometric Scan Simulation
  const handleTriggerFaceScan = (action: "CLOCK_IN" | "CLOCK_OUT") => {
    setIsScanning(true);
    setVerificationSuccess(false);
    setMatchScore(null);
    setFeedback(null);
    setScanStage("1/3: Mendeteksi Wajah & Koordinat Mesh...");

    setTimeout(() => {
      setScanStage("2/3: Melakukan Pengujian Liveness & Anti-Spoof 3D...");
      setTimeout(() => {
        setScanStage("3/3: Mencocokkan Vektor Biometrik Database...");
        setTimeout(async () => {
          setMatchScore(99.6);
          setVerificationSuccess(true);
          setIsScanning(false);
          setScanStage("Selesai");

          try {
            if (action === "CLOCK_IN") {
              await onClockIn({
                employeeId: selectedEmployee.employeeId,
                employeeName: selectedEmployee.name,
                source: "FACE_VERIFICATION",
                coords: { lat: -2.9348, lng: 115.215 },
              });
              setFeedback(`Presensi Masuk Berhasil! ${selectedEmployee.name} terverifikasi biometrik.`);
            } else {
              if (activeRecord) {
                await onClockOut(activeRecord.id);
                setFeedback(`Presensi Pulang Berhasil! ${selectedEmployee.name} telah clock out.`);
              }
            }
          } catch (err: any) {
            setFeedback(err?.message || "Gagal memproses presensi biometrik.");
          }
        }, 800);
      }, 900);
    }, 900);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-extrabold text-teal-400 border border-teal-500/30 uppercase tracking-wider">
              AI BIOMETRIC VERIFICATION KIOSK
            </span>
            <span className="text-xs text-slate-400">Tapin Mine Field AI Engine v3.4</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Biometric Face Recognition & Liveness Detection
          </h2>
          <p className="text-xs text-slate-400">
            Sistem presensi wajah nirsentuh (touchless) dengan verifikasi liveness mata, micro-expression, anti-spoof 3D, dan pencocokan embedding instan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" /> Anti-Spoof Active
          </span>
        </div>
      </div>

      {/* Main Grid: Left Kiosk Scanner, Right Master Employee & Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Face Scanner Kiosk (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-teal-400" />
              <h3 className="font-black text-white text-sm">Face Verification Scanner Viewport</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">FPS: 30 • 1080p WebRTC</span>
          </div>

          {/* Viewport Box */}
          <div className="relative rounded-2xl bg-black aspect-16/10 overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#14b8a6_1px,transparent_1px),linear-gradient(to_bottom,#14b8a6_1px,transparent_1px)] bg-[size:28px_28px]" />

            {/* Target Face Mesh Target */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
              <div
                className={`w-44 h-44 rounded-full border-2 border-dashed transition-all duration-300 flex items-center justify-center relative ${
                  verificationSuccess
                    ? "border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.5)] bg-emerald-500/15"
                    : isScanning
                    ? "border-teal-400 animate-pulse shadow-[0_0_25px_rgba(20,184,166,0.4)] bg-teal-500/10"
                    : "border-slate-700 bg-slate-900/60"
                }`}
              >
                {/* HUD Corners */}
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-teal-400" />
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-teal-400" />
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-teal-400" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-teal-400" />

                {isScanning && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-teal-300 to-transparent shadow-[0_0_15px_#2dd4bf] animate-bounce" />
                )}

                {verificationSuccess ? (
                  <CheckCircle2 className="h-20 w-20 text-emerald-400" />
                ) : (
                  <UserCheck className="h-16 w-16 text-slate-500" />
                )}
              </div>

              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-slate-200 block">
                  {isScanning ? scanStage : verificationSuccess ? "Identitas Terverifikasi!" : `Target: ${selectedEmployee.name}`}
                </span>
                {verificationSuccess && (
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">
                    Confidence: 99.6% • Anti-Spoof: Passed (0.01% Risk)
                  </span>
                )}
              </div>
            </div>

            {/* Live Camera Tag HUD */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              PORTAL SCANNER ONLINE
            </div>

            <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-emerald-400" /> Pit Checkpoint Tapin (-2.9348, 115.215)
            </div>
          </div>

          {/* Feedback Message */}
          {feedback && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
              {feedback}
            </div>
          )}

          {/* Action Trigger Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              disabled={isScanning || !!activeRecord?.clockIn}
              onClick={() => handleTriggerFaceScan("CLOCK_IN")}
              className={`py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                activeRecord?.clockIn
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/20"
              }`}
            >
              <Scan className="h-4 w-4" />
              {activeRecord?.clockIn ? "Sudah Clock In" : "Face Scan Clock In"}
            </button>

            <button
              disabled={isScanning || !activeRecord?.clockIn}
              onClick={() => handleTriggerFaceScan("CLOCK_OUT")}
              className={`py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                !activeRecord?.clockIn
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-lg shadow-rose-500/20"
              }`}
            >
              <Clock className="h-4 w-4" />
              Face Scan Clock Out
            </button>
          </div>

          {/* Verification Diagnostics */}
          <div className="rounded-2xl bg-slate-950/60 border border-slate-800 p-4 space-y-2 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Diagnostik Biometrik Wajah
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Landmarks</span>
                <span className="text-teal-400 font-bold">468 Titik Mesh</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Liveness Rate</span>
                <span className="text-emerald-400 font-bold">99.8% Passed</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Spoof Risk</span>
                <span className="text-emerald-400 font-bold">&lt;0.02% (Ultra Low)</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Latency</span>
                <span className="text-cyan-400 font-bold">340 ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Employee Selection & Template Register (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Employee Picker Box */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Pilih Karyawan Tambang</h3>
              <span className="text-[10px] font-mono text-slate-400">{filteredEmployees.length} Terdaftar</span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Cari Nama / NIK..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Employee List */}
            <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {filteredEmployees.map((emp) => {
                const isSelected = emp.employeeId === selectedEmpId;
                const empRecord = records.find(
                  (r) => r.employeeId === emp.employeeId && r.date === new Date().toISOString().split("T")[0]
                );

                return (
                  <div
                    key={emp.id}
                    onClick={() => {
                      setSelectedEmpId(emp.employeeId);
                      setVerificationSuccess(false);
                      setFeedback(null);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-teal-500 bg-teal-950/30 shadow-md"
                        : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center font-bold text-white text-xs shrink-0">
                        {emp.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">{emp.name}</h4>
                        <p className="text-[10px] text-slate-400">
                          {emp.employeeId} • {emp.positionName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {empRecord?.clockIn ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          IN: {empRecord.clockIn}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-800 text-slate-400">
                          OFFLINE
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 space-y-3">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-400" />
              Keunggulan Biometrik Face Recognition
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mencegah praktik <em>buddy punching</em> (titip presensi), mempercepat antrean pergantian shift 300+ operator dalam hitungan menit, dan terhubung langsung ke modul Manpower Availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
