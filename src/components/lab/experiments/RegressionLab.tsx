import { useState, useMemo } from "react";
import { TrendingUp, RotateCcw, Shuffle, Sparkles, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MathView } from "../MathView";

export function RegressionLab() {
  const [treeCount, setTreeCount] = useState<number>(6);
  const [trueTarget, setTrueTarget] = useState<number>(45.0);

  // Individual tree continuous predictions
  const [treePredictions, setTreePredictions] = useState<number[]>([
    42.5, 48.0, 39.2, 51.0, 44.8, 46.2,
  ]);

  const activePredictions = useMemo(() => {
    if (treePredictions.length === treeCount) return treePredictions;
    if (treePredictions.length < treeCount) {
      const next = [...treePredictions];
      for (let i = treePredictions.length; i < treeCount; i++) {
        // Sample noisy estimate around trueTarget
        const noise = (Math.random() - 0.5) * 16;
        next.push(Number((trueTarget + noise).toFixed(1)));
      }
      return next;
    }
    return treePredictions.slice(0, treeCount);
  }, [treePredictions, treeCount, trueTarget]);

  const updatePrediction = (index: number, val: number) => {
    setTreePredictions((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const randomizePredictions = () => {
    setTreePredictions(
      Array.from({ length: treeCount }, () => {
        const noise = (Math.random() - 0.5) * 20;
        return Number((trueTarget + noise).toFixed(1));
      }),
    );
  };

  const handleReset = () => {
    setTreeCount(6);
    setTrueTarget(45.0);
    setTreePredictions([42.5, 48.0, 39.2, 51.0, 44.8, 46.2]);
  };

  // Compute ensemble mean and statistics
  const ensembleMean = useMemo(() => {
    const sum = activePredictions.reduce((acc, v) => acc + v, 0);
    return sum / activePredictions.length;
  }, [activePredictions]);

  const sampleVariance = useMemo(() => {
    if (activePredictions.length < 2) return 0;
    const sumSq = activePredictions.reduce(
      (acc, v) => acc + Math.pow(v - ensembleMean, 2),
      0,
    );
    return sumSq / (activePredictions.length - 1);
  }, [activePredictions, ensembleMean]);

  const standardError = useMemo(() => {
    return Math.sqrt(sampleVariance / activePredictions.length);
  }, [sampleVariance, activePredictions.length]);

  const ensembleError = Math.abs(ensembleMean - trueTarget);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Mathematical Principle */}
      <div className="surface p-5 border-l-4 border-l-success">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="size-4 text-success" />
          Continuous Regression Aggregation & Noise Reduction
        </h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Random Forest regression aggregates continuous tree leaf outputs via arithmetic mean.
          For B estimators with variance σ², the standard error of the aggregated estimate decays
          at rate <span className="font-mono text-accent">σ / √B</span>.
        </p>
        <div className="my-3 rounded-lg border border-border bg-secondary/30 p-2.5 text-center overflow-x-auto">
          <MathView
            math="\hat{y} = \frac{1}{B} \sum_{b=1}^{B} T_b(x), \qquad \operatorname{SE}(\hat{y}) = \frac{\sigma}{\sqrt{B}}"
            display
          />
        </div>
      </div>

      {/* Interactive Controls & Parameters */}
      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="surface p-5 space-y-6">
          <div className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
            Continuous Aggregation Settings
          </div>

          <div>
            <div className="flex justify-between text-xs text-foreground font-medium mb-2">
              <span>Number of Trees (B):</span>
              <span className="font-mono text-accent">{treeCount} trees</span>
            </div>
            <Slider
              value={[treeCount]}
              onValueChange={([val]) => val && setTreeCount(val)}
              min={2}
              max={12}
              step={1}
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-foreground font-medium mb-2">
              <span>Ground Truth Target (y):</span>
              <span className="font-mono text-success">{trueTarget}</span>
            </div>
            <Slider
              value={[trueTarget]}
              onValueChange={([val]) => val && setTrueTarget(val)}
              min={20}
              max={80}
              step={1}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={randomizePredictions} className="flex-1 gap-1.5 text-xs">
              <Shuffle className="size-3.5" />
              Simulate Tree Noise
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset} className="text-xs gap-1">
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          </div>

          {/* Aggregated Statistical Output */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">True Target y:</span>
              <span className="font-mono font-semibold text-foreground">{trueTarget.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">Ensemble Mean ŷ:</span>
              <span className="font-mono font-bold text-primary">{ensembleMean.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ensemble Absolute Error:</span>
              <span className="font-mono font-semibold text-success">
                {ensembleError.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">Tree Sample Variance s²:</span>
              <span className="font-mono text-muted-foreground">{sampleVariance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Standard Error SE(ŷ):</span>
              <span className="font-mono text-accent font-semibold">{standardError.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Tree Predictions & Deviation Visualizer */}
        <div className="surface p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
              Individual Tree Outputs T_b(x)
            </span>
            <span className="text-[11px] text-muted-foreground">
              Mean ŷ = {ensembleMean.toFixed(2)}
            </span>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {activePredictions.map((val, idx) => {
              const diffFromMean = val - ensembleMean;
              const diffFromTrue = val - trueTarget;

              return (
                <div key={idx} className="rounded-xl border border-border bg-card p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-foreground">Tree #{idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-[11px]">
                        Err: {diffFromTrue > 0 ? `+${diffFromTrue.toFixed(1)}` : diffFromTrue.toFixed(1)}
                      </span>
                      <span className="rounded bg-primary/10 border border-primary/25 px-2 py-0.5 text-[11px] font-bold text-primary">
                        {val.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <Slider
                    value={[val]}
                    onValueChange={([newVal]) => newVal !== undefined && updatePrediction(idx, newVal)}
                    min={10}
                    max={90}
                    step={0.5}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>10.0</span>
                    <span>Deviation from ensemble mean: {diffFromMean > 0 ? `+${diffFromMean.toFixed(1)}` : diffFromMean.toFixed(1)}</span>
                    <span>90.0</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
