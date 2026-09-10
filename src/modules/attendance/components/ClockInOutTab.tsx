import React, { useState } from "react";
import {
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Smartphone,
  Wifi,
  WifiOff,
  Coffee,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  User,
  Building,
  Camera,
  Scan,
} from "lucide-react";
import { AttendanceRecordExtended, GPSLocation } from "../../../types/attendanceTypes";
import { Employee } from "../../../types/hrTypes";
import { FaceVerificationModal } from "./FaceVerificationModal";

interface Props {
  currentEmployee?: Employee | null;
  activeRecord?: AttendanceRecordExtended | null;
  onClockIn: (data: {
    employeeId: string;
    employeeName: string;
    source: "QR_DYNAMIC" | "GPS" | "FACE_VERIFICATION";
    coords?: { lat: number; lng: number };
    qrToken?: string;
  }) => Promise<void>;
  onClockOut: (attendanceId: string) => Promise<void>;
  onStartBreak?: () => void;
  onEndBreak?: () => void;
}

export const ClockInOutTab: React.FC<Props> = ({
  currentEmployee,
  activeRecord,
  onClockIn,
  onClockOut,
  onStartBreak,
  onEndBreak,
}) => {
  const [isOffline, setIsOffline] = useState(false);
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [isFaceModalOpen, setIsFaceModalOpen] = useState(false);
  const [faceActionType, setFaceActionType] = useState<"CLOCK_IN" | "CLOCK_OUT">("CLOCK_IN");
  const [qrTokenInput, setQrTokenInput] = useState("QR-DYN-SITE-TAPIN-20260814-991A");
  const [mockGPS, setMockGPS] = useState<{ lat: number; lng: number; isWithin: boolean }>({
    lat: -2.9348,
    lng: 115.215,
    isWithin: true,
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const employeeName = currentEmployee?.name || "Budi Santoso";
  const employeeId = currentEmployee?.employeeId || "EMP-001";
  const departmentName = currentEmployee?.departmentName || "Mining & Operation";

  // Fallback employee object for modal
  const defaultEmp: Employee = currentEmployee || {
    id: "emp-001",
    employeeId: "EMP-001",
    name: "Budi Santoso",
    employeeNumber: "NIK-2021-001",
    departmentId: "DEPT-MIN",
    departmentName: "Mining & Pit Operations",
    positionId: "POS-001",
    positionName: "Mine Superintendent",
    gradeLevel: "Superintendent",
    email: "budi.santoso@miningcoal.com",
    phone: "+62 811 2345 6789",
    status: "ACTIVE",
    joinDate: "2021-03-01",
    siteId: "SITE-TAPIN",
  };

  // Handle Clock In
  const handleExecuteClockIn = async (source: "QR_DYNAMIC" | "GPS" | "FACE_VERIFICATION") => {
    setActionLoading(true);
    setFeedbackMessage(null);
    try {
      await onClockIn({
        employeeId,
        employeeName,
        source,
        coords: { lat: mockGPS.lat, lng: mockGPS.lng },
        qrToken: source === "QR_DYNAMIC" ? qrTokenInput : undefined,
      });
      setFeedbackMessage(`Presensi Masuk Berhasil Diolah via ${source}!`);
      setIsScanningQR(false);
    } catch (err: any) {
      setFeedbackMessage(err?.message || "Gagal melakukan presensi masuk.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Face Clock In Success
  const handleFaceSuccess = async (data: {
    employeeId: string;
    employeeName: string;
    confidence: number;
    coords: { lat: number; lng: number };
  }) => {
    if (faceActionType === "CLOCK_IN") {
      await handleExecuteClockIn("FACE_VERIFICATION");
    } else {
      if (activeRecord) {
        await onClockOut(activeRecord.id);
        setFeedbackMessage("Presensi Pulang Berhasil Diolah via Face Verification!");
      }
    }
  };

  // Handle Clock Out
  const handleExecuteClockOut = async () => {
    if (!activeRecord) return;
    setActionLoading(true);
    setFeedbackMessage(null);
    try {
      await onClockOut(activeRecord.id);
      setFeedbackMessage("Presensi Pulang Berhasil Diolah!");
    } catch (err: any) {
      setFeedbackMessage(err?.message || "Gagal melakukan presensi pulang.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-100">
      {/* Network & Offline Mode Simulator Header */}
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {isOffline ? (
            <>
              <WifiOff className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400">Mode Offline Aktif</span>
              <span className="text-[10px] text-slate-400 font-mono">(Antrean Lokal Presensi Disimpan)</span>
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400">Online & Synchronized</span>
              <span className="text-[10px] text-slate-400 font-mono">(Server Tapin Site Ready)</span>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOffline(!isOffline)}
          className="text-xs font-semibold text-slate-400 hover:text-white underline cursor-pointer"
        >
          {isOffline ? "Simulasikan Online" : "Simulasikan Offline Mode"}
        </button>
      </div>

      {/* Main Employee Attendance Card - Native Responsive Mobile Design */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-emerald-500/50 rounded-full blur-md" />

        {/* Greeting & Employee Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Selamat Pagi, {employeeName}
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Mining Mobile Clocking Portal</h1>
            <p className="text-xs text-slate-400">
              NIK: <strong className="text-slate-200">{employeeId}</strong> • {departmentName}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-3">
            <div className="text-right space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Status Hari Ini</span>
              <div className="text-sm font-black text-emerald-400">
                {activeRecord?.clockIn ? `CLOCKED IN (${activeRecord.clockIn} WITA)` : "NOT CLOCKED IN"}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Shift & Geofence Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jadwal Shift Hari Ini</span>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Shift 1 - Day Shift</h3>
                <p className="text-xs text-slate-400 font-mono">07:00 - 19:00 WITA (Grace Period: 15 Mnt)</p>
              </div>
              <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                SCHEDULED
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Lokasi GPS & Geofence</span>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <MapPin className="h-4 w-4" />
                  <span>Main Pit Checkpoint A (Tapin)</span>
                </div>
                <p className="text-[11px] font-mono text-slate-400">
                  {mockGPS.lat}, {mockGPS.lng} (Akurasi: ±3.5m)
                </p>
              </div>
              <span
                className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                  mockGPS.isWithin
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}
              >
                {mockGPS.isWithin ? "INSIDE ZONE" : "OUTSIDE ZONE"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="space-y-4 pt-2">
          {feedbackMessage && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3 text-xs font-bold text-emerald-300 text-center animate-fade-in">
              {feedbackMessage}
            </div>
          )}

          {!activeRecord?.clockIn ? (
            /* Primary Clock In Action Options (3 Multi-Mode Verifications) */
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block text-center">
                Pilih Metode Autentikasi Presensi Masuk (Clock In)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Biometric Face Verification */}
                <button
                  disabled={actionLoading}
                  onClick={() => {
                    setFaceActionType("CLOCK_IN");
                    setIsFaceModalOpen(true);
                  }}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 p-4 text-xs font-black text-slate-950 hover:from-teal-400 hover:to-emerald-400 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition cursor-pointer"
                >
                  <Camera className="h-6 w-6 text-slate-950" />
                  <span className="text-center font-black">AI FACE RECOGNITION</span>
                  <span className="text-[9px] text-slate-900 font-bold opacity-80">Biometrik & Liveness</span>
                </button>

                {/* 2. Dynamic QR */}
                <button
                  disabled={actionLoading}
                  onClick={() => setIsScanningQR(true)}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-black text-emerald-300 hover:bg-emerald-900/60 shadow-lg transition cursor-pointer"
                >
                  <QrCode className="h-6 w-6 text-emerald-400" />
                  <span className="text-center font-black">DYNAMIC QR SCAN</span>
                  <span className="text-[9px] text-slate-400">Barcode Checkpoint</span>
                </button>

                {/* 3. GPS Geofence */}
                <button
                  disabled={actionLoading}
                  onClick={() => handleExecuteClockIn("GPS")}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 p-4 text-xs font-black text-slate-200 hover:bg-slate-700 shadow-lg transition cursor-pointer"
                >
                  <MapPin className="h-6 w-6 text-cyan-400" />
                  <span className="text-center font-black">GPS GEOFENCE ZONE</span>
                  <span className="text-[9px] text-slate-400">Radius Pit 200m</span>
                </button>
              </div>
            </div>
          ) : (
            /* Clock Out & Break Controls */
            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-center">
                <span className="text-xs font-bold text-emerald-400 uppercase">Anda Telah Terverifikasi Masuk Kerja</span>
                <p className="text-sm font-black text-white mt-0.5">
                  Clock In Jam: <span className="font-mono text-emerald-300">{activeRecord.clockIn} WITA</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <button
                  onClick={onStartBreak}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700 transition cursor-pointer"
                >
                  <Coffee className="h-4 w-4 text-amber-400" />
                  <span>Break Start</span>
                </button>

                <button
                  onClick={onEndBreak}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700 transition cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Break End</span>
                </button>

                <button
                  onClick={() => {
                    setFaceActionType("CLOCK_OUT");
                    setIsFaceModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 py-3 text-xs font-black text-white hover:from-teal-500 hover:to-emerald-500 shadow-lg shadow-teal-500/20 transition cursor-pointer"
                >
                  <Camera className="h-4 w-4" />
                  <span>FACE CLOCK OUT</span>
                </button>

                <button
                  disabled={actionLoading}
                  onClick={handleExecuteClockOut}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 py-3 text-xs font-black text-white hover:from-rose-400 hover:to-red-500 shadow-lg shadow-rose-500/20 transition cursor-pointer"
                >
                  <Clock className="h-4 w-4" />
                  <span>CLOCK OUT</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* QR Scanner Modal Simulator */}
        {isScanningQR && (
          <div className="rounded-2xl border border-emerald-500/40 bg-slate-950 p-5 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase">Simulasi Pemindaian Barcode / QR Dynamic</h3>
              </div>
              <button
                onClick={() => setIsScanningQR(false)}
                className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                Tutup Scanner
              </button>
            </div>

            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-500/40 rounded-xl bg-emerald-950/10 space-y-3">
              <QrCode className="h-16 w-16 text-emerald-400 animate-pulse" />
              <p className="text-xs text-slate-300 font-medium text-center">
                Arahkan Kamera ke Monitor QR Checkpoint Tambang
              </p>
              <div className="w-full max-w-sm space-y-2">
                <input
                  type="text"
                  value={qrTokenInput}
                  onChange={(e) => setQrTokenInput(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono text-emerald-300 focus:border-emerald-500 focus:outline-none"
                  placeholder="Token Dynamic QR..."
                />
                <button
                  onClick={() => handleExecuteClockIn("QR_DYNAMIC")}
                  className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-black text-slate-950 hover:bg-emerald-400 transition cursor-pointer"
                >
                  Verifikasi QR Token & Clock In
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Face Verification Modal */}
        <FaceVerificationModal
          isOpen={isFaceModalOpen}
          onClose={() => setIsFaceModalOpen(false)}
          employee={defaultEmp}
          actionType={faceActionType}
          onSuccess={handleFaceSuccess}
        />

        {/* Validation Checklist Footer */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 space-y-2 text-xs">
          <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
            Validasi Kebijakan Kehadiran (Clock-In Validation Matrix)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Status Karyawan Aktif</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Valid Roster & Shift</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Bebas Cuti / Mangkir</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Geofence Zone Valid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
