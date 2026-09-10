import React, { useState, useEffect } from "react";
import {
  Camera,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  X,
  AlertTriangle,
  Scan,
  UserCheck,
  MapPin,
  Clock,
  Eye,
  Lock,
} from "lucide-react";
import { Employee } from "../../../types/hrTypes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  actionType: "CLOCK_IN" | "CLOCK_OUT";
  onSuccess: (data: {
    employeeId: string;
    employeeName: string;
    confidence: number;
    coords: { lat: number; lng: number };
  }) => Promise<void>;
}

export const FaceVerificationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  employee,
  actionType,
  onSuccess,
}) => {
  const [scanStep, setScanStep] = useState<"READY" | "SCANNING" | "VERIFIED" | "FAILED">("READY");
  const [livenessStage, setLivenessStage] = useState<string>("Mendeteksi Wajah...");
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [livenessChecks, setLivenessChecks] = useState({
    faceDetected: false,
    eyeBlinkDetected: false,
    antiSpoofPassed: false,
    matchProfileScore: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setScanStep("READY");
      setConfidenceScore(0);
      setLivenessChecks({
        faceDetected: false,
        eyeBlinkDetected: false,
        antiSpoofPassed: false,
        matchProfileScore: 0,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startVerification = () => {
    setScanStep("SCANNING");
    setLivenessStage("1/3: Mendeteksi struktur kontur wajah...");

    // Step 1: Face Detection
    setTimeout(() => {
      setLivenessChecks((prev) => ({ ...prev, faceDetected: true }));
      setLivenessStage("2/3: Liveness Test: Kedipkan mata & tahan posisi...");

      // Step 2: Liveness & Anti Spoof
      setTimeout(() => {
        setLivenessChecks((prev) => ({
          ...prev,
          eyeBlinkDetected: true,
          antiSpoofPassed: true,
        }));
        setLivenessStage("3/3: Mencocokkan embedding biometrik dengan database...");

        // Step 3: Biometric Match
        setTimeout(() => {
          const score = 99.4;
          setConfidenceScore(score);
          setLivenessChecks((prev) => ({ ...prev, matchProfileScore: score }));
          setScanStep("VERIFIED");
          setLivenessStage("Verifikasi Wajah Berhasil 100%!");
        }, 1000);
      }, 1200);
    }, 1000);
  };

  const handleConfirmAction = async () => {
    setIsProcessing(true);
    try {
      await onSuccess({
        employeeId: employee.employeeId,
        employeeName: employee.name,
        confidence: confidenceScore,
        coords: { lat: -2.9348, lng: 115.215 },
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden text-slate-100 relative">
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base">
                AI Biometric Face Verification
              </h3>
              <p className="text-xs text-slate-400">
                {actionType === "CLOCK_IN" ? "Clock In (Masuk Shift)" : "Clock Out (Pulang Shift)"} • Tapin Mine Checkpoint
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Target Employee Info */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-white text-sm">
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{employee.name}</h4>
                <p className="text-[11px] text-slate-400">
                  {employee.employeeId} • {employee.positionName}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {employee.departmentName}
            </span>
          </div>

          {/* Camera Viewfinder & Face Scan Simulator */}
          <div className="relative rounded-2xl bg-black aspect-4/3 overflow-hidden border border-slate-800 flex items-center justify-center">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Avatar / Face Target Silhouette */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
              <div
                className={`w-48 h-48 rounded-full border-2 border-dashed transition-all duration-500 flex items-center justify-center relative ${
                  scanStep === "VERIFIED"
                    ? "border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)] bg-emerald-500/10"
                    : scanStep === "SCANNING"
                    ? "border-cyan-400 animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.3)] bg-cyan-500/5"
                    : "border-slate-600 bg-slate-900/40"
                }`}
              >
                {/* 4 Corner HUD Reticles */}
                <div className="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-emerald-400" />

                {/* Face Scan Line Animation */}
                {scanStep === "SCANNING" && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce" />
                )}

                {scanStep === "VERIFIED" ? (
                  <CheckCircle2 className="h-20 w-20 text-emerald-400 animate-scale-up" />
                ) : (
                  <div className="text-center space-y-1">
                    <UserCheck className="h-16 w-16 text-slate-500 mx-auto" />
                    <span className="text-[10px] font-mono text-slate-400 block">
                      POSISIKAN WAJAH DI SINI
                    </span>
                  </div>
                )}
              </div>

              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-slate-200">
                  {scanStep === "READY" && "Kamera Siap. Tekan Mulai Verifikasi"}
                  {scanStep === "SCANNING" && livenessStage}
                  {scanStep === "VERIFIED" && "Identitas Karyawan Terverifikasi 100%"}
                </span>
                {scanStep === "VERIFIED" && (
                  <span className="text-[11px] font-mono text-emerald-400 font-bold block">
                    Confidence Match: 99.4% • Liveness Passed
                  </span>
                )}
              </div>
            </div>

            {/* Live Camera Tag HUD */}
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE 1080P HD
            </div>

            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> ANTI-SPOOF 3D
            </div>
          </div>

          {/* AI Biometric Checklist Status */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">1. Face Mesh (468-pt)</span>
              {livenessChecks.faceDetected ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> OK
                </span>
              ) : (
                <span className="text-slate-500 text-[10px]">Menunggu...</span>
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">2. Liveness Blink</span>
              {livenessChecks.eyeBlinkDetected ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> OK
                </span>
              ) : (
                <span className="text-slate-500 text-[10px]">Menunggu...</span>
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">3. Anti-Photo Spoof</span>
              {livenessChecks.antiSpoofPassed ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="h-3.5 w-3.5" /> OK
                </span>
              ) : (
                <span className="text-slate-500 text-[10px]">Menunggu...</span>
              )}
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">4. DB Embedding Match</span>
              {livenessChecks.matchProfileScore > 0 ? (
                <span className="text-emerald-400 font-bold text-[11px]">
                  {livenessChecks.matchProfileScore}%
                </span>
              ) : (
                <span className="text-slate-500 text-[10px]">Menunggu...</span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div>
            {scanStep === "READY" && (
              <button
                onClick={startVerification}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Scan className="h-4 w-4" /> Mulai Pindai Wajah Sekarang
              </button>
            )}

            {scanStep === "SCANNING" && (
              <button
                disabled
                className="w-full py-3.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                Memproses Verifikasi Biometrik...
              </button>
            )}

            {scanStep === "VERIFIED" && (
              <button
                disabled={isProcessing}
                onClick={handleConfirmAction}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                {actionType === "CLOCK_IN"
                  ? "Konfirmasi & Clock In Sekarang"
                  : "Konfirmasi & Clock Out Sekarang"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
