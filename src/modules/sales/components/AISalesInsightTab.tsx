import React, { useState } from "react";
import { Sparkles, Bot, ArrowRight, ShieldCheck, Database, CheckCircle2, Search } from "lucide-react";
import { AISalesInsight } from "../../../types/salesTypes";

interface AISalesInsightTabProps {
  insights: AISalesInsight[];
}

export const AISalesInsightTab: React.FC<AISalesInsightTabProps> = ({ insights }) => {
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setAiResponse(
      `[AI Grounded Analysis for "${query}"]: Based on current stockpile lab assays (SP-01 GAR 5850, SP-02 GAR 5650, SP-03 GAR 5300) and contract specification CTR-2026-ADARO-012, the optimal blending recipe is 65% SP-01 + 25% SP-02 + 10% SP-03. This produces a final GAR of 5812 kcal/kg with 0% quality penalty, saving $28,000 in net coal margin.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl p-6 border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 animate-pulse" />
          AI Stock-to-Sales & Commercial Optimization Engine
        </div>
        <h2 className="text-2xl font-bold">Grounded AI Commercial Assistant</h2>
        <p className="text-slate-300 text-sm max-w-3xl">
          Ask questions or run automated algorithms to find optimal stockpile blending recipes, analyze contract fulfillment risks, and maximize FOB/CIF profit margins.
        </p>

        {/* Query Input */}
        <form onSubmit={handleQuerySubmit} className="flex gap-2 max-w-2xl">
          <input
            type="text"
            placeholder="Ask AI e.g. 'What is the best blending recipe for MV Orient Ocean?'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4" /> Run AI Analysis
          </button>
        </form>

        {aiResponse && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 space-y-2 animate-in fade-in duration-200">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Grounded Analysis Result:
            </span>
            <p>{aiResponse}</p>
          </div>
        )}
      </div>

      {/* AI Insights List */}
      <div className="space-y-4">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-emerald-500/50 transition-all"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {ins.category.replace("_", " ")}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{ins.title}</h3>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                {ins.confidence}% AI Confidence
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{ins.finding}</p>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider block">Grounded Evidence & Data Sources</span>
              <div className="flex flex-wrap gap-2">
                {ins.evidence.dataSources.map((ds, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                    {ds}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-500">Business Impact: </span>
                <strong className="text-emerald-600 dark:text-emerald-400">{ins.expectedImpact}</strong>
              </div>
              <span className="text-slate-400 text-[11px]">{ins.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
