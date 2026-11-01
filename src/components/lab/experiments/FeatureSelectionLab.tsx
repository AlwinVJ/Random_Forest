import { useState, useMemo } from "react";
import { Sparkles, Play, RotateCcw, GitFork, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MathView } from "../MathView";

interface SplitNode {
  id: number;
  depth: number;
  name: string;
  candidateFeatures: string[];
  chosenFeature: string;
}

export function FeatureSelectionLab() {
  const [totalFeatures, setTotalFeatures] = useState<number>(16);
  const [subsetRule, setSubsetRule] = useState<"sqrt" | "log2" | "one_third" | "all">("sqrt");
  const [splits, setSplits] = useState<SplitNode[]>([]);
  const [hasSimulated, setHasSimulated] = useState(false);

  // Available features list [F_1, F_2, ..., F_p]
  const allFeatureNames = useMemo(() => {
    return Array.from({ length: totalFeatures }, (_, i) => `F_{${i + 1}}`);
  }, [totalFeatures]);

  // Compute m (max_features) based on rule
  const m = useMemo(() => {
    if (subsetRule === "sqrt") return Math.max(1, Math.floor(Math.sqrt(totalFeatures)));
    if (subsetRule === "log2") return Math.max(1, Math.floor(Math.log2(totalFeatures)));
    if (subsetRule === "one_third") return Math.max(1, Math.floor(totalFeatures / 3));
    return totalFeatures;
  }, [totalFeatures, subsetRule]);

  // Simulate splits across 3 tree levels
  const runSimulation = () => {
    const nodes: SplitNode[] = [];
    const nodeDefs = [
      { id: 1, depth: 0, name: "Root Node (Depth 0)" },
      { id: 2, depth: 1, name: "Left Branch (Depth 1)" },
      { id: 3, depth: 1, name: "Right Branch (Depth 1)" },
      { id: 4, depth: 2, name: "Sub-branch L-L (Depth 2)" },
      { id: 5, depth: 2, name: "Sub-branch L-R (Depth 2)" },
    ];

    nodeDefs.forEach((def) => {
      // Randomly sample m features without replacement from all p features
      const shuffled = [...allFeatureNames].sort(() => 0.5 - Math.random());
      const candidates = shuffled.slice(0, m);
      // Simulate best chosen feature from candidates
      const chosen = candidates[Math.floor(Math.random() * candidates.length)]!;
      nodes.push({
        id: def.id,
        depth: def.depth,
        name: def.name,
        candidateFeatures: candidates,
        chosenFeature: chosen,
      });
    });

    setSplits(nodes);
    setHasSimulated(true);
  };

  const handleReset = () => {
    setSplits([]);
    setHasSimulated(false);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Mathematical Principle */}
      <div className="surface p-5 border-l-4 border-l-accent">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="size-4 text-accent" />
          Random Subspace Principle & Tree Decorrelation
        </h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          At every internal split node in each tree, Random Forest evaluates only a randomly drawn subset
          of <span className="font-mono text-accent">m candidate features</span> instead of scanning all p features.
          This prevents dominant features from hogging all top splits, decorrelating trees and lowering ensemble variance.
        </p>
        <div className="my-3 rounded-lg border border-border bg-secondary/30 p-2.5 text-center overflow-x-auto">
          <MathView
            math="m_{\text{classification}} = \lfloor \sqrt{p} \rfloor, \qquad m_{\text{regression}} = \lfloor p / 3 \rfloor"
            display
          />
        </div>
        <p className="text-[11px] text-muted-foreground italic">
          Educational note: This simulator visualizes candidate subspace sampling across split nodes; in a full
          decision tree, continuous threshold optimization is performed on each of the selected candidates.
        </p>
      </div>

      {/* Interactive Controls & Parameters */}
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="surface p-5 space-y-6">
          <div className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
            Feature Subspace Controls
          </div>

          <div>
            <div className="flex justify-between text-xs text-foreground font-medium mb-2">
              <span>Total Available Features (p):</span>
              <span className="font-mono text-accent">{totalFeatures} features</span>
            </div>
            <Slider
              value={[totalFeatures]}
              onValueChange={([val]) => {
                if (val) {
                  setTotalFeatures(val);
                  setHasSimulated(false);
                  setSplits([]);
                }
              }}
              min={4}
              max={32}
              step={1}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-2">
              Candidate Selection Rule (max_features):
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: "sqrt", label: "sqrt(p) (Default Clf)" },
                { id: "log2", label: "log2(p)" },
                { id: "one_third", label: "p / 3 (Default Reg)" },
                { id: "all", label: "1.0 (Pure Bagging)" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSubsetRule(opt.id as any);
                    setHasSimulated(false);
                    setSplits([]);
                  }}
                  className={`rounded-lg border p-2 text-left font-mono text-[11px] transition-colors ${
                    subsetRule === opt.id
                      ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30"
                      : "border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={runSimulation} className="flex-1 gap-1.5 text-xs">
              <Play className="size-3.5 fill-current" />
              Sample Candidate Subspaces
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={!hasSimulated}
              className="text-xs gap-1"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          </div>

          {/* Subspace Statistics */}
          <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Features (p):</span>
              <span className="font-mono font-semibold text-foreground">{totalFeatures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Candidate Subspace (m):</span>
              <span className="font-mono font-semibold text-primary">{m} features</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">Feature Sampling Ratio:</span>
              <span className="font-mono font-semibold text-accent">
                {((m / totalFeatures) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Tree Split Hierarchy Canvas */}
        <div className="surface p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
              <GitFork className="size-4 text-primary" />
              Simulated Split Node Subspaces
            </div>
            <span className="text-[11px] text-muted-foreground">
              {hasSimulated ? `Evaluated ${m} features per split across 5 nodes` : "Click 'Sample Candidate Subspaces'"}
            </span>
          </div>

          {hasSimulated ? (
            <div className="space-y-4 animate-fade-up">
              {splits.map((split) => (
                <div
                  key={split.id}
                  className="rounded-xl border border-border bg-card p-4 space-y-3"
                  style={{ marginLeft: `${split.depth * 16}px` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground font-mono">
                      {split.name}
                    </span>
                    <span className="rounded bg-primary/10 border border-primary/25 px-2 py-0.5 text-[10px] font-mono text-primary">
                      Chosen: <MathView math={split.chosenFeature} />
                    </span>
                  </div>

                  {/* Candidate Pills */}
                  <div>
                    <span className="text-[11px] text-muted-foreground">
                      Candidate Subspace Considered (m = {m}):
                    </span>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {split.candidateFeatures.map((feat) => {
                        const isChosen = feat === split.chosenFeature;
                        return (
                          <span
                            key={feat}
                            className={`rounded px-2 py-1 font-mono text-xs border ${
                              isChosen
                                ? "bg-accent/15 border-accent text-accent font-bold ring-1 ring-accent/30"
                                : "bg-secondary/40 border-border text-foreground"
                            }`}
                          >
                            <MathView math={feat} />
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <GitFork className="size-10 text-muted-foreground/30 mb-3" />
              <p className="text-xs max-w-sm">
                Choose candidate rules and launch the simulator to observe how different feature
                subspaces are dynamically presented to each split in the tree hierarchy.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
