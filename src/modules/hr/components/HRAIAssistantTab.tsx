import React, { useState } from "react";
import { Bot, Send, Sparkles, User, RefreshCw, AlertCircle } from "lucide-react";
import { HRAIInsight } from "../../../types/hrTypes";

interface Props {
  insights: HRAIInsight[];
}

export const HRAIAssistantTab: React.FC<Props> = ({ insights }) => {
  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; text: string; time: string }[]
  >([
    {
      sender: "ai",
      text: "Halo! Saya AI HR & Manpower Assistant MINE SMART. Saya dapat membantu menganalisis sertifikasi K3 expired, optimalisasi roster shift, prediksi shortage operator, dan rekomendasi diklat.",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMsg, time: new Date().toLocaleTimeString() },
    ]);
    setInput("");

    setTimeout(() => {
      let reply = "Berdasarkan analisis data HR, seluruh jadwal roster Shift 1 & Shift 2 telah terisi 100%. Namun perlu diperhatikan perpanjangan SIO Operator Excavator Agus Setiawan sebelum akhir bulan.";
      if (userMsg.toLowerCase().includes("overtime") || userMsg.toLowerCase().includes("lembur")) {
        reply = "Jam lembur bulan ini mencapai 1,240 jam, terkonsentrasi di Dept Plant Maintenance. Rekomendasi AI: Tambah 2 personil mekanik senior untuk mengurangi burnout.";
      }
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: reply, time: new Date().toLocaleTimeString() },
      ]);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* AI Chat Window */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 flex flex-col h-[550px] shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Interactive HR AI Assistant Copilot</h3>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Online • Gemini 2.5 Engine
          </span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-1 ${
                  m.sender === "user"
                    ? "bg-emerald-500 text-slate-950 font-medium"
                    : "bg-slate-950 border border-slate-800 text-slate-200"
                }`}
              >
                <p className="leading-relaxed">{m.text}</p>
                <span className="text-[9px] opacity-60 block text-right">{m.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="pt-3 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder="Tanyakan analisis HR, jadwal roster, atau sertifikasi..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* AI HR Risk Insights Summary */}
      <div className="rounded-2xl border border-emerald-900/40 bg-slate-900/90 p-5 space-y-4 shadow-md">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-400" /> Ringkasan Insight Otomatis HR AI
        </h3>

        <div className="space-y-3">
          {insights.map((ins) => (
            <div key={ins.id} className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-white text-xs block">{ins.title}</span>
              <p className="text-slate-300">{ins.finding}</p>
              <p className="text-emerald-400 font-medium">Rekomendasi: {ins.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
