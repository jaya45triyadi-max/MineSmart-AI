import React, { useState, useEffect } from "react";
import {
  QrCode,
  RefreshCw,
  Clock,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Copy,
  Check,
  Sliders,
  AlertTriangle,
} from "lucide-react";
import { DynamicQRCode } from "../../../types/attendanceTypes";
import { attendanceRepository } from "../../../services/repositories/AttendanceRepository";

export const QRAttendanceTab: React.FC = () => {
  const [intervalSecs, setIntervalSecs] = useState<number>(60);
  const [siteId, setSiteId] = useState("SITE-TAPIN");
  const [shiftId, setShiftId] = useState("shift-1");
  const [dynamicQR, setDynamicQR] = useState<DynamicQRCode | null>(null);
  const [countdown, setCountdown] = useState<number>(60);
  const [copied, setCopied] = useState(false);

  // Security Test State
  const [scanInputToken, setScanInputToken] = useState("");
  const [scanResult, setScanResult] = useState<{
    status: "SUCCESS" | "EXPIRED" | "INVALID" | "REPLAY";
    message: string;
  } | null>(null);

  // Auto-refresh dynamic QR logic
  useEffect(() => {
    const qr = attendanceRepository.generateDynamicQR(siteId, shiftId, intervalSecs);
    setDynamicQR(qr);
    setCountdown(intervalSecs);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const nextQR = attendanceRepository.generateDynamicQR(siteId, shiftId, intervalSecs);
          setDynamicQR(nextQR);
          return intervalSecs;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [siteId, shiftId, intervalSecs]);

  const handleManualRefresh = () => {
    const qr = attendanceRepository.generateDynamicQR(siteId, shiftId, intervalSecs);
    setDynamicQR(qr);
    setCountdown(intervalSecs);
  };

  const handleCopyQRString = () => {
    if (dynamicQR) {
      navigator.clipboard.writeText(dynamicQR.qrToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTestScan = () => {
    if (!scanInputToken) return;
    if (dynamicQR && scanInputToken === dynamicQR.qrToken) {
      setScanResult({
        status: "SUCCESS",
        message: `VALID QR TOKEN! Presensi terverifikasi untuk ${dynamicQR.siteName} (${dynamicQR.shiftName}).`,
      });
    } else if (scanInputToken.includes("EXPIRED")) {
      setScanResult({
        status: "EXPIRED",
        message: "EXPIRED QR TOKEN! Token barcode sudah kedaluwarsa (> 60 detik). Minta QR baru.",
      });
    } else {
      setScanResult({
        status: "INVALID",
        message: "INVALID / REPLAY DETECTED! Token QR tidak terdaftar atau merupakan duplikat pemindaian.",
      });
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-extrabold text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
            SECURE DYNAMIC QR SYSTEM
          </span>
          <h2 className="text-xl font-black text-white mt-1">Generator & Verifikasi Barcode Presensi Dynamic QR</h2>
          <p className="text-xs text-slate-400">
            Mencegah pemalsuan/penitipan presensi dengan enkripsi token bertanda tangan digital dan auto-refresh interval.
          </p>
        </div>

        {/* Interval Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-2 rounded-xl">
          <Sliders className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-300">Interval Refresh:</span>
          <select
            value={intervalSecs}
            onChange={(e) => setIntervalSecs(Number(e.target.value))}
            className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value={30}>30 Detik</option>
            <option value={60}>60 Detik (Standard)</option>
            <option value={300}>5 Menit (Custom)</option>
          </select>
        </div>
      </div>

      {/* Main Content Grid: Display Monitor & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic QR Checkpoint Screen Simulator */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-6 flex flex-col items-center text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 text-left">
            <div>
              <h3 className="text-sm font-extrabold text-white">Monitor Checkpoint Tapin Coal Field</h3>
              <p className="text-[11px] text-slate-400">Gate Main Pit & Office Gate 1</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" /> LIVE
            </span>
          </div>

          {/* QR Box Visual */}
          <div className="relative p-6 rounded-2xl bg-white border-4 border-cyan-500 shadow-2xl shadow-cyan-500/20 space-y-2">
            <QrCode className="h-48 w-48 text-slate-950" />
            <div className="absolute top-2 right-2 bg-slate-950 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded font-extrabold">
              {countdown}s
            </div>
          </div>

          {/* Countdown & Refresh control */}
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
              <span>Token Kedaluwarsa Dalam:</span>
              <span className="text-cyan-400 font-mono text-sm">{countdown} Detik</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-1000"
                style={{ width: `${(countdown / intervalSecs) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleManualRefresh}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
            <span>Generate Token Baru Sekarang</span>
          </button>
        </div>

        {/* Security Payload & Inspector */}
        <div className="space-y-6">
          {/* Dynamic Token Details Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Struktur Enkripsi Token QR</span>
            </h3>

            {dynamicQR && (
              <div className="space-y-3 text-xs font-mono">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-sans font-bold">QR Token ID</span>
                  <div className="flex items-center justify-between text-cyan-300 font-bold">
                    <span className="truncate">{dynamicQR.qrToken}</span>
                    <button onClick={handleCopyQRString} className="p-1 text-slate-400 hover:text-white">
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <span className="text-[10px] text-slate-500 font-sans font-bold">Site & Shift</span>
                    <p className="text-slate-200 font-sans font-bold">{dynamicQR.siteId}</p>
                    <p className="text-[10px] text-slate-400 font-sans">{dynamicQR.shiftName}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <span className="text-[10px] text-slate-500 font-sans font-bold">Digital Signature</span>
                    <p className="text-emerald-400 font-bold truncate">{dynamicQR.signature}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Test Scanner & Replay Security Detector */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span>Simulasi Uji Pemindaian & Deteksi Fraud</span>
            </h3>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scanInputToken}
                  onChange={(e) => setScanInputToken(e.target.value)}
                  placeholder="Tempelkan QR Token untuk diuji..."
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  onClick={() => setScanInputToken(dynamicQR?.qrToken || "")}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Isi Active Token
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleTestScan}
                  className="flex-1 rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all"
                >
                  Uji Verifikasi Token
                </button>
                <button
                  onClick={() => {
                    setScanInputToken("QR-EXPIRED-TOKEN-TEST");
                    handleTestScan();
                  }}
                  className="rounded-xl border border-amber-500/40 bg-amber-950/40 px-3 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-900/60"
                >
                  Simulasi Expired
                </button>
              </div>

              {scanResult && (
                <div
                  className={`rounded-xl border p-3 text-xs font-bold ${
                    scanResult.status === "SUCCESS"
                      ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-300"
                      : "border-rose-500/40 bg-rose-950/40 text-rose-300"
                  }`}
                >
                  {scanResult.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
