import { useState } from "react";
import {
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Compass,
  ArrowRight,
  Database,
  Cpu,
  Zap,
  ShieldAlert,
  Search,
  BookOpen,
} from "lucide-react";
import { SectionHeading } from "./primitives";

/* -------------------------------------------------------------------------- */
/* TYPES & VOCABULARY                                                         */
/* -------------------------------------------------------------------------- */
export type RatingLevel =
  | "Excellent"
  | "Good"
  | "Moderate"
  | "Limited"
  | "Poor"
  | "Depends on implementation";

export interface CriterionAssessment {
  rating: RatingLevel;
  summary: string;
  details: string;
  caveats: string;
  practical: string;
}

export interface AlgorithmFamily {
  id: string;
  name: string;
  category: string;
  subtypes: string;
  strengths: string[];
  weaknesses: string[];
  bestFor: string;
  assessments: Record<string, CriterionAssessment>;
}

export interface CriterionDef {
  id: string;
  name: string;
  description: string;
  whyItMatters: string;
}

/* -------------------------------------------------------------------------- */
/* 10 TECHNICAL COMPARISON CRITERIA                                           */
/* -------------------------------------------------------------------------- */
const criteriaList: CriterionDef[] = [
  {
    id: "interpretability",
    name: "1. Interpretability",
    description: "How easily model decisions, feature effects, and internal mechanics can be explained to humans and regulators.",
    whyItMatters: "Essential in regulated domains (healthcare, banking, credit) where adverse decisions require auditability.",
  },
  {
    id: "training_complexity",
    name: "2. Training Complexity",
    description: "Computational time and computational scaling behavior (big-O) with respect to sample size N and features p.",
    whyItMatters: "Determines retraining cadence, compute infrastructure costs, and viability on massive datasets.",
  },
  {
    id: "inference_latency",
    name: "3. Inference Latency",
    description: "Time required to evaluate a single sample or micro-batch in online production scoring.",
    whyItMatters: "Critical for meeting sub-50ms or single-digit microsecond SLAs in fraud detection and ad tech.",
  },
  {
    id: "memory_footprint",
    name: "4. Memory Footprint",
    description: "Serialized model artifact size on disk and resident RAM consumption during inference execution.",
    whyItMatters: "Governs deployment feasibility on resource-constrained microcontrollers, mobile edge devices, or multi-tenant lambdas.",
  },
  {
    id: "nonlinear_handling",
    name: "5. Nonlinear Relationships",
    description: "Inherent capability to capture high-order feature interactions, discontinuities, and curved manifolds without manual transformations.",
    whyItMatters: "Reduces feature engineering overhead on complex real-world tabular and physical systems.",
  },
  {
    id: "feature_scaling",
    name: "6. Feature Scaling Sensitivity",
    description: "Whether monotonic feature scaling (z-score normalization, min-max) is required for correct optimization.",
    whyItMatters: "Invariance to scaling eliminates extensive preprocessing steps and guards against distribution drift in numerical scales.",
  },
  {
    id: "missing_values",
    name: "7. Missing Value Handling",
    description: "Native capacity to handle unobserved feature values without upfront imputation pipelines.",
    whyItMatters: "Imputation introduces bias and latency; native missing value support simplifies data pipelines.",
  },
  {
    id: "imbalanced_data",
    name: "8. Imbalanced Data Handling",
    description: "Flexibility and built-in mechanics to learn from highly skewed target label distributions.",
    whyItMatters: "Vital for fraud, defect detection, and disease screening where positive instances constitute < 1% of observations.",
  },
  {
    id: "probability_estimation",
    name: "9. Probability Estimation",
    description: "Reliability and calibration quality of predicted class probability estimates.",
    whyItMatters: "Business risk engines require true empirical probabilities rather than uncalibrated confidence tallies.",
  },
  {
    id: "high_dimensional",
    name: "10. High-Dimensional Data",
    description: "Predictive stability and resilience to overfitting when feature count p approaches or exceeds sample count N (p >> N).",
    whyItMatters: "Common in genomics, NLP bag-of-words, text classification, and chemometrics.",
  },
];

