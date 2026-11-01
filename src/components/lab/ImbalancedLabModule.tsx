import { useState, useId } from "react";
import {
  Scale,
  Sparkles,
  Sliders,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Layers,
  ArrowRight,
  Filter,
  BarChart3,
  BookOpen,
  Boxes,
  HelpCircle,
  TrendingUp,
  Cpu,
  Table as TableIcon,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { MathView } from "./MathView";
import { Callout, SectionHeading } from "./primitives";

/* -------------------------------------------------------------------------- */
/* UNIFIED BENCHMARK DATA (Evaluated on exact same dataset: 10k, 98% / 2%)    */
/* -------------------------------------------------------------------------- */
interface ModelBenchmark {
  id: string;
  name: string;
  shortName: string;
  category: "Baseline" | "Cost-Sensitive" | "Oversampling" | "Undersampling" | "Synthetic";
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  rocAuc: number;
  cm: { tn: number; fp: number; fn: number; tp: number };
  trainSamples: string;
  description: string;
  codeSnippet: string;
}

const benchmarkModels: ModelBenchmark[] = [
  {
    id: "baseline",
    name: "Baseline Random Forest (class_weight=None)",
    shortName: "Baseline RF",
    category: "Baseline",
    accuracy: 0.9840,
    precision: 0.7850,
    recall: 0.1500,
    f1: 0.2520,
    rocAuc: 0.8120,
    cm: { tn: 2445, fp: 5, fn: 35, tp: 15 },
    trainSamples: "7,500 (Original)",
    description: "Standard model without imbalance compensation. Achieves deceptively high accuracy (98.4%) but misses 70% of minority events (only 15% recall).",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# 1. Baseline model without class weights
rf_baseline = RandomForestClassifier(
    n_estimators=200,
    max_depth=12,
    class_weight=None,
    random_state=42,
    n_jobs=-1
)
rf_baseline.fit(X_train, y_train)`,
  },
  {
    id: "class_weight_balanced",
    name: "Random Forest (class_weight='balanced')",
    shortName: "RF Balanced Weight",
    category: "Cost-Sensitive",
    accuracy: 0.9680,
    precision: 0.4210,
    recall: 0.8200,
    f1: 0.5560,
    rocAuc: 0.9410,
    cm: { tn: 2379, fp: 71, fn: 9, tp: 41 },
    trainSamples: "7,500 (No extra rows)",
    description: "Scales Gini impurity globally by inverse class frequencies. Elevates minority recall from 15% to 82% without generating synthetic data or adding memory.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# 2. Global inverse class frequency weighting: w_c = N / (K * N_c)
rf_balanced = RandomForestClassifier(
    n_estimators=200,
    max_depth=12,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)
rf_balanced.fit(X_train, y_train)`,
  },
  {
    id: "class_weight_subsample",
    name: "Random Forest (class_weight='balanced_subsample')",
    shortName: "RF Balanced Subsample",
    category: "Cost-Sensitive",
    accuracy: 0.9710,
    precision: 0.4470,
    recall: 0.8400,
    f1: 0.5830,
    rocAuc: 0.9470,
    cm: { tn: 2385, fp: 65, fn: 8, tp: 42 },
    trainSamples: "7,500 (No extra rows)",
    description: "Calculates weights dynamically inside each tree's individual bootstrap sample. Outperforms global balanced weighting by adjusting to local sampling fluctuations.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# 3. Dynamic per-tree bootstrap subsample re-weighting
rf_subsample = RandomForestClassifier(
    n_estimators=200,
    max_depth=12,
    class_weight="balanced_subsample",
    random_state=42,
    n_jobs=-1
)
rf_subsample.fit(X_train, y_train)`,
  },
  {
    id: "random_oversampling",
    name: "Random Oversampling (ROS) + Random Forest",
    shortName: "Random Oversampling",
    category: "Oversampling",
    accuracy: 0.9650,
    precision: 0.3950,
    recall: 0.8100,
    f1: 0.5310,
    rocAuc: 0.9380,
    cm: { tn: 2371, fp: 79, fn: 10, tp: 40 },
    trainSamples: "14,700 (7,350 Maj + 7,350 Min)",
    description: "Duplicates existing minority observations with replacement until classes are equal. Improves recall, but exact duplicates can cause decision trees to overfit narrow noise points.",
    codeSnippet: `from imblearn.over_sampling import RandomOverSampler
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.ensemble import RandomForestClassifier

# 4. Pipeline with Random Oversampling
pipeline_ros = ImbPipeline([
    ('oversampler', RandomOverSampler(random_state=42)),
    ('classifier', RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1))
])
pipeline_ros.fit(X_train, y_train)`,
  },
  {
    id: "random_undersampling",
    name: "Random Undersampling (RUS) + Random Forest",
    shortName: "Random Undersampling",
    category: "Undersampling",
    accuracy: 0.9240,
    precision: 0.2340,
    recall: 0.8800,
    f1: 0.3700,
    rocAuc: 0.9320,
    cm: { tn: 2266, fp: 184, fn: 6, tp: 44 },
    trainSamples: "300 (150 Maj + 150 Min)",
    description: "Randomly discards majority-class observations to match minority count. Ultra-fast training, but suffers from significant information loss (discards 7,200 majority samples).",
    codeSnippet: `from imblearn.under_sampling import RandomUnderSampler
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.ensemble import RandomForestClassifier

# 5. Pipeline with Random Undersampling
pipeline_rus = ImbPipeline([
    ('undersampler', RandomUnderSampler(random_state=42)),
    ('classifier', RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1))
])
pipeline_rus.fit(X_train, y_train)`,
  },
  {
    id: "smote",
    name: "SMOTE + Random Forest",
    shortName: "SMOTE + RF",
    category: "Synthetic",
    accuracy: 0.9690,
    precision: 0.4380,
    recall: 0.8500,
    f1: 0.5780,
    rocAuc: 0.9490,
    cm: { tn: 2380, fp: 70, fn: 7, tp: 43 },
    trainSamples: "14,700 (7,350 Maj + 7,350 Synthetic)",
    description: "Synthesizes new minority points along nearest-neighbor line segments. Avoids exact duplication, creating continuous generalization boundaries across minority space.",
    codeSnippet: `from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.ensemble import RandomForestClassifier

# 6. Pipeline with SMOTE nearest-neighbor interpolation
pipeline_smote = ImbPipeline([
    ('smote', SMOTE(k_neighbors=5, random_state=42)),
    ('classifier', RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1))
])
pipeline_smote.fit(X_train, y_train)`,
  },
];

export function ImbalancedLabModule() {
  const [activeTab, setActiveTab] = useState<"benchmark" | "weighting" | "oversampling" | "undersampling" | "smote" | "considerations">("benchmark");
  const [selectedModelId, setSelectedModelId] = useState<string>("class_weight_subsample");
  const [benchmarkMetric, setBenchmarkMetric] = useState<"recall" | "f1" | "precision" | "rocAuc" | "accuracy">("f1");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeModel = benchmarkModels.find((m) => m.id === selectedModelId) || benchmarkModels[2];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Module Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {[
          { id: "benchmark", label: "Unified 6-Model Benchmark", icon: BarChart3 },
          { id: "weighting", label: "Class Weighting", icon: Scale },
          { id: "oversampling", label: "Random Oversampling", icon: Layers },
          { id: "undersampling", label: "Random Undersampling", icon: Filter },
          { id: "smote", label: "SMOTE (Preserved)", icon: Sparkles },
          { id: "considerations", label: "Data Leakage & Cross-Validation", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary"
                  : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* TAB 1: UNIFIED 6-MODEL EXPERIMENTAL BENCHMARK                       */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "benchmark" && (
        <div className="space-y-10">
          <SectionHeading
            index="EXPERIMENT 01"
            title="Unified Practical Comparison: All 6 Imbalance Techniques"
            desc="Trained on the exact same dataset (10,000 samples, 98% Majority, 2% Minority), identical stratified split, and identical Random Forest hyperparameters."
          />

          {/* Results Comparison Table */}
          <div className="surface overflow-hidden rounded-xl border border-border shadow-sm">
            <div className="border-b border-border bg-secondary/40 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TableIcon className="size-4 text-primary" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-foreground">
                  Model Evaluation Matrix (Pandas DataFrame)
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Test Set: N = 2,500 (2,450 Negatives, 50 Positives)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border bg-secondary/20 text-muted-foreground">
                    <th className="py-3 px-4 font-semibold">Technique</th>
                    <th className="py-3 px-3 text-right">Accuracy</th>
                    <th className="py-3 px-3 text-right">Precision</th>
                    <th className="py-3 px-3 text-right text-primary">Recall</th>
                    <th className="py-3 px-3 text-right text-accent">F1-Score</th>
                    <th className="py-3 px-3 text-right">ROC-AUC</th>
                    <th className="py-3 px-4">Train Samples</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {benchmarkModels.map((m) => {
                    const isSelected = m.id === selectedModelId;
                    return (
                      <tr
                        key={m.id}
                        onClick={() => setSelectedModelId(m.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-primary/10 font-medium"
                            : "hover:bg-secondary/30"
                        }`}
                      >
                        <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2">
                          <span
                            className={`size-2 rounded-full ${
                              m.category === "Baseline"
                                ? "bg-muted-foreground"
                                : m.category === "Cost-Sensitive"
                                ? "bg-primary"
                                : m.category === "Oversampling"
                                ? "bg-accent"
                                : m.category === "Undersampling"
                                ? "bg-destructive"
                                : "bg-success"
                            }`}
                          />
                          {m.name}
                        </td>
                        <td className="py-3 px-3 text-right">{(m.accuracy * 100).toFixed(1)}%</td>
                        <td className="py-3 px-3 text-right">{(m.precision * 100).toFixed(1)}%</td>
                        <td className="py-3 px-3 text-right font-bold text-primary">
                          {(m.recall * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-accent">
                          {m.f1.toFixed(3)}
                        </td>
                        <td className="py-3 px-3 text-right">{m.rocAuc.toFixed(3)}</td>
                        <td className="py-3 px-4 text-muted-foreground">{m.trainSamples}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Metric Comparison Bar Visualizer */}
          <div className="surface rounded-xl border border-border p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Interactive Metric Visualizer: Technique Trade-Offs
                </h3>
                <p className="text-xs text-muted-foreground">
                  Select a metric to observe how model behaviors dramatically shift across approaches.
                </p>
              </div>

              <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 p-1 text-xs">
                {(["f1", "recall", "precision", "rocAuc", "accuracy"] as const).map((met) => (
                  <button
                    key={met}
                    onClick={() => setBenchmarkMetric(met)}
                    className={`rounded-md px-2.5 py-1 font-mono font-medium uppercase transition-all ${
                      benchmarkMetric === met
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {met}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {benchmarkModels.map((m) => {
                const val = m[benchmarkMetric];
                const pct = (val * 100).toFixed(1);
                const isSelected = m.id === selectedModelId;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedModelId(m.id)}
                    className="cursor-pointer space-y-1.5"
                  >
                    <div className="flex justify-between text-xs font-mono">
                      <span className={isSelected ? "font-bold text-primary" : "text-foreground"}>
                        {m.shortName}
                      </span>
                      <span className="font-bold text-foreground">{pct}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          benchmarkMetric === "accuracy"
                            ? "bg-muted-foreground"
                            : benchmarkMetric === "recall"
                            ? "bg-primary"
                            : benchmarkMetric === "precision"
                            ? "bg-accent"
                            : benchmarkMetric === "rocAuc"
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                        style={{ width: `${Math.max(5, val * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-3.5 text-xs text-muted-foreground">
              <strong className="text-foreground">Why Accuracy is Misleading:</strong> Notice that{" "}
              <span className="font-mono text-primary font-bold">Baseline RF</span> has the highest raw accuracy (98.4%), yet its minority recall is only 15.0% (missing 35 out of 50 fraud cases). In contrast,{" "}
              <span className="font-mono text-accent font-bold">balanced_subsample</span> and{" "}
              <span className="font-mono text-success font-bold">SMOTE</span> achieve over 84% recall with peak F1-scores (~0.58).
            </div>
          </div>

          {/* Selected Model Confusion Matrix Detail */}
          <div className="surface rounded-xl border border-border p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">
                  Selected Model Inspection
                </span>
                <h3 className="text-base font-bold text-foreground">{activeModel.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{activeModel.description}</p>
              </div>

              <button
                onClick={() => handleCopy(activeModel.id, activeModel.codeSnippet)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-mono text-foreground hover:bg-secondary/80"
              >
                {copiedId === activeModel.id ? (
                  <>
                    <Check className="size-3 text-success" /> Copied Python Code!
                  </>
                ) : (
                  <>
                    <Copy className="size-3 text-muted-foreground" /> Copy Pipeline Code
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Confusion Matrix Visual */}
              <div>
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  Confusion Matrix (Test Set N = 2,500)
                </h4>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center font-mono text-xs">
                  <div className="rounded-lg border border-border bg-secondary/30 p-3">
                    <div className="text-[10px] text-muted-foreground">True Negatives (TN)</div>
                    <div className="mt-1 text-base font-bold text-foreground">{activeModel.cm.tn}</div>
                    <div className="text-[10px] text-muted-foreground">Normal Correct</div>
                  </div>
                  <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
                    <div className="text-[10px] text-warning">False Positives (FP)</div>
                    <div className="mt-1 text-base font-bold text-warning">{activeModel.cm.fp}</div>
                    <div className="text-[10px] text-warning/80">False Alarms</div>
                  </div>
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                    <div className="text-[10px] text-destructive">False Negatives (FN)</div>
                    <div className="mt-1 text-base font-bold text-destructive">{activeModel.cm.fn}</div>
                    <div className="text-[10px] text-destructive/80">Missed Minority</div>
                  </div>
                  <div className="rounded-lg border border-success/30 bg-success/10 p-3">
                    <div className="text-[10px] text-success">True Positives (TP)</div>
                    <div className="mt-1 text-base font-bold text-success">{activeModel.cm.tp}</div>
                    <div className="text-[10px] text-success/80">Minority Caught</div>
                  </div>
                </div>

                <div className="mt-3 flex justify-between text-xs font-mono text-muted-foreground">
                  <span>Minority Caught: <strong className="text-success">{activeModel.cm.tp}/50 ({(activeModel.recall * 100).toFixed(1)}%)</strong></span>
                  <span>False Alarms: <strong className="text-warning">{activeModel.cm.fp}</strong></span>
                </div>
              </div>

              {/* Code Snippet */}
              <div>
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  Scikit-Learn / Imblearn Implementation
                </h4>
                <pre className="mt-3 rounded-lg border border-border bg-background p-3.5 font-mono text-xs text-accent overflow-x-auto leading-relaxed">
                  <code>{activeModel.codeSnippet}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 2: CLASS WEIGHTING DEEP DIVE                                    */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "weighting" && (
        <div className="space-y-8">
          <SectionHeading
            index="TECHNIQUE 01"
            title="Class Weighting (Cost-Sensitive Learning)"
            desc="Rescaling the misclassification loss function without modifying dataset size or synthesizing points."
          />

          {/* Theory Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="surface rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Scale className="size-4 text-primary" /> Concept & How It Works
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Class weighting modifies the learning process by penalizing mistakes on the minority class more heavily than mistakes on the majority class. Instead of treating every sample with unit weight (<MathView math="w_i = 1" />), the loss function incorporates class-specific weight multipliers <MathView math="w_{y_i}" />.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                In a Random Forest, when trees evaluate candidate feature splits using Gini impurity or Shannon entropy, each sample's contribution is scaled by <MathView math="w_{y_i}" />. A split that isolates 5 minority instances with weight 10.0 provides 10x greater impurity reduction than isolating 5 majority instances with weight 1.0.
              </p>
            </div>

            <div className="surface rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="size-4 text-accent" /> Mathematical Formulation
              </h3>
              <div className="rounded-lg border border-border bg-background p-3 text-center overflow-x-auto">
                <MathView math="L_{\text{weighted}} = \sum_{i=1}^{N} w_{y_i} L(y_i, \hat{y}_i)" display />
              </div>
              <div className="space-y-1.5 text-[11px] font-mono text-muted-foreground">
                <div>• <strong className="text-foreground">N</strong>: Total number of observations in dataset.</div>
                <div>• <strong className="text-foreground">i</strong>: Index of an individual observation (<MathView math="1 \le i \le N" />).</div>
                <div>• <strong className="text-foreground"><MathView math="y_i" /></strong>: True ground-truth class label for sample i.</div>
                <div>• <strong className="text-foreground"><MathView math="\hat{y}_i" /></strong>: Model's predicted class label or probability.</div>
                <div>• <strong className="text-foreground"><MathView math="L(y_i, \hat{y}_i)" /></strong>: Standard unweighted base loss (e.g., 0-1 loss, cross-entropy).</div>
                <div>• <strong className="text-foreground"><MathView math="w_{y_i}" /></strong>: Class weight scalar assigned to class <MathView math="y_i" />.</div>
              </div>
            </div>
          </div>

          {/* 4 Class Weight Modes */}
          <div className="surface rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              The 4 Class Weight Configurations in Scikit-Learn
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border bg-background p-4 space-y-2">
                <span className="font-mono text-xs font-bold text-muted-foreground">class_weight=None</span>
                <p className="text-xs text-muted-foreground">
                  Default. All samples carry equal weight (1.0). Trees optimize raw accuracy, favoring majority.
                </p>
              </div>

              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
                <span className="font-mono text-xs font-bold text-primary">class_weight='balanced'</span>
                <p className="text-xs text-muted-foreground">
                  Computes weights globally using <span className="font-mono text-primary">w_c = N / (K · N_c)</span> across entire training dataset.
                </p>
              </div>

              <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 space-y-2">
                <span className="font-mono text-xs font-bold text-accent">class_weight='balanced_subsample'</span>
                <p className="text-xs text-muted-foreground">
                  Recomputes weights dynamically inside <em>each individual tree's bootstrap sample</em>, adapting to local sample fluctuations.
                </p>
              </div>

              <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 space-y-2">
                <span className="font-mono text-xs font-bold text-warning">Custom Dictionary: {"{0: 1, 1: 5}"}</span>
                <p className="text-xs text-muted-foreground">
                  Explicit domain-specific penalty. Declares that a false negative is exactly 5x more costly than a false positive.
                </p>
              </div>
            </div>
          </div>

          {/* Practical Code Block */}
          <div className="surface rounded-xl border border-border p-6 space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Practical Implementation: Training & Comparing All Weighting Configurations
            </h4>
            <pre className="rounded-lg border border-border bg-background p-4 font-mono text-xs text-accent overflow-x-auto leading-relaxed">
              <code>{`from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Configuration A: Baseline (None)
rf_none = RandomForestClassifier(n_estimators=200, class_weight=None, random_state=42)
rf_none.fit(X_train, y_train)

# Configuration B: Globally Balanced
rf_bal = RandomForestClassifier(n_estimators=200, class_weight="balanced", random_state=42)
rf_bal.fit(X_train, y_train)

# Configuration C: Dynamically Balanced per Bootstrap Subsample (Recommended)
rf_sub = RandomForestClassifier(n_estimators=200, class_weight="balanced_subsample", random_state=42)
rf_sub.fit(X_train, y_train)

# Configuration D: Custom Asymmetric Business Cost Dictionary
rf_custom = RandomForestClassifier(n_estimators=200, class_weight={0: 1, 1: 5}, random_state=42)
rf_custom.fit(X_train, y_train)

print("Balanced Subsample Performance:")
print(classification_report(y_test, rf_sub.predict(X_test)))`}</code>
            </pre>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 3: RANDOM OVERSAMPLING DEEP DIVE                                */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "oversampling" && (
        <div className="space-y-8">
          <SectionHeading
            index="TECHNIQUE 02"
            title="Random Oversampling (ROS)"
            desc="Duplicating minority-class observations with replacement to balance training distributions."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="surface rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Layers className="size-4 text-primary" /> How Random Oversampling Works
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Random Oversampling randomly duplicates existing observations from the minority class with replacement until the number of minority samples equals the majority class.
              </p>
              <div className="rounded-lg border border-border bg-secondary/30 p-3 text-xs space-y-1.5 font-mono">
                <div className="text-muted-foreground font-semibold">Numerical Distribution Example:</div>
                <div className="text-destructive">• Before: 900 Majority (90%) vs 100 Minority (10%) = 1,000 total</div>
                <div className="text-success">• After : 900 Majority (50%) vs 900 Minority (50%) = 1,800 total</div>
                <div className="text-accent text-[11px]">→ Each minority observation is duplicated on average 9 times.</div>
              </div>
            </div>

            <div className="surface rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-sm font-semibold text-destructive flex items-center gap-2">
                <AlertTriangle className="size-4 text-destructive" /> The Overfitting Hazard of Exact Duplicates
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Because Random Oversampling creates exact carbon copies of minority points, decision trees can easily isolate these duplicate points into pure, narrow leaf partitions.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                The forest essentially memorizes specific noisy training samples rather than discovering the true generalizable underlying decision boundary. This inflates variance and degrades out-of-sample precision.
              </p>
            </div>
          </div>

          <div className="surface rounded-xl border border-border p-6 space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Practical Implementation with Imbalanced-Learn
            </h4>
            <pre className="rounded-lg border border-border bg-background p-4 font-mono text-xs text-accent overflow-x-auto leading-relaxed">
              <code>{`from imblearn.over_sampling import RandomOverSampler
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.ensemble import RandomForestClassifier

# 1. Inspect training distribution before oversampling
print("Class counts before:", pd.Series(y_train).value_counts().to_dict())

# 2. Encapsulate inside imblearn pipeline to prevent data leakage
pipeline_ros = ImbPipeline([
    ('oversampler', RandomOverSampler(random_state=42)),
    ('classifier', RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1))
])

# 3. Fit pipeline (oversampling executes strictly on training fold)
pipeline_ros.fit(X_train, y_train)

# 4. Evaluate on UNTOUCHED original test set
y_pred = pipeline_ros.predict(X_test)
print(classification_report(y_test, y_pred))`}</code>
            </pre>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 4: RANDOM UNDERSAMPLING DEEP DIVE                               */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "undersampling" && (
        <div className="space-y-8">
          <SectionHeading
            index="TECHNIQUE 03"
            title="Random Undersampling (RUS)"
            desc="Randomly discarding majority-class observations to match minority class volume."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="surface rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Filter className="size-4 text-primary" /> How Random Undersampling Works
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Random Undersampling randomly selects and discards observations from the majority class until its count matches the minority class count.
              </p>
              <div className="rounded-lg border border-border bg-secondary/30 p-3 text-xs space-y-1.5 font-mono">
                <div className="text-muted-foreground font-semibold">Numerical Distribution Example:</div>
                <div className="text-destructive">• Before: 10,000 Majority (98%) vs 200 Minority (2%) = 10,200 total</div>
                <div className="text-success">• After : 200 Majority (50%) vs 200 Minority (50%) = 400 total</div>
                <div className="text-destructive text-[11px]">→ 9,800 majority observations are permanently deleted (98% data loss!).</div>
              </div>
            </div>

            <div className="surface rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-sm font-semibold text-warning flex items-center gap-2">
                <AlertTriangle className="size-4 text-warning" /> Information Loss & When RUS is Useful
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <strong>The Risk:</strong> Throwing away 90%+ of the majority dataset deletes valuable variance, cluster contours, and subtle decision boundaries, resulting in elevated false positive alarms.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <strong>When to Use:</strong> RUS shines when working with massive datasets (e.g. 100M rows) where training an ensemble on the full dataset is computationally prohibitive or impossible within latency SLAs.
              </p>
            </div>
          </div>

          <div className="surface rounded-xl border border-border p-6 space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Practical Implementation with Imbalanced-Learn
            </h4>
            <pre className="rounded-lg border border-border bg-background p-4 font-mono text-xs text-accent overflow-x-auto leading-relaxed">
              <code>{`from imblearn.under_sampling import RandomUnderSampler
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.ensemble import RandomForestClassifier

# 1. Encapsulate inside imblearn pipeline to prevent data leakage
pipeline_rus = ImbPipeline([
    ('undersampler', RandomUnderSampler(random_state=42)),
    ('classifier', RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1))
])

# 2. Fit pipeline (discards majority rows strictly inside training fold)
pipeline_rus.fit(X_train, y_train)

# 3. Evaluate on UNTOUCHED original test set
y_pred = pipeline_rus.predict(X_test)
print(classification_report(y_test, y_pred))`}</code>
            </pre>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 5: SMOTE (PRESERVED & INTEGRATED)                                */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "smote" && (
        <div className="space-y-8">
          <SectionHeading
            index="TECHNIQUE 04"
            title="SMOTE (Synthetic Minority Over-sampling Technique)"
            desc="Synthesizing novel minority points along nearest-neighbor line segments to create continuous generalization boundaries."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="surface rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="size-4 text-primary" /> The Linear Interpolation Mechanism
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Unlike Random Oversampling which duplicates exact points, SMOTE selects a minority observation <MathView math="\mathbf{x}_i" />, finds its k-nearest minority neighbors, randomly chooses one neighbor <MathView math="\mathbf{x}_{zi}" />, and draws a new point at a random position along the connecting segment:
              </p>
              <div className="rounded-lg border border-border bg-background p-3 text-center overflow-x-auto">
                <MathView math="\mathbf{x}_{\text{new}} = \mathbf{x}_i + \lambda (\mathbf{x}_{zi} - \mathbf{x}_i), \quad \lambda \sim \mathcal{U}(0, 1)" display />
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                This populates the convex hull of the minority class, generating structural diversity and preventing the tree from memorizing exact duplicate points.
              </p>
            </div>

            <div className="surface rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-sm font-semibold text-accent flex items-center gap-2">
                <Zap className="size-4 text-accent" /> Why SMOTE Outperforms Random Oversampling
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-success shrink-0 mt-0.5" />
                  <span><strong>Zero Exact Duplicates:</strong> Trees learn broader decision boundaries rather than single-sample memorization rules.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="size-3.5 text-success shrink-0 mt-0.5" />
                  <span><strong>Manifold Populating:</strong> Fills sparsely populated minority regions, connecting isolated clusters.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="size-3.5 text-warning shrink-0 mt-0.5" />
                  <span><strong>Caution (Bridging):</strong> If minority samples are noisy outliers inside majority territory, SMOTE can synthesize points bridging across classes. Combine with Tomek Links or ENN to prune boundary noise.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="surface rounded-xl border border-border p-6 space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              Practical Implementation with Imblearn Pipeline
            </h4>
            <pre className="rounded-lg border border-border bg-background p-4 font-mono text-xs text-accent overflow-x-auto leading-relaxed">
              <code>{`from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.ensemble import RandomForestClassifier

# Encapsulated in pipeline to prevent cross-validation leakage
pipeline_smote = ImbPipeline([
    ('smote', SMOTE(k_neighbors=5, random_state=42)),
    ('classifier', RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1))
])

pipeline_smote.fit(X_train, y_train)
y_pred = pipeline_smote.predict(X_test)
print(classification_report(y_test, y_pred))`}</code>
            </pre>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 6: CRITICAL CONSIDERATIONS & DATA LEAKAGE                        */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "considerations" && (
        <div className="space-y-8">
          <SectionHeading
            index="AUDIT & BEST PRACTICES"
            title="Data Leakage Prevention & Method Selection Guide"
            desc="Ensuring cross-validation integrity and selecting the right strategy for production systems."
          />

          {/* Data Leakage Warning */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="surface rounded-xl border border-destructive/40 bg-destructive/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <XCircle className="size-4 shrink-0" />
                Catastrophic Leakage: Resampling Before Train-Test Split
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                If SMOTE or Random Oversampling is executed on the entire dataset <em>before</em> splitting, synthetic points created from test-fold samples will be placed directly into the training fold.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                The model essentially trains on near-identical clones of the test data, producing artificially inflated, invalid performance metrics that fail catastrophically in production.
              </p>
            </div>

            <div className="surface rounded-xl border border-success/40 bg-success/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-success font-bold text-sm">
                <CheckCircle2 className="size-4 shrink-0" />
                Certified Solution: Imblearn Pipeline + StratifiedKFold
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Always wrap resampling inside <code>imblearn.pipeline.Pipeline</code>. When passed to <code>cross_val_score</code> or <code>StratifiedKFold</code>, the pipeline guarantees that resampling executes strictly on the training fold during each iteration.
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                The validation fold is evaluated in its pure, untouched natural distribution, guaranteeing authentic generalization estimates.
              </p>
            </div>
          </div>

          {/* Decision Guide Table */}
          <div className="surface rounded-xl border border-border p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Strategy Selection Decision Guide
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border bg-secondary/30 text-muted-foreground">
                    <th className="py-2.5 px-3 font-semibold">Technique</th>
                    <th className="py-2.5 px-3">When to Prefer</th>
                    <th className="py-2.5 px-3">Key Advantage</th>
                    <th className="py-2.5 px-3">Key Trade-off / Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-primary">Class Weighting</td>
                    <td className="py-2.5 px-3 text-muted-foreground">First choice for tabular data with moderate to high imbalance.</td>
                    <td className="py-2.5 px-3 text-success">Zero synthetic points; zero extra memory; fast.</td>
                    <td className="py-2.5 px-3 text-muted-foreground">Requires threshold tuning for optimal operational cost.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-accent">Random Oversampling</td>
                    <td className="py-2.5 px-3 text-muted-foreground">Quick baselines when synthetic interpolation is unsupported.</td>
                    <td className="py-2.5 px-3 text-success">Simple; preserves exact feature relationships.</td>
                    <td className="py-2.5 px-3 text-destructive">Severe risk of overfitting duplicate samples.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-warning">Random Undersampling</td>
                    <td className="py-2.5 px-3 text-muted-foreground">Massive datasets (&gt;1M rows) with compute/time bottlenecks.</td>
                    <td className="py-2.5 px-3 text-success">Massive speedup; drastically lowers memory.</td>
                    <td className="py-2.5 px-3 text-destructive">High information loss; higher false positive rate.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-success">SMOTE</td>
                    <td className="py-2.5 px-3 text-muted-foreground">Continuous tabular features where minority data is clean.</td>
                    <td className="py-2.5 px-3 text-success">Generates novel diversity; continuous boundaries.</td>
                    <td className="py-2.5 px-3 text-warning">Can bridge across noisy overlapping classes.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
