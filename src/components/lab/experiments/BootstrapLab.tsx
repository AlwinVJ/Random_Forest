import { useState, useMemo } from "react";
import { Play, RotateCcw, Shuffle, Sparkles, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MathView } from "../MathView";

interface DataRow {
  id: number;
  label: string;
}

export function BootstrapLab() {
  const [sampleSize, setSampleSize] = useState<number>(10);
  const [bootstrapDraws, setBootstrapDraws] = useState<number[]>([]);
  const [hasSampled, setHasSampled] = useState(false);

  // Generate original dataset of size N
  const originalData: DataRow[] = useMemo(() => {
    return Array.from({ length: sampleSize }, (_, i) => ({
      id: i + 1,
      label: `d_${i + 1}`,
    }));
  }, [sampleSize]);

  // Perform genuine uniform bootstrap sampling with replacement
  const runBootstrap = () => {
    const draws: number[] = [];
    for (let i = 0; i < sampleSize; i++) {
      const randomIndex = Math.floor(Math.random() * sampleSize) + 1;
      draws.push(randomIndex);
    }
    setBootstrapDraws(draws);
    setHasSampled(true);
  };

  const handleReset = () => {
    setBootstrapDraws([]);
    setHasSampled(false);
  };

  // Compute frequencies and OOB
  const frequencyMap = useMemo(() => {
    const map = new Map<number, number>();
    bootstrapDraws.forEach((id) => map.set(id, (map.get(id) || 0) + 1));
    return map;
  }, [bootstrapDraws]);

  const uniqueSelected = useMemo(() => {
    return Array.from(frequencyMap.keys());
  }, [frequencyMap]);

  const oobSelected = useMemo(() => {
    return originalData.filter((row) => !frequencyMap.has(row.id));
  }, [originalData, frequencyMap]);

  const empiricalOobPct = hasSampled
    ? ((oobSelected.length / sampleSize) * 100).toFixed(1)
    : "—";

  const theoreticalOobPct = ((Math.pow(1 - 1 / sampleSize, sampleSize)) * 100).toFixed(1);
  const asymptoticOobPct = ((1 / Math.E) * 100).toFixed(1);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Mathematical Principle */}
      <div className="surface p-5 border-l-4 border-l-primary">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          Governing Mathematical Principle
        </h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          When drawing N observations with replacement from a dataset of size N, the probability of
          any specific observation being excluded from the bootstrap sample is exactly:
        </p>
        <div className="my-3 rounded-lg border border-border bg-secondary/30 p-2.5 text-center overflow-x-auto">
          <MathView
            math="P(\text{OOB}) = \left(1 - \frac{1}{N}\right)^N \xrightarrow{N \to \infty} \frac{1}{e} \approx 0.367879 \quad (36.8\%)"
            display
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Consequently, approximately 63.2% of rows are selected at least once, while 36.8% form the
          Out-of-Bag (OOB) validation partition.
        </p>
      </div>

      {/* Interactive Controls & Parameters */}
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="surface p-5 space-y-6">
          <div className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
            Simulation Parameters
          </div>

          <div>
            <div className="flex justify-between text-xs text-foreground font-medium mb-2">
              <span>Dataset Size (N):</span>
              <span className="font-mono text-accent">{sampleSize} observations</span>
            </div>
            <Slider
              value={[sampleSize]}
              onValueChange={([val]) => {
                if (val) {
                  setSampleSize(val);
                  setHasSampled(false);
                  setBootstrapDraws([]);
                }
              }}
              min={5}
              max={30}
              step={1}
            />
            <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
              <span>N = 5 (Small)</span>
              <span>N = 30 (Moderate)</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={runBootstrap} className="flex-1 gap-1.5 text-xs">
              <Play className="size-3.5 fill-current" />
              Draw Bootstrap Sample
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={!hasSampled}
              className="text-xs gap-1"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          </div>

          {/* Theoretical vs Empirical Metrics */}
          <div className="rounded-lg border border-border bg-secondary/30 p-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Theoretical OOB:</span>
              <span className="font-mono font-semibold text-foreground">{theoreticalOobPct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Asymptotic (1/e):</span>
              <span className="font-mono font-semibold text-accent">{asymptoticOobPct}%</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-muted-foreground">Empirical OOB:</span>
              <span className="font-mono font-semibold text-success">{empiricalOobPct}%</span>
            </div>
          </div>
        </div>

        {/* Live Visual Canvas */}
        <div className="surface p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="text-xs font-mono font-semibold text-foreground uppercase tracking-wider">
              Original Dataset (N = {sampleSize})
            </div>
            <span className="text-[11px] text-muted-foreground">
              {hasSampled ? `${uniqueSelected.length} unique picked · ${oobSelected.length} out-of-bag` : "Awaiting sample draw"}
            </span>
          </div>

          {/* Original Dataset Row Grid */}
          <div className="flex flex-wrap gap-2">
            {originalData.map((row) => {
              const count = frequencyMap.get(row.id) || 0;
              const isOob = hasSampled && count === 0;

              return (
                <div
                  key={row.id}
                  className={`flex flex-col items-center justify-center size-12 rounded-lg border font-mono text-xs transition-all ${
                    !hasSampled
                      ? "border-border bg-card text-foreground"
                      : isOob
                        ? "border-destructive/60 bg-destructive/15 text-destructive font-bold ring-1 ring-destructive/40"
                        : "border-primary/60 bg-primary/15 text-foreground font-semibold"
                  }`}
                >
                  <span>{row.label}</span>
                  {hasSampled && (
                    <span className="text-[9px] opacity-75">
                      {isOob ? "OOB" : `×${count}`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bootstrap Sequence Output */}
          {hasSampled && (
            <div className="space-y-4 pt-4 border-t border-border animate-fade-up">
              <div>
                <span className="text-xs font-mono font-semibold text-accent uppercase tracking-wider">
                  Drawn Bootstrap Sample Vector (Length {sampleSize}):
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-xs max-h-28 overflow-y-auto p-2 rounded bg-background border border-border">
                  {bootstrapDraws.map((val, i) => (
                    <span
                      key={i}
                      className="rounded bg-secondary/80 px-2 py-0.5 border border-border text-foreground"
                    >
                      d_{val}
                    </span>
                  ))}
                </div>
              </div>

              {/* OOB Partition Breakdown */}
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <span className="font-semibold text-primary">In-Sample Training Partition:</span>
                  <p className="mt-1 text-muted-foreground">
                    {uniqueSelected.length} unique rows ({((uniqueSelected.length / sampleSize) * 100).toFixed(1)}%).
                    Supplied to train this tree.
                  </p>
                </div>
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-3">
                  <span className="font-semibold text-warning">Out-of-Bag Validation Partition:</span>
                  <p className="mt-1 text-muted-foreground">
                    {oobSelected.length} omitted rows ({empiricalOobPct}%).
                    Used to evaluate this tree with zero data leakage.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
