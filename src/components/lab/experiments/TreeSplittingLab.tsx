import { useState, useMemo } from "react";
import { GitFork, RotateCcw, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MathView } from "../MathView";

interface DataPoint {
  id: number;
  x1: number;
  x2: number;
  label: 0 | 1;
}

const sampleDataset: DataPoint[] = [
  { id: 1, x1: 1.2, x2: 2.5, label: 0 },
  { id: 2, x1: 1.8, x2: 3.1, label: 0 },
  { id: 3, x1: 2.2, x2: 1.5, label: 0 },
  { id: 4, x1: 2.7, x2: 2.8, label: 0 },
  { id: 5, x1: 3.5, x2: 4.2, label: 0 },
  { id: 6, x1: 4.1, x2: 1.9, label: 1 },
  { id: 7, x1: 4.8, x2: 3.4, label: 1 },
  { id: 8, x1: 5.5, x2: 2.1, label: 1 },
  { id: 9, x1: 6.2, x2: 4.5, label: 1 },
  { id: 10, x1: 6.8, x2: 3.8, label: 1 },
];

export function TreeSplittingLab() {
  const [splitFeature, setSplitFeature] = useState<"x1" | "x2">("x1");
  const [threshold, setThreshold] = useState<number>(3.8);

  const handleReset = () => {
    setSplitFeature("x1");
    setThreshold(3.8);
  };

  // 1. Calculate Parent Node Impurity (N = 10: 5 Class 0, 5 Class 1)
  const parentGini = useMemo(() => {
    const p0 = 0.5;
    const p1 = 0.5;
    return 1 - (p0 * p0 + p1 * p1); // 0.500
  }, []);

  const parentEntropy = useMemo(() => {
    return -(0.5 * Math.log2(0.5) + 0.5 * Math.log2(0.5)); // 1.000
  }, []);

  // 2. Partition dataset based on splitFeature and threshold
  const partition = useMemo(() => {
    const left: DataPoint[] = [];
    const right: DataPoint[] = [];

    sampleDataset.forEach((pt) => {
      const val = splitFeature === "x1" ? pt.x1 : pt.x2;
      if (val <= threshold) {
        left.push(pt);
      } else {
        right.push(pt);
      }
    });

    const left0 = left.filter((pt) => pt.label === 0).length;
    const left1 = left.filter((pt) => pt.label === 1).length;
    const right0 = right.filter((pt) => pt.label === 0).length;
    const right1 = right.filter((pt) => pt.label === 1).length;

    const leftP0 = left.length > 0 ? left0 / left.length : 0;
    const leftP1 = left.length > 0 ? left1 / left.length : 0;
    const rightP0 = right.length > 0 ? right0 / right.length : 0;
    const rightP1 = right.length > 0 ? right1 / right.length : 0;

    const leftGini = left.length > 0 ? 1 - (leftP0 * leftP0 + leftP1 * leftP1) : 0;
    const rightGini = right.length > 0 ? 1 - (rightP0 * rightP0 + rightP1 * rightP1) : 0;

    const leftEntropy =
      left.length > 0
        ? -(
            (leftP0 > 0 ? leftP0 * Math.log2(leftP0) : 0) +
            (leftP1 > 0 ? leftP1 * Math.log2(leftP1) : 0)
          )
        : 0;

    const rightEntropy =
      right.length > 0
        ? -(
            (rightP0 > 0 ? rightP0 * Math.log2(rightP0) : 0) +
            (rightP1 > 0 ? rightP1 * Math.log2(rightP1) : 0)
          )
        : 0;

    const total = sampleDataset.length;
    const weightedGini = (left.length / total) * leftGini + (right.length / total) * rightGini;
    const weightedEntropy =
      (left.length / total) * leftEntropy + (right.length / total) * rightEntropy;

    const giniGain = parentGini - weightedGini;
    const infoGain = parentEntropy - weightedEntropy;

    return {
      left,
      right,
      left0,
      left1,
      right0,
      right1,
      leftGini,
      rightGini,
      leftEntropy,
      rightEntropy,
      weightedGini,
      weightedEntropy,
      giniGain,
      infoGain,
    };
  }, [splitFeature, threshold, parentGini, parentEntropy]);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Mathematical Principle */}
      <div className="surface p-5 border-l-4 border-l-primary">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <GitFork className="size-4 text-primary" />
          Binary Splitting & Impurity Reduction (CART Criterion)
        </h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          At every internal node, the decision tree algorithm tests all candidate features and thresholds
          to maximize Information Gain (or decrease in Gini impurity). The threshold that produces the
          purest child partitions is chosen as the optimal split point.
        </p>
        <div className="my-3 rounded-lg border border-border bg-secondary/30 p-2.5 text-center overflow-x-auto">
          <MathView
            math="\operatorname{IG}(S, A) = \operatorname{Gini}(S) - \left[ \frac{|S_L|}{|S|}\operatorname{Gini}(S_L) + \frac{|S_R|}{|S|}\operatorname{Gini}(S_R) \right]"
            display
          />
        </div>
      </div>

      {/* Interactive Controls & Parameters */}
      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="surface p-5 space-y-6">
          <div className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
            Split Configuration
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-2">
              Select Splitting Feature:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => {
                  setSplitFeature("x1");
                  setThreshold(3.8);
                }}
                className={`rounded-lg border p-2 text-center font-mono text-xs transition-colors ${
                  splitFeature === "x1"
                    ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary/30"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                Feature X₁ (Horizontal)
              </button>
              <button
                onClick={() => {
                  setSplitFeature("x2");
                  setThreshold(3.0);
                }}
                className={`rounded-lg border p-2 text-center font-mono text-xs transition-colors ${
                  splitFeature === "x2"
                    ? "border-primary bg-primary/10 text-primary font-bold ring-1 ring-primary/30"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                Feature X₂ (Vertical)
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-foreground font-medium mb-2">
              <span>Split Threshold (t):</span>
              <span className="font-mono text-accent">
                {splitFeature.toUpperCase()} ≤ {threshold.toFixed(2)}
              </span>
            </div>
            <Slider
              value={[threshold * 10]}
              onValueChange={([val]) => val !== undefined && setThreshold(val / 10)}
              min={15}
              max={65}
              step={1}
            />
          </div>

          <div className="pt-2">
            <Button size="sm" variant="outline" onClick={handleReset} className="w-full text-xs gap-1">
              <RotateCcw className="size-3.5" />
              Reset to Optimal Split
            </Button>
          </div>

          {/* Computed Impurity Metrics */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Parent Gini:</span>
              <span className="font-mono font-semibold text-foreground">{parentGini.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weighted Child Gini:</span>
              <span className="font-mono font-semibold text-accent">
                {partition.weightedGini.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-muted-foreground font-medium text-foreground">
                Gini Information Gain:
              </span>
              <span className="font-mono font-bold text-success text-sm">
                {partition.giniGain > 0 ? `+${partition.giniGain.toFixed(3)}` : partition.giniGain.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-[11px]">
              <span className="text-muted-foreground">Shannon Entropy Gain:</span>
              <span className="font-mono text-foreground font-medium">
                {partition.infoGain.toFixed(3)} bits
              </span>
            </div>
          </div>
        </div>

        {/* 2D Partition Scatter Plot Canvas */}
        <div className="surface p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
              2D Feature Space & Partition Threshold
            </span>
            <span className="text-[11px] text-muted-foreground">
              {partition.left.length} left samples · {partition.right.length} right samples
            </span>
          </div>

          {/* Interactive SVG Plot */}
          <div className="relative rounded-xl border border-border bg-grid p-4">
            <svg viewBox="0 0 500 240" className="w-full h-auto">
              {/* Axes */}
              <line x1="40" y1="200" x2="480" y2="200" stroke="var(--border)" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="200" stroke="var(--border)" strokeWidth="1.5" />
              <text x="260" y="225" textAnchor="middle" fill="var(--muted-foreground)" fontSize="10">
                Feature X₁ →
              </text>
              <text x="20" y="110" textAnchor="middle" fill="var(--muted-foreground)" fontSize="10" transform="rotate(-90 20 110)">
                Feature X₂ →
              </text>

              {/* Threshold Partition Line */}
              {splitFeature === "x1" ? (
                (() => {
                  const lineX = 40 + ((threshold - 1.0) / 6.0) * 440;
                  return (
                    <g>
                      <line x1={lineX} y1="20" x2={lineX} y2="200" stroke="var(--primary)" strokeWidth="2.5" strokeDasharray="5 3" />
                      <text x={lineX + 6} y="35" fill="var(--primary)" fontSize="10" fontWeight="bold">
                        X₁ = {threshold.toFixed(1)}
                      </text>
                    </g>
                  );
                })()
              ) : (
                (() => {
                  const lineY = 200 - ((threshold - 1.0) / 4.0) * 180;
                  return (
                    <g>
                      <line x1="40" y1={lineY} x2="480" y2={lineY} stroke="var(--primary)" strokeWidth="2.5" strokeDasharray="5 3" />
                      <text x="475" y={lineY - 6} textAnchor="end" fill="var(--primary)" fontSize="10" fontWeight="bold">
                        X₂ = {threshold.toFixed(1)}
                      </text>
                    </g>
                  );
                })()
              )}

              {/* Data points */}
              {sampleDataset.map((pt) => {
                const cx = 40 + ((pt.x1 - 1.0) / 6.0) * 440;
                const cy = 200 - ((pt.x2 - 1.0) / 4.0) * 180;
                const isClass0 = pt.label === 0;

                return (
                  <g key={pt.id}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={7}
                      fill={isClass0 ? "var(--secondary)" : "var(--accent)"}
                      stroke={isClass0 ? "var(--border)" : "var(--foreground)"}
                      strokeWidth={1.5}
                    />
                    <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize="9" fontWeight="bold" fill="var(--foreground)">
                      {isClass0 ? "0" : "1"}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Child Partition Breakdown Cards */}
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="surface p-4 border-border">
              <span className="font-semibold text-foreground font-mono">
                Left Child Node (S_L):
              </span>
              <div className="mt-1 text-muted-foreground">
                {partition.left0} Class 0, {partition.left1} Class 1 (Total: {partition.left.length})
              </div>
              <div className="mt-2 flex justify-between font-mono text-[11px] border-t border-border pt-2">
                <span>Gini Impurity:</span>
                <span className="text-accent font-semibold">{partition.leftGini.toFixed(3)}</span>
              </div>
            </div>

            <div className="surface p-4 border-border">
              <span className="font-semibold text-foreground font-mono">
                Right Child Node (S_R):
              </span>
              <div className="mt-1 text-muted-foreground">
                {partition.right0} Class 0, {partition.right1} Class 1 (Total: {partition.right.length})
              </div>
              <div className="mt-2 flex justify-between font-mono text-[11px] border-t border-border pt-2">
                <span>Gini Impurity:</span>
                <span className="text-accent font-semibold">{partition.rightGini.toFixed(3)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
