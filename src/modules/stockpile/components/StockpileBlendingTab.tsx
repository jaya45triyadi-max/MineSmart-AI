import React, { useState, useMemo } from "react";
import {
  Scale,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Play,
  Plus,
  RefreshCw,
  Calculator,
  Layers,
  FileCheck,
  TrendingUp,
  DollarSign,
  Droplets,
  Flame,
  ArrowRight,
  ShieldCheck,
  Clock,
  ChevronRight,
  Info,
  Sliders,
  Check,
  Wrench,
  Ship,
  FileSpreadsheet,
} from "lucide-react";
import {
  BlendingPlan,
  Stockpile,
  BlendingOptimizerTarget,
  BlendingAiRecipe,
  BlendingAiRecipeComponent,
} from "../../../types/stockpileTypes";

interface StockpileBlendingTabProps {
  blendingPlans: BlendingPlan[];
  stockpiles: Stockpile[];
  onAddBlendingPlan: (plan: BlendingPlan) => void;
  onUpdateBlendingPlan: (plan: BlendingPlan) => void;
  onOpenAICopilot?: (prompt?: string) => void;
}

export const StockpileBlendingTab: React.FC<StockpileBlendingTabProps> = ({
  blendingPlans,
  stockpiles,
  onAddBlendingPlan,
  onUpdateBlendingPlan,
  onOpenAICopilot,
}) => {
  // Target Specification State for AI Optimizer & Contract Specs
  const [targetGAR, setTargetGAR] = useState<number>(5000);
  const [minGAR, setMinGAR] = useState<number>(4950);
  const [maxAsh, setMaxAsh] = useState<number>(8.0);
  const [maxSulfur, setMaxSulfur] = useState<number>(0.75);
  const [maxMoisture, setMaxMoisture] = useState<number>(28.0);
  const [targetTonnage, setTargetTonnage] = useState<number>(30000);
  const [vesselType, setVesselType] = useState<string>("Panamax Vessel (55,000 Ton)");
  const [strategy, setStrategy] = useState<
    "PROFIT_MAXIMIZATION" | "BALANCED_SPEC" | "AGING_DEPLETION" | "LOWEST_REHANDLING"
  >("PROFIT_MAXIMIZATION");

  // AI Optimizer Output State
  const [isAiOptimizing, setIsAiOptimizing] = useState<boolean>(false);
  const [aiGeneratedRecipes, setAiGeneratedRecipes] = useState<BlendingAiRecipe[] | null>(null);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number>(0);

  // Multi-Stockpile Interactive Simulator State (supports up to 4 components)
  const [simComponents, setSimComponents] = useState<
    { stockpileId: string; ratio: number }[]
  >([
    { stockpileId: stockpiles[0]?.id || "SP-001", ratio: 55 },
    { stockpileId: stockpiles[1]?.id || "SP-002", ratio: 45 },
  ]);

  // Active stockpiles eligible for blending (exclude reject dump)
  const candidateStockpiles = useMemo(
    () => stockpiles.filter((s) => s.stockpileType !== "REJECT" && s.currentQuantity > 0),
    [stockpiles]
  );

  // AI Optimization Solver Function
  const runAiOptimization = () => {
    setIsAiOptimizing(true);

    setTimeout(() => {
      // Find candidate piles
      const usablePiles = candidateStockpiles.filter((p) => p.currentQuantity >= 2000);
      const highPiles = usablePiles.filter((p) => p.quality.cvGAR >= targetGAR);
      const lowPiles = usablePiles.filter((p) => p.quality.cvGAR < targetGAR);

      const recipes: BlendingAiRecipe[] = [];

      // Generate Recipe 1: Profit Maximization / Smart Margin
      // Blend highest grade + lowest cost / low rank without exceeding Ash/TS
      const bestHigh = highPiles.length > 0 ? highPiles[0] : usablePiles[0];
      const bestLow = lowPiles.length > 0 ? lowPiles[0] : usablePiles[1] || usablePiles[0];

      if (bestHigh && bestLow && bestHigh.id !== bestLow.id) {
        // Compute theoretical ratio to hit targetGAR
        const cvDiff = bestHigh.quality.cvGAR - bestLow.quality.cvGAR;
        let rA = cvDiff !== 0 ? Math.round(((targetGAR + 25 - bestLow.quality.cvGAR) / cvDiff) * 100) : 50;
        rA = Math.max(20, Math.min(80, rA));
        const rB = 100 - rA;

        const blendedCV = Math.round((bestHigh.quality.cvGAR * rA + bestLow.quality.cvGAR * rB) / 100);
        const blendedAsh = Number(((bestHigh.quality.ash * rA + bestLow.quality.ash * rB) / 100).toFixed(2));
        const blendedTS = Number(((bestHigh.quality.sulfur * rA + bestLow.quality.sulfur * rB) / 100).toFixed(2));
        const blendedTM = Number(((bestHigh.quality.totalMoisture * rA + bestLow.quality.totalMoisture * rB) / 100).toFixed(2));
        const blendedVM = Number(((bestHigh.quality.volatileMatter * rA + bestLow.quality.volatileMatter * rB) / 100).toFixed(2));
        const blendedHGI = Math.round((bestHigh.quality.hgi * rA + bestLow.quality.hgi * rB) / 100);

        const costHigh = bestHigh.quality.costPerTonIDR || 780000;
        const costLow = bestLow.quality.costPerTonIDR || 550000;
        const blendedCost = Math.round((costHigh * rA + costLow * rB) / 100);
        const benchmarkCost = costHigh;
        const savingsPerTon = benchmarkCost - blendedCost;
        const totalSavings = savingsPerTon * targetTonnage;

        recipes.push({
          recipeId: "RECIPE-OPT-01",
          recipeName: `AI Optimal Profit & Margin Recipe (${rA}% ${bestHigh.stockpileCode} + ${rB}% ${bestLow.stockpileCode})`,
          strategy: "PROFIT_MAXIMIZATION",
          matchScorePercent: 98.5,
          components: [
            {
              stockpileId: bestHigh.id,
              stockpileCode: bestHigh.stockpileCode,
              stockpileName: bestHigh.stockpileName,
              coalType: bestHigh.coalType,
              tonnage: (targetTonnage * rA) / 100,
              percentage: rA,
              cvGAR: bestHigh.quality.cvGAR,
              ash: bestHigh.quality.ash,
              sulfur: bestHigh.quality.sulfur,
              totalMoisture: bestHigh.quality.totalMoisture,
              unitCostIDR: costHigh,
              locationArea: bestHigh.location.area,
            },
            {
              stockpileId: bestLow.id,
              stockpileCode: bestLow.stockpileCode,
              stockpileName: bestLow.stockpileName,
              coalType: bestLow.coalType,
              tonnage: (targetTonnage * rB) / 100,
              percentage: rB,
              cvGAR: bestLow.quality.cvGAR,
              ash: bestLow.quality.ash,
              sulfur: bestLow.quality.sulfur,
              totalMoisture: bestLow.quality.totalMoisture,
              unitCostIDR: costLow,
              locationArea: bestLow.location.area,
            },
          ],
          blendedQuality: {
            cvGAR: blendedCV,
            ash: blendedAsh,
            sulfur: blendedTS,
            totalMoisture: blendedTM,
            volatileMatter: blendedVM,
            hgi: blendedHGI,
          },
          specCompliance: {
            cvOk: blendedCV >= minGAR,
            ashOk: blendedAsh <= maxAsh,
            sulfurOk: blendedTS <= maxSulfur,
            moistureOk: blendedTM <= maxMoisture,
            isAllCompliant: blendedCV >= minGAR && blendedAsh <= maxAsh && blendedTS <= maxSulfur && blendedTM <= maxMoisture,
            cvDelta: blendedCV - targetGAR,
            ashDelta: Number((maxAsh - blendedAsh).toFixed(2)),
            sulfurDelta: Number((maxSulfur - blendedTS).toFixed(2)),
          },
          financials: {
            costPerTonIDR: blendedCost,
            totalCostIDR: blendedCost * targetTonnage,
            estimatedSavingsIDR: totalSavings,
            highGradeSavedTon: (targetTonnage * rB) / 100,
          },
          riskAssessment: {
            spontaneousRiskScore: "LOW",
            rehandlingComplexity: "SIMPLE",
            aiRecommendationRationale: `Memaksimalkan penyerapan batubara ekonomis ${bestLow.stockpileCode} (${(targetTonnage * rB) / 100} Ton) tanpa melanggar batas Ash ${maxAsh}% dan Sulfur ${maxSulfur}%. Menghemat biaya IDR ${(totalSavings / 1000000).toFixed(0)} Juta.`,
          },
        });
      }

      // Generate Recipe 2: Aging Stockpile Depletion (Priority on oldest piles >20 days)
      const oldestPiles = [...usablePiles].sort((a, b) => b.ageDays - a.ageDays);
      const agingPile = oldestPiles[0];
      const sweetnerPile = highPiles.find((p) => p.id !== agingPile?.id) || usablePiles[0];

      if (agingPile && sweetnerPile && agingPile.id !== sweetnerPile.id) {
        const cvDiff = sweetnerPile.quality.cvGAR - agingPile.quality.cvGAR;
        let rSweet = cvDiff !== 0 ? Math.round(((targetGAR + 35 - agingPile.quality.cvGAR) / cvDiff) * 100) : 60;
        rSweet = Math.max(30, Math.min(85, rSweet));
        const rAge = 100 - rSweet;

        const blendedCV = Math.round((sweetnerPile.quality.cvGAR * rSweet + agingPile.quality.cvGAR * rAge) / 100);
        const blendedAsh = Number(((sweetnerPile.quality.ash * rSweet + agingPile.quality.ash * rAge) / 100).toFixed(2));
        const blendedTS = Number(((sweetnerPile.quality.sulfur * rSweet + agingPile.quality.sulfur * rAge) / 100).toFixed(2));
        const blendedTM = Number(((sweetnerPile.quality.totalMoisture * rSweet + agingPile.quality.totalMoisture * rAge) / 100).toFixed(2));
        const blendedCost = Math.round(((sweetnerPile.quality.costPerTonIDR || 750000) * rSweet + (agingPile.quality.costPerTonIDR || 580000) * rAge) / 100);

        recipes.push({
          recipeId: "RECIPE-OPT-02",
          recipeName: `AI Aging Clearance Recipe (Drain ${agingPile.stockpileCode} [${agingPile.ageDays}d, ${agingPile.temperatureCelsius || 48}°C])`,
          strategy: "AGING_DEPLETION",
          matchScorePercent: 95.0,
          components: [
            {
              stockpileId: sweetnerPile.id,
              stockpileCode: sweetnerPile.stockpileCode,
              stockpileName: sweetnerPile.stockpileName,
              coalType: sweetnerPile.coalType,
              tonnage: (targetTonnage * rSweet) / 100,
              percentage: rSweet,
              cvGAR: sweetnerPile.quality.cvGAR,
              ash: sweetnerPile.quality.ash,
              sulfur: sweetnerPile.quality.sulfur,
              totalMoisture: sweetnerPile.quality.totalMoisture,
              unitCostIDR: sweetnerPile.quality.costPerTonIDR || 750000,
              locationArea: sweetnerPile.location.area,
            },
            {
              stockpileId: agingPile.id,
              stockpileCode: agingPile.stockpileCode,
              stockpileName: agingPile.stockpileName,
              coalType: agingPile.coalType,
              tonnage: (targetTonnage * rAge) / 100,
              percentage: rAge,
              cvGAR: agingPile.quality.cvGAR,
              ash: agingPile.quality.ash,
              sulfur: agingPile.quality.sulfur,
              totalMoisture: agingPile.quality.totalMoisture,
              unitCostIDR: agingPile.quality.costPerTonIDR || 580000,
              locationArea: agingPile.location.area,
            },
          ],
          blendedQuality: {
            cvGAR: blendedCV,
            ash: blendedAsh,
            sulfur: blendedTS,
            totalMoisture: blendedTM,
            volatileMatter: 37.2,
            hgi: 50,
          },
          specCompliance: {
            cvOk: blendedCV >= minGAR,
            ashOk: blendedAsh <= maxAsh,
            sulfurOk: blendedTS <= maxSulfur,
            moistureOk: blendedTM <= maxMoisture,
            isAllCompliant: blendedCV >= minGAR && blendedAsh <= maxAsh && blendedTS <= maxSulfur && blendedTM <= maxMoisture,
            cvDelta: blendedCV - targetGAR,
            ashDelta: Number((maxAsh - blendedAsh).toFixed(2)),
            sulfurDelta: Number((maxSulfur - blendedTS).toFixed(2)),
          },
          financials: {
            costPerTonIDR: blendedCost,
            totalCostIDR: blendedCost * targetTonnage,
            estimatedSavingsIDR: ((sweetnerPile.quality.costPerTonIDR || 750000) - blendedCost) * targetTonnage,
            highGradeSavedTon: (targetTonnage * rAge) / 100,
          },
          riskAssessment: {
            spontaneousRiskScore: "HIGH",
            rehandlingComplexity: "MEDIUM",
            aiRecommendationRationale: `Prioritas menguras stockpile ${agingPile.stockpileCode} yang berumur ${agingPile.ageDays} hari dengan suhu sensor ${agingPile.temperatureCelsius || 48}°C untuk mengeliminasi bahaya spontaneous combustion (self-ignition).`,
          },
        });
      }

      // Generate Recipe 3: Triple-Stockpile Balanced Spec Recipe
      if (usablePiles.length >= 3) {
        const p1 = usablePiles[0];
        const p2 = usablePiles[1];
        const p3 = usablePiles[2];

        const r1 = 40;
        const r2 = 35;
        const r3 = 25;

        const blendedCV = Math.round((p1.quality.cvGAR * r1 + p2.quality.cvGAR * r2 + p3.quality.cvGAR * r3) / 100);
        const blendedAsh = Number(((p1.quality.ash * r1 + p2.quality.ash * r2 + p3.quality.ash * r3) / 100).toFixed(2));
        const blendedTS = Number(((p1.quality.sulfur * r1 + p2.quality.sulfur * r2 + p3.quality.sulfur * r3) / 100).toFixed(2));
        const blendedTM = Number(((p1.quality.totalMoisture * r1 + p2.quality.totalMoisture * r2 + p3.quality.totalMoisture * r3) / 100).toFixed(2));
        const blendedCost = Math.round(
          ((p1.quality.costPerTonIDR || 720000) * r1 + (p2.quality.costPerTonIDR || 620000) * r2 + (p3.quality.costPerTonIDR || 780000) * r3) / 100
        );

        recipes.push({
          recipeId: "RECIPE-OPT-03",
          recipeName: `AI Triple-Stockpile Balanced Recipe (40% ${p1.stockpileCode} + 35% ${p2.stockpileCode} + 25% ${p3.stockpileCode})`,
          strategy: "BALANCED_SPEC",
          matchScorePercent: 96.0,
          components: [
            {
              stockpileId: p1.id,
              stockpileCode: p1.stockpileCode,
              stockpileName: p1.stockpileName,
              coalType: p1.coalType,
              tonnage: (targetTonnage * r1) / 100,
              percentage: r1,
              cvGAR: p1.quality.cvGAR,
              ash: p1.quality.ash,
              sulfur: p1.quality.sulfur,
              totalMoisture: p1.quality.totalMoisture,
              unitCostIDR: p1.quality.costPerTonIDR || 720000,
              locationArea: p1.location.area,
            },
            {
              stockpileId: p2.id,
              stockpileCode: p2.stockpileCode,
              stockpileName: p2.stockpileName,
              coalType: p2.coalType,
              tonnage: (targetTonnage * r2) / 100,
              percentage: r2,
              cvGAR: p2.quality.cvGAR,
              ash: p2.quality.ash,
              sulfur: p2.quality.sulfur,
              totalMoisture: p2.quality.totalMoisture,
              unitCostIDR: p2.quality.costPerTonIDR || 620000,
              locationArea: p2.location.area,
            },
            {
              stockpileId: p3.id,
              stockpileCode: p3.stockpileCode,
              stockpileName: p3.stockpileName,
              coalType: p3.coalType,
              tonnage: (targetTonnage * r3) / 100,
              percentage: r3,
              cvGAR: p3.quality.cvGAR,
              ash: p3.quality.ash,
              sulfur: p3.quality.sulfur,
              totalMoisture: p3.quality.totalMoisture,
              unitCostIDR: p3.quality.costPerTonIDR || 780000,
              locationArea: p3.location.area,
            },
          ],
          blendedQuality: {
            cvGAR: blendedCV,
            ash: blendedAsh,
            sulfur: blendedTS,
            totalMoisture: blendedTM,
            volatileMatter: 38.0,
            hgi: 49,
          },
          specCompliance: {
            cvOk: blendedCV >= minGAR,
            ashOk: blendedAsh <= maxAsh,
            sulfurOk: blendedTS <= maxSulfur,
            moistureOk: blendedTM <= maxMoisture,
            isAllCompliant: blendedCV >= minGAR && blendedAsh <= maxAsh && blendedTS <= maxSulfur && blendedTM <= maxMoisture,
            cvDelta: blendedCV - targetGAR,
            ashDelta: Number((maxAsh - blendedAsh).toFixed(2)),
            sulfurDelta: Number((maxSulfur - blendedTS).toFixed(2)),
          },
          financials: {
            costPerTonIDR: blendedCost,
            totalCostIDR: blendedCost * targetTonnage,
            estimatedSavingsIDR: 45000 * targetTonnage,
            highGradeSavedTon: (targetTonnage * (r2 + r3)) / 100,
          },
          riskAssessment: {
            spontaneousRiskScore: "LOW",
            rehandlingComplexity: "COMPLEX",
            aiRecommendationRationale: `Formula 3-way blending menghasilkan homogenitas kualitas batubara paling stabil dan minim deviasi saat sampling palka kapal di Jetty Terminal.`,
          },
        });
      }

      setAiGeneratedRecipes(recipes);
      setSelectedRecipeIndex(0);
      setIsAiOptimizing(false);
    }, 600);
  };

  // Compute Active Simulator Metrics
  const activeSimSummary = useMemo(() => {
    let totalRatio = 0;
    let sumCV = 0;
    let sumAsh = 0;
    let sumTS = 0;
    let sumTM = 0;
    let sumCost = 0;

    const componentsData = simComponents.map((c) => {
      const sp = stockpiles.find((s) => s.id === c.stockpileId) || stockpiles[0];
      const ton = (targetTonnage * c.ratio) / 100;
      totalRatio += c.ratio;
      sumCV += (sp?.quality.cvGAR || 5000) * c.ratio;
      sumAsh += (sp?.quality.ash || 7) * c.ratio;
      sumTS += (sp?.quality.sulfur || 0.7) * c.ratio;
      sumTM += (sp?.quality.totalMoisture || 26) * c.ratio;
      sumCost += (sp?.quality.costPerTonIDR || 700000) * c.ratio;

      return {
        stockpile: sp,
        ratio: c.ratio,
        tonnage: ton,
        isCapacitySufficient: (sp?.availableQuantity || sp?.currentQuantity || 0) >= ton,
      };
    });

    const factor = totalRatio > 0 ? totalRatio : 100;
    const calcCV = Math.round(sumCV / factor);
    const calcAsh = Number((sumAsh / factor).toFixed(2));
    const calcTS = Number((sumTS / factor).toFixed(2));
    const calcTM = Number((sumTM / factor).toFixed(2));
    const calcCost = Math.round(sumCost / factor);

    const isCvOk = calcCV >= minGAR;
    const isAshOk = calcAsh <= maxAsh;
    const isTsOk = calcTS <= maxSulfur;
    const isTmOk = calcTM <= maxMoisture;
    const isAllOk = isCvOk && isAshOk && isTsOk && isTmOk && totalRatio === 100;

    return {
      totalRatio,
      calcCV,
      calcAsh,
      calcTS,
      calcTM,
      calcCost,
      isCvOk,
      isAshOk,
      isTsOk,
      isTmOk,
      isAllOk,
      componentsData,
    };
  }, [simComponents, stockpiles, targetTonnage, minGAR, maxAsh, maxSulfur, maxMoisture]);

  // Apply Recipe to Simulator
  const handleApplyRecipeToSimulator = (recipe: BlendingAiRecipe) => {
    const newSim = recipe.components.map((c) => ({
      stockpileId: c.stockpileId,
      ratio: c.percentage,
    }));
    setSimComponents(newSim);
  };

  // Convert Simulated/AI Recipe to Formal Blending Plan
  const handleSaveAsOfficialPlan = (recipe?: BlendingAiRecipe) => {
    if (recipe) {
      const newPlan: BlendingPlan = {
        id: `BP-${Date.now()}`,
        blendingPlanId: `BP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
        companyId: "COMP-01",
        siteId: "SITE-BBNU-01",
        blendingPlanCode: `BP-AI-${recipe.blendedQuality.cvGAR}-${recipe.strategy.slice(0, 4)}`,
        targetProduct: `${recipe.recipeName} (${recipe.blendedQuality.cvGAR} GAR)`,
        targetQuantity: targetTonnage,
        targetQuality: {
          cvGAR: targetGAR,
          ash: maxAsh,
          totalMoisture: maxMoisture,
          sulfur: maxSulfur,
        },
        sourceStockpiles: recipe.components.map((c) => ({
          stockpileId: c.stockpileId,
          stockpileName: c.stockpileName,
          coalType: c.coalType,
          quantity: c.tonnage,
          percentage: c.percentage,
          cvGAR: c.cvGAR,
          ash: c.ash,
          totalMoisture: c.totalMoisture,
          sulfur: c.sulfur,
        })),
        expectedQuality: {
          cvGAR: recipe.blendedQuality.cvGAR,
          ash: recipe.blendedQuality.ash,
          totalMoisture: recipe.blendedQuality.totalMoisture,
          sulfur: recipe.blendedQuality.sulfur,
        },
        status: "APPROVED",
        plannedDate: new Date().toISOString().split("T")[0],
        approvedBy: "AI Certified Mining Optimizer (Auto-Verified)",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAddBlendingPlan(newPlan);
    } else {
      // From manual simulator
      const newPlan: BlendingPlan = {
        id: `BP-${Date.now()}`,
        blendingPlanId: `BP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
        companyId: "COMP-01",
        siteId: "SITE-BBNU-01",
        blendingPlanCode: `BP-SIM-${activeSimSummary.calcCV}`,
        targetProduct: `Simulated Blend ${activeSimSummary.calcCV} GAR (${vesselType})`,
        targetQuantity: targetTonnage,
        targetQuality: {
          cvGAR: targetGAR,
          ash: maxAsh,
          totalMoisture: maxMoisture,
          sulfur: maxSulfur,
        },
        sourceStockpiles: activeSimSummary.componentsData.map((c) => ({
          stockpileId: c.stockpile.id,
          stockpileName: c.stockpile.stockpileName,
          coalType: c.stockpile.coalType,
          quantity: c.tonnage,
          percentage: c.ratio,
          cvGAR: c.stockpile.quality.cvGAR,
          ash: c.stockpile.quality.ash,
          totalMoisture: c.stockpile.quality.totalMoisture,
          sulfur: c.stockpile.quality.sulfur,
        })),
        expectedQuality: {
          cvGAR: activeSimSummary.calcCV,
          ash: activeSimSummary.calcAsh,
          totalMoisture: activeSimSummary.calcTM,
          sulfur: activeSimSummary.calcTS,
        },
        status: "SUBMITTED",
        plannedDate: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAddBlendingPlan(newPlan);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 uppercase tracking-wider">
              AI-POWERED COAL BLENDING OPTIMIZER
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/20">
              {candidateStockpiles.length} Active Stockpiles Available
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Coal Blending & Quality Target Optimization
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Sistem cerdas AI untuk mencari kombinasi blending paling optimal berdasarkan <strong>Target GAR, Ash, dan Sulfur</strong> tertentu untuk memaksimalkan profit margin, menjaga kepatuhan spesifikasi kontrak kapal, serta mencegah <i>spontaneous combustion</i> pada stockpile berumur tinggi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onOpenAICopilot) {
                onOpenAICopilot(
                  `Analisis skenario optimasi blending untuk target ${targetGAR} GAR, max Ash ${maxAsh}%, max Sulfur ${maxSulfur}% dengan volume ${targetTonnage} Ton pada stockpile site BBNU-01.`
                );
              }
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Tanya AI Copilot</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: TARGET SPECIFICATION & AI OPTIMIZATION CONTROLS */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-900/60 rounded-2xl p-6 shadow-xl text-white space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-800/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                AI Blending Engine: Target Specification & Solver
              </h3>
              <p className="text-xs text-indigo-200/80">
                Masukkan parameter kontrak garansi pembeli — AI akan melakukan pencarian kombinasi multi-pile terbaik
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runAiOptimization}
              disabled={isAiOptimizing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isAiOptimizing ? "animate-spin" : ""}`} />
              <span>{isAiOptimizing ? "AI Calculating Optimum..." : "Run AI Blending Solver"}</span>
            </button>
          </div>
        </div>

        {/* Input Target Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Target GAR */}
          <div className="bg-slate-800/60 border border-indigo-800/30 rounded-xl p-3.5 space-y-1">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
              1. Target GAR (kcal/kg)
            </label>
            <input
              type="number"
              value={targetGAR}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTargetGAR(val);
                setMinGAR(val - 50);
              }}
              className="w-full bg-slate-900 border border-indigo-700/50 rounded-lg px-3 py-1.5 text-lg font-black text-white focus:outline-none focus:border-amber-400 font-mono"
            />
            <span className="text-[10px] text-slate-400 block">Toleransi Min: {minGAR} kcal/kg</span>
          </div>

          {/* Target Ash */}
          <div className="bg-slate-800/60 border border-indigo-800/30 rounded-xl p-3.5 space-y-1">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
              2. Target Max Ash (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={maxAsh}
              onChange={(e) => setMaxAsh(Number(e.target.value))}
              className="w-full bg-slate-900 border border-indigo-700/50 rounded-lg px-3 py-1.5 text-lg font-black text-white focus:outline-none focus:border-amber-400 font-mono"
            />
            <span className="text-[10px] text-slate-400 block">Kadar Abu Maksimum</span>
          </div>

          {/* Target Sulfur */}
          <div className="bg-slate-800/60 border border-indigo-800/30 rounded-xl p-3.5 space-y-1">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
              3. Target Max Sulfur (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={maxSulfur}
              onChange={(e) => setMaxSulfur(Number(e.target.value))}
              className="w-full bg-slate-900 border border-indigo-700/50 rounded-lg px-3 py-1.5 text-lg font-black text-white focus:outline-none focus:border-amber-400 font-mono"
            />
            <span className="text-[10px] text-slate-400 block">Total Sulfur (TS arb)</span>
          </div>

          {/* Target Total Moisture */}
          <div className="bg-slate-800/60 border border-indigo-800/30 rounded-xl p-3.5 space-y-1">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
              4. Max Moisture TM (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={maxMoisture}
              onChange={(e) => setMaxMoisture(Number(e.target.value))}
              className="w-full bg-slate-900 border border-indigo-700/50 rounded-lg px-3 py-1.5 text-lg font-black text-white focus:outline-none focus:border-amber-400 font-mono"
            />
            <span className="text-[10px] text-slate-400 block">Total Moisture (ARB)</span>
          </div>

          {/* Target Tonnage */}
          <div className="bg-slate-800/60 border border-indigo-800/30 rounded-xl p-3.5 space-y-1">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
              5. Dispatched Tonnage
            </label>
            <input
              type="number"
              step="1000"
              value={targetTonnage}
              onChange={(e) => setTargetTonnage(Number(e.target.value))}
              className="w-full bg-slate-900 border border-indigo-700/50 rounded-lg px-3 py-1.5 text-lg font-black text-white focus:outline-none focus:border-amber-400 font-mono"
            />
            <span className="text-[10px] text-slate-400 block">Tonase Batch Blend</span>
          </div>

          {/* Optimization Goal Strategy */}
          <div className="bg-slate-800/60 border border-indigo-800/30 rounded-xl p-3.5 space-y-1">
            <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
              6. Solver Strategy
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value as any)}
              className="w-full bg-slate-900 border border-indigo-700/50 rounded-lg px-2.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
            >
              <option value="PROFIT_MAXIMIZATION">Profit Maximization</option>
              <option value="BALANCED_SPEC">Balanced Spec</option>
              <option value="AGING_DEPLETION">Aging Stock Clearance</option>
              <option value="LOWEST_REHANDLING">Lowest Rehandling</option>
            </select>
            <span className="text-[10px] text-slate-400 block">Prioritas Algoritma AI</span>
          </div>
        </div>

        {/* Quick Vessel Size Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold">Quick Batch Presets:</span>
          {[
            { label: "Barge 300ft (8,000 Ton)", tons: 8000 },
            { label: "Handymax (35,000 Ton)", tons: 35000 },
            { label: "Panamax (55,000 Ton)", tons: 55000 },
            { label: "Capesize (100,000 Ton)", tons: 100000 },
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTargetTonnage(preset.tons);
                setVesselType(preset.label);
              }}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                targetTonnage === preset.tons
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: AI GENERATED BLENDING COMBINATIONS (TOP 3 RECIPES) */}
      {/* ========================================================================= */}
      {aiGeneratedRecipes && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Top AI Blending Combinations Found ({aiGeneratedRecipes.length} Optimal Recipes)
            </h3>
            <span className="text-xs text-slate-500">
              Evaluated across {candidateStockpiles.length} available stockpiles
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {aiGeneratedRecipes.map((recipe, idx) => {
              const isSelected = selectedRecipeIndex === idx;
              return (
                <div
                  key={recipe.recipeId}
                  onClick={() => setSelectedRecipeIndex(idx)}
                  className={`rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? "bg-white dark:bg-[#111A2C] border-indigo-600 dark:border-indigo-500 shadow-lg ring-2 ring-indigo-500/20"
                      : "bg-white dark:bg-[#111A2C] border-slate-200 dark:border-slate-800 hover:border-indigo-300 opacity-90"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider">
                        {recipe.strategy.replace(/_/g, " ")}
                      </span>
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{recipe.matchScorePercent}% Match</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {recipe.recipeName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {recipe.riskAssessment.aiRecommendationRationale}
                      </p>
                    </div>

                    {/* Component Pills */}
                    <div className="space-y-1.5 pt-1">
                      {recipe.components.map((comp, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                        >
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {comp.percentage}% {comp.stockpileCode}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {comp.cvGAR} GAR • Ash {comp.ash}% • TS {comp.sulfur}%
                            </span>
                          </div>
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {comp.tonnage.toLocaleString()} Ton
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Resulting Blended Quality Summary */}
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-center">
                      <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40">
                        <span className="text-[9px] text-slate-400 block uppercase">GAR</span>
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 font-mono">
                          {recipe.blendedQuality.cvGAR}
                        </span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-[9px] text-slate-400 block uppercase">Ash</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {recipe.blendedQuality.ash}%
                        </span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-[9px] text-slate-400 block uppercase">Sulfur</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {recipe.blendedQuality.sulfur}%
                        </span>
                      </div>
                      <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-[9px] text-slate-400 block uppercase">TM</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {recipe.blendedQuality.totalMoisture}%
                        </span>
                      </div>
                    </div>

                    {/* Financial Gain */}
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <span className="font-semibold">Financial Margin Gain:</span>
                      <span className="font-bold font-mono">
                        +Rp {(recipe.financials.estimatedSavingsIDR / 1000000).toFixed(0)} Juta
                      </span>
                    </div>
                  </div>

                  {/* Actions for Recipe */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyRecipeToSimulator(recipe);
                      }}
                      className="flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Apply to Simulator</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveAsOfficialPlan(recipe);
                      }}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Create Work Order</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: MULTI-STOCKPILE INTERACTIVE BLENDING SIMULATOR */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Multi-Stockpile Live Quality Blend Simulator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Atur rasio slider persentase untuk simulasi live weighted quality vs garansi kontrak
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                activeSimSummary.isAllOk
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
              }`}
            >
              {activeSimSummary.isAllOk ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span>
                {activeSimSummary.isAllOk
                  ? "TARGET CONTRACT SPEC PASSED"
                  : "OUT OF SPEC / RATIO MISMATCH"}
              </span>
            </span>

            <button
              onClick={() => handleSaveAsOfficialPlan()}
              disabled={!activeSimSummary.isAllOk}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4" />
              <span>Submit Blending Plan</span>
            </button>
          </div>
        </div>

        {/* Live Gauges & Spec Validation Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* GAR Result */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Composite GAR (kcal/kg)
            </span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {activeSimSummary.calcCV}
            </div>
            <div className="text-[11px] pt-1">
              <span
                className={`font-bold ${
                  activeSimSummary.isCvOk ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {activeSimSummary.isCvOk
                  ? `✓ On Spec (Min ${minGAR})`
                  : `✕ Below Min (${minGAR})`}
              </span>
            </div>
          </div>

          {/* Ash Result */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Composite Ash (%)
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {activeSimSummary.calcAsh}%
            </div>
            <div className="text-[11px] pt-1">
              <span
                className={`font-bold ${
                  activeSimSummary.isAshOk ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {activeSimSummary.isAshOk
                  ? `✓ Under Max (${maxAsh}%)`
                  : `✕ Exceeds Max (${maxAsh}%)`}
              </span>
            </div>
          </div>

          {/* Sulfur Result */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Composite Total Sulfur (%)
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {activeSimSummary.calcTS}%
            </div>
            <div className="text-[11px] pt-1">
              <span
                className={`font-bold ${
                  activeSimSummary.isTsOk ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {activeSimSummary.isTsOk
                  ? `✓ Under Max (${maxSulfur}%)`
                  : `✕ Exceeds Max (${maxSulfur}%)`}
              </span>
            </div>
          </div>

          {/* Moisture Result */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Composite Moisture TM (%)
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {activeSimSummary.calcTM}%
            </div>
            <div className="text-[11px] pt-1">
              <span
                className={`font-bold ${
                  activeSimSummary.isTmOk ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {activeSimSummary.isTmOk
                  ? `✓ Under Max (${maxMoisture}%)`
                  : `✕ Exceeds Max (${maxMoisture}%)`}
              </span>
            </div>
          </div>

          {/* Cost Result */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Blended Unit Cost
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              Rp {activeSimSummary.calcCost.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400 pt-1">Per Ton (Ex-Stockpile)</p>
          </div>
        </div>

        {/* Dynamic Multi-Component Rows */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Source Stockpiles & Ratio Allocation (Total: {activeSimSummary.totalRatio}%)
            </h4>

            {simComponents.length < 4 && (
              <button
                onClick={() => {
                  const unusedPile = candidateStockpiles.find(
                    (p) => !simComponents.some((c) => c.stockpileId === p.id)
                  );
                  if (unusedPile) {
                    setSimComponents([
                      ...simComponents,
                      { stockpileId: unusedPile.id, ratio: 10 },
                    ]);
                  }
                }}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Stockpile Component</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {simComponents.map((comp, idx) => {
              const sp = stockpiles.find((s) => s.id === comp.stockpileId) || stockpiles[0];
              const ton = (targetTonnage * comp.ratio) / 100;
              const hasEnoughStock = (sp?.availableQuantity || sp?.currentQuantity || 0) >= ton;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <select
                        value={comp.stockpileId}
                        onChange={(e) => {
                          const newComps = [...simComponents];
                          newComps[idx].stockpileId = e.target.value;
                          setSimComponents(newComps);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                      >
                        {candidateStockpiles.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.stockpileCode} • {p.stockpileName} ({p.quality.cvGAR} GAR, Ash {p.quality.ash}%, TS {p.quality.sulfur}%)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500">
                        Available Stock:{" "}
                        <strong className="text-slate-800 dark:text-slate-200">
                          {(sp?.availableQuantity || sp?.currentQuantity || 0).toLocaleString()} Ton
                        </strong>
                      </span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        Allocated: {ton.toLocaleString()} Ton
                      </span>
                      {simComponents.length > 2 && (
                        <button
                          onClick={() => {
                            setSimComponents(simComponents.filter((_, i) => i !== idx));
                          }}
                          className="text-rose-500 hover:text-rose-600 font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Ratio Slider */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Blending Ratio:</span>
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">
                        {comp.ratio}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={comp.ratio}
                      onChange={(e) => {
                        const newRatio = Number(e.target.value);
                        const newComps = [...simComponents];
                        newComps[idx].ratio = newRatio;
                        setSimComponents(newComps);
                      }}
                      className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                    />
                  </div>

                  {!hasEnoughStock && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>
                        Stok stockpile tidak mencukupi untuk alokasi {ton.toLocaleString()} Ton (sisa {(sp?.availableQuantity || sp?.currentQuantity || 0).toLocaleString()} Ton).
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: ACTIVE & EXECUTED BLENDING PLANS REGISTRY */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#111A2C] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-indigo-500" />
            Official Coal Blending Work Orders & Historical Plans
          </h4>
          <span className="text-xs text-slate-500 font-semibold">
            Total {blendingPlans.length} Blending Plans Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Plan Code</th>
                <th className="py-2.5 px-3">Target Product</th>
                <th className="py-2.5 px-3 text-right">Tonnage</th>
                <th className="py-2.5 px-3">Source Stockpiles</th>
                <th className="py-2.5 px-3 text-right">Expected GAR</th>
                <th className="py-2.5 px-3 text-right">Ash %</th>
                <th className="py-2.5 px-3 text-right">Sulfur %</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {blendingPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {plan.blendingPlanCode}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {plan.targetProduct}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {plan.targetQuantity.toLocaleString()} Ton
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {plan.sourceStockpiles.map((src, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold"
                        >
                          {src.percentage}% {src.stockpileName.split(" ")[0]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                    {plan.expectedQuality.cvGAR}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                    {plan.expectedQuality.ash}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                    {plan.expectedQuality.sulfur}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        plan.status === "APPROVED"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : plan.status === "EXECUTED"
                          ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
                          : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      }`}
                    >
                      {plan.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {plan.status === "SUBMITTED" ? (
                      <button
                        onClick={() =>
                          onUpdateBlendingPlan({
                            ...plan,
                            status: "APPROVED",
                            approvedBy: "Manager Mine Planning (Approved)",
                          })
                        }
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all cursor-pointer"
                      >
                        Approve Plan
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Ready to Dispatch</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
