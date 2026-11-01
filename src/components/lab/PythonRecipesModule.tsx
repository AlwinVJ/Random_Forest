import { useState } from "react";
import {
  Code2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Activity,
  FileCode,
  Sliders,
  ShieldCheck,
  Info,
} from "lucide-react";
import { SectionHeading } from "./primitives";
import { MathView } from "./MathView";

/* -------------------------------------------------------------------------- */
/* PYTHON RECIPES DATA                                                        */
/* -------------------------------------------------------------------------- */

const recipe1Code = `import numpy as np
from imblearn.pipeline import Pipeline
from imblearn.over_sampling import SMOTE
from imblearn.under_sampling import RandomUnderSampler

from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.preprocessing import StandardScaler

# 1. Generate realistic imbalanced tabular dataset (95% Class 0, 5% Class 1)
X, y = make_classification(
    n_samples=5000,
    n_features=20,
    n_informative=12,
    n_redundant=4,
    weights=[0.95, 0.05],
    random_state=42
)

# 2. Build leak-free imbalanced pipeline
# CRITICAL: Use imblearn.pipeline.Pipeline (NOT sklearn.pipeline.Pipeline)
# imblearn's pipeline correctly intercepts .fit() and applies .fit_resample()
# strictly to training folds while passing validation folds untouched!
pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),                 # Standardize features for SMOTE's KNN search
    ("smote", SMOTE(sampling_strategy=0.5, random_state=42)), # Oversample minority to 50% of majority
    ("classifier", RandomForestClassifier(
        n_estimators=200,
        max_depth=12,
        min_samples_leaf=4,
        class_weight="balanced",                  # Additional cost-sensitive weight penalty
        n_jobs=1,                                 # Single thread inside fold
        random_state=42
    ))
])

# 3. Stratified K-Fold to maintain identical 95:5 class ratios across all validation splits
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

# 4. Execute cross-validation with comprehensive imbalanced metrics
scoring_metrics = ["accuracy", "precision", "recall", "f1", "roc_auc"]
cv_results = cross_validate(
    pipeline,
    X,
    y,
    cv=cv,
    scoring=scoring_metrics,
    n_jobs=-1,                                    # Parallelize outer CV folds across CPU cores
    return_train_score=False
)

# 5. Display cross-validated performance metrics
print("=== Imbalanced-Learn Pipeline Cross-Validation Results ===")
for metric in scoring_metrics:
    scores = cv_results[f"test_{metric}"]
    print(f"{metric.upper():<10} : {scores.mean():.4f} (+/- {scores.std():.4f})")
`;

const recipe2Code = `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV, calibration_curve
from sklearn.metrics import brier_score_loss, log_loss, roc_auc_score

# 1. Generate synthetic binary classification dataset
X, y = make_classification(
    n_samples=6000,
    n_features=25,
    n_informative=15,
    weights=[0.80, 0.20],
    random_state=42
)

# 2. Hold out a strictly untouched test set for final calibration evaluation
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, stratify=y, random_state=42
)

# 3. Instantiate base Random Forest classifier
base_rf = RandomForestClassifier(
    n_estimators=300,
    max_depth=14,
    min_samples_leaf=4,
    n_jobs=-1,
    random_state=42
)

# 4. Configure CalibratedClassifierCV using internal 5-fold cross-validation
# Note: Modern Scikit-Learn (1.2+) uses the parameter name 'estimator'
calibrated_sigmoid = CalibratedClassifierCV(
    estimator=base_rf,
    method="sigmoid",                             # Platt scaling (logistic sigmoid fit)
    cv=5                                          # 5-fold internal out-of-fold calibration
)

calibrated_isotonic = CalibratedClassifierCV(
    estimator=base_rf,
    method="isotonic",                            # Non-parametric isotonic regression
    cv=5
)

# Fit models on training split only
base_rf.fit(X_train, y_train)
calibrated_sigmoid.fit(X_train, y_train)
calibrated_isotonic.fit(X_train, y_train)

# 5. Predict probabilities on the untouched test holdout set
prob_uncal = base_rf.predict_proba(X_test)[:, 1]
prob_sig   = calibrated_sigmoid.predict_proba(X_test)[:, 1]
prob_iso   = calibrated_isotonic.predict_proba(X_test)[:, 1]

# 6. Evaluate Brier score (lower is better) and Log Loss
models = [
    ("Uncalibrated Random Forest", prob_uncal),
    ("Sigmoid Calibrated (Platt)", prob_sig),
    ("Isotonic Calibrated (Non-parametric)", prob_iso),
]

print(f"{'Model Architecture':<38} | {'Brier Score':<12} | {'Log Loss':<10} | {'ROC-AUC':<8}")
print("-" * 75)
for name, probs in models:
    brier = brier_score_loss(y_test, probs)
    loss  = log_loss(y_test, probs)
    auc   = roc_auc_score(y_test, probs)
    print(f"{name:<38} | {brier:<12.5f} | {loss:<10.5f} | {auc:<8.4f}")
`;

