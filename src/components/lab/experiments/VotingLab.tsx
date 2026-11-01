import { useState, useMemo } from "react";
import { Vote, RotateCcw, Shuffle, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MathView } from "../MathView";

interface TreePrediction {
  id: number;
  probClass1: number; // Probability of Class 1 (0 to 100%)
}

export function VotingLab() {
  const [treeCount, setTreeCount] = useState<number>(5);
  const [decisionThreshold, setDecisionThreshold] = useState<number>(50);

  // Initialize individual tree predictions
  const [trees, setTrees] = useState<TreePrediction[]>([
    { id: 1, probClass1: 90 },
    { id: 2, probClass1: 45 },
    { id: 3, probClass1: 48 },
    { id: 4, probClass1: 85 },
    { id: 5, probClass1: 40 },
  ]);

  // Adjust tree list when treeCount slider changes
  const activeTrees = useMemo(() => {
    if (trees.length === treeCount) return trees;
    if (trees.length < treeCount) {
      const next = [...trees];
      for (let i = trees.length + 1; i <= treeCount; i++) {
        next.push({ id: i, probClass1: Math.floor(Math.random() * 80) + 10 });
      }
      return next;
    }
    return trees.slice(0, treeCount);
  }, [trees, treeCount]);

  const updateTreeProb = (treeId: number, newProb: number) => {
    setTrees((prev) =>
      prev.map((t) => (t.id === treeId ? { ...t, probClass1: newProb } : t)),
    );
  };

  const randomizePredictions = () => {
    setTrees(
      Array.from({ length: treeCount }, (_, i) => ({
        id: i + 1,
        probClass1: Math.floor(Math.random() * 95) + 5,
      })),
    );
  };

  const handleReset = () => {
    setTreeCount(5);
    setDecisionThreshold(50);
    setTrees([
      { id: 1, probClass1: 90 },
      { id: 2, probClass1: 45 },
      { id: 3, probClass1: 48 },
      { id: 4, probClass1: 85 },
      { id: 5, probClass1: 40 },
    ]);
  };

  // 1. Hard Voting Calculation
  const hardVotes = useMemo(() => {
    let votesClass1 = 0;
    let votesClass0 = 0;
    activeTrees.forEach((t) => {
      if (t.probClass1 >= decisionThreshold) {
        votesClass1++;
      } else {
        votesClass0++;
      }
    });
    const winner = votesClass1 >= votesClass0 ? "Class 1 (Positive)" : "Class 0 (Negative)";
    return { votesClass0, votesClass1, winner };
  }, [activeTrees, decisionThreshold]);

  // 2. Soft Voting Calculation (Probability Averaging)
  const softVotes = useMemo(() => {
    const sumProb1 = activeTrees.reduce((acc, t) => acc + t.probClass1, 0);
    const avgProb1 = sumProb1 / activeTrees.length;
    const avgProb0 = 100 - avgProb1;
    const winner = avgProb1 >= decisionThreshold ? "Class 1 (Positive)" : "Class 0 (Negative)";
    return { avgProb0: avgProb0.toFixed(1), avgProb1: avgProb1.toFixed(1), winner };
  }, [activeTrees, decisionThreshold]);

  const isDiscrepant = hardVotes.winner !== softVotes.winner;

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Mathematical Principle */}
      <div className="surface p-5 border-l-4 border-l-primary">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Vote className="size-4 text-primary" />
          Hard Voting vs Soft Voting Aggregation
        </h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Random Forest classification supports two aggregation paradigms:
          <span className="font-semibold text-foreground"> Hard Voting</span> (discrete mode vote) and
          <span className="font-semibold text-foreground"> Soft Voting</span> (arithmetic average of class probabilities).
        </p>
        <div className="my-3 grid gap-3 sm:grid-cols-2 text-center text-xs">
          <div className="rounded border border-border bg-secondary/30 p-2">
            <MathView math="\hat{y}_{\text{hard}} = \operatorname{mode}\{T_1(x), \dots, T_B(x)\}" display />
          </div>
          <div className="rounded border border-border bg-secondary/30 p-2">
            <MathView math="P(y = c \mid x) = \frac{1}{B} \sum_{b=1}^B P_b(y = c \mid x)" display />
          </div>
        </div>
      </div>

      {/* Interactive Controls & Parameters */}
      <div className="grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="surface p-5 space-y-6">
          <div className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
            Ensemble Parameters
          </div>

          <div>
            <div className="flex justify-between text-xs text-foreground font-medium mb-2">
              <span>Number of Trees (B):</span>
              <span className="font-mono text-accent">{treeCount} trees</span>
            </div>
            <Slider
              value={[treeCount]}
              onValueChange={([val]) => val && setTreeCount(val)}
              min={3}
              max={15}
              step={1}
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-foreground font-medium mb-2">
              <span>Decision Threshold:</span>
              <span className="font-mono text-accent">{decisionThreshold}%</span>
            </div>
            <Slider
              value={[decisionThreshold]}
              onValueChange={([val]) => val && setDecisionThreshold(val)}
              min={20}
              max={80}
              step={5}
            />
            <span className="text-[10px] text-muted-foreground block mt-1">
              Threshold to classify as Class 1 (Default: 50%)
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={randomizePredictions} className="flex-1 gap-1.5 text-xs">
              <Shuffle className="size-3.5" />
              Randomize Trees
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset} className="text-xs gap-1">
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          </div>

          {/* Aggregated Comparison Metrics */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-foreground mb-1">
                <span>Hard Voting Result:</span>
                <span className="text-accent">{hardVotes.winner}</span>
              </div>
              <div className="text-muted-foreground text-[11px]">
                Votes: {hardVotes.votesClass1} for Class 1 · {hardVotes.votesClass0} for Class 0
              </div>
            </div>

            <div className="border-t border-border pt-2">
              <div className="flex justify-between font-semibold text-foreground mb-1">
                <span>Soft Voting Result:</span>
                <span className="text-success">{softVotes.winner}</span>
              </div>
              <div className="text-muted-foreground text-[11px]">
                Average Prob: {softVotes.avgProb1}% Class 1 · {softVotes.avgProb0}% Class 0
              </div>
            </div>

            {isDiscrepant && (
              <div className="rounded bg-warning/15 border border-warning/40 p-2 text-warning text-[11px] font-medium animate-fade-up">
                ⚡ Voting Discrepancy! Hard vote and Soft vote disagree due to confidence asymmetry.
              </div>
            )}
          </div>
        </div>

        {/* Tree Sliders Board */}
        <div className="surface p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
              Individual Tree Class 1 Probabilities
            </span>
            <span className="text-[11px] text-muted-foreground">
              Adjust sliders to observe live vote changes
            </span>
          </div>

          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {activeTrees.map((tree) => {
              const votesClass1 = tree.probClass1 >= decisionThreshold;

              return (
                <div key={tree.id} className="rounded-xl border border-border bg-card p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-semibold text-foreground">Tree #{tree.id}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                        votesClass1
                          ? "bg-accent/15 text-accent border border-accent/30"
                          : "bg-secondary text-muted-foreground border border-border"
                      }`}
                    >
                      Votes: {votesClass1 ? "Class 1" : "Class 0"} ({tree.probClass1}%)
                    </span>
                  </div>
                  <Slider
                    value={[tree.probClass1]}
                    onValueChange={([val]) => val !== undefined && updateTreeProb(tree.id, val)}
                    min={0}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>0% (Certain Class 0)</span>
                    <span>100% (Certain Class 1)</span>
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
