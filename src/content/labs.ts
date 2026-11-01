import { Shuffle, Sparkles, Vote, TrendingUp, Scale, GitFork, type LucideIcon } from "lucide-react";

export interface LabDef {
  id: string;
  title: string;
  shortTitle: string;
  desc: string;
  formula: string;
  formulaName: string;
  icon: LucideIcon;
  tags: string[];
}

export const labs: LabDef[] = [
  {
    id: "bootstrap",
    title: "Bootstrap Sampling Simulator",
    shortTitle: "Bootstrap Sampling",
    desc: "Generate custom datasets, sample with replacement, identify Out-of-Bag (OOB) rows, and empirically verify the 1 - 1/e ≈ 63.2% unique row law.",
    formula: "P(\\text{OOB}) = \\left(1 - \\frac{1}{N}\\right)^N \\xrightarrow{N \\to \\infty} \\frac{1}{e} \\approx 0.368",
    formulaName: "Asymptotic OOB Probability",
    icon: Shuffle,
    tags: ["Sampling", "OOB", "Bagging"],
  },
  {
    id: "feature-selection",
    title: "Random Feature Subspace Explorer",
    shortTitle: "Random Features",
    desc: "Simulate random feature candidate subsets across split nodes with max_features choices (sqrt(p), log2(p), custom m) to explore tree decorrelation.",
    formula: "m = \\lfloor \\sqrt{p} \\rfloor \\quad (\\text{clf}), \\qquad m = \\lfloor p/3 \\rfloor \\quad (\\text{reg})",
    formulaName: "Candidate Feature Subspace Size",
    icon: Sparkles,
    tags: ["Features", "Decorrelation", "Subspaces"],
  },
  {
    id: "voting",
    title: "Classification Voting & Aggregation",
    shortTitle: "Majority Voting",
    desc: "Configure an ensemble of B trees with class probability distributions. Compare Hard Voting (plurality) vs Soft Voting (probability averaging) and threshold adjustments.",
    formula: "\\hat{y}_{\\text{hard}} = \\operatorname{mode}\\{T_b(x)\\}, \\qquad P(y=c \\mid x) = \\frac{1}{B} \\sum_{b=1}^B P_b(y=c \\mid x)",
    formulaName: "Hard & Soft Voting Rules",
    icon: Vote,
    tags: ["Classification", "Voting", "Probabilities"],
  },
  {
    id: "regression",
    title: "Regression Aggregation & Smoothing",
    shortTitle: "Regression Aggregation",
    desc: "Simulate noisy continuous target functions, adjust tree counts B and tree variance σ², compute the ensemble mean and standard error, and observe noise reduction.",
    formula: "\\hat{y} = \\frac{1}{B} \\sum_{b=1}^B T_b(x), \\qquad \\operatorname{SE}(\\hat{y}) = \\frac{\\sigma}{\\sqrt{B}}",
    formulaName: "Ensemble Mean & Standard Error",
    icon: TrendingUp,
    tags: ["Regression", "Continuous", "Variance Reduction"],
  },
  {
    id: "bias-variance",
    title: "Bias-Variance Tradeoff Explorer",
    shortTitle: "Bias-Variance",
    desc: "Explore theoretical error decomposition by varying individual tree depth, forest size B, and pairwise tree correlation ρ. Calculate ensemble variance and total expected error.",
    formula: "\\operatorname{Var}(\\bar{f}) = \\rho \\sigma^2 + \\frac{1 - \\rho}{B} \\sigma^2",
    formulaName: "Breiman-Hastie Ensemble Variance Formula",
    icon: Scale,
    tags: ["Theory", "Bias-Variance", "Correlation"],
  },
  {
    id: "tree-splitting",
    title: "Decision Tree Splitting & Impurity Lab",
    shortTitle: "Impurity & Splitting",
    desc: "Evaluate 2D classification points, test different feature thresholds, and calculate parent/child Gini Impurity, Shannon Entropy, and Information Gain in real time.",
    formula: "\\operatorname{IG}(S, A) = H(S) - \\sum_{v \\in \\text{children}} \\frac{|S_v|}{|S|} H(S_v)",
    formulaName: "Information Gain Criterion",
    icon: GitFork,
    tags: ["CART", "Gini", "Entropy", "Splitting"],
  },
];
