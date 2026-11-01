export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Formula {
  label: string;
  expr: string;
  note?: string;
}

export interface Lesson {
  slug: string;
  module: string;
  section: string;
  title: string;
  intro: string;
  readTime: string;
  difficulty: Difficulty;
  formulas: Formula[];
  code: string;
  application: string;
  mistakes: string[];
  takeaways: string[];
  question: { prompt: string; options: string[] };
}

const defaultCode = `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build a forest of 100 trees
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

print("Accuracy:", model.score(X_test, y_test))`;

const base = {
  mistakes: [
    "Assuming more trees always fix a poorly prepared dataset.",
    "Evaluating on training data instead of a held-out set.",
    "Ignoring class imbalance when reading accuracy.",
  ],
  takeaways: [
    "Many weak, decorrelated learners combine into a strong one.",
    "Randomness in rows and features is what reduces variance.",
    "Aggregation turns individual errors into averaged noise.",
  ],
  code: defaultCode,
};

const giniEntropy: Formula[] = [
  { label: "Gini Impurity", expr: "Gini(S) = 1 − Σ pᵢ²", note: "pᵢ is the proportion of class i in node S" },
  { label: "Entropy", expr: "H(S) = − Σ pᵢ · log₂(pᵢ)" },
  { label: "Information Gain", expr: "IG = H(parent) − Σ (|Sₖ| / |S|) · H(Sₖ)" },
];

const make = (l: Omit<Lesson, keyof typeof base> & Partial<typeof base>): Lesson => ({ ...base, ...l });