/* -------------------------------------------------------------------------- */
/* 9 ALGORITHM FAMILIES DATA MATRIX                                           */
/* -------------------------------------------------------------------------- */
const algorithmFamilies: AlgorithmFamily[] = [
  {
    id: "random_forest",
    name: "Random Forest",
    category: "Bagged Tree Ensemble",
    subtypes: "sklearn.ensemble.RandomForestClassifier, ExtraTreesClassifier",
    strengths: [
      "Robust out-of-the-box defaults requiring minimal tuning",
      "Embarrassingly parallel training across multi-core CPUs",
      "Invariant to monotonic feature scaling",
      "Natural feature importance scores and OOB error estimation",
    ],
    weaknesses: [
      "High RAM footprint for deep, unpruned tree collections",
      "Cannot extrapolate beyond training feature ranges",
      "Probabilities push away from 0 and 1 due to voting averaging",
    ],
    bestFor: "Noisy, heterogeneous tabular datasets where robust generalization is needed with minimal hyperparameter tuning.",
    assessments: {
      interpretability: {
        rating: "Moderate",
        summary: "Feature importances (MDI, Permutation) and SHAP values available, but individual decision paths cannot be audited directly across hundreds of trees.",
        details: "While single trees are transparent, an ensemble of 300 deep trees creates a non-linear black box. Global importances provide directional guidance, but local explanations require model-agnostic tools like TreeSHAP.",
        caveats: "MDI (impurity-based) importance is biased toward high-cardinality continuous features.",
        practical: "Approved for internal credit scorecards when accompanied by SHAP explanations, but harder to defend in strict adverse action reviews than logistic regression.",
      },
      training_complexity: {
        rating: "Good",
        summary: "O(B · m · N · log(N)) where B is trees, m is max_features. Embarrassingly parallel across CPU cores.",
        details: "Tree construction scales near-linearly with core count via joblib multiprocessing. However, sorting large continuous features at every node split can become CPU-intensive.",
        caveats: "Histogram-based gradient boosting (LightGBM) is significantly faster to train on massive (> 1M rows) datasets.",
        practical: "Excellent for up to 500k rows on a modern 16-core workstation.",
      },
      inference_latency: {
        rating: "Moderate",
        summary: "O(B · depth) sequential tree traversals per sample. Typically 2ms–20ms per prediction.",
        details: "Evaluating a single record requires passing it through all B trees and computing the majority tally. Model size limits cache residency.",
        caveats: "Can be accelerated by 10x using Treelite / ONNX Runtime compilation to C code.",
        practical: "Comfortably satisfies 50ms web SLAs, but may struggle with ultra-low latency (< 1ms) high-frequency finance environments without tree pruning.",
      },
      memory_footprint: {
        rating: "Limited",
        summary: "50MB to 500MB+ serialized on disk. Tree nodes consume significant resident RAM.",
        details: "Unconstrained trees with thousands of leaf nodes store split feature indices, thresholds, impurity values, and sample weights across every node.",
        caveats: "Pruning using min_samples_leaf=5 or max_depth=12 reduces memory consumption by up to 80%.",
        practical: "Unsuited for ultra-small embedded microcontrollers without post-pruning or quantization.",
      },
      nonlinear_handling: {
        rating: "Excellent",
        summary: "Captures arbitrary complex non-linear decision boundaries and high-order feature interactions automatically.",
        details: "Hierarchical orthogonal splits naturally segment the feature space into hyper-rectangles, effortlessly modeling XOR problems, threshold effects, and multi-feature synergies.",
        caveats: "Splits are axis-aligned; smooth diagonal or circular decision boundaries require many stepped partitions.",
        practical: "Gold standard for tabular datasets with complex non-linear dynamics.",
      },
      feature_scaling: {
        rating: "Excellent",
        summary: "Completely invariant to monotonic feature scaling, standardization, and outlier transformations.",
        details: "Decision trees evaluate rank-ordered thresholds (X_j <= theta). Multiplying by a constant or applying log transforms preserves monotonic order and produces mathematically identical split partitions.",
        caveats: "Non-monotonic transformations (e.g. sin(x)) alter split geometry.",
        practical: "Saves substantial engineering time; zero preprocessing pipeline needed for numerical columns.",
      },
      missing_values: {
        rating: "Moderate",
        summary: "Scikit-Learn requires imputation (SimpleImputer, IterativeImputer). Native support added in HistGradientBoosting.",
        details: "Standard Scikit-Learn RandomForestClassifier does not support missing values natively (NaN). Practitioners must impute before fitting or use missing-indicator masks.",
        caveats: "R's randomForest and H2O RF natively route NaNs using surrogate splits.",
        practical: "Always place SimpleImputer inside a Pipeline before fitting Scikit-Learn RandomForest.",
      },
      imbalanced_data: {
        rating: "Good",
        summary: "Built-in class_weight='balanced' and 'balanced_subsample' plus integration with SMOTE.",
        details: "class_weight='balanced_subsample' re-estimates class frequencies dynamically for each bootstrap replicate, penalizing minority classification mistakes during split evaluation.",
        caveats: "On extreme ratios (> 1:1000), standard class weighting may produce high false-positive rates without custom threshold tuning.",
        practical: "Reliable performer in fraud and defect detection when paired with precision-recall threshold calibration.",
      },
      probability_estimation: {
        rating: "Moderate",
        summary: "Outputs voting fractions. Tends to avoid extreme probabilities (0.0 and 1.0); requires calibration.",
        details: "Voting averaging over leaves pulls predicted probabilities toward the training base rate. Leaf purity variance means uncalibrated scores are often overconfident in intermediate ranges.",
        caveats: "CalibratedClassifierCV with sigmoid or isotonic regression is recommended for high-stakes probability tasks.",
        practical: "Raw predict_proba is adequate for ranking (ROC-AUC), but must be calibrated for expected loss calculations.",
      },
      high_dimensional: {
        rating: "Moderate",
        summary: "Feature subspace sampling (max_features='sqrt') helps, but sparse high-dimensional data degrades performance.",
        details: "When p >> N with many uninformative noise features, random feature sampling frequently selects only noise features at a given split, diluting tree quality.",
        caveats: "Linear models and Lasso regularization outperform Random Forest on sparse text/bag-of-words datasets.",
        practical: "Filter out low-variance noise features before training on genomic or wide tabular matrices.",
      },
    },
  },
  {
    id: "linear_models",
    name: "Linear Models",
    category: "Parametric Generalized Linear",
    subtypes: "LogisticRegression, RidgeClassifier, SGDClassifier, Lasso",
    strengths: [
      "Maximum interpretability via explicit regression coefficients",
      "Sub-millisecond inference latency (single dot product w · x)",
      "Minimal memory footprint (< 10 KB)",
      "Excellent on high-dimensional sparse text data (TF-IDF)",
    ],
    weaknesses: [
      "Cannot capture non-linear relationships without manual feature engineering",
      "Strictly requires feature scaling and outlier handling",
      "Sensitive to multicollinearity and irrelevant features without regularization",
    ],
    bestFor: "Regulatory compliance auditing, baseline modeling, high-dimensional sparse text classification, and sub-millisecond edge scoring.",
    assessments: {
      interpretability: {
        rating: "Excellent",
        summary: "Direct transparency. Every weight w_j represents the exact log-odds change per unit increase in feature X_j.",
        details: "Coefficients provide unambiguous directional impact and odds ratios (exp(w_j)). Standard errors and p-values quantify statistical significance under asymptotic normality.",
        caveats: "Multicollinearity inflates variance of weights, confounding individual feature interpretations unless regularized (L2).",
        practical: "The mandatory gold standard for adverse action notices in consumer banking and legal compliance.",
      },
      training_complexity: {
        rating: "Excellent",
        summary: "O(N · p) with convex solvers (L-BFGS, Coordinate Descent, SGD). Rapid convergence.",
        details: "Loss surfaces (cross-entropy, squared error) are strictly convex, guaranteeing convergence to the global optimum without local minima traps.",
        caveats: "Convergence slows down drastically if features are not standardized.",
        practical: "Trains in seconds on millions of records using SGDClassifier.",
      },
      inference_latency: {
        rating: "Excellent",
        summary: "Sub-millisecond latency. Computes a single linear dot product: z = w^T x + b.",
        details: "Requires only p floating-point multiply-accumulate operations followed by a scalar sigmoid evaluation. Vectorizes trivially on SIMD hardware.",
        caveats: "Feature preprocessing (imputation, scaling) must also run within the latency budget.",
        practical: "Optimal for high-throughput ad-click prediction serving 100k requests/sec.",
      },
      memory_footprint: {
        rating: "Excellent",
        summary: "Tiny model footprint. Only stores a p-dimensional weight vector and scalar intercept (< 10 KB).",
        details: "A model with 1,000 features requires under 8 KB of RAM. Easily fits inside L1 CPU cache.",
        caveats: "Memory footprint only expands if massive sparse vocabularies (millions of n-grams) are retained.",
        practical: "Flawless for embedded microcontrollers, browser WebAssembly, and IoT edge deployment.",
      },
      nonlinear_handling: {
        rating: "Limited",
        summary: "Linear decision boundaries only. Cannot capture curved manifolds without manual polynomial/spline expansion.",
        details: "Assumes log-odds are a strictly linear combination of predictors. Fails entirely on XOR problems or non-monotonic response functions without manual feature transformations.",
        caveats: "PolynomialFeatures or generalized additive models (GAMs) can introduce non-linearity at the cost of dimensionality expansion.",
        practical: "Underperforms tree ensembles on raw structured tabular problems with complex feature interactions.",
      },
      feature_scaling: {
        rating: "Poor",
        summary: "Strictly requires normalization or standardization. Inconsistent scales destroy gradient convergence and regularizer fairness.",
        details: "L1 and L2 penalty terms (lambda sum |w| or lambda sum w^2) penalize all coefficients equally. Features with large scales receive artificially small coefficients and escape regularization.",
        caveats: "Unscaled features cause L-BFGS to oscillate or fail to converge.",
        practical: "Always pair with StandardScaler() inside a Scikit-Learn Pipeline.",
      },
      missing_values: {
        rating: "Poor",
        summary: "Cannot accept NaN values. Strict imputation or missing-indicator encoding required.",
        details: "Matrix multiplications require continuous floating-point values. A single NaN in the feature vector produces NaN prediction.",
        caveats: "SimpleImputer with mean or median is mandatory prior to scoring.",
        practical: "Pipeline must maintain robust fallback imputation defaults for unseen production NaNs.",
      },
      imbalanced_data: {
        rating: "Good",
        summary: "Supported via class_weight='balanced' or cost-sensitive threshold tuning.",
        details: "Modifies the cross-entropy loss by weighting minority observation losses inversely proportional to class frequencies. Shifting the decision threshold theta away from 0.5 optimizes precision/recall.",
        caveats: "On extreme imbalance, estimated probabilities can suffer from separation or shrinkage.",
        practical: "Frequently paired with threshold tuning on the PR curve for fraud and disease detection.",
      },
      probability_estimation: {
        rating: "Excellent",
        summary: "Natively optimizes cross-entropy loss; probabilities are directly calibrated by design.",
        details: "Logistic regression fits maximum likelihood on the Bernoulli distribution, directly modeling P(Y=1 | x) = 1 / (1 + exp(-w^T x)). Asymptotically well-calibrated without external post-processing.",
        caveats: "Calibration degrades if the true underlying relationship is heavily non-linear and unmodeled.",
        practical: "First choice when downstream systems require trusted probability estimates (e.g. expected value calculations).",
      },
      high_dimensional: {
        rating: "Excellent",
        summary: "Excels when p >> N using L1 (Lasso) or L2 (Ridge) regularization. Gold standard for sparse matrices.",
        details: "Lasso performs automated feature selection by shrinking irrelevant coefficients to zero. High-dimensional text classification (TF-IDF with 100k terms) thrives on linear boundaries.",
        caveats: "Requires tuning regularization strength parameter C via cross-validation.",
        practical: "Industry standard for natural language document categorization and genomic sparse arrays.",
      },
    },
  },
  {
    id: "svm",
    name: "Support Vector Machines",
    category: "Kernel Margin Classifier",
    subtypes: "SVC(kernel='rbf'/'linear'), LinearSVC",
    strengths: [
      "Rigorous mathematical foundation: maximizes margin width 2/||w||",
      "Effective in high-dimensional spaces where p > N",
      "Kernel trick (RBF) projects data into infinite dimensions without explicit mapping",
      "Memory efficient during inference (only stores support vectors)",
    ],
    weaknesses: [
      "Quadratic-to-cubic training scaling O(N^2) to O(N^3); infeasible for N > 50,000",
      "Extremely sensitive to feature scaling and hyperparameter choice (C, gamma)",
      "Does not provide native probability estimates (requires expensive Platt scaling)",
    ],
    bestFor: "Small to medium continuous scientific datasets, bio-informatics, image embeddings, and high-dimensional spaces where margins are clean.",
    assessments: {
      interpretability: {
        rating: "Limited",
        summary: "Linear SVM weights are interpretable; RBF/polynomial kernel SVMs operate in dual space and are non-interpretable.",
        details: "Non-linear kernel SVM decisions depend on linear combinations of kernel similarities to dual support vectors: f(x) = sum alpha_i y_i K(x_i, x) + b. Explaining individual feature influences is mathematically convoluted.",
        caveats: "LinearSVC provides coefficients similar to logistic regression.",
        practical: "Not suitable for customer-facing explainability or regulatory compliance reports.",
      },
      training_complexity: {
        rating: "Poor",
        summary: "O(N^2 · p) to O(N^3) scaling using SMO (Sequential Minimal Optimization).",
        details: "Solving the dual quadratic programming problem requires calculating and caching the N x N kernel Gram matrix. Training time explodes exponentially beyond 50k rows.",
        caveats: "LinearSVC (liblinear) scales O(N · p), making linear SVMs practical on large sparse datasets.",
        practical: "Restricted to small or subsampled datasets (< 30k samples) in production.",
      },
      inference_latency: {
        rating: "Moderate",
        summary: "O(N_sv · p) where N_sv is the number of support vectors.",
        details: "Every incoming test record must compute the kernel distance against every stored support vector. If the dataset was noisy, N_sv can approach 50% of the training set, causing significant latency.",
        caveats: "Linear SVM evaluates in sub-millisecond O(p) time.",
        practical: "Inference latency grows with model complexity; requires benchmarking prior to deployment.",
      },
      memory_footprint: {
        rating: "Moderate",
        summary: "Stores all support vector coordinates in memory. Size scales with noisy boundary complexity.",
        details: "Model size is proportional to N_sv · p. For clean separation, N_sv is tiny; for noisy, overlapping classes, N_sv can consume hundreds of megabytes.",
        caveats: "LinearSVC stores only the single weight vector w, consuming < 50 KB.",
        practical: "Monitor support vector count during cross-validation to prevent memory bloat.",
      },
      nonlinear_handling: {
        rating: "Excellent",
        summary: "Kernel trick (RBF, Polynomial) implicitly maps samples into infinite-dimensional Hilbert space.",
        details: "RBF kernel K(x, x') = exp(-gamma ||x - x'||^2) creates smooth, sophisticated non-linear decision boundaries around isolated data clusters.",
        caveats: "Requires careful grid-search joint tuning of penalty C and kernel width gamma.",
        practical: "Produces elegant, smooth decision boundaries on continuous physical and chemical data.",
      },
      feature_scaling: {
        rating: "Poor",
        summary: "Strictly requires normalization or standardization. Non-standardized scales break Euclidean distance metrics.",
        details: "The RBF kernel computes squared Euclidean distance ||x - x'||^2. Features with large numerical ranges dominate distance calculations, rendering smaller-scale features invisible.",
        caveats: "Never train an SVM on raw unscaled features.",
        practical: "Mandatory StandardScaler() integration in preprocessing pipeline.",
      },
      missing_values: {
        rating: "Poor",
        summary: "Zero native support for missing values. Requires full imputation.",
        details: "Euclidean distances cannot be evaluated if any coordinate is NaN.",
        caveats: "Imputation method choice (KNN vs iterative) substantially affects margin stability.",
        practical: "Imputation pipeline must be strictly tested on edge cases.",
      },
      imbalanced_data: {
        rating: "Good",
        summary: "Supported via class_weight='balanced' (adjusts C_pos vs C_neg in optimization).",
        details: "Assigns separate slack penalties C_+ and C_- in the primal objective, forcing the optimizer to prioritize margin violations on the minority class.",
        caveats: "Can be sensitive to noisy minority outliers, creating distorted margin boundaries.",
        practical: "Effective on moderate imbalance when combined with ROC-AUC scoring.",
      },
      probability_estimation: {
        rating: "Limited",
        summary: "No native probabilities. Setting probability=True fits external Platt scaling via expensive 5-fold CV.",
        details: "SVM optimizes geometric margin distance, not log loss. Setting probability=True invokes CalibratedClassifierCV internally using Platt's sigmoid fitting, slowing training by 5x.",
        caveats: "Platt scaling on small support vector subsets can produce poorly calibrated extreme scores.",
        practical: "If calibrated probabilities are the primary project deliverable, prefer Logistic Regression or calibrated Random Forest.",
      },
      high_dimensional: {
        rating: "Excellent",
        summary: "Theoretically immune to curse of dimensionality when maximum margin separation exists.",
        details: "Vapnik's statistical learning theory demonstrates that SVM generalization depends on the margin width rather than the raw dimensionality p of the space.",
        caveats: "If features are predominantly noisy, margin maximization can overfit spurious alignments.",
        practical: "Classic choice for microarray genomics, protein classification, and text classification.",
      },
    },
  },
  {
    id: "knn",
    name: "K-Nearest Neighbors",
    category: "Instance-Based Non-Parametric",
    subtypes: "KNeighborsClassifier, NearestCentroid",
    strengths: [
      "Zero training phase (pure lazy learning; fit stores reference data)",
      "Completely intuitive mental model (samples inherit neighbors' consensus)",
      "Naturally adapts to multi-modal class clusters",
      "Zero assumptions regarding underlying probability distributions",
    ],
    weaknesses: [
      "Horrendous inference latency O(N · p) without spatial index trees",
      "Severe degradation in high dimensions (curse of dimensionality)",
      "Massive RAM footprint: entire training dataset must remain in memory",
      "Extreme sensitivity to irrelevant noise features and unscaled data",
    ],
    bestFor: "Small low-dimensional tabular datasets, recommendation retrieval systems, dynamic continuous databases with constant updates, and non-parametric baselines.",
    assessments: {
      interpretability: {
        rating: "Good",
        summary: "Highly interpretable by exemplar. A prediction is explained by displaying its k nearest historical neighbors.",
        details: "Stakeholders readily understand 'this loan was approved because the 5 most similar historical clients successfully repaid'.",
        caveats: "Explaining why a specific distance metric chose those neighbors in 20 dimensions is difficult.",
        practical: "Ideal for case-based reasoning and similarity search applications.",
      },
      training_complexity: {
        rating: "Excellent",
        summary: "O(1) training complexity (lazy learner). Training simply caches references in RAM.",
        details: "Building index trees (KD-Tree, Ball-Tree) takes O(p · N · log N), but brute-force KNN has zero training cost.",
        caveats: "The computational burden is shifted entirely from training time to inference time.",
        practical: "Instant model updating: adding new training data requires no retraining.",
      },
      inference_latency: {
        rating: "Poor",
        summary: "O(N · p) brute force search per single sample. Unusable for real-time high-throughput scoring.",
        details: "Evaluating one sample requires computing distances to every single sample in the historical dataset, sorting distances, and selecting top k.",
        caveats: "KD-Tree reduces latency to O(p · log N) for p < 15, but degenerates to O(N) when p > 20.",
        practical: "Infeasible for production microservices serving > 100 RPS on datasets with > 50,000 samples.",
      },
      memory_footprint: {
        rating: "Poor",
        summary: "Entire training set must reside permanently in RAM. Footprint scales directly with N · p.",
        details: "Unlike parametric models that compress data into weights, KNN stores the complete raw data matrix. 1 million rows of 50 features requires > 400 MB resident memory.",
        caveats: "Cannot be deployed on small memory-constrained microcontrollers.",
        practical: "Requires high RAM instances in production servers.",
      },
      nonlinear_handling: {
        rating: "Good",
        summary: "Creates flexible Voronoi tessellations that wrap arbitrary non-linear cluster shapes.",
        details: "Can approximate any smooth decision boundary given sufficient sample density. Naturally captures complex multi-modal islands.",
        caveats: "Decision boundaries can be noisy and jagged if k is set too low (e.g. k=1).",
        practical: "Smooth predictions by tuning k via cross-validation (typically k = 5 to 25).",
      },
      feature_scaling: {
        rating: "Poor",
        summary: "Extremely sensitive. Unscaled features completely destroy Euclidean distance validity.",
        details: "A feature with range [0, 100,000] (income) will overpower a feature with range [0, 1] (interest rate) by a factor of 100,000.",
        caveats: "Must always apply standardization or min-max normalization.",
        practical: "StandardScaler() is non-negotiable.",
      },
      missing_values: {
        rating: "Poor",
        summary: "Cannot compute distance if any coordinate is missing. Strict imputation required.",
        details: "Missing coordinates preclude metric distance evaluation.",
        caveats: "KNN can ironically be used as an imputation algorithm (KNNImputer) prior to model training.",
        practical: "Impute before KNN scoring.",
      },
      imbalanced_data: {
        rating: "Poor",
        summary: "Inherently biased toward majority classes in neighborhood voting.",
        details: "In an imbalanced dataset (95% Class 0, 5% Class 1), random neighborhoods will naturally be dominated by majority samples, drowning out minority votes.",
        caveats: "Setting weights='distance' helps slightly by upweighting closer neighbors.",
        practical: "Requires aggressive resampling (SMOTE, undersampling) before applying KNN.",
      },
      probability_estimation: {
        rating: "Limited",
        summary: "Step-function probabilities based on neighbor fraction: P(y=1) = k_1 / k.",
        details: "For k=10, probabilities can only take discrete values {0.0, 0.1, 0.2, ..., 1.0}. Calibration is coarse and lacks smooth differentiation.",
        caveats: "Distance-weighted voting produces continuous but poorly calibrated probabilities.",
        practical: "Avoid KNN when continuous, well-calibrated risk probabilities are required.",
      },
      high_dimensional: {
        rating: "Poor",
        summary: "Completely crippled by the curse of dimensionality. Distance metrics lose contrast.",
        details: "In high dimensions, the ratio between the distance to the nearest neighbor and the distance to the farthest neighbor approaches 1 (Beyer et al., 1999). All points become equidistant.",
        caveats: "Requires aggressive dimensionality reduction (PCA, UMAP) before running KNN.",
        practical: "Never apply KNN directly to datasets with p > 50 features.",
      },
    },
  },
  {
    id: "decision_trees",
    name: "Decision Trees",
    category: "Single Recursive Partitioning",
    subtypes: "DecisionTreeClassifier(CART), ExtraTreeClassifier",
    strengths: [
      "Maximum visual interpretability (can be drawn as a readable flowchart)",
      "Blazing fast training and sub-millisecond inference",
      "Invariant to monotonic feature scaling",
      "Handles mixed continuous and categorical data naturally",
    ],
    weaknesses: [
      "High variance; notoriously unstable (small data changes alter tree structure)",
      "Severe tendency to overfit training noise without strict pruning",
      "Step-function approximations produce jagged, non-smooth decision surfaces",
      "Greedy split algorithm can miss synergistic feature interactions",
    ],
    bestFor: "Exploratory data analysis, rapid prototyping, regulatory compliance where a single flowchart rule is legally required, and educational instruction.",
    assessments: {
      interpretability: {
        rating: "Excellent",
        summary: "White-box model. Can be exported directly to an if-else decision flowchart or graphic.",
        details: "Stakeholders can audit the exact path taken by a sample: 'If Age > 45 and Income <= $50,000, reject'.",
        caveats: "Deep unpruned trees (depth > 8) become unreadable spaghettis that violate human comprehension.",
        practical: "Regulators easily approve shallow decision trees (depth 3–5).",
      },
      training_complexity: {
        rating: "Excellent",
        summary: "O(p · N · log N). Fits in fractions of a second on standard workstations.",
        details: "Greedy top-down recursive partitioning evaluates candidate cut points rapidly.",
        caveats: "Single tree fitting is single-threaded in Scikit-Learn (does not use n_jobs).",
        practical: "Ideal for instantaneous interactive feedback loops.",
      },
      inference_latency: {
        rating: "Excellent",
        summary: "Microsecond inference: O(depth). Traverses 5–15 if-else conditions.",
        details: "Requires only a handful of scalar comparisons. Computes in < 0.1 ms.",
        caveats: "Fastest tree-based option available.",
        practical: "Compiles directly into C if-else blocks for bare-metal microcontroller firmware.",
      },
      memory_footprint: {
        rating: "Excellent",
        summary: "Tiny footprint: 5 KB to 100 KB for pruned trees.",
        details: "Stores a single tree structure consisting of a few dozen or hundred nodes.",
        caveats: "Unconstrained trees on noisy data can expand to thousands of nodes.",
        practical: "Easily fits on embedded edge devices.",
      },
      nonlinear_handling: {
        rating: "Good",
        summary: "Naturally captures non-linear thresholds and step-function relationships.",
        details: "Partitions feature space into orthogonal hyper-rectangles.",
        caveats: "Axis-aligned splits struggle to approximate smooth diagonal boundaries without deep stairs.",
        practical: "Effective for non-linear logic, but prone to high variance.",
      },
      feature_scaling: {
        rating: "Excellent",
        summary: "Completely invariant to monotonic feature scaling and outlier magnitude.",
        details: "Splits depend solely on rank ordering.",
        caveats: "No normalization required.",
        practical: "Zero numerical scaling pipeline necessary.",
      },
      missing_values: {
        rating: "Moderate",
        summary: "Scikit-Learn requires imputation. Conceptual CART supports surrogate splits.",
        details: "Standard Scikit-Learn tree requires pre-imputation.",
        caveats: "HistGradientBoosting supports missing values natively.",
        practical: "Impute before fitting in Scikit-Learn.",
      },
      imbalanced_data: {
        rating: "Good",
        summary: "Supported via class_weight='balanced'.",
        details: "Rescales Gini/Entropy calculation by inverse class frequencies.",
        caveats: "Leaves on imbalanced data easily become pure singletons without min_samples_leaf tuning.",
        practical: "Set min_samples_leaf=5 to prevent memorizing rare minority outliers.",
      },
      probability_estimation: {
        rating: "Poor",
        summary: "Coarse leaf sample fractions. Overfits probability estimates drastically.",
        details: "Unpruned trees produce leaves with 100% purity (predicting 1.0 or 0.0 with unjustified certainty). Severe probability miscalibration.",
        caveats: "Pruning smooths probabilities, but calibration remains inferior to logistic regression.",
        practical: "Do not use raw decision tree probabilities for financial risk modeling.",
      },
      high_dimensional: {
        rating: "Poor",
        summary: "Greedy split selection overfits high-dimensional noise features.",
        details: "When p >> N, spurious correlations allow trees to build completely pure training paths that fail to generalize.",
        caveats: "Pruning (ccp_alpha) is mandatory in high dimensions.",
        practical: "Use Random Forest or penalized linear models instead.",
      },
    },
  },
  {
    id: "gradient_boosting",
    name: "Gradient Boosting",
    category: "Sequential Boosted Ensembles",
    subtypes: "GBDT, XGBoost, LightGBM, CatBoost, HistGradientBoostingClassifier",
    strengths: [
      "State-of-the-art predictive performance on structured tabular datasets",
      "Sequential error correction reduces both bias and variance",
      "Modern frameworks (LightGBM/XGBoost) feature lightning-fast histogram binning",
      "Native handling of missing values and categorical features (CatBoost)",
    ],
    weaknesses: [
      "Prone to overfitting noisy data if learning rate is too high or trees too deep",
      "High hyperparameter sensitivity requiring systematic optimization (learning_rate, depth, subsample)",
      "Sequential training cannot parallelize across trees (only within-tree histogram construction)",
    ],
    bestFor: "Competitive machine learning (Kaggle), high-accuracy commercial enterprise tabular pipelines, customer lifetime value modeling, and CTR prediction.",
    assessments: {
      interpretability: {
        rating: "Moderate",
        summary: "Black box ensemble. Supported by TreeSHAP, gain importance, and partial dependence plots.",
        details: "Thousands of sequential residual-correcting trees cannot be mentally parsed. However, TreeSHAP computes exact Shapley feature attributions in polynomial time.",
        caveats: "Default gain importance overstates high-cardinality features.",
        practical: "Widely accepted in enterprise finance when accompanied by standardized SHAP documentation.",
      },
      training_complexity: {
        rating: "Good",
        summary: "O(M · p · N) where M is boosting iterations. Modern histogram binning achieves dramatic speedups.",
        details: "LightGBM and XGBoost bin continuous features into 256 discrete histograms, reducing split evaluation from O(N log N) to O(bin_count). Highly optimized C++/CUDA backends.",
        caveats: "Because trees are built sequentially, cannot parallelize across trees like Random Forest.",
        practical: "LightGBM trains on 1 million rows in under 15 seconds.",
      },
      inference_latency: {
        rating: "Good",
        summary: "O(M · depth). Faster than deep Random Forests due to shallow tree depth (typically depth 3–6).",
        details: "Boosted trees are shallow stumps or small trees. 100 trees of depth 4 evaluate faster than 300 Random Forest trees of depth 20.",
        caveats: "If tuned with 2,000+ trees, inference latency scales linearly.",
        practical: "Production engines like Treelite / ONNX achieve microsecond response times.",
      },
      memory_footprint: {
        rating: "Good",
        summary: "Compact on disk: 5MB to 50MB. Shallow trees require less memory than deep unconstrained forests.",
        details: "Depth-constrained trees (max_depth=4 to 6) contain far fewer total nodes than unconstrained Random Forest trees.",
        caveats: "Models with thousands of trees can still grow large.",
        practical: "Easily hosted on standard cloud microservices and serverless functions.",
      },
      nonlinear_handling: {
        rating: "Excellent",
        summary: "Superior non-linear fitting capability. Progressively sculpts complex boundary manifolds.",
        details: "By fitting negative gradients of the loss function sequentially, boosting focuses successive trees specifically on the hardest-to-classify non-linear boundary regions.",
        caveats: "Can memorize non-linear noise outliers if early stopping is not applied.",
        practical: "Industry standard for winning tabular machine learning competitions.",
      },
      feature_scaling: {
        rating: "Excellent",
        summary: "Completely invariant to monotonic feature scaling.",
        details: "Like all tree algorithms, threshold evaluation depends exclusively on rank ordering.",
        caveats: "No scaling or normalization required.",
        practical: "Eliminates preprocessing overhead for continuous variables.",
      },
      missing_values: {
        rating: "Excellent",
        summary: "Modern libraries (XGBoost, LightGBM, CatBoost) natively handle missing values via default split direction.",
        details: "During training, missing values are routed to whichever child branch (left or right) minimizes split loss. At inference, unseen NaNs follow the learned optimal default direction.",
        caveats: "Standard Scikit-Learn GradientBoostingClassifier requires imputation, but HistGradientBoostingClassifier supports NaNs natively.",
        practical: "Enables robust, failure-proof production inference on messy raw data streams.",
      },
      imbalanced_data: {
        rating: "Excellent",
        summary: "Fine-grained control via scale_pos_weight (XGBoost/LightGBM) or custom focal loss.",
        details: "scale_pos_weight multiplies the gradient of positive class samples, directly prioritizing minority class recall. Focal loss can be implemented to downweight easy examples.",
        caveats: "Setting scale_pos_weight too aggressively elevates false alarms.",
        practical: "Standard choice for industrial fraud detection and click conversion modeling.",
      },
      probability_estimation: {
        rating: "Good",
        summary: "Directly minimizes log loss (binary cross-entropy). Probabilities are generally well-calibrated.",
        details: "Unlike Random Forest which averages discrete votes, boosting minimizes logistic loss directly in margin space F(x), mapping through sigmoid 1 / (1 + exp(-F(x))).",
        caveats: "Can produce overconfident probabilities near boundary extremes if overfitted.",
        practical: "CalibratedClassifierCV is rarely needed unless dataset is exceptionally noisy.",
      },
      high_dimensional: {
        rating: "Good",
        summary: "Effective with colsample_bytree (feature subsampling) and L1/L2 leaf weight regularization.",
        details: "XGBoost applies explicit L1 (alpha) and L2 (lambda) penalties on leaf weights w_j, preventing runaway values in wide datasets.",
        caveats: "On extreme sparse text matrices (p > 50,000), linear models remain faster and less prone to overfitting.",
        practical: "Superior to Random Forest on wide datasets when regularization is tuned.",
      },
    },
  },
  {
    id: "naive_bayes",
    name: "Naive Bayes",
    category: "Generative Probabilistic",
    subtypes: "GaussianNB, MultinomialNB, BernoulliNB, ComplementNB",
    strengths: [
      "Ultra-fast O(N · p) training and O(p) inference",
      "Exceptional on high-dimensional sparse text classification (Spam, Sentiment)",
      "Zero hyperparameter tuning required",
      "Works surprisingly well even when the independence assumption is violated",
    ],
    weaknesses: [
      "Extremely unrealistic conditional independence assumption: P(x1, x2 | y) = P(x1 | y) P(x2 | y)",
      "Horribly calibrated probabilities (pushes probabilities to 0.0001 or 0.9999)",
      "Cannot capture feature interactions or correlations whatsoever",
      "Zero-frequency problem requires Laplace smoothing (+1)",
    ],
    bestFor: "Email spam filtering, real-time sentiment analysis, text document classification, and lightweight probabilistic baselines.",
    assessments: {
      interpretability: {
        rating: "Good",
        summary: "Probabilistic transparency. Log-prior and log-likelihood tables are directly inspectable.",
        details: "Classification is governed by Bayes' rule: P(y | x) proportional to P(y) prod P(x_j | y). Feature evidence can be displayed as likelihood ratios P(word | spam) / P(word | ham).",
        caveats: "Explaining compound probabilities is intuitive, but the independence assumption is mathematically false in practice.",
        practical: "Clear feature attribution in NLP and text categorization.",
      },
      training_complexity: {
        rating: "Excellent",
        summary: "O(N · p) single-pass linear scaling. Simply counts occurrences or computes feature means and variances.",
        details: "Requires no iterative optimization or gradient descent. Accumulates summary statistics in a single pass over the dataset.",
        caveats: "Fastest non-trivial classifier to train in machine learning.",
        practical: "Trains on 10 million documents in seconds.",
      },
      inference_latency: {
        rating: "Excellent",
        summary: "O(p) latency. Computes sum of log probabilities: log P(y) + sum log P(x_j | y).",
        details: "Involves only vector addition and lookup. Evaluates in under 0.05 ms.",
        caveats: "Fastest scoring model available.",
        practical: "Ideal for real-time edge spam filters in email daemons.",
      },
      memory_footprint: {
        rating: "Excellent",
        summary: "Stores only class priors and feature distribution parameters (means, variances, or word counts).",
        details: "Consumes < 1 MB for tabular data; a few megabytes for NLP vocabularies.",
        caveats: "Compact and portable.",
        practical: "Flawless for mobile apps and low-power hardware.",
      },
      nonlinear_handling: {
        rating: "Poor",
        summary: "Completely incapable of modeling feature interactions or non-linear dependencies.",
        details: "By definition, assumes all features are conditionally independent given the class label. Cannot learn XOR, interaction terms, or correlated clusters.",
        caveats: "Severe underfitting on complex structured tabular datasets.",
        practical: "Do not use for tabular business datasets with synergistic features.",
      },
      feature_scaling: {
        rating: "Moderate",
        summary: "MultinomialNB uses raw discrete counts; GaussianNB assumes normal distribution.",
        details: "MultinomialNB requires non-negative counts. GaussianNB can be distorted by extreme outliers that violate normality.",
        caveats: "PowerTransformer can help GaussianNB fit skewed continuous data.",
        practical: "Standardize or transform skewed features when using GaussianNB.",
      },
      missing_values: {
        rating: "Good",
        summary: "Omitted features can be skipped during probability product calculation.",
        details: "If feature j is missing, simply omit P(x_j | y) from the product; the remaining features still provide valid conditional evidence.",
        caveats: "Scikit-Learn implementation still requires imputation preprocessing.",
        practical: "Custom implementations easily bypass missing entries.",
      },
      imbalanced_data: {
        rating: "Limited",
        summary: "Class priors P(y) naturally reflect class imbalance, heavily biasing predictions toward majority.",
        details: "ComplementNB was specifically developed to correct for imbalanced document corpora by evaluating complement class statistics.",
        caveats: "Standard GaussianNB performs poorly on severely imbalanced targets without prior adjustment.",
        practical: "Use ComplementNB for imbalanced text classification.",
      },
      probability_estimation: {
        rating: "Poor",
        summary: "Probabilities are notoriously miscalibrated. Pushes scores to extreme 0.0 and 1.0.",
        details: "Because feature correlations are ignored, multiplying hundreds of conditional probabilities exaggerates evidence, producing probabilities clustered at 1.0000 and 0.0000.",
        caveats: "Ranking order (AUC) is frequently decent, but raw probability values are completely untrustworthy.",
        practical: "Never use raw Naive Bayes probabilities for financial decision making or risk thresholds.",
      },
      high_dimensional: {
        rating: "Excellent",
        summary: "Legendary performance on high-dimensional sparse text matrices (p >> N).",
        details: "Because each feature parameter is estimated independently, high dimensionality does not lead to covariance matrix inversion failures.",
        caveats: "Performance degrades if many features are highly redundant or strongly correlated.",
        practical: "The timeless gold standard for email spam classification and sentiment tagging.",
      },
    },
  },
  {
    id: "neural_networks",
    name: "Neural Networks (MLP)",
    category: "Deep Differentiable Learning",
    subtypes: "MLPClassifier, PyTorch/TensorFlow Dense Networks, TabNet",
    strengths: [
      "Universal function approximator: learns arbitrary non-linear representations",
      "Seamlessly integrates heterogeneous multimodal data (text, images, tabular)",
      "Supports continuous online learning and streaming mini-batch SGD",
      "Custom loss functions and architectures tailored to domain physics",
    ],
    weaknesses: [
      "Compute-hungry training requiring GPU acceleration and long epoch cycles",
      "Hyperparameter minefield: learning rate, weight decay, layer width, dropout, batch size",
      "Strictly requires exhaustive preprocessing: scaling, one-hot encoding, imputation",
      "Often underperforms tuned Gradient Boosting on standard tabular data (Grinsztajn et al., 2022)",
    ],
    bestFor: "Multimodal systems (combining tabular metadata with image/text embeddings), massive streaming datasets (> 10M rows), and deep representation learning.",
    assessments: {
      interpretability: {
        rating: "Poor",
        summary: "Complete black box. Millions of non-linear interconnected weight matrices.",
        details: "Predictions emerge from high-dimensional latent activations. Integrated Gradients and DeepSHAP provide post-hoc approximations, but direct auditing is impossible.",
        caveats: "TabNet introduces sparse attention masks to emulate decision tree feature selection.",
        practical: "Severe regulatory friction in credit underwriting and medical diagnostics.",
      },
      training_complexity: {
        rating: "Poor",
        summary: "O(E · N · sum(d_l · d_{l+1})) where E is epochs. Slow convergence on CPU.",
        details: "Iterative backpropagation across thousands of mini-batches requires substantial compute. Hyperparameter tuning (architecture search) multiplies compute costs 100x.",
        caveats: "Accelerated substantially by dedicated GPU hardware (Nvidia CUDA / TensorRT).",
        practical: "Impractical for rapid iteration cycles without dedicated GPU infrastructure.",
      },
      inference_latency: {
        rating: "Moderate",
        summary: "Dense matrix multiplications across all hidden layers. 2ms to 25ms on CPU.",
        details: "Requires successive matrix-vector multiplications: a_{l+1} = sigma(W_l a_l + b_l). Latency scales with network depth and width.",
        caveats: "Optimized runtimes (ONNX, TensorRT, OpenVINO) reduce CPU latency significantly.",
        practical: "Adequate for web APIs, but heavier than linear models or decision trees.",
      },
      memory_footprint: {
        rating: "Moderate",
        summary: "10MB to 500MB depending on layer counts and parameter precision (FP32 vs FP16).",
        details: "Stores floating-point weight tensors for every layer.",
        caveats: "Quantization (INT8) cuts memory footprint by 4x with minimal accuracy degradation.",
        practical: "Can be deployed on mobile and edge devices using ONNX / TFLite.",
      },
      nonlinear_handling: {
        rating: "Excellent",
        summary: "Universal function approximation. Learns hierarchical non-linear feature representations.",
        details: "Non-linear activation functions (ReLU, GELU, Swish) allow networks to approximate any smooth Borel-measurable function given sufficient hidden units.",
        caveats: "Prone to overfitting or getting trapped in suboptimal local minima without dropout and weight decay.",
        practical: "Flawless representation capacity on complex non-linear manifolds.",
      },
      feature_scaling: {
        rating: "Poor",
        summary: "Extremely sensitive. Unscaled inputs cause vanishing or exploding gradients.",
        details: "Gradient updates Delta W = -eta nabla L depend directly on input activations x. Differing scales cause gradient vectors to oscillate wildly.",
        caveats: "BatchNorm and LayerNorm mitigate internal covariate shift, but input scaling remains mandatory.",
        practical: "StandardScaler or QuantileTransformer is strictly required.",
      },
      missing_values: {
        rating: "Poor",
        summary: "Zero native tolerance for missing values. NaNs propagate through all layers.",
        details: "A single NaN in the input vector invalidates every downstream activation tensor.",
        caveats: "Advanced architectures can learn missing-indicator embeddings.",
        practical: "Exhaustive imputation pipeline required prior to forward pass.",
      },
      imbalanced_data: {
        rating: "Good",
        summary: "Supported via weighted cross-entropy loss, Focal Loss, and batch sampling.",
        details: "Focal loss dynamically scales loss based on model confidence, focusing training on hard minority examples. Over-sampling within mini-batches stabilizes gradient updates.",
        caveats: "Severe imbalance can destabilize batch norm statistics if minority samples are absent in some mini-batches.",
        practical: "Standard tool in deep fraud and anomaly detection.",
      },
      probability_estimation: {
        rating: "Moderate",
        summary: "Softmax outputs sum to 1.0, but modern deep networks suffer from overconfidence.",
        details: "Guo et al. (2017) demonstrated that modern deep neural networks with batch norm and weight decay are poorly calibrated, producing overconfident probabilities.",
        caveats: "Temperature scaling (dividing logits by scalar T) provides effective post-hoc calibration.",
        practical: "Apply temperature scaling before deploying probabilities to risk engines.",
      },
      high_dimensional: {
        rating: "Good",
        summary: "Handles high dimensions effectively when regularized with Dropout and weight decay.",
        details: "Embedding layers efficiently compress high-cardinality categorical features into dense low-dimensional vectors.",
        caveats: "Requires substantial sample size N to avoid overfitting when p is large.",
        practical: "Industry standard for embedding-based recommendation engines.",
      },
    },
  },
  {
    id: "ensemble_meta",
    name: "Ensemble Meta-Learning",
    category: "Hybrid Model Stacking & Voting",
    subtypes: "StackingClassifier, VotingClassifier(hard/soft)",
    strengths: [
      "Extracts maximum possible predictive accuracy by combining complementary model families",
      "Reduces structural model bias by uniting diverse inductive biases",
      "Flexible: combines trees, neural nets, linear models, and SVMs",
      "Standard winning strategy in international competitive data science competitions",
    ],
    weaknesses: [
      "Extremely high pipeline complexity and maintenance overhead",
      "Inference latency is the cumulative sum of all base models plus the meta-learner",
      "Massive memory footprint: all base model artifacts must remain loaded",
      "Prone to target data leakage during out-of-fold meta-feature generation if not carefully coded",
    ],
    bestFor: "High-stakes prediction where a 0.5% accuracy gain translates into millions of dollars, and competitive benchmarking.",
    assessments: {
      interpretability: {
        rating: "Poor",
        summary: "Extreme black box. Predictions pass through multiple heterogeneous model tiers.",
        details: "Explaining why a stacked ensemble of 5 boosted trees, 2 neural networks, and a random forest fed into a logistic meta-model made a prediction defies direct auditing.",
        caveats: "SHAP can evaluate the meta-pipeline end-to-end, but individual component contributions are opaque.",
        practical: "Strictly prohibited in regulated banking and clinical transparency audits.",
      },
      training_complexity: {
        rating: "Poor",
        summary: "Cumulative training cost: sum(train_time(base_models)) · K folds for out-of-fold features.",
        details: "Stacking requires K-fold cross-validation across every base estimator to generate leak-free meta-features, multiplying base model training time by K (e.g. 5x).",
        caveats: "VotingClassifier is simpler and trains base models once without out-of-fold loops.",
        practical: "Expensive compute pipelines requiring distributed orchestrators.",
      },
      inference_latency: {
        rating: "Poor",
        summary: "Cumulative inference latency: sum(latency(base_models)) + latency(meta_model).",
        details: "A test record must be scored by every single base model before the meta-learner can execute its final prediction.",
        caveats: "Can be parallelized across base models using multi-threading, but bound by slowest base model.",
        practical: "Rarely viable for sub-10ms real-time production SLAs.",
      },
      memory_footprint: {
        rating: "Poor",
        summary: "Cumulative disk and RAM footprint: stores all serialized base models plus meta-model.",
        details: "A stack containing Random Forest (200MB), XGBoost (30MB), and MLP (50MB) requires ~300MB resident RAM.",
        caveats: "Model registry must manage multiple versioned sub-artifacts.",
        practical: "High deployment footprint; unsuited for serverless or edge environments.",
      },
      nonlinear_handling: {
        rating: "Excellent",
        summary: "Superior non-linear generalization by combining orthogonal hypothesis spaces.",
        details: "Combines tree-based partition boundaries with smooth margin curves and linear hyperplanes, eliminating individual family blind spots.",
        caveats: "Meta-learner should be simple (LogisticRegression) to prevent meta-overfitting.",
        practical: "The ultimate weapon for squeezing out peak Kaggle performance.",
      },
      feature_scaling: {
        rating: "Depends on implementation",
        summary: "Each base model pipeline must independently apply its required scaling.",
        details: "Tree models inside the stack need no scaling, while SVM/MLP base estimators require StandardScaler pipelines.",
        caveats: "Requires wrapping each base estimator inside an independent Scikit-Learn Pipeline.",
        practical: "Increased pipeline engineering complexity.",
      },
      missing_values: {
        rating: "Depends on implementation",
        summary: "Bound by the strictest base model in the ensemble.",
        details: "If any base estimator cannot tolerate missing values (e.g. Linear or SVM), the upstream pipeline must impute for all models.",
        caveats: "Unified imputation pipeline required upfront.",
        practical: "Must be handled at the root pipeline level.",
      },
      imbalanced_data: {
        rating: "Good",
        summary: "Flexible: base models and meta-learner can each apply custom class weights.",
        details: "Base models can output calibrated probability meta-features; the meta-learner optimizes balanced log-loss.",
        caveats: "Requires careful probability calibration between base folds.",
        practical: "Powerful for high-stakes fraud scoring when latency permits.",
      },
      probability_estimation: {
        rating: "Good",
        summary: "Soft voting and logistic meta-learners produce well-blended probability distributions.",
        details: "Ensemble averaging naturally smooths extreme outliers and reduces variance in probability estimates.",
        caveats: "Hard voting produces discrete non-probabilistic tallies.",
        practical: "Superior probability reliability compared to individual uncalibrated trees.",
      },
      high_dimensional: {
        rating: "Good",
        summary: "Combines linear base models with tree-based feature selectors.",
        details: "Allows linear models (Lasso) to capture sparse linear signal while tree ensembles capture dense interactions.",
        caveats: "Meta-features are low-dimensional (equal to number of base models · classes), keeping meta-stage robust.",
        practical: "Robust against dimensional pitfalls if regularized properly.",
      },
    },
  },
];

