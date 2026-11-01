import { useState, useMemo } from "react";
import { Scale, RotateCcw, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MathView } from "../MathView";

export function BiasVarianceLab() {
  const [treeDepth, setTreeDepth] = useState<number>(10); // Controls individual tree bias & variance
  const [numTrees, setNumTrees] = useState<number>(100);
  const [correlation, setCorrelation] = useState<number>(0.25); // Pairwise correlation rho
  const [noise] = useState<number>(10.0); // Irreducible noise

  // Derived individual tree properties as a function of depth
  // Deeper trees have lower bias but higher variance
  const treeVariance = useMemo(() => {
    return Math.min(100, 10 + treeDepth * 6.5);
  }, [treeDepth]);

  const treeBiasSq = useMemo(() => {
    return Math.max(2, 60 / (1 + 0.3 * treeDepth));
  }, [treeDepth]);

  // Breiman-Hastie Ensemble Variance Formula:
  // Var(Ensemble) = rho * sigma^2 + ((1 - rho) / B) * sigma^2
  const ensembleVariance = useMemo(() => {
    return correlation * treeVariance + ((1 - correlation) / numTrees) * treeVariance;
  }, [correlation, treeVariance, numTrees]);

  const asymptoticFloor = useMemo(() => {
    return correlation * treeVariance;
  }, [correlation, treeVariance]);

  const singleTreeTotalError = useMemo(() => {
    return treeBiasSq + treeVariance + noise;
  }, [treeBiasSq, treeVariance, noise]);

  const ensembleTotalError = useMemo(() => {
    return treeBiasSq + ensembleVariance + noise;
  }, [treeBiasSq, ensembleVariance, noise]);

  const handleReset = () => {
    setTreeDepth(10);
    setNumTrees(100);
    setCorrelation(0.25);
  };

  // Generate curve points for SVG error plot vs B (1 to 200 trees)
  const plotPoints = useMemo(() => {
    const pts: { b: number; variance: number; total: number }[] = [];
    const sampleB = [1, 2, 5, 10, 20, 35, 50, 75, 100, 150, 200];
    sampleB.forEach((b) => {
      const v = correlation * treeVariance + ((1 - correlation) / b) * treeVariance;
      pts.push({ b, variance: v, total: treeBiasSq + v + noise });
    });
    return pts;
  }, [correlation, treeVariance, treeBiasSq, noise]);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Mathematical Formulation & Assumptions */}
      <div className="surface p-5 border-l-4 border-l-accent">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Scale className="size-4 text-accent" />
          Breiman-Hastie Ensemble Variance Decomposition
        </h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          For B identically distributed base estimators with individual prediction variance σ² and average
          pairwise correlation ρ, the ensemble variance is mathematically bounded by:
        </p>
        <div className="my-3 rounded-lg border border-border bg-secondary/30 p-2.5 text-center overflow-x-auto">
          <MathView
            math="\operatorname{Var}(\bar{f}) = \rho \sigma^2 + \frac{1 - \rho}{B} \sigma^2 \xrightarrow{B \to \infty} \rho \sigma^2"
            display
          />
        </div>
        <div className="rounded border border-border bg-background p-3 text-[11px] text-muted-foreground space-y-1">
          <span className="font-semibold text-foreground">Model Assumptions:</span>
          <p>
            1. All base trees are identically distributed with equal variance σ².
            2. Any pair of distinct trees (T_i, T_j) has equal pairwise correlation ρ.
            3. Model errors are additive with zero-mean irreducible environmental noise σ²_ε.
          </p>
        </div>
      </div>

      {/* Interactive Controls & Parameters */}
      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="surface p-5 space-y-6">
          <div className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
            Decomposition Controls
          </div>

          <div>
            <div className="flex justify-between text-xs text-foreground font-medium mb-2">
              <span>Individual Tree Depth:</span>
              <span className="font-mono text-accent">Depth {treeDepth}</span>
            </div>
            <Slider
              value={[treeDepth]}
              onValueChange={([val]) => val && setTreeDepth(val)}
              min={2}
              max={20}
              step={1}
            />
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>Shallow (High Bias)</span>
              <span>Deep (High Variance)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-foreground font-medium mb-2">
              <span>Tree Correlation (ρ):</span>
              <span className="font-mono text-primary">{correlation.toFixed(2)}</span>
            </div>
            <Slider
              value={[correlation * 100]}
              onValueChange={([val]) => val !== undefined && setCorrelation(val / 100)}
              min={5}
              max={80}
              step={5}
            />
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>ρ = 0.05 (High Subspace Decorrelation)</span>
              <span>ρ = 0.80</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-foreground font-medium mb-2">
              <span>Number of Trees (B):</span>
              <span className="font-mono text-success">{numTrees} trees</span>
            </div>
            <Slider
              value={[numTrees]}
              onValueChange={([val]) => val && setNumTrees(val)}
              min={1}
              max={200}
              step={5}
            />
          </div>

          <div className="pt-2">
            <Button size="sm" variant="outline" onClick={handleReset} className="w-full text-xs gap-1">
              <RotateCcw className="size-3.5" />
              Reset Parameters
            </Button>
          </div>

          {/* Computed Metrics */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Individual Tree Bias²:</span>
              <span className="font-mono font-semibold text-foreground">{treeBiasSq.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Individual Tree Variance σ²:</span>
              <span className="font-mono font-semibold text-foreground">{treeVariance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">Ensemble Variance:</span>
              <span className="font-mono font-bold text-accent">{ensembleVariance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Asymptotic Floor (ρσ²):</span>
              <span className="font-mono text-muted-foreground">{asymptoticFloor.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">Total Expected Error:</span>
              <span className="font-mono font-bold text-success">{ensembleTotalError.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Visualizer Canvas & Comparison */}
        <div className="surface p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
              Ensemble Error Curve vs Number of Trees (B)
            </span>
            <span className="text-[11px] text-accent font-mono">
              Variance reduced by {((1 - ensembleVariance / treeVariance) * 100).toFixed(1)}%
            </span>
          </div>

          {/* SVG Line Graph */}
          <div className="relative rounded-xl border border-border bg-grid p-4">
            <svg viewBox="0 0 500 220" className="w-full h-auto">
              {/* Axes */}
              <line x1="40" y1="180" x2="480" y2="180" stroke="var(--border)" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="180" stroke="var(--border)" strokeWidth="1.5" />

              {/* Floor line (rho * sigma^2) */}
              {(() => {
                const floorY = 180 - (asymptoticFloor / 120) * 160;
                return (
                  <g>
                    <line x1="40" y1={floorY} x2="480" y2={floorY} stroke="var(--accent)" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="475" y={floorY - 4} textAnchor="end" fill="var(--accent)" fontSize="9">
                      Asymptotic Floor ρσ² ({asymptoticFloor.toFixed(1)})
                    </text>
                  </g>
                );
              })()}

              {/* Total Error Curve */}
              <polyline
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2.5"
                points={plotPoints
                  .map((p) => {
                    const x = 40 + (p.b / 200) * 440;
                    const y = 180 - (p.total / 120) * 160;
                    return `${x},${Math.max(20, y)}`;
                  })
                  .join(" ")}
              />

              {/* Ensemble Variance Curve */}
              <polyline
                fill="none"
                stroke="var(--success)"
                strokeWidth="2"
                strokeDasharray="4 2"
                points={plotPoints
                  .map((p) => {
                    const x = 40 + (p.b / 200) * 440;
                    const y = 180 - (p.variance / 120) * 160;
                    return `${x},${Math.max(20, y)}`;
                  })
                  .join(" ")}
              />

              {/* Active Point marker */}
              {(() => {
                const curX = 40 + (numTrees / 200) * 440;
                const curY = Math.max(20, 180 - (ensembleTotalError / 120) * 160);
                return (
                  <g>
                    <line x1={curX} y1={curY} x2={curX} y2="180" stroke="var(--primary)" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx={curX} cy={curY} r="5" fill="var(--primary)" />
                    <text x={curX} y={Math.max(15, curY - 8)} textAnchor="middle" fill="var(--primary)" fontSize="10" fontWeight="bold">
                      B = {numTrees}
                    </text>
                  </g>
                );
              })()}

              <text x="260" y="205" textAnchor="middle" fill="var(--muted-foreground)" fontSize="10">
                Number of Trees B (1 → 200) →
              </text>
            </svg>
          </div>

          {/* Comparative Summary Cards */}
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="surface p-3.5 border-border">
              <span className="font-semibold text-muted-foreground">Single Unpruned Tree (B = 1):</span>
              <div className="mt-1 font-mono text-base font-bold text-destructive">
                Error: {singleTreeTotalError.toFixed(2)}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Suffers from high variance ({treeVariance.toFixed(1)}).
              </p>
            </div>
            <div className="surface p-3.5 border-success/30 bg-success/5">
              <span className="font-semibold text-success">Random Forest Ensemble (B = {numTrees}):</span>
              <div className="mt-1 font-mono text-base font-bold text-success">
                Error: {ensembleTotalError.toFixed(2)}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Variance reduced to {ensembleVariance.toFixed(1)} (Saving {(singleTreeTotalError - ensembleTotalError).toFixed(1)} error points).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
