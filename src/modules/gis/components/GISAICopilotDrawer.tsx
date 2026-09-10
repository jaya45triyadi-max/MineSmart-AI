// MINE SMART AI - GIS Spatial AI Copilot Drawer Component

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  Compass,
  MapPin,
  ExternalLink,
  ShieldAlert,
  Pickaxe,
} from "lucide-react";
import { SpatialEntity } from "../types/gisTypes";
import { GISAIService, SpatialAIActionResponse } from "../../../services/gis/GISAIService";
import { useAuth } from "../../../providers/AuthProvider";

interface GISAICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEntityOnMap: (entity: SpatialEntity) => void;
}

interface ChatMessage {
  id: string;
  sender: "USER" | "AI";
  text: string;
  actionResponse?: SpatialAIActionResponse;
  timestamp: string;
}

export const GISAICopilotDrawer: React.FC<GISAICopilotDrawerProps> = ({
  isOpen,
  onClose,
  onSelectEntityOnMap,
}) => {
  if (!isOpen) return null;

  const { activeSite, user } = useAuth();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-01",
      sender: "AI",
      text: `Halo ${
        user?.displayName || "Engineer"
      }! Saya **AI Spatial Intelligence Assistant** MINE SMART AI. Anda bisa bertanya posisi armada fleet, elevasi bench pit, batas seam batubara, atau menghitung luas area dalam bahasa natural.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const quickPrompts = [
    "Di mana lokasi EX-201?",
    "Berapa luas Pit 1 South?",
    "Cek zona peledakan aktif",
    "Tampilkan stok ROM Stockpile A",
  ];

  const handleSendMessage = (promptText?: string) => {
    const textToSend = promptText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "USER",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Process Spatial AI Query
    setTimeout(() => {
      const aiResponse = GISAIService.processAIQuery({
        userPrompt: textToSend,
        siteId: activeSite?.name || "Sangatta Site A",
        userRole: user?.role || "ENGINEER",
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "AI",
        text: aiResponse.answerText,
        actionResponse: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If suggested action has target entity, trigger highlight
      if (aiResponse.affectedEntities && aiResponse.affectedEntities.length > 0) {
        onSelectEntityOnMap(aiResponse.affectedEntities[0]);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between transition-all animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold shadow-md">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              AI Spatial Intelligence
            </h3>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
              Gemini Spatial Assistant Powered
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === "USER" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "AI" && (
              <div className="h-7 w-7 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] rounded-2xl p-3 space-y-2 ${
                msg.sender === "USER"
                  ? "bg-teal-500 text-slate-950 font-semibold"
                  : "bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
              }`}
            >
              <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

              {/* Action Buttons inside AI response */}
              {msg.actionResponse?.affectedEntities &&
                msg.actionResponse.affectedEntities.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Objek Spasial Ditemukan:
                    </span>
                    {msg.actionResponse.affectedEntities.map((ent) => (
                      <button
                        key={ent.id}
                        onClick={() => onSelectEntityOnMap(ent)}
                        className="w-full p-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-600 dark:text-teal-400 font-bold text-[11px] flex items-center justify-between cursor-pointer"
                      >
                        <span className="truncate">{ent.name}</span>
                        <Compass className="h-3.5 w-3.5 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

              <span className="text-[9px] text-slate-400 block text-right font-mono">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts & Input Box */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-teal-500/20 hover:text-teal-400 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer truncate max-w-full"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ketik pertanyaan spasial..."
            className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold transition-all shadow-md cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
