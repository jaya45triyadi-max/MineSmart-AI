// MINE SMART AI - AI Fuel Assistant Modal

import React, { useState } from "react";
import { Sparkles, Send, X, Bot, User, CheckCircle, AlertTriangle, ShieldAlert } from "lucide-react";

interface AIFuelAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "USER" | "AI";
  text: string;
  timestamp: string;
}

export const AIFuelAssistantModal: React.FC<AIFuelAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "AI",
      text: "Halo! Saya AI Fuel Intelligence Assistant. Silakan tanyakan stok solar, konsumsi per unit/shift, analisis fuel/ton, atau deteksi abnormalitas fuel.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  const quickPrompts = [
    "Berapa stok solar sekarang?",
    "Berapa konsumsi fuel hari ini?",
    "Equipment mana paling boros?",
    "Kenapa fuel per ton meningkat?",
    "Apakah ada abnormal consumption?",
    "Apakah ada indikasi fuel loss?"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "USER",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput("");

    setTimeout(() => {
      let responseText = "";
      const qLower = query.toLowerCase();

      if (qLower.includes("stok") || qLower.includes("stock")) {
        responseText = "📊 **Total Stok Solar Aktif Site**: **122.100 Liter** (8.2 Hari Operasional)\n- Main Storage Tank 01: 64.200 L (64.2% Kapasitas)\n- Pit A Fuel Tank: 18.450 L (52.7% Kapasitas)\n- Mobile Fuel Truck #01: 8.200 L (54.6% Kapasitas)\n- Port Buffer Tank: 31.200 L (62.4% Kapasitas)\n*Status: AMAN / No Stockout Imminent.*";
      } else if (qLower.includes("hari ini") || qLower.includes("konsumsi")) {
        responseText = "⛽ **Ringkasan Konsumsi Fuel Hari Ini (Shift 1)**:\n- Total Dispensed: **2.955 Liter**\n- Total Production Supported: **3.650 Ton Coal + 3.450 BCM OB**\n- Average Fuel/Hour: **43.1 L/Jam**\n- Average Fuel/Ton: **0.81 L/Ton**\n- Estimated Cost: **Rp 44.325.000** (@ Rp 15.000/L)";
      } else if (qLower.includes("boros") || qLower.includes("paling boros") || qLower.includes("equipment")) {
        responseText = "🚛 **Top Equipment Konsumsi & Inefisiensi Fuel**:\n1. **HT-203 (Volvo FMX440)**: 1.078 L/Ton (+22.5% vs Target 0.88 L/Ton). Penyebab: Idle time di loading ramp 28 menit.\n2. **EX-102 (Komatsu PC2000)**: 93.88 L/Jam (+14.5% vs Target 82 L/Jam). Penyebab: OB material hardness tinggi pada Pit A Bench 4.\n3. **HT-202 (Scania P410)**: 0.940 L/Ton (+6.8% vs Target 0.88 L/Ton).";
      } else if (qLower.includes("meningkat") || qLower.includes("kenapa")) {
        responseText = "🔍 **AI Root Cause Analysis Fuel/Ton Increase (+13%)**:\n- **Problem**: Fuel per Ton meningkat 13% pada shift 1.\n- **Evidence**: Cycle time hauling meningkat +10% dan waktu antrian di loading point bertambah 15 menit.\n- **Possible Root Cause**: Inefisiensi operasional alokasi dump truck & antrian di loader EX-102.\n- **Recommendation**: Lakukan re-dispatch 2 unit truck ke EX-101 untuk menyeimbangkan antrian loader.\n- **Expected Impact**: Potensi penurunan konsumsi 180 L/shift (~Rp 2,7 Juta/shift).\n- **Confidence**: 91% (Data source: FMS Dispatch & Telematics Sensor).";
      } else if (qLower.includes("abnormal") || qLower.includes("anomali")) {
        responseText = "🚨 **Deteksi Anomali Konsumsi Solar (2 Aktif)**:\n1. **HT-203**: Fuel Spike / High Fuel per Ton (Severity: **HIGH**). Deviation +22.5%.\n2. **EX-102**: High Fuel per Hour (Severity: **MEDIUM**). Deviation +14.5%.\nSistem merekomendasikan pemeriksaan injector & pemantauan idle time via FMS.";
      } else if (qLower.includes("loss") || qLower.includes("indikasi") || qLower.includes("rugi")) {
        responseText = "🛡️ **Fuel Loss Detection Analysis**:\n- **Alert Ref**: FLA-01 (Pit A Fuel Station Tank)\n- **Recorded Variance**: -130 Liter (-0.70% dari volume transaksi)\n- **Investigation Status**: **RESOLVED / CLOSED**\n- **Finding**: Penyimpangan disebabkan kalibrasi meter (-120L) dan penyusutan suhu malam (-10L).\n- **Kesimpulan**: *Tidak ditemukan indikasi kecurangan / pencurian (No Unauthorized Theft Detected).*";
      } else {
        responseText = `🤖 Berdasarkan analisis data Fuel Management System:\n- Total Stok: 122.100 Liter\n- Rata-rata Fuel Efficiency: 0.81 L/Ton (Coal) & 0.51 L/BCM (OB)\n- Reorder Recommendation: Pembelian 32.000 L dijadwalkan pada 16 Aug 2026.\nSilakan ajukan pertanyaan lebih spesifik mengenai unit atau rute tertentu.`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "AI",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl h-[650px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                AI Fuel Intelligence Assistant
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  Live Analytics
                </span>
              </h3>
              <p className="text-xs text-slate-400">Mine Smart AI • Real-time Fuel Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap gap-2">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-xs bg-slate-800/90 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors text-left"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === "USER" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "AI" && (
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 text-xs font-bold">
                  AI
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl p-4 text-sm leading-relaxed whitespace-pre-line ${
                  m.sender === "USER"
                    ? "bg-amber-600 text-white rounded-tr-none font-medium"
                    : "bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none shadow-md"
                }`}
              >
                {m.text}
                <div
                  className={`text-[10px] mt-2 text-right ${
                    m.sender === "USER" ? "text-amber-200" : "text-slate-400"
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
              {m.sender === "USER" && (
                <div className="w-8 h-8 rounded-lg bg-slate-700 text-slate-200 flex items-center justify-center shrink-0 text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Tanyakan stok, konsumsi unit, anomali, atau fuel loss..."
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/80"
          />
          <button
            onClick={() => handleSend()}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors text-sm"
          >
            <Send className="w-4 h-4" />
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};
