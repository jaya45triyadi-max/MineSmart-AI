import React from "react";
import { Sparkles, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export interface AIInsightCardProps {
  title: string;
  category?: string;
  insight: string;
  recommendation: string;
  confidenceScore?: number;
  dataSource?: string;
  onApplyRecommendation?: () => void;
  type?: "info" | "warning" | "success";
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({
  title,
  category = "OPERATIONAL AI",
  insight,
  recommendation,
  confidenceScore = 94,
  dataSource = "FMS & Telemetry Analytics",
  onApplyRecommendation,
  type = "info",
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-slate-900 to-slate-900 p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
              {category}
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-white">{title}</h4>
          </div>
        </div>

        <Badge variant="gold">Confidence {confidenceScore}%</Badge>
      </div>

      <div className="mt-3 space-y-2 text-xs text-slate-300">
        <p className="leading-relaxed">{insight}</p>
        <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
          <p className="text-[10px] font-bold uppercase text-emerald-400 mb-1">
            Rekomendasi Tindakan AI
          </p>
          <p className="font-semibold text-white">{recommendation}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-500">
        <span>Sumber: {dataSource}</span>
        {onApplyRecommendation && (
          <Button
            size="sm"
            variant="gold"
            rightIcon={<ArrowRight className="h-3 w-3" />}
            onClick={onApplyRecommendation}
          >
            Terapkan Rekomendasi
          </Button>
        )}
      </div>
    </div>
  );
};
