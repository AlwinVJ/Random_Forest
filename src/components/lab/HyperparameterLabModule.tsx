import { useState } from "react";
import {
  Sliders,
  Cpu,
  Layers,
  Settings2,
  Copy,
  Check,
  TrendingUp,
  Scale,
  Sparkles,
  Clock,
  HardDrive,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  GitBranch,
  Filter,
  BarChart3,
  Terminal,
  ShieldCheck,
  Gauge,
  Box,
  Eye,
} from "lucide-react";
import { MathView } from "./MathView";
import { Callout, SectionHeading } from "./primitives";

/* -------------------------------------------------------------------------- */
/* HYPERPARAMETER METADATA FOR ALL 18 PARAMETERS                             */
/* -------------------------------------------------------------------------- */
export interface HyperparameterDef {
  id: string;
  name: string;
  category: "Tree Structure" | "Randomization" | "Compute & System" | "Constraints & Weights";
  defaultVal: string;
  acceptedTypes: string;
  validRange: string;
  summary: string;
  mechanism: string;
  formula?: string;
  formulaExplanation?: string;
  impactBias: "Increases" | "Decreases" | "Neutral" | "Depends";
  impactVariance: "Increases" | "Decreases" | "Neutral" | "Depends";
  impactOverfit: "Increases risk" | "Decreases risk" | "Neutral";
  impactTime: "Increases" | "Decreases" | "Neutral";
  impactMemory: "Increases" | "Decreases" | "Neutral";
  tuningRecommendation: string;
  codeSnippet: string;
  commonMistakes: string[];
}