export const lessons: Record<string, Lesson> = Object.fromEntries(
  [
    make({ slug: "ensemble-learning", module: "01", section: "Fundamentals", title: "Ensemble Learning", intro: "Why a committee of models often beats a single expert, and the core ideas behind combining predictions.", readTime: "12 min", difficulty: "Beginner",
      formulas: [{ label: "Ensemble Prediction", expr: "ŷ = (1 / B) · Σ_{b=1}^{B} f_b(x)" }, { label: "Majority Vote", expr: "ŷ = mode{ f₁(x), f₂(x), …, f_B(x) }" }],
      application: "Credit scoring systems combine many models to reduce the risk of any single model's blind spots.",
      question: { prompt: "Why does averaging many models usually reduce error?", options: ["It reduces variance", "It increases bias", "It removes all noise", "It shrinks the dataset"] } }),
    make({ slug: "decision-trees", module: "02", section: "Fundamentals", title: "Decision Trees", intro: "How recursive splitting turns a dataset into a set of human-readable decision rules.", readTime: "18 min", difficulty: "Beginner",
      formulas: giniEntropy,
      application: "Medical triage flowcharts are essentially hand-built decision trees.",
      question: { prompt: "Which value of Gini impurity represents a perfectly pure node?", options: ["0", "0.5", "1", "log₂(2)"] } }),
    make({ slug: "random-forest", module: "03", section: "Fundamentals", title: "Random Forest Architecture", intro: "The full pipeline: bootstrap samples, random feature subsets, independent trees and aggregation.", readTime: "20 min", difficulty: "Intermediate",
      formulas: [{ label: "Forest Prediction (Regression)", expr: "f̂(x) = (1 / B) · Σ_{b=1}^{B} T_b(x)" }, { label: "Features per Split", expr: "m ≈ √p   (classification)" }],
      application: "Fraud detection pipelines use forests to score millions of transactions per day.",
      question: { prompt: "What does max_features control?", options: ["Features considered per split", "Number of trees", "Tree depth", "Sample size"] } }),
    make({ slug: "bootstrap-sampling", module: "04", section: "Fundamentals", title: "Bootstrap Sampling", intro: "Sampling with replacement creates diverse training sets from a single dataset.", readTime: "14 min", difficulty: "Intermediate",
      formulas: [{ label: "Probability a row is never chosen", expr: "P = (1 − 1/n)ⁿ → e⁻¹ ≈ 0.368" }, { label: "Expected unique rows", expr: "E[unique] ≈ 0.632 · n" }],
      application: "Bootstrap confidence intervals are standard in A/B test analysis.",
      question: { prompt: "Roughly what fraction of rows appear in a bootstrap sample?", options: ["63.2%", "50%", "36.8%", "100%"] } }),
    make({ slug: "bagging", module: "05", section: "Fundamentals", title: "Bagging", intro: "Bootstrap aggregating: train on resampled data, then combine. The foundation Random Forest builds on.", readTime: "12 min", difficulty: "Intermediate",
      formulas: [{ label: "Bagged Estimator", expr: "f̂_bag(x) = (1 / B) · Σ_{b=1}^{B} f̂*ᵇ(x)" }],
      application: "Bagged models stabilise forecasts in demand planning.",
      question: { prompt: "Bagging mainly helps which kind of model?", options: ["High-variance models", "High-bias models", "Linear models only", "Clustering models"] } }),
    make({ slug: "classification", module: "06", section: "Core Concepts", title: "Classification", intro: "Predicting discrete labels with majority voting across trees.", readTime: "15 min", difficulty: "Intermediate",
      formulas: [{ label: "Class Probability", expr: "P(c | x) = (1 / B) · Σ 𝟙[T_b(x) = c]" }, giniEntropy[0]!],
      application: "Email providers classify spam using ensembles of tree models.",
      question: { prompt: "How does a classification forest combine tree outputs?", options: ["Majority vote", "Median", "Product", "Maximum depth"] } }),
    make({ slug: "regression", module: "07", section: "Core Concepts", title: "Regression", intro: "Predicting continuous values by averaging leaf means across trees.", readTime: "15 min", difficulty: "Intermediate",
      formulas: [{ label: "Mean Squared Error", expr: "MSE = (1 / n) · Σ (yᵢ − ŷᵢ)²" }, { label: "Variance Reduction", expr: "ΔVar = Var(S) − Σ (|Sₖ| / |S|) · Var(Sₖ)" }],
      application: "Real-estate platforms estimate house prices with forest regressors.",
      question: { prompt: "Which split criterion is typical for regression trees?", options: ["Variance reduction", "Gini impurity", "Entropy", "Accuracy"] } }),
    make({ slug: "bias-variance", module: "08", section: "Core Concepts", title: "Bias-Variance Tradeoff", intro: "Decomposing error to understand why forests generalise so well.", readTime: "16 min", difficulty: "Advanced",
      formulas: [{ label: "Error Decomposition", expr: "E[(y − f̂)²] = Bias² + Variance + σ²" }, { label: "Ensemble Variance", expr: "Var = ρσ² + ((1 − ρ) / B) · σ²" }],
      application: "Model selection in any production ML system relies on this tradeoff.",
      question: { prompt: "Decorrelating trees (lower ρ) primarily reduces…", options: ["Variance", "Bias", "Irreducible error", "Training time"] } }),
    make({ slug: "hyperparameters", module: "09", section: "Advanced Concepts", title: "Hyperparameters", intro: "The knobs that shape a forest: n_estimators, max_depth, max_features and more.", readTime: "14 min", difficulty: "Intermediate",
      formulas: [{ label: "Default max_features", expr: "m = ⌊√p⌋ (clf)   ·   m = p (reg)" }],
      application: "Tuning depth and leaf size keeps latency low in real-time scoring.",
      question: { prompt: "Increasing n_estimators generally…", options: ["Stabilises predictions", "Increases overfitting sharply", "Reduces training time", "Changes the target"] } }),
    make({ slug: "oob-estimation", module: "10", section: "Advanced Concepts", title: "Out-of-Bag Estimation", intro: "A free validation set: each tree is evaluated on the ~36.8% of rows it never saw.", readTime: "10 min", difficulty: "Advanced",
      formulas: [{ label: "OOB Error", expr: "OOB = (1 / n) · Σ L(yᵢ, f̂_oob(xᵢ))" }],
      application: "OOB scores let teams skip expensive cross-validation on large datasets.",
      question: { prompt: "OOB error uses which rows to evaluate each tree?", options: ["Rows not in its bootstrap sample", "All training rows", "Test rows only", "Random noise"] } }),
    make({ slug: "feature-importance", module: "11", section: "Advanced Concepts", title: "Feature Importance", intro: "Mean decrease in impurity vs. permutation importance, and when each misleads.", readTime: "13 min", difficulty: "Advanced",
      formulas: [{ label: "Mean Decrease Impurity", expr: "MDI(j) = (1 / B) · Σ_b Σ_{t ∈ T_b : v(t)=j} p(t) · Δi(t)" }],
      application: "Churn analysis teams use importance to explain which behaviours drive cancellations.",
      question: { prompt: "MDI tends to be biased toward…", options: ["High-cardinality features", "Binary features", "Target variable", "Missing values"] } }),
    make({ slug: "imbalanced-data", module: "12", section: "Advanced Concepts", title: "Imbalanced Data", intro: "Class weights, balanced bootstraps and the right metrics for rare events.", readTime: "12 min", difficulty: "Advanced",
      formulas: [{ label: "Balanced Class Weight", expr: "w_c = n / (k · n_c)" }, { label: "F1 Score", expr: "F1 = 2 · (P · R) / (P + R)" }],
      application: "Rare-disease screening must favour recall over raw accuracy.",
      question: { prompt: "Which metric is most misleading on a 99/1 imbalanced dataset?", options: ["Accuracy", "Recall", "F1", "PR-AUC"] } }),
    make({ slug: "hyperparameter-optimization", module: "13", section: "Advanced Concepts", title: "Hyperparameter Optimization", intro: "Grid search, random search and Bayesian strategies for tuning forests.", readTime: "15 min", difficulty: "Advanced",
      formulas: [{ label: "Objective", expr: "θ* = argmin_θ  CV_error(θ)" }],
      application: "AutoML systems automate this search across thousands of configurations.",
      question: { prompt: "Random search often beats grid search because…", options: ["It explores important dimensions better", "It is deterministic", "It uses fewer features", "It never overfits"] } }),
    make({ slug: "classification-project", module: "P1", section: "Practical Learning", title: "Classification Project", intro: "End-to-end: predict breast cancer diagnosis from cell measurements.", readTime: "35 min", difficulty: "Intermediate",
      formulas: [{ label: "Accuracy", expr: "Acc = (TP + TN) / (TP + TN + FP + FN)" }],
      application: "Diagnostic support tools flag suspicious samples for specialist review.",
      question: { prompt: "Which metric best captures missed positive diagnoses?", options: ["Recall", "Precision", "Accuracy", "R²"] } }),
    make({ slug: "regression-project", module: "P2", section: "Practical Learning", title: "Regression Project", intro: "End-to-end: predict California housing prices from census features.", readTime: "35 min", difficulty: "Intermediate",
      formulas: [{ label: "Coefficient of Determination", expr: "R² = 1 − Σ(yᵢ − ŷᵢ)² / Σ(yᵢ − ȳ)²" }],
      application: "Property valuation services price listings in real time.",
      question: { prompt: "An R² of 1.0 means…", options: ["Perfect fit", "No fit", "Overfitting guaranteed", "Negative correlation"] } }),
    make({ slug: "algorithm-comparison", module: "14", section: "Practical Learning", title: "Algorithm Comparison", intro: "Random Forest vs. single trees, gradient boosting, logistic regression and SVMs.", readTime: "14 min", difficulty: "Intermediate",
      formulas: [{ label: "Boosting (contrast)", expr: "F_m(x) = F_{m−1}(x) + η · h_m(x)" }],
      application: "Choosing the right baseline saves weeks in applied ML projects.",
      question: { prompt: "Unlike boosting, Random Forest trees are trained…", options: ["Independently, in parallel", "Sequentially", "On residuals", "Without data"] } }),
    make({ slug: "applications", module: "15", section: "Practical Learning", title: "Real-World Applications", intro: "Where Random Forest shines in finance, healthcare, ecology and industry.", readTime: "10 min", difficulty: "Beginner",
      formulas: [{ label: "Expected Cost", expr: "E[cost] = C_FP · FP + C_FN · FN" }],
      application: "Remote sensing teams classify land cover from satellite imagery with forests.",
      question: { prompt: "Random Forest is a strong default for…", options: ["Tabular data", "Raw audio waveforms", "Image generation", "Language modelling"] } }),
  ].map((l) => [l.slug, l]),
);

