// MINE SMART AI - AI Maintenance & Equipment Health Copilot Modal

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Send,
  Wrench,
  Bot,
  User,
  ShieldCheck,
  Cpu,
  Layers,
  Flame,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface AIMaintenanceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Analisis anomali getaran & kavitasi pompa hidrolik CAT 6020B",
  "Rekomendasi interval servis PM 250 vs PM 500 Excavator PC2000",
  "Troubleshooting panas berlebih mesin Scania DC13 saat hauling",
  "Penyebab lonjakan partikel tembaga (Cu) pada uji lab SOS oli transmisi",
  "Daftar spare part kritis yang perlu di-reorder minggu ini",
];

export const AIMaintenanceAssistantModal: React.FC<AIMaintenanceAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Halo! Saya AI Maintenance & Reliability Copilot tambang Anda. Saya dapat membantu menganalisis pola kegagalan komponen (RUL), interpretasi uji oli lab SOS, troubleshooting kode error ECM, spesifikasi torsi baut, dan strategi preventif armada tambang Anda. Ada yang bisa saya bantu hari ini?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || prompt;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "";

      if (query.toLowerCase().includes("kavitasi") || query.toLowerCase().includes("pompa")) {
        aiResponse = `**Analisis Kavitasi Pompa Hidrolik Utama (CAT 6020B / PC2000):**
1. **Penyebab Utama:** Saringan hisap (suction strainer) tangki hidrolik mengalami saturasi partikel mikro, atau viskositas oli hidrolik terlalu tinggi di awal shift dingin (ISO VG 68 vs VG 46).
2. **Indikasi Telematics:** Spektrum vibrasi di frekuensi 1.2 kHz - 2.5 kHz menunjukkan lonjakan >12 mm/s RMS disertai penurunan efisiensi volumetrik 14%.
3. **Langkah Mitigasi AI:**
   - Hentikan pembebanan berat saat suhu oli <45°C (lakukan warm-up cycle 10 menit).
   - Segera jadwalkan penggantian suction filter dan o-ring kit.
   - Ambil sampel oli hidrolik untuk uji lab SOS partikel Cu & Fe.`;
      } else if (query.toLowerCase().includes("scania") || query.toLowerCase().includes("panas") || query.toLowerCase().includes("overheat")) {
        aiResponse = `**Troubleshooting Overheating Scania DC13 Dump Truck:**
1. **Diagnosis Termal:** Engine temperature 98°C pada tanjakan gradien >8% biasanya dipicu oleh *viscous fan clutch* yang slip pada putaran tinggi atau sirip radiator tersumbat debu batu bara.
2. **Pemeriksaan Segera:**
   - Bersihkan celah intercooler & radiator menggunakan semprotan air bertekanan rendah (hindari merusak fin).
   - Cek tekanan bypass thermostat (harus membuka penuh pada 87°C).
   - Pastikan konsentrasi premix coolant pada rasio 50:50 (titik didih 108°C).`;
      } else if (query.toLowerCase().includes("tembaga") || query.toLowerCase().includes("sos") || query.toLowerCase().includes("oli")) {
        aiResponse = `**Interpretasi Lonjakan Tembaga (Cu > 40 ppm) Lab SOS:**
1. **Asal Material:** Kandungan tembaga murni berasal dari keausan *bronze bushing*, *thrust washer*, atau *slipper shoe pads* pada pompa hidrolik/transmisi.
2. **Tingkat Kritis:** Jika disertai partikel Besi (Fe) >50 ppm, ini menunjukkan fase *severe abrasive wear*.
3. **Rekomendasi Tindakan:** Buka filter cartridge untuk inspeksi residu magnetik dan jadwalkan penggantian unit sebelum housing pompa tergores parah.`;
      } else {
        aiResponse = `**AI Reliability Insights & Prescriptive Strategy:**
Berdasarkan data operasional armada saat ini:
- **PM Compliance:** 92.4% on-time (target >90% tercapai).
- **MTBF Armada:** Rata-rata 540.5 jam operasi antar kegagalan.
- **Rekomendasi Utama:** Prioritaskan inspeksi pada 3 unit dengan peringatan dini aktif (EX-101 Pompa Hidrolik, HT-203 Turbocharger, dan DZ-302 Final Drive). Lakukan penerbitan Work Order terencana sebelum shift akhir pekan.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl h-[85vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>AI Maintenance & Reliability Copilot</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
                  ACTIVE AI
                </span>
              </h2>
              <p className="text-xs text-slate-400">Mining Equipment Engineering & Diagnostic Intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-slate-800 border border-slate-700 text-amber-400"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  msg.role === "user"
                    ? "bg-amber-500/10 border border-amber-500/30 text-slate-100"
                    : "bg-slate-950/70 border border-slate-800 text-slate-200"
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>
                <div
                  className={`text-[10px] ${
                    msg.role === "user" ? "text-amber-400/80 text-right" : "text-slate-500"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-amber-400 animate-pulse p-2">
              <Bot className="w-4 h-4" />
              <span>AI sedang menganalisis telematics dan database servis tambang...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-6 py-2 bg-slate-950/50 border-t border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-2">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/80 hover:border-amber-500/50 hover:bg-slate-800 text-slate-300 text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-3">
          <input
            type="text"
            placeholder="Tanyakan analisis kegagalan komponen, kode trouble ECM, atau spesifikasi servis..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!prompt.trim() || isTyping}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black hover:brightness-110 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