/* -------------------------------------------------------------------------- */
/* RATING STYLES & BADGES                                                     */
/* -------------------------------------------------------------------------- */
const ratingStyles: Record<RatingLevel, { bg: string; text: string; border: string; icon: typeof CheckCircle2 }> = {
  Excellent: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
  },
  Good: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
    icon: CheckCircle2,
  },
  Moderate: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    icon: AlertTriangle,
  },
  Limited: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/30",
    icon: AlertTriangle,
  },
  Poor: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
    icon: XCircle,
  },
  "Depends on implementation": {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
    icon: HelpCircle,
  },
};

function RatingBadge({ rating }: { rating: RatingLevel }) {
  const style = ratingStyles[rating] || ratingStyles["Moderate"];
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold border ${style.bg} ${style.text} ${style.border}`}
    >
      <Icon className="size-3 shrink-0" />
      <span>{rating}</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* SELECTION SCENARIOS                                                        */
/* -------------------------------------------------------------------------- */
interface SelectionScenario {
  id: string;
  title: string;
  scenario: string;
  recommended: string;
  alternatives: string;
  rfSuitability: string;
  reasoning: string;
  whenToAvoidRF: string;
}

const selectionScenarios: SelectionScenario[] = [
  {
    id: "small_structured",
    title: "1. Small Structured Datasets (< 1,000 rows)",
    scenario: "Clinical pilot studies, specialized manufacturing batch tests, low-sample benchmarks.",
    recommended: "Linear Models / Regularized Logistic Regression or Support Vector Machines (Linear/RBF)",
    alternatives: "Shallow Random Forest (n_estimators=100, min_samples_leaf=5)",
    rfSuitability: "Moderate. Random Forest works, but bootstrap sampling N rows from N < 100 observations produces high out-of-bag variance and risk of leaf memorization.",
    reasoning: "Simple parametric models with strong L2 regularization avoid overfitting when sample size is insufficient to reliably populate deep decision trees.",
    whenToAvoidRF: "Avoid RF when N < 200 and features are continuous and linear; Ridge/Lasso provides lower test error.",
  },
  {
    id: "large_tabular",
    title: "2. Large Tabular Datasets (> 500,000 rows)",
    scenario: "Online ad CTR prediction, retail transaction logs, telecommunications churn.",
    recommended: "Gradient Boosting (LightGBM / XGBoost) or Linear SGDClassifier",
    alternatives: "Random Forest (with max_samples=0.2 and histogram binning)",
    rfSuitability: "Good, but compute-heavy. Building 300 deep unconstrained trees on 1M rows consumes massive RAM and CPU hours compared to histogram-based boosting.",
    reasoning: "LightGBM's 256-bin feature histograms and gradient-based one-side sampling (GOSS) train 10x-20x faster with a fraction of the memory footprint.",
    whenToAvoidRF: "Avoid standard Scikit-Learn RandomForest when training time or memory budgets are tight on > 500k rows.",
  },
  {
    id: "high_dim_sparse",
    title: "3. High-Dimensional Sparse Data (Text, Bags-of-Words, Genomics)",
    scenario: "Spam filtering, legal document indexing, TF-IDF representations, sparse one-hot tables.",
    recommended: "Linear Models (Logistic Regression / LinearSVC) or Naive Bayes (MultinomialNB)",
    alternatives: "Regularized Gradient Boosting with colsample_bytree",
    rfSuitability: "Poor to Limited. Random feature sampling (sqrt(p)) in 100,000 sparse dimensions frequently selects batches containing only zero values, leading to uninformative splits.",
    reasoning: "Linear hyperplanes thrive in sparse geometry where data points are linearly separable along vocabulary dimensions.",
    whenToAvoidRF: "Avoid RF completely on raw TF-IDF or bag-of-words text matrices.",
  },
  {
    id: "highly_nonlinear",
    title: "4. Highly Non-Linear Classification Problems",
    scenario: "Sensor fault isolation, complex physical systems, biometric signature dynamics.",
    recommended: "Random Forest or Gradient Boosting (CatBoost / XGBoost)",
    alternatives: "Neural Networks (MLP) or Kernel SVM (RBF)",
    rfSuitability: "Excellent. Random Forest effortlessly segments multi-dimensional non-linear manifolds through recursive orthogonal partitions with zero manual feature transformations.",
    reasoning: "Tree ensembles capture arbitrary step boundaries, high-order interaction synergies, and non-monotonic response functions naturally.",
    whenToAvoidRF: "Avoid only if the true decision boundary is an ultra-smooth, continuous diagonal hyperplane where RBF SVM or Neural Nets fit more naturally.",
  },
  {
    id: "low_latency",
    title: "5. Ultra Low-Latency Prediction Systems (< 5ms SLA)",
    scenario: "High-frequency trade execution, automated real-time bidding, inline network packet filtering.",
    recommended: "Linear Models (Logistic Regression) or Single Pruned Decision Tree",
    alternatives: "Small Random Forest compiled via Treelite / C-code generation (e.g. 30 trees, max_depth=6)",
    rfSuitability: "Moderate. Standard Python joblib model scoring traverses hundreds of trees, incurring 5ms–25ms overhead. Deep forests violate strict sub-millisecond SLAs.",
    reasoning: "Logistic regression requires a single dot product w · x + b (sub-microsecond), while single shallow trees take < 0.05 ms.",
    whenToAvoidRF: "Avoid unpruned, large forests (> 100 trees, depth > 15) when response time must be under 2 ms.",
  },
  {
    id: "imbalanced",
    title: "6. Severely Imbalanced Classification (Fraud, Rare Defects)",
    scenario: "Credit card fraud (0.1% positive), rare medical disease diagnosis, cyber intrusion detection.",
    recommended: "Random Forest (class_weight='balanced_subsample') or Gradient Boosting (scale_pos_weight)",
    alternatives: "Imbalanced-Learn SMOTE + Random Forest Pipeline",
    rfSuitability: "Excellent. class_weight='balanced_subsample' recalculates class frequencies per bootstrap replicate, preventing majority dominance during split search.",
    reasoning: "Ensemble averaging smooths variance while localized resampling preserves rare minority signal.",
    whenToAvoidRF: "Never deploy with default class_weight=None and standard 0.5 threshold on imbalanced tasks.",
  },
  {
    id: "calibrated_probs",
    title: "7. Datasets Requiring Calibrated Probability Estimates",
    scenario: "Insurance pricing, loan credit default risk underwriting, clinical expected-utility decision models.",
    recommended: "Logistic Regression (natively calibrated) or CalibratedClassifierCV(RandomForest)",
    alternatives: "Gradient Boosting (minimizing log loss)",
    rfSuitability: "Moderate natively, Excellent with calibration. Uncalibrated Random Forest voting fractions push away from 0 and 1, distorting raw risk probabilities.",
    reasoning: "Logistic regression directly minimizes cross-entropy loss, ensuring empirical proportions match predicted probabilities.",
    whenToAvoidRF: "Do not use raw, uncalibrated Random Forest predict_proba for actuarial or financial pricing without Sigmoid / Isotonic calibration.",
  },
  {
    id: "interpretability_reg",
    title: "8. Regulated Environments Requiring Strict Interpretability",
    scenario: "Equal Credit Opportunity Act (ECOA) lending decisions, medical diagnosis liability, legal sentencing.",
    recommended: "Logistic Regression or Shallow Decision Trees (depth <= 4)",
    alternatives: "Random Forest with TreeSHAP and monotonic constraints (monotonic_cst)",
    rfSuitability: "Limited natively. While global feature importances exist, explaining exactly why an individual applicant was rejected across 300 interacting trees requires complex approximation.",
    reasoning: "Linear regression coefficients produce clear, legally defensible adverse action notices: 'Your Debt-to-Income ratio was the primary negative factor'.",
    whenToAvoidRF: "Avoid when legal regulations require transparent deterministic if-else rules.",
  },
  {
    id: "missing_data",
    title: "9. Messy Datasets with Pervasive Missing Values",
    scenario: "Electronic health records with unadministered tests, customer surveys with skipped responses.",
    recommended: "HistGradientBoosting / LightGBM / XGBoost / CatBoost",
    alternatives: "Random Forest with SimpleImputer / IterativeImputer Pipeline",
    rfSuitability: "Moderate. Standard Scikit-Learn RandomForestClassifier crashes on NaNs, requiring an external imputation pipeline that may introduce bias.",
    reasoning: "Modern boosted frameworks route NaNs to the optimal split direction natively during both training and inference without external imputation.",
    whenToAvoidRF: "Avoid raw Scikit-Learn RF if you cannot afford an upstream imputation pipeline.",
  },
];

/* -------------------------------------------------------------------------- */
/* DECISION FRAMEWORK RULES                                                   */
/* -------------------------------------------------------------------------- */
interface DecisionStep {
  id: string;
  question: string;
  criterion: string;
  yesNext: string | { recommendation: string; family: string; rationale: string };
  noNext: string | { recommendation: string; family: string; rationale: string };
}

const decisionTree: Record<string, DecisionStep> = {
  start: {
    id: "start",
    question: "Is your data primarily unstructured media (images, audio, raw video) or multi-modal?",
    criterion: "Data Modality",
    yesNext: {
      recommendation: "Neural Networks / Deep Learning (CNNs, Transformers, MLPs)",
      family: "Neural Networks",
      rationale: "Perceptual data requires spatial/temporal representation learning; classical tabular algorithms fail on raw pixel/waveform matrices.",
    },
    noNext: "step_interpretability",
  },
  step_interpretability: {
    id: "step_interpretability",
    question: "Do strict legal or regulatory mandates require transparent, inspectable single-equation or flowchart auditability?",
    criterion: "Regulatory Interpretability",
    yesNext: {
      recommendation: "Logistic Regression (Linear) or Shallow Decision Tree (CART)",
      family: "Linear Models / Decision Trees",
      rationale: "Coefficients or shallow trees provide defensible adverse action explanations mandated by credit and medical regulations.",
    },
    noNext: "step_sparse",
  },
  step_sparse: {
    id: "step_sparse",
    question: "Is the dataset high-dimensional and sparse (e.g. TF-IDF text bag-of-words, 10,000+ sparse one-hot columns)?",
    criterion: "Data Sparsity & High Dimensionality",
    yesNext: {
      recommendation: "Linear Models (Logistic Regression / LinearSVC) or Naive Bayes",
      family: "Linear Models / Naive Bayes",
      rationale: "Linear models scale O(p) and optimize convex boundaries without getting lost in sparse zero-valued subspace splits.",
    },
    noNext: "step_latency",
  },
  step_latency: {
    id: "step_latency",
    question: "Does your production environment enforce sub-millisecond (< 1ms) real-time scoring SLAs?",
    criterion: "Inference Latency SLA",
    yesNext: {
      recommendation: "Logistic Regression (dot product) or Single Pruned Decision Tree",
      family: "Linear Models",
      rationale: "Computing a single linear dot product w · x takes nanoseconds, easily beating multi-tree ensemble traversal overhead.",
    },
    noNext: "step_tabular_tuning",
  },
  step_tabular_tuning: {
    id: "step_tabular_tuning",
    question: "Do you have the compute budget and engineering time to perform extensive hyperparameter optimization to squeeze out the final 1–2% accuracy?",
    criterion: "Tuning Resource vs. Robust Defaults",
    yesNext: {
      recommendation: "Gradient Boosted Trees (LightGBM / XGBoost / CatBoost)",
      family: "Gradient Boosting",
      rationale: "Properly tuned boosting algorithms achieve peak accuracy on competitive tabular benchmarks through sequential residual reduction.",
    },
    noNext: {
      recommendation: "Random Forest (Scikit-Learn RandomForestClassifier)",
      family: "Random Forest",
      rationale: "Random Forest provides near-optimal non-linear generalization out of the box with virtually zero hyperparameter sensitivity and zero risk of catastrophic overfitting.",
    },
  },
};

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT: AlgorithmComparisonModule                                  */
/* -------------------------------------------------------------------------- */
export function AlgorithmComparisonModule() {
  const [activeTab, setActiveTab] = useState<"matrix" | "deepdive" | "scenarios" | "decision">("matrix");
  const [selectedAlgoId, setSelectedAlgoId] = useState<string>("random_forest");
  const [selectedCriterionId, setSelectedCriterionId] = useState<string>("all");
  const [activeDecisionStep, setActiveDecisionStep] = useState<string>("start");

  const activeAlgo = algorithmFamilies.find((a) => a.id === selectedAlgoId) || algorithmFamilies[0];
  const currentStep = decisionTree[activeDecisionStep];

  return (
    <div className="space-y-12 pt-8">
      {/* Module Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
        {[
          { id: "matrix", label: "Multi-Criteria Comparison Matrix", icon: Sliders },
          { id: "deepdive", label: "Algorithm Family Deep Dive", icon: BookOpen },
          { id: "scenarios", label: "Practical Selection Guide (9 Scenarios)", icon: Database },
          { id: "decision", label: "Interactive Decision Framework", icon: Compass },
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
      {/* TAB 1: MULTI-CRITERIA COMPARISON MATRIX                              */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "matrix" && (
        <div className="space-y-8">
          <SectionHeading
            index="SECTION 01"
            title="Comprehensive Multi-Algorithm Comparison Matrix"
            desc="Benchmarking Random Forest against 8 major machine learning algorithm families across 10 technical and operational dimensions."
          />

          {/* Assessment Legend */}
          <div className="surface rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-foreground">
              <Info className="size-4 text-primary" /> Evaluation Terminology & Legend
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {(["Excellent", "Good", "Moderate", "Limited", "Poor", "Depends on implementation"] as RatingLevel[]).map((r) => (
                <div key={r} className="flex items-center gap-1.5">
                  <RatingBadge rating={r} />
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              * Note: Assessments evaluate general algorithm-family characteristics. Performance depends on dataset size, sparsity, hardware acceleration, and specific software implementation. Never treat rankings as absolute without empirical validation on your target dataset.
            </p>
          </div>

          {/* Filter Bar for Criteria */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground mr-2">Filter Criterion:</span>
            <button
              onClick={() => setSelectedCriterionId("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCriterionId === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              Show All 10 Criteria
            </button>
            {criteriaList.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCriterionId(c.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedCriterionId === c.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {c.name.split(". ")[1]}
              </button>
            ))}
          </div>

          {/* Comparison Matrix Table */}
          <div className="overflow-x-auto rounded-xl border border-border bg-card/60 shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-sidebar/80">
                  <th className="sticky left-0 z-20 bg-sidebar/95 px-4 py-3.5 font-mono text-xs font-bold text-foreground min-w-[200px] backdrop-blur-sm border-r border-border">
                    Criterion \ Algorithm
                  </th>
                  {algorithmFamilies.map((algo) => {
                    const isRF = algo.id === "random_forest";
                    return (
                      <th
                        key={algo.id}
                        className={`px-4 py-3.5 font-mono text-xs font-bold min-w-[220px] ${
                          isRF ? "bg-primary/10 text-primary border-x border-primary/30" : "text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {isRF && <Sparkles className="size-3.5 text-primary" />}
                          <span>{algo.name}</span>
                        </div>
                        <div className="text-[10px] font-normal text-muted-foreground font-sans mt-0.5">
                          {algo.category}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {criteriaList
                  .filter((crit) => selectedCriterionId === "all" || selectedCriterionId === crit.id)
                  .map((crit) => (
                    <tr key={crit.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="sticky left-0 z-10 bg-background/95 px-4 py-3.5 font-semibold text-foreground backdrop-blur-sm border-r border-border align-top">
                        <div className="font-mono text-xs text-primary">{crit.name}</div>
                        <div className="mt-1 text-[11px] font-normal text-muted-foreground leading-snug">
                          {crit.description}
                        </div>
                      </td>
                      {algorithmFamilies.map((algo) => {
                        const assess = algo.assessments[crit.id];
                        const isRF = algo.id === "random_forest";
                        return (
                          <td
                            key={algo.id}
                            className={`px-4 py-3.5 align-top space-y-2 ${
                              isRF ? "bg-primary/[0.03] border-x border-primary/20" : ""
                            }`}
                          >
                            <RatingBadge rating={assess.rating} />
                            <p className="text-xs text-foreground font-medium leading-relaxed">
                              {assess.summary}
                            </p>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                              {assess.details}
                            </p>
                            <div className="rounded bg-secondary/50 p-2 text-[10px] text-muted-foreground font-mono space-y-1">
                              <div><span className="text-accent font-semibold">Caveat:</span> {assess.caveats}</div>
                              <div><span className="text-success font-semibold">Impact:</span> {assess.practical}</div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 2: ALGORITHM FAMILY DEEP DIVE                                    */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "deepdive" && (
        <div className="space-y-8">
          <SectionHeading
            index="SECTION 02"
            title="Algorithm Family Deep Dive Scorecard"
            desc="Inspect the technical profile, internal mechanisms, advantages, limitations, and practical implications of any algorithm."
          />

          {/* Algorithm Selector Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {algorithmFamilies.map((algo) => {
              const isSelected = algo.id === selectedAlgoId;
              const isRF = algo.id === "random_forest";
              return (
                <button
                  key={algo.id}
                  onClick={() => setSelectedAlgoId(algo.id)}
                  className={`rounded-xl p-3 text-left transition-all border ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                      : "border-border bg-card/60 hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-foreground truncate">
                      {algo.name}
                    </span>
                    {isRF && <Sparkles className="size-3 text-primary shrink-0" />}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 truncate">
                    {algo.category}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Algorithm Profile Card */}
          <div className="surface rounded-xl border border-border p-6 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-foreground">{activeAlgo.name}</h3>
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-mono text-primary">
                    {activeAlgo.category}
                  </span>
                </div>
                <div className="mt-1 font-mono text-xs text-muted-foreground">
                  Common Implementations: {activeAlgo.subtypes}
                </div>
              </div>
              <div className="rounded-lg bg-secondary/60 px-3 py-2 text-xs font-mono text-foreground max-w-md">
                <span className="font-bold text-accent">Ideal Application: </span>
                {activeAlgo.bestFor}
              </div>
            </div>

            {/* Strengths & Weaknesses Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-success/30 bg-success/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-success font-mono uppercase tracking-wider">
                  <CheckCircle2 className="size-4" /> Core Architectural Strengths
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {activeAlgo.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-success mt-0.5">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-destructive font-mono uppercase tracking-wider">
                  <XCircle className="size-4" /> Architectural Limitations & Traps
                </div>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {activeAlgo.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-destructive mt-0.5">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 10 Criteria Breakdown Cards */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Evaluation Across All 10 Technical Dimensions
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                {criteriaList.map((crit) => {
                  const assess = activeAlgo.assessments[crit.id];
                  return (
                    <div key={crit.id} className="surface rounded-xl border border-border p-4 space-y-2">
                      <div className="flex items-center justify-between border-b border-border pb-2">
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {crit.name}
                        </span>
                        <RatingBadge rating={assess.rating} />
                      </div>
                      <p className="text-xs font-medium text-foreground">{assess.summary}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{assess.details}</p>
                      <div className="rounded bg-secondary/40 p-2 text-[10px] text-muted-foreground font-mono space-y-0.5">
                        <div><strong className="text-accent">Caveat:</strong> {assess.caveats}</div>
                        <div><strong className="text-success">Practical:</strong> {assess.practical}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 3: PRACTICAL SELECTION GUIDE (9 SCENARIOS)                       */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "scenarios" && (
        <div className="space-y-8">
          <SectionHeading
            index="SECTION 03"
            title="Practical Algorithm Selection Guide by Scenario"
            desc="Clear, evidence-based recommendations for 9 distinct dataset profiles, latency budgets, and compliance scenarios."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {selectionScenarios.map((scen) => (
              <div key={scen.id} className="surface rounded-xl border border-border p-5 space-y-3.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="font-semibold text-sm text-foreground">{scen.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Scenario: </strong>{scen.scenario}
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                      Primary Recommendation
                    </div>
                    <div className="text-xs font-semibold text-foreground">{scen.recommended}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-accent">Alternative: </span>{scen.alternatives}
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-2 text-xs">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground block">
                      Random Forest Suitability
                    </span>
                    <span className="text-muted-foreground">{scen.rfSuitability}</span>
                  </div>
                  <div className="rounded bg-destructive/5 border border-destructive/20 p-2 text-[11px] text-destructive">
                    <strong>When to Avoid RF: </strong>{scen.whenToAvoidRF}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* TAB 4: INTERACTIVE DECISION FRAMEWORK                                */}
      {/* -------------------------------------------------------------------- */}
      {activeTab === "decision" && (
        <div className="space-y-8">
          <SectionHeading
            index="SECTION 04"
            title="Algorithm Selection Decision Framework"
            desc="Interactive step-by-step decision guide to navigate trade-offs between interpretability, latency, data scale, and predictive capacity."
          />

          <div className="surface mx-auto max-w-2xl rounded-2xl border border-border p-8 space-y-6 shadow-md">
            {/* Step Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="font-mono text-xs uppercase tracking-wider text-primary font-bold">
                Criterion: {currentStep.criterion}
              </span>
              <button
                onClick={() => setActiveDecisionStep("start")}
                className="text-xs font-mono text-muted-foreground hover:text-foreground underline"
              >
                Reset Decision Tree
              </button>
            </div>

            {/* Question Text */}
            <div className="text-center py-4 space-y-3">
              <h3 className="text-lg font-bold text-foreground leading-snug">
                {currentStep.question}
              </h3>
              <p className="text-xs text-muted-foreground">
                Follow your application's technical and operational constraints.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              {/* YES Choice */}
              {typeof currentStep.yesNext === "string" ? (
                <button
                  onClick={() => setActiveDecisionStep(currentStep.yesNext as string)}
                  className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-center font-semibold text-sm text-primary hover:bg-primary/20 transition-all"
                >
                  YES <ArrowRight className="inline size-4 ml-1" />
                </button>
              ) : (
                <div className="rounded-xl border border-success/40 bg-success/10 p-4 text-left space-y-2">
                  <div className="font-mono text-[10px] text-success font-bold uppercase">
                    Outcome (YES)
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {currentStep.yesNext.recommendation}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currentStep.yesNext.rationale}
                  </div>
                </div>
              )}

              {/* NO Choice */}
              {typeof currentStep.noNext === "string" ? (
                <button
                  onClick={() => setActiveDecisionStep(currentStep.noNext as string)}
                  className="rounded-xl border border-border bg-secondary/40 p-4 text-center font-semibold text-sm text-foreground hover:bg-secondary transition-all"
                >
                  NO <ArrowRight className="inline size-4 ml-1" />
                </button>
              ) : (
                <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-left space-y-2">
                  <div className="font-mono text-[10px] text-primary font-bold uppercase">
                    Outcome (NO)
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {currentStep.noNext.recommendation}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currentStep.noNext.rationale}
                  </div>
                </div>
              )}
            </div>

            {/* Practical Warning */}
            <div className="rounded-lg bg-secondary/30 p-3 text-[11px] text-muted-foreground text-center">
              * Remember: A decision tree provides starting heuristics. High-stakes ML projects should always benchmark candidate algorithms using cross-validation on the target distribution.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
