import React, { useState } from "react";
import {
  FileText,
  Search,
  QrCode,
  Barcode,
  Printer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  X,
  ShieldCheck,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { WeighbridgeTicket } from "../../../types/weighbridgeTypes";

interface WeighbridgeTicketsTabProps {
  tickets: WeighbridgeTicket[];
  onVoidTicket: (ticketId: string, reason: string) => void;
  isVerificationModalOpen?: boolean;
  onCloseVerificationModal?: () => void;
}

export const WeighbridgeTicketsTab: React.FC<WeighbridgeTicketsTabProps> = ({
  tickets,
  onVoidTicket,
  isVerificationModalOpen,
  onCloseVerificationModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTicket, setSelectedTicket] = useState<WeighbridgeTicket | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [voidReason, setVoidReason] = useState("");

  // Verification Search State
  const [verifyInput, setVerifyInput] = useState("");
  const [verifiedResult, setVerifiedResult] = useState<WeighbridgeTicket | null | "INVALID">(null);

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.materialType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVerify = () => {
    if (!verifyInput.trim()) return;
    const found = tickets.find(
      (t) =>
        t.ticketNumber.toLowerCase() === verifyInput.trim().toLowerCase() ||
        t.qrCode.toLowerCase() === verifyInput.trim().toLowerCase() ||
        t.barcode === verifyInput.trim()
    );

    if (found) {
      setVerifiedResult(found);
    } else {
      setVerifiedResult("INVALID");
    }
  };

  const handleExecuteVoid = () => {
    if (!selectedTicket || !voidReason.trim()) return;
    onVoidTicket(selectedTicket.ticketId, voidReason);
    setIsVoidModalOpen(false);
    setSelectedTicket(null);
    setVoidReason("");
  };

  return (
    <div className="space-y-6">
      {/* Header & Verification Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-500" />
            Manajemen & Verifikasi Tiket Penimbangan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daftar resmi tiket penimbangan (Weighbridge Tickets) dilengkapi dengan QR Code, Barcode, verifikasi instan, dan audit trail pembatalan.
          </p>
        </div>

        {/* Quick QR Scanner Bar */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-72">
            <QrCode className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-500" />
            <input
              type="text"
              placeholder="Scan QR / Ketik No. Tiket..."
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <button
            onClick={handleVerify}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Verifikasi QR
          </button>
        </div>
      </div>

      {/* Verification Result Banner */}
      {verifiedResult && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            verifiedResult === "INVALID"
              ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
          }`}
        >
          {verifiedResult === "INVALID" ? (
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-rose-500" />
              <div>
                <div className="font-bold text-sm text-rose-400">VERIFICATION FAILED / INVALID TICKET</div>
                <div className="text-xs text-slate-300">Tiket tidak ditemukan atau kode QR palsu / telah dicabut.</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <div className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                  VERIFIED OFFICIAL WEIGHBRIDGE TICKET
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200 font-mono">
                    {verifiedResult.ticketNumber}
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Unit: {verifiedResult.unitNumber} | Material: {verifiedResult.materialType} | Net Weight: {verifiedResult.normalizedValue} Ton
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setVerifiedResult(null)}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Tiket, Truk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Status Tiket:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="VALIDATED">VALIDATED</option>
            <option value="OPEN">OPEN</option>
            <option value="VOID">VOID</option>
          </select>
        </div>
      </div>

      {/* Tickets List Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map((ticket) => (
          <div
            key={ticket.ticketId}
            className="p-5 rounded-2xl bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <div className="font-mono font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-500" />
                  {ticket.ticketNumber}
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    ticket.status === "COMPLETED" || ticket.status === "VALIDATED"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : ticket.status === "VOID"
                      ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">UNIT TRUK</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{ticket.unitNumber} ({ticket.registrationNumber})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">MATERIAL</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{ticket.materialType}</span>
                </div>
              </div>

              {/* Weight Highlights */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">GROSS</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{(ticket.grossWeight / 1000).toFixed(1)} T</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">TARE</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{(ticket.tareWeight / 1000).toFixed(1)} T</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block text-emerald-500 font-bold">NET</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">{ticket.normalizedValue} T</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                <div>Source: {ticket.source}</div>
                <div>Destination: {ticket.destination}</div>
                <div>Operator: {ticket.operatorName} ({ticket.shift})</div>
              </div>
            </div>

            {/* Ticket Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setSelectedTicket(ticket);
                  setIsPrintModalOpen(true);
                }}
                className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Cetak Tiket
              </button>

              {ticket.status !== "VOID" && (
                <button
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setIsVoidModalOpen(true);
                  }}
                  className="px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Void
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Printable Official Ticket Modal */}
      {isPrintModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-500" />
                Pratinjau Cetak Tiket Penimbangan Resmi
              </h3>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Weighbridge Ticket Layout */}
            <div className="p-6 rounded-2xl bg-amber-50/20 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 space-y-4 text-slate-900 dark:text-white font-sans">
              <div className="text-center border-b border-slate-300 dark:border-slate-700 pb-3">
                <div className="font-black text-lg tracking-wide uppercase">PT BUMI BARITO MINERAL</div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">MINE SMART AI - OFFICIAL WEIGHBRIDGE TICKET</div>
                <div className="text-[10px] text-slate-500">Site Operations Pit Alpha & Port Terminal Jetty 2</div>
              </div>

              <div className="flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">NO. TIKET</span>
                  <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">{selectedTicket.ticketNumber}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">TANGGAL / SHIFT</span>
                  <span className="font-semibold">{new Date(selectedTicket.createdAt).toLocaleDateString()} ({selectedTicket.shift})</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-200 dark:border-slate-800 py-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">UNIT TRUK</span>
                  <span className="font-bold">{selectedTicket.unitNumber}</span>
                  <span className="text-[10px] text-slate-500 block">{selectedTicket.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">OPERATOR / DRIVER</span>
                  <span className="font-semibold">{selectedTicket.operatorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">MATERIAL</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">{selectedTicket.materialType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">JEMBATAN TIMBANG</span>
                  <span className="font-semibold">{selectedTicket.weighbridgeName}</span>
                </div>
              </div>

              {/* Weight Data Block */}
              <div className="p-4 rounded-xl bg-slate-950 text-white font-mono space-y-2 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">GROSS WEIGHT:</span>
                  <span className="font-bold">{selectedTicket.grossWeight.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">TARE WEIGHT:</span>
                  <span className="font-bold">{selectedTicket.tareWeight.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-emerald-400 pt-2 border-t border-slate-800">
                  <span>NET WEIGHT:</span>
                  <span>{selectedTicket.netWeight.toLocaleString()} kg ({selectedTicket.normalizedValue} Ton)</span>
                </div>
              </div>

              {/* QR and Barcode Mock Display */}
              <div className="flex items-center justify-between pt-2">
                <div className="p-2 rounded bg-white text-slate-900 border text-center text-[10px] font-mono">
                  <QrCode className="w-12 h-12 mx-auto" />
                  <span>{selectedTicket.qrCode.slice(0, 20)}...</span>
                </div>
                <div className="p-2 rounded bg-white text-slate-900 border text-center text-[10px] font-mono">
                  <Barcode className="w-16 h-8 mx-auto" />
                  <span>*{selectedTicket.barcode}*</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => alert("Mengirim ke printer termal / PDF...")}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Cetak Tiket Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Void Ticket Reason Modal */}
      {isVoidModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C2E] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-rose-500 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                Pembatalan (Void) Tiket Penimbangan
              </h3>
              <button onClick={() => setIsVoidModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p>
                Anda akan melakukan <strong className="text-rose-500">VOID</strong> pada tiket <strong className="font-mono text-slate-900 dark:text-white">{selectedTicket.ticketNumber}</strong>. Tiket tidak dihapus secara permanen melainkan ditandai VOID dalam Audit Log.
              </p>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Alasan Void (Wajib)</label>
                <textarea
                  rows={3}
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  placeholder="Masukkan alasan koreksi/pembatalan tiket..."
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsVoidModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteVoid}
                disabled={!voidReason.trim()}
                className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white font-bold cursor-pointer text-xs"
              >
                Konfirmasi Void Tiket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
