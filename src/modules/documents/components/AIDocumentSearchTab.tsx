// MINE SMART AI - AI Document Search & Semantic Retrieval Tab
import React, { useState } from "react";
import {
  Sparkles,
  Search,
  Bot,
  Send,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  HelpCircle,
  Award,
  Layers,
  Zap,
  Tag,
  Copy,
  Check,
  Building2,
  Calendar,
  Eye,
  BookOpen,
} from "lucide-react";
import { DocumentItem, AISearchResponse } from "../../../types/documentTypes";
import { AIDocumentSearchService } from "../../../services/aiDocumentSearchService";
import { DocumentCategoryBadge } from "./DocumentCategoryBadge";

interface AIDocumentSearchTabProps {
  documents: DocumentItem[];
  onOpenDocument: (doc: DocumentItem) => void;
  onDownloadDocument: (docId: string) => void;
}

export const AIDocumentSearchTab: React.FC<AIDocumentSearchTabProps> = ({
  documents,
  onOpenDocument,
  onDownloadDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("Cari SOP maintenance excavator");
  const [searchResult, setSearchResult] = useState<AISearchResponse>(() =>
    AIDocumentSearchService.search("Cari SOP maintenance excavator", documents)
  );
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Chat interrogation state
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: "USER" | "AI"; text: string; docReference?: string }>
  >([
    {
      sender: "AI",
      text: `[MINE SMART AI DOCUMENT ADVISOR READY]
Halo! Saya asisten pencarian dokumen cerdas tambang. Anda dapat menanyakan SOP, Work Instruction, Kontrak vendor, Izin pemerintah (IPPKH/AMDAL/RKAB), Drawing CAD, Laporan geoteknik, Sertifikat, Invoice, hingga form Inspeksi K3.

💡 Coba tanyakan: "Cari SOP maintenance excavator" untuk melihat prosedur pemeliharaan berkala, LOTO, dan oil sampling.`,
    },
  ]);
  const [chatInput, setChatInput] = useState<string>("");

  const presetQuestions = [
    "Cari SOP maintenance excavator",
    "Dokumen izin IPPKH dan AMDAL Pit 1",
    "Drawing CAD desain lereng Pit 1 South",
    "Kontrak suplier BBM solar B35 Pertamina",
    "Sertifikat kalibrasi jembatan timbang",
    "Inspeksi keselamatan settling pond & tanggul",
    "Work instruction penggantian filter oli EX-204",
    "Laporan geoteknik kestabilan lereng",
    "Invoice suku cadang emergency United Tractors",
  ];

  const handleExecuteSearch = (q?: string) => {
    const targetQuery = q || searchQuery;
    if (!targetQuery.trim()) return;
    setSearchQuery(targetQuery);
    const res = AIDocumentSearchService.search(targetQuery, documents);
    setSearchResult(res);
  };

  const handleChatSend = (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const newMsgs = [...chatMessages, { sender: "USER" as const, text: textToSend }];
    setChatMessages(newMsgs);
    setChatInput("");

    // Trigger AI semantic matching
    setTimeout(() => {
      const qLower = textToSend.toLowerCase();
      let aiResponse = "";
      let docRef = "";

      if (qLower.includes("sop") && (qLower.includes("excavator") || qLower.includes("maintenance"))) {
        docRef = "SOP-MNT-EX-001";
        aiResponse = `[HASIL TEMUAN DOKUMEN: SOP-MNT-EX-001]
📌 Judul: SOP Preventive Maintenance & Periodic Service Excavator Komatsu PC1250 / PC2000
Status: ACTIVE • Departemen: Plant Maintenance • Standar: Kepmen ESDM 1827/2018

📋 LANGKAH PROSEDUR UTAMA:
1. Isolasi Energi (LOTO): Parkir unit rata, turunkan bucket grounded, buang sisa tekanan akumulator joystick 5-6 kali, putar Battery Disconnect ke posisi OFF & gembok LOTO.
2. Interval Servis Berkala:
   - PS 250 SMU: Ganti oli mesin (15W-40), ganti fuel filter & ambil sampel oli SOS.
   - PS 500 SMU: Ganti hydraulic return filter, cek oli final drive, torsi baut track shoe.
   - PS 1000 SMU: Ganti oli swing gear, pilot filter, pembersihan radiator.
   - PS 2000 SMU: Flushing total oli hidrolik & kalibrasi relief valve pressure 320 Bar.
3. Kepatuhan K3: Wajib kacamata safety, sarung tangan nitril, spill kit, dan harness jika bekerja pada catwalk (>1.8m).

Dokumen lengkap dapat Anda buka melalui kartu referensi di samping.`;
      } else if (qLower.includes("ippkh") || qLower.includes("izin hutan") || qLower.includes("amdal")) {
        docRef = "PMT-KLHK-2024-IPPKH";
        aiResponse = `[HASIL TEMUAN DOKUMEN: PMT-KLHK-2024-IPPKH]
📌 Judul: Izin Pinjam Pakai Kawasan Hutan (IPPKH) Operasi Produksi Pit 1 & Pit 2 KLHK
Nomor SK: SK.342/MENLHK/SETJEN/PLA.0/4/2024 • Berlaku s/d: 12 April 2029 (5 Tahun)

📜 RINGKASAN & KEWAJIBAN HUKUM:
- Luas Izin: 1.820,45 Hektar pada Kawasan Hutan Produksi Tetap (HP) Kutai Timur.
- Kewajiban Utama:
  1. Penanaman Rehabilitasi DAS rasio 1:1 seluas 1.820,45 Ha di area BPDAS.
  2. Pembayaran rutin PNBP Penggunaan Kawasan Hutan tahunan.
  3. Pelaksanaan tata batas definitif areal kerja dalam 1 tahun.
  4. Revegetasi pascatambang sesuai dokumen RKAB.`;
      } else if (qLower.includes("drawing") || qLower.includes("cad") || qLower.includes("lereng") || qLower.includes("pit")) {
        docRef = "DWG-ENG-PIT1-S-09";
        aiResponse = `[HASIL TEMUAN DOKUMEN: DWG-ENG-PIT1-S-09]
📌 Judul: Engineering CAD Pit Design & Bench Sequence Pit 1 South RL -50
Format: DWG (AutoCAD 3D) • Skala 1:2.500 • Status: Active v4.2

📐 SPESIFIKASI GEOMETRI:
- Single Bench Height: 10.0 Meter
- Single Slope Angle: 65° | Overall Slope Angle: 38°
- Lebar Jalan Haul Road: 28.0 Meter (Kapasitas 2-Way Dump Truck CAT 777G)
- Tanggul Pengaman (Safety Berm): Tinggi 1.8 Meter (3/4 diameter roda)
- Elevasi Dasar Tambang Terendah: RL -50.0 Meter MSL.`;
      } else if (qLower.includes("kontrak") || qLower.includes("solar") || qLower.includes("pertamina")) {
        docRef = "CTR-COM-2026-089";
        aiResponse = `[HASIL TEMUAN DOKUMEN: CTR-COM-2026-089]
📌 Judul: Kontrak Pasokan Bahan Bakar Solar Industri B35 PT Pertamina Patra Niaga
Periode: 1 Jan 2026 s/d 31 Des 2026 • Kuota Alokasi: 1.200.000 Liter / bulan

💰 KETENTUAN KOMERSIAL:
- Formula Harga: MOPS Gasoil 0.001% S + Alpha Distribusi + PPN 11% + PBBKB 7.5%.
- Termin Pembayaran: Net 30 hari kalender sejak BAST & faktur pajak lengkap.
- Spesifikasi FAME: 35% Biosolar sesuai Kepmen ESDM 115.K/2023, kadar air max 300 ppm.`;
      } else if (qLower.includes("sertifikat") || qLower.includes("timbang") || qLower.includes("weighbridge")) {
        docRef = "CRT-MET-WEIGH-2026";
        aiResponse = `[HASIL TEMUAN DOKUMEN: CRT-MET-WEIGH-2026]
📌 Judul: Surat Keterangan Tera Jembatan Timbang Metrologi Legal No. 510.4/048
Kapasitas: 100 Ton (Avery Weigh-Tronix) • Masa Berlaku: s/d 15 Februari 2027

⚖️ HASIL KALIBRASI:
- Pengujian beban bertahap (20 Ton, 60 Ton, 100 Ton) menunjukkan deviasi <10 kg (dalam batas toleransi izin BKD).
- Sah digunakan sebagai acuan timbangan komersial pengapalan batubara ke Jetty.`;
      } else {
        const fallbackSearch = AIDocumentSearchService.search(textToSend, documents);
        if (fallbackSearch.results.length > 0) {
          const top = fallbackSearch.results[0];
          docRef = top.document.documentNumber;
          aiResponse = `[AI MATCH FOUND: ${top.document.documentNumber}]
Dokumen ditemukan: "${top.document.title}" (${top.document.category} • Dept ${top.document.department}).
Relevansi: ${top.relevanceScore}%

Ringkasan: ${top.document.summary}`;
        } else {
          aiResponse = `Saya tidak menemukan dokumen persis untuk "${textToSend}". Coba tanyakan dengan kata kunci spesifik seperti: "SOP excavator", "Izin IPPKH", "Drawing CAD Pit 1", atau "Kontrak Solar Pertamina".`;
        }
      }

      setChatMessages((prev) => [...prev, { sender: "AI", text: aiResponse, docReference: docRef }]);
    }, 500);
  };

  const handleCopyChat = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Search Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-amber-500/40 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl font-black shadow-lg shadow-amber-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">AI Semantic Document Search Engine</h2>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-black rounded border border-amber-500/30">
                  SMKP & ESDM INDEXED
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Pencarian Berbasis Bahasa Alami (Natural Language): SOP, WI, Kontrak, Izin, Drawing, Laporan, Sertifikat, Invoice & Checklist Inspeksi
              </p>
            </div>
          </div>
        </div>

        {/* Big Search Input Box */}
        <div className="relative z-10 flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-700/80 shadow-inner">
          <Search className="w-5 h-5 text-amber-400 ml-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleExecuteSearch()}
            placeholder="Ketik pertanyaan atau pencarian dokumen: Contoh 'Cari SOP maintenance excavator'..."
            className="w-full bg-transparent px-2 py-2 text-sm text-white font-medium focus:outline-none placeholder-slate-500"
          />
          <button
            onClick={() => handleExecuteSearch()}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 shrink-0 cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Cari Dokumen AI</span>
          </button>
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none relative z-10">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Contoh Kueri:
          </span>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                handleExecuteSearch(q);
                handleChatSend(q);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap text-xs cursor-pointer ${
                searchQuery === q
                  ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                  : "bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: AI Search Synthesis & Matched Document Cards (Left) + Interactive Document Q&A Assistant (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search Results & Matched Documents */}
        <div className="lg:col-span-7 space-y-4">
          {/* AI Synthesis Summary Card */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">Sintesis Penemuan AI untuk: "{searchResult.query}"</h3>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold rounded-lg border border-emerald-500/20 font-mono">
                {searchResult.results.length} Dokumen Relevan
              </span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
              {searchResult.aiSynthesis}
            </div>

            {searchResult.inferredCategory && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-slate-400 font-bold text-[11px]">Filter Intent Terdeteksi:</span>
                <DocumentCategoryBadge category={searchResult.inferredCategory} size="sm" />
                {searchResult.inferredDepartment && (
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px] font-bold">
                    Dept: {searchResult.inferredDepartment}
                  </span>
                )}
                {searchResult.inferredEquipment && (
                  <span className="px-2 py-0.5 bg-amber-500/15 text-amber-300 rounded text-[11px] font-bold border border-amber-500/30">
                    Alat: {searchResult.inferredEquipment}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Matched Documents List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                Daftar Dokumen Terverifikasi Berdasarkan Relevansi
              </h3>
            </div>

            {searchResult.results.map((res, idx) => {
              const doc = res.document;
              return (
                <div
                  key={doc.id}
                  className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition shadow-xl space-y-3 group"
                >
                  {/* Document Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <DocumentCategoryBadge category={doc.category} size="sm" />
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {doc.documentNumber}
                      </span>
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {doc.version}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {res.relevanceScore}% Relevansi
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                          doc.status === "ACTIVE"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="space-y-1">
                    <h4
                      onClick={() => onOpenDocument(doc)}
                      className="text-sm font-black text-white hover:text-amber-400 transition cursor-pointer leading-snug"
                    >
                      {doc.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {res.highlightSnippet}
                    </p>
                  </div>

                  {/* Match Reason Banner */}
                  <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] text-amber-300/90 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-amber-400">Analisis AI:</strong> {res.matchReason}
                    </span>
                  </div>

                  {/* Meta Tags & Action Buttons */}
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-slate-500 text-[11px]">Dept: <strong className="text-slate-300">{doc.department}</strong></span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-500 text-[11px]">Format: <strong className="text-slate-300">{doc.fileType} ({doc.fileSizeMB}MB)</strong></span>
                      {doc.equipmentTags && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-amber-400 text-[11px] font-bold">Unit: {doc.equipmentTags.join(", ")}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onDownloadDocument(doc.id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold text-xs transition cursor-pointer"
                      >
                        Unduh File
                      </button>
                      <button
                        onClick={() => onOpenDocument(doc)}
                        className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs transition flex items-center gap-1 shadow-md shadow-amber-500/20 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Buka Dokumen</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Document Interrogation Chat Assistant */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl flex flex-col h-[740px] sticky top-4">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black text-white">AI Document Advisor & Q&A</h3>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[9px] font-black rounded">
                    ONLINE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tanyakan detail prosedur, nomor izin, tanggal kadaluarsa, atau pasal kontrak
                </p>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 font-sans text-xs">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === "USER" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-lg relative group ${
                    msg.sender === "USER"
                      ? "bg-amber-500 text-slate-950 font-bold rounded-br-none"
                      : "bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none font-mono text-[11px]"
                  }`}
                >
                  {msg.sender === "AI" && (
                    <button
                      onClick={() => handleCopyChat(msg.text, idx)}
                      className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition opacity-0 group-hover:opacity-100"
                      title="Salin jawaban AI"
                    >
                      {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                  {msg.text}
                </div>

                {msg.docReference && (
                  <button
                    onClick={() => {
                      const found = documents.find((d) => d.documentNumber === msg.docReference);
                      if (found) onOpenDocument(found);
                    }}
                    className="mt-1.5 text-[10px] font-bold text-amber-400 hover:underline flex items-center gap-1 ml-2 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Buka Lembar Dokumen {msg.docReference}</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Quick Chat Triggers */}
          <div className="p-2.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            <span className="text-slate-400 font-bold shrink-0">Tanya Cepat:</span>
            {[
              "Langkah LOTO Excavator",
              "Kewajiban Izin IPPKH",
              "Spesifikasi CAD Pit 1",
              "Formula Harga Kontrak Solar",
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleChatSend(prompt)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold transition whitespace-nowrap cursor-pointer text-[10px]"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950 rounded-b-2xl">
            <input
              type="text"
              placeholder="Tanyakan detail isi dokumen (misal: Berapa interval servis PS-250?)..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={() => handleChatSend()}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