const hyperparameters: HyperparameterDef[] = [
  {
    id: "n_estimators",
    name: "n_estimators",
    category: "Randomization",
    defaultVal: "100",
    acceptedTypes: "int",
    validRange: "[1, ∞), typically 100 – 500",
    summary: "The number of decision trees constructed in the ensemble forest.",
    mechanism: "Each tree is trained on an independently drawn bootstrap sample. Predictions are aggregated via plurality vote (classification) or arithmetic mean (regression). Adding more trees does NOT cause overfitting; it steadily drives ensemble variance down toward its theoretical correlation floor.",
    formula: "\\operatorname{Var}(\\bar{f}) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2 \\xrightarrow{B \\to \\infty} \\rho \\sigma^2",
    formulaExplanation: "As B (n_estimators) grows, the second term vanishes, leaving only the irreducible correlation floor.",
    impactBias: "Neutral",
    impactVariance: "Decreases",
    impactOverfit: "Decreases risk",
    impactTime: "Increases",
    impactMemory: "Increases",
    tuningRecommendation: "Increase until out-of-bag (OOB) or validation score plateaus. Typical sweet spot is 200–400. Increasing beyond 500 yields diminishing returns at steep compute cost.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# 300 trees provide sufficient variance reduction without latency waste
rf = RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1)`,
    commonMistakes: [
      "Tuning n_estimators aggressively in grid search (it doesn't have an 'overfitting peak'; set it to 200–300 and tune structural tree parameters instead).",
      "Using n_estimators=10 for production due to impatience, which leaves high residual variance.",
    ],
  },
  {
    id: "criterion",
    name: "criterion",
    category: "Tree Structure",
    defaultVal: "'gini'",
    acceptedTypes: "str",
    validRange: "'gini', 'entropy', 'log_loss'",
    summary: "The mathematical metric used to evaluate candidate split quality at each node.",
    mechanism: "Measures node impurity. Gini computes the probability of misclassifying a randomly chosen element if labeled according to the empirical distribution. Entropy and log_loss measure Shannon information gain in bits. Gini is computationally faster (no logarithms) and produces near-identical splits in 95%+ of cases.",
    formula: "\\operatorname{Gini} = 1 - \\sum_{k=1}^K p_k^2, \\qquad H = -\\sum_{k=1}^K p_k \\log_2(p_k)",
    formulaExplanation: "Gini peaks at 0.5 for binary splits; Entropy peaks at 1.0 bit. Both equal 0 for completely pure nodes.",
    impactBias: "Neutral",
    impactVariance: "Neutral",
    impactOverfit: "Neutral",
    impactTime: "Increases",
    impactMemory: "Neutral",
    tuningRecommendation: "Keep default 'gini' for 98% of tabular applications. Test 'entropy' only if working on text or information-theoretic feature spaces where logarithmically scaled penalties are desired.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# 'gini' (fastest) vs 'entropy'/'log_loss' (information gain)
rf_gini = RandomForestClassifier(criterion='gini', random_state=42)
rf_entropy = RandomForestClassifier(criterion='entropy', random_state=42)`,
    commonMistakes: [
      "Assuming 'entropy' will dramatically boost accuracy (Gini and entropy yield >98% identical decision trees in empirical studies).",
      "Confusing criterion='log_loss' with model evaluation log loss metric.",
    ],
  },
  {
    id: "max_depth",
    name: "max_depth",
    category: "Tree Structure",
    defaultVal: "None",
    acceptedTypes: "int or None",
    validRange: "[1, ∞) or None",
    summary: "The maximum allowable depth of any individual decision tree from root to leaf.",
    mechanism: "When None, nodes expand until all leaves are pure or contain fewer than min_samples_split. Restricting depth is the most effective direct pre-pruning constraint to limit individual tree capacity, control memory consumption, and restrict inference latency.",
    formula: "\\text{Max Leaves} \\le 2^{\\text{max\\_depth}}",
    formulaExplanation: "A full binary tree of depth 20 can have up to 1,048,576 terminal leaves per tree.",
    impactBias: "Increases",
    impactVariance: "Decreases",
    impactOverfit: "Decreases risk",
    impactTime: "Decreases",
    impactMemory: "Decreases",
    tuningRecommendation: "On noisy datasets, set max_depth between 10 and 25 to prevent trees from memorizing training noise and to keep model size in RAM reasonable.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# Constrain depth to 15 to prevent noise memorization and limit RAM footprint
rf_bounded = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42)`,
    commonMistakes: [
      "Leaving max_depth=None on massive noisy datasets (can lead to trees with 50+ levels of depth, gigabytes of RAM usage, and microsecond-latency bottlenecks).",
      "Setting max_depth too shallow (< 5) causing severe underfitting and bias inflation.",
    ],
  },
  {
    id: "min_samples_split",
    name: "min_samples_split",
    category: "Tree Structure",
    defaultVal: "2",
    acceptedTypes: "int or float",
    validRange: "[2, ∞) for int, (0.0, 1.0] for float",
    summary: "The minimum number of samples required to consider splitting an internal node.",
    mechanism: "If a node contains fewer than min_samples_split observations, it cannot be divided further and becomes a terminal leaf. If passed as a float, it represents a fraction of total training samples: ceil(min_samples_split * n_samples).",
    formula: "\\text{Node Splits} \\iff N_{\\text{node}} \\ge \\text{min\\_samples\\_split}",
    formulaExplanation: "Guards against splitting tiny idiosyncratic sample clusters.",
    impactBias: "Increases",
    impactVariance: "Decreases",
    impactOverfit: "Decreases risk",
    impactTime: "Decreases",
    impactMemory: "Decreases",
    tuningRecommendation: "Increase to 5–15 on noisy tabular datasets to prevent trees from isolating individual outlier samples.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# Require at least 8 samples before searching for candidate splits
rf_split = RandomForestClassifier(min_samples_split=8, random_state=42)`,
    commonMistakes: [
      "Setting min_samples_split smaller than 2 * min_samples_leaf (leaves cannot have min_samples_leaf if the split doesn't have enough samples).",
    ],
  },
  {
    id: "min_samples_leaf",
    name: "min_samples_leaf",
    category: "Tree Structure",
    defaultVal: "1",
    acceptedTypes: "int or float",
    validRange: "[1, ∞) for int, (0.0, 0.5] for float",
    summary: "The minimum number of samples that must be present in every terminal leaf node.",
    mechanism: "A split is only considered if it leaves at least min_samples_leaf training samples in both the left and right child branches. This smooths leaf predictions, prevents 1-sample leaves, and acts as powerful regularization against noise.",
    formula: "\\min(N_L, N_R) \\ge \\text{min\\_samples\\_leaf}",
    formulaExplanation: "Enforces minimum statistical sample support in every decision leaf.",
    impactBias: "Increases",
    impactVariance: "Decreases",
    impactOverfit: "Decreases risk",
    impactTime: "Decreases",
    impactMemory: "Decreases",
    tuningRecommendation: "One of the most impactful parameters to tune. Setting min_samples_leaf=3–8 often improves test generalization significantly on noisy tabular data.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# Ensure every leaf has at least 4 samples to smooth probability estimates
rf_leaf = RandomForestClassifier(min_samples_leaf=4, random_state=42)`,
    commonMistakes: [
      "Keeping min_samples_leaf=1 on noisy or overlapping data, allowing trees to memorize individual label flips.",
    ],
  },
  {
    id: "max_features",
    name: "max_features",
    category: "Randomization",
    defaultVal: "'sqrt'",
    acceptedTypes: "int, float, 'sqrt', 'log2', None",
    validRange: "'sqrt', 'log2', None, int [1, p], float (0.0, 1.0]",
    summary: "The number of candidate features randomly sampled and evaluated at each node split.",
    mechanism: "This introduces Random Forest's defining mechanism: Random Feature Subspaces (Breiman, 2001). By restricting each split to m candidate features, trees are forced to use different predictors, decorrelating their individual decision rules and driving down ensemble variance.",
    formula: "m = \\lfloor \\sqrt{p} \\rfloor \\quad (\\text{'sqrt'}), \\qquad m = \\lfloor \\log_2(p) \\rfloor \\quad (\\text{'log2'}), \\qquad m = p \\quad (\\text{None})",
    formulaExplanation: "For p = 100 features, 'sqrt' evaluates 10 features per split, while None evaluates all 100.",
    impactBias: "Increases",
    impactVariance: "Decreases",
    impactOverfit: "Decreases risk",
    impactTime: "Decreases",
    impactMemory: "Neutral",
    tuningRecommendation: "Default 'sqrt' is optimal for most classification problems. For high-dimensional sparse data (genomics/NLP), test 0.2 to 0.5 of features.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# 'sqrt' is default for classification; float evaluates a proportion (e.g. 30%)
rf_feat = RandomForestClassifier(max_features='sqrt', random_state=42)`,
    commonMistakes: [
      "Setting max_features=None or 1.0 for classification (this eliminates random feature selection, degenerating Random Forest into standard Bagging!).",
      "Using max_features=1 on complex data with many non-informative noise features.",
    ],
  },
  {
    id: "max_leaf_nodes",
    name: "max_leaf_nodes",
    category: "Tree Structure",
    defaultVal: "None",
    acceptedTypes: "int or None",
    validRange: "[2, ∞) or None",
    summary: "Grows trees in best-first fashion up to a maximum number of leaf nodes.",
    mechanism: "Instead of standard depth-first growth, best-first growth maintains a priority queue of candidate splits across all leaves and splits the node that produces the largest relative impurity reduction. It produces asymmetric, highly optimized trees.",
    formula: "\\text{Leaves} \\le \\text{max\\_leaf\\_nodes}",
    formulaExplanation: "Directly bounds the total number of partitions in the feature space per tree.",
    impactBias: "Increases",
    impactVariance: "Decreases",
    impactOverfit: "Decreases risk",
    impactTime: "Decreases",
    impactMemory: "Decreases",
    tuningRecommendation: "Excellent alternative to max_depth. Setting max_leaf_nodes=50–200 often yields equal accuracy to unconstrained trees with a fraction of the RAM usage.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# Grow trees best-first up to 100 leaves per tree
rf_leaves = RandomForestClassifier(max_leaf_nodes=100, random_state=42)`,
    commonMistakes: [
      "Simultaneously tuning max_depth and max_leaf_nodes tightly (they constrain the same geometric capacity).",
    ],
  },
  {
    id: "min_impurity_decrease",
    name: "min_impurity_decrease",
    category: "Tree Structure",
    defaultVal: "0.0",
    acceptedTypes: "float",
    validRange: "[0.0, ∞)",
    summary: "A split will be considered only if it decreases node impurity by at least this threshold.",
    mechanism: "Evaluates the weighted impurity reduction across parent and child nodes. If the gain is below min_impurity_decrease, node splitting terminates immediately.",
    formula: "\\Delta I(t) = \\frac{N_t}{N} \\left( I(t) - \\frac{N_L}{N_t} I(t_L) - \\frac{N_R}{N_t} I(t_R) \\right) \\ge \\Delta I_{\\text{min}}",
    formulaExplanation: "N_t / N weights the local split gain by the fraction of total samples reaching node t.",
    impactBias: "Increases",
    impactVariance: "Decreases",
    impactOverfit: "Decreases risk",
    impactTime: "Decreases",
    impactMemory: "Decreases",
    tuningRecommendation: "Keep at 0.0 unless working with large noisy datasets where tiny impurity reductions represent spurious noise splits. Values around 0.001–0.01 prune trivial branches.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# Prune splits that produce negligible impurity reduction
rf_imp = RandomForestClassifier(min_impurity_decrease=0.005, random_state=42)`,
    commonMistakes: [
      "Setting min_impurity_decrease too high (> 0.05), which can halt tree growth at the root node.",
    ],
  },
  {
    id: "bootstrap",
    name: "bootstrap",
    category: "Randomization",
    defaultVal: "True",
    acceptedTypes: "bool",
    validRange: "True, False",
    summary: "Whether bootstrap samples (sampling with replacement) are used to build trees.",
    mechanism: "When True, each tree is trained on N random samples drawn with replacement from the N training instances (~63.2% unique rows, ~36.8% out-of-bag). When False, every tree sees the entire dataset, and tree diversity arises solely from max_features.",
    formula: "P(\\text{Row Omitted}) = \\left(1 - \\frac{1}{N}\\right)^N \\xrightarrow{N \\to \\infty} \\frac{1}{e} \\approx 0.368",
    formulaExplanation: "Without bootstrap sampling, Out-of-Bag (OOB) estimation cannot be computed.",
    impactBias: "Increases (slightly)",
    impactVariance: "Decreases",
    impactOverfit: "Decreases risk",
    impactTime: "Neutral",
    impactMemory: "Neutral",
    tuningRecommendation: "Leave True for Random Forest. Setting bootstrap=False increases tree correlation, which can defeat the variance-reduction benefits of bagging.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# bootstrap=True is essential for ensemble variance reduction and OOB scoring
rf_boot = RandomForestClassifier(bootstrap=True, oob_score=True, random_state=42)`,
    commonMistakes: [
      "Setting bootstrap=False while attempting to use oob_score=True (raises a ValueError).",
    ],
  },
  {
    id: "max_samples",
    name: "max_samples",
    category: "Randomization",
    defaultVal: "None",
    acceptedTypes: "int, float, or None",
    validRange: "None, int [1, n_samples], float (0.0, 1.0]",
    summary: "The number or proportion of samples drawn from X to train each individual base tree.",
    mechanism: "Controls sub-bagging / pasting. If None, draws n_samples rows. If float, draws max_samples * n_samples. Subsampling fewer rows increases diversity across trees and speeds up training on large datasets.",
    formula: "N_{\\text{tree}} = \\lfloor \\text{max\\_samples} \\cdot N \\rfloor",
    formulaExplanation: "Allows training trees on subsamples without discarding global data.",
    impactBias: "Increases",
    impactVariance: "Decreases",
    impactOverfit: "Decreases risk",
    impactTime: "Decreases",
    impactMemory: "Decreases",
    tuningRecommendation: "On massive datasets (100k+ rows), setting max_samples=0.5 to 0.8 provides a 2x-3x training speedup with negligible accuracy loss.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# Sub-bagging: Each tree trains on 70% random sample with replacement
rf_sub = RandomForestClassifier(bootstrap=True, max_samples=0.7, random_state=42)`,
    commonMistakes: [
      "Setting max_samples when bootstrap=False (raises a ValueError; only valid when bootstrap=True).",
    ],
  },
  {
    id: "oob_score",
    name: "oob_score",
    category: "Compute & System",
    defaultVal: "False",
    acceptedTypes: "bool or callable",
    validRange: "False, True, custom scoring callable",
    summary: "Whether to compute out-of-bag estimates to evaluate generalization score.",
    mechanism: "Each sample is evaluated only by the subset of trees (~36.8%) that did NOT include it in their bootstrap draw. The ensemble majority vote of these OOB trees provides an unbiased estimate of generalization error without requiring a separate validation split.",
    formula: "\\hat{y}_{\\text{OOB}}(x_i) = \\operatorname{mode} \\{ T_b(x_i) \\mid i \\notin \\mathcal{D}_b \\}",
    formulaExplanation: "Statistically equivalent to leave-one-out cross validation at zero extra training cost.",
    impactBias: "Neutral",
    impactVariance: "Neutral",
    impactOverfit: "Neutral",
    impactTime: "Increases (slightly)",
    impactMemory: "Increases (slightly)",
    tuningRecommendation: "Enable (True) during experimentation to monitor generalization score for free without creating separate validation folds.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=200, oob_score=True, random_state=42)
rf.fit(X_train, y_train)
print(f"OOB Accuracy: {rf.oob_score_:.4f}")`,
    commonMistakes: [
      "Trusting OOB score on imbalanced data without custom scoring (default OOB metric is raw classification accuracy).",
    ],
  },
  {
    id: "n_jobs",
    name: "n_jobs",
    category: "Compute & System",
    defaultVal: "None",
    acceptedTypes: "int or None",
    validRange: "None, 1, int > 0, -1, -2",
    summary: "The number of CPU worker processes to run in parallel for fitting and predicting.",
    mechanism: "Random Forest trees are embarrassingly parallel. Scikit-learn uses joblib with the loky multiprocessing backend to spawn worker processes, distributing tree construction across CPU cores. n_jobs=-1 uses all available logical processors.",
    formula: "\\text{Speedup} \\le \\frac{1}{(1 - P) + \\frac{P}{N_{\\text{cores}}}} \\quad (\\text{Amdahl's Law})",
    formulaExplanation: "Parallel speedup is bounded by inter-process serialization overhead and memory bandwidth.",
    impactBias: "Neutral",
    impactVariance: "Neutral",
    impactOverfit: "Neutral",
    impactTime: "Decreases (dramatically)",
    impactMemory: "Increases",
    tuningRecommendation: "Set n_jobs=-1 for standard model fitting. When nested inside GridSearchCV(n_jobs=-1), set RF n_jobs=1 to avoid severe CPU oversubscription.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# Utilize all available CPU cores for fast parallel tree building
rf_parallel = RandomForestClassifier(n_estimators=300, n_jobs=-1, random_state=42)`,
    commonMistakes: [
      "Nested parallelism anti-pattern: GridSearchCV(n_jobs=-1) + RandomForest(n_jobs=-1) causes worker explosion and thrashing.",
      "Assuming 16 logical hyperthreads provide 2x speedup over 8 physical cores (Hyper-Threading yields only 15–30% speedup for CPU-bound tasks).",
    ],
  },
  {
    id: "class_weight",
    name: "class_weight",
    category: "Constraints & Weights",
    defaultVal: "None",
    acceptedTypes: "dict, 'balanced', 'balanced_subsample', None",
    validRange: "None, 'balanced', 'balanced_subsample', {0: w0, 1: w1}",
    summary: "Weights assigned to classes to handle skewed class distributions.",
    mechanism: "Scales misclassification loss and Gini impurity node calculations by class weights. 'balanced' calculates weights globally. 'balanced_subsample' recalculates class weights independently for each individual tree's bootstrap sample.",
    formula: "w_c = \\frac{N}{K \\cdot N_c}, \\qquad L_{\\text{weighted}} = \\sum_{i=1}^N w_{y_i} L(y_i, \\hat{y}_i)",
    formulaExplanation: "Penalizes mistakes on rare minority classes inversely to their representation frequency.",
    impactBias: "Decreases minority bias",
    impactVariance: "Increases (slightly)",
    impactOverfit: "Neutral",
    impactTime: "Neutral",
    impactMemory: "Neutral",
    tuningRecommendation: "Use 'balanced_subsample' for imbalanced tabular classification (e.g. fraud, defect detection).",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# Dynamically reweight minority samples inside each bootstrap replicate
rf_bal = RandomForestClassifier(class_weight='balanced_subsample', random_state=42)`,
    commonMistakes: [
      "Assuming class_weight modifies the dataset size (it only modifies impurity split loss; dataset size is unchanged).",
      "Evaluating with accuracy after setting class_weight='balanced' (always report Recall, F1, PR-AUC).",
    ],
  },
  {
    id: "random_state",
    name: "random_state",
    category: "Randomization",
    defaultVal: "None",
    acceptedTypes: "int, RandomState instance, None",
    validRange: "None or integer seed (e.g. 42)",
    summary: "Controls the pseudo-random number generator (PRNG) seed across estimators.",
    mechanism: "Seeds the randomness used in bootstrap sampling and candidate feature subspace selection. Fixing random_state ensures that running model.fit multiple times on the same machine produces identical trees and predictions.",
    formula: "\\text{PRNG}(S_{t+1}) = (a S_t + c) \\pmod m",
    formulaExplanation: "Deterministic algorithmic seed sequence across trees.",
    impactBias: "Neutral",
    impactVariance: "Neutral",
    impactOverfit: "Neutral",
    impactTime: "Neutral",
    impactMemory: "Neutral",
    tuningRecommendation: "Always fix random_state=42 (or any integer) in experiments to guarantee reproducible benchmarks.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# Fix PRNG seed for exact reproducibility across runs
rf_seed = RandomForestClassifier(random_state=42)`,
    commonMistakes: [
      "Expecting random_state=42 to produce identical results across different Scikit-Learn versions or OS architectures.",
    ],
  },
  {
    id: "ccp_alpha",
    name: "ccp_alpha",
    category: "Tree Structure",
    defaultVal: "0.0",
    acceptedTypes: "non-negative float",
    validRange: "[0.0, ∞)",
    summary: "Complexity parameter used for Minimal Cost-Complexity Pruning (post-pruning).",
    mechanism: "Prunes individual trees post-hoc by penalizing the number of terminal leaves. Subtrees with cost-complexity value smaller than ccp_alpha are pruned away, leaving smaller, simpler trees.",
    formula: "R_\\alpha(T) = R(T) + \\alpha |T|",
    formulaExplanation: "R(T) is total tree misclassification rate, |T| is number of terminal leaves, α is ccp_alpha.",
    impactBias: "Increases",
    impactVariance: "Decreases",
    impactOverfit: "Decreases risk",
    impactTime: "Increases during fit",
    impactMemory: "Decreases",
    tuningRecommendation: "Use cost_complexity_pruning_path on validation data to find effective alpha. Helpful when model size must be strictly minimized.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# Post-pruning to penalize complex trees and minimize leaf count
rf_pruned = RandomForestClassifier(ccp_alpha=0.015, random_state=42)`,
    commonMistakes: [
      "Setting ccp_alpha too large (> 0.1), which aggressively collapses all trees into single root nodes.",
    ],
  },
  {
    id: "warm_start",
    name: "warm_start",
    category: "Compute & System",
    defaultVal: "False",
    acceptedTypes: "bool",
    validRange: "True, False",
    summary: "Reuses the existing fitted forest and incrementally adds more trees upon subsequent fit calls.",
    mechanism: "When True, calling fit(X, y) retains the previously trained trees and only builds the incremental trees needed to reach the new n_estimators value. Ideal for plotting out-of-bag error curves over increasing forest sizes.",
    formula: "\\text{New Trees Built} = n_{\\text{estimators}}^{\\text{new}} - n_{\\text{estimators}}^{\\text{old}}",
    formulaExplanation: "Avoids retraining existing estimators from scratch.",
    impactBias: "Neutral",
    impactVariance: "Neutral",
    impactOverfit: "Neutral",
    impactTime: "Decreases for incremental runs",
    impactMemory: "Neutral",
    tuningRecommendation: "Use warm_start=True when dynamically growing an ensemble or monitoring OOB error convergence across increments.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(n_estimators=100, warm_start=True, random_state=42)
rf.fit(X_train, y_train)

# Incrementally add 100 more trees (total 200) without retraining the first 100
rf.n_estimators = 200
rf.fit(X_train, y_train)`,
    commonMistakes: [
      "Changing data or other hyperparameters (like max_depth) between warm_start fits (creates an inconsistent hybrid forest).",
    ],
  },
  {
    id: "verbose",
    name: "verbose",
    category: "Compute & System",
    defaultVal: "0",
    acceptedTypes: "int",
    validRange: "0, 1, 2, 3",
    summary: "Controls the verbosity level of terminal logs during tree fitting and prediction.",
    mechanism: "Outputs progress messages indicating how many trees have been built and parallel batch completion. Does not affect model performance, weights, or accuracy.",
    formula: "\\text{Log Level} \\in \\{0, 1, 2, 3\\}",
    formulaExplanation: "0 = silent; 1 = building tree notifications; >1 = detailed parallel task completion times.",
    impactBias: "Neutral",
    impactVariance: "Neutral",
    impactOverfit: "Neutral",
    impactTime: "Neutral",
    impactMemory: "Neutral",
    tuningRecommendation: "Set verbose=1 or 2 during long cluster jobs (e.g. 1,000 trees on 10M rows) to monitor progress.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# Print progress messages during parallel training
rf_verbose = RandomForestClassifier(n_estimators=500, verbose=1, random_state=42)`,
    commonMistakes: [
      "Treating verbose as an accuracy-tuning hyperparameter.",
      "Setting verbose=3 in production web microservices (pollutes system logs and causes stdout I/O overhead).",
    ],
  },
  {
    id: "monotonic_cst",
    name: "monotonic_cst",
    category: "Constraints & Weights",
    defaultVal: "None",
    acceptedTypes: "array-like of int, or None",
    validRange: "Vector of length p with values -1, 0, or 1",
    summary: "Enforces monotonic directional constraints (+1 increasing, -1 decreasing, 0 none) on features.",
    mechanism: "Ensures that as a constrained feature increases, predicted probability never decreases (+1) or never increases (-1). Tree split thresholds that violate monotonicity during candidate search are discarded.",
    formula: "x_{ij} \\le x_{kj} \\implies \\hat{P}(y=1 \\mid x_i) \\le \\hat{P}(y=1 \\mid x_k) \\quad (\\text{for } c_j = +1)",
    formulaExplanation: "Guarantees monotonic domain relationships (e.g. higher income should not lower credit approval probability).",
    impactBias: "Increases (restricts hypothesis space)",
    impactVariance: "Decreases",
    impactOverfit: "Decreases risk",
    impactTime: "Increases during fit",
    impactMemory: "Neutral",
    tuningRecommendation: "Essential in regulated industries (credit risk, insurance pricing, medical dosing) where domain logic demands monotonicity.",
    codeSnippet: `from sklearn.ensemble import RandomForestClassifier

# Enforce monotonic increase on feature 0, monotonic decrease on feature 1, unconstrained on feature 2
rf_mono = RandomForestClassifier(monotonic_cst=[1, -1, 0], random_state=42)`,
    commonMistakes: [
      "Attempting to use monotonic_cst on multiclass classification (currently supported only for binary classification and regression).",
      "Treating monotonic constraints as proof of causality (it enforces monotonic predictive behavior, not causal mechanisms).",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* PRODUCTION PRESET CONFIGURATIONS                                          */
/* -------------------------------------------------------------------------- */
interface PresetConfig {
  id: string;
  name: string;
  targetScenario: string;
  rationale: string;
  code: string;
  pros: string[];
  limitations: string[];
  whenNotToUse: string;
}

const presets: PresetConfig[] = [
  {
    id: "baseline",
    name: "1. General-Purpose Baseline",
    targetScenario: "Standard tabular classification with balanced or mild class ratios.",
    rationale: "Sensible starting point with ample trees for variance reduction and automatic CPU utilization.",
    code: `from sklearn.ensemble import RandomForestClassifier

rf_baseline = RandomForestClassifier(
    n_estimators=200,
    max_features="sqrt",
    bootstrap=True,
    n_jobs=-1,
    random_state=42
)`,
    pros: ["Quick setup", "Robust defaults", "Excellent general benchmark"],
    limitations: ["Unconstrained depth may use excess RAM on massive noisy data"],
    whenNotToUse: "Severe class imbalance or tight memory constraints.",
  },
  {
    id: "high_accuracy",
    name: "2. High-Accuracy / Competitive Kaggle",
    targetScenario: "Competitive tabular benchmarks where predictive accuracy is prioritized over latency.",
    rationale: "Large forest size combined with slight leaf regularization to maximize out-of-sample generalization.",
    code: `from sklearn.ensemble import RandomForestClassifier

rf_competitive = RandomForestClassifier(
    n_estimators=400,
    max_depth=20,
    min_samples_split=4,
    min_samples_leaf=2,
    max_features="sqrt",
    bootstrap=True,
    oob_score=True,
    n_jobs=-1,
    random_state=42
)`,
    pros: ["Peak generalization", "Low variance", "Built-in OOB validation"],
    limitations: ["Slower inference", "Large on-disk serialized size"],
    whenNotToUse: "Microsecond real-time inference constraints.",
  },
  {
    id: "regularized",
    name: "3. Regularized / Overfitting-Controlled Forest",
    targetScenario: "Noisy datasets where features carry substantial random fluctuations.",
    rationale: "Restricts tree depth, enforces leaf sample support, and prunes trivial impurity splits.",
    code: `from sklearn.ensemble import RandomForestClassifier

rf_regularized = RandomForestClassifier(
    n_estimators=250,
    max_depth=12,
    min_samples_split=8,
    min_samples_leaf=4,
    max_leaf_nodes=80,
    min_impurity_decrease=0.002,
    n_jobs=-1,
    random_state=42
)`,
    pros: ["Prevents noise memorization", "Stable decision boundaries", "Compact tree size"],
    limitations: ["Slightly higher bias on complex clean data"],
    whenNotToUse: "Small sample sizes with clean signal.",
  },
  {
    id: "large_dataset",
    name: "4. Large Dataset / Computational Efficiency",
    targetScenario: "Massive datasets (>500k rows) where training time is the primary bottleneck.",
    rationale: "Uses sub-bagging (max_samples=0.6) and depth limits to accelerate tree training by 3x-4x.",
    code: `from sklearn.ensemble import RandomForestClassifier

rf_bigdata = RandomForestClassifier(
    n_estimators=150,
    max_depth=15,
    max_samples=0.6,          # Sub-bagging: 60% subsample per tree
    min_samples_leaf=10,
    max_features="sqrt",
    n_jobs=-1,
    random_state=42
)`,
    pros: ["3x-4x training speedup", "Low memory consumption", "Good scalability"],
    limitations: ["Slightly lower individual tree strength"],
    whenNotToUse: "Small sample sizes (< 1,000 rows).",
  },
  {
    id: "imbalanced",
    name: "5. Imbalanced Classification",
    targetScenario: "Fraud detection, defect prediction, rare medical diagnostics.",
    rationale: "Dynamically reweights classes inside each bootstrap replicate to prioritize minority purity.",
    code: `from sklearn.ensemble import RandomForestClassifier

rf_imbalanced = RandomForestClassifier(
    n_estimators=300,
    max_depth=15,
    min_samples_leaf=3,
    class_weight="balanced_subsample",  # Re-weight per bootstrap sample
    n_jobs=-1,
    random_state=42
)`,
    pros: ["High minority recall", "Zero synthetic data generation", "Adapts to local sampling"],
    limitations: ["Elevates false positive rate without threshold tuning"],
    whenNotToUse: "Perfect 50:50 balanced datasets.",
  },
  {
    id: "reproducible",
    name: "6. Reproducible Experimentation",
    targetScenario: "Research papers, compliance audits, reproducible ML pipelines.",
    rationale: "Fixes PRNG seeds and records OOB score for deterministic replication.",
    code: `from sklearn.ensemble import RandomForestClassifier

rf_audit = RandomForestClassifier(
    n_estimators=200,
    bootstrap=True,
    oob_score=True,
    random_state=42,           # Deterministic PRNG seed
    n_jobs=1                   # Single worker guarantees exact deterministic thread order
)`,
    pros: ["Exact numerical reproducibility", "Auditable compliance"],
    limitations: ["Single-threaded (slower)"],
    whenNotToUse: "High-throughput latency-sensitive training.",
  },
  {
    id: "memory_constrained",
    name: "7. Memory-Constrained / Edge Deployment",
    targetScenario: "IoT devices, mobile apps, embedded microcontrollers with strict RAM limits.",
    rationale: "Strictly caps leaf nodes and tree count to keep model checkpoint size under 1MB.",
    code: `from sklearn.ensemble import RandomForestClassifier

rf_edge = RandomForestClassifier(
    n_estimators=50,
    max_depth=8,
    max_leaf_nodes=30,
    min_samples_leaf=5,
    ccp_alpha=0.01,            # Post-pruning to collapse redundant leaves
    n_jobs=-1,
    random_state=42
)`,
    pros: ["Tiny serialized file size (< 1 MB)", "Sub-millisecond inference", "L3 cache resident"],
    limitations: ["Modest capacity ceiling on complex tasks"],
    whenNotToUse: "High-capacity server environments.",
  },
  {
    id: "monotonic",
    name: "8. Monotonic / Domain-Constrained",
    targetScenario: "Credit scoring, insurance underwriting, pricing models requiring business rules.",
    rationale: "Enforces non-decreasing or non-increasing directional constraints on key predictor variables.",
    code: `from sklearn.ensemble import RandomForestClassifier

# Feature 0: Income (+1 increasing), Feature 1: Debt-to-income (-1 decreasing), Feature 2: Age (0 unconstrained)
rf_monotonic = RandomForestClassifier(
    n_estimators=200,
    monotonic_cst=[1, -1, 0],
    n_jobs=-1,
    random_state=42
)`,
    pros: ["Regulatory compliance", "Guaranteed intuitive behavior", "Prevents nonsensical split reversals"],
    limitations: ["Supported only for binary classification and regression"],
    whenNotToUse: "Multiclass classification or tasks without clear directional physics.",
  },
];

export function HyperparameterLabModule() {
  const [activeTab, setActiveTab] = useState<"explorer" | "parallelism" | "interactions" | "presets">("explorer");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedParamId, setSelectedParamId] = useState<string>("n_estimators");
  const [selectedPresetId, setSelectedPresetId] = useState<string>("baseline");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeParam = hyperparameters.find((p) => p.id === selectedParamId) || hyperparameters[0];
  const activePreset = presets.find((p) => p.id === selectedPresetId) || presets[0];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredParams = hyperparameters.filter(
    (p) => selectedCategory === "All" || p.category === selectedCategory
  );

  return (
    <div className="space-y-12 pt-8">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {[
          { id: "explorer", label: "All 18 Hyperparameters", icon: Sliders },
          { id: "parallelism", label: "CPU Parallelization (n_jobs)", icon: Cpu },
          { id: "interactions", label: "Hyperparameter Interactions", icon: Zap },
          { id: "presets", label: "8 Production Presets", icon: Gauge },
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
      {/* TAB 1: ALL 18 HYPERPARAMETERS EXPLORER                               */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "explorer" && (
        <div className="space-y-8">
          <SectionHeading
            index="SECTION 01"
            title="Exhaustive Hyperparameter Reference: All 18 Parameters"
            desc="Complete technical specification, mathematical intuition, and practical behavior for Scikit-Learn's RandomForestClassifier."
          />

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground mr-2 flex items-center gap-1">
              <Filter className="size-3.5" /> Filter Category:
            </span>
            {["All", "Tree Structure", "Randomization", "Compute & System", "Constraints & Weights"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 18 Parameters Grid Selector */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {filteredParams.map((p) => {
              const isSelected = p.id === selectedParamId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedParamId(p.id)}
                  className={`flex flex-col items-start rounded-xl p-3 text-left transition-all ${
                    isSelected
                      ? "border border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                      : "border border-border bg-card/60 hover:border-border/80 hover:bg-secondary/30"
                  }`}
                >
                  <span className="font-mono text-xs font-bold text-foreground truncate w-full">
                    {p.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate w-full mt-1">
                    Def: {p.defaultVal}
                  </span>
                  <span
                    className={`mt-2 inline-block rounded px-1.5 py-0.5 text-[9px] font-mono font-medium ${
                      p.category === "Tree Structure"
                        ? "bg-primary/10 text-primary"
                        : p.category === "Randomization"
                        ? "bg-accent/10 text-accent"
                        : p.category === "Compute & System"
                        ? "bg-warning/10 text-warning"
                        : "bg-success/10 text-success"
                    }`}
                  >
                    {p.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Parameter Detailed Deep-Dive Card */}
          <div className="surface rounded-xl border border-primary/30 bg-primary/[0.02] p-6 shadow-lg space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-mono text-lg font-bold text-foreground">
                    {activeParam.name}
                  </h3>
                  <span className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-xs text-primary font-semibold">
                    Default: {activeParam.defaultVal}
                  </span>
                  <span className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    Type: {activeParam.acceptedTypes}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Valid Range: <strong className="font-mono text-foreground">{activeParam.validRange}</strong>
                </p>
              </div>

              <button
                onClick={() => handleCopy(activeParam.id, activeParam.codeSnippet)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-mono text-foreground hover:bg-secondary/80 transition-colors"
              >
                {copiedId === activeParam.id ? (
                  <>
                    <Check className="size-3 text-success" /> Copied Code!
                  </>
                ) : (
                  <>
                    <Copy className="size-3 text-muted-foreground" /> Copy Python Snippet
                  </>
                )}
              </button>
            </div>

            {/* Impact Metric Chips */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 font-mono text-xs">
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="text-[10px] text-muted-foreground">Bias</div>
                <div className={`mt-1 font-bold ${activeParam.impactBias === "Increases" ? "text-warning" : activeParam.impactBias === "Decreases" ? "text-success" : "text-muted-foreground"}`}>
                  {activeParam.impactBias}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="text-[10px] text-muted-foreground">Variance</div>
                <div className={`mt-1 font-bold ${activeParam.impactVariance === "Decreases" ? "text-success" : activeParam.impactVariance === "Increases" ? "text-destructive" : "text-muted-foreground"}`}>
                  {activeParam.impactVariance}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="text-[10px] text-muted-foreground">Overfitting Risk</div>
                <div className={`mt-1 font-bold ${activeParam.impactOverfit === "Decreases risk" ? "text-success" : activeParam.impactOverfit === "Increases risk" ? "text-destructive" : "text-muted-foreground"}`}>
                  {activeParam.impactOverfit}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="text-[10px] text-muted-foreground">Training Time</div>
                <div className={`mt-1 font-bold ${activeParam.impactTime === "Increases" ? "text-destructive" : activeParam.impactTime === "Decreases" ? "text-success" : "text-muted-foreground"}`}>
                  {activeParam.impactTime}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="text-[10px] text-muted-foreground">RAM Footprint</div>
                <div className={`mt-1 font-bold ${activeParam.impactMemory === "Increases" ? "text-destructive" : activeParam.impactMemory === "Decreases" ? "text-success" : "text-muted-foreground"}`}>
                  {activeParam.impactMemory}
                </div>
              </div>
            </div>

            {/* Body breakdown */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Core Function & Definition
                  </h4>
                  <p className="mt-1 text-sm text-foreground leading-relaxed">
                    {activeParam.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                    Internal Working Mechanism
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {activeParam.mechanism}
                  </p>
                </div>

                {activeParam.formula && (
                  <div>
                    <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                      Mathematical Formulation
                    </h4>
                    <div className="mt-2 rounded-lg border border-border bg-background p-3 text-center overflow-x-auto">
                      <MathView math={activeParam.formula} display />
                    </div>
                    {activeParam.formulaExplanation && (
                      <p className="mt-1 text-[11px] text-muted-foreground font-mono">
                        {activeParam.formulaExplanation}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-success">
                    Production Tuning Recommendation
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed bg-success/5 border border-success/20 rounded-lg p-3">
                    {activeParam.tuningRecommendation}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-destructive">
                    Common Mistakes & Traps
                  </h4>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    {activeParam.commonMistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="size-3.5 text-destructive shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Executable Python Snippet
                  </h4>
                  <pre className="mt-2 rounded-lg border border-border bg-background p-3 font-mono text-xs text-accent overflow-x-auto leading-relaxed">
                    <code>{activeParam.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 2: CPU PARALLELIZATION (N_JOBS) DEEP DIVE                       */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "parallelism" && (
        <div className="space-y-8">
          <SectionHeading
            index="SECTION 02"
            title="CPU Parallelization Deep Dive: Understanding n_jobs"
            desc="Physical vs logical processors, Python GIL bypass mechanics, process serialization overhead, and the nested parallelism anti-pattern."
          />

          {/* Core Concept Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="surface rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Cpu className="size-4" /> Physical vs Logical Cores
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A physical core is an independent execution unit with dedicated registers, ALUs, and L1/L2 caches. Intel Hyper-Threading / AMD SMT duplicates architectural state to present 2 <em>logical processors</em> per physical core.
              </p>
              <div className="rounded-lg bg-secondary/40 p-2.5 font-mono text-[11px] text-foreground">
                8 Physical Cores = 16 Logical Threads. For CPU-bound tree building, doubling threads only yields ~15–30% speedup due to shared execution pipelines.
              </div>
            </div>

            <div className="surface rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                <Zap className="size-4" /> Python GIL & Joblib Loky
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Python's Global Interpreter Lock (GIL) prevents multiple native threads from executing Python bytecode concurrently. Scikit-learn bypasses this completely by using <code>joblib</code> with the <code>loky</code> multiprocessing backend.
              </p>
              <div className="rounded-lg bg-secondary/40 p-2.5 font-mono text-[11px] text-foreground">
                Independent worker processes are spawned, each running its own Python runtime and Cython compiled tree builder in parallel without GIL contention.
              </div>
            </div>

            <div className="surface rounded-xl border border-border p-5 space-y-3">
              <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                <AlertTriangle className="size-4" /> Oversubscription & Contention
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Spawning more worker processes than physical CPU cores causes severe context switching, memory bus saturation, and L3 cache thrashing.
              </p>
              <div className="rounded-lg bg-secondary/40 p-2.5 font-mono text-[11px] text-foreground">
                When dataset size is small (&lt; 10,000 rows), IPC process serialization overhead exceeds training time, making n_jobs=-1 slower than n_jobs=1!
              </div>
            </div>
          </div>

          {/* The Nested Parallelism Anti-Pattern Deep Dive */}
          <div className="surface rounded-xl border border-destructive/40 bg-destructive/[0.02] p-6 space-y-6">
            <div className="flex items-center gap-2.5 text-destructive font-bold text-base">
              <ShieldCheck className="size-5" />
              The Dreaded Nested Parallelism Anti-Pattern (Worker Explosion)
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              When tuning Random Forest via <code>GridSearchCV</code>, setting <code>n_jobs=-1</code> on BOTH the search and the model creates a massive multiplication of worker processes:
            </p>

            <div className="rounded-lg border border-destructive/20 bg-background p-4 font-mono text-xs text-destructive overflow-x-auto leading-relaxed">
              <code>{`# ❌ CRITICAL ANTI-PATTERN: Severe CPU Oversubscription
from sklearn.model_selection import GridSearchCV
from sklearn.ensemble import RandomForestClassifier

# If your machine has 16 logical cores:
# GridSearchCV spawns 16 outer workers!
# Each outer worker spawns 16 inner Random Forest workers!
# Total worker processes = 16 x 16 = 256 PROCESSES fighting for 16 cores!

model = RandomForestClassifier(n_estimators=300, n_jobs=-1)  # ❌ Inner n_jobs=-1
search = GridSearchCV(estimator=model, param_grid=grid, cv=5, n_jobs=-1)  # ❌ Outer n_jobs=-1
search.fit(X_train, y_train)  # Massive memory spike, thrashing, and system freeze!`}</code>
            </div>

            {/* Recommended Solutions Grid */}
            <div className="grid gap-6 md:grid-cols-2 pt-2">
              <div className="rounded-xl border border-success/40 bg-success/5 p-4 space-y-2">
                <div className="text-success font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" /> OPTION A: Parallelize Outer Search (Recommended for GridSearch)
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Set <code>n_jobs=-1</code> on <code>GridSearchCV</code> and <code>n_jobs=1</code> on <code>RandomForestClassifier</code>. Each core evaluates a different hyperparameter configuration independently with zero inter-process synchronization.
                </p>
                <pre className="mt-2 rounded bg-background p-2.5 font-mono text-[11px] text-success overflow-x-auto">
                  <code>{`model = RandomForestClassifier(n_estimators=300, n_jobs=1, random_state=42)
search = GridSearchCV(model, param_grid, cv=5, n_jobs=-1)`}</code>
                </pre>
              </div>

              <div className="rounded-xl border border-primary/40 bg-primary/5 p-4 space-y-2">
                <div className="text-primary font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="size-4" /> OPTION B: Parallelize Inner Forest (Recommended for Large Models)
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Set <code>n_jobs=1</code> on <code>GridSearchCV</code> and <code>n_jobs=-1</code> on <code>RandomForestClassifier</code>. Used when dataset is so large that fitting 16 concurrent models would exceed physical system RAM.
                </p>
                <pre className="mt-2 rounded bg-background p-2.5 font-mono text-[11px] text-primary overflow-x-auto">
                  <code>{`model = RandomForestClassifier(n_estimators=300, n_jobs=-1, random_state=42)
search = GridSearchCV(model, param_grid, cv=5, n_jobs=1)`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 3: HYPERPARAMETER INTERACTIONS                                 */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "interactions" && (
        <div className="space-y-8">
          <SectionHeading
            index="SECTION 03"
            title="Four Critical Hyperparameter Interactions"
            desc="Hyperparameters do not operate in isolation. Understanding their joint mechanics is essential for principled tuning."
          />

          <div className="grid gap-6 md:grid-cols-2">
            {/* Interaction 1 */}
            <div className="surface rounded-xl border border-border p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-mono text-xs font-bold text-primary">
                  Interaction 1: n_estimators × max_features
                </span>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-mono text-primary">
                  Variance vs Strength Tradeoff
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When you decrease <code>max_features</code> (e.g. from <MathView math="\sqrt{p}" /> down to <MathView math="\log_2(p)" />), individual trees are forced to choose weaker split features. This decorrelates the trees (lowering pairwise correlation <MathView math="\rho" />), but reduces individual tree strength <MathView math="s" />.
              </p>
              <div className="rounded-lg bg-secondary/40 p-3 font-mono text-xs text-foreground space-y-1">
                <div>• Lower <strong>max_features</strong> → Requires HIGHER <strong>n_estimators</strong></div>
                <div>• Higher <strong>max_features</strong> → Trees are stronger, requiring fewer <strong>n_estimators</strong></div>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Rule of Thumb:</strong> If you drop <code>max_features</code> to decorrelate an ensemble, always increase <code>n_estimators</code> to 300–500 to compensate for weaker individual trees.
              </p>
            </div>

            {/* Interaction 2 */}
            <div className="surface rounded-xl border border-border p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-mono text-xs font-bold text-accent">
                  Interaction 2: max_depth × min_samples_leaf
                </span>
                <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-mono text-accent">
                  Global vs Local Regularization
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <code>max_depth</code> sets a global ceiling on vertical tree expansion, whereas <code>min_samples_leaf</code> enforces local statistical support at the bottom of the tree.
              </p>
              <div className="rounded-lg bg-secondary/40 p-3 font-mono text-xs text-foreground space-y-1">
                <div>• If <strong>min_samples_leaf=20</strong>, deep trees can never grow (leaves terminate early).</div>
                <div>• If <strong>max_depth=5</strong>, min_samples_leaf rarely triggers (depth halts growth first).</div>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Rule of Thumb:</strong> Leave <code>max_depth=None</code> and tune <code>min_samples_leaf</code> directly (3 to 10). It regularizes tree boundaries naturally based on local sample density.
              </p>
            </div>

            {/* Interaction 3 */}
            <div className="surface rounded-xl border border-border p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-mono text-xs font-bold text-warning">
                  Interaction 3: bootstrap × max_samples
                </span>
                <span className="rounded bg-warning/10 px-2 py-0.5 text-[10px] font-mono text-warning">
                  Sub-bagging / Pasting Mechanics
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <code>max_samples</code> is only valid when <code>bootstrap=True</code>. When both are enabled, each tree is built on a random subsample drawn with replacement.
              </p>
              <div className="rounded-lg bg-secondary/40 p-3 font-mono text-xs text-foreground space-y-1">
                <div>• <strong>bootstrap=True, max_samples=None</strong>: Standard Breiman Bagging (~63.2% unique)</div>
                <div>• <strong>bootstrap=True, max_samples=0.5</strong>: Sub-bagging (50% sample size, ultra fast)</div>
                <div>• <strong>bootstrap=False</strong>: Uses 100% of rows (variance reduction solely from features)</div>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Rule of Thumb:</strong> For datasets over 200,000 rows, setting <code>max_samples=0.5</code> cuts training time in half while maintaining 99%+ of baseline accuracy.
              </p>
            </div>

            {/* Interaction 4 */}
            <div className="surface rounded-xl border border-border p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="font-mono text-xs font-bold text-success">
                  Interaction 4: class_weight × min_samples_leaf
                </span>
                <span className="rounded bg-success/10 px-2 py-0.5 text-[10px] font-mono text-success">
                  Imbalance Thresholding
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <code>min_samples_leaf</code> counts <em>raw unweighted observations</em> by default. If minority samples are rare (e.g. 1%), setting <code>min_samples_leaf=20</code> can make it impossible for a tree to isolate a pure minority leaf!
              </p>
              <div className="rounded-lg bg-secondary/40 p-3 font-mono text-xs text-foreground space-y-1">
                <div>• High <strong>min_samples_leaf</strong> + Extreme Imbalance → Minority class is drowned out</div>
                <div>• Keep <strong>min_samples_leaf=1–3</strong> when working with severe class imbalance</div>
              </div>
              <p className="text-xs text-muted-foreground">
                <strong>Rule of Thumb:</strong> When applying <code>class_weight='balanced_subsample'</code>, keep <code>min_samples_leaf</code> small (1 or 2) so rare minority clusters can be isolated.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 4: 8 PRODUCTION PRESETS                                          */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "presets" && (
        <div className="space-y-8">
          <SectionHeading
            index="SECTION 04"
            title="Eight Battle-Tested Production Presets"
            desc="Ready-to-use Scikit-Learn Random Forest configurations engineered for specific real-world operational profiles."
          />

          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            {/* Presets List */}
            <div className="space-y-2.5">
              {presets.map((preset) => {
                const isSelected = preset.id === selectedPresetId;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`w-full rounded-xl p-4 text-left transition-all ${
                      isSelected
                        ? "border border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                        : "border border-border bg-card/60 hover:bg-secondary/40"
                    }`}
                  >
                    <div className="font-semibold text-sm text-foreground">{preset.name}</div>
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {preset.targetScenario}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Preset Detailed View */}
            <div className="surface rounded-xl border border-border p-6 space-y-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h3 className="text-base font-bold text-foreground">{activePreset.name}</h3>
                  <p className="mt-1 text-xs text-accent font-medium">{activePreset.targetScenario}</p>
                </div>

                <button
                  onClick={() => handleCopy(activePreset.id, activePreset.code)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-mono text-foreground hover:bg-secondary/80"
                >
                  {copiedId === activePreset.id ? (
                    <>
                      <Check className="size-3 text-success" /> Copied Preset!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3 text-muted-foreground" /> Copy Preset Code
                    </>
                  )}
                </button>
              </div>

              <div>
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  Architectural Rationale
                </h4>
                <p className="mt-1.5 text-xs text-foreground leading-relaxed">
                  {activePreset.rationale}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  Scikit-Learn Production Code
                </h4>
                <pre className="mt-2 rounded-lg border border-border bg-background p-4 font-mono text-xs text-accent overflow-x-auto leading-relaxed">
                  <code>{activePreset.code}</code>
                </pre>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2 text-xs">
                <div className="rounded-lg border border-success/30 bg-success/5 p-3 space-y-1.5">
                  <span className="font-semibold text-success flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> Key Advantages
                  </span>
                  <ul className="space-y-1 text-muted-foreground">
                    {activePreset.pros.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 space-y-1.5">
                  <span className="font-semibold text-warning flex items-center gap-1">
                    <AlertTriangle className="size-3.5" /> When NOT to Use
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    {activePreset.whenNotToUse}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