export const roadmap = [
  { n: "01", title: "Foundations", desc: "Ensembles, wisdom of crowds and why combining models works.", time: "45 min", status: "Available" },
  { n: "02", title: "Decision Trees", desc: "Splitting criteria, impurity measures and tree growth.", time: "1 h 10 min", status: "Available" },
  { n: "03", title: "Random Forest Architecture", desc: "Bootstrap, feature subsampling and aggregation.", time: "1 h", status: "Available" },
  { n: "04", title: "Mathematical Foundations", desc: "Probability, variance and the bias-variance decomposition.", time: "1 h 30 min", status: "In progress" },
  { n: "05", title: "Classification & Regression", desc: "Voting, averaging and evaluation metrics.", time: "1 h", status: "In progress" },
  { n: "06", title: "Advanced Techniques", desc: "OOB, importance, imbalance and tuning.", time: "1 h 20 min", status: "Planned" },
  { n: "07", title: "Python Implementation", desc: "scikit-learn workflows from data to deployment.", time: "2 h", status: "Planned" },
  { n: "08", title: "Real-World Applications", desc: "Case studies across industries.", time: "40 min", status: "Planned" },
] as const;

export const featuredModules = [
  { n: "01", title: "Understanding Ensemble Learning", desc: "How committees of models outperform individual learners.", topics: 4, time: "45 min", to: "/ensemble-learning" },
  { n: "02", title: "Decision Trees from Scratch", desc: "Recursive partitioning, Gini, entropy and information gain.", topics: 6, time: "1 h 10 min", to: "/decision-trees" },
  { n: "03", title: "How Random Forest Works", desc: "Bootstrap samples, random subspaces and aggregation.", topics: 5, time: "1 h", to: "/random-forest" },
  { n: "04", title: "Mathematical Foundations", desc: "Probability, expectation, variance and ensemble theory.", topics: 10, time: "1 h 30 min", to: "/mathematical-deep-dive" },
  { n: "05", title: "Classification & Regression", desc: "Majority voting, averaging and evaluation.", topics: 6, time: "1 h", to: "/classification" },
  { n: "06", title: "Advanced Random Forest Techniques", desc: "OOB error, feature importance, imbalance and tuning.", topics: 4, time: "1 h 20 min", to: "/advanced-techniques" },
] as const;