const recipe3Code = `import time
import os
import joblib
import numpy as np
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier

# 1. Synthesize benchmark dataset (15,000 samples, 30 continuous features)
print("Generating high-dimensional benchmark dataset...")
X, y = make_classification(
    n_samples=15000,
    n_features=30,
    n_informative=20,
    n_classes=2,
    random_state=42
)

# 2. Determine system logical core count
logical_cores = joblib.cpu_count()
print(f"Detected Logical CPU Cores: {logical_cores} (os.cpu_count: {os.cpu_count()})")

# 3. Define target job configurations to test
job_configs = [1, 2, 4, -1]
trials_per_config = 3
benchmark_records = []

# Warm-up run to initialize OS thread pools and joblib loky daemon workers
warmup = RandomForestClassifier(n_estimators=20, random_state=42, n_jobs=-1)
warmup.fit(X[:1000], y[:1000])

# 4. Measure execution wall-clock time
for jobs in job_configs:
    trial_durations = []
    effective_workers = logical_cores if jobs == -1 else jobs

    for t in range(trials_per_config):
        model = RandomForestClassifier(
            n_estimators=300,
            max_depth=16,
            min_samples_split=6,
            min_samples_leaf=2,
            random_state=42 + t,
            n_jobs=jobs
        )
        
        t0 = time.perf_counter()
        model.fit(X, y)
        elapsed = time.perf_counter() - t0
        trial_durations.append(elapsed)

    mean_sec = np.mean(trial_durations)
    std_sec  = np.std(trial_durations)
    benchmark_records.append({
        "n_jobs": jobs,
        "effective_workers": effective_workers,
        "mean_sec": mean_sec,
        "std_sec": std_sec
    })

# 5. Compute Speedup and Parallel Efficiency
t1 = benchmark_records[0]["mean_sec"]  # Base runtime with n_jobs=1
for rec in benchmark_records:
    p = rec["effective_workers"]
    rec["speedup"] = t1 / rec["mean_sec"]
    rec["efficiency"] = (rec["speedup"] / p) * 100.0  # Percentage

df_results = pd.DataFrame(benchmark_records)
print("\\n=== Multi-Core Scaling Benchmark Results ===")
print(df_results[["n_jobs", "effective_workers", "mean_sec", "std_sec", "speedup", "efficiency"]].to_string(index=False))
`;

export function PythonRecipesModule() {
  const [activeTab, setActiveTab] = useState<"imbalance" | "calibration" | "multicore">("imbalance");
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="mt-16 space-y-10 border-t border-border pt-12">
      <SectionHeading
        index="PRODUCTION RECIPES"
        title="Production ML Engineering Recipes"
        desc="Battle-tested Python patterns solving imbalanced classification pipelines, probability calibration, and multi-core CPU scaling."
      />

      {/* Recipe Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {[
          { id: "imbalance", label: "Recipe 1: Leak-Free Imbalanced Pipeline", icon: ShieldCheck },
          { id: "calibration", label: "Recipe 2: CalibratedClassifierCV & Risk Probabilities", icon: Activity },
          { id: "multicore", label: "Recipe 3: Multi-Core Benchmarking & Scalability", icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
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
      {/* RECIPE 1: IMBALANCED-LEARN PIPELINE                                  */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "imbalance" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">
              Recipe 1: Leak-Free Preprocessing & SMOTE Pipeline with Imbalanced-Learn
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Demonstrates the mathematically correct way to combine missing-value imputation, standard scaling, synthetic minority oversampling (SMOTE), and Random Forest inside a cross-validation loop without data leakage.
            </p>
          </div>

          {/* Critical Leakage Architecture Warning */}
          <div className="surface rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-destructive font-mono uppercase tracking-wider">
              <AlertTriangle className="size-4" /> Crucial Architecture Rule: Why sklearn.pipeline.Pipeline Fails
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Standard <code>sklearn.pipeline.Pipeline</code> only supports <code>fit()</code> and <code>transform()</code> methods. It cannot change the sample count of the training dataset. If you attempt to plug SMOTE into a Scikit-Learn pipeline, it throws an exception because SMOTE requires <code>fit_resample()</code>.
            </p>
            <p className="text-xs text-foreground leading-relaxed">
              <strong>The Catastrophic Mistake:</strong> Practitioners frequently work around this by running SMOTE over the entire dataset <em>before</em> calling <code>cross_val_score</code>. This is devastating data leakage: synthetic samples generated from validation points bleed into the training folds, inflating validation AUC and F1 scores by 10%–25% with zero real-world generalization power.
            </p>
          </div>

          {/* Code Block Container */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">imbalanced_rf_pipeline.py</span>
              <button
                onClick={() => handleCopy("rec1", recipe1Code)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-mono text-foreground hover:bg-secondary/80"
              >
                {copiedCodeId === "rec1" ? (
                  <>
                    <Check className="size-3 text-success" /> Copied Code!
                  </>
                ) : (
                  <>
                    <Copy className="size-3 text-muted-foreground" /> Copy Recipe
                  </>
                )}
              </button>
            </div>
            <pre className="rounded-xl border border-border bg-background p-4 font-mono text-xs text-accent overflow-x-auto leading-relaxed">
              <code>{recipe1Code}</code>
            </pre>
          </div>

          {/* Technical Explanations Grid */}
          <div className="grid gap-6 md:grid-cols-2 pt-2">
            <div className="surface rounded-xl border border-border p-4 space-y-2">
              <h4 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                Why Feature Scaling is Included for SMOTE
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                While Random Forest itself is invariant to monotonic feature scaling, <strong>SMOTE relies on K-Nearest Neighbors</strong> (Euclidean distance) to find minority partners for interpolation. If features are unscaled, continuous features with large ranges overpower the distance metric, generating distorted synthetic samples.
              </p>
            </div>

            <div className="surface rounded-xl border border-border p-4 space-y-2">
              <h4 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                Categorical Features & Drop-In Alternatives
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If the dataset includes categorical features, standard SMOTE creates invalid continuous interpolations (e.g. state code 2.4). Replace SMOTE with <code>SMOTENC</code> (specifying categorical feature indices) or use <code>RandomOverSampler</code> / <code>RandomUnderSampler</code> directly in the pipeline.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* RECIPE 2: CALIBRATEDCLASSIFIERCV                                     */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "calibration" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">
              Recipe 2: Generating Calibrated Class Probabilities via CalibratedClassifierCV
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Transforms uncalibrated Random Forest voting fractions into true empirical probabilities required for financial risk scoring, insurance premium pricing, and clinical utility thresholds.
            </p>
          </div>

          {/* Mathematical Intuition Card */}
          <div className="surface rounded-xl border border-border p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground uppercase tracking-wider">
              <Info className="size-4 text-primary" /> Mathematical Formulation: Probability Calibration
            </div>
            <div className="rounded-lg border border-border bg-background p-3 text-center overflow-x-auto">
              <MathView math="P(Y = 1 \mid \hat{p} = p) \approx p" display />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Concrete Interpretation:</strong> If a well-calibrated model assigns a probability of <MathView math="\hat{p} = 0.80" /> to 1,000 distinct loan applicants, exactly 800 of those 1,000 applicants will actually default. Uncalibrated Random Forest models frequently exhibit severe probability distortion: because voting fractions are averaged across leaves, predictions rarely reach extreme values near 0.0 or 1.0.
            </p>

            <div className="grid gap-4 md:grid-cols-2 pt-2 border-t border-border">
              <div>
                <span className="font-mono text-xs font-bold text-accent block">Brier Score Loss Formula</span>
                <div className="my-1 text-center bg-background rounded p-2">
                  <MathView math="\text{Brier} = \frac{1}{N} \sum_{i=1}^{N} (\hat{p}_i - y_i)^2" display />
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Mean squared error in probability space. Strictly proper scoring rule bounded in [0, 1].
                </span>
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-success block">Binary Log-Loss (Cross-Entropy)</span>
                <div className="my-1 text-center bg-background rounded p-2">
                  <MathView math="\text{LogLoss} = -\frac{1}{N} \sum_{i=1}^{N} \left[ y_i \ln \hat{p}_i + (1 - y_i) \ln(1 - \hat{p}_i) \right]" display />
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Penalizes confident mispredictions exponentially. Heavily minimized by calibrated models.
                </span>
              </div>
            </div>
          </div>

          {/* Code Block Container */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">calibrated_rf_probabilities.py</span>
              <button
                onClick={() => handleCopy("rec2", recipe2Code)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-mono text-foreground hover:bg-secondary/80"
              >
                {copiedCodeId === "rec2" ? (
                  <>
                    <Check className="size-3 text-success" /> Copied Code!
                  </>
                ) : (
                  <>
                    <Copy className="size-3 text-muted-foreground" /> Copy Recipe
                  </>
                )}
              </button>
            </div>
            <pre className="rounded-xl border border-border bg-background p-4 font-mono text-xs text-accent overflow-x-auto leading-relaxed">
              <code>{recipe2Code}</code>
            </pre>
          </div>

          {/* Sigmoid vs Isotonic Comparison */}
          <div className="grid gap-6 md:grid-cols-2 pt-2">
            <div className="surface rounded-xl border border-border p-4 space-y-2">
              <h4 className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
                Method 1: Sigmoid (Platt Scaling)
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Fits a univariate logistic sigmoid function <MathView math="P(y=1 \mid f) = \frac{1}{1 + \exp(A \cdot f + B)}" /> mapping raw ensemble voting proportions into calibrated probabilities.
              </p>
              <div className="rounded bg-secondary/40 p-2 font-mono text-[11px] text-foreground">
                • Parametric, monotonic, and prevents overfitting.<br />
                • Ideal for small to medium calibration sample sizes (&lt; 1,000 samples).
              </div>
            </div>

            <div className="surface rounded-xl border border-border p-4 space-y-2">
              <h4 className="font-mono text-xs font-bold text-accent uppercase tracking-wider">
                Method 2: Isotonic Regression
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Fits a non-parametric, piece-wise constant non-decreasing step function minimizing squared residual error without assuming any sigmoid shape.
              </p>
              <div className="rounded bg-secondary/40 p-2 font-mono text-[11px] text-foreground">
                • Non-parametric and highly flexible.<br />
                • Prone to severe overfitting if calibration sample size is small (&lt; 1,000 samples).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* RECIPE 3: MULTI-CORE BENCHMARKING & SPEEDUP ANALYSIS                 */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "multicore" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">
              Recipe 3: Multi-Core CPU Benchmarking & Parallel Speedup Quantification
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Measures and analyzes execution wall-clock time, parallel speedup, and core utilization efficiency across different <code>n_jobs</code> configurations under Amdahl's Law constraints.
            </p>
          </div>

          {/* Mathematical Formulations Card */}
          <div className="surface rounded-xl border border-border p-5 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground uppercase tracking-wider">
              <Cpu className="size-4 text-primary" /> Parallel Scaling Metrics & Amdahl's Law
            </div>
            <div className="grid gap-4 md:grid-cols-3 text-center">
              <div className="rounded-lg border border-border bg-background p-3">
                <span className="font-mono text-xs font-bold text-primary block">Parallel Speedup</span>
                <div className="my-1">
                  <MathView math="S(p) = \frac{T_1}{T_p}" display />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Ratio of single-core runtime T_1 to p-worker runtime T_p.
                </span>
              </div>

              <div className="rounded-lg border border-border bg-background p-3">
                <span className="font-mono text-xs font-bold text-accent block">Parallel Efficiency</span>
                <div className="my-1">
                  <MathView math="E(p) = \frac{S(p)}{p} = \frac{T_1}{p \cdot T_p}" display />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Fraction of theoretical linear scaling achieved per core.
                </span>
              </div>

              <div className="rounded-lg border border-border bg-background p-3">
                <span className="font-mono text-xs font-bold text-success block">Amdahl's Law Speedup</span>
                <div className="my-1">
                  <MathView math="S_{\text{max}} = \frac{1}{(1 - s) + \frac{s}{p}}" display />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  s = parallel fraction; (1-s) = serial data prep & process spawning.
                </span>
              </div>
            </div>
          </div>

          {/* Code Block Container */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">benchmark_rf_multicore.py</span>
              <button
                onClick={() => handleCopy("rec3", recipe3Code)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-mono text-foreground hover:bg-secondary/80"
              >
                {copiedCodeId === "rec3" ? (
                  <>
                    <Check className="size-3 text-success" /> Copied Code!
                  </>
                ) : (
                  <>
                    <Copy className="size-3 text-muted-foreground" /> Copy Recipe
                  </>
                )}
              </button>
            </div>
            <pre className="rounded-xl border border-border bg-background p-4 font-mono text-xs text-accent overflow-x-auto leading-relaxed">
              <code>{recipe3Code}</code>
            </pre>
          </div>

          {/* Illustrative Benchmark Results Table */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Illustrative Benchmark Metrics on 8-Core Intel/AMD CPU (N=15,000, 300 Trees)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-border bg-card/60">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-sidebar/80 font-mono text-[11px] text-foreground">
                    <th className="px-4 py-3">n_jobs Parameter</th>
                    <th className="px-4 py-3">Active Workers (p)</th>
                    <th className="px-4 py-3">Mean Runtime (s)</th>
                    <th className="px-4 py-3">Std Dev (s)</th>
                    <th className="px-4 py-3">Speedup S(p)</th>
                    <th className="px-4 py-3">Parallel Efficiency E(p)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-mono text-xs">
                  <tr className="hover:bg-secondary/20">
                    <td className="px-4 py-2.5 font-bold text-foreground">n_jobs=1</td>
                    <td className="px-4 py-2.5">1 core</td>
                    <td className="px-4 py-2.5 text-foreground">12.80s</td>
                    <td className="px-4 py-2.5 text-muted-foreground">± 0.22s</td>
                    <td className="px-4 py-2.5 text-foreground">1.00x</td>
                    <td className="px-4 py-2.5 text-foreground">100.0% (Baseline)</td>
                  </tr>
                  <tr className="hover:bg-secondary/20">
                    <td className="px-4 py-2.5 font-bold text-primary">n_jobs=2</td>
                    <td className="px-4 py-2.5">2 cores</td>
                    <td className="px-4 py-2.5 text-primary">6.92s</td>
                    <td className="px-4 py-2.5 text-muted-foreground">± 0.14s</td>
                    <td className="px-4 py-2.5 text-primary">1.85x</td>
                    <td className="px-4 py-2.5 text-primary">92.5%</td>
                  </tr>
                  <tr className="hover:bg-secondary/20">
                    <td className="px-4 py-2.5 font-bold text-accent">n_jobs=4</td>
                    <td className="px-4 py-2.5">4 cores</td>
                    <td className="px-4 py-2.5 text-accent">3.82s</td>
                    <td className="px-4 py-2.5 text-muted-foreground">± 0.09s</td>
                    <td className="px-4 py-2.5 text-accent">3.35x</td>
                    <td className="px-4 py-2.5 text-accent">83.8%</td>
                  </tr>
                  <tr className="hover:bg-secondary/20">
                    <td className="px-4 py-2.5 font-bold text-success">n_jobs=-1</td>
                    <td className="px-4 py-2.5">8 cores (auto)</td>
                    <td className="px-4 py-2.5 text-success">2.41s</td>
                    <td className="px-4 py-2.5 text-muted-foreground">± 0.08s</td>
                    <td className="px-4 py-2.5 text-success">5.31x</td>
                    <td className="px-4 py-2.5 text-success">66.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-muted-foreground italic">
              * Note: Sample benchmark numbers are illustrative measurements on 8 physical cores. Actual throughput scales with hardware memory bandwidth, L3 cache size, and concurrent system background tasks.
            </p>
          </div>

          {/* Bottlenecks Breakdown */}
          <div className="grid gap-6 md:grid-cols-2 pt-2">
            <div className="surface rounded-xl border border-border p-4 space-y-2">
              <h4 className="font-mono text-xs font-bold text-warning uppercase tracking-wider">
                Why Efficiency Drops from 100% to 66% on 8 Cores
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>1. Memory Bus Contention:</strong> 8 concurrent workers simultaneously scanning continuous feature thresholds saturate DDR memory channels.<br />
                <strong>2. Loky Multiprocessing Overhead:</strong> Serializing datasets, spawning Python subprocesses, and aggregating fitted trees via IPC pipes takes ~0.2s–0.4s of fixed serial time (Amdahl's serial fraction).
              </p>
            </div>

            <div className="surface rounded-xl border border-border p-4 space-y-2">
              <h4 className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
                Physical vs. Logical Cores (Hyper-Threading / SMT)
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Intel Hyper-Threading and AMD SMT provide 2 logical threads per physical core by duplicating architectural registers, but they share the same physical ALU execution units and L1/L2 caches. For CPU-bound tree building, doubling threads yields diminishing returns (~15%–30% speedup), not 2x.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
